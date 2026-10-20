---
title: Grill Me Terms
type: feat
priority: high
---

# Goal
The glossary's producer, end to end. A person running any interview skill gets `docs/glossary.md` filled one term at a time: `grill-me` reads the glossary, names each ambiguous term among the decisions it sees, asks it in the usual question shape with a recommended definition, and writes the agreed `## Term` entry as the answer lands, creating the file from the template when it is missing. A term the glossary already defines in another sense is asked once as keep or redefine. `setup-skills` scaffolds the same file in a fresh repo. A run declared unattended reads the glossary, never writes it, and hands each unresolved term back to its caller.

# Context
- Parent: `docs/tickets/closed/glossary/index.md`. This slice moves its first four acceptance criteria: `setup-skills` scaffolds; a person's `add-ticket` defines a term and creates the file; keep-or-redefine; `deliver-brief` writes nothing and reports the term.
- `skills/grill-me/SKILL.md` (plugin `0.13.1`): step 1 maps the tree and answers from the codebase; step 2 ranks with the 80/20 principle; step 3 interviews one question at a time and, when the subject is a file, edits it as each answer lands; step 5 closes with a summary when the subject is a file or a decision log otherwise. Its last rule, *the caller's framing decides who answers*, already sends the vital few back to an unattended caller with options and a recommendation. Every interview skill (`add-ticket`, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill`) invokes it, so the step reaches all of them without touching them.
- `skills/setup-skills/SKILL.md`: steps 2 and 3 write `docs/vision.md` and `docs/coding-standards.md` from templates and skip an existing file; step 4 handles `CLAUDE.md`; step 7 reports each path created or skipped. The coding-standards template is one `# ` heading and one prompt paragraph, the precedent the glossary template follows.
- `README.md` holds one row per skill matching its description (`grill-me` at line 35, `setup-skills` at line 43). `claude plugin validate skills --strict` gates the frontmatter.
- `deliver-brief` stages and the `add-ticket` sub-agent in `complete-ticket-slice` declare their runs unattended in their prompts; nothing detects a person, by the vision's *Driver-agnostic* principle.
- No `docs/glossary.md` exists in this repo yet; its entries are a later slice.

# Scope

In:
- **`grill-me` step 1** reads `docs/glossary.md` when it exists, treating a missing or template-only file as an empty glossary, and adds each ambiguous term as an open decision: a term the subject or conversation uses in more than one plausible sense, uses differently from the glossary, or that the repo already uses two ways. A term the glossary defines and the subject uses in its sense is answered, never asked.
- **`grill-me` step 2** ranks a term like any other decision: a term the subject hangs on is asked before the questions that use it; a cosmetic one lands in the batched tail.
- **`grill-me` step 3** asks each term in the usual question shape (the term, the senses in play, a recommended definition) and writes the agreed entry to `docs/glossary.md` as the answer lands, so the file never lags the conversation: a `## Term` section in alphabetical order holding the definition in a sentence or two, then an optional `Not:` sentence naming what the term is distinguished from. When the file is missing it is created from the template below first. When the glossary already defines a term the subject uses in another sense, one question offers both senses: *keep* leaves the entry and rewords the subject to the glossary sense; *redefine* rewrites the entry and the close names every other file under `docs/` that uses the old sense, found with `grep -rli`, left untouched for the user. A silent third definition is never written.
- **`grill-me` step 5**'s summary and decision log name each term defined or redefined and, after a redefine, the files still using the old sense.
- **`grill-me` rules** gain: in a run declared unattended the glossary is read, never written, and an unresolved term, one the glossary lacks or one it defines in a sense the subject does not use, goes back to the caller as a vital-few question with options and a recommendation, by the rule already there.
- **`setup-skills`** gains a step between `docs/coding-standards.md` and `CLAUDE.md` that writes `docs/glossary.md` from the template below when missing and skips an existing file, reported in the report step like the others; the later steps renumber.
- **Descriptions and README rows.** The descriptions of `grill-me` and `setup-skills` gain the glossary in one clause each, keeping every trigger phrase and "never" clause; the matching README rows follow.

