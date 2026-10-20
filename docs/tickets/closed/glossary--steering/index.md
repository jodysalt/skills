---
title: Steering
type: feat
priority: high
---

# Goal
The glossary's steering and release, end to end. An adopter reading the workflow sentence, in `CLAUDE.md` after `setup-skills` scaffolds it, in this plugin's `README.md`, or in `setup-skills` itself, learns that `docs/glossary.md` is the shared vocabulary every skill reads before writing. This repo dogfoods the file it ships, holding its own `docs/glossary.md` with the workflow's two load-bearing terms, `driver` and `unattended`, defined as the parent ticket uses them. And the plugin releases the whole `glossary` change at `0.14.0`, so the first merge to `main` after this slice ships the producer, the consumers and the steering together.

# Context
- Parent: `docs/tickets/closed/glossary/index.md`. This slice moves its last unmet criteria: this repo's own `docs/glossary.md` exists and defines at least `driver` and `unattended`; `CLAUDE.md`, `README.md` and `setup-skills` carry the new workflow clause; `plugin.json` is `0.14.0`; `claude plugin validate skills --strict` passes.
- Already landed by `docs/tickets/closed/glossary--grill-me-terms/index.md`: `grill-me` reads the glossary, asks ambiguous terms and writes each `## Term` entry as it lands, read-only in an unattended run; `setup-skills` step 4 writes `docs/glossary.md` from the template, so the `CLAUDE.md` step is now 5. The descriptions and README rows of `grill-me` and `setup-skills` already name the glossary.
- Already landed by `docs/tickets/closed/glossary--consumer-reads/index.md`: the nine consumer skills each read `docs/glossary.md` in their Read step; `grep -l 'docs/glossary.md' skills/*/SKILL.md` already matches the parent's eleven-file set and no description changed.
- The workflow sentence lives in three places that today agree word for word on the sentence itself. `CLAUDE.md` line 3 reads exactly:

  > This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which works through it one thin slice at a time, each slice a sub-ticket with its own backlog.

  `skills/setup-skills/SKILL.md` step 5's `## Workflow` block (line 66) holds the same sentence byte for byte under a three-space indent; `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` is empty today. `README.md` line 7, the `## Workflow` paragraph, opens "The skills run one spec-driven workflow:" and then carries the same four clauses, before a second sentence that names `setup-skills` and `refine-vision` instead of the slash commands.
- `.claude-plugin/plugin.json` reads `"version": "0.13.1"`. The vision's *`main` is always installable* principle bumps the version on any change to a skill's behaviour; `grill-me`, `setup-skills` and nine consumers changed in the sibling slices, so the parent set `0.14.0`, a minor bump. `claude plugin validate skills --strict` passes today.
- This repo has no `docs/glossary.md`; `docs/` holds `coding-standards.md` (still the template, no `## ` section), `vision.md`, `tickets/` and `initiatives/`. Every consumer treats the glossary as empty until this slice.
- How the repo uses the two terms:
  - **driver.** `docs/vision.md`'s *Driver-agnostic* principle: "A skill serves whoever invoked it, a person or an agent. It asks the same questions the same way and never assumes a human is reading the turn." The vision's opening says the workflow is "driven by hand or by one command", and the evals goal says `deliver-brief` "drives" the interview skills. The parent's Scope calls its first item the *driver gate* and its Goal says "when a person is driving an interview".
  - **unattended.** `grill-me`'s rule *the caller's framing decides who answers*: "A caller that declares the run unattended makes the recommended answer count as the user's for the trivial many; the vital few go back to the caller, each with its options and recommendation", and its last rule: "In a run declared unattended the glossary is read, never written." `deliver-brief`'s stage prompt opens "You are one stage of an unattended `deliver-brief` run. No person reads this conversation, so never ask one anything." `complete-ticket-slice` step 4 spawns its `add-ticket` drafter "framed as unattended: no person reads its conversation". `complete-task`'s description says "Runs unattended: decides minor ambiguities itself and stops on contradictions", and the vision calls the Ralph loop "an unattended loop" whose workers run "in fresh sessions with no chat context". The parent's Out keeps the caller's framing as the only signal, so nothing detects a person.
