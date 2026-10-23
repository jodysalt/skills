---
title: Rebase Worktree
type: feat
priority: high
---

# Goal
A worktree branch whose base branch moved on while it was being worked on lands without a person rebasing it by hand. `/jodysalt:rebase-worktree` replays the branch onto the base. When the replay conflicts and a person is present, the agent works through each conflict with them; when the run is unattended, it aborts and stops with the branch unchanged, so no tool ever decides on its own how two changes combine.

# Context
- `merge-worktree` and `wrap-up-worktree` both stop with "needs rebasing by hand" when `git merge-base --is-ancestor <base> <branch>` fails (`skills/merge-worktree/SKILL.md`, `skills/wrap-up-worktree/SKILL.md`), and both list "rebase" among the things they never do. `deliver-brief`'s rules say the base changes "never [by] a merge commit, a rebase, a reset or a checkout".
- That rule comes from the closed `hands-off-delivery` initiative: "a merge that cannot fast-forward stops the run rather than inventing a merge commit or a rebase." This ticket reverses the rebase half of it on purpose. The intent it kept, that no tool decides alone how two changes combine, still holds through the conflict handling below.
- *unattended* is the glossary's sense: the caller's framing is the only signal.
- The sandbox opt-in is `complete-task`'s: `Dockerfile.sandbox` exists at the checkout root and its first line is not `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`. `add-tasks` ends every ticket's list with one full-suite gate entry.
- `squash-commits` already tells the user a pushed branch needs `git push --force-with-lease`, never running it; this skill follows suit.
- `plugin.json` is at `0.19.0`. `README.md` lists every skill in a table.

# Scope

In:
- One new skill, `skills/rebase-worktree/SKILL.md`, run as `/jodysalt:rebase-worktree [name]`, which rebases a worktree's branch onto the base – the branch the main checkout has checked out – running inside that worktree.
- Argument: a name under `.claude/worktrees/`. Empty: the worktree the session is in; from the main checkout, `AskUserQuestion` with one option per registered worktree, as `wrap-up-worktree` does. It enters the worktree through `jodysalt:enter-worktree` when needed and leaves the session there.
- Guards before anything changes: the worktree is clean; the main checkout has a branch checked out (the base); the worktree's branch is not the base. A dirty main checkout is fine, since the rebase only reads the base.
- Base already an ancestor of the branch: say there is nothing to rebase, change nothing, and count it a success.
- Conflicts, attended: the agent stops at the conflict and goes through the conflicting files one at a time. For each it shows both sides and proposes a resolution with `AskUserQuestion` (take the base's side, take the branch's side, the proposed combination, or edit by hand), applies the choice and runs `git rebase --continue`. A bail at any point runs `git rebase --abort`, leaving the branch as it was.
- Conflicts, unattended: always `git rebase --abort`, then stop, listing the conflicting files.
- Re-verify after a rebase that replayed the branch onto new base commits, a resolved one included: when the repo has opted in to the sandbox and the branch is a ticket branch whose `tasks.md` – `docs/tickets/open/<branch>/`, else `docs/tickets/closed/<branch>/`, since `wrap-up-worktree` has closed it by then – holds a full-suite gate entry, run that gate's command through `jodysalt:run-in-sandbox` and wait; a failure stops, the rebased branch kept for a person. Not opted in, or no gate (a planning branch): the report says the branch is untested on the new base.
- Report: how many commits were replayed onto which base, the re-verify result or the untested note, and, when the branch has an upstream, that the next push needs `git push --force-with-lease`, never run.
- `wrap-up-worktree` calls it after the squash and before leaving the worktree: close → squash → `jodysalt:rebase-worktree` → exit → merge → remove, so a conflict surfaces once, in one commit. Its `is-ancestor` guard ("needs rebasing by hand") is dropped, its description loses "a base branch that moved" from its refusals, and its "never rebases" rule becomes "rebases only through `jodysalt:rebase-worktree`". A stop there keeps the worktree and branch; a rerun is safe because the close commit is already recognised as made.
- `merge-worktree` stays fast-forward only, the final check; its "needs rebasing by hand" stop points at `/jodysalt:rebase-worktree <name>` instead.
- `deliver-brief`'s rule on how the base changes allows the rebase inside `wrap-up-worktree`. Its run is unattended, so a conflict aborts and ends in its stop report.
- README row; `plugin.json` to `0.20.0`.

