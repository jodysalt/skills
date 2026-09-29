---
name: refine-initiative
description: Revisits an existing open initiative at `docs/initiatives/open/{slug}.md` and improves it in place – assesses it against the initiative template, `vision.md`, and its tickets, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X initiative", "revisit X", "flesh out the X initiative", "update the spec for X", or runs `/refine-initiative`. Edits an open initiative only; never creates, moves, closes, or deletes docs, never edits `vision.md` or ticket files, never commits.
argument-hint: "[initiative slug – defaults to the only open initiative]"
---

# Refine initiative

Improve one open initiative in place: assess, interview, edit. Leave the result uncommitted.

## Initiative

$ARGUMENTS

If empty: the only file in `docs/initiatives/open/`, else `ls docs/initiatives/open/` and ask. Confirm the pick. If the slug isn't under `open/`, stop and say so; closed initiatives are project memory and don't get reworked.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Read** the initiative, `docs/vision.md` (*Strategic bets*), every ticket in its `## Tickets` list, and the output of `grep -rl 'initiative: {slug}' docs/tickets` for tagged `feat` tickets.
3. **Report findings before editing anything:**
   - `TODO:` markers.
   - Empty, skeleton, or missing sections (`Outcome`, `Why now`, `Success metrics`, `Non-goals`, `Tickets`).
   - `## Why now` citing no strategic bet, or one that no longer exists in `vision.md`.
   - `## Tickets` drift: `open/` paths for tickets now in `closed/` (or vice versa), the leftover template placeholder bullet once real tickets are listed, tagged `feat` tickets missing from the list.
   - Content contradicted by shipped work or by the tickets themselves.

   If every ticket is closed and the outcome shipped, say so and point at `jodysalt:close-initiative`. Don't close it yourself.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the initiative at `docs/initiatives/open/{slug}.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then add the decisions the initiative makes without saying so.
   - The tickets and the codebase count as explorable; a question they answer is never asked.
   - Edit only the initiative file as answers land. `vision.md` and ticket files stay untouched.
5. **Edit** within these constraints on top of `grill-me`'s: fixing `## Tickets` drift is in scope. Never invent `Outcome`, `Success metrics`, or `Non-goals`; ask, or leave a `TODO:` marker.
6. Stop. Leave the edits uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Never edit `vision.md`; surface a stale bet instead. `close-initiative` owns bet removal.
- Never edit ticket files; this initiative's `## Tickets` list is the boundary.
