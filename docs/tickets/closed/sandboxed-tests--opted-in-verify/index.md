---
title: Opted In Verify
type: feat
priority: high
---

# Goal
In a repo that has opted in to the sandbox, `complete-task` runs every project command in a task's steps through `jodysalt:run-in-sandbox`, waits for the exit codes in the same turn, and only then flips the status and commits. When Docker is unreachable there it stops as a blocker and never runs the command on the host. `run-in-sandbox` gains the waiting mode this needs, and a person's `/run-in-sandbox` still launches its runs and ends the turn.

# Context
- Parent: `docs/tickets/closed/sandboxed-tests/index.md`. This slice moves its criteria 1, 2, 3, 5 and 6: opted-in sandbox run that waits, unattended worker that waits, Docker-down blocker, `grep`/`git` on the host, a person's `/run-in-sandbox` unchanged. Left for the next slice: the host-run report and commit-body line naming `setup-skills` or `refine-sandbox`, the description and README row updates, and the `plugin.json` bump to `0.19.0`.
- `docs/glossary.md` already defines **project command** (written while the parent was drafted) and **unattended**; this slice uses both in those senses.
- `skills/complete-task/SKILL.md`: step 4 **Implement** (line 24) satisfies the entry's steps, verification included, with no word on where a command runs; step 7 **Commit** (line 27); step 8 **Report** (line 28); `## Rules` (line 30) holds "Never continue past a failed acceptance criterion".
- `skills/run-in-sandbox/SKILL.md`: step 1 **Preflight** (line 19) stops with the `docker info` message when Docker is down and matches the placeholder marker `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.` as the first line; step 5 **Launch** (line 23) runs each command with `run_in_background` and ends the turn; step 6 **Collect** (line 24) as each run exits; step 7 **Report** (line 25). Its Rules say an unattended run asks nothing and it never runs on the host as a fallback.
- `.claude-plugin/plugin.json` reads `0.18.0`; this slice leaves it there.
- This repo has no test suite; checks are `grep` on the two `SKILL.md` files and `claude plugin validate skills --strict`.

# Scope
In:
- **`run-in-sandbox` waiting mode.** When the caller declares the run unattended or says it needs the result, step 5 still launches every run in the background in parallel, then waits until every run has exited (Monitor with an until-loop on the background tasks, or their completion notifications; never a foreground `sleep`, never one foreground `docker run`, which would hit the 10-minute Bash timeout), and steps 6–7 collect and report in the same turn. Otherwise step 5 ends the turn as today. The unattended Rule grows the wait; the "never runs on the host as a fallback" Rule stays.
- **`complete-task` step 4.** One added paragraph: each command in the entry's steps is classed as a project command or not. In an opted-in repo – `Dockerfile.sandbox` at the checkout root whose first line is not the placeholder marker – every project command of the entry goes in one `jodysalt:run-in-sandbox` call, as literal commands, declared as needing the result (and unattended when this run is), so they run in parallel and the exit codes come back in this turn. Any non-zero exit fails the task as a failed criterion does today: the entry stays `pending`, no commit. A command that only reads the checkout (`grep`, `git`, `ls`) runs on the host in every case.
- **Docker-down blocker.** In an opted-in repo, when `run-in-sandbox` stops because `docker info` fails, or a `docker` call is refused by the session's permissions, `complete-task` stops as a blocker: the report names Docker with the `docker info` message and says to start Docker and rerun, or names the refused `docker` permission. No status flip, no commit, nothing run on the host.
- **Not opted in.** No `Dockerfile.sandbox`, or its first line is the placeholder marker: project commands run on the host exactly as today.
- **Rule** in `complete-task`: never runs a project command on the host in an opted-in repo.

Out:
- The host-run line in step 7's commit body and step 8's report naming `jodysalt:setup-skills` or `jodysalt:refine-sandbox`; the next slice.
- The `complete-task` and `run-in-sandbox` frontmatter descriptions and their `README.md` rows; `plugin.json` to `0.19.0`; the next slice.
- `docs/glossary.md`: already holds `## project command`; not edited.
- `add-tasks`, `complete-tasks`, `complete-ticket-slice`, `setup-skills`, `refine-sandbox`: unchanged.
- Pushing.

