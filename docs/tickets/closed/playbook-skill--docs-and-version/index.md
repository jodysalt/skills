---
title: Docs And Version
type: docs
---

# Goal
Finish the parent: the docs a user reads describe the plugin as it now is, one `playbook` skill holding 42 plays behind helpers, and the plugin carries the version it ships under. `README.md` links each play, says `/jodysalt:{name}` and `/jodysalt:playbook {name}` are equivalent, and `.claude-plugin/plugin.json` is at `0.40.0`; after this slice every acceptance criterion of `docs/tickets/closed/playbook-skill/index.md` holds.

# Context
- Fifth and last slice of `docs/tickets/closed/playbook-skill/index.md`, after `docs/tickets/closed/playbook-skill--router-and-commit-play/index.md`, `docs/tickets/closed/playbook-skill--move-remaining-plays/index.md`, `docs/tickets/closed/playbook-skill--rewrite-cross-references/index.md` and `docs/tickets/closed/playbook-skill--skill-plays-write-plays/index.md`. The parent has no spike findings and no designs. There is no `docs/testing-strategy.md`.
- The parent's criteria as they stand on the branch: `skills/playbook/plays/` holds 42 directories, none starting with `_`, each with an `index.md` that has no frontmatter and no `$ARGUMENTS`; `find skills -name SKILL.md` finds 43, the router `skills/playbook/SKILL.md` and 42 helpers carrying `disable-model-invocation: true`, each body the one line invoking `jodysalt:playbook {name} $ARGUMENTS`; the play index in the router's `description:` names all 42; no play names `jodysalt:{name}` other than `jodysalt:playbook`; the `complete-tasks` and `deliver-brief` plays fall back to `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/…/index.md`; `plays/add-course/templates/`, `plays/add-design/templates/` and `plays/add-landing-page/templates/` hold their files; `claude plugin validate .` exits 0 with two warnings, the root `CLAUDE.md` and `ICON_MISSING`, and `claude plugin validate skills --strict` exits 0. Unmet: the README rows, the README's equivalence sentence, and the version, still `0.39.0`.
- `README.md` holds 42 table rows, each linking `./skills/{name}/SKILL.md`. Its installation section reads "Skills are namespaced under the plugin name, so each one runs as `/jodysalt:<skill-name>`." Its `## Workflow` paragraph names skills bare (`add-ticket`, `complete-ticket`) and describes no layout. Its `## Local development` says `claude plugin validate skills --strict` checks "every skill's frontmatter", which still holds for the 43 `SKILL.md` files. The rows of `add-skill` and `refine-skill` name `skills/{name}/SKILL.md` in their text.
- `CLAUDE.md` is this repo's copy of the `## Workflow` template the `setup-skills` play holds in `skills/playbook/plays/setup-skills/index.md`. The two differ only in the command form: `/jodysalt:add-landing-page`, `/jodysalt:refine-landing-page`, `/jodysalt:add-ticket` and `/jodysalt:complete-ticket` in `CLAUDE.md`, `/jodysalt:playbook {name}` in the template, which the `rewrite-cross-references` slice rewrote. The play's `Dockerfile.sandbox` template says `/jodysalt:playbook refine-sandbox`. Its glossary template is the intro line of `docs/glossary.md`, which the `grill-me` play holds verbatim too.
- `docs/glossary.md`: *play* ends "not a skill, which after the refactor is `playbook` or a helper that delegates to it"; *boilerplate* says "for `add-skill`, a `SKILL.md` whose sections are prompts"; *stage* says a sub-agent `deliver-brief` spawns "to invoke one skill"; *pair*, *partner* and *driver* say "skill" throughout.
- Step 7 of `skills/playbook/plays/refine-skill/index.md` opens "In a plugin repo whose `README.md` holds a table with rows linking `skills/*/SKILL.md`, sync the skill's row outright" and, after "Outside a plugin repo, skip this step", adds "In a playbook repo the table is one whose rows link `skills/playbook/plays/*/index.md`". A playbook repo is a plugin repo, so the opening sentence reads as applying there too; a gate worker flagged it. Step 3 of the same play words its README clause as "in place of" and is clear.
- Outside `skills/` and `docs/tickets/`, `grep -rl 'SKILL\.md'` finds only `README.md` and `docs/glossary.md`. `docs/coding-standards.md`, `docs/initiatives/` and `.claude-plugin/marketplace.json` name no skill path, and the marketplace manifest carries no version, so none of them changes.
- *Play*, *pair*, *partner*, *driver*, *boilerplate* and *stage* are defined in `docs/glossary.md`; "helper", "play index" and "playbook repo" are used as the parent and the earlier slices use them.

