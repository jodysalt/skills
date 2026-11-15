---
name: playbook
description: Runs one play, named in the arguments or picked from plain speech by its trigger words. Plays – add-competitor-analysis (who else sells), add-course (teach me X), add-design (mock up X), add-landing-page (make a landing page), add-market-test (market-test this idea), add-skill (write a skill), add-tasks (Ralph backlog), add-ticket (spec out Y), add-worktree (make a worktree), close-ticket (mark X done), commit (make a commit), complete-task (do the next task), complete-tasks (Ralph loop), complete-ticket (implement X), complete-ticket-slice (next slice), deliver-brief (build X from this brief), enter-worktree (go into the worktree), exit-worktree (back to the root), explain-simply (TL;DR), grill-me (stress-test), list-worktrees (what worktrees exist), merge-worktree (land the X branch), rebase-worktree (update the branch), refine-coding-standards (coding standards), refine-competitor-analysis (refresh the competitors), refine-course (add a lesson), refine-design (record the verdict), refine-landing-page (test result), refine-market-test (market test result), refine-sandbox (can't run X), refine-skill (tidy up), refine-testing-strategy (run in CI), refine-ticket (update the spec), refine-vision (revisit the vision), remove-worktree (delete the worktree), remove-worktrees (prune worktrees), run-in-sandbox (in a sandbox), setup-skills (set up the workflow), show-worktree (where am I), squash-commits (squash the branch), start-planning-session (planning branch), wrap-up-worktree (finish this branch).
argument-hint: "{play} [args]"
---

# Playbook

Routes to one play and follows it. Every play lives in its own directory under `plays/` in this skill's base directory, its `index.md` holding the steps to run and the arguments it takes.

## Play

$ARGUMENTS

The first word is the play's name, `{play}`; everything after it is `{args}`, the arguments passed to the play, which may be empty. When the skill was started from plain speech rather than a typed name, `{play}` is the play whose trigger words in the description match and `{args}` is what the user said beyond them.

## Steps

1. **Find the play.** Look for the directory `plays/{play}/` directly under this skill's base directory. When `{play}` is empty, or no directory of that name sits directly under `plays/`, go to step 3.
2. **Run it.** Read `plays/{play}/index.md` from this skill's base directory and follow it to the end, with `{args}` as the arguments passed to the play: wherever the play says "the arguments passed to the play", it means `{args}`. A path the play names beside itself resolves from `plays/{play}/`. Stop here.
3. **List the plays.** List the directories directly under `plays/`, leave out every one whose name starts with `_`, and print the rest one per line as `/jodysalt:playbook {name}`, saying first that `{play}` is not a play when one was named. Run nothing and stop.

## Rules

- One play per invocation, followed as written: its steps and rules are the play's own, and this skill adds none to them.
- A `_{name}` play is run when named, like any other: step 2 reads `plays/_{name}/index.md`. The `_` prefix only keeps it out of step 3's listing and out of the description's play index.
- The listing comes from the directories under `plays/`, never from a list kept in this file or from the description.
- Never guesses a play from a name that has no directory under `plays/`, and never runs a play to recover from an unknown name.