# Acceptance criteria
- `grep -n 'run-in-sandbox' skills/complete-task/SKILL.md` shows step 4 sending the entry's project commands to `jodysalt:run-in-sandbox` in one call in an opted-in repo, with the opt-in test (`Dockerfile.sandbox` present, first line not the placeholder marker) stated there, and a Rule forbidding a host run of a project command in an opted-in repo.
- `grep -n 'project command' skills/complete-task/SKILL.md` shows the term used as `docs/glossary.md` defines it, with `grep`/`git`/`ls`-style reads staying on the host.
- `skills/complete-task/SKILL.md` says the status flips and the commit happens only after every sandbox run has exited with code 0; a non-zero exit leaves the entry `pending` with no commit.
- `skills/complete-task/SKILL.md` names the Docker-down blocker: `docker info` failing or a refused `docker` permission stops the task, naming which, with no status flip, no commit and no host run.
- `grep -n 'wait' skills/run-in-sandbox/SKILL.md` shows step 5 waiting for every background run when the run is declared unattended or the caller needs the result, via Monitor or the task notifications and never a foreground `sleep`, then steps 6–7 reporting in the same turn; a person's run still ends its turn after the launch.
- `skills/run-in-sandbox/SKILL.md` still holds the Rule that it never runs a command on the host as a fallback.
- In a repo not opted in, `complete-task` runs project commands on the host as before; no other behaviour of step 4 changes.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the `sandboxed-tests` branch lists exactly `skills/complete-task/SKILL.md` and `skills/run-in-sandbox/SKILL.md`, this ticket's own files aside.
- Nothing is pushed.

# Implementation notes
- **`run-in-sandbox` step 5.** Replace "then end the turn; separate invocations overlap the same way." with a two-way ending: in a person's run, end the turn (separate invocations overlap the same way); in a run declared unattended or whose caller says it needs the result, wait until every background run has exited – Monitor with an until-loop, or the task notifications – never a foreground `sleep`, then go on to steps 6 and 7 in the same turn. Extend the existing unattended Rule with "and it waits for every run before reporting".
- **`complete-task` step 4.** Append the paragraph after "Surgical edits only; nothing speculative." Use the glossary term *project command* as defined; name the marker as "the placeholder marker `run-in-sandbox` matches" or quote it once. Pass the commands as literal targets so `run-in-sandbox` resolves nothing; it already runs literal commands exactly as written.
- **Blocker wording.** One sentence in step 4's paragraph; it reports like step 3's blocker, not like a failed criterion.
- **Rule.** One bullet in `## Rules`: "In an opted-in repo, never runs a project command on the host; no Docker is a blocker."
- Leave steps 7 and 8 untouched; the host-run line is the next slice's.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep` and `git diff --stat` checks above.
- Left for a person (needs an interactive Claude session with `claude --plugin-dir` pointed at this worktree, a throwaway Node repo with Docker, one ticket whose single task's step is `npm test`):
  - tailored `Dockerfile.sandbox`: `/jodysalt:complete-task` and `/jodysalt:complete-tasks` run it in the sandbox, wait, flip and commit; a failing test leaves it `pending`, no commit.
  - same, Docker stopped: blocker naming Docker, no commit, nothing on the host.
  - a `grep` step runs on the host.
  - placeholder or no file: host run as today.
  - `/jodysalt:run-in-sandbox` by hand still ends its turn after the launch.

# Rollout
Lands on the `sandboxed-tests` branch as one commit; no version bump in this slice, the parent's last slice bumps to `0.19.0`. Only repos with a tailored `Dockerfile.sandbox` change behaviour. Fallback is reverting the commit.

## Strategic fit
Advances `sandboxed-tests` by delivering its core: an opted-in repo's loop worker verifies in a fresh container and waits for the verdict, so parallel worktrees stop sharing host state.
