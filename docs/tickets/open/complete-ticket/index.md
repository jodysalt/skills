---
title: Complete Ticket
type: feat
priority: high
---

# Goal
A user breaks a ticket into tasks just before implementing it, not when drafting it, so changes that land in between can't make the backlog redundant or wrong. One command, `/jodysalt:complete-ticket`, takes an open ticket from the base branch to a finished backlog: it adds the ticket's worktree if missing, enters it, adds the tasks if there are none, and runs the loop. `add-tasks` stays usable anywhere, but nothing in the workflow points at it from a planning session any more.

# Context
- Today the chain after drafting is three manual steps on two branches: `add-tasks` in the planning session, landed with the ticket; then `add-worktree <slug>`, `enter-worktree <slug>` and `complete-tasks`. Days can pass between the two, and the backlog inlines paths, symbols and steps that other tickets may have changed by then.
- Nothing in the skills tells a person to run `add-tasks` in a planning session, but this repo's `CLAUDE.md` block (written by `setup-skills` step 4) and `README.md`'s Workflow paragraph read "draft with `add-ticket`, break a ticket down with `add-tasks`, and run the loop with `complete-tasks`". So right after `add-ticket` finishes, the agent suggests `/jodysalt:add-tasks` on the planning branch.
- `add-worktree` runs only from the main checkout and forks from what it has checked out, so a ticket still on an unlanded planning branch is missing from a new ticket worktree. `wrap-up-worktree` on the planning branch lands it.
- `complete-tasks` stops when a worker leaves the tree dirty, and `add-tasks` never commits, so a fresh `tasks.md` must be committed before the loop starts.
- `deliver-brief` runs `add-tasks` as a stage in step 4's planning session, and its resume rules send a ticket with no `tasks.md` "to step 4 from `add-tasks` on", including a sub-ticket picked by the judge on a ticket branch, which today gets a planning session just for its tasks. Its root runs every worktree skill itself because a stage that entered a worktree would move only itself; a stage spawned after the root has entered the ticket's worktree starts there and needs no switch. Step 5 today runs a `complete-tasks` stage there, which spawns the workers, so a stage that spawns workers is already the norm.
- `plugin.json` is `0.9.0` and bumps on any change to a skill's behaviour. `claude plugin validate .` and `claude plugin validate skills --strict` gate the manifest and frontmatter.

# Scope

In:
- **`complete-ticket`**, a new skill at `skills/complete-ticket/SKILL.md`. Argument: a slug, a `docs/tickets/open/{slug}` directory or any file inside it, resolved as `complete-tasks` resolves it: empty takes the current branch's ticket, else the only open ticket, else asks; a closed ticket stops it. Then, in order, with no pause:
  - **Guard.** `docs/tickets/open/{slug}/` must exist in the main checkout, the first path in `git worktree list`. Otherwise stop and say to land the planning branch with `jodysalt:wrap-up-worktree` first; it never lands anything itself.
  - **Worktree.** If the session is already in `<main checkout>/.claude/worktrees/{slug}`, skip this. If `.claude/worktrees/{slug}` exists, `jodysalt:enter-worktree {slug}`. Otherwise `jodysalt:exit-worktree` when the session is inside a worktree, then `jodysalt:add-worktree {slug}`, then `jodysalt:enter-worktree {slug}`.
  - **Tasks.** If `docs/tickets/open/{slug}/tasks.md` is missing, `jodysalt:add-tasks {slug}`, then `jodysalt:commit` with the subject `docs: added tasks for {slug}`, so `complete-tasks` starts on a clean tree. An existing `tasks.md` skips this.
  - **Loop.** `jodysalt:complete-tasks {slug}`; its first failed task stops the skill with its report.
  - **Report** the loop's summary and suggest `jodysalt:wrap-up-worktree`. Never wraps up or pushes.
- **Steering.** The workflow sentence becomes, in substance, "draft with `add-ticket`, then implement it with `complete-ticket`, which breaks it into tasks just before the loop": in `setup-skills`' `CLAUDE.md` block, this repo's `CLAUDE.md` and `README.md`'s Workflow paragraph. `add-ticket` and `refine-ticket` end by naming the next steps: `jodysalt:commit`, land the planning branch with `jodysalt:wrap-up-worktree`, then `/jodysalt:complete-ticket {slug}`.
- **`add-tasks` nudge.** When the current branch isn't `{slug}`, it still writes the tasks, and its report adds one line saying tasks are best written on the ticket's branch just before the loop, via `jodysalt:complete-ticket`. Nothing else in `add-tasks` changes, its description included.
- **`deliver-brief`** uses `complete-ticket`. The stages become the scout, `refine-vision`, `add-ticket`, `complete-ticket`, the judge and `close-ticket`; the `add-tasks` and `complete-tasks` stages go. Step 4's planning session drafts the ticket only. Step 5 is: `jodysalt:add-worktree <slug>` when missing and `jodysalt:enter-worktree <slug>` in the root, as today, so the root ends in the worktree for the judge and `wrap-up-worktree`; then one `complete-ticket` stage with the slug, which starts in the worktree, writes and commits the tasks when there are none, and runs the loop. Its first failed task ends the run as the `complete-tasks` stage's does today. A sub-ticket the judge drafts on a ticket branch goes straight to step 5 after `wrap-up-worktree`, with no planning session for its tasks; a pick from the parent judge still gets a planning session for its `add-ticket` stage, then step 5. On a resume, a ticket with no `tasks.md` or a pending entry continues at step 5.
- A `README.md` row for `complete-ticket`, and the rows of every skill whose description changes.
- `plugin.json` to `0.10.0`.

