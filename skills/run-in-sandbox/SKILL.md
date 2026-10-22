---
name: run-in-sandbox
description: Runs commands in a sandbox – a fresh Docker container per run, built from `Dockerfile.sandbox` at the repo root with the checkout mounted at `/app` – in the background and in parallel, each run logging to the scratchpad and bringing back its exit code and its failures. Use when the user says "run the tests in the sandbox", "run X in a sandbox", "run the tests and the e2e tests in parallel", or runs `/run-in-sandbox`. Never edits `Dockerfile.sandbox`, never runs a command on the host, never leaves a container behind, never commits.
argument-hint: "[what to run – 'the tests', 'the e2e tests', a literal command; defaults to the tests]"
---

# Run in sandbox

Runs commands in a sandbox: a fresh Docker container per run, built from `Dockerfile.sandbox` at the repo root with the checkout mounted at `/app`, removed when the run exits. Runs go to the background so several proceed in parallel without sharing a filesystem, port or process, and each brings back its exit code and its failures, never its whole log. Tailoring the image is `jodysalt:refine-sandbox`'s job, not this one's.

## Command

$ARGUMENTS

One or more targets, each a phrase ("the tests", "the e2e tests") or a literal command (`npm run test:e2e -- --grep login`); "the tests and the e2e tests" is two targets. A literal command runs exactly as written. A phrase resolves against the manifest scripts – `package.json` `scripts`, `Makefile` and `justfile` targets and their equivalents – and `CLAUDE.md`: one clear match runs; several plausible ones (`test`, `test:unit`, `test:all`) are asked about once, with the options and a recommendation; none stops with the candidates listed. When empty, the target is "the tests": the project's default test command.

## Steps

1. **Preflight.** If `docker info` fails, stop with its message. If `Dockerfile.sandbox` is missing at the checkout root, stop and point at `jodysalt:setup-skills` to scaffold it, then `jodysalt:refine-sandbox` to tailor it. If its first line is exactly `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`, stop and offer to invoke `jodysalt:refine-sandbox`; on a decline, run anyway and warn that the image likely lacks the project's runtime.
2. **Resolve** each target to one command, as the Command section says. Name each resolved command before anything runs.
3. **Build.** Run `docker build -f Dockerfile.sandbox -t {image} .` from the checkout root once per invocation, before any run starts; the layer cache makes it a no-op unless the Dockerfile or a file it copies, such as a lockfile, changed. `{image}` is `{repo}-sandbox:{checkout}`: `{repo}` the main checkout's directory name, `{checkout}` the current checkout root's, both lowercased with any character outside `[a-z0-9_.-]` turned into `-`, so a worktree whose branch edits `Dockerfile.sandbox` never overwrites another's image. A failed build is reported with its last lines and stops the invocation. The image owns the dependencies: `Dockerfile.sandbox` installs them and declares each dependency directory with `VOLUME`, so every run gets a fresh copy seeded from the image over the checkout mount, and the skill knows no package manager.
4. **Environment.** Read the image's `sandbox.env` label (`docker image inspect -f '{{ index .Config.Labels "sandbox.env" }}' {image}`), a space-separated list of variable names, and pass each as `-e NAME`: Docker takes the value from the session's environment and leaves out a name unset there. No label, no passthrough.
5. **Launch.** For each command, one background Bash call (`run_in_background`), all in the same turn: `docker run --rm -v "{root}:/app" -w /app {env flags} {image} sh -c '{command}' > {log} 2>&1`, `{root}` being the current checkout root and `{log}` a fresh file in the scratchpad named for the target. In a worktree, also mount the common git dir (`git rev-parse --git-common-dir`, made absolute) read-only at its host path, so git resolves the worktree's `.git` pointer inside the run. Say which runs started and where each logs, then end the turn; separate invocations overlap the same way.
6. **Collect.** As each run exits, read its log and report the exit code and either one pass line or the failures: each failing test's name, assertion and first stack frames, trimmed to what locates the fault. Give the log path for the rest.
7. **Report.** Once every run has exited: one line per run with its target, command, exit code and log path, then the files the runs wrote into the checkout (coverage, `test-results/` and the like, from `git status --short`), left in place. Nothing is staged or committed.

## Rules

- In a run declared unattended, nothing is asked: an ambiguous phrase takes the recommended match and names it, and a placeholder `Dockerfile.sandbox` runs with its warning.
- Never runs a command on the host as a fallback; no Docker, no run.
- Never edits `Dockerfile.sandbox`; that is `jodysalt:refine-sandbox`'s file.
- Never passes the host environment through beyond the names the `sandbox.env` label declares.
- Never pastes a whole log into the conversation.
- Never leaves a container behind: every run is `--rm`.
- No interactive shell, no splitting one suite across containers (pass the runner's own shard flags as a literal command), no timeout of its own: a run is stopped by stopping its background task.
- Never stages, commits or pushes.