Out:
- An agent resolving a conflict without a person approving each resolution.
- `complete-ticket-slice`'s landing on the ticket branch: it stays fast-forward only, and `rebase-worktree` takes no base-branch argument. Slices land one at a time, so the parent branch does not move under one.
- Fetching, pushing, or rebasing onto a remote branch; the base is the local branch as-is.
- Merge commits, `--no-ff`, resets or forces anywhere.
- An eval suite for the skill; a candidate for a later ticket under *Evals for the risky skills*, since it rewrites history in unattended runs.

# Acceptance criteria
- With the base not moved, `/jodysalt:rebase-worktree <name>` says there is nothing to rebase and changes nothing.
- With the base moved and no conflict, the branch is replayed onto the base, and `git merge-base --is-ancestor <base> <branch>` then succeeds.
- With a conflict and a person present, each conflicting file is offered with both sides and a proposed resolution; the chosen resolutions land and the rebase completes. A bail mid-way aborts, and the branch's tip is the same commit as before.
- With a conflict in a run declared unattended, it aborts without asking, the branch's tip is unchanged, and the conflicting files are listed.
- In an opted-in repo, a rebased ticket branch has its full-suite gate run through `run-in-sandbox`; a failing gate stops it with the failures. Without the opt-in or a gate, the report says the branch is untested on the new base.
- A dirty worktree, a detached `HEAD` in the main checkout, or a worktree on the base branch stops it before anything changes.
- A branch with an upstream gets the `--force-with-lease` note; nothing is pushed or fetched.
- `/jodysalt:wrap-up-worktree` on a ticket branch whose base moved closes, squashes, rebases, merges fast-forward and removes, with no "needs rebasing by hand" stop. A conflict stop leaves the worktree and branch in place, and a rerun after resolving lands it.
- `merge-worktree` on a branch behind its base still stops, pointing at `/jodysalt:rebase-worktree <name>`.
- `README.md` has a row for `rebase-worktree`, `plugin.json` is `0.20.0`, and `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.

# Implementation notes
- `skills/rebase-worktree/SKILL.md` in the worktree family's shape: frontmatter with `name`, a `description` naming trigger phrases ("rebase the worktree", "rebase X onto main", "update the branch from main") and `/rebase-worktree` and saying it never pushes or fetches, an `argument-hint`, a `## Worktree` argument section, Steps and Rules.
- Steps, roughly: (1) resolve and enter the worktree; (2) guards in parallel; (3) the ancestor check, stopping as a success when the base has not moved; (4) `git rebase <base>`; (5) on conflict, `git diff --name-only --diff-filter=U` for the files, then the attended walk or the unattended abort; (6) the opted-in re-verify; (7) the report.
- Rules: never pushes, fetches, merges, resets or forces; never resolves a conflict without a person's choice; aborts rather than leaving a rebase in progress when it stops.
- `skills/wrap-up-worktree/SKILL.md`: drop the ancestor guard and its "duplicate on purpose" mention of it, insert the rebase step after `squash-commits`, renumber, and update the description and Rules.
- `skills/merge-worktree/SKILL.md`: the step 3 ancestor stop and the Rules line point at `jodysalt:rebase-worktree`.
- `skills/deliver-brief/SKILL.md`: the base-change rule names the rebase inside `wrap-up-worktree` as allowed.

# Test plan
- `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.
- Manual, throwaway repo: `git init`, a commit on `main`, `add-worktree` a branch with a commit, then each case: base not moved; a non-conflicting commit on `main` (clean rebase); a conflicting commit on `main` resolved together; the same with a bail (tip unchanged); the same with the run framed as unattended (abort, no question); an opted-in `Dockerfile.sandbox` with a gate that passes and one that fails; a dirty worktree; and `wrap-up-worktree` end to end on a moved base.
- Manual, this repo: the rollout run below.

# Rollout
- Bump `plugin.json` to `0.20.0`; merging to `main` is the release, and users on auto-update get it at their next session. No flags or migrations; fallback is reverting the commit, which restores the "needs rebasing by hand" stop.
- The ticket branch lands through the updated `wrap-up-worktree` loaded with `claude --plugin-dir .claude/worktrees/rebase-worktree`, so its first moved-base landing is its own.

## Strategic fit
Stands on the core problem *Unattended work needs structure*: a `deliver-brief` or `complete-ticket` run that finishes while `main` moved today stops on "needs rebasing by hand", a chore with no judgement in it when nothing conflicts. It keeps *One thing, then stop* – rebasing is its own skill, merging stays with `merge-worktree` – and *Driver-agnostic*, since the attended and unattended paths differ only by the caller's framing. It respects the non-goal *A home for standalone skills*: `wrap-up-worktree` calls it, so the method uses it.