Out:
- Blocking `add-tasks` anywhere; it stays usable on any branch.
- Changing `add-tasks`' description, its entry shape, or anything but the nudge.
- A pause to review the backlog before the loop; a person who wants one runs `add-tasks` alone first.
- `complete-ticket` wrapping up, landing a planning branch, or pushing.
- `deliver-brief`'s root invoking `complete-ticket` itself; it stays a stage so the root holds no skill body or worker report.
- Migrating the first user's repo; its `CLAUDE.md` block is updated by hand.
- Eval suites.

# Acceptance criteria
- In a throwaway repo with a ticket landed on `main` and no worktree, `/jodysalt:complete-ticket {slug}` from the main checkout creates and enters `.claude/worktrees/{slug}`, writes and commits `tasks.md` as `docs: added tasks for {slug}`, runs the loop to the end with no question, reports the summary and suggests `wrap-up-worktree`.
- Run from inside a planning worktree, it exits that worktree first and ends in the ticket's worktree; with the ticket's worktree already present, it enters it without `add-worktree`.
- With `tasks.md` already present, it writes no tasks and runs the loop on the pending entries.
- For a ticket that exists only on an unlanded planning branch, it stops before changing anything and points at `wrap-up-worktree`. For a closed ticket it stops.
- A failed task stops it with the loop's report, the worktree left in place.
- `/jodysalt:add-tasks {slug}` on a planning branch writes the tasks and its report carries the nudge; on branch `{slug}` the report has no nudge.
- `/jodysalt:add-ticket` and `/jodysalt:refine-ticket` end by naming `commit`, `wrap-up-worktree` and `/jodysalt:complete-ticket {slug}`, and never suggest `add-tasks`.
- In a throwaway repo, `/jodysalt:setup-skills` writes a `CLAUDE.md` block naming `complete-ticket`; this repo's `CLAUDE.md` and `README.md` say the same.
- In a throwaway repo with the plugin installed, `/jodysalt:deliver-brief <brief>` runs no `add-tasks` or `complete-tasks` stage, only a `complete-ticket` stage per ticket; it ends with each ticket's `tasks.md` first committed on its ticket branch, no planning commit touching a `tasks.md`, and the run otherwise as today. Interrupted after a ticket's planning session and run again with no brief, it resumes at step 5.
- `README.md` rows match every changed description, `plugin.json` is `0.10.0`, and `claude plugin validate .` and `claude plugin validate skills --strict` pass.
- Nothing is pushed.

# Implementation notes
- `skills/complete-ticket/SKILL.md`: house style from `add-skill`; a frontmatter description with triggers ("complete the ticket", "implement X", "start work on X", `/complete-ticket`) and its nevers (never pushes, wraps up or lands a planning branch). It only orchestrates other skills, like `start-planning-session`; `complete-tasks` already spawns the workers, so it spawns none itself.
- `add-tasks`: one line in step 6's report, conditioned on `git branch --show-current` not being `{slug}`.
- `add-ticket` and `refine-ticket`: the closing step names the next steps. `grill-me`'s close suggests `jodysalt:commit`, so the extra steps go in the calling skill, not `grill-me`.
- `setup-skills` step 4 and `CLAUDE.md` line 3 take the same sentence; `README.md` line 7 follows.
- `deliver-brief`: the `## Stages and the root` list, step 3's resume bullet, step 4's `add-tasks` bullet (removed), step 5's `complete-tasks` stage (becomes the `complete-ticket` stage; the cap count and the checks collected for the person read its report), and step 5's pick paragraph ("Then step 4 from `add-tasks` on") change. The root still runs `add-worktree` and `enter-worktree` before the stage; `complete-ticket` finding itself already in the worktree is what makes it safe as a stage.
- Descriptions are frontmatter, so `--strict` checks them; keep each skill's trigger phrases and "never" clauses.

# Test plan
- `claude plugin validate .` and `claude plugin validate skills --strict`.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this ticket's worktree: `git init`, `setup-skills`, a vision, a ticket drafted and landed, then every `complete-ticket`, `add-tasks` and `add-ticket` case above, and one `deliver-brief` run with an interruption and resume.
- Manual, this repo: `grep -n complete-ticket CLAUDE.md README.md skills/setup-skills/SKILL.md`.

# Rollout
- Bump `plugin.json` to `0.10.0`; merging to `main` is the release. Not breaking: `add-tasks` and `complete-tasks` behave as before, and a ticket whose tasks were written in planning runs through `complete-ticket` unchanged. Fallback is reverting the commit.
- The first user's repo gets the new `CLAUDE.md` sentence by hand.

## Strategic fit
Stands on *Unattended work needs structure*: a loop only works if each task stands alone, and a task written days before it runs can be stale when it does. It also serves *Agents drift without a spec*, since the backlog matches the code it runs against. It follows *One thing, then stop* by orchestrating existing skills rather than growing one, *Driver-agnostic* by asking nothing between the tasks and the loop, and *Trim with the 80/20 principle* by steering rather than blocking. It respects the *Several plugins* non-goal; nothing leaves the one plugin.
