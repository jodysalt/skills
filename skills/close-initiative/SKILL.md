---
name: close-initiative
description: Closes an initiative by moving `docs/initiatives/open/{slug}.md` to `docs/initiatives/closed/{slug}.md`, rewriting any live path reference, and – when no remaining open initiative cites the strategic bet it served – removing that bet's section from `docs/vision.md`. Use when the user says "close the X initiative", "mark X shipped/abandoned", or runs `/close-initiative`. Edits `vision.md` only for that removal. Leaves the changes unstaged; never commits, never edits the initiative body, never renames the slug, never moves tickets.
argument-hint: "[initiative slug – defaults to the only open initiative]"
---

# Close initiative

Lifecycle is the directory, not a frontmatter field. Closing is a move plus reference fix-ups, plus one job no other close has: retiring a strategic bet that no open initiative cites any more.

## Initiative

$ARGUMENTS

If empty: the only file in `docs/initiatives/open/`, else `ls docs/initiatives/open/` and ask. Confirm the pick.

## Steps

1. **Guard.** Stop if `docs/initiatives/open/{slug}.md` doesn't exist (list what is open) or if `docs/initiatives/closed/{slug}.md` already exists (flag the collision; never overwrite). Then run `grep -rl 'initiative: {slug}' docs/tickets/open`; if tickets are still open, list them and ask whether to close anyway. An abandoned or superseded initiative legitimately leaves tickets behind; they stay open and untouched.
2. **Move:** `mv docs/initiatives/open/{slug}.md docs/initiatives/closed/{slug}.md`. A plain `mv`; git detects the rename at commit time.
3. **Rewrite references:**

   ```bash
   grep -rln 'docs/initiatives/open/{slug}.md' docs/initiatives docs/tickets
   ```

   In each hit replace `open/` with `closed/`. Zero hits is the normal result; initiatives cross-reference by backticked slug, which needs no rewrite. Report the count.
4. **Retire the bet if redundant.** Read the closed initiative's `## Why now` for the bet it names by exact title. If it names none, say so and skip. Otherwise run `grep -riln '{bet title}' docs/initiatives/open/`:
   - Hits: report that the bet is still live and which files cite it. Leave `vision.md` alone.
   - No hits: delete the whole `### {Title}` section from `## Strategic bets` in `docs/vision.md`. No retirement note; git history and the closed initiative are the memory. Then flag, without editing, anything else in `vision.md` that referenced the bet: cross-references in surviving bets, and any paragraph that lived inside the deleted section but wasn't about the bet (such as a closing non-bets note).
5. Stop. Leave everything unstaged for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Never edit the initiative's body or frontmatter, and never rename the slug. A `> Superseded by [[new-slug]].` note is the user's edit to make.
- Never touch ticket files; `initiative:` is a slug, not a path, so the move leaves it valid.
- `vision.md` edits stop at deleting the redundant bet's section. Never rename a bet or rewrite references to surviving bets.
- Never delete an initiative; closed initiatives are project memory.
