---
title: Merge Worktree
type: feat
initiative: hands-off-delivery
priority: high
---

# Goal
A user who has finished a branch in a `.claude/worktrees/<name>` checkout runs `/jodysalt:merge-worktree <name>` and gets it fast-forwarded into local `main`, with the same guards the rest of the workflow keeps: nothing pushed, nothing forced, nothing invented. It closes the one gap in the chain a person still bridges by hand, so `jarvis` can run the whole flow, and it is useful by hand from the day it lands.

# Context
- The worktree family is `add-worktree`, `enter-worktree`, `exit-worktree`, `list-worktrees`, `remove-worktrees` and `show-worktree`, all under `.claude/worktrees/<branch>` at the repo root. `add-worktree` forks new branches from local `main` and runs only from the main checkout; `remove-worktrees` invokes `exit-worktree` first when the session is inside a worktree; `squash-commits` runs inside the branch's checkout and refuses on `main`.
- Nothing merges. `wrap-up-ticket`, `close-ticket`, `add-worktree` and `commit` each say "never merges"; the merge into `main` after a ticket, and after a planning session, is the step a person does by hand today.
- The `hands-off-delivery` initiative fixes the shape: every branch ends with `squash-commits`, reaches `main` as one commit through this skill, fast-forward only, and `remove-worktrees` clears the worktree and branch afterwards. A merge that cannot fast-forward stops rather than inventing a merge commit or a rebase.
- `plugin.json` is still at `0.1.0`. The version rule in `vision.md` says it bumps on any change to a skill's behaviour, and the `setup-skills` ticket's rollout called for a bump that never landed, so this ticket's bump is overdue on two counts.
- `README.md` lists every skill in a table; a new skill needs a row. `claude plugin validate . --strict` and `claude plugin validate skills --strict` gate the manifest and frontmatter.

# Scope

In:
- One new skill, `skills/merge-worktree/SKILL.md`, run as `/jodysalt:merge-worktree <name>`, plus its README row and the plugin version bump.
- The argument is a worktree name: `.claude/worktrees/<name>` must be registered in `git worktree list`, and the branch it has checked out is what gets merged. With no argument, a pick from the existing worktrees with `AskUserQuestion`, as `enter-worktree` and `remove-worktrees` do; the main checkout is never a candidate.
- Runs from the main checkout. If the session is inside a worktree, it invokes `exit-worktree` first, as `remove-worktrees` does, and when the argument is empty the worktree just left is the default pick.
- Guards, all before anything changes: the worktree is registered in `git worktree list`; its branch is not `main`; the main checkout is clean, else stop and say commit or stash; the worktree is clean, else the same; the branch is ahead of `main`, else say there is nothing to merge; and `main` is an ancestor of the branch, else stop and say the branch needs rebasing by hand. Never stash, reset or force.
- Unsquashed branches merge as they are. The report says how many commits came over and mentions `squash-commits` when it was more than one.
- After the merge: `git log -1 --stat` and the count, then an offer to invoke `remove-worktrees` for that worktree, never run unasked.

Out:
- Merging a branch that has no worktree; that is `git merge` by hand.
- Anything but a fast-forward into local `main`: no merge commits, no rebase, no `--no-ff`, no other target branch.
- Pushing, fetching, or touching a remote.
- Removing the worktree or deleting the branch; that stays with `remove-worktrees`.

# Acceptance criteria
- In a throwaway repo with a worktree one squashed commit ahead of `main`, `/jodysalt:merge-worktree <name>` fast-forwards `main` to that commit, leaves the worktree and branch in place, reports `git log -1 --stat`, and offers `remove-worktrees`.
- With a dirty main checkout, or a dirty worktree, it changes nothing and says which is dirty and to commit or stash first.
- With a commit on `main` the branch lacks, it changes nothing and says the branch needs rebasing by hand: no merge commit, no rebase.
- With the worktree's branch already merged, it says there is nothing to merge and changes nothing.
- Naming the main checkout, a name absent from `git worktree list`, or a worktree whose branch is `main` stops with the reason.
- Run from inside a worktree, it invokes `exit-worktree` first and, with no argument, defaults to the worktree just left. From the main checkout with no argument and several worktrees, it asks with one option per worktree and never offers the main checkout.
- A branch of several commits merges as it is, and the report gives the count and mentions `squash-commits`.
- Nothing is pushed or fetched at any point.
- `README.md` has a row for `merge-worktree`, `plugin.json` is `0.2.0`, and both `claude plugin validate` commands pass with `--strict`.

# Implementation notes
- One file, `skills/merge-worktree/SKILL.md`, in the shape of the worktree family: frontmatter with `name`, `description` naming the trigger phrases and `/merge-worktree`, an `argument-hint`, a `## Worktree` argument section, Steps and Rules.
- Steps, in order: (1) if `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, invoke `jodysalt:exit-worktree` and remember the name for the default pick; (2) resolve the argument to `<main checkout>/.claude/worktrees/<name>` and its branch from `git worktree list`, or with no argument take the worktree just left, else `AskUserQuestion` with one option per worktree under `.claude/worktrees/`; (3) guards in parallel: `git status --porcelain` in the main checkout, `git -C <worktree> status --porcelain`, `git rev-list --count main..<branch>` for ahead, `git merge-base --is-ancestor main <branch>` for fast-forwardability, and the branch is not `main`; (4) `git merge --ff-only <branch>` from the main checkout; (5) report `git log -1 --stat` and the commit count, mention `squash-commits` when it was more than one, and offer `jodysalt:remove-worktrees <name>`.
- Description names the trigger phrases "merge the worktree", "merge X into main", "land the X branch" and `/merge-worktree`, and says fast-forward only, never pushes, never removes.
- Rules: never stash, reset, force or `--no-ff`; never pushes or fetches; never removes a worktree or deletes a branch; the target is local `main` only.
- A README row in the table's style, and `plugin.json` to `0.2.0`.

# Test plan
- `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.
- Manual, throwaway repo: `git init`, one commit on `main`, `add-worktree` a branch and commit on it, then run each acceptance case in turn: the happy path, a dirty main checkout, a dirty worktree, a commit on `main` first, an already-merged branch, a worktree on `main`, an unknown name, a run from inside the worktree with no argument, and the pick with two worktrees. Commit twice on the branch for the `squash-commits` mention.
- Manual, this repo: the rollout run below.

# Rollout
- Bump `plugin.json` to `0.2.0`; merging to `main` is the release, and users on auto-update get the skill at their next session. No flags or migrations; fallback is reverting the commit.
- The planning branch that drafted this ticket merges by hand, the last such merge. The ticket branch is the skill's first merge: from the main checkout, `claude --plugin-dir .claude/worktrees/merge-worktree` loads the skill from the ticket worktree, and `/jodysalt:merge-worktree merge-worktree` lands it, followed by `remove-worktrees` by hand.

## Strategic fit
The first ticket of `hands-off-delivery` and the step its outcome cannot do without: `main` changes only by merge, and nothing in the plugin merges. It serves *One thing, then stop* from `vision.md`, a skill that merges and leaves removal to `remove-worktrees`, and *Driver-agnostic*, since a person and `jarvis` run the same skill the same way. It respects the initiative's non-goal on pushing: local `main` only, never a remote.
