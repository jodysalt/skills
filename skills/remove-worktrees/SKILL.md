---
name: remove-worktrees
description: Removes git worktrees under `.claude/worktrees/` at the repo root, plus stale unregistered directories left there. Use when the user says "remove the worktree", "clean up worktrees", "delete the X worktree", "prune worktrees", or runs `/remove-worktrees`. Lists candidates for the user to choose from, delegates each picked worktree to `remove-worktree` (which deletes a merged branch and keeps an unmerged one), skips a dirty worktree, and prunes stale leftovers. Never forces, never touches the main checkout, never pushes.
argument-hint: "[worktree names – defaults to a pick from the list]"
---

# Remove worktrees

## Worktrees

$ARGUMENTS

If empty, gather candidates from `git worktree list` and `ls .claude/worktrees/`: registered worktrees under `.claude/worktrees/`, plus directories there that aren't registered, labelled "stale (unregistered)". Never the main checkout. No candidates: say so and stop. Otherwise ask with `AskUserQuestion` (`multiSelect: true`), one option per candidate.

## Steps

1. Run from the main checkout. If `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, the session is inside a worktree: invoke `jodysalt:exit-worktree` first, so the paths below resolve and the session isn't left in a deleted directory.
2. For each selected registered worktree, check `git -C .claude/worktrees/<name> status --porcelain`. If dirty, report what's uncommitted and skip it; forcing is `git worktree remove --force` by hand, never done here.
3. Remove each clean registered worktree by invoking `jodysalt:remove-worktree <name>`, one at a time. It removes the worktree and deletes its branch when merged, keeping an unmerged branch.
4. For each selected stale directory: `git worktree prune`, and if the directory survives, confirm and then `rm -rf .claude/worktrees/<name>`. A "Permission denied" on `node_modules` usually means a sandbox stamped the directory with a deny-delete ACL: run `chmod -R -N .claude/worktrees/<name>` and retry.
5. Report, per worktree, what each `remove-worktree` call removed and kept (worktree, branch deleted or kept and why), the dirty worktrees skipped, and the stale directories pruned.

## Rules

- Never remove the main checkout.
- Never force-remove a worktree or force-delete a branch; branch deletion is `remove-worktree`'s safe delete only.
- Never pushes, touches a remote, or edits docs.
