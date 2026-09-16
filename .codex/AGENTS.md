# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code.

## Language

Write in plain international English. Do not use jargon, slang, idioms, or invented nicknames for things, including internal names for on-screen elements, tools, or concepts.

- Describe things in ordinary words, not by an internal or technical name. For example, do not call an on-screen clickable suggestion a "chip" — say "a small clickable suggestion on the screen".
- If a precise technical term is genuinely needed, spell it out in full and explain it in plain words the first time it is used. Do not use abbreviations.
- Do not drop the noun and lean on words like "it", "that", or "this one" to refer back to something named earlier — repeat the noun.
- Prefer the plainest sentence that still says the whole thing over a clever or economical one.
- Once something has an established name — in the source code, in the project, or earlier in the conversation — use that exact name every time. Do not shorten a multi-word name down to one word, and do not swap in a different word that means roughly the same thing. If it is called "Foo Bar Blee" everywhere, call it "Foo Bar Blee" every time, not "Blee" and not a synonym for it.

See [issue #395](https://github.com/jeromeetienne/warmly_private/issues/395) for a worked example of the failure this rule is meant to prevent.

## De-risk Before Building

Before writing implementation code for a feature that depends on an unproven external dependency (a transport, a tool, a third-party API, a specific runtime environment), first name the single assumption that would make the feature impossible, and prove or kill it with the smallest live test against the **real** environment — not a headless/proxy/mocked stand-in, and not an empty/unrepresentative state. Do not report a gate as passed unless it exercised the actual constraint. Show raw output and say what was tested, rather than generalizing a conclusion from one run.

**Why:** built from a retrospective ([#311](https://github.com/jeromeetienne/warmly_private/issues/311)) after ~4 hours were spent building the fastbrowser multi-agent guard ([#300](https://github.com/jeromeetienne/warmly_private/issues/300)) on top of an M0 "feasibility gate" that was declared PASSED against `--cdp-endpoint` (headless) instead of the repo's real `--extension` transport — a false green that only surfaced once the code was tested live, and the actual fix turned out to be small relative to the hours already spent.

## Tech Stack - Typescript

When writing typescript, use the following technologies:

- **TypeScript** (ES2020, strict), run via `tsx` for development
- **Zod** — runtime validation of SKILL.md frontmatter
- **Commander.js** — CLI arg parsing (both packages)
- **Chalk** — terminal colors (bsky_cli)

## Required Skills

- Use `$typescript-javascript-style` before creating or editing a TypeScript, TypeScript with JSX, JavaScript, JavaScript with JSX, MJS, or CJS file.
- Use `$context-md-management` before creating, editing, or reviewing a `CONTEXT.md` file, or before creating a source-code directory.

## Git

### Commit messages
- Do **not** append a `Co-Authored-By: Codex …` trailer, or any Anthropic/Codex email (e.g. `noreply@anthropic.com`), to commit messages. The commit message should contain only the change description.
- When a commit is about a GitHub issue, always mention the issue number in the commit message.
- If the commit fixes a GitHub issue, use `fixes #xxx` in the commit message.

### Pull requests
- Do **not** append the "🤖 Generated with Codex" line, or any Codex / Anthropic attribution, to pull request descriptions.

### GitHub issues
- When referencing a commit in a GitHub issue, always use a link, never only the hexadecimal SHA.

### Referencing commits
- Whenever mentioning a commit hash/SHA anywhere — chat, issues, PRs, commit messages — render it as a link to that commit on its remote (e.g. GitHub), never as bare hex text.
