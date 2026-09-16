# CONTEXT.md Management Rules

This repository uses scoped `CONTEXT.md` files in folders across the codebase to define localized boundaries, patterns, and expectations.

## Reading and Respecting Context

1. Before editing or adding files in any subdirectory, check for a `CONTEXT.md` file in that specific directory or its parent directories.
2. Specific rules defined in a sub-folder's `CONTEXT.md` override or narrow root-level guidelines for files within that scope.
3. Strictly follow the local dependency and export rules declared in the nearest `CONTEXT.md`, such as public exports and restricted imports between feature directories.

## Creating and Updating CONTEXT.md Files

1. When creating a directory intended to hold source code or components, automatically create a concise `CONTEXT.md` inside the directory using the folder context template below.
2. If introducing new core files, refactoring exported interfaces, or altering directory responsibilities, update the corresponding local `CONTEXT.md` to keep the context accurate.
3. A `CONTEXT.md` belongs in every source folder that holds a distinct responsibility, not only in the folder at the top of a package or module. When a folder has subfolders that each have their own `CONTEXT.md`, the parent file names each subfolder on one line and says what that subfolder is for, instead of naming the files inside the subfolders.

## Keeping Each CONTEXT.md Short

1. Each `CONTEXT.md` must stay under 5,500 bytes. When a `CONTEXT.md` goes above 5,500 bytes, shrink the `CONTEXT.md` down to 4,500 bytes. Do not cap a `CONTEXT.md` by a number of lines.
2. A rule is one sentence in the present tense saying what must hold now. History stays in the issue tracker, and a rule keeps only a bare link to that history. A `CONTEXT.md` is never a changelog.
3. When a fact already lives somewhere else, link to that place instead of copying the fact. One fact has one authoritative place.

## Required Sections

1. **Purpose:** One or two sentences saying what the folder is responsible for.
2. **Key Exports & Entry Points:** What another folder or package may import from the folder, and the one command that runs the folder if there is one. List individual files only when the folder has no public interface.
3. **Rules:** What must not be broken. Prefer rules that name a boundary, such as which folder must not import another folder or which shape must not be restated.
4. **Background:** The reasons and links behind the rules above, when a reason is too long to sit inside the rule itself.

## Verification

When a repository has enough `CONTEXT.md` files that reading them all by hand is no longer practical, add a test that checks every package or workspace has a `CONTEXT.md`, the folder path in each heading equals the containing folder, the required sections are present and ordered, and the byte cap holds. Do not check whether Markdown link targets or named paths exist on disk.

## Folder Context Template

```markdown
# Directory Context: `/<relative-path>`

## Purpose
[One to two sentences describing what this folder handles]

## Key Exports & Entry Points
- `index.ts`: Main public interface for this module.
- `[subfolder]/`: [What that subfolder is for — see its own CONTEXT.md]
- Command to run this folder: `[command]`

## Rules
- Nothing here imports from [restricted-module].
- [Any specific local coding convention, one sentence, present tense]

## Background
- [Rule above] comes from [link to the issue or the document that proved it].
```
