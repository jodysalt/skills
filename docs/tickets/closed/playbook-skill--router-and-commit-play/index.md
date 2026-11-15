---
title: Router And Commit Play
type: refactor
---

# Goal
Prove the play and helper shape of `docs/tickets/closed/playbook-skill/index.md` with one play through every layer: the `playbook` skill routes to a play, `commit` runs as that play, and `/jodysalt:commit` still works through its helper, so the other 41 skills can move in later slices against a shape that already holds.

# Context
- First slice of `playbook-skill`. Every acceptance criterion of the parent is unmet and all of them depend on the router and the play/helper shape. The parent has no other sub-ticket, open or closed, no spike findings and no designs.
- `skills/playbook/` does not exist yet; `skills/` holds 42 skill directories.
- `skills/commit/SKILL.md` has frontmatter `name: commit`, a long `description`, and `argument-hint: "[what to commit, e.g. 'the webhook fix' – defaults to all changes]"`. Its `## Scope` section holds the body's one `$ARGUMENTS`, and its body names no other skill.
- `$ARGUMENTS` substitutes only in a `SKILL.md`, so the router passes the rest of its arguments on in prose.
- A helper with `disable-model-invocation: true` cannot be called by the model. Twenty other skills' bodies still name the `commit` skill (`complete-task`, `squash-commits`, `wrap-up-worktree` and others), so on this branch they do not reach the `commit` play until a later slice rewrites them to `jodysalt:playbook commit`. That is accepted: the parent lands on `main` once with all 42 moved, and the session implementing it loads the plugin from the main checkout, where the skills stay whole.
- *Play* is defined in `docs/glossary.md`. There is no `docs/testing-strategy.md`.

# Scope
In:
- The `playbook` router skill at `skills/playbook/SKILL.md`.
- The `commit` skill moved to the play `skills/playbook/plays/commit/index.md`.
- The `commit` helper at `skills/commit/SKILL.md`.

Out, each left to a later slice of the parent:
- Moving any other skill.
- Rewriting cross-references in other skills' bodies, those naming `commit` included.
- The three `templates/` folders.
- `add-skill` and `refine-skill`.
- `README.md`, `CLAUDE.md`, `docs/glossary.md` and the `setup-skills` templates.
- The version bump in `.claude-plugin/plugin.json`.
- Any change to what the `commit` play does: its steps and rules move unchanged.
- Adding a `_` play; the router supports the prefix and none exists yet.

# Acceptance criteria
- `skills/playbook/SKILL.md` exists with frontmatter `name: playbook`, a `description` and an `argument-hint`, and no `disable-model-invocation`, so plain speech can start a play.
- Its `description` is the play index: it names `commit` with trigger words ("commit this", "make a commit") and no other play.
- Its body says: given `{play} {args}`, read `plays/{play}/index.md` from the skill's base directory and follow it with `{args}` as the arguments passed to the play.
- Its body says: given an empty play name, or one with no directory directly under `plays/`, list the public plays, never one whose name starts with `_`, and stop.
- Its body says a `_{name}` play is run when named, like any other.
- `skills/playbook/plays/commit/index.md` exists, reached by `git mv` from `skills/commit/SKILL.md`, with no frontmatter; its body is the former skill's, the `$ARGUMENTS` under `## Scope` replaced by prose naming the arguments passed to the play and nothing else changed.
- `skills/commit/SKILL.md` is a helper: frontmatter of `name: commit`, a one-sentence `description`, the `argument-hint` it had, and `disable-model-invocation: true`; a one-line body invoking `jodysalt:playbook commit $ARGUMENTS`.
- `git status` shows changes only under `skills/playbook/`, `skills/commit/` and this ticket's directory.
- `claude plugin validate .` exits 0; its warning about the root `CLAUDE.md` is known and accepted.

# Implementation notes
- `git mv skills/commit/SKILL.md skills/playbook/plays/commit/index.md` first, so history follows; then strip the frontmatter, reword `## Scope`, and write the helper in the old path.
- The play's `## Scope` reads "The arguments passed to the play." in place of `$ARGUMENTS`; the "If empty, …" line after it stays.
- The router lists the public plays by listing the directories under `plays/` and leaving out those starting with `_`, rather than from a list kept in its body, so the listing never lags a moved play.
- The router's `argument-hint` is `"{play} [args]"`.
- The play index in the description takes one entry per play, the name followed by its trigger words in brackets, so later slices append entries without reshaping it.
- The helper's description is the first clause of the one it had: "Creates exactly one git commit from the current changes in house style."
- The router body follows the house style of the other skills: a title, an argument section holding `$ARGUMENTS`, steps, rules.

# Test plan
There is no `docs/testing-strategy.md` in this repo, so:
- `claude plugin validate .` exits 0; its warning about the root `CLAUDE.md` is known and accepted.
- `head -1 skills/playbook/plays/commit/index.md` is not `---`, and `grep -c 'ARGUMENTS' skills/playbook/plays/commit/index.md` is 0.
- `grep -c 'disable-model-invocation: true' skills/commit/SKILL.md` is 1, and `grep -c 'disable-model-invocation' skills/playbook/SKILL.md` is 0.
- `git diff -M --stat` against the slice's fork point shows the rename and nothing outside the scope.
- The manual checks, `/jodysalt:commit` making a commit, plain-speech "commit this" starting the play and `/jodysalt:playbook nope` listing the plays, stay with the parent's test plan, run from its worktree with the plugin loaded from it.
- This slice's checks are static only; the behavioural proof that the router routes is the parent's manual checks.

# Rollout
No flag. The slice lands on the `playbook-skill` branch only; nothing reaches `main` until the parent lands with all 42 moved and the version bumped. Fallback is reverting the slice's commit on that branch.
