---
name: exit-worktree
description: Returns the session from a `.claude/worktrees/<branch>` worktree to the main checkout, leaving the worktree and its branch on disk with any uncommitted changes intact. Use when the user says "exit the worktree", "leave the worktree", "go back to the main checkout", "back to the root", or runs `/exit-worktree`. Never removes a worktree, discards changes, stashes, commits, pushes, or checks anything out.
---

# Exit worktree

## Steps

1. If `git rev-parse --show-toplevel` equals the first path in `git worktree list`, the session is already in the main checkout: say so and stop.
2. Note `git status --porcelain` for the report. Never stash or commit on the user's behalf.
3. **Leave it.** Call `ExitWorktree` with `action: keep`, which restores the session's working directory and clears the caches that depend on it. If the tool is missing, or reports that no worktree session is active (the session was launched inside the worktree, or entered it with `cd`), run `cd ../../../` from the worktree root instead – `cd "$(git rev-parse --show-toplevel)/../../.."` – which is the main checkout under the `.claude/worktrees/<branch>` layout.
4. Confirm the path and the branch from `git branch --show-current`, and that the worktree is still on disk with the uncommitted changes noted in step 2 untouched.

## Rules

- Never `action: remove` and never `discard_changes`. Removal is `jodysalt:remove-worktree`, which runs this skill first when the session is inside the worktree.
- Never stashes, resets, commits, pushes, or checks out.
