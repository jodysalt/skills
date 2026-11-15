---
name: start-planning-session
description: Starts a planning session by creating a fresh `planning-<YYYY-MM-DD>-<description>` branch, the description required, as a git worktree at `.claude/worktrees/planning-<YYYY-MM-DD>-<description>` via `add-worktree` (suffixed `-<N>` when that name is taken) and switching the session into it via `enter-worktree`, so planning docs are drafted there while the main checkout stays where it is.
argument-hint: "[description – what this session plans, e.g. glossary terms]"
disable-model-invocation: true
---

Invoke `jodysalt:playbook start-planning-session $ARGUMENTS` with the Skill tool.
