---
name: add-worktree
description: Creates a git worktree at `worktrees/<branch>` under the repo root, on a branch that usually matches an open ticket slug from `docs/tickets/open/`, and switches the session into it. Use when the user says "add a worktree", "create a worktree", "make a worktree for X", or runs `/add-worktree`. Creates the branch from local `main` when it doesn't exist; enters the worktree when it already exists. Runs only from the main checkout. Never pushes, merges, fetches, or removes anything.
argument-hint: "[branch or ticket slug – defaults to a pick from the open tickets]"
---

# Add worktree

## Branch

$ARGUMENTS

If empty, run `ls docs/tickets/open/` and `git worktree list`, then ask with `AskUserQuestion`: one option per open ticket slug without a worktree, most recently modified first, split across a second question if they don't fit. Note any slugs skipped because a worktree exists. The built-in "Other" option covers a custom name, so don't add one. Normalize a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`).

## Steps

1. Worktrees are only created from the main checkout. If `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, the session is inside a worktree: stop, create nothing, and tell the user to run this from that first path. A relative `worktrees/<branch>` would nest inside the current worktree, and `EnterWorktree` can't hop from one `worktrees/` checkout to another.
2. If `worktrees/<branch>` already exists, say so and skip to step 4.
3. If the branch exists: `git worktree add worktrees/<branch> <branch>`. Otherwise: `git worktree add worktrees/<branch> -b <branch> main`.
4. **Enter it.** Call `EnterWorktree` with `path: worktrees/<branch>` so the session's working directory moves there; relative paths (`docs/…`) now resolve inside the worktree. An agent without that tool runs `cd worktrees/<branch>` instead. Skip only if the user asked to create without entering.
5. Confirm the path, the branch name, and that the session now runs there.

## Rules

- Runs only from the main checkout. Whatever branch that has checked out, a new branch forks from local `main` as-is; no fetch or pull.
- Never pushes, merges, or deletes, and never touches the main checkout or any docs. Removal is `jodysalt:remove-worktrees`, after `ExitWorktree` with `keep` when the session is inside the worktree.
