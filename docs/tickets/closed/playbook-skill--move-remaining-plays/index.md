---
title: Move Remaining Plays
type: refactor
---

# Goal
Move the other 41 skills into the `playbook` skill as plays, each behind a helper, in the shape `docs/tickets/closed/playbook-skill--router-and-commit-play/index.md` proved with `commit`, so the parent's criteria on 42 plays, 42 helpers, the play index and the templates are met and only the rewording slices remain.

# Context
- Second slice of `docs/tickets/closed/playbook-skill/index.md`. The first landed the router at `skills/playbook/SKILL.md`, the play `skills/playbook/plays/commit/index.md` and the helper `skills/commit/SKILL.md`; those three files are the shape to repeat. The parent has no spike findings and no designs.
- `skills/` holds 43 directories: `playbook`, the `commit` helper, and 41 skills still whole. Each of the 41 opens with frontmatter, one blank line, then its `# ` title.
- `$ARGUMENTS`: 35 of the 41 hold one, alone on a line in their argument section. `complete-tasks` and `deliver-brief` hold two, the second inside a sub-agent prompt (`skills/complete-tasks/SKILL.md` line 22, `skills/deliver-brief/SKILL.md` line 36) beside `jodysalt:{skill}` and `${CLAUDE_PLUGIN_ROOT}/skills/{skill}/SKILL.md`. `exit-worktree`, `list-worktrees`, `setup-skills` and `show-worktree` hold none and have no `argument-hint`.
- Templates: `skills/add-course/templates/` (5 files), `skills/add-design/templates/` (2) and `skills/add-landing-page/templates/` (8). Each of the three skills says once, "The templates live in this skill's own folder, `templates/` under the base directory the Skill tool's "Base directory" line names" (`add-course` step 4, `add-design` step 4, `add-landing-page` step 3). `skills/refine-course/SKILL.md` line 41 names `../add-course/templates/lesson.html` "under this skill's base directory". No other skill names a template file; `setup-skills` holds its templates inline in its body.
- The router's step 2 already says "A path the play names beside itself resolves from `plays/{play}/`", and a play run through it sees the base directory of `skills/playbook/`, not its own.
- Every one of the 41 descriptions holds a "Use when …" or "Use on …" sentence of quoted phrases; `grill-me`'s is unquoted but for "grill me".
- Description length: Claude Code's skills documentation (https://code.claude.com/docs/en/skills) says the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing, and that a skill with `disable-model-invocation: true` has its description out of context. The router's `description:` line is 166 characters today and the 42 play names alone total 615, which leaves about a dozen characters of trigger words per play.
- A helper cannot be called by the model, so once a skill is moved, every `jodysalt:{name}` reference to it in another body is dead on this branch until the cross-reference slice. That is accepted, as it was for `commit`: the parent lands on `main` once, and the session implementing this loads the plugin from the main checkout, where the skills stay whole.
- *Play* is defined in `docs/glossary.md`. There is no `docs/testing-strategy.md`.

# Scope
In, for each of the 41 skills:
- Its body moved to the play `skills/playbook/plays/{name}/index.md`.
- A helper written at `skills/{name}/SKILL.md`.
- Its entry added to the play index in the `playbook` description.

Also in:
- The three `templates/` folders moved with their plays.
- The four plays that name a template (`add-course`, `add-design`, `add-landing-page`, `refine-course`) resolving it relative to the play's directory.
- The `commit` entry of the play index reshaped where the length limit needs it.

Out, each left to a later slice of the parent:
- Rewriting `jodysalt:{name}` cross-references in play bodies to `jodysalt:playbook {name}`, and the sub-agent prompts in the `complete-tasks` and `deliver-brief` plays, the second `$ARGUMENTS` and the `${CLAUDE_PLUGIN_ROOT}/skills/{skill}/SKILL.md` fallback in each included; likewise the path `skills/setup-skills/SKILL.md` the `deliver-brief` play names.
- `add-skill` and `refine-skill` learning to write and refine a play plus its helper.
- `README.md`, `CLAUDE.md`, `docs/glossary.md` and the `setup-skills` templates.
- The version bump in `.claude-plugin/plugin.json`.
- Any change to what a play does, or to the router's body: steps and rules move unchanged.
- Adding a `_` play.

