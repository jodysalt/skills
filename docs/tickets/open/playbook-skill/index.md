---
title: Playbook Skill
type: refactor
---

# Goal
Cut the plugin's context cost: a user who installs `jodysalt` carries one `playbook` description in context instead of 42 skill descriptions, while every `/jodysalt:{name}` command they type keeps working.

# Context
- The plugin is `jodysalt` (`.claude-plugin/plugin.json`, version 0.39.0). Its 42 skills each live at `skills/{name}/SKILL.md` with `name`, `description` and, for most, `argument-hint` frontmatter; every description is loaded into context so the model can pick the skill from plain speech.
- Three skills carry files beside `SKILL.md`: `skills/add-course/templates/`, `skills/add-design/templates/` and `skills/add-landing-page/templates/`, resolved from the skill's base directory; `skills/refine-course/SKILL.md` names `templates/lesson.html` too.
- Skills invoke each other by name through the Skill tool (`jodysalt:refine-ticket`, `jodysalt:start-planning-session`, …). `skills/complete-tasks/SKILL.md` and `skills/deliver-brief/SKILL.md` spawn sub-agents told to invoke `jodysalt:{skill}`, falling back to `${CLAUDE_PLUGIN_ROOT}/skills/{skill}/SKILL.md`.
- `skills/add-skill/SKILL.md` and `skills/refine-skill/SKILL.md` write and refine `skills/{name}/SKILL.md` in a plugin repo, and `refine-skill` syncs the skill's `README.md` row and runs `claude plugin validate {dir} --strict`.
- `README.md` holds one table row per skill linking `skills/{name}/SKILL.md`; `CLAUDE.md`'s `## Workflow`, `docs/glossary.md` and the `setup-skills` templates name skills throughout.
- A helper with `disable-model-invocation: true` cannot be called by the model, so a play can never reach another through its helper.
- The unit is a play, defined in `docs/glossary.md`; a task stays one entry in a ticket's `tasks.md`.
- `docs/vision.md` is out of step with this change in two lines: *Claude Code first* ("Skills call each other by namespaced name") and the *Several plugins* non-goal ("Installing all of them costs a user only their descriptions in context"). `/jodysalt:refine-vision` rewords them on the planning branch this ticket is drafted on, before it lands, so both reach `main` together.

# Scope
In:
- One skill, `playbook`, a namespace holding every play at `skills/playbook/plays/{name}/index.md`, each play in its own directory, its `index.md` describing the play to run and the arguments it takes.
- The `playbook` description is a short play index: each public play's name with a few trigger words, so plain speech ("commit this") still starts the play.
- One play calls another with the Skill tool as `jodysalt:playbook {play} {args}`, `_`-prefixed plays included, in a session and in a spawned sub-agent alike; every cross-reference in the existing bodies is rewritten to that form.
- All 42 existing skills become public plays, each keeping a helper skill with `disable-model-invocation: true` that delegates `/jodysalt:{name} $ARGUMENTS` to `/jodysalt:playbook {name} $ARGUMENTS`.
- The `_` prefix as a convention `playbook` supports: a play named `_{name}` has no helper and is only called from other plays.
- The three `templates/` folders move with their play.
- `add-skill` and `refine-skill` write and refine a play plus its helper in a plugin repo that holds `skills/playbook/`, keeping the `playbook` description's play index in step; elsewhere they write `.claude/skills/{name}/SKILL.md` as today. Their names stay.
- `README.md`, `CLAUDE.md`, `docs/glossary.md` and the `setup-skills` templates brought in step.

Out:
- Turning any existing skill into a `_` play, or extracting shared steps such as the branch gate into new `_` plays; a later ticket does that.
- Any change to what a play does: its steps and rules move unchanged.
- Editing `docs/vision.md`, which is `refine-vision`'s.

# Acceptance criteria
- `skills/playbook/SKILL.md` exists; given `{play} {args}` it reads `plays/{play}/index.md` from its base directory and follows it with `{args}`, and given an unknown or empty play name it lists the public plays and stops.
- `skills/playbook/plays/` holds one directory per former skill, 42 in all, each with an `index.md` and no frontmatter, its body the former skill's with `$ARGUMENTS` replaced by prose naming the arguments passed to the play.
- Each of the 42 `skills/{name}/SKILL.md` files is a helper: frontmatter of `name`, a one-sentence `description`, the `argument-hint` it had, and `disable-model-invocation: true`; a one-line body invoking `jodysalt:playbook {name} $ARGUMENTS`.
- The `playbook` description names every public play with trigger words and no `_` play.
- No play references another through `jodysalt:{name}` other than `jodysalt:playbook`; the sub-agent prompts in the `complete-tasks` and `deliver-brief` plays invoke `jodysalt:playbook {play} {args}` and fall back to `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/{play}/index.md`.
- `plays/add-course/templates/`, `plays/add-design/templates/` and `plays/add-landing-page/templates/` hold the files the skills held, and each play that names a template resolves it relative to its play's directory.
- A play directory named `_{name}` with no helper is runnable as `jodysalt:playbook _{name}` from another play and absent from the play index and the unknown-name listing.
- `README.md` keeps one row per public play, linking `skills/playbook/plays/{name}/index.md` with its text unchanged, and its installation section says `/jodysalt:{name}` and `/jodysalt:playbook {name}` are equivalent.
- `.claude-plugin/plugin.json` is at version `0.40.0`.
- `claude plugin validate . --strict` passes.

# Implementation notes
- Move each body with `git mv skills/{name}/SKILL.md skills/playbook/plays/{name}/index.md` so history follows, then write the helper in its place.
- `$ARGUMENTS` substitutes only in `SKILL.md`: the router passes the rest of its arguments on in prose, and each play's argument section reads "the arguments passed to the play".
- `CLAUDE.md`, the glossary and the `setup-skills` templates keep "skill" where they mean a command a user types (`add-ticket`) and are reworded only where they describe one unit calling another; the glossary's *pair*, *partner* and *driver* entries get a light pass.
- Slices on the ticket branch can move plays in groups; the ticket lands on `main` once with all 42 moved, so `main` never holds a half-migrated plugin.
- The session implementing this loads the plugin from the main checkout, so the skills it runs stay whole until the landing.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so:
- `claude plugin validate . --strict` passes.
- `grep -rnE 'jodysalt:[a-z-]+' skills/playbook/plays` shows no name but `jodysalt:playbook`.
- Manual, from the ticket's worktree with the plugin loaded from it: `/jodysalt:commit` makes a commit; plain-speech "commit this" starts the `commit` play; `/jodysalt:add-ticket` runs through its hand-off into the `refine-ticket` play; `/jodysalt:playbook nope` lists the plays.

# Rollout
No flag. One landing on `main`, with `0.40.0`; users on auto-update get it on the next update with nothing to do. Fallback is reverting the landing commit.
