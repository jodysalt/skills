---
name: start-planning-session
description: Starts a planning session by creating a fresh `planning-<YYYY-MM-DD>-<description>` branch, the description required, as a git worktree at `.claude/worktrees/planning-<YYYY-MM-DD>-<description>` via `add-worktree` (suffixed `-<N>` when that name is taken) and switching the session into it via `enter-worktree`, so planning docs are drafted there while the main checkout stays where it is. Joins the worktree of the same description instead when today already has one. Use when the user says "start a planning session", "checkout a planning branch", runs `/start-planning-session`, or when `add-ticket`, `refine-ticket`, `refine-coding-standards`, `refine-vision`, `add-landing-page`, `refine-landing-page`, `add-skill` or `refine-skill` escalates here because the current branch isn't a planning branch. Refreshes the branch the main checkout has checked out first when it can; never pushes, merges, checks out, or removes anything.
argument-hint: "[description – what this session plans, e.g. glossary terms]"
---

# Start planning session

Get the session into a `planning-<DATE>-<description>` worktree so planning docs are drafted there rather than on the branch the main checkout has checked out, `main` or not.

## Description

$ARGUMENTS

What this session plans, required: the branch and worktree are `planning-<YYYY-MM-DD>-<description>`. Normalize it to kebab-case (`Glossary terms` becomes `glossary-terms`). If empty, ask once with `AskUserQuestion` before creating anything. The recommended answer is the subject the escalating skill holds when one escalated here (the ticket's input, the ticket's slug, `vision`, `coding-standards`, `landing-page`, the skill's name); by hand with nothing said, run `ls docs/tickets/open/` and offer one option per open ticket slug, most recently modified first, the first recommended. The built-in "Other" option covers a typed description, so don't add one.

## Steps

1. If the current branch already matches `planning-<YYYY-MM-DD>` followed by anything (e.g. `planning-2026-10-21-glossary-terms`, `planning-2026-10-21-glossary-terms-2`, or a pre-upgrade `planning-2026-10-21`), stop; the session is already started. The stop comes before the ask, so an empty argument on a planning branch asks nothing.
2. **Refresh the base**, best effort. The base is the branch the main checkout has checked out, `main` or not: `git -C <main checkout> branch --show-current`, the main checkout being the first path in `git worktree list`. When it prints a branch with an upstream (`git -C <main checkout> rev-parse --abbrev-ref @{upstream}` succeeds) and `git -C <main checkout> status --porcelain` is empty: `git -C <main checkout> pull --ff-only`. Otherwise, or if the pull fails (no upstream, detached `HEAD`, dirty tree, offline, diverged), carry on from the base as-is and say so. Never check anything out to get there.
3. **Pick the name.** If `git worktree list` has `.claude/worktrees/planning-<today>-<description>`, take it and say the session is joining it. Otherwise the next free name: `planning-<today>-<description>`, then `planning-<today>-<description>-2`, `-3`, and so on, checking `git branch --list --all` and `ls .claude/worktrees/`.

   The join is the exact match only; a registered `planning-<today>-<description>-2` is not joined.
4. **Create it** when missing: invoke `jodysalt:add-worktree` with that name. It forks the branch from the base into `.claude/worktrees/<name>` and leaves the session where it is.
5. **Enter it.** Invoke `jodysalt:enter-worktree` with that name, which switches the session into the worktree.
6. Confirm the branch name and path, then hand back to whichever skill escalated here.

## Rules

- Only picks a name and delegates. Never edits docs, pushes, merges, or removes a worktree or branch; removal is `jodysalt:remove-worktree`.
- Never stashes, resets, or checks out on the user's behalf; a dirty main checkout only skips the refresh.
- If the user wants to plan on the current branch, respect that and skip.
