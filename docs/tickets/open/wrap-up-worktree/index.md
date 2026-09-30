---
title: Wrap Up Worktree
type: feat
initiative: hands-off-delivery
priority: high
---

# Goal
A user who has finished work in a `.claude/worktrees/<name>` checkout runs `/jodysalt:wrap-up-worktree` and gets it landed on local `main` as one commit, with the worktree and its branch gone: the ticket closed and committed when the branch is a ticket's, the branch squashed, the session back in the main checkout, `main` fast-forwarded, and the worktree removed. One command replaces the five a person or `deliver-brief` strings together at the end of every branch today.

# Context
- Landing a branch is `squash-commits`, `exit-worktree`, `merge-worktree` and `remove-worktrees` in that order, preceded on a ticket branch by `wrap-up-ticket` (`close-ticket` then `commit`). `skills/deliver-brief/SKILL.md` spells the four-step tail out three times – step 4 after a planning session, step 5 after a ticket, step 6 when the judge closes the initiative – and runs `wrap-up-ticket` as a sub-agent stage only to move a folder, rewrite paths and commit.
- `wrap-up-ticket`'s only guard nothing else keeps is that every task in `tasks.md` is `done`; `close-ticket` closes a ticket with pending tasks today. Its other guards are covered: `commit` stages explicit paths, `close-ticket` already notes the rename and mentions `close-initiative`.
- `squash-commits` needs a clean tree and says "nothing to squash" below two commits, so the close must be committed before it runs. `merge-worktree` exits the worktree itself and stops on a dirty checkout, a branch on `main`, nothing to merge, or a `main` that moved. `remove-worktrees` takes names and asks before deleting a branch; after a fast-forward the safe `git branch -d` always succeeds.
- Once the close is committed the branch names a closed ticket, so a re-run after a stop skips the close and carries on.
- Checkouts are why `deliver-brief`'s root, not a stage, runs the worktree skills: `EnterWorktree` from a sub-agent moves only that agent.
- `plugin.json` is `0.3.0`; the version bumps on any change to a skill's behaviour. `README.md` lists every skill in a table, and `claude plugin validate . --strict` and `claude plugin validate skills --strict` gate the manifest and frontmatter.

# Scope

In:
- The argument is a worktree name under `.claude/worktrees/`. With none, the worktree the session is in; from the main checkout with none, a pick with `AskUserQuestion`, one option per registered worktree, as `merge-worktree` does. A named worktree the session isn't in is entered first with `enter-worktree`, from the main checkout or from another worktree.
- A ticket branch is one whose name matches `docs/tickets/open/<branch>/`. With any task in its `tasks.md` not `done`, it stops before anything changes and lists the unfinished headings; landing partial work stays with `merge-worktree` by hand. Any other branch, a planning branch among them, skips the close.
- Guards, all before anything changes: the worktree is clean, the main checkout is clean and has `main` checked out, the branch is not `main`, the branch is ahead of `main`, and `main` is an ancestor of the branch. A branch with nothing to merge stops, says so, and offers `remove-worktrees` without running it.
- Then, in order: on a ticket branch `close-ticket` and one `docs: closed the {slug} ticket` commit via `commit`; `squash-commits`; `exit-worktree`; `merge-worktree <name>`; `remove-worktrees <name>`, answering yes to deleting the branch. A merge that fails stops after the exit and keeps the worktree and branch; removal runs only after a successful merge.
- The report: `git log -1 --stat` on `main`, the references the close rewrote, and a mention of `close-initiative` when the owning initiative's last listed ticket just closed, never run.
- `close-ticket` gains the guard: stop when `tasks.md` holds an entry not `done`, listing the unfinished headings. No `tasks.md` is fine. It still never commits.
- `deliver-brief`: the root runs `wrap-up-worktree` in place of the `wrap-up-ticket` stage and the squash/exit/merge/remove tail in steps 4, 5 and 6; the step 3 resume cursor's "every entry done" continues at step 5 from `wrap-up-worktree` on; the stage list and the root-run skill list follow.
- Retire `wrap-up-ticket`: delete `skills/wrap-up-ticket/`, replace its `README.md` row with one for `wrap-up-worktree`, and rewrite the `hands-off-delivery` outcome's mention of it.
- `plugin.json` to `0.4.0`.

