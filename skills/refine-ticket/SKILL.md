---
name: refine-ticket
description: Revisits an existing open ticket at `docs/tickets/open/{slug}/index.md` and improves it in place – assesses it against the ticket template, verifies its code references against the current codebase, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X ticket", "revisit X", "flesh out the X ticket", "update the spec for X", or runs `/refine-ticket`. Edits an open ticket only; never creates, moves, closes, or deletes docs, never touches source code, never commits.
argument-hint: "[ticket slug – defaults to the only open ticket or the current branch]"
---

# Refine ticket

Improve one open ticket in place: assess, interview, edit. Leave the result uncommitted.

## Ticket

$ARGUMENTS

If empty: the only directory in `docs/tickets/open/`, else the open ticket matching the current branch name, else `ls docs/tickets/open/` and ask. Confirm the pick. If the slug isn't under `open/`, stop and say so; closed tickets are project memory and don't get reworked.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Read** the ticket directory and, for `feat` tickets, its initiative (`docs/initiatives/{open|closed}/{initiative}.md`) and `docs/vision.md`.
3. **Verify code references**, read-only: every file path named in `# Context` and `# Implementation notes` still exists, and the constraints, hooks, and config they describe still hold.
4. **Report findings before editing anything:**
   - `TODO:` markers.
   - Empty, skeleton, or missing sections (`Goal`, `Context`, `Scope`, `Acceptance criteria`, `Implementation notes`, `Test plan`, `Rollout`, plus `Strategic fit` for `feat`).
   - Code drift: paths that no longer exist, constraints that have changed.
   - Frontmatter: `type` outside `feat | fix | refactor | chore | docs | test`; a `feat` without `initiative:`, or an `initiative:` slug with no file under `docs/initiatives/`.
   - Thin or untestable acceptance criteria, a `Strategic fit` that no longer traces to `vision.md`, content contradicted by shipped work.

   If the work is already shipped, say so and point at `jodysalt:close-ticket`. Don't close it yourself.
5. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the ticket at `docs/tickets/open/{slug}/index.md`". Give it this framing:
   - Seed the decision tree with the findings from step 4, then add the decisions the ticket makes without saying so.
   - The codebase counts as explorable; a question it answers is never asked.
   - Edit only `index.md` as answers land. Source, `vision.md`, and initiative files stay untouched.
6. **Edit** within these constraints on top of `grill-me`'s: never invent `Goal`, acceptance criteria, or scope; ask, or leave a `TODO:` marker.
7. Stop. Leave the edits uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Code verification is read-only; never edit source.
- Never edit `vision.md` or initiative files; surface staleness there instead.
- Re-tagging `initiative:` is a user decision made in the interview, never a silent edit.
