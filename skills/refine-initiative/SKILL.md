---
name: refine-initiative
description: Revisits an existing open initiative at `docs/initiatives/open/{slug}.md` and improves it in place – assesses it against the initiative template, `vision.md`, and its tickets, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X initiative", "revisit X", "flesh out the X initiative", "update the spec for X", or runs `/refine-initiative`. Edits an open initiative in place and makes the small related edits its answers settle – a ticket's `initiative:` tag, a new bet's section in `vision.md` – without a second question; never creates, moves, closes, or deletes docs, never commits.
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
   - Edit the initiative file as answers land, plus the related edits step 5 allows; nothing else outside it.
5. **Edit** within these constraints on top of `grill-me`'s. Never invent `Outcome`, `Success metrics`, or `Non-goals`; ask, or leave a `TODO:` marker. A related edit that a finding or an answer settles outright, needing no decision of its own, is made on the spot and named in the report rather than raised as a second question or left to another skill: `## Tickets` drift; a ticket's `initiative:` tag the interview moves to or from this initiative, both initiatives' `## Tickets` lists following; a `## Why now` citation that differs from a `vision.md` bet title only in spelling or case; and the `### {Title}` section for a new bet the user names, added under `## Strategic bets` in `vision.md` in a few lines from `## Outcome` and `## Why now`. Anything more in `vision.md` or a ticket body is surfaced for `jodysalt:refine-vision` or `jodysalt:refine-ticket`.
6. Stop. Leave the edits uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- `vision.md` changes only by gaining a new bet's section; never rename or remove a bet there, `close-initiative` owns removal, and anything else is surfaced.
- A ticket file changes only in its `initiative:` tag; its body is `jodysalt:refine-ticket`'s.
