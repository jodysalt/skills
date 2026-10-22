---
title: Scaffold Step
type: feat
priority: high
---

# Goal
`/jodysalt:setup-skills` writes a placeholder `Dockerfile.sandbox` at the repo root when none exists, lists it in its Report and offers `jodysalt:refine-sandbox` beside `refine-vision` and `refine-coding-standards`, so `run-in-sandbox` has an image to build and `refine-sandbox` a file to tailor from the first run. The plugin reads `0.18.0`, so the first merge to `main` releases it.

# Context
- Parent: `docs/tickets/closed/sandbox-placeholder/index.md`. This one slice covers the whole parent, which is already thin and end-to-end: one new scaffold step, the Report and description that name it, and the version bump.
- `skills/setup-skills/SKILL.md` steps today: 1 directories, 2 `docs/vision.md`, 3 `docs/coding-standards.md`, 4 `docs/glossary.md`, 5 `CLAUDE.md`, 6 `.gitignore`, 7 `.vscode/settings.json` (line 70), 8 Report (line 82). Steps 2–4 share one shape: "Skip if the file exists. Otherwise write it from this template.", then one sentence on whose prompts the template's comments or paragraph are. The Report offers `jodysalt:refine-vision` and `jodysalt:refine-coding-standards` and suggests `jodysalt:commit` (a `chore:` commit).
- The frontmatter `description` (line 3) lists the scaffolded paths and ends "Ends by offering `refine-vision` and `refine-coding-standards` to fill in `docs/vision.md` and `docs/coding-standards.md`." `README.md` line 46 is its row, which mirrors the description's path list but drops the "Use when" and "Ends by offering" sentences.
- `run-in-sandbox` matches the marker line `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.` exactly as the file's first line and offers `refine-sandbox`; `refine-sandbox` stops on a missing `Dockerfile.sandbox`, pointing at `setup-skills`, and removes the marker with its first edit.
- `.claude-plugin/plugin.json` reads `"version": "0.17.0"`. The vision's *`main` is always installable* principle bumps the version on a change to a skill's behaviour; a new scaffolded file is a minor bump.
- The run that drafts this slice is on the `sandbox-placeholder` ticket branch; the planning-session offer was declined.

# Scope
In:
- **Step 8, `Dockerfile.sandbox`.** In `skills/setup-skills/SKILL.md`, after step 7 `.vscode/settings.json`: skip `Dockerfile.sandbox` at the repo root when it exists, otherwise write it from the placeholder template in Implementation notes, verbatim. One sentence says the comments are prompts for `refine-sandbox`, not content, and the first line is the marker `run-in-sandbox` and `refine-sandbox` match exactly, so it must not change.
- **Step 9, Report.** The old step 8 renumbered; it lists `Dockerfile.sandbox` among the paths created or skipped like any other, and offers `jodysalt:refine-sandbox` to tailor `Dockerfile.sandbox` beside the `refine-vision` and `refine-coding-standards` offers.
- **Description and README row.** The frontmatter `description` names a placeholder `Dockerfile.sandbox` in its list of scaffolded paths and its last sentence offers `refine-sandbox` to tailor it; `README.md` line 46 names the placeholder `Dockerfile.sandbox` in the same list and gains the `refine-sandbox` offer, so the row still matches the description.
- **Release.** `.claude-plugin/plugin.json` from `0.17.0` to `0.18.0`, nothing else in it changed.

Out:
- The workflow sentence in `CLAUDE.md`, `README.md` line 7 and `setup-skills` step 5; the sandbox is not part of the spec-to-loop chain.
- A `Dockerfile.sandbox` for this repo; a placeholder `Dockerfile.sandbox.dockerignore`; detecting a runtime or guessing a base image.
- `run-in-sandbox`, `refine-sandbox` and every other skill: unchanged.
- `complete-task` verifying through `run-in-sandbox`; a follow-up ticket. Pushing.

