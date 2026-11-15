# Tasks

## Point `README.md` at the plays and bump the plugin version: in each of the 42 table rows change the link `./skills/{name}/SKILL.md` to `./skills/playbook/plays/{name}/index.md` with one substitution, touching nothing else in a row; in the installation section, beside the sentence "Skills are namespaced under the plugin name, so each one runs as `/jodysalt:<skill-name>`.", add a sentence saying each is a helper for a play in the `playbook` skill, so `/jodysalt:<skill-name>` and `/jodysalt:playbook <skill-name>` are equivalent; and set `"version"` in `.claude-plugin/plugin.json` to `0.40.0`, that line alone
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c '](./skills/playbook/plays/[a-z-]*/index.md)' README.md` prints 42 and `grep -c 'SKILL.md)' README.md` prints 0
  - `git show HEAD:README.md | sed -E 's#\./skills/([a-z-]+)/SKILL\.md#./skills/playbook/plays/\1/index.md#' | diff - README.md` (run before committing; write the two sides to scratchpad files if the pipe is refused) shows only the installation section's added sentence, which `grep -n 'jodysalt:playbook' README.md` finds
  - `grep '"version"' .claude-plugin/plugin.json` shows `0.40.0`, and `git diff .claude-plugin/plugin.json` changes that line alone
  - `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted

## Bring `CLAUDE.md`, `docs/glossary.md` and step 7 of the `refine-skill` play in step with plays behind helpers: in `CLAUDE.md`'s `## Workflow` change only the four commands `/jodysalt:add-landing-page`, `/jodysalt:refine-landing-page`, `/jodysalt:add-ticket` and `/jodysalt:complete-ticket` to `/jodysalt:playbook {name}`, so the paragraph equals the `## Workflow` template in `skills/playbook/plays/setup-skills/index.md` word for word; in `docs/glossary.md` make a light pass on six entries, changing a sentence only where it is untrue of plays or describes one unit calling another: *play* loses "after the refactor", *boilerplate* names the play whose sections are prompts and its helper that `add-skill` writes in a playbook repo beside the `SKILL.md` it writes elsewhere, *stage* has `deliver-brief` spawn a sub-agent to run one play, *pair*, *partner* and *driver* keep "skill" where they mean a command a user types, the intro line (line 3) unchanged and entries kept alphabetical; and in step 7 of `skills/playbook/plays/refine-skill/index.md`, edited by hand and wording only, name one README table per kind of repo: rows linking `skills/*/SKILL.md` in a plugin repo that is not a playbook repo, rows linking `skills/playbook/plays/*/index.md` in a playbook repo, the step's behaviour in each unchanged
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c 'jodysalt:playbook' CLAUDE.md` prints 1, and the `## Workflow` paragraph of `CLAUDE.md` (its line 3) appears word for word in `skills/playbook/plays/setup-skills/index.md`
  - `grep -c 'after the refactor' docs/glossary.md` prints 0, and line 3 of `docs/glossary.md` still appears word for word in `skills/playbook/plays/setup-skills/index.md` and `skills/playbook/plays/grill-me/index.md`
  - `grep -n 'README' skills/playbook/plays/refine-skill/index.md` shows step 7 naming one table per kind of repo, and `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays | grep -vc 'jodysalt:playbook$'` prints 0
  - `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted

## Run the gate for playbook-skill--docs-and-version
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`npm run test`, or the manifest's equivalent; this repo has no manifest, so every check under `# Test plan` in `docs/tickets/closed/playbook-skill--docs-and-version/index.md`, both the slice's own and the parent's criteria listed there, `claude plugin validate .` exiting 0 with its two known warnings and `claude plugin validate skills --strict` exiting 0 among them) and confirm every suite passes.
  - `git diff --stat playbook-skill..HEAD` shows changes only in `README.md`, `CLAUDE.md`, `docs/glossary.md`, `.claude-plugin/plugin.json`, `skills/playbook/plays/refine-skill/index.md` and `docs/tickets/closed/playbook-skill--docs-and-version/`
- **notes:**
  - The test plan's README diff check compares against `HEAD:README.md`, which holds the new links once the README task is committed, so it prints nothing; compare against `playbook-skill:README.md` instead, where the only difference left after the substitution is line 16's added sentence.
  - A pipe that starts with `git` is refused in a worktree-isolated session: write `git show`'s side to a scratchpad file with a script, then `diff` the two files.
  - The glossary's *pair*, *partner* and *driver* entries are unchanged on purpose: read against the criterion, each sentence holds with "skill" meaning the command a user types, so the read should expect edits only in *boilerplate*, *play* and *stage*.
