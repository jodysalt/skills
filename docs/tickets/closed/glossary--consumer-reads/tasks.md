# Tasks

## Add the glossary read line to add-ticket step 4, refine-ticket step 2 and add-skill step 2
- **category:** functional
- **status:** done
- **steps:**
  - Append one sentence to the end of the named step's paragraph in each file, this template with only the `{what}` clause varied: "Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in {what}, never redefining one in passing; a term the glossary lacks is used as the input uses it." In `skills/add-ticket/SKILL.md` step 4 (**Read**), `{what}` is "the ticket and its `## Strategic fit`". In `skills/refine-ticket/SKILL.md` step 2 (**Read**), `{what}` is "the edits and the findings report". In `skills/add-skill/SKILL.md` step 2 (**Read**), `{what}` is "the skill file's description, steps and rules". Touch no `description:` line and no other step.
  - `grep -c 'docs/glossary.md' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md skills/add-skill/SKILL.md` prints 1 for each file.
  - `git diff -U0 skills/ | grep -c '^[-+]description:'` prints 0.
  - `claude plugin validate skills --strict` passes.

## Add the glossary read line to refine-vision step 2 and refine-coding-standards step 2
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/refine-vision/SKILL.md` step 2 (**Explore before asking**) and `skills/refine-coding-standards/SKILL.md` step 2 (**Explore before asking**), append one sentence after the sentence ending "it never creates one." / "it never creates it.", this template with only `{what}` varied: "Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in {what}, never redefining one in passing; a term the glossary lacks is used as the input uses it." For `refine-vision`, `{what}` is "the vision"; for `refine-coding-standards`, "the standards". Touch no `description:` line and no other step.
  - `grep -c 'docs/glossary.md' skills/refine-vision/SKILL.md skills/refine-coding-standards/SKILL.md` prints 1 for each file.
  - `git diff -U0 skills/ | grep -c '^[-+]description:'` prints 0.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - The worktree sandbox refuses a multi-line Bash command (heredoc, inline python) as "too complex to verify"; append the sentence with the Edit tool and run each grep / `git diff` / validate as its own one-line Bash call.

## Add the glossary read line to add-tasks step 1 and complete-task step 2
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/add-tasks/SKILL.md` step 1 (**Read**), append at the end of the paragraph: "Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the task headings and steps, never redefining one in passing; a term the glossary lacks is used as the input uses it." In `skills/complete-task/SKILL.md` step 2 (**Read**), append at the end of the paragraph the same sentence with the clause "in the code, the hand-over notes and the report". Add no rule about writing the glossary; the worker edits only what its task names, so the read is read-only by construction. Touch no `description:` line and no other step.
  - `grep -c 'docs/glossary.md' skills/add-tasks/SKILL.md skills/complete-task/SKILL.md` prints 1 for each file.
  - `grep -n 'glossary' skills/complete-task/SKILL.md` prints one line, in step 2, with no "write", "create" or "edit" of the glossary.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - The worktree sandbox refuses a multi-line Bash command (heredoc, inline python) as "too complex to verify"; append the sentence with the Edit tool and run each grep / validate as its own one-line Bash call.

## Add the glossary read line to complete-ticket-slice step 3 and commit step 1
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/complete-ticket-slice/SKILL.md` step 3 (**Judge**), append after "and the repo as it is." the sentence: "Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the verdicts, the evidence and the `{sub}` name, never redefining one in passing; a term the glossary lacks is used as the input uses it." In `skills/commit/SKILL.md` step 1 (the parallel `git status`, `git diff` and `git diff --staged` run), append the sentence with the clause "in the subject and body". Touch no `description:` line, no other step, and not step 4's framing of the `add-ticket` sub-agent in `complete-ticket-slice`.
  - `grep -c 'docs/glossary.md' skills/complete-ticket-slice/SKILL.md skills/commit/SKILL.md` prints 1 for each file.
  - `grep -l 'docs/glossary.md' skills/*/SKILL.md` prints exactly eleven paths: `add-skill`, `add-tasks`, `add-ticket`, `commit`, `complete-task`, `complete-ticket-slice`, `grill-me`, `refine-coding-standards`, `refine-ticket`, `refine-vision`, `setup-skills`.
  - `git diff --stat glossary..HEAD -- skills/ README.md` lists nine `SKILL.md` files and no `README.md`; `git diff -U0 glossary..HEAD -- skills/ | grep -c '^[-+]description:'` prints 0.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - The worktree sandbox refuses a multi-line Bash command (heredoc, inline python) as "too complex to verify"; append the sentence with the Edit tool and run each grep / `git diff` / validate as its own one-line Bash call.

## Run full test suite for glossary--consumer-reads
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
