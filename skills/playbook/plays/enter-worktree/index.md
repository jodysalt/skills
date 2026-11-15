# Enter worktree

## Worktree

The arguments passed to the play.

If empty, run `git worktree list`: the candidates are the registered worktrees under `.claude/worktrees/`, minus the one the session is already in, most recently modified first. None: say so, offer to invoke `jodysalt:playbook add-worktree`, and stop. Otherwise ask with `AskUserQuestion`, one option per worktree labelled with its name and branch. The built-in "Other" option covers a typed name, so don't add one. Normalize a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`).

## Steps

1. The main checkout is the first path in `git worktree list`; the target is `<main checkout>/.claude/worktrees/<name>`. If `git rev-parse --show-toplevel` already equals the target, say so and stop. If the target isn't in `git worktree list`, stop: say it doesn't exist and suggest `/jodysalt:playbook add-worktree <name>`, after `jodysalt:playbook exit-worktree` when the session is inside a worktree, because `add-worktree` runs from the main checkout.
2. **Enter it.** Call `EnterWorktree` with `path` set to the target so the session's working directory moves there; relative paths (`docs/…`) now resolve inside the worktree. This works from the main checkout and from inside another worktree. An agent without that tool runs `cd <target>` instead, with the absolute path so it works from anywhere.
3. Confirm the path, the branch from `git branch --show-current`, and that the session now runs there.

## Rules

- Never creates a worktree or branch, never removes one, never pushes, and never edits docs. Creation is `jodysalt:playbook add-worktree`; removal is `jodysalt:playbook remove-worktree`, which runs `jodysalt:playbook exit-worktree` first when the session is inside the worktree.
