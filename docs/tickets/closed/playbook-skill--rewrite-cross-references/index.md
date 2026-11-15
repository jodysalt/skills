---
title: Rewrite Cross References
type: refactor
---

# Goal
Make the 42 moved plays work together again: every place one play names another reaches it through the `playbook` skill as `jodysalt:playbook {play} {args}`, so the parent's criterion on cross-references is met and its manual checks, such as `add-ticket` handing off into the `refine-ticket` play, can pass.

# Context
- Third slice of `docs/tickets/closed/playbook-skill/index.md`, after `docs/tickets/closed/playbook-skill--router-and-commit-play/index.md` and `docs/tickets/closed/playbook-skill--move-remaining-plays/index.md`. All 42 skills are plays at `skills/playbook/plays/{name}/index.md` behind helpers at `skills/{name}/SKILL.md`. The parent has no spike findings and no designs.
- A helper has `disable-model-invocation: true`, so the model cannot call it: every `jodysalt:{name}` reference in a play body is dead on this branch. It is the one remaining criterion that makes the plays work together.
- Counts, from `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays`: 243 references on 173 lines in 40 of the 42 plays. `commit` and `explain-simply` hold none, and no play names `jodysalt:playbook` yet. 39 of the 42 names are referenced, `commit` most (27), then `start-planning-session` (17), `setup-skills` and `enter-worktree` (15 each).
- One more reference has a shape that grep misses: `jodysalt:<skill>` in the stage prompt of `deliver-brief` (line 30).
- 17 of the 243 carry a leading slash, on 12 lines in 10 plays, each a command the user is told to type or text written into a user's file: `merge-worktree` 21, `refine-ticket` 34 (three), `add-ticket` 102, `wrap-up-worktree` 23, `enter-worktree` 11, `setup-skills` 81 (three) and 100, `run-in-sandbox` 13, `rebase-worktree` 32, `complete-task` 20, `refine-sandbox` 15.
- The placeholder marker `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.` accounts for five of those: it is the first line of the `Dockerfile.sandbox` the `setup-skills` play writes (line 100, in its inline template), and `refine-sandbox`, `run-in-sandbox`, `rebase-worktree` and `complete-task` compare a file's first line against it to tell whether a repo has opted in to the sandbox, `run-in-sandbox` saying "exactly". Repos scaffolded before this change hold the old line.
- `setup-skills` line 81 holds three references inside the `## Workflow` section it writes into a user's `CLAUDE.md`. The parent leaves the `setup-skills` templates to a later slice, yet its grep admits no exception under `plays/`.
- Sub-agent prompts: `complete-tasks` line 16 and `deliver-brief` line 30 each tell a sub-agent to invoke `jodysalt:{skill}` and fall back to `${CLAUDE_PLUGIN_ROOT}/skills/{skill}/SKILL.md`, "treating … as its `$ARGUMENTS`". These are the only two `$ARGUMENTS` left under `plays/`. `add-skill` line 16 holds the bare word `ARGUMENTS` with no dollar sign, describing the placeholder it writes.
- `${CLAUDE_PLUGIN_ROOT}`, like `$ARGUMENTS`, is filled in by Claude Code when it loads a `SKILL.md`. A play is read as a plain file, so the variable reaches the sub-agent as written.
- `deliver-brief` line 50 names `skills/setup-skills/SKILL.md` as the file its vision check is kept in step with; that text now lives in the play. Every other `SKILL.md` under `plays/` outside the two prompts is in `add-skill` or `refine-skill`, naming the file those plays write or refine.
- Several plays invoke another as "the `{name}` skill from this plugin (`jodysalt:{name}`)" with "the Skill tool call, never a sub-agent" (`add-ticket` 101, `add-market-test` 15 and 16, `refine-market-test` 15, `add-design` 17, `add-course` 18).
- The router, `skills/playbook/SKILL.md`, takes the first word of its arguments as the play and passes the rest on as "the arguments passed to the play".
- *Play* is defined in `docs/glossary.md`. There is no `docs/testing-strategy.md`, and `docs/coding-standards.md` holds no standard.

# Scope
In, under `skills/playbook/plays/` only:
- Every `jodysalt:{name}` reference rewritten to `jodysalt:playbook {name}`, whatever follows it and wherever it sits: prose, steps, rules, quoted prompts.
- Every `/jodysalt:{name}` rewritten to `/jodysalt:playbook {name}`, a command the user is told to type included. The parent's criterion and its grep allow no other name, and the router's own listing already prints that form.
- The references inside the two `setup-skills` inline templates, the `## Workflow` section and the `Dockerfile.sandbox` placeholder, and nothing else in those templates.
- The placeholder marker in its new form in all five plays, the four that compare it still recognising the line a repo scaffolded earlier holds.
- The sub-agent prompts of `complete-tasks` and `deliver-brief`: the invocation, the fallback path and the `$ARGUMENTS` wording.
- The path `skills/setup-skills/SKILL.md` in `deliver-brief`.

Out, each left to a later slice of the parent:
- `add-skill` and `refine-skill` learning to write and refine a play plus its helper. Their cross-references are rewritten here; the `SKILL.md` paths they write and refine stay.
- `README.md`, `CLAUDE.md`, `docs/glossary.md`, and the rest of the `setup-skills` templates.
- The version bump in `.claude-plugin/plugin.json`.
- Rewording "skill" to "play" around a reference, and any reference to a play by its bare name (`commit`, "the `grill-me` skill").
- Any change to what a play does, the marker's recognition aside; the helpers and the router are untouched.

