# Tasks

## Add the host-run line to steps 4, 7 and 8 of skills/complete-task/SKILL.md for a repo not opted in to the sandbox
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/complete-task/SKILL.md` step 4, extend the "Not opted in" sentence of the sandbox paragraph to define the host-run line once: when the repo is not opted in and the entry's steps hold at least one project command, the commit body and the report carry one line – with no `Dockerfile.sandbox`: "ran on the host: no `Dockerfile.sandbox`; run `jodysalt:setup-skills` to opt in to the sandbox."; when its first line is the placeholder marker: "ran on the host: `Dockerfile.sandbox` is the placeholder; run `jodysalt:refine-sandbox` to opt in to the sandbox." A task whose steps hold no project command, or a run in an opted-in repo, adds no line.
  - Step 7 (**Commit**): after "with any judgment calls in the body", add "and the host-run line when step 4 ran a project command on the host".
  - Step 8 (**Report**): add "the host-run line, when there is one" to the report's list.
  - `grep -n 'setup-skills' skills/complete-task/SKILL.md` and `grep -n 'refine-sandbox' skills/complete-task/SKILL.md` match the step 4 definition; `grep -n 'host-run line' skills/complete-task/SKILL.md` matches steps 4, 7 and 8.

## Add the sandbox clauses to the complete-task and run-in-sandbox descriptions and their README.md rows
- **category:** chore
- **status:** done
- **steps:**
  - `skills/complete-task/SKILL.md` frontmatter `description`: add one short clause saying that in a repo with a tailored `Dockerfile.sandbox` it verifies project commands through `run-in-sandbox` and waits for them. Keep the "Use on…" and "Never…"/"never pushes" sentences intact.
  - `skills/run-in-sandbox/SKILL.md` frontmatter `description`: add one short clause saying that when the caller needs the result, as an unattended run does, it waits for every run and reports in the same turn. Keep the "Use when…" and "Never…" sentences intact.
  - In `README.md`, the `complete-task` and `run-in-sandbox` rows gain the same clause in the row's shorter voice; no other row changes.
  - `grep -n 'run-in-sandbox' skills/complete-task/SKILL.md | head -1` hits line 3; `sed -n 3p skills/run-in-sandbox/SKILL.md` mentions waiting; `grep -n 'complete-task\|run-in-sandbox' README.md` shows both rows changed.

## Bump .claude-plugin/plugin.json to 0.19.0
- **category:** chore
- **status:** done
- **steps:**
  - Change `"version": "0.18.0"` to `"version": "0.19.0"` in `.claude-plugin/plugin.json`; nothing else.
  - `grep -n '"version"' .claude-plugin/plugin.json` shows `0.19.0`.

## Run full test suite for sandboxed-tests--host-run-and-release
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate skills --strict` (this repo has no other test suite) and confirm it passes.
  - `git diff --stat sandboxed-tests..HEAD` lists only `skills/complete-task/SKILL.md`, `skills/run-in-sandbox/SKILL.md`, `README.md`, `.claude-plugin/plugin.json` and files under `docs/tickets/closed/sandboxed-tests--host-run-and-release/`.
