---
name: remove-worktrees
description: Removes git worktrees under `.claude/worktrees/` at the repo root, plus stale unregistered directories left there. Use when the user says "remove the worktree", "clean up worktrees", "delete the X worktree", "prune worktrees", or runs `/remove-worktrees`. Lists candidates for the user to choose from, refuses to force-remove a dirty worktree without confirmation, and deletes branches only on opt-in (safe delete by default). Never touches the main checkout, never pushes.
argument-hint: "[worktree names – defaults to a pick from the list]"
---

# Remove worktrees

## Worktrees

$ARGUMENTS

If empty, gather candidates from `git worktree list` and `ls .claude/worktrees/`: registered worktrees under `.claude/worktrees/`, plus directories there that aren't registered, labelled "stale (unregistered)". Never the main checkout. No candidates: say so and stop. Otherwise ask with `AskUserQuestion` (`multiSelect: true`), one option per candidate.

## Steps

1. Run from the main checkout. If `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, the session is inside a worktree: invoke `jodysalt:exit-worktree` first, so the paths below resolve and the session isn't left in a deleted directory.
2. For each selected worktree, check `git -C .claude/worktrees/<name> status --porcelain`. If dirty, show what's uncommitted and ask before using `--force`. Never force silently.
3. Clean: `git worktree remove .claude/worktrees/<name>`. Stale: `git worktree prune`, and if the directory survives, confirm and then `rm -rf .claude/worktrees/<name>`. A "Permission denied" on `node_modules` usually means a sandbox stamped the directory with a deny-delete ACL: run `chmod -R -N .claude/worktrees/<name>` and retry.
4. Offer branch deletion for each removed worktree whose branch still exists, in one follow-up question. For opted-in branches run `git branch -d <branch>`; if that fails as unmerged, report it and use `-D` only on explicit confirmation.
5. Confirm what was removed (worktrees, stale directories, branches) and what was kept.

## Rules

- Never remove the main checkout.
- Never force-remove a worktree or force-delete a branch without per-item confirmation. Never delete a branch the user didn't opt into.
- Never pushes, touches a remote, or edits docs.
