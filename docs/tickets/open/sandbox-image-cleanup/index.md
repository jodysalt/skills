---
title: Sandbox Image Cleanup
type: fix
---

# Goal
Sandbox images stop piling up. `run-in-sandbox` cleans up after itself on every build, so Docker holds one tag per live checkout and no superseded builds, and disk space no longer fills with 2 GB images nobody uses.

# Context
- `run-in-sandbox` step 3 tags each build `{repo}-sandbox:{checkout}`, one tag per checkout, so a worktree whose branch edits `Dockerfile.sandbox` never overwrites another's image. Nothing ever removes a tag, and its rules promise only "never leaves a container behind".
- Seen in blognami-saas: ten tags on one image, nine of them for worktrees already removed; two untagged 2.35 GB builds left behind when rebuilds moved the main checkout's tag.
- Tags sharing an image cost no extra disk; a stale tag only costs space once the image it pins is superseded. An untagged superseded build always costs its full size.
- `docker rmi {tag}` on an image's last tag deletes the image; `docker image prune` removes only untagged images and skips one a container is using.

# Scope
In:
- `run-in-sandbox` sweeps stale tags after each build: it lists the `{repo}-sandbox:*` tags and removes each one whose checkout no longer appears in `git worktree list`, deriving the live tags with the same sanitising rule step 3 names images with. Every way a worktree can vanish is covered – `remove-worktree`, Claude Code's own worktree removal, a bare `git worktree remove` – and tags left before this fix go on the first run.
- `run-in-sandbox` builds with `--label sandbox.repo={repo}` and, after each build, runs `docker image prune -f --filter label=sandbox.repo={repo}`, removing this repo's superseded builds – and any image the tag sweep left untagged – while Docker skips one a running container still uses until a later build.
- Cleanup is best effort: it runs after the build and before any run launches, and a failed removal or prune is one line in the report, never a stop.
- Step 7's report gains one line naming the stale tags removed and the count of builds pruned, and nothing when nothing was.
- A Rule: cleanup only ever removes `{repo}-sandbox:*` tags and untagged images labelled `sandbox.repo={repo}`; the main checkout's tag is always live, since it is the first path in `git worktree list`.
- The `run-in-sandbox` description and `README.md` row add "never leaves a stale image behind"; `plugin.json` to `0.21.0`.

Out:
- The worktree skills (`remove-worktree`, `remove-worktrees`, `wrap-up-worktree`) stay Docker-free; a tag outlives its worktree until the next sandbox run in the repo, which costs no disk while it points at a live image.
- Untagged builds made before this fix carry no label, so the prune never sees them; Rollout gives the one-off manual cleanup.
- Two repos whose directories share a name share `{repo}` today; unchanged here.
- Pushing.

# Acceptance criteria
- In a repo with two worktrees that have each run the sandbox, removing one and running `/jodysalt:run-in-sandbox` from the other removes the removed worktree's tag and keeps the main checkout's and the live worktree's.
- Editing `Dockerfile.sandbox` and running again leaves no untagged `sandbox.repo={repo}` image behind, unless a running container still uses it, in which case the next build prunes it.
- Images and tags from other repos, and images without the label, are untouched.
- A failed removal or prune is reported in one line and the runs still launch.
- The report names the tags removed and the builds pruned, and says nothing about cleanup when nothing was cleaned.
- The description and README row match; `plugin.json` is `0.21.0`; `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- **`skills/run-in-sandbox/SKILL.md` step 3.** `docker build -f Dockerfile.sandbox --label sandbox.repo={repo} -t {image} .`; the label adds no layer worth noting and keeps the cache.
- **New cleanup step after the build.** Live tags: the sanitised basename of each path in `git worktree list`. Stale: `docker images {repo}-sandbox --format '{{.Tag}}'` minus the live tags, each `docker rmi {repo}-sandbox:{tag}`. Then `docker image prune -f --filter label=sandbox.repo={repo}`. Errors are collected for the report, never stop the invocation.
- **Step 7** gains the cleanup line; **Rules** gain the scope rule, and "never leaves a container behind" grows "or a stale image".
- **`README.md`** row and **`.claude-plugin/plugin.json`** version.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, throwaway repo with a tailored `Dockerfile.sandbox` and `claude --plugin-dir` pointed at this ticket's worktree:
  - two worktrees, run the sandbox in each; remove one; run from the other: its tag is gone, the main and live tags remain.
  - edit `Dockerfile.sandbox`, run again: no untagged labelled image left.
  - an unrelated image and an unlabelled dangling image survive.

# Rollout
No flag; the first sandbox run after updating clears stale tags. Builds left untagged before the fix carry no label: clear them once by hand with `docker images -f dangling=true` and `docker rmi {id}` for the sandbox ones, or `docker image prune -f` when nothing else dangling is worth keeping.
