---
name: close-ticket
description: Closes a ticket by moving `docs/tickets/open/{slug}/` to `docs/tickets/closed/{slug}/`, its `tasks.md` included, and rewriting every live path reference to it in other ticket bodies and task entries. Use when the user says "close the X ticket", "mark X done/closed/shipped", or runs `/close-ticket`. Refuses while a task in its `tasks.md` is not done or a `{slug}--{sub}` sub-ticket is open. Leaves the move unstaged for review; never commits, never edits the ticket body, never renames the slug, never deletes anything.
argument-hint: "[ticket slug – defaults to the current branch's ticket or the only open ticket]"
---

# Close ticket

Lifecycle is the directory, not a frontmatter field. Closing is a move plus reference fix-ups, nothing more.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Confirm the pick. Stop if the branch or the argument names a closed ticket.

## Steps

1. **Guard.** Stop if `docs/tickets/open/{slug}/` doesn't exist (list what is open; it may be closed already or mistyped), if `docs/tickets/closed/{slug}/` already exists (flag the collision; never overwrite), if `docs/tickets/open/{slug}/tasks.md` holds an entry whose `- **status:**` is anything but `done` (list the unfinished headings and change nothing), or if `ls -d docs/tickets/open/{slug}--* 2>/dev/null` prints anything (list those open sub-tickets and change nothing; each closes on its own first). No `tasks.md` at all is fine, and done entries stay in the file as the ticket's record.
2. **Move:** `mv docs/tickets/open/{slug} docs/tickets/closed/{slug}`. A plain `mv`; the ticket's `tasks.md` travels with the folder, and git detects the rename once both sides are staged at commit time.
3. **Rewrite references.** Find them by exact slug, scoped so templates and unrelated docs are never touched:

   ```bash
   grep -rln 'docs/tickets/open/{slug}/' docs/tickets
   ```

   In each hit replace `docs/tickets/open/{slug}/` with `docs/tickets/closed/{slug}/`: any other ticket body and task entries in any ticket's `tasks.md`. Report how many references changed and in which files.
4. Stop. Leave everything unstaged for review and suggest `jodysalt:commit` (a `docs:` commit). When `{slug}` holds `--`, name the parent – the slug up to its last `--` – and say whether `ls -d docs/tickets/open/{parent}--* 2>/dev/null` now prints nothing, so the user knows the parent can close once its own tasks are done; never close it.

## Rules

- Never edit the ticket's body or frontmatter: no close-reason note.
- Never closes a parent; a sub-ticket's close only reports on it.
- Never rename the slug. Never delete a ticket; closed tickets are project memory.
- Never touch template or example paths in `docs/README.md`, skills, or package docs.
