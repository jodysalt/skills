---
title: Wrap Up Rebase
type: feat
priority: high
---

# Goal
`/jodysalt:wrap-up-worktree` lands a branch whose base moved on: it closes, squashes, rebases the one squashed commit onto the base through `jodysalt:rebase-worktree`, then merges fast-forward and removes, instead of stopping with "needs rebasing by hand". `merge-worktree` stays the fast-forward-only final check and points a stopped user at `/jodysalt:rebase-worktree <name>`, and `deliver-brief` allows the rebase inside its landing, aborting on a conflict because its run is unattended.

# Context
- Parent: `docs/tickets/closed/rebase-worktree/index.md`. This slice moves its criteria 8 (`wrap-up-worktree` on a moved base closes, squashes, rebases, merges and removes; a conflict stop keeps the worktree and branch; a rerun lands it) and 9 (`merge-worktree` behind its base points at `/jodysalt:rebase-worktree <name>`), the parent's `deliver-brief` rule change, and both `validate` runs of criterion 10 again. Left for a later slice: criterion 5 (the opted-in sandbox re-verify inside `rebase-worktree`) and the `plugin.json` bump to `0.20.0`.
- Builds on the closed slice `docs/tickets/closed/rebase-worktree--core-skill/index.md`, which delivered `skills/rebase-worktree/SKILL.md`: it enters the worktree, guards (clean worktree, no rebase in progress, main checkout on a branch, branch not the base), ends as a success with "nothing to rebase" when the base is an ancestor, walks each conflicting file with a person, aborts without asking in an unattended run, and always reports the branch untested on the new base, plus the `--force-with-lease` note when the branch has an upstream. It already has a `README.md` row.
- `skills/wrap-up-worktree/SKILL.md` today: step 2's guard intro says its guards "duplicate `jodysalt:merge-worktree`'s guards on purpose, so a stop comes before the close commit and the squash"; its `git merge-base --is-ancestor <base> <branch>` bullet stops with "needs rebasing by hand"; steps 3 close, 4 squash, 5 exit, 6 merge, 7 remove, 8 report; its description lists "a base branch that moved" among its refusals; its Rules line reads "Never pushes, fetches, stashes, rebases, resets, forces or checks out"; its intro reads "Close, squash, merge and remove in one pass, asking nothing on the way through." Step 3 already skips the close on "a ticket branch whose close was committed before an earlier stop", which is what makes a rerun after a rebase stop safe.
- `skills/merge-worktree/SKILL.md` step 3's ancestor bullet says "say the branch needs rebasing by hand, and stop without a merge commit or a rebase"; its Rules line reads "a branch that can't fast-forward is the user's to rebase". Its description's "a base branch that moved ... stops it" stays true: it remains fast-forward only.
- `skills/deliver-brief/SKILL.md` step 6 (**Land**) says "A merge that cannot fast-forward ends the run with the stop report"; its Rules line reads "The base branch changes only by fast-forward merge through `jodysalt:wrap-up-worktree` ... Never a merge commit, a rebase, a reset or a checkout." The root runs `wrap-up-worktree` itself, not through a stage prompt, so the unattended framing for the rebase is the root's own.
- *unattended* is the glossary's sense (`docs/glossary.md`): the caller's framing is the only signal. `wrap-up-worktree` gains no mode of its own; `rebase-worktree` reads the framing of the run it is invoked in.
- `README.md`'s `wrap-up-worktree` row repeats the description's "a base branch that moved" refusal.
- This repo has no test suite; checks are `grep`, `claude plugin validate .` and `claude plugin validate skills`. Not `--strict`: the repo's existing missing-icon warning fails a strict run.

# Scope
In:
- **`skills/wrap-up-worktree/SKILL.md`:**
  - Step 2: drop the `git merge-base --is-ancestor` bullet and the guard intro's "duplicate `jodysalt:merge-worktree`'s guards on purpose" sentence; the remaining guards still run before the close commit and the squash.
  - A new step after **Squash** and before **Leave**: **Rebase**, invoking `jodysalt:rebase-worktree <name>` in the worktree. "Nothing to rebase" is a success and the run carries on. If it stops – a guard, a conflict aborted in an unattended run, or a person's bail – stop here and report its reason, keeping the worktree and branch; a rerun of `/jodysalt:wrap-up-worktree <name>` is safe because step 3 recognises the close as already made.
  - Renumber: close → squash → rebase → exit → merge → remove → report, and fix every in-step cross-reference ("decides step 3", "for step 8", "step 7 does it", "When step 3 skipped").
  - Report: relay `rebase-worktree`'s untested-on-the-new-base note and its `--force-with-lease` note when it rebased.
  - Description: drop "a base branch that moved" from the refusals and say it rebases onto a moved base through `rebase-worktree` before the merge.
  - Intro line: no longer "asking nothing on the way through" without qualification – it asks only when a rebase conflicts in a person's run.
  - Rules: "rebases" leaves the never-list; a line says it rebases only through `jodysalt:rebase-worktree`.
