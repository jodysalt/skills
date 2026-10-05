---
name: complete-tasks
description: Runs the Ralph loop – repeatedly spawns a fresh sub-agent that invokes `complete-task` until a ticket's `docs/tickets/open/{slug}/tasks.md` has no `- **status:** pending` entry left. Use on `/complete-tasks`, "run the Ralph loop", "complete all the tasks", "work through the backlog for X". Pure orchestrator: never implements or commits itself, runs one worker at a time, stops on the first failed task, never pushes.
argument-hint: "[ticket slug or path – defaults to the current branch's ticket or the only open ticket]"
---

# Complete tasks (Ralph loop)

Delegate each pending entry in one ticket's `tasks.md` to a fresh worker until none remain. You do not implement tasks yourself.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Confirm the pick. Stop if the branch or the argument names a closed ticket. Resolve once, here; every worker receives the resolved path and never resolves for itself. If `docs/tickets/open/{slug}/tasks.md` doesn't exist, print "No `tasks.md` for {slug}; run `jodysalt:add-tasks`." and stop.

## Loop

1. **Find** the first entry in `docs/tickets/open/{slug}/tasks.md` whose status line is `- **status:** pending` and note its heading. If there is none, print the summary and stop.
2. **Spawn one worker** with the Agent tool (`general-purpose`, run synchronously so the loop blocks until it finishes) with this prompt, `{slug}` filled in:

   > Invoke the `jodysalt:complete-task` skill with the argument `docs/tickets/open/{slug}` and follow it to completion. If the Skill tool is unavailable, read `${CLAUDE_PLUGIN_ROOT}/skills/complete-task/SKILL.md` and follow it directly, treating that path as its `$ARGUMENTS`. Your final message must state the task heading you worked on, what changed, whether every step was satisfied, and any judgment calls you made on ambiguous steps, and which later task headings you left notes on.

   Never run workers in parallel; entries are dependency-ordered.
3. **Check:** re-read the same `tasks.md` and run `git status --short`. Success is the noted entry now `done` **and** a clean tree. Anything else means the worker failed (a failed commit, or a worker that died mid-task): report its summary and the tree state, then stop the loop.
4. Repeat from step 1. There is no iteration cap.

## Summary

How many tasks completed and their headings, plus every judgment call the workers reported, for the user's return-and-inspect pass. On failure, the failed heading and the worker's report.

## Rules

- Never edit the ticket's `tasks.md`, implement, or commit; workers own all file changes.
- Never retry a failed task, run workers in parallel, or push.
