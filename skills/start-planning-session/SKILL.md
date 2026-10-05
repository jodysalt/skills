---
name: start-planning-session
description: Starts a planning session by creating a fresh `planning-<YYYY-MM-DD>` branch as a git worktree at `.claude/worktrees/planning-<YYYY-MM-DD>` via `add-worktree` (suffixed `-<N>` when today's name is taken) and switching the session into it via `enter-worktree`, so planning docs are drafted there while the main checkout stays where it is. Joins today's planning worktree instead when one already exists. Use when the user says "start a planning session", "checkout a planning branch", runs `/start-planning-session`, or when `add-ticket`, `add-initiative`, `refine-ticket`, `refine-initiative`, `refine-coding-standards`, or `refine-vision` escalates here because the current branch isn't a planning branch. Refreshes the branch the main checkout has checked out first when it can; never pushes, merges, checks out, or removes anything.
---

# Start planning session

Get the session into a `planning-<DATE>` worktree so planning docs are drafted there rather than on the branch the main checkout has checked out, `main` or not.

## Steps

1. If the current branch already matches `planning-<YYYY-MM-DD>` (optionally `-<N>`, e.g. `planning-2026-08-07-2`), stop; the session is already started.
2. **Refresh the base**, best effort. The base is the branch the main checkout has checked out, `main` or not: `git -C <main checkout> branch --show-current`, the main checkout being the first path in `git worktree list`. When it prints a branch with an upstream (`git -C <main checkout> rev-parse --abbrev-ref @{upstream}` succeeds) and `git -C <main checkout> status --porcelain` is empty: `git -C <main checkout> pull --ff-only`. Otherwise, or if the pull fails (no upstream, detached `HEAD`, dirty tree, offline, diverged), carry on from the base as-is and say so. Never check anything out to get there.
3. **Pick the name.** If `git worktree list` has `.claude/worktrees/planning-<today>` or `.claude/worktrees/planning-<today>-<N>`, take the highest-numbered one and say the session is joining it. Otherwise the next free name: `planning-<today>`, then `planning-<today>-2`, `-3`, and so on, checking `git branch --list --all` and `ls .claude/worktrees/`.
4. **Create it** when missing: invoke `jodysalt:add-worktree` with that name. It forks the branch from the base into `.claude/worktrees/<name>` and leaves the session where it is.
5. **Enter it.** Invoke `jodysalt:enter-worktree` with that name, which switches the session into the worktree.
6. Confirm the branch name and path, then hand back to whichever skill escalated here.

## Rules

- Only picks a name and delegates. Never edits docs, pushes, merges, or removes a worktree or branch; removal is `jodysalt:remove-worktree`.
- Never stashes, resets, or checks out on the user's behalf; a dirty main checkout only skips the refresh.
- If the user wants to plan on the current branch, respect that and skip.
