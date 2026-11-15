---
name: remove-worktree
description: Removes one git worktree under `.claude/worktrees/` at the repo root and deletes its branch with the safe `git branch -d` when that branch is merged, keeping an unmerged branch and saying so.
argument-hint: "[worktree name – defaults to the worktree the session is in]"
disable-model-invocation: true
---

Invoke `jodysalt:playbook remove-worktree $ARGUMENTS` with the Skill tool.
