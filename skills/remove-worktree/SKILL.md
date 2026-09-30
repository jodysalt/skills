---
name: remove-worktree
description: Removes one git worktree under `.claude/worktrees/` at the repo root and deletes its branch with the safe `git branch -d` when that branch is merged, keeping an unmerged branch and saying so. Use when the user says "remove this worktree", "remove the X worktree", "delete the worktree for X", or runs `/remove-worktree`. Exits the worktree first when the session is inside it. Refuses a dirty worktree, never forces, never touches the main checkout, never pushes.
argument-hint: "[worktree name – defaults to the worktree the session is in]"
---

# Remove worktree

Remove one worktree and, when it is merged, its branch. No question asked on the way.

## Worktree

$ARGUMENTS

A name under `.claude/worktrees/`. If empty, take the worktree the session is in. If empty and the session is in the main checkout (`git rev-parse --show-toplevel` equals the first path in `git worktree list`), say a worktree name is needed, suggest `jodysalt:list-worktrees` to see them, and stop.

## Steps

1. **Resolve it.** Resolve the name to `<main checkout>/.claude/worktrees/<name>`, the main checkout being the first path in `git worktree list`, and take its branch from the same listing. If the session is inside that worktree, invoke `jodysalt:exit-worktree` first, so the commands below run from the main checkout and the session isn't left in a deleted directory.
2. **Check it.** Stop with the reason, changing nothing, when:
   - the path isn't registered in `git worktree list` – say the worktree doesn't exist and suggest `jodysalt:list-worktrees`;
   - the path is the main checkout – say the main checkout is never removed;
   - `git -C <path> status --porcelain` is not empty – say the worktree is dirty, show what's uncommitted, and say to commit or discard it first.
3. **Remove the worktree.** From the main checkout: `git worktree remove .claude/worktrees/<name>`. A "Permission denied" on `node_modules` usually means a sandbox stamped the directory with a deny-delete ACL: run `chmod -R -N .claude/worktrees/<name>` and retry once. Any other failure: report git's message and stop.
4. **Delete the branch.** `git branch -d <branch>`. If git refuses it as not fully merged, keep the branch and say so, naming it; that is not a failure.
5. **Report** the worktree path removed, and whether its branch was deleted or kept (and why).

## Rules

- Never `--force`, never `-D`, never the main checkout.
- Never pushes or touches a remote, and never edits docs.