# Acceptance criteria
- `grep -rnE 'jodysalt:[a-z-]+' skills/playbook/plays` shows no name but `jodysalt:playbook`, and no `jodysalt:` under `plays/` is followed by anything else.
- Each of the 243 references reads `jodysalt:playbook {name}`, the name unchanged and a directory under `plays/`, with the arguments, punctuation and backticks it had: `jodysalt:start-planning-session <description>` becomes `jodysalt:playbook start-planning-session <description>`.
- The 17 slash references read `/jodysalt:playbook {name}` and keep their slash; no reference gains or loses one.
- The `complete-tasks` worker prompt invokes `jodysalt:playbook complete-task docs/tickets/open/{slug}` with the Skill tool and falls back to reading `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/complete-task/index.md`, with `docs/tickets/open/{slug}` as the arguments passed to the play.
- The `deliver-brief` stage prompt invokes `jodysalt:playbook <skill> <argument>` with the Skill tool and falls back to reading `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/<skill>/index.md`, with `<argument>` as the arguments passed to the play.
- Each of the two plays tells its spawner to write the `playbook` skill's base directory in place of `${CLAUDE_PLUGIN_ROOT}/skills/playbook` in the prompt when the Skill tool's "Base directory" line gave it one, so the fallback path is one the sub-agent can read.
- No `$ARGUMENTS` is left under `plays/`. The bare `ARGUMENTS` in `add-skill` stays.
- `deliver-brief` names `skills/playbook/plays/setup-skills/index.md` as the file its vision check is kept in step with, and no play names `skills/{name}/SKILL.md` of this plugin as where a play's text lives.
- The marker the `setup-skills` play writes is `# Placeholder: run /jodysalt:playbook refine-sandbox to tailor this file to the project.`; `refine-sandbox`, `run-in-sandbox`, `rebase-worktree` and `complete-task` quote that line and treat any first line starting `# Placeholder: run ` as the placeholder.
- Nothing else in a play changes: `git diff` shows only lines that held a reference, a sub-agent prompt, the marker or the `deliver-brief` path, and `git status` shows changes only under `skills/playbook/plays/` and this ticket's directory.
- `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted.

# Implementation notes
- The bulk is mechanical: in each `index.md`, `jodysalt:` followed by a play's name gains `playbook ` between the two. A slash before it stays, so one substitution covers both forms. Do it per play and read each diff, since a few references sit in sentences that need a second look: the two prompts, the marker, `deliver-brief` 30 and 50.
- Leave the words around a reference alone. "invoke the `refine-ticket` skill from this plugin (`jodysalt:refine-ticket`)" changes only inside the brackets, and "the Skill tool call, never a sub-agent" still holds, since `jodysalt:playbook` is a skill.
- Sub-agent prompts: keep each prompt's other sentences word for word. `deliver-brief` keeps its `<skill>` and `<argument>` placeholders, used throughout the play. "treating … as its `$ARGUMENTS`" becomes prose naming the arguments passed to the play.
- The fallback: write `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/{play}/index.md` in the prompt as the parent's criterion has it, and add one sentence beside the prompt for the spawner's fill-in. Nothing fills the variable in a play, and a path the sub-agent cannot resolve leaves it with no fallback.
- The marker: change the quoted line in the five plays together, in one task, and add the prefix rule to the four that compare. `run-in-sandbox`'s "exactly" goes with it. Without the prefix rule a `Dockerfile.sandbox` written by 0.39 would read as tailored and every project command would run in an untailored container.
- Backlog groups, by lines holding a reference: the ten worktree plays (34 lines), the nine ticket and task plays (49 lines, the two prompts and `deliver-brief` 50 among them), the six course, design and landing-page plays (27 lines), and the fifteen left (63 lines); the marker is a task of its own across both groups it touches.
- Run each git command as its own call.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so:
- `claude plugin validate .` exits 0 with only the two known warnings.
- `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays | grep -vc 'jodysalt:playbook$'` is 0, and `grep -rn 'jodysalt:' skills/playbook/plays | grep -v 'jodysalt:playbook '` prints nothing.
- `grep -rnoE 'jodysalt:playbook [a-z-]+' skills/playbook/plays | wc -l` is 243, and every second word is a directory under `skills/playbook/plays/`.
- `grep -rnoE '/jodysalt:playbook [a-z-]+' skills/playbook/plays | wc -l` is 17.
- `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing.
- `grep -rn 'CLAUDE_PLUGIN_ROOT' skills/playbook/plays` shows two lines, each holding `skills/playbook/plays/` and `index.md`.
- `grep -rnE 'skills/[a-z-]+/SKILL\.md' skills/playbook/plays` shows nothing outside `add-skill` and `refine-skill`.
- `grep -rn 'Placeholder: run' skills/playbook/plays` shows five plays, each with `/jodysalt:playbook refine-sandbox`.
- `git status --short` lists only `skills/playbook/plays/*/index.md` and this ticket's directory.
- The manual checks stay with the parent's test plan, run from its worktree with the plugin loaded from it; this slice's checks are static.

# Rollout
No flag. The slice lands on the `playbook-skill` branch only; nothing reaches `main` until the parent lands with the remaining slices and the version bump. Fallback is reverting the slice's commit on that branch.
