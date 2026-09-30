---
name: list-worktrees
description: Lists every git worktree of the repo – the main checkout and each checkout under `.claude/worktrees/` with its branch, marking the one the session is in – plus stale directories under `.claude/worktrees/` that git no longer registers. Use when the user says "list the worktrees", "what worktrees exist", "show worktrees", "show me the worktrees", or runs `/list-worktrees`. Read-only; never prunes or removes anything.
---

# List worktrees

## Steps

1. Run `git worktree list` and `git rev-parse --show-toplevel` in parallel. The main checkout is the first path listed. Then `ls <main checkout>/.claude/worktrees/`, with the absolute path so it works from inside a worktree; a missing directory just means no worktrees yet.
2. Report one line per worktree: path, branch, and tags – `main` for the main checkout, `current` for the one matching the top-level path, `stale (unregistered)` for a directory under `.claude/worktrees/` that `git worktree list` doesn't know. Main checkout first, then the rest in the order git lists them.
3. Only the main checkout: say there are no worktrees and offer to invoke `jodysalt:add-worktree`.

## Rules

- Read-only. Never prunes, removes, creates, or enters; those are `jodysalt:remove-worktree` for removing a worktree, `jodysalt:remove-worktrees` for pruning stale directories, `jodysalt:add-worktree` and `jodysalt:enter-worktree`.
