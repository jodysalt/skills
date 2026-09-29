---
name: wrap-up-ticket
description: Wraps up a finished ticket once the Ralph loop has completed its `tasks.md` – guards the tree and the ticket's backlog, runs `close-ticket`, then `commit`, producing exactly one `docs:` commit. Use when the user says "wrap up the X ticket", "wrap up this ticket", "close the ticket and commit", or runs `/wrap-up-ticket`. Refuses on a dirty tree or while the ticket still has a non-done task. Never pushes, merges, or closes initiatives.
argument-hint: "[ticket slug – defaults to the current branch's ticket or the only open ticket]"
---

# Wrap up ticket

Sequence `close-ticket` and `commit`, and add the guards that make committing without a review stop safe.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Confirm the pick. Stop if the branch or the argument names a closed ticket.

## Steps

1. **Guard**, before editing anything. Stop if:
   - `git status --porcelain` isn't empty; tell the user to commit or stash first. The final commit must hold this skill's changes and nothing else.
   - `docs/tickets/open/{slug}/` doesn't exist, or `docs/tickets/closed/{slug}/` already does.
   - `docs/tickets/open/{slug}/tasks.md` has an entry with a status other than `done`; list the unfinished headings. No `tasks.md` at all is fine, and done entries stay in the file as the ticket's record.
   - The Ralph loop (`complete-tasks`) is running in this session.
2. **Close:** invoke `jodysalt:close-ticket` for the slug.
3. **Commit** via `jodysalt:commit`, staging explicitly `docs/tickets/open/{slug}`, `docs/tickets/closed/{slug}`, and every file `close-ticket` reported rewriting, so git detects the rename. Subject: `docs: closed the {slug} ticket`. One commit.
4. **Report** `git log -1 --stat` and the references rewritten. If every ticket in the owning initiative's `## Tickets` list is now closed, mention `jodysalt:close-initiative`; don't run it.

## Rules

- Never push, merge, open PRs, amend, or stash on the user's behalf.
- Never flip a task status, edit the ticket body, rename the slug, or touch initiatives.
- Never more than one commit.
