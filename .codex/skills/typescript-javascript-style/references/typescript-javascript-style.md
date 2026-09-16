# TypeScript and JavaScript Coding Style Rules

## Conditionals

- Never use `!varName` in if conditions. Always use explicit checks: `=== null`, `=== undefined`, `=== false`, `!== null`, `!== undefined`, and similar checks.

## Control Flow Statements

- Every `if`, `else`, `for`, `for...in`, `for...of`, `while`, and `do...while` must always use braces `{}` around its body, even for a single statement. Never write the body on the same line as the statement, and never omit the braces.
  - Bad example: `if (build.code !== 0) throw new Error(...);`
  - Bad example: `for (const childProcess of this.children) this._stop(childProcess);`
  - Bad example: `while (queue.length > 0) queue.pop();`
  - Good example:

```ts
if (build.code !== 0) {
	throw new Error(...);
}

for (const childProcess of this.children) {
	this._stop(childProcess);
}

while (queue.length > 0) {
	queue.pop();
}
```

## TypeScript

- Prefer `type` aliases and Zod schemas for data shapes.
- Use `async/await` over raw Promises.
- Avoid `any`; prefer `unknown` when the type is genuinely unknown.
- Use named exports only; do not use default exports.
- In an ECMAScript module that needs the current file's or directory's path, always name the variables `__filename` and `__dirname`, matching the CommonJS globals they replace.
  - Prefer the built-in, import-free form in Node.js 20.11 or later:

```ts
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
```

  - Only when targeting an older Node.js runtime, fall back to deriving the variables with `node:path` and `node:url`:

```ts
import Path from 'node:path';
import Url from 'node:url';

const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
```

  Place these two lines near the top of the file, right after the imports, even if only `__dirname` is needed.

## Documentation

- Use JSDoc to document code in TypeScript and JavaScript.
- Add a JSDoc comment to every exported type, interface, and class.
- When documenting a function with JSDoc, always include `@param` for every parameter and `@returns` for the return type.
- Document every field of a class with JSDoc, not only the class itself.
- Document every TypeScript type with JSDoc, including each field within the TypeScript type.
- Wrap JSDoc comment lines so no JSDoc comment line exceeds 120 characters.

## Naming

- Use `camelCase` for variables and functions.
- Use `PascalCase` for classes, interfaces, and type aliases.
- Use `snake_case` for file names.
- Use `UPPER_SNAKE_CASE` for true constants.
- Use PascalCase namespace-style import bindings.
  - Value imports get a capitalized name: `import Fs from 'node:fs'`, `import Path from 'node:path'`, `import Chalk from 'chalk'`.
  - Import Node.js built-in modules as the whole module, never individual named functions:
    - Bad: `import { spawn } from 'node:child_process';`
    - Good: `import ChildProcess from 'node:child_process';` then call `ChildProcess.spawn(...)`.
- Boolean names have the `is` predicate prefix: `isAuthenticated`, `isJson`, and the `jsonMode` flag.
- Private helpers in a class have a leading underscore: `_pathExists`, `_getUserConfig`, `_parseJson`, and similar names.

### Naming Suffix Patterns

- Use `Fn` for function-valued things: type `AxTreeTestFn`, variable `testFn`.
- Use `Str` when a string form sits next to its parsed form: `indentStr` and `indent`.
- Prefer a variable name that is the camelCase form of the type name:
  - Variable assignment: `let blueskyClient = new BlueskyClient(...)`.
  - Function parameter: `function doSomething(blueskyClient: BlueskyClient) { ... }`.
  - Function return type: `function getBlueskyClient(): BlueskyClient { ... }`.
  - Function parameter destructuring: `function doSomething({ blueskyClient }: { blueskyClient: BlueskyClient }) { ... }`.
  - A variable holding an instance of a class must be named after the camelCase form of the class name, not a shortened or unrelated word:
    - Bad: `let child: ChildProcess`.
    - Good: `let childProcess: ChildProcess`.
- Drop leading qualifiers to the bare head noun when unambiguous in scope: `const client = new BlueskyClient(...)`, `const engine = new FastbrowserEngine(...)`, and `const params = new UrlSearchParams()`.
- Add the minimum qualifier back only to disambiguate, keeping at most two words: the head noun and its most distinguishing qualifier.
  - `const rssParser = new Parser(...)` when a plain `parser` would be unclear.
  - `const sessionManager = new LocalSessionManager()` drops `Local`.
  - `const mcpClient = new McpMyClient(...)` sits next to other clients.