- `docs/vision.md` lists names as `- **Name.** sentence` bullets; the glossary shape the parent fixed is `## Term` sections instead, alphabetical, the heading in the term's own case, a sentence or two then an optional `Not:` sentence.

# Scope

In:
- **The workflow clause, in three places.** The sentence gains a fourth clause between the `docs/coding-standards.md` clause and the `tasks.md` clause, mirroring the order `setup-skills` writes the files: "`docs/glossary.md` holds the terms every skill reads before writing". The new sentence, in `CLAUDE.md` line 3 and in `setup-skills` step 5's block:

  > This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, `docs/glossary.md` holds the terms every skill reads before writing, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which works through it one thin slice at a time, each slice a sub-ticket with its own backlog.

  `README.md` line 7 takes the identical clause at the identical position in its own first sentence; its prefix and its second sentence stay as they are. The three stay in step: `CLAUDE.md` line 3 and the `setup-skills` block line remain byte-identical under the indent, and all three carry the clause verbatim.
- **This repo's `docs/glossary.md`.** Created from the template `setup-skills` step 4 writes, copied verbatim, so it opens with `# Glossary` and the prompt paragraph; then two `## ` sections in alphabetical order, `## driver` and `## unattended`, each a definition in a sentence or two plus a `Not:` sentence, in the senses the Context records. The prompt paragraph stays above the entries, as the parent's shape has it.
- **Release.** `.claude-plugin/plugin.json` version from `0.13.1` to `0.14.0`, and `claude plugin validate skills --strict` passing.

Out:
- Any further change to a skill's step bodies, description or README row beyond the `README.md` Workflow paragraph; the sibling slices made every skill change the parent asks for. In `setup-skills` only the paragraph line inside step 5's fenced block changes.
- Seeding the template with workflow terms for adopters, or a glossary shipped inside the plugin; this repo's glossary is this repo's own, and the parent lists seeding as a possible follow-up.
- Defining more than the two terms. The glossary grows one term at a time as interviews meet them, by the parent's Out; `driver` and `unattended` are the two the parent itself leans on.
- `deliver-brief`'s vision-prompt grep list; it checks `docs/vision.md` only.
- Eval suites. Pushing. The first user's repo, which gets `docs/glossary.md` by rerunning `setup-skills` and the `CLAUDE.md` clause by hand after the release.

# Acceptance criteria
- `grep -rn 'holds the terms every skill reads before writing' --include='*.md' --include='*.json' . | grep -v docs/tickets` prints exactly three lines: `./CLAUDE.md:3`, `./README.md:7` and `./skills/setup-skills/SKILL.md:66`.
- In each of the three the clause sits between "`docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, " and "and each ticket's `tasks.md` is the backlog an unattended loop implements", and nothing else in the sentence changed: `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` is empty, and `README.md` line 7 still opens "The skills run one spec-driven workflow:" and still ends with its `setup-skills` and `refine-vision` sentence.
- `docs/glossary.md` exists; its first line is `# Glossary` and its third line is the template paragraph `setup-skills` step 4 writes, verbatim; `grep '^## ' docs/glossary.md` prints exactly `## driver` then `## unattended`.
- The `driver` entry says the driver is whoever invoked a skill, a person or an agent, and cites the vision's *Driver-agnostic* principle. The `unattended` entry says an unattended run is one whose caller declared in its framing that no person reads the conversation, names the framing as the only signal, and says that in such a run `grill-me`'s recommended answer stands for the trivial many, the vital few go back to the caller with options and a recommendation, and the glossary is read, never written. Each entry is a sentence or two plus a `Not:` sentence.
- `.claude-plugin/plugin.json` reads `"version": "0.14.0"` and nothing else in it changed.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the parent branch lists exactly `CLAUDE.md`, `README.md`, `skills/setup-skills/SKILL.md`, `.claude-plugin/plugin.json` and the new `docs/glossary.md`, this ticket's own files aside; `git diff -U0 skills/ | grep '^[-+]description:'` prints nothing, and `README.md`'s diff touches line 7 only.
- In a throwaway repo with `claude --plugin-dir` pointed at this slice's worktree, `/jodysalt:setup-skills` writes a `CLAUDE.md` whose `## Workflow` paragraph carries the clause, and `/jodysalt:add-ticket` in this repo with a brief that says "the driver" or "an unattended run" uses each in the glossary's sense without asking what it means.
- Nothing is pushed.