Out:
- A new `remove-worktree` skill; `remove-worktrees` takes names.
- `deliver-brief`'s resume rule that merges and removes a leftover worktree with commits not on `main`; it lands without closing on purpose and stays as it is.
- Pushing, fetching, rebasing, merge commits, stashing or forcing anything.
- Closing initiatives.
- Edits to closed tickets that name `wrap-up-ticket`; they are project memory.
- Eval suites; those belong to the *Evals for the risky skills* bet.

# Acceptance criteria
- In a throwaway repo, from inside a ticket worktree whose `tasks.md` is all `done` and which holds several commits, `/jodysalt:wrap-up-worktree` leaves `main` one commit ahead holding the work and the ticket under `docs/tickets/closed/{slug}/`, the initiative's `## Tickets` list rewritten to the `closed/` path, the session in the main checkout, and no worktree or branch named `{slug}`.
- From a planning worktree it lands the branch as one commit without touching any ticket.
- With a task not `done`, it lists the unfinished headings and changes nothing.
- With a dirty worktree, a dirty main checkout, a commit on `main` the branch lacks, or a worktree on `main`, it changes nothing and says why.
- With nothing to merge, it says so, offers `remove-worktrees`, and changes nothing.
- Re-run after a stop that followed the close commit, it skips the close and lands the branch.
- From the main checkout with a name, it enters that worktree and lands it; with no name, it asks with one option per worktree and never offers the main checkout.
- `close-ticket` run alone on a ticket with a pending task stops and lists it.
- `skills/wrap-up-ticket/` is gone; `grep -rn wrap-up-ticket skills README.md docs/initiatives/open` finds nothing; `deliver-brief` names `wrap-up-worktree` where it named the stage and the tail.
- Nothing is pushed or fetched.
- `README.md` has a row for `wrap-up-worktree`, `plugin.json` is `0.4.0`, and both `claude plugin validate` commands pass with `--strict`.

# Implementation notes
- `skills/wrap-up-worktree/SKILL.md` in the worktree family's shape: frontmatter with `name`, a `description` naming the trigger phrases ("wrap up the worktree", "land this worktree", "finish this branch") and `/wrap-up-worktree`, an `argument-hint`, a `## Worktree` argument section, Steps and Rules.
- Steps: (1) resolve and enter the worktree; (2) guards in parallel, the ticket check included; (3) close and commit on a ticket branch; (4) `squash-commits`; (5) `exit-worktree`; (6) `merge-worktree <name>`; (7) `remove-worktrees <name>`, yes to the branch; (8) report. Rules: never pushes, fetches, stashes, rebases or forces; never removes before a successful merge; never closes an initiative.
- The guards duplicate `merge-worktree`'s on purpose: checked there, they would fire after the close commit and the squash.
- `close-ticket` step 1 gains the tasks guard; its description can say it refuses while a task is pending.
- `deliver-brief`: steps 4, 5 and 6 and the `## Rules` and stage lists near the top; keep the rule that `main` changes only through `merge-worktree`, which this skill calls.

# Test plan
- `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.
- Manual, throwaway repo: `git init`, the layout from `setup-skills`, an initiative and a ticket with a two-entry `tasks.md`, `add-worktree` the ticket and commit twice on it, then each acceptance case in turn: a ticket branch, a planning branch, a pending task, a dirty worktree, a dirty main checkout, a commit on `main` first, nothing to merge, a re-run after the close commit, a run from the main checkout with a name and without one, and `close-ticket` alone on a pending task.
- Manual, this repo: the rollout run below.

# Rollout
- Bump `plugin.json` to `0.4.0`; merging to `main` is the release, and users on auto-update get the skill at their next session. No flags or migrations; fallback is reverting the commit.
- The ticket branch is the skill's first run: `claude --plugin-dir .claude/worktrees/wrap-up-worktree` loads the skill from the ticket worktree, and `/jodysalt:wrap-up-worktree wrap-up-worktree` lands it.

## Strategic fit
Advances `hands-off-delivery` by turning the end of every branch into one root-run skill: `deliver-brief` loses a sub-agent stage per ticket and three copies of the same tail, and a person landing a branch by hand runs the same skill it does. It serves *Driver-agnostic* and *One opinionated method* from `vision.md`, and moves the tasks-done guard to `close-ticket`, where *Unattended work needs structure* says it belongs. It respects the initiative's non-goal on pushing: local `main` only, fast-forward only.
