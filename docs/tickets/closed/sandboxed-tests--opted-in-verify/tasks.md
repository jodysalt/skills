# Tasks

## Add a waiting mode to step 5 of skills/run-in-sandbox/SKILL.md for unattended runs and callers that need the result
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/run-in-sandbox/SKILL.md` step 5 (**Launch**), replace the ending "then end the turn; separate invocations overlap the same way." with a two-way ending: in a person's run, end the turn as today (separate invocations overlap the same way); in a run declared unattended or whose caller says it needs the result, still launch every run in the background in the same turn, then wait until every run has exited – Monitor with an until-loop on the background tasks, or their completion notifications – never a foreground `sleep` and never one foreground `docker run` (the Bash foreground timeout is 10 minutes), then carry on to steps 6 and 7 in the same turn.
  - Extend the existing `## Rules` bullet "In a run declared unattended, nothing is asked: …" so it also says the run waits for every run to exit before reporting. Keep the Rule "Never runs a command on the host as a fallback; no Docker, no run." unchanged.
  - `grep -n 'wait' skills/run-in-sandbox/SKILL.md` shows the new step 5 wording and the extended Rule; `grep -n 'Never runs a command on the host as a fallback' skills/run-in-sandbox/SKILL.md` still matches.

## Route project commands through run-in-sandbox in step 4 of skills/complete-task/SKILL.md when the repo has opted in
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/complete-task/SKILL.md`, append one paragraph to step 4 (**Implement**) after "Surgical edits only; nothing speculative.": class each command in the entry's steps as a project command (as `docs/glossary.md` defines it) or not. The repo has opted in when `Dockerfile.sandbox` exists at the checkout root and its first line is not the placeholder marker `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`. Opted in: every project command of the entry goes to one `jodysalt:run-in-sandbox` call as literal commands, declared unattended and needing the result, so they run in parallel and their exit codes come back this turn; the status flips and the commit happens only after every run exits 0, and a non-zero exit fails the task like any failed criterion (entry stays `pending`, no commit). When `run-in-sandbox` stops because `docker info` fails, or a `docker` call is refused by the session's permissions, stop as a blocker like step 3's: name Docker with the `docker info` message and say to start Docker and rerun, or name the refused permission; no status flip, no commit, nothing run on the host. Not opted in (no file, or the placeholder): project commands run on the host as today. A command that only reads the checkout (`grep`, `git`, `ls`) runs on the host in every case.
  - Add one bullet to `## Rules`: "In an opted-in repo, never runs a project command on the host; no Docker is a blocker."
  - Leave steps 7 and 8 and the frontmatter description untouched.
  - `grep -n 'run-in-sandbox' skills/complete-task/SKILL.md` matches the step 4 paragraph and the new Rule; `grep -n 'project command' skills/complete-task/SKILL.md` matches.
- **notes:**
  - `run-in-sandbox` step 5 now waits when the run is "declared unattended or whose caller says it needs the result"; phrase the step 4 call so it matches one of those two triggers.

## Run full test suite for sandboxed-tests--opted-in-verify
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate skills --strict` (this repo has no other test suite) and confirm it passes.
  - `git diff --stat sandboxed-tests..HEAD` lists only `skills/complete-task/SKILL.md`, `skills/run-in-sandbox/SKILL.md` and files under `docs/tickets/closed/sandboxed-tests--opted-in-verify/`.
