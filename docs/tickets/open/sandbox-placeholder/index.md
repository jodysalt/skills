---
title: Sandbox Placeholder
type: feat
---

# Goal
A repo that runs `/jodysalt:setup-skills` gets a placeholder `Dockerfile.sandbox` at its root, so `/jodysalt:refine-sandbox` has a file to tailor and `/jodysalt:run-in-sandbox` has an image to build from the first run. The placeholder builds as it stands and its first line marks it untailored, so `run-in-sandbox` can offer `refine-sandbox` before a run is wasted on an image without the project's runtime.

# Context
- `run-in-sandbox` (plugin `0.17.0`) builds a sandbox image from `Dockerfile.sandbox` at the checkout root and stops when the file is missing, pointing at `setup-skills` then `refine-sandbox`. When the file's first line is exactly `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`, it stops and offers `refine-sandbox`; on a decline it runs anyway with a warning.
- `refine-sandbox` never creates `Dockerfile.sandbox` and stops on a missing one, pointing at `setup-skills`; it removes the marker line with the first edit that lands. The contract it keeps: `WORKDIR /app`, dependencies installed in the image with each dependency directory declared by `VOLUME`, host variables named in `LABEL sandbox.env`, services started by an `ENTRYPOINT` ending `exec "$@"`.
- `setup-skills` scaffolds the layout idempotently: each step skips an existing file and writes a missing one from a template whose comments or paragraph are the prompts a `refine-*` skill fills in. Its steps today: directories, `docs/vision.md`, `docs/coding-standards.md`, `docs/glossary.md`, `CLAUDE.md`, `.gitignore`, `.vscode/settings.json`, Report. The Report offers `refine-vision` and `refine-coding-standards`.
- Until this lands, neither sandbox skill works in a repo without a hand-written `Dockerfile.sandbox`.

# Scope
In:
- A new `setup-skills` step 8, after `.vscode/settings.json`: skip `Dockerfile.sandbox` at the repo root when it exists, otherwise write it from the placeholder template. Report becomes step 9 and lists it like the other paths.
- The Report offers `jodysalt:refine-sandbox` beside `refine-vision` and `refine-coding-standards`.
- The `setup-skills` description and its `README.md` row name the placeholder `Dockerfile.sandbox` and the `refine-sandbox` offer.
- `plugin.json` to `0.18.0`.

Out:
- The workflow sentence in `CLAUDE.md`, `README.md` and `setup-skills` step 5; the sandbox is not part of the spec-to-loop chain.
- A `Dockerfile.sandbox` for this repo, which has no test suite to run.
- A placeholder `Dockerfile.sandbox.dockerignore`; `refine-sandbox` creates one when needed.
- Detecting the project's runtime or guessing a base image; tailoring is `refine-sandbox`'s.
- `complete-task` verifying through `run-in-sandbox`; a follow-up ticket.
- Pushing.

# Acceptance criteria
- In a throwaway repo, `/jodysalt:setup-skills` writes `Dockerfile.sandbox` at the root whose first line is exactly `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`, and the Report lists it and offers `refine-sandbox`.
- A rerun skips it, and a repo with an existing `Dockerfile.sandbox` keeps it byte for byte.
- `docker build -f Dockerfile.sandbox .` succeeds on the placeholder.
- `/jodysalt:run-in-sandbox echo ok` stops on the placeholder and offers `refine-sandbox`; declining runs it and reports `ok` with the warning.
- `/jodysalt:refine-sandbox` in that repo no longer stops on a missing file.
- The `setup-skills` README row matches its description; `plugin.json` is `0.18.0`; `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- **Placeholder content.** A minimal Dockerfile that builds, so `run-in-sandbox`'s decline path (run a placeholder anyway, with a warning) works: the marker line first, then `FROM debian:bookworm-slim` and `WORKDIR /app`, then commented prompts for what `refine-sandbox` fills in. No runtime guessed; tailoring is `refine-sandbox`'s.

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

- **`setup-skills`.** The step reads like steps 2–4: skip if the file exists, otherwise write it from the template, with one sentence saying the comments are prompts for `refine-sandbox` and the first line is the marker `run-in-sandbox` and `refine-sandbox` match exactly. The Rules' "create only what is missing" already covers it.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, throwaway repo with Docker running and `claude --plugin-dir` pointed at this ticket's worktree: `git init` and a first commit, `setup-skills` with and without an existing `Dockerfile.sandbox`, `docker build -f Dockerfile.sandbox .`, then `run-in-sandbox echo ok` declining `refine-sandbox`, then `refine-sandbox` past its missing-file check.

# Rollout
No flag. Rerunning `/jodysalt:setup-skills` is the migration for a repo that adopted the plugin earlier.

## Strategic fit
Stands on the core problem *Conventions are hard to adopt*: the file `run-in-sandbox` and `refine-sandbox` rest on has to exist before either runs, and `setup-skills` is where the layout comes from. It completes the replacement of the first user's Kraal sandbox, a step toward *Adoption beyond the first user*. It respects *A home for standalone skills* only once the method calls `run-in-sandbox`; until `complete-task` verifies through it, the sandbox skills sit close to that non-goal, which the follow-up ticket closes.
