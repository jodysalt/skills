---
name: refine-ticket
description: Revisits an existing open ticket at `docs/tickets/open/{slug}/index.md` and improves it in place – assesses it against the ticket template, verifies its code references against the current codebase, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X ticket", "revisit X", "flesh out the X ticket", "update the spec for X", or runs `/refine-ticket`. Edits an open ticket in place and makes the small related edits its answers settle – a spike's missing `findings.md`, a `delivers:` retag – without a second question; never moves, closes, or deletes docs, never touches source code, never commits.
argument-hint: "[ticket slug – defaults to the only open ticket or the current branch]"
---

# Refine ticket

Improve one open ticket in place: assess, interview, edit. Leave the result uncommitted.

## Ticket

$ARGUMENTS

If empty: the only directory in `docs/tickets/open/`, else the open ticket matching the current branch name, else `ls docs/tickets/open/` and ask. Confirm the pick. If the slug isn't under `open/`, stop and say so; closed tickets are project memory and don't get reworked.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Read** the ticket directory; for a `feat` or a `spike`, `docs/vision.md`, so a `delivers:` is checked against its `###` headings and a `feat`'s `Strategic fit` against the vision; and for a slug holding `--`, each parent's `index.md` up the chain, `docs/tickets/*/{parent}/index.md` for each `--` prefix of the slug.
3. **Verify code references**, read-only: every file path named in `# Context` and `# Implementation notes` (for a `spike`, `# Context` and `# Approach`) still exists, and the constraints, hooks, and config they describe still hold.
4. **Report findings before editing anything:**
   - `TODO:` markers.
   - Empty, skeleton, or missing sections. For a `spike`: `Question`, `Context`, `Approach` and `Done when`, plus `Strategic fit` only when `delivers:` is set. For every other type: `Goal`, `Context`, `Scope`, `Acceptance criteria`, `Implementation notes`, `Test plan`, `Rollout`, plus `Strategic fit` for `feat`.
   - A `spike` whose directory has no `findings.md`; step 6 creates it.
   - Code drift: paths that no longer exist, constraints that have changed.
   - Frontmatter: `type` outside `feat | fix | refactor | chore | docs | test | spike`; a `delivers:` whose title matches no `### ` heading in `docs/vision.md`; a `delivers:` on a sub-ticket, which inherits its parent's trace; a `--` prefix with no folder under `docs/tickets/open/`, the parent closed or never drafted.
   - Thin or untestable acceptance criteria (for a `spike`, `# Done when` is the acceptance section), a `Strategic fit` that no longer traces to `vision.md`, a `feat` sub-ticket whose `## Strategic fit` does not name its parent, a `feat` with no `delivers:` whose `## Strategic fit` names no product principle or core problem from `vision.md`, content contradicted by shipped work.

   If the work is already shipped, say so and point at `jodysalt:close-ticket`. Don't close it yourself.
5. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the ticket at `docs/tickets/open/{slug}/index.md`". Give it this framing:
   - Seed the decision tree with the findings from step 4, then add the decisions the ticket makes without saying so.
   - The codebase counts as explorable; a question it answers is never asked.
   - Edit `index.md` as answers land, plus the related edits step 6 allows. Source and `vision.md` stay untouched.
6. **Edit** within these constraints on top of `grill-me`'s: never invent `Goal`, acceptance criteria, or scope; ask, or leave a `TODO:` marker. A related edit that a finding or an answer settles outright, needing no decision of its own, is made on the spot and named in the report rather than raised as a second question or left to another skill: a spike's missing `findings.md`, created beside `index.md` holding exactly the three prompt headings `# Findings`, `# Recommendation` and `# Tickets implied`; and a `delivers:` retag the interview decides, to the exact title of a `###` heading in `docs/vision.md`. Anything more in `vision.md` or a parent ticket is surfaced for `jodysalt:refine-vision` or a `refine-ticket` run on the parent.
7. Stop. Leave the edits uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Code verification is read-only; never edit source.
- Never edit `vision.md` or a parent ticket. Surface anything more.
- Re-tagging `delivers:` is a user decision made in the interview, never a silent edit.
