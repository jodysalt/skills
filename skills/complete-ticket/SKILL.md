---
name: complete-ticket
description: Takes an open ticket from the base branch to a finished backlog in one command – adds and enters the ticket's `.claude/worktrees/{slug}` worktree when needed, breaks the ticket into tasks with `add-tasks` when it has no `tasks.md` and commits them, then runs the Ralph loop with `complete-tasks`. Use when the user says "complete the ticket", "implement X", "start work on X", "work on the X ticket", or runs `/complete-ticket`. Pure orchestrator: never pushes, never wraps up or merges, never lands a planning branch, never pauses between the tasks and the loop.
argument-hint: "[ticket slug or path – defaults to the current branch's ticket or the only open ticket]"
---

# Complete ticket

Get one open ticket from the base branch to a finished backlog: into its worktree, broken into tasks just before the loop so nothing landing in between can make them stale, then through `complete-tasks`. It only orchestrates other skills and stops once the loop does; landing the branch is `jodysalt:wrap-up-worktree`.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Stop if the branch or the argument names a closed ticket.

## Steps

1. **Guard.** The main checkout is the first path in `git worktree list`. `<main checkout>/docs/tickets/open/{slug}/index.md` must exist; otherwise stop, change nothing, and say to land the planning branch that holds the ticket with `jodysalt:wrap-up-worktree` first.
2. **Worktree.** If `git rev-parse --show-toplevel` already equals `<main checkout>/.claude/worktrees/{slug}`, skip this step. Else if that path is registered in `git worktree list`, invoke `jodysalt:enter-worktree {slug}`. Else invoke `jodysalt:exit-worktree` when the session is inside another worktree, then `jodysalt:add-worktree {slug}` (declining its offer to enter), then `jodysalt:enter-worktree {slug}`.
3. **Tasks.** If `docs/tickets/open/{slug}/tasks.md` is missing, invoke `jodysalt:add-tasks {slug}`, then `jodysalt:commit` staging only that ticket's `tasks.md` (and a spike's `findings.md` when `add-tasks` created it) with the subject `docs: added tasks for {slug}`, so the loop starts on a clean tree. An existing `tasks.md` skips this step and is never appended to.
4. **Loop.** Invoke `jodysalt:complete-tasks {slug}`. On its first failed task, stop with its report and leave the worktree in place.
5. **Report.** The loop's summary, whether step 3 wrote tasks, and a suggestion to run `jodysalt:wrap-up-worktree` to land the branch.

## Rules

- Only orchestrates: never implements a task, edits `tasks.md` itself, or spawns workers itself; `complete-tasks` does.
- Never asks a question between steps, wraps up, merges, lands a planning branch, or pushes.
