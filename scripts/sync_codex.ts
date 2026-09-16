import Fs from 'node:fs';
import Os from 'node:os';
import Path from 'node:path';

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	SyncCodex — copies and checks the repository-managed Codex configuration
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/** The supported synchronization operations. */
type Command = 'copy' | 'check';

/** A file whose contents differ between the source and user configuration. */
type Mismatch = {
	/** The path relative to the `.codex` directory. */
	relativePath: string;
	/** The reason the file does not match. */
	reason: 'missing' | 'different';
};

class SyncCodex {
	/**
	 * Runs the requested synchronization operation.
	 *
	 * @returns A promise that resolves once the operation has completed.
	 */
	static async run(): Promise<void> {
		const command = process.argv[2];

		if (this._isCommand(command) === false) {
			console.error('Usage: tsx scripts/sync_codex.ts <copy|check>');
			process.exitCode = 1;
			return;
		}

		const sourceDirectoryPath = Path.resolve(__dirname, '..', '.codex');
		const userDirectoryPath = Path.join(Os.homedir(), '.codex');
		const relativeFilePaths = await this._getRelativeFilePaths(sourceDirectoryPath);

		if (command === 'copy') {
			await this._copyFiles(sourceDirectoryPath, userDirectoryPath, relativeFilePaths);
			console.log(`Copied ${relativeFilePaths.length} repository-managed files to ${userDirectoryPath}.`);
			return;
		}

		const mismatches = await this._getMismatches(
			sourceDirectoryPath,
			userDirectoryPath,
			relativeFilePaths,
		);

		if (mismatches.length === 0) {
			console.log(`All ${relativeFilePaths.length} repository-managed files match ${userDirectoryPath}.`);
			return;
		}

		console.error(`Found ${mismatches.length} repository-managed file mismatch(es):`);

		for (const mismatch of mismatches) {
			console.error(`${mismatch.reason}: ${mismatch.relativePath}`);
		}

		process.exitCode = 1;
	}

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	Helpers
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////

	/**
	 * Copies the repository-managed files into the user Codex configuration.
	 *
	 * @param sourceDirectoryPath The repository `.codex` directory.
	 * @param userDirectoryPath The user `.codex` directory.
	 * @param relativeFilePaths The source file paths relative to the source directory.
	 * @returns A promise that resolves after every file has been copied.
	 */
	private static async _copyFiles(
		sourceDirectoryPath: string,
		userDirectoryPath: string,
		relativeFilePaths: string[],
	): Promise<void> {
		for (const relativeFilePath of relativeFilePaths) {
			const sourceFilePath = Path.join(sourceDirectoryPath, relativeFilePath);
			const userFilePath = Path.join(userDirectoryPath, relativeFilePath);
			const sourceFileStats = await Fs.promises.stat(sourceFilePath);

			await Fs.promises.mkdir(Path.dirname(userFilePath), {
				recursive: true,
			});
			await Fs.promises.copyFile(sourceFilePath, userFilePath);
			await Fs.promises.chmod(userFilePath, sourceFileStats.mode);
		}
	}

	/**
	 * Returns every regular file beneath a directory in stable path order.
	 *
	 * @param directoryPath The directory to scan.
	 * @param relativeDirectoryPath The path from the initial scan directory.
	 * @returns A promise that resolves to file paths relative to the initial scan directory.
	 */
	private static async _getRelativeFilePaths(
		directoryPath: string,
		relativeDirectoryPath = '',
	): Promise<string[]> {
		const directoryEntries = await Fs.promises.readdir(directoryPath, {
			withFileTypes: true,
		});
		const relativeFilePaths: string[] = [];

		const sortedDirectoryEntries = directoryEntries.sort((left, right) => {
			return left.name.localeCompare(right.name);
		});

		for (const directoryEntry of sortedDirectoryEntries) {
			const relativePath = Path.join(relativeDirectoryPath, directoryEntry.name);
			const entryPath = Path.join(directoryPath, directoryEntry.name);

			if (directoryEntry.isDirectory()) {
				const childFilePaths = await this._getRelativeFilePaths(entryPath, relativePath);
				relativeFilePaths.push(...childFilePaths);
				continue;
			}

			if (directoryEntry.isFile()) {
				relativeFilePaths.push(relativePath);
				continue;
			}

			throw new Error(`Only regular files and directories are supported: ${entryPath}`);
		}

		return relativeFilePaths;
	}

	/**
	 * Returns source files that are missing or different in the user configuration.
	 *
	 * @param sourceDirectoryPath The repository `.codex` directory.
	 * @param userDirectoryPath The user `.codex` directory.
	 * @param relativeFilePaths The source file paths relative to the source directory.
	 * @returns A promise that resolves to all detected mismatches.
	 */
	private static async _getMismatches(
		sourceDirectoryPath: string,
		userDirectoryPath: string,
		relativeFilePaths: string[],
	): Promise<Mismatch[]> {
		const mismatches: Mismatch[] = [];

		for (const relativeFilePath of relativeFilePaths) {
			const sourceFilePath = Path.join(sourceDirectoryPath, relativeFilePath);
			const userFilePath = Path.join(userDirectoryPath, relativeFilePath);

			try {
				const [sourceContent, userContent] = await Promise.all([
					Fs.promises.readFile(sourceFilePath),
					Fs.promises.readFile(userFilePath),
				]);

				if (sourceContent.equals(userContent) === false) {
					mismatches.push({
						relativePath: relativeFilePath,
						reason: 'different',
					});
				}
			} catch (error: unknown) {
				if (this._isNotFoundError(error)) {
					mismatches.push({
						relativePath: relativeFilePath,
						reason: 'missing',
					});
					continue;
				}

				throw error;
			}
		}

		return mismatches;
	}

	/**
	 * Determines whether a file-system operation failed because the path does not exist.
	 *
	 * @param error The value thrown by a file-system operation.
	 * @returns Whether the error represents a missing path.
	 */
	private static _isNotFoundError(error: unknown): boolean {
		return error instanceof Error && 'code' in error && error.code === 'ENOENT';
	}

	/**
	 * Determines whether a command line value names a supported operation.
	 *
	 * @param command The command line value to validate.
	 * @returns Whether the command is a supported operation.
	 */
	private static _isCommand(command: string | undefined): command is Command {
		return command === 'copy' || command === 'check';
	}
}

await SyncCodex.run();
