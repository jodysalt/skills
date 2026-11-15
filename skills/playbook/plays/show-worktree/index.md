# Show worktree

## Steps

1. Run `git rev-parse --show-toplevel`, `git branch --show-current`, `git worktree list` and `git status --porcelain` in parallel. Not a git repo: say so and stop.
2. The main checkout is the first path in `git worktree list`. The session is in it when the top-level path matches; otherwise it is in a worktree, normally `<main checkout>/.claude/worktrees/<branch>`.
3. Report one line: the path, `on <branch>` (or `detached at <short sha>` when `--show-current` prints nothing), then `main checkout` or `worktree`, and `(uncommitted changes)` when the status output isn't empty.

## Rules

- Read-only. Never enters, exits, creates, removes, or edits anything; those are `jodysalt:playbook enter-worktree`, `jodysalt:playbook exit-worktree`, `jodysalt:playbook add-worktree` and `jodysalt:playbook remove-worktree`.
