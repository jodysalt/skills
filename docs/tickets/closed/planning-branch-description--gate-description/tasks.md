# Tasks

## Widen the branch gate in add-ticket, refine-ticket, refine-vision and refine-coding-standards and pass a derived description to start-planning-session
- **category:** functional
- **status:** done
- **steps:**
  - Replace line 19 of each of `skills/add-ticket/SKILL.md`, `skills/refine-ticket/SKILL.md`, `skills/refine-vision/SKILL.md` and `skills/refine-coding-standards/SKILL.md` (today byte-identical: `1. **Branch gate.** If the current branch is not \`planning-<YYYY-MM-DD>\` (optionally \`-<N>\`), offer to invoke \`jodysalt:start-planning-session\`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.`) with this sentence, `<clause>` being the one place the four differ: `1. **Branch gate.** If the current branch does not match \`planning-<YYYY-MM-DD>\` followed by anything (a pre-upgrade \`planning-2026-10-21\` counts), offer to invoke \`jodysalt:start-planning-session <description>\`, the description being <clause>; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.`
  - The clauses: `add-ticket`: `a short kebab-case phrase for the ticket's subject, two to four words, taken from the input above, since the slug is not picked until step 5 (\`glossary terms\` becomes \`glossary-terms\`)`; `refine-ticket`: `the ticket's slug`; `refine-vision`: `\`vision\``; `refine-coding-standards`: `\`coding-standards\``. Touch nothing else in the four files: no frontmatter, no other step.
  - Verify: `grep -c 'followed by anything' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md skills/refine-vision/SKILL.md skills/refine-coding-standards/SKILL.md` prints `1` for each, and `grep -l 'optionally `-<N>`' skills/*/SKILL.md` prints nothing.
  - Verify: `grep -n 'jodysalt:start-planning-session' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md skills/refine-vision/SKILL.md skills/refine-coding-standards/SKILL.md` prints exactly one line per file, each at line 19, and `diff <(sed -n 19p skills/add-ticket/SKILL.md) <(sed -n 19p skills/refine-ticket/SKILL.md)` differs only in the clause (repeat against `refine-vision` and `refine-coding-standards`).
  - Verify: `git diff --stat` lists exactly the four SKILL.md files, and `git diff -U0 skills/ | grep '^[-+]description:'` prints nothing.

## Bump .claude-plugin/plugin.json from 0.14.0 to 0.15.0
- **category:** chore
- **status:** done
- **steps:**
  - In `.claude-plugin/plugin.json`, change `"version": "0.14.0"` to `"version": "0.15.0"` and nothing else.
  - Verify: `grep '"version"' .claude-plugin/plugin.json` prints `"version": "0.15.0",` and `git diff --stat .claude-plugin/plugin.json` shows one line changed.
  - Verify: `claude plugin validate skills --strict` passes.

## Run full test suite for planning-branch-description--gate-description
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