# Acceptance criteria
- `grep -c '^# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project\.$' skills/setup-skills/SKILL.md` prints at least `1`, the line sitting inside step 8's template block, and `grep -n '^8\. \*\*`Dockerfile.sandbox`' skills/setup-skills/SKILL.md` and `grep -n '^9\. \*\*Report' skills/setup-skills/SKILL.md` each print one line.
- `grep -n 'refine-sandbox' skills/setup-skills/SKILL.md` shows the Report (step 9) offering `jodysalt:refine-sandbox`, and the frontmatter `description` naming `Dockerfile.sandbox` and the `refine-sandbox` offer.
- In a throwaway scratch repo, the step-8 template written verbatim to `Dockerfile.sandbox` has the marker as its exact first line (`head -1`), and `docker build -f Dockerfile.sandbox .` succeeds on it.
- Step 8 skips an existing `Dockerfile.sandbox`, so a rerun, or a repo with its own file, keeps it byte for byte; the Report lists it as skipped.
- `README.md` line 46 names the placeholder `Dockerfile.sandbox` and the `refine-sandbox` offer, matching the description's path list and offer.
- `.claude-plugin/plugin.json` reads `"version": "0.18.0"` and nothing else in it changed.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the parent branch lists exactly `skills/setup-skills/SKILL.md`, `README.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.
- Nothing is pushed.

# Implementation notes
- **Step 8 template, verbatim from the parent.** Inside a ```` ```dockerfile ```` block:

  ```dockerfile
  # Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.
  # The image run-in-sandbox builds: one fresh container per run, the checkout mounted at /app.
  FROM debian:bookworm-slim
  WORKDIR /app
  # Runtime: replace FROM with the runtime's official image, pinned to the version the repo declares.
  # Dependencies: copy the manifests and lockfile, install, and declare each dependency directory with VOLUME.
  # Environment: name the host variables a run needs, names only: LABEL sandbox.env="NAME NAME"
  # Services: install any the tests need and start them in an ENTRYPOINT script that ends exec "$@".
  ```

  The step reads like steps 2–4: "**`Dockerfile.sandbox`.** Skip if the file exists at the repo root. Otherwise write it from this template." plus the one sentence on the prompts and the marker. The Rules' "create only what is missing" already covers it.
- **Report.** Renumber `8.` to `9.`; extend the offer sentence to "Offer to invoke `jodysalt:refine-vision` …, `jodysalt:refine-coding-standards` … and `jodysalt:refine-sandbox` to tailor `Dockerfile.sandbox`." Check no other line in the skill or elsewhere cites the Report by step number (`grep -rn 'step 8' skills/`).
- **Docker check.** In a scratch directory (`mktemp -d` under the session scratchpad), extract the template from step 8 rather than retyping it (e.g. `sed` between the ```` ```dockerfile ```` fence and its close), write it to `Dockerfile.sandbox`, then `head -1` and `docker build -f Dockerfile.sandbox .`. Docker is available on this machine.
- **Release.** `"version": "0.17.0"` to `"version": "0.18.0"`, then `claude plugin validate skills --strict`.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep` and `git diff --stat` checks above; `grep '"version"' .claude-plugin/plugin.json` reads `0.18.0`.
- The scratch-repo `docker build` of the template extracted from step 8.
- Left for a person (needs an interactive Claude session with `claude --plugin-dir` pointed at this worktree, in a throwaway repo with a first commit): `/jodysalt:setup-skills` writes `Dockerfile.sandbox` and the Report lists it and offers `refine-sandbox`; a rerun skips it; a repo with its own `Dockerfile.sandbox` keeps it byte for byte; `/jodysalt:run-in-sandbox echo ok` stops on the placeholder and offers `refine-sandbox`, and declining runs it and reports `ok` with the warning; `/jodysalt:refine-sandbox` no longer stops on a missing file.

# Rollout
Lands on the `sandbox-placeholder` branch as one commit; that branch lands on `main` and users auto-update to `0.18.0`. Rerunning `/jodysalt:setup-skills` is the migration for a repo that adopted the plugin earlier. Fallback is reverting the commit.

## Strategic fit
Advances `sandbox-placeholder` by closing it: the scaffold step, the Report's `refine-sandbox` offer, the description and README row, and the `0.18.0` bump are every unmet criterion of the parent.
