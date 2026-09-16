# dotcodex

Version-controlled configuration for [Codex](https://openai.com/codex/). The
repository keeps reusable instructions and skills separate from individual
projects, so they can be reviewed and shared like any other source file.

## Contents

```text
.codex/
├── AGENTS.md
└── skills/
    ├── context-md-management/
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/context-md-management.md
    └── typescript-javascript-style/
        ├── SKILL.md
        ├── agents/openai.yaml
        └── references/typescript-javascript-style.md
scripts/
└── sync_codex.ts
```

### `AGENTS.md`

Shared working rules for Codex. The instructions require clear international
English, a small live feasibility check before building on an unproven external
dependency, and specific conventions for TypeScript, Git commits, pull requests,
and GitHub issues.

### `context-md-management`

A skill for creating, editing, or reviewing `CONTEXT.md` files and for creating
source-code directories. Its reference document defines the project's
hierarchical context-file rules.

### `typescript-javascript-style`

A skill to apply the project's TypeScript and JavaScript style when working in
`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, or `.cjs` files.

## Use

Install the development dependencies after cloning the repository:

```sh
git clone https://github.com/jeromeetienne/dotcodex.git
cd dotcodex
npm install
```

Copy the repository-managed Codex configuration files to the user Codex
configuration directory:

```sh
npm run codex:copy
```

The copy command changes only files present in this repository's `.codex`
directory. User-specific Codex configuration, session data, and credentials
remain untouched.

Check that every repository-managed file matches the corresponding user Codex
configuration file:

```sh
npm run codex:check
```

The check command permits extra user-specific files in the user Codex
configuration directory. Run the TypeScript type check before committing a
change to the synchronization program:

```sh
npm run typecheck
```

Keep this repository as the source of truth for the shared configuration and
commit changes here.

## Maintaining skills

Each skill lives in `.codex/skills/<skill-name>/`. Keep its `SKILL.md` focused:
state when the skill applies, give the required procedure, and place longer
guidance in a referenced file when needed. Update the corresponding instruction
file whenever a skill's scope or required workflow changes.

There is no build step or automated test suite in this repository. Run `npm run
typecheck` after changing the synchronization program. Review changed Markdown
and confirm that every file and relative reference named by a skill exists
before committing.

## License

No license has been specified for this repository.
