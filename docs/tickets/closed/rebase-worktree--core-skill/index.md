---
title: Core Skill
type: feat
priority: high
---

# Goal
`/jodysalt:rebase-worktree [name]` exists as a standalone skill: it replays a worktree's branch onto the base – the branch the main checkout has checked out – reports "nothing to rebase" as a success when the base has not moved, walks a person through each conflict file by file, and in an unattended run aborts on a conflict with the branch unchanged. Every report says the branch is untested on the new base, since the sandbox re-verify is a later slice's.

# Context
- Parent: `docs/tickets/closed/rebase-worktree/index.md`. This slice moves its criteria 1 (nothing to rebase), 2 (clean replay), 3 (attended conflicts and bail), 4 (unattended abort), 6 (guards), 7 (upstream note), and the README row and both `validate` runs of criterion 10. Left for later slices: criterion 5 (the opted-in re-verify through `jodysalt:run-in-sandbox` of a ticket's full-suite gate), criteria 8 and 9 (the `wrap-up-worktree` and `merge-worktree` edits), the `deliver-brief` rule edit, and the `plugin.json` bump to `0.20.0`.
- *unattended* is the glossary's sense (`docs/glossary.md`): the caller's framing is the only signal; a run nobody declared unattended is a person's run.
- Shape to copy: `skills/wrap-up-worktree/SKILL.md` – frontmatter `name` / `description` / `argument-hint`, a `## Worktree` section on `$ARGUMENTS` (empty: the worktree the session is in; from the main checkout, `AskUserQuestion` with one option per registered worktree under `.claude/worktrees/`, labelled with name and branch, never the main checkout; none: say so and stop; the built-in "Other" covers a typed name), step 1 entering through `jodysalt:enter-worktree <name>`, step 2 guards run in parallel, `## Rules`.
- The main checkout is the first path in `git worktree list`; the base is `git -C <main checkout> branch --show-current`.
- `skills/squash-commits/SKILL.md` step 5 tells the user a pushed branch needs `git push --force-with-lease` and never runs it; this skill follows suit.
- During a rebase git's sides are swapped from a merge's: `--ours` / stage 2 is the base (the commits being replayed onto), `--theirs` / stage 3 is the branch's commit being replayed.
- `.claude-plugin/plugin.json` reads `0.19.0`; this slice leaves it there.
- This repo has no test suite; checks are `grep`, `claude plugin validate .` and `claude plugin validate skills`.

# Scope
In:
- **`skills/rebase-worktree/SKILL.md`**, new, in the worktree family's shape.
- **Frontmatter.** `name: rebase-worktree`; a `description` saying it rebases a `.claude/worktrees/<name>` worktree's branch onto the branch the main checkout has checked out, local `main` in the usual case, naming the trigger phrases "rebase the worktree", "rebase X onto main", "update the branch from main" and `/rebase-worktree`, saying a conflict is resolved file by file with a person and aborted in an unattended run, and that it never pushes or fetches; an `argument-hint` like `wrap-up-worktree`'s.
- **`## Worktree`** as in `wrap-up-worktree`, with "no worktree to rebase" as the none case.
- **Steps:**
  1. *Enter it* through `jodysalt:enter-worktree <name>` when the session is not already in `<main checkout>/.claude/worktrees/<name>`; take the branch from `git worktree list`. The session stays in the worktree afterwards.
  2. *Guard*, in parallel, before anything changes, stopping at the first failure with its reason: `git status --porcelain` in the worktree is empty (dirty: commit or discard first); no rebase already in progress in the worktree (the paths `git rev-parse --git-path rebase-merge` and `rebase-apply` print are absent; otherwise say to finish or abort it); `git -C <main checkout> branch --show-current` prints a branch (detached `HEAD`: the main checkout must have a branch checked out); the branch is not the base. A dirty main checkout is fine; the rebase only reads the base.
  3. *Ancestor check:* `git merge-base --is-ancestor <base> <branch>` succeeding means nothing to rebase – say so, change nothing, and end as a success.
  4. *Rebase:* note the tip (`git rev-parse HEAD`) and `git rev-list --count <base>..HEAD`, then `git rebase <base>`.
  5. *Conflicts:* while the rebase stops on a conflict, list the files with `git diff --name-only --diff-filter=U`.
     - Unattended: `git rebase --abort` without asking, then stop, listing the conflicting files and confirming the tip is the noted one.
     - Attended: one file at a time, show the commit being replayed (`git log -1 --oneline REBASE_HEAD`), the base's side and the branch's side of each conflicted hunk, and a proposed combination, then `AskUserQuestion` with four options: take the base's side (`git checkout --ours -- <file>`), take the branch's side (`git checkout --theirs -- <file>`), the proposed combination (written to the file), edit by hand (wait for the person to say the file is done and check no conflict markers are left). `git add` each resolved file; once none is left, `GIT_EDITOR=true git rebase --continue`, and repeat on the next stop. A bail at any point – the person says stop, or picks it through "Other" – runs `git rebase --abort`; report that the tip is the noted one.
  6. *Report:* the number of commits replayed onto `<base>` (the count from step 4) and the new tip; that the branch is untested on the new base; when `git rev-parse --abbrev-ref --symbolic-full-name @{upstream}` succeeds, that the next push needs `git push --force-with-lease`, never run.
- **Rules:** never pushes, fetches, merges, resets, stashes or forces; never resolves a conflict without a person's choice for that file; when it stops mid-rebase it aborts rather than leaving a rebase in progress; the base is the local branch as the main checkout has it; it never checks anything out in the main checkout.
- **`README.md`:** a row for `rebase-worktree`, in alphabetical order between its neighbours, summarising the description.

Out:
- The sandbox re-verify step through `jodysalt:run-in-sandbox` of a ticket's full-suite gate; a later slice. Until it lands the report always carries the untested note, and that slice inserts its step before the report.
- `skills/wrap-up-worktree/SKILL.md`, `skills/merge-worktree/SKILL.md`, `skills/deliver-brief/SKILL.md`: unchanged in this slice.
- `.claude-plugin/plugin.json` to `0.20.0`.
- `docs/glossary.md`: not edited.
- A base-branch argument, a remote base, `--no-ff`, merge commits, autostash.

# Acceptance criteria
- `skills/rebase-worktree/SKILL.md` exists with frontmatter `name: rebase-worktree`, a `description` holding "rebase the worktree", "rebase X onto main", "update the branch from main" and `/rebase-worktree` and saying it never pushes or fetches, and an `argument-hint`.
- It has a `## Worktree` section on `$ARGUMENTS` with the empty, main-checkout pick and none cases, and step 1 enters through `jodysalt:enter-worktree`.
- Its guards – clean worktree, no rebase in progress, main checkout on a branch, branch not the base – run before anything changes; a dirty main checkout is not a stop.
- With the base an ancestor of the branch, it says there is nothing to rebase, changes nothing, and ends as a success.
- With the base moved and no conflict, it runs `git rebase <base>`, after which `git merge-base --is-ancestor <base> <branch>` succeeds, and reports the commits replayed onto the named base.
- Attended conflicts: each file from `git diff --name-only --diff-filter=U` is offered one at a time with both sides and a proposed combination, through `AskUserQuestion` with base side / branch side / proposed combination / edit by hand, then `git rebase --continue`; a bail runs `git rebase --abort` and the tip is the commit noted before the rebase.
- Unattended conflicts: `git rebase --abort` with no question, the conflicting files listed, the tip unchanged.
- The report says the branch is untested on the new base, and, when the branch has an upstream, that the next push needs `git push --force-with-lease`; no step runs `git push` or `git fetch`.
- `## Rules` forbids pushing, fetching, merging, resetting and forcing, resolving a conflict without a person's choice, and leaving a rebase in progress on a stop.
- `README.md` has a row for `rebase-worktree`.
- `claude plugin validate .` and `claude plugin validate skills` pass.
- `git diff --stat rebase-worktree` lists exactly `skills/rebase-worktree/SKILL.md` and `README.md`, this ticket's own files aside.

# Implementation notes
- Copy `skills/wrap-up-worktree/SKILL.md`'s `## Worktree` paragraph and step 1 nearly verbatim; its guard bullets give the wording for the dirty, detached-`HEAD` and on-base stops.
- Base / branch sides map to `--ours` / `--theirs` during a rebase; say so in the step so the mapping is not guessed. A modify/delete conflict offers keep (`git add`) or delete (`git rm`) in place of the two sides.
- `GIT_EDITOR=true` keeps `git rebase --continue` from opening an editor for the replayed commit's message.
- The upstream check runs in the worktree after the rebase; no upstream, no note.
- One short intro line under the title, like `wrap-up-worktree`'s: rebase, and only with a person deciding each conflict.

# Test plan
- `claude plugin validate .` and `claude plugin validate skills`.
- The `grep` and `git diff --stat` checks above.
- Left for a person (an interactive session with `claude --plugin-dir` pointed at this worktree, a throwaway repo: `git init`, a commit on `main`, `add-worktree` a branch with a commit): base not moved; a non-conflicting commit on `main`; a conflicting commit on `main` resolved together; the same with a bail (tip unchanged); the same framed as unattended (abort, no question); a dirty worktree; a branch with an upstream (note, nothing pushed).

# Rollout
Lands on the `rebase-worktree` branch as one commit; no version bump in this slice, the parent's last slice bumps to `0.20.0`. Nothing calls the skill yet, so no existing behaviour changes. Fallback is reverting the commit.

## Strategic fit
Advances `rebase-worktree` by delivering the skill itself – the replay, the guards, the attended walk and the unattended abort – that the later slices wire into `wrap-up-worktree` and re-verify through the sandbox.
