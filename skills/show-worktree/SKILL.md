---
name: show-worktree
description: Reports which checkout the session is in – its path, its branch, and whether it is the main checkout or a worktree under `.claude/worktrees/` – plus whether it has uncommitted changes. Use when the user says "which worktree am I in", "show the worktree", "what worktree is this", "where am I", or runs `/show-worktree`. Read-only; changes nothing.
---

# Show worktree

## Steps

1. Run `git rev-parse --show-toplevel`, `git branch --show-current`, `git worktree list` and `git status --porcelain` in parallel. Not a git repo: say so and stop.
2. The main checkout is the first path in `git worktree list`. The session is in it when the top-level path matches; otherwise it is in a worktree, normally `<main checkout>/.claude/worktrees/<branch>`.
3. Report one line: the path, `on <branch>` (or `detached at <short sha>` when `--show-current` prints nothing), then `main checkout` or `worktree`, and `(uncommitted changes)` when the status output isn't empty.

## Rules

- Read-only. Never enters, exits, creates, removes, or edits anything; those are `jodysalt:enter-worktree`, `jodysalt:exit-worktree`, `jodysalt:add-worktree` and `jodysalt:remove-worktrees`.
