---
name: wrap-up-worktree
description: Lands a finished `.claude/worktrees/<name>` worktree on the branch the main checkout has checked out, local `main` in the usual case, in one command – squashes the branch to one commit, merges it fast-forward only, then removes the worktree and its branch; on a ticket branch with no open sub-ticket it closes the ticket and commits the close first, and on one with an open sub-ticket it lands the branch and leaves the ticket open. Use when the user says "wrap up the worktree", "land this worktree", "finish this branch", or runs `/wrap-up-worktree`. Refuses on a dirty checkout, a base branch that moved, or a pending task, before anything changes. Never pushes.
argument-hint: "[worktree name – defaults to the worktree the session is in, else a pick from the existing worktrees]"
---

# Wrap up worktree

Close, squash, merge and remove in one pass, asking nothing on the way through.

## Worktree

$ARGUMENTS

A name under `.claude/worktrees/`. If empty, take the worktree the session is in. If empty and the session is in the main checkout (`git rev-parse --show-toplevel` equals the first path in `git worktree list`), run `git worktree list` and ask with `AskUserQuestion`, one option per registered worktree under `.claude/worktrees/` labelled with its name and branch, never the main checkout. None: say there is no worktree to wrap up and stop. The built-in "Other" option covers a typed name, so don't add one.

## Steps

1. **Enter it.** If the session isn't already in `<main checkout>/.claude/worktrees/<name>`, invoke `jodysalt:enter-worktree <name>`, from the main checkout or from another worktree. Take the worktree's branch from `git worktree list`.
2. **Guard**, in parallel, before anything changes; stop at the first failure with its reason. These duplicate `jodysalt:merge-worktree`'s guards on purpose, so a stop comes before the close commit and the squash rather than after them.
   - `git status --porcelain` in the worktree – must be empty; otherwise say the worktree is dirty and to commit or discard it first.
   - `git -C <main checkout> status --porcelain`, the main checkout being the first path in `git worktree list` – must be empty; otherwise say the main checkout is dirty.
   - `git -C <main checkout> branch --show-current` – must print a branch, the base the worktree lands on; otherwise `HEAD` is detached there: say the main checkout must have a branch checked out.
   - The branch must not be the base; otherwise say there is nothing to land from a worktree on the base branch.
   - `git rev-list --count <base>..<branch>` – must be above 0. Otherwise say there is nothing to merge and offer `jodysalt:remove-worktree <name>`; don't run it.
   - `git merge-base --is-ancestor <base> <branch>` – must succeed. Otherwise the base has commits the branch lacks: say the branch needs rebasing by hand.
   - When `docs/tickets/open/<branch>/` exists, the branch is a ticket branch: every entry in its `tasks.md` must have `- **status:** done`. Otherwise list the unfinished headings. No `tasks.md` at all is fine. On a ticket branch also note whether `ls -d docs/tickets/open/<branch>--* 2>/dev/null` prints anything – the ticket's open sub-tickets. That is not a stop; it decides step 3.
3. **Close the ticket**, on a ticket branch with no open sub-ticket only. Invoke `jodysalt:close-ticket <branch>`, then `jodysalt:commit`, staging explicitly `docs/tickets/open/<branch>`, `docs/tickets/closed/<branch>` and every file `close-ticket` reported rewriting, with the subject `docs: closed the <branch> ticket`. A ticket branch whose step 2 listing printed an open sub-ticket skips the close and keeps those names for step 8: its work lands now and the ticket closes once they have. Any other branch – a planning branch, or a ticket branch whose close was committed before an earlier stop – skips this step too.
4. **Squash:** invoke `jodysalt:squash-commits`, folding the work and the close into one commit.
5. **Leave:** invoke `jodysalt:exit-worktree`, so the session is in the main checkout.
6. **Merge:** invoke `jodysalt:merge-worktree <name>`. Decline the removal it offers afterwards; step 7 does it. If it stops, stop here and report its reason, keeping the worktree and branch.
7. **Remove:** invoke `jodysalt:remove-worktree <name>`, which deletes the now-merged branch unasked.
8. **Report** `git log -1 --stat` on the base branch, naming it, and the references the close rewrote. When step 3 skipped the close, say instead that the ticket was left under `docs/tickets/open/` because its sub-tickets are open, naming them. Otherwise, when `<branch>` holds `--`, name the parent – the slug up to its last `--` – and say whether `ls -d docs/tickets/open/<parent>--* 2>/dev/null` now prints nothing, so the user knows the parent can close once its own tasks are done; never close it.

## Rules

- Never pushes, fetches, stashes, rebases, resets, forces or checks out; the base is whatever the main checkout already has.
- Never removes a worktree or deletes a branch before a successful merge.
- Never closes a parent with an open sub-ticket; landing and closing are two moments for a parent.
