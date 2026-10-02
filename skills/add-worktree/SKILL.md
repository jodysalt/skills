---
name: add-worktree
description: Creates a git worktree at `.claude/worktrees/<branch>` under the repo root – the folder Claude Code's own `EnterWorktree` uses – on a branch that usually matches an open ticket slug from `docs/tickets/open/`. Use when the user says "add a worktree", "create a worktree", "make a worktree for X", or runs `/add-worktree`. Creates the branch from whatever the main checkout has checked out when it doesn't exist; says so when the worktree already exists. Runs only from the main checkout and never enters the worktree; that is `enter-worktree`. Never pushes, merges, fetches, or removes anything.
argument-hint: "[branch or ticket slug – defaults to a pick from the open tickets]"
---

# Add worktree

## Branch

$ARGUMENTS

If empty, run `ls docs/tickets/open/` and `git worktree list`, then ask with `AskUserQuestion`: one option per open ticket slug without a worktree, most recently modified first, split across a second question if they don't fit. Note any slugs skipped because a worktree exists. The built-in "Other" option covers a custom name, so don't add one. Normalize a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`).

## Steps

1. Worktrees are only created from the main checkout. If `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, the session is inside a worktree: stop, create nothing, and tell the user to run `jodysalt:exit-worktree` first, because a relative `.claude/worktrees/<branch>` would nest inside the current worktree.
2. If `.claude/worktrees/<branch>` already exists, say so and skip to step 4.
3. If the branch exists: `git worktree add .claude/worktrees/<branch> <branch>`. Otherwise: `git worktree add .claude/worktrees/<branch> -b <branch>`, which forks from the main checkout's `HEAD`: whatever branch it has checked out, `main` or not, as-is. Note that branch from `git branch --show-current` (the short sha when detached) for the report.
4. Confirm the path, the branch name and, for a new branch, what it forked from, and that the session still runs in the main checkout. Offer to invoke `jodysalt:enter-worktree` with the branch to switch into it.

## Rules

- Runs only from the main checkout. A new branch forks from whatever that checkout has checked out, as-is; no fetch, pull or checkout, and never an assumption that it is `main`.
- Never enters the worktree; that is `jodysalt:enter-worktree`. Never pushes, merges, or deletes, and never touches the main checkout or any docs. Removal is `jodysalt:remove-worktree`.
