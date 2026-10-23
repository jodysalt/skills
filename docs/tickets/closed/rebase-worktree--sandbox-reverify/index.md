---
title: Sandbox Reverify
type: feat
priority: high
---

# Goal
After `/jodysalt:rebase-worktree` replays a branch onto new base commits, a repo that has opted in to the sandbox gets its tests re-run on the new base through `jodysalt:run-in-sandbox`, so a rebase that combined cleanly but broke the tests stops before it lands instead of merging untested. A repo without the opt-in is told plainly that the branch is untested on the new base.

# Context
- Parent: `docs/tickets/closed/rebase-worktree/index.md`, its last slice. This slice moves the parent's last unmet criteria: 5 (the opted-in re-verify, else the untested note) and the `plugin.json` `0.20.0` part of 10, plus both `validate` runs of 10 again.
- Builds on the closed slices `docs/tickets/closed/rebase-worktree--core-skill/index.md` (delivered `skills/rebase-worktree/SKILL.md`, which always reports "the branch is untested on the new base") and `docs/tickets/closed/rebase-worktree--wrap-up-rebase/index.md` (wired it into `wrap-up-worktree` as step 5, after the close and squash, before exit and merge).
- `skills/rebase-worktree/SKILL.md` today: step 3 ends as a success with "nothing to rebase" when the base is an ancestor; step 4 runs `git rebase <base>` and goes to step 6 on a clean finish; step 5 walks conflicts (attended) or aborts (unattended), each resolved stop ending in `git rebase --continue`; step 6 **Report** gives the count replayed, the new tip, "that the branch is untested on the new base", and the `--force-with-lease` note. Its description does not mention the untested note. Its Rules: never pushes, fetches, merges, resets, stashes or forces.
- The sandbox opt-in is `complete-task`'s (`skills/complete-task/SKILL.md` step 6): `Dockerfile.sandbox` exists at the checkout root and its first line is not `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`. There, a `docker info` failure or a refused `docker` call is a blocker, never a fallback to the host.
- No ticket-gate lookup: most tickets are worked through slices, so a ticket branch's own `tasks.md` rarely holds `add-tasks`'s full-suite gate, and planning branches have none. The re-verify runs the repo-wide tests instead, on any branch.
- `run-in-sandbox` (`skills/run-in-sandbox/SKILL.md`), given the target "the tests", resolves the project's default test command from the manifest scripts and `CLAUDE.md`: one clear match runs; several are asked about once (an unattended run takes the recommended match); none stops with the candidates listed. It mounts the current checkout root at `/app` (the worktree, since `rebase-worktree` leaves the session there), and, when the caller is unattended or says it needs the result, waits for every run and reports exit code and failures in the same turn; in a plain person's run it would end the turn instead.
- `skills/wrap-up-worktree/SKILL.md` step 5 lists `rebase-worktree`'s stops as "a guard, a conflict aborted in an unattended run, or a person's bail"; step 9 relays "`rebase-worktree`'s note that the branch is untested on the new base" when step 5 rebased.
- `.claude-plugin/plugin.json` is `0.19.0`.
- *unattended* and *project command* are the glossary's senses (`docs/glossary.md`). The test command is a project command.
- This repo has no test suite and no `Dockerfile.sandbox`; checks are `grep`, `claude plugin validate .` and `claude plugin validate skills`. Not `--strict`: the repo's existing missing-icon warning fails a strict run.

