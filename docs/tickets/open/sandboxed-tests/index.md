---
title: Sandboxed Tests
type: feat
---

# Goal
The skills that run tests run them in a sandbox through `jodysalt:run-in-sandbox` whenever the repo's sandbox is usable, and on the host only when it is not, saying so. An unattended `complete-task` worker verifies its task in a fresh container instead of on the host, so parallel worktrees never share a port, a database or a dependency directory.

# Context
- `run-in-sandbox` (plugin `0.18.0`) builds `Dockerfile.sandbox` at the checkout root and runs each command in a fresh `--rm` container with the checkout at `/app`. It stops when `docker info` fails or the file is missing, and offers `refine-sandbox` on the placeholder's first line, running anyway with a warning on a decline or in an unattended run. It never falls back to the host.
- Its step 5 launches each run with `run_in_background` and ends the turn; step 6 collects as each run exits. A `complete-task` worker spawned by `complete-tasks` needs its verdict before it flips a status and commits, so it cannot end its turn to wait.
- `complete-task` step 4 satisfies the entry's steps, its verification steps included, with no word on where a test command runs; today that is the host.
- `add-tasks` writes each entry's `steps` as one scoped test script (`npm run test:unit`) or a cheaper check, and the full-suite gate as `npm run test`.
- `complete-ticket-slice` step 3 judges criteria from "the repo as it is" and runs no test itself; its loop goes through `complete-tasks`.
- The `sandbox-placeholder` ticket left "`complete-task` verifying through `run-in-sandbox`" as this follow-up.

# Scope
In:
- `complete-task` decides where each project command in an entry's steps runs, at run time: through `jodysalt:run-in-sandbox` when the repo has opted in, else on the host. A project command runs the project's own code or toolchain – a manifest script (`npm run …`, `make …`, `just …`) or the runtime or a tool directly (`npx tsc`, `pytest`) – tests, type-checks, lints and builds alike; a command that only reads the checkout (`grep`, `git`, `ls`) stays on the host.
  - **Opted in:** `Dockerfile.sandbox` exists at the checkout root and its first line is not the placeholder marker. Docker down here stops the task as a blocker, never a silent host run.
  - **Not opted in:** no `Dockerfile.sandbox`, or the placeholder. The command runs on the host, as today, and the report and the commit body say so with the reason.
- `run-in-sandbox` gains a waiting mode: when the run is declared unattended or the caller says it needs the result, it still launches every run in the background in parallel, then blocks, checking until every run has exited, and reports in the same turn. A person's run keeps today's launch-and-end-the-turn behaviour. Background launch plus a wait, never one foreground call, because a foreground Bash call times out at 10 minutes.
- An entry with several project commands passes them to one `run-in-sandbox` call, so they run in parallel; any failure fails the task as today.
- Docker unreachable in an opted-in repo: the blocker report says so with the `docker info` message and says to start Docker and rerun; a refused `docker` permission is named as such. No status flip, no commit.
- A host run's report adds one line on how to opt in: `jodysalt:setup-skills` when there is no `Dockerfile.sandbox`, `jodysalt:refine-sandbox` on the placeholder.
- `## project command` in `docs/glossary.md`, written during this ticket's drafting.
- The `complete-task` and `run-in-sandbox` descriptions and `README.md` rows; `plugin.json` to `0.19.0`.

Out:
- `add-tasks` naming the sandbox in a step; `tasks.md` stays the same whatever the repo's sandbox, and a step is a plain command.
- `complete-ticket-slice`, which runs no project command itself; its loop goes through `complete-task`. `refine-sandbox` already verifies through `run-in-sandbox`; no other skill runs a project command.
- `setup-skills` and `refine-sandbox`.
- An eval suite for the new `complete-task` behaviour; that is the *Evals for the risky skills* goal's work.
- Pushing.

# Acceptance criteria
- In an opted-in repo with Docker running, `/jodysalt:complete-task` on an entry whose step is `npm test` runs it through `run-in-sandbox`, waits for the exit code in the same turn, and only then flips the status and commits; a failing run leaves the entry `pending` with no commit.
- A `complete-tasks` worker does the same, unattended, without ending its turn before the run exits.
- Same repo, Docker stopped: the task stops as a blocker naming Docker; nothing on the host runs the command, nothing is committed.
- No `Dockerfile.sandbox`, or the placeholder: the command runs on the host, and the report and commit body say so, naming `setup-skills` or `refine-sandbox` respectively.
- A `grep` or `git` step runs on the host in every case.
- `/jodysalt:run-in-sandbox` run by a person still launches and ends its turn, reporting as each run exits.
- `docs/glossary.md` holds `## project command`; the two README rows match their descriptions; `plugin.json` is `0.19.0`; `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- **`complete-task` step 4.** One added paragraph: classify each step command as a project command or not; for project commands, the opted-in check (`Dockerfile.sandbox` exists, first line not the marker `run-in-sandbox` matches) picks `jodysalt:run-in-sandbox`, invoked declared unattended so it waits, with every project command of the entry as its targets in one call. Step 8's report and step 7's commit body carry the host-run line. A Rule: never runs a project command on the host in an opted-in repo.
- **`run-in-sandbox` steps 5–6.** Step 5 ends the turn only in a person's run; in a waiting run it blocks until every background task has exited (Monitor with an until-loop, or the task notifications, never a foreground `sleep`), then step 6 collects every log and step 7 reports in the same turn. The existing unattended Rule grows the wait. The "never runs on the host as a fallback" Rule stays: the host fallback is `complete-task`'s decision, never `run-in-sandbox`'s.
- **Glossary.** `project command`: a command that runs the project's own code or toolchain – a manifest script or the runtime or a tool directly – as tests, type-checks, lints and builds do. Not: a command that only reads the checkout, such as `grep`, `git` or `ls`.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, throwaway Node repo with Docker and `claude --plugin-dir` pointed at this ticket's worktree, one ticket whose single task's step is `npm test`:
  - tailored `Dockerfile.sandbox`: `/jodysalt:complete-task` and `/jodysalt:complete-tasks` run it in the sandbox, wait, commit; then a failing test leaves it `pending`.
  - same, Docker stopped: blocker, no commit.
  - placeholder: host run, `refine-sandbox` hint.
  - no file: host run, `setup-skills` hint.
  - `/jodysalt:run-in-sandbox` by hand still ends its turn after the launch.

# Rollout
No flag. A repo without a tailored `Dockerfile.sandbox` behaves as today, so only repos that ran `refine-sandbox` change. Risk: an unattended worker whose permissions refuse `docker` stops as a blocker naming the permission, never falls back to the host.

## Strategic fit
Stands on the core problem *Unattended work needs structure*: a loop worker that tests on the host shares state with every other worktree and the person's own session. It brings `run-in-sandbox` into the method's call chain, so the sandbox skills stop sitting near the non-goal *A home for standalone skills*, the gap `sandbox-placeholder` named.
