# Tasks

## Insert the glossary clause into the workflow sentence in CLAUDE.md line 3, README.md line 7 and skills/setup-skills/SKILL.md line 66
- **category:** functional
- **status:** done
- **steps:**
  - In each of `CLAUDE.md` (line 3), `README.md` (line 7) and `skills/setup-skills/SKILL.md` (line 66, the paragraph inside step 5's fenced `## Workflow` block), insert the text "`docs/glossary.md` holds the terms every skill reads before writing, " directly after "`docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, " so the clause sits before "and each ticket's `tasks.md` is the backlog an unattended loop implements". Change nothing else in any of the three files: not `README.md`'s prefix "The skills run one spec-driven workflow:" or its second sentence, not any skill row, not `setup-skills`' description or any other step.
  - `grep -rn 'holds the terms every skill reads before writing' --include='*.md' . | grep -v docs/tickets` prints exactly three lines: `./CLAUDE.md:3`, `./README.md:7` and `./skills/setup-skills/SKILL.md:66`.
  - `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` prints nothing.
  - `git diff --stat` lists exactly `CLAUDE.md`, `README.md` and `skills/setup-skills/SKILL.md` with one changed line each; `git diff -U0 skills/ | grep -c '^[-+]description:'` prints 0.
  - `claude plugin validate skills --strict` passes.

## Create this repo's docs/glossary.md from the setup-skills template with `## driver` and `## unattended` entries
- **category:** functional
- **status:** done
- **steps:**
  - Create `docs/glossary.md`. Lines 1 to 3 are the template from `skills/setup-skills/SKILL.md` step 4's fenced block, copied verbatim with the three-space indent removed: `# Glossary`, a blank line, then the one-paragraph prompt beginning "One `## ` section per term, alphabetical:". Then a blank line and two sections in this order, each `## ` heading lowercase, a blank line, then the entry, a blank line between sections. `## driver`: whoever invoked a skill, a person at the keyboard or an agent such as a `deliver-brief` stage, the slice drafter `complete-ticket-slice` spawns, or a `complete-tasks` worker; by the vision's *Driver-agnostic* principle a skill serves either the same way and learns which it has only from the caller's framing; `Not:` a person a skill detects from the session, since nothing detects one. `## unattended`: a run whose caller declared in its framing that no person reads the conversation, as `deliver-brief`'s stage prompt and `complete-ticket-slice`'s slice drafter do and as the `complete-task` worker is by its own description; the framing is the only signal; in such a run `grill-me`'s recommended answer stands for the trivial many, the vital few go back to the caller with their options and a recommendation, and `docs/glossary.md` is read, never written; `Not:` a run with no person present that nobody declared, which a skill treats as a person's run. Each entry is a sentence or two plus the `Not:` sentence. Read `skills/grill-me/SKILL.md` rules and `skills/deliver-brief/SKILL.md` lines 30–40 first so the wording matches how the repo uses both terms.
  - `head -1 docs/glossary.md` prints `# Glossary`; `sed -n 3p docs/glossary.md` is identical to line 57 of `skills/setup-skills/SKILL.md` with its leading three spaces removed.
  - `grep '^## ' docs/glossary.md` prints exactly `## driver` then `## unattended`.
  - `grep -c -i 'driver-agnostic' docs/glossary.md`, `grep -c 'framing' docs/glossary.md` and `grep -c 'read, never written' docs/glossary.md` each print at least 1; `grep -c '^Not:' docs/glossary.md` prints 2.

## Bump .claude-plugin/plugin.json from 0.13.1 to 0.14.0
- **category:** chore
- **status:** done
- **steps:**
  - In `.claude-plugin/plugin.json` change the one `"version"` value from `0.13.1` to `0.14.0`; change nothing else in the file.
  - `grep '"version"' .claude-plugin/plugin.json` prints `"version": "0.14.0",`; `git diff --stat .claude-plugin/plugin.json` shows one line changed.
  - `claude plugin validate skills --strict` passes.

## Run full test suite for glossary--steering
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
