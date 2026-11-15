# Tasks

## Rewrite every `jodysalt:{name}` reference in the play bodies `skills/playbook/plays/*/index.md` to `jodysalt:playbook {name}` with one substitution: wherever `jodysalt:` is followed by a play's name (a directory under `skills/playbook/plays/`), insert `playbook ` between the two, keeping a leading slash, the arguments, punctuation and backticks as they were (`/jodysalt:refine-sandbox` becomes `/jodysalt:playbook refine-sandbox`, `jodysalt:start-planning-session <description>` becomes `jodysalt:playbook start-planning-session <description>`), the references inside the `setup-skills` play's inline templates included; change no other word, and leave `jodysalt:{skill}` and `jodysalt:<skill>` placeholders, `$ARGUMENTS` and `${CLAUDE_PLUGIN_ROOT}` lines for the next task
- **category:** chore
- **status:** done
- **steps:**
  - `grep -rnoE 'jodysalt:[a-z-]+' skills/playbook/plays | grep -vc 'jodysalt:playbook$'` prints 0
  - `grep -rnoE 'jodysalt:playbook [a-z-]+' skills/playbook/plays | wc -l` prints 243 and `grep -rnoE '/jodysalt:playbook [a-z-]+' skills/playbook/plays | wc -l` prints 17, and every name after `jodysalt:playbook ` is a directory under `skills/playbook/plays/`
  - `git diff --stat` lists only `skills/playbook/plays/*/index.md` files, with equal insertions and deletions in each
  - `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted

## Rewrite the sub-agent prompts in `skills/playbook/plays/complete-tasks/index.md` and `skills/playbook/plays/deliver-brief/index.md`, keeping each prompt's other sentences word for word: the `complete-tasks` worker prompt invokes `jodysalt:playbook complete-task docs/tickets/open/{slug}` with the Skill tool and falls back to reading `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/complete-task/index.md` with `docs/tickets/open/{slug}` as the arguments passed to the play; the `deliver-brief` stage prompt invokes `jodysalt:playbook <skill> <argument>` and falls back to reading `${CLAUDE_PLUGIN_ROOT}/skills/playbook/plays/<skill>/index.md` with `<argument>` as the arguments passed to the play; "treating … as its `$ARGUMENTS`" becomes that prose, so no `$ARGUMENTS` is left under `skills/playbook/plays/`; beside each prompt add one sentence telling the spawner to write the `playbook` skill's base directory in place of `${CLAUDE_PLUGIN_ROOT}/skills/playbook` in the prompt when the Skill tool's "Base directory" line gave it one; and in the `deliver-brief` play change the path `skills/setup-skills/SKILL.md` to `skills/playbook/plays/setup-skills/index.md`
- **category:** chore
- **status:** done
- **steps:**
  - `grep -rn '\$ARGUMENTS' skills/playbook/plays` prints nothing, and `grep -rn 'jodysalt:' skills/playbook/plays | grep -v 'jodysalt:playbook '` prints nothing
  - `grep -rn 'CLAUDE_PLUGIN_ROOT' skills/playbook/plays` shows only lines in the `complete-tasks` and `deliver-brief` plays, the two prompt lines each holding `skills/playbook/plays/` and `index.md`
  - `grep -rnE 'skills/[a-z-]+/SKILL\.md' skills/playbook/plays` shows nothing outside the `add-skill` and `refine-skill` plays
  - `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted
- **notes:**
  - The `complete-tasks` prompt (line 16) already reads "Invoke the `jodysalt:playbook complete-task` skill with the argument `docs/tickets/open/{slug}`"; the `deliver-brief` prompt (line 30) is untouched and holds the only `jodysalt:` left without `playbook `.
  - The count checks of the first task (243 `jodysalt:playbook {name}`, 17 with a slash) hold now; `jodysalt:playbook <skill>` is not counted by them, a second `jodysalt:playbook complete-task` would be.

## Make the four plays that compare the sandbox placeholder marker, `skills/playbook/plays/refine-sandbox/index.md`, `run-in-sandbox/index.md`, `rebase-worktree/index.md` and `complete-task/index.md` in the same folder, treat any first line of `Dockerfile.sandbox` starting `# Placeholder: run ` as the placeholder, while still quoting the line the `setup-skills` play now writes, `# Placeholder: run /jodysalt:playbook refine-sandbox to tailor this file to the project.`; `run-in-sandbox`'s "exactly" goes, so a `Dockerfile.sandbox` written by plugin 0.39 with `/jodysalt:refine-sandbox` in its first line still reads as untailored; change nothing else in the four plays
- **category:** chore
- **status:** done
- **steps:**
  - `grep -rn 'Placeholder: run' skills/playbook/plays` shows five plays, `setup-skills` and the four comparers, each quoting `/jodysalt:playbook refine-sandbox`
  - `grep -n 'starting' skills/playbook/plays/refine-sandbox/index.md skills/playbook/plays/run-in-sandbox/index.md skills/playbook/plays/rebase-worktree/index.md skills/playbook/plays/complete-task/index.md` shows the prefix rule in each of the four
  - `claude plugin validate .` exits 0; its warnings about the root `CLAUDE.md` and `ICON_MISSING` are known and accepted
- **notes:**
  - All five plays already quote `/jodysalt:playbook refine-sandbox` in the marker line, rewritten by the first task; only the prefix rule and `run-in-sandbox`'s "exactly" are left.

## Run the gate for playbook-skill--rewrite-cross-references
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`npm run test`, or the manifest's equivalent; this repo has no manifest, so every check under `# Test plan` in `docs/tickets/closed/playbook-skill--rewrite-cross-references/index.md`, `claude plugin validate .` exiting 0 with its two known warnings among them) and confirm every suite passes.
  - `git diff --stat playbook-skill..HEAD` shows changes only under `skills/playbook/plays/` and `docs/tickets/closed/playbook-skill--rewrite-cross-references/`
- **notes:**
  - The spawner sentences beside the two prompts (`complete-tasks` line 18, `deliver-brief` line 25) say "the variable and the `/skills/playbook` after it" rather than spelling the variable, so the test plan's `CLAUDE_PLUGIN_ROOT` grep shows exactly the two prompt lines.
  - There is no `Dockerfile.sandbox`, so `claude plugin validate .` runs on the host.
