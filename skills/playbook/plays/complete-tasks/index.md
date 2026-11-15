# Complete tasks (Ralph loop)

Delegate each pending entry in one ticket's `tasks.md` to a fresh worker until none remain. You do not implement tasks yourself.

## Ticket

The arguments passed to the play.

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Confirm the pick. Stop if the branch or the argument names a closed ticket. Resolve once, here; every worker receives the resolved path and never resolves for itself. If `docs/tickets/open/{slug}/tasks.md` doesn't exist, print "No `tasks.md` for {slug}; run `jodysalt:playbook add-tasks`." and stop.

## Loop

1. **Find** the first entry in `docs/tickets/open/{slug}/tasks.md` whose status line is `- **status:** pending` and note its heading. If there is none, print the summary and stop.
2. **Spawn one worker** with the Agent tool (`general-purpose`) with this prompt, `{slug}` filled in, and wait for it to finish before going on; when the tool runs it in the background, that is its completion notification:

   > Invoke `jodysalt:playbook complete-task docs/tickets/open/{slug}` with the Skill tool and follow it to completion. If the Skill tool is unavailable, read `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/complete-task/index.md` and follow it directly, with `docs/tickets/open/{slug}` as the arguments passed to the play. Your final message must state the task heading you worked on, what changed, whether every step was satisfied, and any judgment calls you made on ambiguous steps, which later task headings you left notes on, and the headings of any entries you appended.

   When the Skill tool's "Base directory" line gave this session the `playbook` skill's base directory, write it in the prompt in place of the variable and the `/skills/playbook` after it, so the fallback path is one the worker can read. Never run workers in parallel; entries are dependency-ordered.
3. **Check:** re-read the same `tasks.md` and run `git status --short`. Success is the noted entry now `done` **and** a clean tree. Anything else means the worker failed (a failed commit, or a worker that died mid-task): report its summary and the tree state, then stop the loop.
4. Repeat from step 1. There is no iteration cap.

## Summary

How many tasks completed and their headings, plus every judgment call the workers reported and the headings of any entries a worker appended, for the user's return-and-inspect pass. On failure, the failed heading and the worker's report.

## Rules

- Never edit the ticket's `tasks.md`, implement, or commit; workers own all file changes.
- Never retry a failed task, run workers in parallel, or push.
