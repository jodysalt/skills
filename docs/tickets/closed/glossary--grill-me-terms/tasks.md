# Tasks

## Add a `docs/glossary.md` scaffold step to skills/setup-skills/SKILL.md between the coding-standards and CLAUDE.md steps
- **category:** functional
- **status:** done
- **steps:**
  - Insert a new step 4 in `skills/setup-skills/SKILL.md` after step 3 (`docs/coding-standards.md`): skip if `docs/glossary.md` exists, otherwise write it from this template in a fenced block, as steps 2 and 3 carry theirs, with the sentence that the paragraph is the prompt and `grill-me` fills the terms in: `# Glossary`, blank line, `One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.` Renumber the old steps 4–7 (`CLAUDE.md`, `.gitignore`, `.vscode/settings.json`, Report) to 5–8 and fix any in-body reference to those numbers. Add `docs/glossary.md` to the description's list of what it scaffolds (`docs/coding-standards.md` from a template, `docs/glossary.md` from a template, ...), keeping every trigger phrase and "never" clause. Do not change the workflow block in the `CLAUDE.md` step.
  - `grep -n 'docs/glossary.md' skills/setup-skills/SKILL.md` shows the description, the new step and nothing in the `CLAUDE.md` block.
  - `grep -n '^[0-9]\. \*\*' skills/setup-skills/SKILL.md` prints steps 1 through 8 in order with no duplicate number.
  - `claude plugin validate skills --strict` passes.

## Make grill-me step 1 read docs/glossary.md and add each ambiguous term as an open decision, ranked by step 2 like any other
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/grill-me/SKILL.md` step 1 (**Map the tree**), after the sentence "Anything the codebase can answer, answer by exploring; it never becomes a question.", add: read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary; then add each ambiguous term as an open decision, defined as a term the subject or conversation uses in more than one plausible sense, uses differently from the glossary, or that the repo already uses two ways; a term the glossary defines and the subject uses in its sense is answered from the glossary, never asked. In step 2, add one sentence that a term ranks like any other decision: a term the subject hangs on is asked before the questions that use it, a cosmetic one lands in the batched tail.
  - `grep -n 'docs/glossary.md' skills/grill-me/SKILL.md` matches in step 1.
  - `grep -c 'ambiguous term' skills/grill-me/SKILL.md` prints at least 1.
  - `claude plugin validate skills --strict` passes.

## Make grill-me step 3 ask each term, write the `## Term` entry to docs/glossary.md as the answer lands, create the file from the template when missing, and ask keep-or-redefine on a conflict
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/grill-me/SKILL.md` step 3 (**Interview**), add: a term is asked in the usual question shape (the term, the senses in play, a recommended definition); as its answer lands, write it to `docs/glossary.md` whether or not the subject is a file, so the glossary never lags the conversation: a `## Term` section inserted in alphabetical order, the heading in the term's own case, holding the definition in a sentence or two then an optional `Not:` sentence naming what the term is distinguished from; `## Term` is the dedup key, so a redefine rewrites the section under its existing heading. When the file is missing, create it first from the template in `skills/setup-skills/SKILL.md`'s glossary step (copy its text verbatim: `# Glossary`, blank line, the one-paragraph prompt). When the glossary already defines a term the subject uses in another sense, ask once with both senses: *keep* leaves the entry and the subject is reworded to the glossary sense; *redefine* rewrites the entry and the close names every other file under `docs/` using the old sense, found with `grep -rli '<term>' docs/` minus `docs/glossary.md`, left untouched. A silent third definition is never written.
  - `grep -n 'keep' skills/grill-me/SKILL.md` and `grep -n 'redefine' skills/grill-me/SKILL.md` each match in step 3.
  - `grep -n 'alphabetical' skills/grill-me/SKILL.md` matches in step 3.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - The template to copy is step 4 of `skills/setup-skills/SKILL.md` (the fenced block at lines 55–59); the step's own prose outside the fence is not part of the template.
  - Every step in `skills/grill-me/SKILL.md` is one paragraph on one line; step 1's glossary text was appended inline after the codebase-answers sentence and step 2's ranking sentence sits in the trailing paragraph before "Open the interview", not as a bullet, so step 3's additions belong inline on its own line after "so the file never lags the conversation."

## Make grill-me step 5 and its rules cover the glossary: name each term defined or redefined at the close, and read-but-never-write it in an unattended run; add the glossary to the description
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/grill-me/SKILL.md` step 5 (**Close**), add that the summary (file subject) and the decision log (otherwise) name each term defined or redefined and, after a redefine, the files under `docs/` still using the old sense. In `## Rules`, beside *The caller's framing decides who answers*, add: in a run declared unattended the glossary is read, never written, and an unresolved term, one the glossary lacks or one it defines in a sense the subject does not use, goes back to the caller as a vital-few question with options and a recommendation. In the frontmatter `description`, add one clause that it defines each ambiguous term in `docs/glossary.md` as the interview meets it, keeping the existing trigger phrases ("stress-test a plan", "get grilled on a design", "grill me").
  - `grep -n 'unattended' skills/grill-me/SKILL.md` matches in `## Rules`.
  - `grep -n '^description:' skills/grill-me/SKILL.md | grep -c glossary` prints 1.
  - `grep -l 'docs/glossary.md' skills/*/SKILL.md` prints exactly `skills/grill-me/SKILL.md` and `skills/setup-skills/SKILL.md`.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - Step 3 of `skills/grill-me/SKILL.md` now ends with the glossary template in an indented fenced block (lines 27–31), so step 5 (**Close**) is at line 34 and `## Rules` starts at line 44; step 3 already states that the glossary write is the one file edit the skill makes when its subject is not a file, so step 5 need only name the terms and the old-sense files, not restate that.

## Update the README rows for grill-me and setup-skills to match their new descriptions
- **category:** chore
- **status:** done
- **steps:**
  - In `README.md`, edit the `grill-me` row and the `setup-skills` row of the skills table so each summarises the skill's current frontmatter `description` in `skills/grill-me/SKILL.md` and `skills/setup-skills/SKILL.md`, including the glossary clause, in the row's existing voice. Touch no other row and not the Workflow paragraph at the top.
  - `grep -n glossary README.md` prints exactly two lines, the two rows.
  - `git diff --stat README.md` shows only `README.md` with two changed lines.
- **notes:**
  - The glossary clause in `skills/grill-me/SKILL.md`'s description reads "defining each ambiguous term in `docs/glossary.md` as the interview meets it"; the README's `grill-me` row (line 35) is a one-sentence paraphrase rather than the full description, so one added clause in that voice is the shape. The Workflow paragraph (line 7) holds no "glossary" yet, so the grep's two lines are the rows alone.

## Run full test suite for glossary--grill-me-terms
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
