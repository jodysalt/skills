---
name: complete-task
description: Implements exactly one task – the first `- **status:** pending` entry in a ticket's `docs/tickets/open/{slug}/tasks.md` – satisfies its steps, flips it to `done`, and makes one commit via the `commit` skill. Use on `/complete-task`, "complete the next task", "do the next task for X", or as the worker spawned by `complete-tasks`. Runs unattended: decides minor ambiguities itself and stops on contradictions. Leaves handover notes on the later tasks that need what it learned, never changes a second task's status or steps, never pushes.
argument-hint: "[ticket slug or path – defaults to the current branch's ticket or the only open ticket]"
---

# Complete task

You may be running in a fresh context with no prior conversation. Rely on the ticket's `tasks.md`, its sibling `index.md`, and the repo's `CLAUDE.md`. This skill never waits for user input.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else stop and list the open tickets. Stop if the branch or the argument names a closed ticket. If `docs/tickets/open/{slug}/tasks.md` doesn't exist, print "No `tasks.md` for {slug}; run `jodysalt:add-tasks`." and stop.

## Steps

1. **Find** the first entry in `docs/tickets/open/{slug}/tasks.md` whose status line is `- **status:** pending`. Entries are an H2 heading plus a bullet list; note the exact heading. If there is none, print "No pending tasks." and stop without changing anything.
2. **Read** the entry's `steps` (your acceptance criteria), `category` and `notes` – facts earlier workers left for this task, context with the same standing as `index.md` while `steps` stay the acceptance criteria, so a note that conflicts with a step is a contradiction for step 3 and the step wins – then the sibling `index.md`, the initiative it names under `initiative:` if any, and `CLAUDE.md` for the repo's coding norms.
3. **Plan** in 2–5 bullets before touching a file. You will not wait for user input, which overrides any repo guidance to ask when uncertain:
   - Minor ambiguity (naming, placement, equivalent approaches): pick the most reasonable reading, proceed, and record the judgment call for your report.
   - Contradiction or impossibility (steps conflict, a referenced file doesn't exist, a criterion can't be met as written): stop without modifying any file and report the blocker. That's a bug in the ticket's backlog entry, not a failure of this skill.
4. **Implement** the minimum change that satisfies every step, including the entry's own verification steps. Surgical edits only; nothing speculative.
5. **Hand over:** scan every entry below this one whose status line is `- **status:** pending` and, on each one that needs a fact this worker had to discover, append that fact as a sub-bullet under its `- **notes:**` bullet – one fact per sub-bullet, appended to an existing bullet rather than a second one, the bullet created last in the entry after `steps` when it is missing, and never removing or rewriting another worker's sub-bullet. What counts: where a thing lives (a path, a symbol, a test directory that isn't where you'd look), a command that works and its quirks, a judgment call that now constrains the later task, a setup or environment gotcha. Never what the heading, the steps, `index.md` or `CLAUDE.md` already say, and never a narrative of what this worker did; the commit holds that. Trim with the 80/20 principle: a few sub-bullets, never longer than the entry's own steps. A note is a hint, never a backlog edit: the later entry's heading, `category`, `status` and `steps` stay as `add-tasks` wrote them, a later task is never marked done because this change already satisfies it, and a stale step is still that worker's contradiction to report. Done entries and this entry never gain notes; zero notes is a fine outcome, never reported as a gap.
6. **Mark done:** change that entry's status line to `- **status:** done` and touch nothing else in `tasks.md` beyond what step 5 wrote.
7. **Commit** exactly once via `jodysalt:commit`, staging only the files this task touched plus `docs/tickets/open/{slug}/tasks.md`, with any judgment calls in the body. If the commit fails for good, revert the status flip and the notes step 5 wrote, so `tasks.md` holds neither, and report the failure; never leave an entry `done` with the work uncommitted.
8. **Report:** the task heading, what changed, which steps were satisfied, any judgment calls made, and one line per later task heading annotated in step 5.

## Rules

- One task per invocation, always the first pending one in the ticket's file. Never skip ahead.
- Never continue past a failed acceptance criterion; report it instead.
- Never changes a later entry's heading, `category`, `status` or `steps`.
- A note is additive: never removes or rewrites another worker's.
- Never push.
