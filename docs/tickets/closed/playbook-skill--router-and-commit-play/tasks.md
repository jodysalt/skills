# Tasks

## Write the `playbook` router skill at `skills/playbook/SKILL.md`: frontmatter `name: playbook`, a `description` that is the play index naming only `commit` with its trigger words in brackets ("commit this", "make a commit"), `argument-hint: "{play} [args]"` and no `disable-model-invocation`; a body in the house style of the other skills (title, an argument section holding `$ARGUMENTS`, steps, rules) saying that given `{play} {args}` it reads `plays/{play}/index.md` from the skill's base directory and follows it with `{args}` as the arguments passed to the play, that given an empty play name or one with no directory directly under `plays/` it lists the public plays by listing the directories under `plays/` minus those starting with `_` and stops, and that a `_{name}` play is run when named like any other
- **category:** chore
- **status:** done
- **steps:**
  - `head -5 skills/playbook/SKILL.md` shows `name: playbook`, a `description` naming `commit` and no other play, and `argument-hint: "{play} [args]"`
  - `grep -c 'disable-model-invocation' skills/playbook/SKILL.md` prints 0 and `grep -c 'ARGUMENTS' skills/playbook/SKILL.md` prints at least 1
  - `grep -n 'plays/' skills/playbook/SKILL.md` shows the read of `plays/{play}/index.md` from the base directory, the listing that leaves out `_`-prefixed directories for an empty or unknown name, and the line saying a `_{name}` play runs when named
  - `claude plugin validate .` exits 0; its warning about the root `CLAUDE.md` is known and accepted

## Move the `commit` skill to a play with `git mv skills/commit/SKILL.md skills/playbook/plays/commit/index.md`, then in the moved file drop the frontmatter block and replace the `$ARGUMENTS` line under `## Scope` with "The arguments passed to the play.", keeping the "If empty, …" line after it and changing nothing else; in the same commit write the helper at `skills/commit/SKILL.md`: frontmatter `name: commit`, `description: Creates exactly one git commit from the current changes in house style.`, the `argument-hint` the skill had (`"[what to commit, e.g. 'the webhook fix' – defaults to all changes]"`), `disable-model-invocation: true`, and a one-line body invoking `jodysalt:playbook commit $ARGUMENTS` with the Skill tool
- **category:** chore
- **status:** done
- **steps:**
  - `head -1 skills/playbook/plays/commit/index.md` is not `---`, and `grep -c 'ARGUMENTS' skills/playbook/plays/commit/index.md` prints 0
  - `git diff -M HEAD~1 --stat` shows `skills/commit/SKILL.md` renamed to `skills/playbook/plays/commit/index.md`, and `git diff -M HEAD~1 -- skills/playbook/plays/commit/index.md` shows only the frontmatter removed and the `## Scope` line reworded
  - `grep -c 'disable-model-invocation: true' skills/commit/SKILL.md` prints 1, and `grep -n 'jodysalt:playbook commit \$ARGUMENTS' skills/commit/SKILL.md` matches the body's one line
  - `claude plugin validate .` exits 0; its warning about the root `CLAUDE.md` is known and accepted
- **notes:**
  - `claude plugin validate .` also prints an `ICON_MISSING` plugin directory warning beside the root `CLAUDE.md` one; it exits 0 with both.
  - Not probed here, git's documented behaviour: plain `-M` pairs only a deleted path with an added one, so with the helper written back at `skills/commit/SKILL.md` the stat may show that path modified and `index.md` added instead of a rename; `-B -M` (`git diff -B -M HEAD~1 --stat`) breaks the rewritten file so the rename shows.
  - The router's step 2 reads "wherever the play says \"the arguments passed to the play\", it means `{args}`", so the `## Scope` wording in the step is the one the router resolves.

## Run the gate for playbook-skill--router-and-commit-play
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`npm run test`, or the manifest's equivalent; this repo has no manifest, so `claude plugin validate .` exiting 0, its root `CLAUDE.md` warning accepted, and the greps in the `# Test plan` of `docs/tickets/closed/playbook-skill--router-and-commit-play/index.md`) and confirm every suite passes.
  - `git diff -M --stat playbook-skill..HEAD` shows changes only under `skills/playbook/`, `skills/commit/` and `docs/tickets/closed/playbook-skill--router-and-commit-play/`, plus the one-line validate rewording in `docs/tickets/closed/playbook-skill/index.md`
- **notes:**
  - `claude plugin validate .` also prints an `ICON_MISSING` plugin directory warning beside the root `CLAUDE.md` one; it exits 0 with both.
  - Probed: plain `git diff -M --stat` lists `skills/commit/SKILL.md` as modified and `skills/playbook/plays/commit/index.md` as added, with no rename line, because the helper sits at the old path; `git diff -B -M --stat playbook-skill..HEAD` shows the rename the `# Test plan` names. The paths listed are the same either way.
  - The worktree-isolated session refuses a Bash call that chains `git` with other commands (`&&`, `;`, process substitution); run each `git` command as its own call, from the worktree, with no `cd`.
