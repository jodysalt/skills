# Glossary

One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.

## driver

Whoever invoked a skill: a person at the keyboard, or an agent such as a `deliver-brief` stage, the slice drafter `complete-ticket-slice` spawns, or a `complete-tasks` worker. By the vision's *Driver-agnostic* principle a skill serves either the same way, asking the same questions in the same shape, and learns which it has only from the caller's framing.
Not: a person a skill detects from the session; nothing detects one.

## project command

A command that runs the project's own code or toolchain – a manifest script (`npm run …`, `make …`, `just …`) or the runtime or a tool directly (`npx tsc`, `pytest`) – as tests, type-checks, lints and builds do. In a repo whose `Dockerfile.sandbox` is tailored, `complete-task` runs each one through `run-in-sandbox`.
Not: a command that only reads the checkout, such as `grep`, `git` or `ls`.

## sandbox

A Docker container built from `Dockerfile.sandbox` at the repo root, with the checkout mounted in it, where `run-in-sandbox` runs commands isolated from the host.
Not: Claude Code's own Bash sandbox, which restricts the session's shell commands.

## unattended

A run whose caller declared in its framing that no person reads the conversation, as `deliver-brief`'s stage prompt and `complete-ticket-slice`'s slice drafter do and as the loop's `complete-task` worker is by its own description. The framing is the only signal. In an unattended run `grill-me`'s recommended answer stands for the trivial many, the vital few go back to the caller with their options and a recommendation, and `docs/glossary.md` is read, never written.
Not: a run with no person present that nobody declared; a skill treats that as a person's run.
