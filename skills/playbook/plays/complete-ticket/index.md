# Complete ticket

Get one open ticket from the base branch to a finished branch: into its worktree, then through the ticket one thin slice at a time with `complete-ticket-slice`, each slice a `{slug}--{sub}` sub-ticket whose backlog is written just before the loop that runs it, so nothing landing in between can make it stale. It only orchestrates other skills and stops once the slices do; landing the branch is `jodysalt:playbook wrap-up-worktree`. A run that stops resumes with the same command.

## Ticket

The arguments passed to the play.

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Stop if the branch or the argument names a closed ticket.

## Steps

1. **Guard.** The main checkout is the first path in `git worktree list`. `<main checkout>/docs/tickets/open/{slug}/index.md` must exist; otherwise stop, change nothing, and say to land the planning branch that holds the ticket with `jodysalt:playbook wrap-up-worktree` first.
2. **Worktree.** If `git rev-parse --show-toplevel` already equals `<main checkout>/.claude/worktrees/{slug}`, skip this step. Else if that path is registered in `git worktree list`, invoke `jodysalt:playbook enter-worktree {slug}`. Else invoke `jodysalt:playbook exit-worktree` when the session is inside another worktree, then `jodysalt:playbook add-worktree {slug}` (declining its offer to enter), then `jodysalt:playbook enter-worktree {slug}`.
3. **Existing backlog.** A compatibility step for a ticket whose `tasks.md` predates slicing; a parent `tasks.md` is never written here. When `docs/tickets/open/{slug}/tasks.md` exists with a `- **status:** pending` entry, invoke `jodysalt:playbook complete-tasks {slug}`; on its first failed task, stop with its report and leave the worktree in place. Otherwise skip this step.
4. **Slices.** Invoke `jodysalt:playbook complete-ticket-slice {slug}`, stating in the same turn the framing "the slice's draft is unattended: no person answers the slice drafter's questions, and one the ticket leaves open takes the drafter's recommendation", on every invocation, the repeats included. Read the last line of its report:
   - `done`: every criterion is met; go to step 5.
   - A line starting with a `{slug}--{sub}` slice slug: one slice landed on the branch; invoke `complete-ticket-slice` again. There is no slice cap, as `complete-tasks` has no task cap.
   - Anything else is a failure: stop with that report and leave the worktree in place; the next run resumes it.
5. **Report.** The slices landed this run, the last `complete-ticket-slice` judgement per criterion, met or unmet, every recommendation a slice's draft took because the ticket was silent, with its slice, for a person to overrule, whether step 3 ran a pre-existing backlog, every check left for a person, and a suggestion to run `jodysalt:playbook wrap-up-worktree` to land the branch.

## Rules

- Only orchestrates: never judges a criterion, drafts a slice, implements a task, edits a `tasks.md` itself, or spawns workers itself; `complete-ticket-slice` and `complete-tasks` do.
- Never asks a question between steps or inside one, a slice drafter's questions included, which step 4's framing has `complete-ticket-slice` answer itself; never wraps up, merges, lands a planning branch, or pushes.