- **`skills/merge-worktree/SKILL.md`:** stays fast-forward only. Step 3's ancestor stop says to run `/jodysalt:rebase-worktree <name>` first, still stopping without a merge commit or a rebase of its own; the Rules line points at `/jodysalt:rebase-worktree <name>` instead of "the user's to rebase".
- **`skills/deliver-brief/SKILL.md`:** step 6 says the root runs `wrap-up-worktree` as an unattended run, so a rebase conflict aborts with the branch unchanged and ends the run with the stop report, as a merge that cannot fast-forward does. The base-change rule allows the rebase of the ticket's branch inside `jodysalt:wrap-up-worktree` (the branch is rebased, the base itself still changes only by fast-forward), and no other rebase.
- **`README.md`:** the `wrap-up-worktree` row drops "a base branch that moved" from its refusals, matching the description.

Out:
- The sandbox re-verify step in `rebase-worktree` (parent criterion 5); a later slice.
- `.claude-plugin/plugin.json` to `0.20.0`; a later slice.
- `skills/rebase-worktree/SKILL.md`: unchanged.
- `complete-ticket-slice`'s landing on the ticket branch: stays fast-forward only (parent's Out).
- `docs/glossary.md`: not edited.

# Acceptance criteria
- `grep -n "is-ancestor\|rebasing by hand\|on purpose" skills/wrap-up-worktree/SKILL.md` prints nothing.
- `skills/wrap-up-worktree/SKILL.md` has a step invoking `jodysalt:rebase-worktree` numbered after the `jodysalt:squash-commits` step and before the `jodysalt:exit-worktree` step, in the order close, squash, rebase, exit, merge, remove, report; the steps are numbered 1 to 9 with no gap, and every "step N" reference names the step it meant before the renumber.
- That step says a `rebase-worktree` stop ends the run keeping the worktree and branch, and that a rerun is safe because the close is already recognised as made.
- Its `description` no longer holds "a base branch that moved"; its Rules hold "rebases only through `jodysalt:rebase-worktree`" and the never-list no longer holds "rebases".
- `grep -n "rebasing by hand\|user's to rebase" skills/merge-worktree/SKILL.md` prints nothing, and `grep -c "/jodysalt:rebase-worktree <name>" skills/merge-worktree/SKILL.md` prints 2 (step 3 and Rules); `git merge --ff-only` is still its only merge.
- `skills/deliver-brief/SKILL.md` step 6 says a rebase conflict aborts and ends the run with the stop report; its base-change rule names the rebase inside `jodysalt:wrap-up-worktree` as allowed and still forbids a merge commit, a reset and a checkout.
- `README.md`'s `wrap-up-worktree` row no longer holds "a base branch that moved".
- `claude plugin validate .` and `claude plugin validate skills` pass.
- `git diff --stat rebase-worktree` lists exactly `skills/wrap-up-worktree/SKILL.md`, `skills/merge-worktree/SKILL.md`, `skills/deliver-brief/SKILL.md` and `README.md`, this ticket's own files aside.

# Implementation notes
- The rebase runs after the squash so a conflict surfaces once, against one commit, and before the exit so `rebase-worktree` runs in the worktree the session is already in; its step 1 then enters nothing.
- `rebase-worktree`'s guards overlap step 2's (clean worktree, main checkout on a branch, branch not the base); keep step 2's, since they must stop before the close commit. Its rebase-in-progress guard is not duplicated.
- On a rerun after a rebase stop the ticket is already under `docs/tickets/closed/`, so step 2 does not treat the branch as a ticket branch and step 3 skips the close; `squash-commits` finds one commit and says there is nothing to squash, which the run carries past as today.
- Keep the wording of the new step close to step 6's merge-stop sentence ("If it stops, stop here and report its reason, keeping the worktree and branch").
- `deliver-brief` step 6 and Rules are the only `deliver-brief` edits; its step 1 guards and stage prompt stay.

# Test plan
- The `grep` and `git diff --stat` checks in the criteria.
- `claude plugin validate .` and `claude plugin validate skills`.
- Left for a person (an interactive session with `claude --plugin-dir .claude/worktrees/rebase-worktree`, a throwaway repo with a ticket branch worktree and a non-conflicting commit added to `main`): `/jodysalt:wrap-up-worktree <name>` closes, squashes, rebases, merges and removes with no "needs rebasing by hand" stop; with a conflicting commit on `main` and a bail, the worktree and branch stay, and a rerun after resolving lands it; `/jodysalt:merge-worktree <name>` on a branch behind `main` stops pointing at `/jodysalt:rebase-worktree <name>`.

# Rollout
Lands on the `rebase-worktree` branch as one commit; no version bump in this slice, the parent's last slice bumps to `0.20.0`. Fallback is reverting the commit, which restores the "needs rebasing by hand" stop.

## Strategic fit
Advances `rebase-worktree` by wiring the landed core skill into `wrap-up-worktree`, so a moved-base landing proceeds instead of stopping, and by pointing `merge-worktree` and `deliver-brief` at it.
