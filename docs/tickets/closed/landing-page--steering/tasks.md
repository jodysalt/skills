# Tasks

## Insert the market-test sentence into the Workflow paragraph of CLAUDE.md, README.md and the CLAUDE.md block in skills/setup-skills/SKILL.md
- **category:** functional
- **status:** done
- **steps:**
  - In `CLAUDE.md` line 3 and in the `## Workflow` block `skills/setup-skills/SKILL.md` step 5 writes (its paragraph line, around line 66), insert after the sentence ending "the backlog an unattended loop implements." and before "Draft with `/jodysalt:add-ticket`" exactly: `An idea can first be market-tested, before the vision is written: `/jodysalt:add-landing-page` writes the landing page with its hypothesis beside it, and `/jodysalt:refine-landing-page` improves the page and records the result for the vision to cite.` In `README.md` line 7 insert the same sentence after its first sentence and before "`setup-skills` creates that layout", with the two skills named bare (`add-landing-page`, `refine-landing-page`), as that paragraph already names `add-ticket`.
  - `grep -c 'An idea can first be market-tested' CLAUDE.md README.md skills/setup-skills/SKILL.md` prints 1 for each file; `diff <(sed -n 3p CLAUDE.md) <(sed -n '/^   This repo runs the/p' skills/setup-skills/SKILL.md | sed 's/^   //')` prints nothing (run it from a small `.sh` under the session scratchpad if the shell tool refuses process substitution); `git diff -U0 landing-page -- README.md` touches line 7 only.
  - `git diff -U0 landing-page -- skills/ | grep '^[-+]description:'` prints nothing, so no skill description changed; `claude plugin validate skills --strict` passes.

## Bump .claude-plugin/plugin.json from 0.21.0 to 0.22.0
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n '"version"' .claude-plugin/plugin.json` prints `"version": "0.22.0"`, and `git diff landing-page -- .claude-plugin/plugin.json` shows only that line changed.
  - `git diff --stat landing-page` lists exactly `CLAUDE.md`, `README.md`, `skills/setup-skills/SKILL.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.
- **notes:**
  - The worktree-isolated shell refuses a `git` command chained with other commands or with a runtime-built string (`&&`, `perl -e "$VAR"`); run each `git diff` as its own plain Bash call from the worktree root.

## Run full test suite for landing-page--steering
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills --strict`) and confirm both pass.
