---
title: Host Run And Release
type: feat
priority: high
---

# Goal
When `complete-task` runs a project command on the host because the repo has not opted in to the sandbox, the commit and the report say so with the reason and name the one skill that opts the repo in. The `complete-task` and `run-in-sandbox` descriptions and `README.md` rows say what the `opted-in-verify` slice added, and the plugin ships as `0.19.0`.

# Context
- Parent: `docs/tickets/closed/sandboxed-tests/index.md`. This slice moves its remaining unmet criteria: 4 (host run named in the report and commit body, with `setup-skills` or `refine-sandbox`) and 7 (README rows match the descriptions, `plugin.json` `0.19.0`, strict validate passes). The glossary half of criterion 7 is already met.
- The closed sibling `docs/tickets/closed/sandboxed-tests--opted-in-verify/index.md` landed the step 4 routing and left exactly this for the next slice.
- `docs/glossary.md` defines **project command**, **sandbox** and **unattended**; this slice uses them in those senses and edits no glossary entry.
- `skills/complete-task/SKILL.md`:
  - step 4 **Implement** (line 26 paragraph) defines opted in (`Dockerfile.sandbox` at the checkout root, first line not the placeholder marker) and ends "Not opted in (no `Dockerfile.sandbox`, or the placeholder): project commands run on the host as today."
  - step 7 **Commit** (line 29) puts judgment calls in the body; step 8 **Report** (line 30) lists heading, changes, steps satisfied, judgment calls, notes, appended entries.
  - The frontmatter `description` (line 3) says nothing about the sandbox.
- `skills/run-in-sandbox/SKILL.md`: step 5 (line 23) waits in a run declared unattended or whose caller needs the result; its `description` (line 3) says only "in the background and in parallel".
- `README.md` rows: `complete-task` (line 28), `run-in-sandbox` (line 45).
- `.claude-plugin/plugin.json` reads `"version": "0.18.0"`.
- This repo has no test suite; checks are `grep` on the files and `claude plugin validate skills --strict`.

# Scope
In:
- **Host-run line.** In `complete-task`, when the repo is not opted in and the entry's steps hold at least one project command, step 7's commit body and step 8's report each carry one line: the project commands ran on the host, why, and how to opt in –
  - no `Dockerfile.sandbox`: "ran on the host: no `Dockerfile.sandbox`; run `jodysalt:setup-skills` to opt in to the sandbox."
  - placeholder first line: "ran on the host: `Dockerfile.sandbox` is the placeholder; run `jodysalt:refine-sandbox` to opt in to the sandbox."
  A task whose steps hold no project command adds no such line; an opted-in run adds none either.
- **Descriptions.** `complete-task`'s gains one short clause: in a repo with a tailored `Dockerfile.sandbox` it verifies project commands through `run-in-sandbox` and waits for them. `run-in-sandbox`'s gains one short clause: when the caller needs the result (an unattended run), it waits for every run and reports in the same turn. Each stays one paragraph, the addition one clause, no rewording of the rest.
- **README rows.** The `complete-task` and `run-in-sandbox` rows gain the same clause in the row's shorter voice.
- **Version.** `.claude-plugin/plugin.json` `0.18.0` → `0.19.0`.

Out:
- Step 4's routing, the Docker-down blocker, `run-in-sandbox`'s waiting mode: landed in `opted-in-verify`, unchanged.
- `docs/glossary.md`; `add-tasks`, `complete-tasks`, `complete-ticket-slice`, `setup-skills`, `refine-sandbox`.
- Any change to `jodysalt:commit`; the line reaches the body as content `complete-task` hands it, like a judgment call.
- Pushing.

# Acceptance criteria
- `grep -n 'setup-skills' skills/complete-task/SKILL.md` and `grep -n 'refine-sandbox' skills/complete-task/SKILL.md` show the host-run line, in step 7's commit body and step 8's report, naming `jodysalt:setup-skills` when there is no `Dockerfile.sandbox` and `jodysalt:refine-sandbox` on the placeholder, with the reason.
- `skills/complete-task/SKILL.md` says a task whose steps hold no project command, or a run in an opted-in repo, adds no host-run line.
- `grep -n 'run-in-sandbox' skills/complete-task/SKILL.md | head -1` hits the frontmatter `description`, which says it verifies project commands through `run-in-sandbox` in a repo with a tailored `Dockerfile.sandbox`.
- `sed -n 3p skills/run-in-sandbox/SKILL.md` shows the description saying it waits for every run and reports in the same turn when the caller needs the result.
- The `complete-task` and `run-in-sandbox` rows in `README.md` say the same as the new clauses.
- `grep -n '"version"' .claude-plugin/plugin.json` shows `0.19.0`.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the `sandboxed-tests` branch lists exactly `skills/complete-task/SKILL.md`, `skills/run-in-sandbox/SKILL.md`, `README.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.
- Nothing is pushed.

# Implementation notes
- **Step 4.** Extend the "Not opted in" sentence with "and step 7 and step 8 carry the host-run line" or define the line there once and point to it from steps 7 and 8; one definition, two uses.
- **Step 7.** "…with any judgment calls in the body, and the host-run line when step 4 ran a project command on the host."
- **Step 8.** Add "the host-run line, when there is one" to the report's list.
- **Descriptions.** Keep each addition to one clause and keep the "Use when…" and "Never…" sentences intact so triggering is unchanged; no frontmatter key changes.
- **Order.** Version bump last, after validate passes on the edited skills.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep`, `sed` and `git diff --stat` checks above.
- Left for a person (interactive Claude session, `claude --plugin-dir` pointed at this worktree, a throwaway Node repo, one ticket whose single task's step is `npm test`):
  - no `Dockerfile.sandbox`: host run; report and commit body name `setup-skills`.
  - placeholder `Dockerfile.sandbox`: host run; report and commit body name `refine-sandbox`.
  - a task whose only step is a `grep`: no host-run line.
  - tailored `Dockerfile.sandbox`: sandbox run, no host-run line.

# Rollout
Lands on the `sandboxed-tests` branch as one commit; the parent then has every criterion met and is ready to wrap up. `0.19.0` ships with the parent's landing on `main`. Fallback is reverting the commit.

## Strategic fit
Advances `sandboxed-tests` by finishing it: a host run in an unattended loop is never silent, the person reading the commit sees the one skill that moves the repo into the sandbox, and the release says what the previous slice changed.
