---
name: squash-commits
description: Squashes every commit on the current branch since it forked from its base branch – the one the main checkout has checked out, unless named – into one new commit, synthesising the message from the commits being replaced and handing off to the `commit` skill for house style. Use when the user says "squash these commits", "squash the branch", "squash to one commit", or runs `/squash-commits`. Refuses on the base branch; never pushes or force-pushes.
argument-hint: "[base branch – defaults to the branch the main checkout has checked out]"
---

# Squash commits

Collapse the branch's commits since it forked from the base branch into one new commit. Stop at the commit: no push, no force-push, no PR.

## Base branch

$ARGUMENTS

If empty, the base is the branch the main checkout has checked out: `git -C <main checkout> branch --show-current`, the main checkout being the first path in `git worktree list`. When that prints nothing (a detached `HEAD`), or the session is in the main checkout itself so the base would be the current branch, stop and ask for the base by name.

## Steps

1. Check the ground in parallel, and stop at the first failure:
   - `git rev-parse --abbrev-ref HEAD` – must not be the base branch. Refuse otherwise.
   - `git status --porcelain` – must be empty. Otherwise tell the user to commit or stash first; don't stash for them.
   - `git merge-base <base> HEAD` – this is `$BASE`.
   - `git rev-list --count $BASE..HEAD` – fewer than 2 means there is nothing to squash; say so and stop.
2. Read every commit being replaced: `git log --reverse --format='%h %s%n%n%b%n---' $BASE..HEAD`. Their subjects and bodies are the raw material for the new message.
3. Run `git reset --soft $BASE`, then `git status`. Everything from the old commits should now be staged and nothing else. If the tree looks any different, stop and show the user before committing.
4. Invoke the `commit` skill from this plugin (`jodysalt:commit`) with the scope "all staged changes" and follow its house style exactly. For the message:
   - Synthesise from the log read in step 2. Don't concatenate the old subjects.
   - Pick the prefix that describes the net effect of the whole branch.
   - Use a bulleted body when the old commits cover three or more distinct facts.
5. Show `git log -1 --stat`. If the branch was already pushed, tell the user the next push needs `git push --force-with-lease`. Don't run it.

## Rules

- Whole branch only. No partial ranges, no counts, no interactive rebase.
- If the commit hook fails, fix the cause and commit again as a new commit. Never `--no-verify`, never `--amend`.