# Implementation notes
- **The clause.** Insert the text "`docs/glossary.md` holds the terms every skill reads before writing, " after "reviewed against, " in `CLAUDE.md` line 3, `skills/setup-skills/SKILL.md` line 66 and `README.md` line 7; one `sed` with the same pattern on all three keeps them in step, then run the `diff` above. Touch nothing else in `setup-skills`: its description and README row already name the glossary, and step 4 already writes the template.
- **`docs/glossary.md`.** Write the template from `setup-skills` step 4 verbatim, then append the two sections, a blank line between each. A wording the implementer may take as is, adjusting only where the Context's usage says otherwise:

  ```markdown
  ## driver

  Whoever invoked a skill: a person at the keyboard, or an agent such as a `deliver-brief` stage, the slice drafter `complete-ticket-slice` spawns, or a `complete-tasks` worker. By the vision's *Driver-agnostic* principle a skill serves either the same way, asking the same questions in the same shape, and learns which it has only from the caller's framing. Not: a person a skill detects from the session; nothing detects one.

  ## unattended

  A run whose caller declared in its framing that no person reads the conversation, as `deliver-brief`'s stage prompt and `complete-ticket-slice`'s slice drafter do and as the loop's `complete-task` worker is by its own description. The framing is the only signal. In an unattended run `grill-me`'s recommended answer stands for the trivial many, the vital few go back to the caller with their options and a recommendation, and `docs/glossary.md` is read, never written. Not: a run with no person present that nobody declared; a skill treats that as a person's run.
  ```

  `## Term` is the dedup key and the heading is in the term's own case, so both headings are lowercase, matching the parent's criterion and `grill-me` step 3.
- **Version.** Edit the one `"version"` line in `.claude-plugin/plugin.json`; keep the rest of the file as it is. Then `claude plugin validate skills --strict`.
- **Commit.** The `commit` skill reads the glossary before drafting the message, so from this slice on its subject and body use `driver` and `unattended` in these senses.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep -rn 'holds the terms every skill reads before writing'` check for the three lines, and the `diff` of `CLAUDE.md` line 3 against the `setup-skills` block line.
- `head -3 docs/glossary.md` against the template; `grep '^## ' docs/glossary.md`; `grep -n -i 'driver-agnostic\|framing\|read, never written' docs/glossary.md` shows the three load-bearing phrases.
- `grep '"version"' .claude-plugin/plugin.json` prints `0.14.0`.
- `git diff --stat` and `git diff -U0 skills/ | grep '^[-+]description:'` against the parent branch.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this slice's worktree: `git init`, `/jodysalt:setup-skills`, then `grep glossary CLAUDE.md`. Manual, this repo: one `/jodysalt:add-ticket` dry run with a brief using "the driver" and "an unattended run", checking the draft uses both in the glossary's sense and asks neither.

# Rollout
- Lands on the parent `glossary` branch as one commit. The parent then has every criterion met, so `complete-ticket` reports `done` and `wrap-up-worktree` landing `glossary` on `main` is the `0.14.0` release, since users auto-update from `main`. Nothing breaking: a repo without a glossary behaves as before until `setup-skills` is rerun or an interview defines a term, and the clause in a freshly scaffolded `CLAUDE.md` is prose. Fallback is reverting the commit.
- After the release the first user's repo reruns `setup-skills` for its `docs/glossary.md` and takes the `CLAUDE.md` clause by hand; neither is this slice's work.

## Strategic fit
Advances `glossary` by meeting its last unmet criteria: adopters are steered to the glossary from every place the workflow sentence lives, this repo dogfoods the file by defining the two terms the parent itself leans on, and the `0.14.0` bump releases the producer and consumer slices with it.
