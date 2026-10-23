---
name: rebase-worktree
description: Rebases the branch of a `.claude/worktrees/<name>` worktree onto the branch the main checkout has checked out, local `main` in the usual case, running inside that worktree. Use when the user says "rebase the worktree", "rebase X onto main", "update the branch from main", or runs `/rebase-worktree`. Says there is nothing to rebase when the base has not moved; a conflict is resolved file by file with a person, and in an unattended run the rebase is aborted with the branch unchanged. In a repo opted in to the sandbox it re-runs the tests through `run-in-sandbox` after a rebase, stopping on a failure with the rebased branch kept; elsewhere it reports the branch untested on the new base. Refuses on a dirty worktree, a rebase already in progress, a detached main checkout, or a worktree on the base branch, before anything changes. Never pushes or fetches.
argument-hint: "[worktree name – defaults to the worktree the session is in, else a pick from the existing worktrees]"
---

# Rebase worktree

Replay a worktree's branch onto the base, and only with a person deciding each conflict.

## Worktree

$ARGUMENTS

A name under `.claude/worktrees/`. If empty, take the worktree the session is in. If empty and the session is in the main checkout (`git rev-parse --show-toplevel` equals the first path in `git worktree list`), run `git worktree list` and ask with `AskUserQuestion`, one option per registered worktree under `.claude/worktrees/` labelled with its name and branch, never the main checkout. None: say there is no worktree to rebase and stop. The built-in "Other" option covers a typed name, so don't add one.

## Steps

1. **Enter it.** If the session isn't already in `<main checkout>/.claude/worktrees/<name>`, invoke `jodysalt:enter-worktree <name>`, from the main checkout or from another worktree. Take the worktree's branch from `git worktree list`. The session stays in the worktree afterwards.
2. **Guard**, in parallel, before anything changes; stop at the first failure with its reason. A dirty main checkout is fine: the rebase only reads the base.
   - `git status --porcelain` in the worktree – must be empty; otherwise say the worktree is dirty and to commit or discard it first.
   - `git rev-parse --git-path rebase-merge` and `git rev-parse --git-path rebase-apply` in the worktree – neither printed path may exist; otherwise a rebase is already in progress: say to finish it or abort it first.
   - `git -C <main checkout> branch --show-current`, the main checkout being the first path in `git worktree list` – must print a branch, the base the worktree is rebased onto; otherwise `HEAD` is detached there: say the main checkout must have a branch checked out.
   - The branch must not be the base; otherwise say there is nothing to rebase from a worktree on the base branch.
3. **Ancestor check:** `git merge-base --is-ancestor <base> <branch>`. When it succeeds the base has not moved: say there is nothing to rebase onto `<base>`, change nothing, and end here as a success.
4. **Rebase.** Note the tip with `git rev-parse HEAD` and the count with `git rev-list --count <base>..HEAD`, then run `git rebase <base>`. When it completes without a stop, go to step 6.
5. **Conflicts.** While the rebase stops on a conflict, list the conflicting files with `git diff --name-only --diff-filter=U`. During a rebase git's sides are swapped from a merge's: `--ours` (stage 2) is the base, the commits being replayed onto; `--theirs` (stage 3) is the branch's commit being replayed.
   - **Unattended** (the caller's framing declared it): run `git rebase --abort` without asking, then stop, listing the conflicting files and confirming `git rev-parse HEAD` is the tip noted in step 4.
   - **Attended:** take the files one at a time. For each, show the commit being replayed (`git log -1 --oneline REBASE_HEAD`), the base's side and the branch's side of each conflicted hunk, and a proposed combination of the two, then ask with `AskUserQuestion`, four options:
     - Take the base's side: `git checkout --ours -- <file>`.
     - Take the branch's side: `git checkout --theirs -- <file>`.
     - The proposed combination: write it to the file.
     - Edit by hand: wait for the person to say the file is done, then check no conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) are left; if any are, say where and wait again.

     A modify/delete conflict offers keep (`git add <file>`) or delete (`git rm <file>`) in place of the two sides. `git add` each resolved file. Once `git diff --name-only --diff-filter=U` lists none, run `GIT_EDITOR=true git rebase --continue`, and repeat this step on the next stop; once the rebase completes, go to step 6.

     A bail at any point – the person says stop, or picks it through "Other" – runs `git rebase --abort`; report that `git rev-parse HEAD` is the tip noted in step 4, and stop.
6. **Re-verify.** Only after step 4's rebase completed, directly or after step 5's resolved conflicts; "nothing to rebase" (step 3) and every abort skip it. The repo has opted in to the sandbox when `Dockerfile.sandbox` exists at the checkout root and its first line is not the placeholder marker `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`.
   - **Opted in**, on any branch, planning branches included: invoke `jodysalt:run-in-sandbox` with the target "the tests", saying it needs the result, and wait for it. An exit of 0 is a passed re-verify: go to step 7.
   - A non-zero exit, or `run-in-sandbox` stopping because it cannot resolve one test command: stop with its report – the failures and log path, or the candidates listed – keeping the rebased branch as it is for a person: no abort, no reset. When `run-in-sandbox` stops because `docker info` fails, or a `docker` call is refused by the session's permissions, stop the same way as a blocker: name Docker with the `docker info` message and say to start Docker and rerun, or name the refused permission; nothing runs on the host.
   - **Not opted in** (no `Dockerfile.sandbox`, or the placeholder): run nothing; step 7 says the branch is untested on the new base and why.
7. **Report:** the number of commits replayed onto `<base>`, the count from step 4, and the new tip from `git rev-parse HEAD`; then the re-verify result from step 6 – the resolved test command and that it passed in the sandbox – or, without the opt-in, that the branch is untested on the new base, with the reason: no `Dockerfile.sandbox`, or `Dockerfile.sandbox` is the placeholder. Then, in the worktree, run `git rev-parse --abbrev-ref --symbolic-full-name @{upstream}`: when it succeeds, say the branch has an upstream and the next push needs `git push --force-with-lease`. Don't run it. No upstream, no note.

## Rules

- Never pushes, fetches, merges, resets, stashes or forces; never runs `git push` or `git fetch`.
- Never resolves a conflict without a person's choice for that file; an unattended run aborts instead.
- When it stops mid-rebase it runs `git rebase --abort` rather than leaving a rebase in progress; a re-verify stop comes after the rebase completed, so it keeps the rebased branch and resets nothing.
- Never runs the tests on the host; in a repo opted in to the sandbox they go through `jodysalt:run-in-sandbox` only, and no Docker is a stop.
- The base is the local branch as the main checkout has it; never checks anything out in the main checkout.
