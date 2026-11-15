---
name: rebase-worktree
description: Rebases the branch of a `.claude/worktrees/<name>` worktree onto the branch the main checkout has checked out, local `main` in the usual case, running inside that worktree.
argument-hint: "[worktree name – defaults to the worktree the session is in, else a pick from the existing worktrees]"
disable-model-invocation: true
---

Invoke `jodysalt:playbook rebase-worktree $ARGUMENTS` with the Skill tool.
