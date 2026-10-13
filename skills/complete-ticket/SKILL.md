---
name: complete-ticket
description: Takes an open ticket from the base branch to a finished branch in one command – adds and enters the ticket's `.claude/worktrees/{slug}` worktree when needed, runs a `tasks.md` the ticket already holds through `complete-tasks`, then works through the ticket one thin slice at a time via `complete-ticket-slice` until it reports `done`. Use when the user says "complete the ticket", "implement X", "start work on X", "work on the X ticket", or runs `/complete-ticket`. Pure orchestrator: never pushes, never wraps up or merges, never lands a planning branch, never pauses between slices.
argument-hint: "[ticket slug or path – defaults to the current branch's ticket or the only open ticket]"
---

# Complete ticket

Get one open ticket from the base branch to a finished branch: into its worktree, then through the ticket one thin slice at a time with `complete-ticket-slice`, each slice a `{slug}--{sub}` sub-ticket whose backlog is written just before the loop that runs it, so nothing landing in between can make it stale. It only orchestrates other skills and stops once the slices do; landing the branch is `jodysalt:wrap-up-worktree`. A run that stops resumes with the same command.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Stop if the branch or the argument names a closed ticket.

## Steps

1. **Guard.** The main checkout is the first path in `git worktree list`. `<main checkout>/docs/tickets/open/{slug}/index.md` must exist; otherwise stop, change nothing, and say to land the planning branch that holds the ticket with `jodysalt:wrap-up-worktree` first.
2. **Worktree.** If `git rev-parse --show-toplevel` already equals `<main checkout>/.claude/worktrees/{slug}`, skip this step. Else if that path is registered in `git worktree list`, invoke `jodysalt:enter-worktree {slug}`. Else invoke `jodysalt:exit-worktree` when the session is inside another worktree, then `jodysalt:add-worktree {slug}` (declining its offer to enter), then `jodysalt:enter-worktree {slug}`.
3. **Existing backlog.** A compatibility step for a ticket whose `tasks.md` predates slicing; a parent `tasks.md` is never written here. When `docs/tickets/open/{slug}/tasks.md` exists with a `- **status:** pending` entry, invoke `jodysalt:complete-tasks {slug}`; on its first failed task, stop with its report and leave the worktree in place. Otherwise skip this step.
4. **Slices.** Invoke `jodysalt:complete-ticket-slice {slug}` and read the last line of its report:
   - `done`: every criterion is met; go to step 5.
   - A line starting with a `{slug}--{sub}` slice slug: one slice landed on the branch; invoke `complete-ticket-slice` again. There is no slice cap, as `complete-tasks` has no task cap.
   - Anything else is a failure: stop with that report and leave the worktree in place; the next run resumes it.
5. **Report.** The slices landed this run, the last `complete-ticket-slice` verdict per criterion, whether step 3 ran a pre-existing backlog, every check left for a person, and a suggestion to run `jodysalt:wrap-up-worktree` to land the branch.

## Rules

- Only orchestrates: never judges a criterion, drafts a slice, implements a task, edits a `tasks.md` itself, or spawns workers itself; `complete-ticket-slice` and `complete-tasks` do.
- Never asks a question between steps, wraps up, merges, lands a planning branch, or pushes.
