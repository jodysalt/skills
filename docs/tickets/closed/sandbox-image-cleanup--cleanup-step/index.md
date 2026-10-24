---
title: Cleanup Step
type: fix
priority: high
---

# Goal
`/jodysalt:run-in-sandbox` cleans up after every build: it labels its builds `sandbox.repo={repo}`, removes the `{repo}-sandbox:*` tags whose checkout is gone, and prunes this repo's untagged builds, so Docker holds one tag per live checkout and no superseded 2 GB images. The plugin reads `0.21.0`, so the first merge to `main` releases it.

# Context
- Parent: `docs/tickets/closed/sandbox-image-cleanup/index.md`. This one slice covers the whole parent, which is already one small change to one skill plus its README row and the version bump; splitting the tag sweep from the label-and-prune would be artificial.
- `skills/run-in-sandbox/SKILL.md` steps today: 1 Preflight (line 19), 2 Resolve, 3 Build (line 21), 4 Environment, 5 Launch (line 23, which ends "carry on to steps 6 and 7 in the same turn"), 6 Collect, 7 Report (line 25). Step 3 builds with `docker build -f Dockerfile.sandbox -t {image} .` and names `{image}` `{repo}-sandbox:{checkout}`, `{repo}` the main checkout's directory name and `{checkout}` the current checkout root's, both lowercased with any character outside `[a-z0-9_.-]` turned into `-`.
- The Rules (line 34) say "Never leaves a container behind: every run is `--rm`."; the frontmatter `description` (line 3) ends "never leaves a container behind, never commits." `README.md` line 46 is the skill's row and carries no "Never" clause today.
- No other skill or doc cites `run-in-sandbox` by step number (`grep -rn` over `skills/` finds none), so renumbering is safe.
- `docker rmi {tag}` on a tag that shares its image only untags; on an image's last tag it deletes the image, and fails with a conflict when a container still uses it. `docker image prune -f` removes only untagged (dangling) images and skips one a container uses; `--filter label=sandbox.repo={repo}` narrows it to this repo's builds.
- `.claude-plugin/plugin.json` reads `"version": "0.20.0"`. The vision's *`main` is always installable* principle bumps the version on a change to a skill's behaviour.
- The run that drafts this slice is on the `sandbox-image-cleanup` ticket branch; the planning-session offer was declined.

# Scope
In:
- **Step 3, Build.** The command becomes `docker build -f Dockerfile.sandbox --label sandbox.repo={repo} -t {image} .`, nothing else in the step changed.
- **New step 4, Cleanup.** After the build and before any run launches, best effort:
  - Live tags: the basename of each path in `git worktree list`, sanitised with step 3's rule; the main checkout, the first path, is always live.
  - Stale tags: `docker images {repo}-sandbox --format '{{.Tag}}'` minus the live tags; each removed with `docker rmi {repo}-sandbox:{tag}`. This covers every way a worktree vanishes and the tags left before this fix.
  - Then `docker image prune -f --filter label=sandbox.repo={repo}`, removing this repo's superseded builds and any image the sweep left untagged; Docker skips one a running container uses until a later build.
  - A failed removal or prune is collected for the report, never a stop.
- **Renumbering.** Environment, Launch, Collect and Report become steps 5–8; Launch's "steps 6 and 7" becomes "steps 7 and 8".
- **Step 8, Report.** Gains one line naming the stale tags removed and the count of builds pruned, plus any failed removal or prune; no cleanup line when nothing was cleaned and nothing failed.
- **Rules.** "Never leaves a container behind: every run is `--rm`." grows to "Never leaves a container or a stale image behind: every run is `--rm`, and each build is followed by the cleanup step." A new rule: cleanup only ever removes `{repo}-sandbox:*` tags and untagged images labelled `sandbox.repo={repo}`; the main checkout's tag is always live.
- **Description and README row.** The frontmatter `description` reads "never leaves a container behind" as "never leaves a container or a stale image behind"; `README.md` line 46 gains "Never leaves a stale image behind." so the row names the change.
- **Release.** `.claude-plugin/plugin.json` from `0.20.0` to `0.21.0`, nothing else in it changed.

Out:
- The worktree skills (`remove-worktree`, `remove-worktrees`, `wrap-up-worktree`) stay Docker-free.
- Untagged builds made before this fix carry no label; the parent's Rollout gives the one-off manual cleanup.
- Two repos whose directories share a name share `{repo}`; unchanged.
- Every other skill. Pushing.

# Acceptance criteria
- `grep -n -- '--label sandbox.repo={repo}' skills/run-in-sandbox/SKILL.md` shows step 3's build command; `grep -n "image prune -f --filter label=sandbox.repo={repo}" skills/run-in-sandbox/SKILL.md` shows step 4.
- `grep -nE '^[0-9]\. \*\*' skills/run-in-sandbox/SKILL.md` lists exactly Preflight, Resolve, Build, Cleanup, Environment, Launch, Collect, Report as 1–8, and Launch says "steps 7 and 8".
- Step 4 derives live tags from `git worktree list` with step 3's sanitising rule, removes only `{repo}-sandbox:*` tags outside them, then prunes with the label filter, and turns a failed removal or prune into a report line, never a stop.
- Step 8 names the removed tags and pruned count in one line, and says nothing about cleanup when nothing was cleaned.
- The Rules carry the scope rule and "never leaves a container or a stale image behind".
- The `description` and `README.md` line 46 both say the skill never leaves a stale image behind.
- `.claude-plugin/plugin.json` reads `"version": "0.21.0"` and nothing else in it changed; `claude plugin validate skills --strict` passes.
- `git diff --stat` against the parent branch lists exactly `skills/run-in-sandbox/SKILL.md`, `README.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.
- Nothing is pushed.

# Implementation notes
- **Step 4 shape.** One bold-titled step like its neighbours: "**Cleanup.** Best effort, after the build and before any run launches: …". Keep the commands inline in backticks as step 3 does; `{{.Tag}}` stays literal, as step 4's `{{ index … }}` does today.
- `docker images {repo}-sandbox` lists only tagged references, so dangling builds never reach the sweep; the prune handles them.
- A stale tag on an image a running container still uses fails `docker rmi` with a conflict; that is a failed-removal report line, and the next run retries it.
- `{checkout}` sanitising: reuse step 3's wording by reference ("sanitised as step 3 names images") rather than restating the rule.
- **Release.** `"version": "0.20.0"` to `"version": "0.21.0"`, then `claude plugin validate skills --strict`.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep` and `git diff --stat` checks above.
- Scratch Docker check (Docker is available on this machine), in a throwaway repo under the session scratchpad with a minimal `Dockerfile.sandbox` and one worktree: build with the label as both checkouts, remove the worktree, run step 4's commands by hand from the main checkout – the removed worktree's tag goes, the main tag stays; edit the Dockerfile, rebuild, prune – no untagged `sandbox.repo={repo}` image left; an unlabelled dangling image and another repo's image survive. Clean up the scratch images afterwards.
- Left for a person: the same flow through `/jodysalt:run-in-sandbox` in an interactive session with `claude --plugin-dir` pointed at this worktree, checking the report's cleanup line appears only when something was cleaned.

# Rollout
Lands on the `sandbox-image-cleanup` branch as one commit; that branch lands on `main` and users auto-update to `0.21.0`. The first sandbox run after updating clears stale tags; pre-fix untagged builds are cleared by hand per the parent's Rollout. Fallback is reverting the commit.
