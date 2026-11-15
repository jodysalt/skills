# List worktrees

## Steps

1. Run `git worktree list` and `git rev-parse --show-toplevel` in parallel. The main checkout is the first path listed. Then `ls <main checkout>/.claude/worktrees/`, with the absolute path so it works from inside a worktree; a missing directory just means no worktrees yet.
2. Report one line per worktree: path, branch, and tags – `main checkout` for the main checkout, whatever branch it has, `current` for the one matching the top-level path, `stale (unregistered)` for a directory under `.claude/worktrees/` that `git worktree list` doesn't know. Main checkout first, then the rest in the order git lists them.
3. Only the main checkout: say there are no worktrees and offer to invoke `jodysalt:playbook add-worktree`.

## Rules

- Read-only. Never prunes, removes, creates, or enters; those are `jodysalt:playbook remove-worktree` for removing a worktree, `jodysalt:playbook remove-worktrees` for pruning stale directories, `jodysalt:playbook add-worktree` and `jodysalt:playbook enter-worktree`.