# Scope
In:
- `README.md`: each of the 42 rows links `./skills/playbook/plays/{name}/index.md`, its text unchanged, the rows of `add-skill` and `refine-skill` included; the installation section says `/jodysalt:{name}` and `/jodysalt:playbook {name}` are equivalent. The `## Skills` heading, the `Skill` column, the `## Workflow` paragraph and `## Local development` stay: they name commands a user types and describe no layout that changed.
- `.claude-plugin/plugin.json` at version `0.40.0`.
- `CLAUDE.md`'s `## Workflow` shows its four commands as `/jodysalt:playbook {name}`, so it equals the `setup-skills` template word for word. The template keeps that form: `/jodysalt:{name}` there would fail the parent's grep, and `CLAUDE.md` is context the model reads, where a helper's `disable-model-invocation: true` leaves the long form the one both a person and the model can run. "Skill" stays in both.
- `docs/glossary.md`, a light pass on six entries: *play* loses "after the refactor"; *boilerplate* says what `add-skill` writes in a playbook repo, a play whose sections are prompts and its helper, beside the `SKILL.md` it writes elsewhere; *stage* has `deliver-brief` spawn a sub-agent to run one play; *pair*, *partner* and *driver* keep "skill" where they mean a command a user types and are reworded only where a sentence is untrue of plays. The intro line is unchanged, since the `setup-skills` and `grill-me` plays hold it verbatim.
- Step 7 of the `refine-skill` play, wording only: in a playbook repo only the table whose rows link `skills/playbook/plays/*/index.md` is meant, and the `skills/*/SKILL.md` sentence applies to a plugin repo that is not a playbook repo. What the step does in each repo is unchanged.

Out:
- `docs/vision.md`, which is `refine-vision`'s.
- Any change to what a play does beyond the one wording fix; step 3 of the `refine-skill` play; the `setup-skills` play, unless a template there turns out to differ from `CLAUDE.md` or the glossary's intro line.
- The helpers, the router and its play index.
- `docs/coding-standards.md`, `docs/initiatives/`, `.claude-plugin/marketplace.json`: nothing in them names a skill path.
- Landing on `main`, and the parent's manual checks, which stay with the parent.

# Acceptance criteria
- `README.md` holds 42 table rows, one per directory under `skills/playbook/plays/`, each linking `./skills/playbook/plays/{name}/index.md`; no link to a `SKILL.md` remains; each row's text is what it was.
- The installation section of `README.md` says `/jodysalt:{name}` and `/jodysalt:playbook {name}` are equivalent.
- `.claude-plugin/plugin.json` is at version `0.40.0`, with no other field changed.
- The body of `CLAUDE.md`'s `## Workflow` appears word for word in `skills/playbook/plays/setup-skills/index.md`, its commands in the `/jodysalt:playbook {name}` form.
- `docs/glossary.md` no longer says "after the refactor"; its *boilerplate* entry names the play and helper `add-skill` writes in a playbook repo; its *stage* entry has the sub-agent run one play; *pair*, *partner* and *driver* each read true of a plugin whose units are plays behind helpers; its intro line still appears word for word in the `setup-skills` and `grill-me` plays.
- Step 7 of the `refine-skill` play names one table per kind of repo: rows linking `skills/*/SKILL.md` in a plugin repo that is not a playbook repo, rows linking `skills/playbook/plays/*/index.md` in a playbook repo; its behaviour in each is unchanged.
- Every acceptance criterion of `docs/tickets/closed/playbook-skill/index.md` holds, by the checks in the test plan below.
- `git status` shows changes only in `README.md`, `CLAUDE.md`, `docs/glossary.md`, `.claude-plugin/plugin.json`, `skills/playbook/plays/refine-skill/index.md` and this ticket's directory.

