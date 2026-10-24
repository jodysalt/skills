# Tasks

## Add the `--label sandbox.repo={repo}` build flag and a new step 4 Cleanup to skills/run-in-sandbox/SKILL.md, renumbering Environment, Launch, Collect, Report to 5–8
- **category:** functional
- **status:** done
- **steps:**
  - Step 3's build command reads `docker build -f Dockerfile.sandbox --label sandbox.repo={repo} -t {image} .`: `grep -n -- '--label sandbox.repo={repo}' skills/run-in-sandbox/SKILL.md` matches.
  - New step 4, `**Cleanup.**`, best effort after the build and before any run launches: live tags are the basename of each path in `git worktree list`, sanitised as step 3 names images (the main checkout, the first path, always live); stale tags are `docker images {repo}-sandbox --format '{{.Tag}}'` minus the live ones, each removed with `docker rmi {repo}-sandbox:{tag}`; then `docker image prune -f --filter label=sandbox.repo={repo}`; a failed removal (a running container's image included) or prune is collected for the report, never a stop. `grep -n "image prune -f --filter label=sandbox.repo={repo}" skills/run-in-sandbox/SKILL.md` matches.
  - `grep -nE '^[0-9]\. \*\*' skills/run-in-sandbox/SKILL.md` lists Preflight, Resolve, Build, Cleanup, Environment, Launch, Collect, Report as 1–8, and Launch's "carry on to steps 6 and 7" now reads "steps 7 and 8".

## Add the cleanup report line, the cleanup scope Rule and "never leaves a container or a stale image behind" to skills/run-in-sandbox/SKILL.md
- **category:** functional
- **status:** done
- **steps:**
  - Step 8 (Report) gains one line naming the stale tags removed and the count of builds pruned, plus any failed removal or prune, and no cleanup line when nothing was cleaned and nothing failed.
  - The Rules line "Never leaves a container behind: every run is `--rm`." reads "Never leaves a container or a stale image behind: every run is `--rm`, and each build is followed by the cleanup step."; a new Rule says cleanup only ever removes `{repo}-sandbox:*` tags and untagged images labelled `sandbox.repo={repo}`, the main checkout's tag always live.
  - The frontmatter `description` reads "never leaves a container or a stale image behind": `grep -c 'stale image behind' skills/run-in-sandbox/SKILL.md` prints at least 2.

## Add "Never leaves a stale image behind." to the run-in-sandbox row in README.md and bump .claude-plugin/plugin.json to 0.21.0
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n 'run-in-sandbox/SKILL.md' README.md` shows the row ending with "Never leaves a stale image behind."
  - `grep -n '"version"' .claude-plugin/plugin.json` prints `"version": "0.21.0"`, and `git diff .claude-plugin/plugin.json` shows only that line changed.

## Prove the run-in-sandbox cleanup commands in a scratch repo under the session scratchpad
- **category:** non-functional
- **status:** done
- **steps:**
  - In a throwaway git repo under the scratchpad with a minimal `Dockerfile.sandbox` (e.g. `FROM alpine:3.20`) and one worktree under `.claude/worktrees/`, build `{repo}-sandbox:{checkout}` with `--label sandbox.repo={repo}` for both checkouts, remove the worktree, then run step 4's sweep and prune commands exactly as `skills/run-in-sandbox/SKILL.md` writes them from the main checkout: the removed worktree's tag is gone, the main checkout's tag stays.
  - Edit the scratch `Dockerfile.sandbox`, rebuild the main tag, run the prune: `docker images -f dangling=true -f label=sandbox.repo={repo} -q` prints nothing, while an unlabelled dangling image and an image tagged for another repo name created for the check survive. Remove every scratch image afterwards.
- **notes:**
  - Step 4 (line 22 of `skills/run-in-sandbox/SKILL.md`) gives the live-tag derivation as prose, not a command: take each path from `git worktree list`, basename it, lowercase it and turn any character outside `[a-z0-9_.-]` into `-`; only `docker images`, `docker rmi` and `docker image prune` are literal there.
  - The session's worktree guard refuses a Bash command that pipes a heredoc to `python3` when the text mentions git; use plain shell or the Edit tool instead.

## Run full test suite for sandbox-image-cleanup--cleanup-step
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills --strict`) and confirm both pass.
