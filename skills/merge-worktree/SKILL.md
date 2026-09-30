---
name: merge-worktree
description: Fast-forwards the branch of a `.claude/worktrees/<name>` worktree into local `main` from the main checkout, exiting the worktree first when the session is inside one. Use when the user says "merge the worktree", "merge X into main", "land the X branch", or runs `/merge-worktree`. Fast-forward only – a dirty checkout, a `main` that moved, or a branch on `main` stops it before anything changes. Never pushes, never fetches, never removes the worktree or its branch; that is `remove-worktree`.
argument-hint: "[worktree name – defaults to the worktree just left, else a pick from the existing worktrees]"
---

# Merge worktree

Fast-forward a worktree's branch into local `main` and stop there. No push, no merge commit, no removal.

## Worktree

$ARGUMENTS

A name under `.claude/worktrees/`. If empty, take the worktree step 1 left. If the session was already in the main checkout, run `git worktree list` and ask with `AskUserQuestion`, one option per registered worktree under `.claude/worktrees/` labelled with its name and branch, never the main checkout. None: say so and stop. The built-in "Other" option covers a typed name, so don't add one.

## Steps

1. Run from the main checkout. If `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, the session is inside a worktree: remember its name, then invoke `jodysalt:exit-worktree` so the merge runs where `main` is checked out.
2. Resolve the name to `<main checkout>/.claude/worktrees/<name>` and take its branch from `git worktree list`. If that path isn't registered there, stop: say the worktree doesn't exist and suggest `jodysalt:list-worktrees`.
3. Check the ground in parallel, and stop at the first failure with its reason – nothing has changed yet:
   - `git status --porcelain` in the main checkout – must be empty. Otherwise say the main checkout is dirty and to commit or stash first; don't stash for them.
   - `git -C <worktree> status --porcelain` – must be empty. Otherwise say the worktree is dirty and to commit or stash first.
   - The worktree's branch must not be `main`. Otherwise say there is nothing to merge from a worktree on `main`.
   - `git branch --show-current` in the main checkout must be `main`, since `--ff-only` merges into whatever is checked out. Otherwise say the main checkout must have `main` checked out.
   - `git rev-list --count main..<branch>` – must be above 0. Otherwise say there is nothing to merge. Keep the count for the report.
   - `git merge-base --is-ancestor main <branch>` – must succeed. Otherwise `main` has commits the branch lacks: say the branch needs rebasing by hand, and stop without a merge commit or a rebase.
4. **Merge it.** From the main checkout: `git merge --ff-only <branch>`. If git refuses, report its message and stop; never retry with `--no-ff`, a rebase or a reset.
5. Show `git log -1 --stat` and say how many commits came over, the count from step 3. When it was above 1, mention that `jodysalt:squash-commits` in the worktree would have landed them as one. Offer to invoke `jodysalt:remove-worktree <name>` to clear the worktree and its branch; never run it unasked.

## Rules

- Fast-forward only. Never stash, reset, force, `--no-ff`, or rebase; a branch that can't fast-forward is the user's to rebase.
- Never pushes, fetches, or touches a remote. Local `main` is the only target.
- Never removes a worktree or deletes a branch; that is `jodysalt:remove-worktree`, offered after the merge.