# Implementation notes
- The README links are one substitution over the table: `./skills/{name}/SKILL.md` becomes `./skills/playbook/plays/{name}/index.md`. Touch nothing else in a row.
- The equivalence sentence goes beside the existing "Skills are namespaced under the plugin name" sentence, for example: "Each is a helper for a play in the `playbook` skill, so `/jodysalt:<skill-name>` and `/jodysalt:playbook <skill-name>` are equivalent." Keep the placeholder style the section already uses.
- `CLAUDE.md`: change the four commands only; then the line equals the template's.
- The glossary pass is light: change a sentence only where it is untrue of plays or describes one unit calling another. Keep entries alphabetical and each in the file's shape, a definition then an optional `Not:` sentence.
- The session implementing this loads the plugin from the main checkout, where `refine-skill` is still a whole skill that knows nothing of plays: edit the play by hand, not through `refine-skill`.
- `docs/vision.md` is reworded by `refine-vision` on the planning branch, as the parent's context says; nothing here waits on it.
- Run each git command as its own call.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so static checks, run from the repo root. This slice's own:
- `grep -c '](./skills/playbook/plays/[a-z-]*/index.md)' README.md` is 42 and `grep -c 'SKILL.md)' README.md` is 0.
- `for n in $(ls skills/playbook/plays); do grep -q "(./skills/playbook/plays/$n/index.md)" README.md || echo $n; done` prints nothing.
- `git show HEAD:README.md | sed -E 's#\./skills/([a-z-]+)/SKILL\.md#./skills/playbook/plays/\1/index.md#' | diff - README.md` shows only the installation section's change.
- `grep -n 'jodysalt:playbook' README.md` shows the equivalence sentence in the installation section.
- `grep '"version"' .claude-plugin/plugin.json` shows `0.40.0`, and `git diff .claude-plugin/plugin.json` changes that line alone.
- `grep -cF "$(sed -n 3p CLAUDE.md)" skills/playbook/plays/setup-skills/index.md` is 1, and `grep -c 'jodysalt:playbook' CLAUDE.md` is 1.
- `grep -c 'after the refactor' docs/glossary.md` is 0; `grep -cF "$(sed -n 3p docs/glossary.md)" skills/playbook/plays/setup-skills/index.md skills/playbook/plays/grill-me/index.md` is 1 for each; a read of *boilerplate*, *driver*, *pair*, *partner*, *play* and *stage* against the criterion.
- A read of step 7 of `skills/playbook/plays/refine-skill/index.md` for a playbook repo, a plugin repo without `skills/playbook/` and a plain repo: one table meant in each, the behaviour as before.
- `git status --short` lists only the files the criteria name.

The parent's criteria, all of which must hold:
- `ls -d skills/playbook/plays/*/ | wc -l` and `ls skills/playbook/plays/*/index.md | wc -l` are both 42.
- `for f in skills/playbook/plays/*/index.md; do head -n1 "$f"; done | grep -c '^---'` is 0, and `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing.
- `find skills -name SKILL.md | wc -l` is 43 and `grep -l 'disable-model-invocation: true' skills/*/SKILL.md | wc -l` is 42.
- ``for n in $(ls skills/playbook/plays); do grep -q "^Invoke \`jodysalt:playbook $n \\\$ARGUMENTS\` with the Skill tool" skills/$n/SKILL.md || echo $n; done`` prints nothing.
- `for n in $(ls skills/playbook/plays); do grep -m1 '^description:' skills/playbook/SKILL.md | grep -q "[ ,]$n (" || echo $n; done` prints nothing, and `ls skills/playbook/plays | grep -c '^_'` is 0, so the play index names every public play and no `_` play.
- `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays | grep -vc 'jodysalt:playbook$'` is 0.
- `grep -rn 'CLAUDE_PLUGIN_ROOT' skills/playbook/plays` shows the `complete-tasks` and `deliver-brief` plays falling back to `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/…/index.md`.
- `ls skills/playbook/plays/add-course/templates skills/playbook/plays/add-design/templates skills/playbook/plays/add-landing-page/templates` lists 5, 2 and 8 files, and `ls -d skills/*/templates` finds none outside `skills/playbook/`.
- A read of `skills/playbook/SKILL.md`: it reads `plays/{play}/index.md` and follows it with `{args}`, lists the public plays on an unknown or empty name, and runs a `_{name}` play when named while leaving it out of the listing.
- `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted. `claude plugin validate skills --strict` exits 0.
- The manual checks stay with the parent's test plan, run from its worktree with the plugin loaded from it.

# Rollout
No flag. The slice lands on the `playbook-skill` branch; the parent then lands on `main` once, with `0.40.0`. A repo that already ran `setup-skills` keeps the `/jodysalt:{name}` commands in its `CLAUDE.md`, which still work through the helpers. Fallback is reverting the slice's commit on that branch.
