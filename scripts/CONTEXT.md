# Directory Context: `/scripts`

## Purpose

This folder contains repository maintenance programs. The programs copy and
check the shared Codex configuration without changing user-specific Codex data.

## Key Exports & Entry Points

- `sync_codex.ts`: Run with `npm run codex:copy` or `npm run codex:check`.

## Rules

- The synchronization program copies only files present in the repository's `.codex` directory.
- The check command permits files in the user Codex configuration that are not in the repository.

## Background

- The user Codex configuration contains runtime data and credentials that must remain outside this repository.
