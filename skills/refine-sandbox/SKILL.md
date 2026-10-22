---
name: refine-sandbox
description: Tailors `Dockerfile.sandbox` at the repo root to the project in place – explores what its test commands need, reports what the image lacks, interviews the user one question at a time, edits as answers land, then proves the image through `run-in-sandbox`. Use when the user says "refine the sandbox", "tailor the sandbox Dockerfile", "the sandbox can't run X", or runs `/refine-sandbox`. Edits `Dockerfile.sandbox` and its `Dockerfile.sandbox.dockerignore` only; never creates `Dockerfile.sandbox`, never writes a secret's value, never commits.
argument-hint: "[targets the sandbox must run, e.g. 'the e2e tests' – defaults to every test command]"
---

# Refine sandbox

Tailors `Dockerfile.sandbox` at the repo root to the project, so `jodysalt:run-in-sandbox` can run its commands in a sandbox: explore what the commands need, report, interview, edit, then prove the image through `jodysalt:run-in-sandbox`. Works the same on the placeholder `jodysalt:setup-skills` writes and on a file the project has drifted from. It never creates the file; that is `jodysalt:setup-skills`'s.

## Scope

$ARGUMENTS

If given, the targets the sandbox must run – phrases like "the e2e tests" or literal commands – resolved against the manifest scripts and `CLAUDE.md` the way `jodysalt:run-in-sandbox` resolves them; the findings and the interview cover what those need. If empty, every test command the manifests define.

## Steps

1. **Explore before asking.** If `Dockerfile.sandbox` is missing at the repo root, stop and point at `jodysalt:setup-skills`. Otherwise read it and `Dockerfile.sandbox.dockerignore` when present, `CLAUDE.md`, the manifests and lockfiles, the runtime version files (`.nvmrc`, `.node-version`, `.tool-versions`, `.python-version`, an `engines` field), the CI workflows – the strongest signal for setup steps, `services:` and the secrets tests read – any other `Dockerfile*` and `docker-compose*`, the test runner configs (`playwright.config.*` and the like), and the variables test setup reads (`.env.example`, `process.env.X` and its equivalents). Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense, never redefining one in passing.
2. **Report findings before editing anything:**
   - The placeholder first line still present: `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`
   - No runtime, or one that differs from the version the repo declares.
   - Dependencies not installed in the image, not installed from the current lockfile, or a dependency directory not declared by `VOLUME`.
   - A variable the tests read that `LABEL sandbox.env` doesn't name.
   - A service or browser the tests need that the image lacks.
3. **Interview** by invoking `jodysalt:grill-me` with the subject "the sandbox image at `Dockerfile.sandbox`". Give it this framing:
   - Seed the decision tree with the findings from step 2. Each comes with a recommended edit grounded in a file from step 1, citing it.
   - The files explored in step 1 count as explorable; a question they answer is never asked.
   - Every edit keeps `run-in-sandbox`'s contract: `WORKDIR /app`; dependencies installed in the image with each dependency directory declared by `VOLUME`; the host variables a run needs named in `LABEL sandbox.env="NAME NAME"`, names only. The base image is the runtime's official one pinned to the version the repo declares, never `latest`.
   - A service the tests need – a database, a cache – is proposed only when step 1 found evidence the tests need it: installed in the image and started by an `ENTRYPOINT` script that ends `exec "$@"`, so each run gets a private instance and `run-in-sandbox`'s `sh -c '{command}'` passes through unchanged. A browser is a package, installed without an entrypoint.
   - `Dockerfile.sandbox.dockerignore` may be created or edited to keep host dependency directories and build output out of the build context.
   - Only an answer the user agrees to lands, and the placeholder line goes with the first edit that does; a run where the user declines every question leaves both files byte for byte unchanged.
4. **Verify.** Skip when the placeholder line is still there: nothing landed. Otherwise invoke `jodysalt:run-in-sandbox` with the cheapest command that proves the image – the runtime's `--version` and a load of one dependency, plus a service's readiness check when one was added. Its build step is the build check: a failed build or smoke run goes back into the interview with its last lines, and the file is not done until both pass. Then offer, never force, a full test run through it.
5. **Report.** What changed in each file, the smoke result, and the full run's result when one ran. Leave the edits uncommitted and suggest `jodysalt:commit` (a `chore:` commit).

## Rules

- In a run declared unattended, the recommended answer stands for every question, and a service is still added only on evidence the tests need it.
- Edit `Dockerfile.sandbox` and `Dockerfile.sandbox.dockerignore` and nothing else; never the shared `.dockerignore`.
- Never create `Dockerfile.sandbox`; a missing one is `jodysalt:setup-skills`'s to write.
- Never write a secret's value: no `ENV` holding one, no `ARG` default. Host variables reach a run by name through `LABEL sandbox.env`.
- Never run a project command on the host; verification goes through `jodysalt:run-in-sandbox`.
- No branch gate: the file is source, not a planning doc.
- Never stages, commits or pushes.