## Formatting

- Indent `.ts`, `.js`, `.tsx`, and `.jsx` files with tab characters, not spaces, set to a width of 8.
- Use single quotes for strings.
- Use trailing commas in multi-line structures.
- Use semicolons.
- Never write object literals on a single line, even with one property. Put each property on its own line and add a trailing comma after the last property.
- Lines should not exceed 120 characters.

## Building HTML

Build HTML in one template literal marked with an inline `/* html */` comment. Do not add strings together with `+`.

- Write `/* html */` between the `=` and the opening backquote, with no space before the backquote.
- Indent the markup as normal HTML: one element per line and children one level deeper than the parent element.
- Put every value from JavaScript or TypeScript inside `${...}`, including markup returned by another function.
- Assign the template literal to a variable whose name ends in `HtmlContent`, and return the variable on the next line.
- Escape every person-supplied value before the value reaches `${...}`.

```ts
const htmlContent = /* html */`
    <div class="dropdown">
      <button class="btn btn-link" type="button">
        <span>${fullName}</span>
      </button>
    </div>
  `;
return htmlContent;
```

## Code Organization

- All exported functions in a module must live in a static class named after the file, converting snake_case to PascalCase. For example, `ai_client.ts` becomes `class AiClient { static … }`. Classes with internal state use instance methods.
- Do not write standalone functions in a `.ts` or `.js` file. Every function belongs inside a class, including private helpers that are not exported.
- Within a class, put private methods after public methods.
- Prefer early returns to deeply nested conditions.
- Do not add unnecessary comments.
- If a source file is longer than 600 lines, consider splitting the source file into smaller files:
  - By layer: move type aliases and Zod schemas to a dedicated `*_types.ts` file, and isolate network or filesystem input and output from pure logic.
  - By responsibility: if a subset of code forms a distinct concern, such as parsing, validation, formatting, or internal helpers, extract the subset into a file with its own static class.
- When a `./src` folder, or a subfolder such as `./src/libs`, has grown large enough that file names cannot be recalled or contains two or more distinct domains, split the folder into subfolders by responsibility:
  - Read the existing file names first and group files that share a naming prefix or obvious domain. Do not invent a generic bucket such as `misc/` or `utils/`.
  - Each subfolder needs at least two files. A lone file stays at the parent level.
  - Name each subfolder after the shared domain in `snake_case`, for example `libs/connection/`, `libs/registry/`, or `libs/scheduling/`.
  - Do not add an `index.ts` file that only re-exports another file in a new subfolder. Import directly from the specific file.
- A package is the exception: every package has a single `src/index.ts` that names everything the package offers outside the package, and the `package.json` has a single `".": "./src/index.ts"` entry under `exports`. Do not write a list of separate files under `exports`.

## Section Separators

- Mark a section boundary with a four-line block: two lines of exactly 79 `/` characters, a title line, then two more lines of exactly 79 `/` characters. Leave one blank line before and after the block.
- The title line is `//` followed by a tab and the title text, with no trailing punctuation.
- Use the block in two places:
  - **File header:** once, immediately after the imports, naming the file's single responsibility: `ClassName — one-line description`.
  - **Internal divider:** inside a file, separating logical parts such as types, groups of related functions, or distinct concerns. Use a short Title Case label such as `Types`, `Helpers`, or `Post Commands`.

```ts
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	WriteThrottlePaths — resolves where the on-disk ledger lives
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class WriteThrottlePaths {
	// ...

	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	//	Helpers
	///////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	function emitResult(value: unknown): void {
		// ...
	}
}
```

```ts
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Types
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

type SourceResult = {
	// ...
};
```

## Loose JavaScript and MJS Scripts

- Standalone `.js` and `.mjs` scripts with no local TypeScript configuration or JavaScript configuration, such as a repository-root `scripts/` tool, receive full type checking from Visual Studio Code's implicit project configuration.
  - Add JSDoc type annotations for object literals used as dynamically keyed maps or records, for example `/** @type {Record<string, T>} */`, otherwise indexing with a computed string key is reported as implicit `any`.
  - Ensure `@types/node` is resolvable by walking up `node_modules/@types` from the file's location. Otherwise, `node:fs`, `node:path`, and similar imports, plus globals such as `process`, are unresolvable. For a repository-root script, add `@types/node` as a root-level development dependency.
