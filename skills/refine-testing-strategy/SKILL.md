---
name: refine-testing-strategy
description: Revisits `docs/testing-strategy.md` and improves it in place – explores the manifests' test scripts, the test runner configs, the CI workflows and their recent runs, reports where the strategy and the repo disagree, then interviews the user one question at a time and edits as answers land, so a repo whose suite is too slow or too heavy to run locally can keep its task checks selective and send its gate to CI, the loop pushing the branch and watching the run. Use when the user says "refine the testing strategy", "write the testing strategy", "the tests should run in CI", "the full suite is too slow for the loop", or runs `/refine-testing-strategy`. Edits `docs/testing-strategy.md` in place only and never creates it; never runs a project command, never names a command the repo doesn't define, never pushes, never commits.
argument-hint: "[sections to revisit, e.g. 'gate' – defaults to the whole file]"
---

# Refine testing strategy

Improve `docs/testing-strategy.md` in place: explore, assess, interview, edit. Leave the result uncommitted. Works the same on the defaults `setup-skills` just wrote and on a strategy the repo has drifted from. The file is what `add-tasks` reads when it writes a backlog, so every edit keeps its three sections and their shape.

## Scope

$ARGUMENTS

If given, one or more section headings matched case-insensitively against the file's `## ` headings – `coverage`, `task checks`, `gate`; the findings and the interview cover only those sections. If empty, the whole file. If a heading matches none, list the headings and ask.

## Steps

1. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session <description>`, the description being `testing-strategy`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Explore before asking.** Read `CLAUDE.md`; the manifests' scripts and targets (`package.json` `scripts`, `Makefile` and `justfile` targets, and their equivalents); the test runner configs (`vitest.config.*`, `jest.config.*`, `playwright.config.*`, `pytest.ini`, `pyproject.toml` and the like) and where the tests live, so unit, integration and end-to-end suites can be told apart; the CI workflows (`.github/workflows/*.yml` and their equivalents) for the jobs they run, the services and secrets those jobs need, and the branches a push triggers them on; `Dockerfile.sandbox` at the repo root, for whether the repo has opted in to the sandbox; and, when `gh` is installed and the repo has a GitHub remote, `gh run list --limit 10` for how long the recent runs took and whether they passed. Recommended answers come from these: a suite CI finishes in minutes with no service is a local gate; a suite that needs a service or a browser the host or the sandbox lacks, or that CI takes long over, is one to send to CI. Then read `docs/testing-strategy.md`. If it doesn't exist, stop and point at `jodysalt:setup-skills`; this skill tailors the file, it never creates it. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense, never redefining one in passing; a term the glossary lacks is used as the input uses it.
3. **Report findings before editing anything:**
   - A command the strategy names that no manifest script, target or config defines – the default `npm run test` in a repo with no such script, say – and what the repo defines instead.
   - A test script or CI job the strategy uses nowhere, neither as a task check nor in the gate.
   - A gate check the sandbox cannot run when the repo has opted in: a service or browser `Dockerfile.sandbox` lacks, which is `jodysalt:refine-sandbox`'s to add or the gate's to send to CI.
   - A remote check that pushes to a workflow the repo lacks, or to one that does not trigger on a push of the branch it would push.
   - A `## Coverage` rule with no runner or test directory to put the test in.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the testing strategy at `docs/testing-strategy.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then the decisions the file makes without saying so: whether the whole suite is practical locally or the gate goes to CI, and for which suites; which scoped scripts a task check may run; what each task category owes in coverage. Each comes with a recommendation grounded in a file or run from step 2, citing it.
   - The files and runs explored in step 2 count as explorable; a question they answer is never asked.
   - A local check is one bullet naming one command and what passing looks like. A remote check is one bullet that pushes the current branch to its remote (`git push -u origin HEAD`) and watches the run the named workflow starts for `HEAD` until it ends (`gh run watch --exit-status` on the run `gh run list --commit $(git rev-parse HEAD)` finds, or the CI's equivalent), reading the failed job's log on a failure. A remote check never force-pushes, never pushes another branch, and comes after every local check, so a branch that fails locally is never pushed.
   - Only an answer the user agrees to lands. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `docs/testing-strategy.md` as answers land, keeping `# Testing strategy` and the three `## ` sections `Coverage`, `Task checks` and `Gate` in that order, the gate a bulleted list with one check per bullet; `add-tasks` reads the sections by heading and turns each gate bullet into one step.
5. Stop. Leave the edit uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Edit `docs/testing-strategy.md` and nothing else.
- Never create the file; a missing one is `jodysalt:setup-skills`'s to write.
- Never invent a command: every check names a script, target or workflow the repo defines, or asks.
- Never runs a project command, never pushes, never commits; `gh run list` reads the remote and runs nothing.
- Keep the three-section shape and the gate's one-check-per-bullet list, which `add-tasks` reads by heading.
