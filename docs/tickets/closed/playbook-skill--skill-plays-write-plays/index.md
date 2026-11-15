---
title: Skill Plays Write Plays
type: refactor
---

# Goal
Make the next skill added to a playbook repo, this one first, arrive in the new shape: the `add-skill` and `refine-skill` plays write and refine a play plus its helper and keep the `playbook` description's play index in step, so the parent's last behavioural scope item is met. Without it the next skill added here would be written as a whole `skills/{name}/SKILL.md`, the shape the parent retires.

# Context
- Fourth slice of `docs/tickets/closed/playbook-skill/index.md`, after `docs/tickets/closed/playbook-skill--router-and-commit-play/index.md`, `docs/tickets/closed/playbook-skill--move-remaining-plays/index.md` and `docs/tickets/closed/playbook-skill--rewrite-cross-references/index.md`. The router is `skills/playbook/SKILL.md`, all 42 plays sit at `skills/playbook/plays/{name}/index.md` behind helpers at `skills/{name}/SKILL.md`, and every cross-reference reads `jodysalt:playbook {name}`. The parent has no spike findings and no designs.
- The two plays are `skills/playbook/plays/add-skill/index.md` and `skills/playbook/plays/refine-skill/index.md`. Both still pick between two targets: `skills/{name}/SKILL.md` when the root holds `.claude-plugin/plugin.json`, else `.claude/skills/{name}/SKILL.md`. Neither knows a play, a helper or the play index.
- A helper has the shape of `skills/commit/SKILL.md`: frontmatter of `name`, a one-sentence `description`, the `argument-hint` and `disable-model-invocation: true`, and a one-line body invoking `jodysalt:playbook commit` followed by the arguments placeholder with the Skill tool.
- A play has no frontmatter, so the three-part description the `add-skill` template writes and the `refine-skill` findings check has nowhere to live in one. Its first part is the helper's `description`, its "Use when" phrases shrink to the one trigger in the play index, and what it never does stays in the play's rules.
- The play index is the list after `Plays – ` in the `description:` line of `skills/playbook/SKILL.md`: 42 entries, alphabetical, each `{name} ({trigger})` with one short trigger. `grep -m1 '^description:' skills/playbook/SKILL.md | wc -m` prints 1535 against the limit of 1,536 the `move-remaining-plays` slice set by that measure, so no new entry fits until room is made. That slice also ruled that the lead sentence may be shortened before any play loses its trigger.
- The router lists plays from the directories under `plays/`, leaving out each `_{name}`; a `_` play has no helper and no index entry. No `_` play exists yet.
- Validation: `claude plugin validate .` exits 0 with two warnings, the root `CLAUDE.md` and `ICON_MISSING`, and `claude plugin validate . --strict` exits 1 on them. Step 6 of the `refine-skill` play runs `claude plugin validate {dir} --strict` with `{dir}` set to `skills` in a plugin repo, and `claude plugin validate skills --strict` exits 0 with no warning here. So the command the play runs passes in this repo as written; only a strict run on the repo root fails. The user dropped `--strict` from this ticket's own checks and has not asked to change what `refine-skill` runs.
- README: `README.md` holds 42 rows linking `./skills/{name}/SKILL.md`. The parent's criterion has each row link `skills/playbook/plays/{name}/index.md` "with its text unchanged", and that rewrite is the last slice's. Step 7 of the `refine-skill` play rewrites a row's text to "the description's first sentence"; only 2 of the 42 rows equal their helper's `description` today, so that rule applied to helpers would rewrite the other 40 as their plays are refined.
- The only `ARGUMENTS` under `plays/` is the bare word in step 4 of the `add-skill` play, "a dollar sign followed by `ARGUMENTS`", which defines `{arguments placeholder}`; the `rewrite-cross-references` slice kept it on purpose. `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing.
- The helpers `skills/add-skill/SKILL.md` and `skills/refine-skill/SKILL.md` each carry a `description` naming `skills/{name}/SKILL.md` and `.claude/skills/{name}/SKILL.md` only.
- *Play*, *pair*, *partner* and *boilerplate* are defined in `docs/glossary.md`; "helper" and "play index" are used as the parent uses them. There is no `docs/testing-strategy.md`. `.claude-plugin/plugin.json` is at 0.39.0.

# Scope
In, in the `add-skill` and `refine-skill` plays and their two helpers:
- A third target, called a playbook repo below: the root holds `.claude-plugin/plugin.json` and `skills/playbook/`. The two existing targets behave as today: `skills/{name}/SKILL.md` in a plugin repo without `skills/playbook/`, `.claude/skills/{name}/SKILL.md` in any other repo. The plays' names stay.
- `add-skill` in a playbook repo writes three things: the boilerplate play at `skills/playbook/plays/{name}/index.md`, the helper at `skills/{name}/SKILL.md`, and the play's entry in the play index. A pair gets all three for each name.
- The `_` convention: a play named `_{name}` gets its `index.md` and nothing else, no helper and no index entry, and `refine-skill` refines one the same way, with no README row.
- Making room in the play index when an entry would take the line past the limit.
- `refine-skill` in a playbook repo refines the play's `index.md`, keeps the helper's `description` and `argument-hint` and the play's index entry in step with it, syncs the README row, validates the plugin and reports the version bump owed, as today.
- In a playbook repo the README row links `skills/playbook/plays/{name}/index.md`.
- The `description` of the two helpers, reworded to name the play target beside the two they name.

Out, each left to the last slice of the parent:
- `README.md`, `CLAUDE.md`, `docs/glossary.md`, the templates inline in the `setup-skills` play, and the version bump in `.claude-plugin/plugin.json`.
- Any other play, the router's body, and the 42 entries the play index holds today.

Out altogether:
- Changing the validation command `refine-skill` runs. It stays `claude plugin validate {dir} --strict`.
- Rewording "skill" to "play" where the two plays mean the command a user types, and any change to what they do in the two existing targets.

# Acceptance criteria
- Step 1 of each play names three targets in this order: a playbook repo, a plugin repo without `skills/playbook/`, any other repo. For the last two the play's steps read as they do today, path for path.
- In a playbook repo `add-skill` stops before writing anything when `skills/playbook/plays/{name}/` or `skills/{name}/` exists, for either name of a pair, and points at `jodysalt:playbook refine-skill`. The name `playbook` is refused by the same guard.
- In a playbook repo `add-skill` writes `skills/playbook/plays/{name}/index.md` from its template with no frontmatter, the argument section holding the line "The arguments passed to the play." where the skill template holds the arguments placeholder, and the title, lead, steps and rules prompts unchanged.
- It writes `skills/{name}/SKILL.md` as a helper: `name` equal to the directory, a one-sentence `description` prompt (what it does and where it writes), the `argument-hint`, dropped when the play takes no argument, `disable-model-invocation: true`, and the one-line body invoking `{plugin}:playbook {name}` followed by the arguments placeholder with the Skill tool, `{plugin}` being the manifest's `name`.
- It adds `{name} ({trigger})` to the play index in alphabetical position, the trigger one short phrase taken from the input, the one least like the play's own name; `refine-skill`'s interview may change it.
- A `_{name}` play is written as its `index.md` alone, and the play index and `skills/` are byte for byte unchanged.
- Both plays hold the room rule: when an entry would take `grep -m1 '^description:' skills/playbook/SKILL.md | wc -m` past 1,536, the lead sentence before `Plays – ` is shortened first, then other plays' triggers, longest first, until the line fits; no play's entry is ever dropped, the line never exceeds 1,536, and the report names every entry or sentence that was shortened.
- `add-skill`'s hand-off, report and rules name the play, the helper and the index entry in a playbook repo; its rule against editing an existing skill excepts the play index line and nothing else.
- In a playbook repo `refine-skill` resolves `{name}` to `skills/playbook/plays/{name}/index.md`, stops and points at `jodysalt:playbook add-skill` when it is missing, and reads the plays the play names and the plays naming it with `grep -l '{name}' skills/playbook/plays/*/index.md`. The name `playbook` resolves to `skills/playbook/SKILL.md`, refined as a skill is today.
- Its findings in a playbook repo check the helper in place of the three-part description: `name` equal to the directory, a one-sentence `description`, `disable-model-invocation: true`, the one-line body, an `argument-hint` that agrees with the play's argument section; and the index entry: present, in alphabetical position, one trigger. A `_` play with a helper or an index entry is a finding.
- Its interview framing names another play the way it is invoked in a playbook repo, `{plugin}:playbook {name}`, and edits the helper and the index entry in the same answer that changes what they mirror.
- Step 6 still reads `claude plugin validate {dir} --strict`, `{dir}` being `skills` in a playbook repo.
- In a playbook repo step 7 works on a table whose rows link `skills/playbook/plays/*/index.md`: it adds a missing row in alphabetical position, linking the play, with the helper's `description` as its text, and leaves the text of a row that exists alone. A `_` play gets no row. The finding about a row that is not the description's first sentence applies only outside a playbook repo.
- Each of `skills/add-skill/SKILL.md` and `skills/refine-skill/SKILL.md` keeps its shape and has a one-sentence `description` that names `skills/playbook/plays/{name}/index.md` too.
- `grep -rnE 'jodysalt:[a-z-]+' skills/playbook/plays` shows no name but `jodysalt:playbook`, and `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing.
- `git status` shows changes only in the two plays, the two helpers and this ticket's directory; the `description:` line of `skills/playbook/SKILL.md` is unchanged.
- `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted.

# Implementation notes
- Edit `skills/playbook/plays/add-skill/index.md` and `skills/playbook/plays/refine-skill/index.md` in place, adding the playbook repo beside the two targets rather than rewriting the steps: step 1 picks the target, and each later step says what differs in a playbook repo.
- Keeping the parent's greps: the helper template in `add-skill` writes its body with the `{arguments placeholder}` token step 4 already defines as a dollar sign followed by `ARGUMENTS`, never the literal, and names the namespace as `{plugin}:playbook {name}`, never `jodysalt:` followed by a play's name. The play's own cross-references stay `jodysalt:playbook refine-skill` and the like.
- Point at `skills/commit/SKILL.md` as the helper's shape in words, and still give the helper template inline, since the play runs in repos that hold no `commit` helper.
- The play template is the skill template minus its frontmatter, with the argument line swapped; say so rather than repeating the whole template if the play stays readable. The pair's two differences apply to both shapes.
- The room rule is one paragraph, written once in `add-skill` where the entry is added, and named from `refine-skill` where a trigger changes. Shortening another play's trigger in `refine-skill` is a removal and needs the user's yes like any other; in `add-skill` it is done and reported.
- `add-skill` still never edits `README.md`; the row is `refine-skill`'s, in the hand-off.
- This slice lands before the one that rewrites `README.md`, so between them, on the `playbook-skill` branch only, `refine-skill` finds no table linking plays in this repo and step 7 does nothing. Nothing reaches `main` in that state.
- The session implementing this loads the plugin from the main checkout, where `add-skill` and `refine-skill` are still whole skills that know nothing of plays: edit the two plays by hand, not through `refine-skill`.
- Run each git command as its own call.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so:
- `claude plugin validate .` exits 0 with only the two known warnings.
- `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays | grep -vc 'jodysalt:playbook$'` is 0.
- `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing.
- `grep -m1 '^description:' skills/playbook/SKILL.md | wc -m` still prints 1535, and `git diff --stat` does not list `skills/playbook/SKILL.md`.
- `grep -c 'skills/playbook' skills/playbook/plays/add-skill/index.md skills/playbook/plays/refine-skill/index.md` is above 0 for each, and each still names `.claude/skills/{name}/SKILL.md`.
- `grep -n 'validate' skills/playbook/plays/refine-skill/index.md` still shows `claude plugin validate {dir} --strict`.
- `grep -c 'disable-model-invocation: true' skills/add-skill/SKILL.md skills/refine-skill/SKILL.md` is 1 for each.
- `git status --short` lists only the two plays, the two helpers and this ticket's directory.
- Read-through, one pass per target: follow each play's steps for a playbook repo with a public name, a `_` name and a pair, then for a plugin repo without `skills/playbook/` and for a plain repo, and confirm each path, guard and report line matches the criteria above.
- The manual checks stay with the parent's test plan, run from its worktree with the plugin loaded from it.

# Rollout
No flag. The slice lands on the `playbook-skill` branch only; nothing reaches `main` until the parent lands with the last slice and the version bump. Fallback is reverting the slice's commit on that branch.