# Acceptance criteria
- `skills/playbook/plays/` holds 42 directories, one per former skill and none starting with `_`, each with an `index.md` reached by `git mv` from `skills/{name}/SKILL.md`.
- Each `index.md` has no frontmatter and opens on its `# ` title.
- Each play's body is the former skill's with the `$ARGUMENTS` of its argument section replaced by "The arguments passed to the play." and nothing else changed, but for the template sentence in the four plays below. The only `$ARGUMENTS` left under `plays/` are the two inside the sub-agent prompts of `complete-tasks` and `deliver-brief`.
- Each of the 42 `skills/{name}/SKILL.md` files other than `playbook`'s is a helper: frontmatter of `name`, a one-sentence `description` that is the first sentence or clause of the one it had, the `argument-hint` it had when it had one, and `disable-model-invocation: true`; then the one-line body "Invoke `jodysalt:playbook {name} $ARGUMENTS` with the Skill tool."
- `skills/playbook/SKILL.md` carries no `disable-model-invocation`, and its body is unchanged.
- The `playbook` description names all 42 plays, each followed by its trigger words in brackets, drawn from the "Use when …" phrases of the description the skill had.
- The `description:` line of `skills/playbook/SKILL.md` is at most 1,536 characters.
- `skills/playbook/plays/add-course/templates/`, `plays/add-design/templates/` and `plays/add-landing-page/templates/` hold the 5, 2 and 8 files the skills held, byte for byte, and no `templates/` folder is left directly under `skills/{name}/`.
- The `add-course`, `add-design` and `add-landing-page` plays say their templates live in `templates/` in the play's own directory, beside its `index.md`, and the `refine-course` play names `../add-course/templates/lesson.html` relative to its play's directory; none of the four says "this skill's base directory" of a template.
- `git status` shows changes only under `skills/` and this ticket's directory.
- `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted.

# Implementation notes
- Per skill: `git mv skills/{name}/SKILL.md skills/playbook/plays/{name}/index.md` first, so history follows; strip the frontmatter and the blank line after it; replace the argument section's `$ARGUMENTS` line; write the helper at the old path; add the index entry. The "If empty, …" line after the argument line stays as it is.
- The four skills with no `$ARGUMENTS` move with only their frontmatter stripped. Their helpers have no `argument-hint` and the same one-line body as the rest.
- Helper description: the text of the old description up to its first ` – ` or its first sentence end, whichever comes first, closed with a full stop, as `commit`'s is. Quote the YAML value where the clause holds `: ` or opens on a backtick. Its length is not constrained by the listing, since a helper's description is not in context.
- Templates: `git mv skills/add-course/templates skills/playbook/plays/add-course/templates`, likewise `add-design` and `add-landing-page`, after the play's directory exists. Reword only the sentence that locates the folder; the `cp` paths under it stay. The location must hold both when the play runs through the router, where the base directory is `skills/playbook/`, and when a sub-agent reads the `index.md` directly.
- Play index: one entry per play in alphabetical order, the name then its trigger words in brackets, `commit`'s entry in its place. To fit 1,536 characters an entry carries one short trigger, about a dozen characters on average, the phrase least like the play's own name (`complete-tasks (Ralph loop)`, `show-worktree (where am I)`); the quote marks around a trigger may go, and `commit`'s entry drops to one trigger in the same form. The lead sentence may be shortened before any play loses its trigger.
- The backlog may move the plays in groups, one task each, the play index growing with each group: the ten worktree plays (`add-`, `enter-`, `exit-`, `list-`, `merge-`, `rebase-`, `remove-`, `show-` and `wrap-up-worktree`, plus `remove-worktrees`); the nine ticket and task plays (`add-ticket`, `refine-ticket`, `close-ticket`, `add-tasks`, `complete-task`, `complete-tasks`, `complete-ticket`, `complete-ticket-slice`, `deliver-brief`); the six with templates or beside them (`add-course`, `refine-course`, `add-design`, `refine-design`, `add-landing-page`, `refine-landing-page`); and the sixteen left.
- Run each git command as its own call; the move is `git mv`, never a copy and delete.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so:
- `claude plugin validate .` exits 0 with only the two known warnings.
- `ls -d skills/playbook/plays/*/ | wc -l` is 42, and `head -1` of every `skills/playbook/plays/*/index.md` starts with `# `.
- `grep -c '\$ARGUMENTS' skills/playbook/plays/*/index.md` is 1 for `complete-tasks` and `deliver-brief` and 0 for the rest.
- `grep -L 'disable-model-invocation: true' skills/*/SKILL.md` prints `skills/playbook/SKILL.md` alone, and `grep -L 'jodysalt:playbook' skills/*/SKILL.md` prints nothing.
- `grep -m1 '^description:' skills/playbook/SKILL.md | wc -m` is at most 1,536, and that line holds `{name} (` for each of the 42 directory names under `plays/`.
- `find skills -maxdepth 2 -name templates` prints nothing, and `find skills/playbook/plays -path '*/templates/*' -type f | wc -l` is 15.
- `git diff -M` against the slice's fork point shows 41 renames of `SKILL.md` to `index.md` and 15 template renames at 100%; each play's diff holds only the frontmatter removal, the argument line and, in the four template plays, the sentence locating the template.
- The manual checks stay with the parent's test plan, run from its worktree with the plugin loaded from it; this slice's checks are static.

# Rollout
No flag. The slice lands on the `playbook-skill` branch only; nothing reaches `main` until the parent lands with the cross-references rewritten and the version bumped. Fallback is reverting the slice's commit on that branch.
