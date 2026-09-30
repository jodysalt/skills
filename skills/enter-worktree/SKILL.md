---
name: enter-worktree
description: Switches the session into an existing git worktree at `.claude/worktrees/<branch>` under the repo root, so relative paths resolve there. Use when the user says "enter the worktree", "switch to the X worktree", "go into the worktree", "enter the worktree for X", or runs `/enter-worktree`. Works from the main checkout or from inside another worktree. Never creates a worktree or branch (that is `add-worktree`), never removes one, never pushes, and never edits anything.
argument-hint: "[branch or worktree name – defaults to a pick from the existing worktrees]"
---

# Enter worktree

## Worktree

$ARGUMENTS

If empty, run `git worktree list`: the candidates are the registered worktrees under `.claude/worktrees/`, minus the one the session is already in, most recently modified first. None: say so, offer to invoke `jodysalt:add-worktree`, and stop. Otherwise ask with `AskUserQuestion`, one option per worktree labelled with its name and branch. The built-in "Other" option covers a typed name, so don't add one. Normalize a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`).

## Steps

1. The main checkout is the first path in `git worktree list`; the target is `<main checkout>/.claude/worktrees/<name>`. If `git rev-parse --show-toplevel` already equals the target, say so and stop. If the target isn't in `git worktree list`, stop: say it doesn't exist and suggest `/jodysalt:add-worktree <name>`, after `jodysalt:exit-worktree` when the session is inside a worktree, because `add-worktree` runs from the main checkout.
2. **Enter it.** Call `EnterWorktree` with `path` set to the target so the session's working directory moves there; relative paths (`docs/…`) now resolve inside the worktree. This works from the main checkout and from inside another worktree. An agent without that tool runs `cd <target>` instead, with the absolute path so it works from anywhere.
3. Confirm the path, the branch from `git branch --show-current`, and that the session now runs there.

## Rules

- Never creates a worktree or branch, never removes one, never pushes, and never edits docs. Creation is `jodysalt:add-worktree`; removal is `jodysalt:remove-worktree`, which runs `jodysalt:exit-worktree` first when the session is inside the worktree.