Template, written by both skills:

  ```markdown
  # Glossary

  One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.
  ```

Out:
- The consumer Read lines in the other skills (`add-ticket`, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill`, `add-tasks`, `complete-task`, `complete-ticket-slice`, `commit`); a later slice.
- The workflow sentence in `CLAUDE.md`, `README.md` and `setup-skills` step 4; a later slice.
- The `plugin.json` bump to `0.14.0`; the parent's last slice.
- This repo's own `docs/glossary.md` and its entries; a later slice.
- Detecting a human, a `refine-glossary` skill, rewriting other docs on a redefine, eval suites, pushing; out for the parent too.

# Acceptance criteria
- In a throwaway repo with no `docs/glossary.md`, `/jodysalt:setup-skills` creates it from the template and reports it created; a rerun reports it skipped; a repo that already has one is left untouched.
- In a throwaway repo with a vision and no `docs/glossary.md`, a person runs `/jodysalt:add-ticket` with a brief that uses one word in two senses: `grill-me` opens by naming the term among the decisions, asks it before the question that depends on it with the senses and a recommended definition, creates `docs/glossary.md` from the template, and holds the agreed `## Term` entry before the next question is asked. The close names the term among what changed.
- With a term already defined there, a second interview whose subject uses it in another sense asks keep or redefine once: *keep* leaves the entry and rewords the subject; *redefine* rewrites the entry and the close lists every other file under `docs/` using the old sense, unchanged.
- The same repo with the same brief under `/jodysalt:deliver-brief` writes nothing to `docs/glossary.md`, and the term reaches the stage's report as a vital-few question with options and a recommendation.
- `grep -l 'docs/glossary.md' skills/*/SKILL.md` matches exactly `skills/grill-me/SKILL.md` and `skills/setup-skills/SKILL.md`.
- The README rows of `grill-me` and `setup-skills` match their descriptions; `claude plugin validate skills --strict` passes; `plugin.json` still reads `0.13.1`.
- Nothing is pushed.

# Implementation notes
- **`grill-me`.** Edit `skills/grill-me/SKILL.md` in place. Step 1 gains the glossary read and the terms as open decisions after the codebase-answers sentence; step 3 gains the write-as-it-lands, the create-from-template and the keep-or-redefine question; step 5 gains the terms in the summary and the decision log; the rules gain the unattended line beside *the caller's framing decides who answers*. The glossary write is the one file edit `grill-me` makes when its subject is not a file, so say so where step 3 covers file subjects.
- **Entry shape.** `## Term` is the dedup key, as `add-tasks` dedups on H2: a redefine rewrites the section under the existing heading, a definition inserts a new section in alphabetical order, and the heading is written in the term's own case.
- **Redefine's close.** `grep -rli '<term>' docs/` minus `docs/glossary.md`; the close names the files, reads nothing further and edits none of them.
- **`setup-skills`.** Insert the step as 4 and renumber `CLAUDE.md` through Report to 5 through 8; the report line reads like the vision and coding-standards lines. The template is the one above, in a fenced block as steps 2 and 3 carry theirs.
- **Descriptions.** Frontmatter, so `--strict` checks them; one clause each, then copy the change into the README row.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -l 'docs/glossary.md' skills/*/SKILL.md` against `grill-me` and `setup-skills`; `grep -n glossary README.md` shows both rows and nothing else.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this slice's worktree: `git init`, `setup-skills` twice and once with a pre-existing glossary, a vision, then one `add-ticket` run per case above (first definition, keep, redefine) and the `deliver-brief` case.

# Rollout
- Lands on the parent `glossary` branch as one commit; no release until the parent lands with its `0.14.0` bump. Nothing breaking: a repo without a glossary behaves as today until `setup-skills` is rerun or an interview defines a term. Fallback is reverting the commit.

## Strategic fit
Advances `glossary` by delivering its producer first: after this slice a person's interview fills `docs/glossary.md`, so the consumer slices that follow have a file to read and the parent's first four acceptance criteria are met.
