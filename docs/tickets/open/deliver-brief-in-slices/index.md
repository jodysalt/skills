---
title: Deliver Brief in Slices
type: refactor
priority: high
---

# Goal
`deliver-brief` runs the chain a person would run, and nothing more: scaffold the layout when it is missing, draft the ticket with `add-ticket`, commit it on the base, implement it with `complete-ticket`, land it with `wrap-up-worktree`, answering every question as the user from the brief. Slicing, judging and resuming are `complete-ticket`'s, so the body shrinks to a guard, a scaffold step, one stage prompt, five steps and a report. A brief into an empty directory still ends in a landed ticket, as today.

# Context
- `deliver-brief` today holds a scout stage, a `refine-vision` stage, a planning session per ticket and per parent pick, a judge stage, a pick path that drafts a sub-ticket on the ticket branch and lands the parent open, a parent judge from the main checkout, a 5-ticket cap, a 3-round cap, resume rules with a cursor over `docs/tickets/open/{slug}--*/` and a merge sweep over every worktree ahead of the base, and a scaffold path that runs `git init` and `setup-skills`.
- After `docs/tickets/open/ticket-slicing/`, which this ticket builds on, `complete-ticket` enters the ticket's worktree and calls `complete-ticket-slice` until `done`, resuming a stopped slice itself. Sub-tickets are drafted, implemented and closed on the parent branch; none has a worktree forked from the base. The cursor would find nothing in the main checkout and the sweep would fast-forward a slice branch onto the base.
- `add-ticket` step 1 offers a planning session and drafts on the current branch when declined. `complete-ticket` step 1 requires the ticket in the main checkout, which a docs commit on the base satisfies without a planning branch.
- The stage prompt template, the root's answering order (brief, then `docs/vision.md`, then the stage's recommendation) and `SendMessage` to the same sub-agent are the mechanics that stay.
- `setup-skills` writes `docs/vision.md` from a template whose prompts are one-liners such as "One paragraph on what this project is and the direction it is heading." The scout reports whether any remain; with the scout gone the root checks itself.
- The scaffold's second case, a repo with code and no vision, runs today in a planning session landed by `wrap-up-worktree`. With docs commits allowed on the base, it needs none.

# Scope

In:
- **Guard**, as today, from the main checkout, stopping at the first failure with nothing changed: `git rev-parse --show-toplevel` is the first path in `git worktree list`; a branch checked out; `git status --porcelain` empty. No repository is not a failure; the scaffold handles it.
- **Scaffold**, as today but on the base with no planning session: no repository, or one whose `HEAD` has no commit, gets `git init -b main` when needed, `jodysalt:setup-skills` and one `chore:` commit of everything present; a repository without `docs/vision.md` gets `jodysalt:setup-skills` and a `chore:` commit on the base. A vision still holding a `setup-skills` template prompt, found by the root with `grep -F` rather than a scout, gets a `refine-vision` stage with the brief quoted in its argument and a goal for the brief among `## Goals`, then a `docs:` commit on the base.
- **Brief or resume.** With a brief, the run drafts. With none, `ls -d docs/tickets/open/*/` must hold exactly one slug without `--`, and the run continues at the implement step with it; a worktree for it is entered, not re-added.
- **Draft.** An `add-ticket` stage on the base with the brief as its argument, the root declining the planning-session offer as the user so the ticket is drafted on the base, then `jodysalt:commit` in the root as a `docs:` commit staging `docs/tickets/open/{slug}` with the root's answers in its body. A stage that stops at the goal gate because nothing in a filled vision fits ends the run with the stop report; the root never adds a goal to a filled vision.
- **Implement.** `jodysalt:add-worktree {slug}` when missing and `jodysalt:enter-worktree {slug}` in the root, then a `complete-ticket` stage with the slug, which slices, loops and resumes. A stop in its report (a failed task, the slice cap) ends the run: `jodysalt:exit-worktree` so the session ends in the main checkout, the worktree left on disk, and the stop report.
- **Land.** `jodysalt:wrap-up-worktree {slug}` in the root, which closes the ticket, squashes the branch and fast-forwards it into the base. A merge that cannot fast-forward ends the run with the stop report.
- **Report.** The answers the root gave with their source; every check the `complete-ticket` stage left for a person; `git log --oneline` of the base for the run's two commits. On a stop: the reason, the branch, the worktree, the stage, and what is on disk for a resume.
- **Round cap 3** stays, as the one constant. The ticket cap, the scout, the judge, the pick path, the parent judge, the planning sessions, the cursor and the merge sweep go.
- The fast-forward-only rule gains its one exception: the run's docs and scaffold commits on the base. Description, README row and `## Stages and the root` follow.

Out:
- Any change to `add-ticket`, `complete-ticket`, `complete-ticket-slice` or `wrap-up-worktree`; `ticket-slicing` makes those, and this ticket starts once it has landed.
- Eval suites. Pushing.

# Acceptance criteria
- In a throwaway repo with the layout and a filled vision, `/jodysalt:deliver-brief <brief>` ends with no human turn with one closed ticket, its slices closed under `docs/tickets/closed/{slug}--*/`, a passing full suite, no worktree, and on `main` exactly two new commits: `docs:` for the ticket and the landed branch.
- In an empty directory it ends the same way, with a `chore:` scaffold commit and a `docs:` vision commit on `main` before the ticket's two, no planning branch ever created, and the vision filled with a goal the ticket delivers. In a repo with code and no `docs/vision.md` it scaffolds the layout on the base and continues. From inside a worktree, with a dirty tree, or with a detached `HEAD`, it stops with the reason and changes nothing.
- A brief nothing in a filled vision covers stops at the `add-ticket` stage with the stop report and no ticket drafted.
- Interrupted mid-slice and run again with no brief, it enters the ticket's existing worktree and the `complete-ticket` stage resumes that slice; it then lands as above. With two open tickets without `--` it stops and lists them.
- `grep -n "scout\|judge\|ticket cap\|planning" skills/deliver-brief/SKILL.md` finds nothing but the line that declines `add-ticket`'s planning-session offer. The README row matches the description and `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- Rewrite `skills/deliver-brief/SKILL.md` from this ticket's scope rather than editing the old body down; keep the stage prompt template and the answering paragraph verbatim where they still apply.
- The scaffold step's vision check is `grep -F` for the template prompts `setup-skills` writes, read from `skills/setup-skills/SKILL.md` at implementation time so the two stay in step; it replaces the scout's report of them.
- The scaffold's second case loses its planning session: `setup-skills`, `commit`, nothing else, mirroring the first case.
- The resume path is the brief-less argument plus `enter-worktree` when the worktree exists; everything else is `complete-ticket`'s.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, with `claude --plugin-dir` pointed at this ticket's worktree: one run from an empty directory, one from a repo with code and no layout, and one from a repo with the layout and a filled vision, then the remaining cases above, including one `Ctrl-C` mid-slice and a brief-less re-run.

# Rollout
- Bump `plugin.json` by a minor version; merging to `main` is the release. Breaking for a `deliver-brief` run in flight from the old shape: its open sub-tickets and worktrees are landed by hand with `wrap-up-worktree` first. Fallback is reverting the commit.

## Strategic fit
Builds on `ticket-slicing`: with `complete-ticket` slicing and resuming, `deliver-brief` keeps only the steps a person would take, which is what *One thing, then stop* and *Trim with the 80/20 principle* ask of it. It stands on *Unattended work needs structure*, since the structure now lives in one place instead of two. It respects the *Several plugins* non-goal.