# Scope
In:
- **`skills/rebase-worktree/SKILL.md`:** a new step, **Re-verify**, between the conflict step and the report (renumbering the report to 7 and fixing step 4's "go to step 6" to the re-verify step). It runs only when step 4's rebase completed, directly or after step 5's resolved conflicts; "nothing to rebase" (step 3) and every abort skip it.
  - Opted in (the `complete-task` test above), on any branch, planning branches included: invoke `jodysalt:run-in-sandbox` with the target "the tests", saying it needs the result, and wait for it.
  - The run exits 0: the re-verify passed; carry on to the report.
  - A non-zero exit, or `run-in-sandbox` stopping because it cannot resolve one test command: stop with its report (failures and log path, or the candidates listed), the rebased branch kept as it is (no abort, no reset) for a person. A `docker info` failure or a refused `docker` call stops the same way, as `complete-task`'s blocker, naming Docker or the refused permission; never runs the tests on the host.
  - Not opted in (no `Dockerfile.sandbox`, or the placeholder): run nothing; the report says the branch is untested on the new base and why.
  - Report: states the re-verify result (the resolved test command and that it passed in the sandbox) or the untested note with its reason, in place of today's unconditional untested line.
  - Description: adds that in a repo opted in to the sandbox it re-runs the tests through `run-in-sandbox` after a rebase, stopping on a failure with the rebased branch kept.
  - Rules: never runs the tests on the host.
- **`skills/wrap-up-worktree/SKILL.md`:** step 5's stop list gains "a failing re-verify", still keeping the worktree and branch, and says the person fixes the failures on the branch before a rerun; step 9 relays `rebase-worktree`'s re-verify result or its untested note, instead of only the untested note.
- **`README.md`:** the `rebase-worktree` row mentions the opted-in re-verify, matching the description.
- **`.claude-plugin/plugin.json`:** `version` `0.19.0` → `0.20.0`.
- **`docs/tickets/closed/rebase-worktree/index.md`** (the parent): its Scope bullet "Re-verify after a rebase…" and acceptance criterion 5 say the repo-wide tests ("the tests" through `run-in-sandbox`) run when opted in, with no ticket-gate lookup; without the opt-in the report says untested. Its Context sentence "`add-tasks` ends every ticket's list with one full-suite gate entry." is dropped, and its Test plan's "a gate that passes and one that fails" becomes tests that pass and tests that fail.

Out:
- Re-verifying after "nothing to rebase", or on a rerun after a re-verify stop: by then the base is an ancestor, so the rerun lands what the person fixed and verified.
- Any `tasks.md` or full-suite gate lookup, on the branch or its sub-tickets.
- Running the tests on the host when the repo is not opted in.
- `merge-worktree`, `deliver-brief`, `complete-ticket-slice`: unchanged.
- `docs/glossary.md`: not edited.

# Acceptance criteria
- `skills/rebase-worktree/SKILL.md` has a re-verify step numbered after the conflict step and before the report, with steps numbered 1 to 7 and no gap; step 4's clean-finish jump names the re-verify step.
- That step names the opt-in test (`Dockerfile.sandbox` at the checkout root, first line not the placeholder marker) and `jodysalt:run-in-sandbox` with the target "the tests" and the result waited for, on any branch; `grep -n "tasks.md\|Run full test suite" skills/rebase-worktree/SKILL.md` prints nothing.
- It says a failing run, or `run-in-sandbox` unable to resolve one test command, stops with its report and the rebased branch kept, that no Docker stops likewise and never falls back to the host, and that without the opt-in the report says the branch is untested on the new base.
- It says it runs only after a rebase that replayed the branch (a resolved conflict included), not after "nothing to rebase" or an abort.
- The report step states the re-verify result or the untested note; `grep -c "untested on the new base" skills/rebase-worktree/SKILL.md` prints at least 1 and no line says the branch is untested unconditionally.
- Its `description` and `README.md`'s `rebase-worktree` row mention the sandbox re-verify.
- `skills/wrap-up-worktree/SKILL.md` step 5 lists a failing re-verify among `rebase-worktree`'s stops, keeping the worktree and branch; step 9 relays the re-verify result or the untested note.
- `grep -n '"version": "0.20.0"' .claude-plugin/plugin.json` prints one line.
- `claude plugin validate .` and `claude plugin validate skills` pass.
- The parent's Scope bullet "Re-verify after a rebase…" and acceptance criterion 5 name "the tests" through `run-in-sandbox` and hold no `tasks.md` or gate lookup; `grep -n "gate" docs/tickets/closed/rebase-worktree/index.md` prints only the Scope bullet's "no ticket-gate lookup".
- `git diff --stat rebase-worktree` lists exactly `skills/rebase-worktree/SKILL.md`, `skills/wrap-up-worktree/SKILL.md`, `README.md`, `.claude-plugin/plugin.json` and `docs/tickets/closed/rebase-worktree/index.md`, this ticket's own files aside.

# Implementation notes
- Word the opt-in test and the blocker as `complete-task` step 6 does, so the two read alike.
- The `run-in-sandbox` call says it needs the result, so it waits and reports in the same turn in an attended run too; an unattended caller's framing already declares that.
- The target is the phrase "the tests", not a literal command, so `run-in-sandbox` resolves it per repo; in an unattended run an ambiguous match takes its recommended one.
- A re-verify stop is not an abort: the rebase has completed, so the "aborts rather than leaving a rebase in progress" rule does not apply, and nothing is reset.
- `wrap-up-worktree` step 5: keep the wording close to its existing stop sentence.

# Test plan
- The `grep` and `git diff --stat` checks in the criteria.
- `claude plugin validate .` and `claude plugin validate skills`.
- Left for a person (`claude --plugin-dir .claude/worktrees/rebase-worktree`, a throwaway repo with a tailored `Dockerfile.sandbox` and a `test` script, a non-conflicting commit added to `main`): `/jodysalt:rebase-worktree <name>` rebases and reports the tests passed; with a commit on `main` that breaks the suite, it stops with the failures and the branch rebased; with the placeholder `Dockerfile.sandbox`, it reports the branch untested; `/jodysalt:wrap-up-worktree <name>` on the breaking case stops keeping the worktree and branch.

# Rollout
Lands on the `rebase-worktree` branch as one commit, carrying the parent's `0.20.0` bump; merging the parent to `main` is the release. Fallback is reverting the commit, which restores the always-untested report.

## Strategic fit
Advances `rebase-worktree` by closing its last criteria: a rebased branch has its tests re-run on the new base where the repo can run them in the sandbox, so an unattended landing through `wrap-up-worktree` never merges a broken combination silently, and the release version is bumped.
