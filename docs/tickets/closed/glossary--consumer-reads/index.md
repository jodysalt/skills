---
title: Consumer Reads
type: feat
priority: high
---

# Goal
The glossary's consumers, end to end. Every skill that writes project prose or implements from it reads `docs/glossary.md` before producing output and uses each defined term in its defined sense, so a ticket, its backlog, its implementation and its commit message stop drifting on language. After this slice a term a person defined through `grill-me` reaches every ticket `add-ticket` drafts, every task `add-tasks` writes, every change `complete-task` makes and every message `commit` writes, with no second definition made in passing.

# Context
- Parent: `docs/tickets/closed/glossary/index.md`. This slice moves its two consumer criteria: `add-ticket`, `add-tasks` and `complete-task` each read the glossary before writing and use the term in its defined sense, a missing or template-only file proceeding without error; and `grep -l 'docs/glossary.md' skills/*/SKILL.md` matches exactly the consumer set plus `setup-skills`.
- Already landed by `docs/tickets/closed/glossary--grill-me-terms/index.md`: `grill-me` step 1 reads the glossary and asks ambiguous terms, step 3 writes each agreed `## Term` entry as it lands, creating the file from the template when missing, and its rules keep an unattended run read-only; `setup-skills` step 4 scaffolds the same template. So `grill-me` and `setup-skills` already match the grep, and the interview skills that invoke `grill-me` already get the terms asked; what they lack is the read for their own writes before and around the interview.
- Each consumer's Read step, at plugin `0.13.1`, where the one line goes:
  - `skills/add-ticket/SKILL.md` step 4 **Read**: `docs/vision.md`, a neighbouring ticket, the parent chain, spike findings.
  - `skills/refine-ticket/SKILL.md` step 2 **Read**: the ticket directory, `docs/vision.md`, the parent chain.
  - `skills/refine-vision/SKILL.md` step 2 **Explore before asking**: `README.md`, the manifest, everything under `docs/`, the log, open tickets, then `docs/vision.md`.
  - `skills/refine-coding-standards/SKILL.md` step 2 **Explore before asking**: `CLAUDE.md`, the manifest, linter configs, the log, sampled sources, then `docs/coding-standards.md`.
  - `skills/add-skill/SKILL.md` step 2 **Read**: `CLAUDE.md` and one or two existing skills for tone.
  - `skills/add-tasks/SKILL.md` step 1 **Read**: the ticket, the parent chain, sibling sub-tickets, the existing `tasks.md`.
  - `skills/complete-task/SKILL.md` step 2 **Read**: the entry's steps, category and notes, the sibling `index.md`, the parent chain, `CLAUDE.md`.
  - `skills/complete-ticket-slice/SKILL.md` step 3 **Judge**: the parent's criteria, every sub-ticket, the parent's `tasks.md`, the repo; it writes the verdicts and names the pick's `{sub}`.
  - `skills/commit/SKILL.md` step 1: `git status`, `git diff` and `git diff --staged` in parallel, before step 4 decides what the message says.
- `complete-task` runs unattended and makes only the edits its task names, so its glossary read is read-only by construction; no rule is needed to say so.
- Descriptions are frontmatter gated by `claude plugin validate skills --strict`, and `README.md` holds one row per skill matching its description. The parent's criteria ask nothing of the consumers' descriptions, so none changes here and no README row moves.
- `refine-vision` step 2 already reads everything under `docs/`, which includes `docs/glossary.md` when it exists; the line still goes in, so the file is named, the use rule is stated and the grep matches.
- This repo has no `docs/glossary.md`; its entries are the parent's last slice. Every consumer therefore treats this repo's glossary as empty for now.

# Scope

In:
- **One line per consumer Read step.** Each of `add-ticket` (step 4), `refine-ticket` (step 2), `refine-vision` (step 2), `refine-coding-standards` (step 2), `add-skill` (step 2), `add-tasks` (step 1), `complete-task` (step 2), `complete-ticket-slice` (step 3) and `commit` (step 1) gains one sentence in that step: read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in everything written, never redefining one in passing; a term the glossary lacks is used as the input uses it. The sentence is phrased for the skill's own output: the ticket and its report for `add-ticket` and `refine-ticket`, the vision for `refine-vision`, the standards for `refine-coding-standards`, the skill file for `add-skill`, the task headings and steps for `add-tasks`, the code, notes and report for `complete-task`, the verdicts and the pick for `complete-ticket-slice`, the subject and body for `commit`.
- **Read-only everywhere.** No consumer writes the glossary; `grill-me` is the only writer, and the interview skills reach it through their existing `grill-me` invocation. `complete-task`'s line is read-only by construction, since the worker edits only what its task names.
- **The interview skills' `grill-me` framing stays as it is.** `grill-me` already reads the glossary in its step 1 and asks the terms; the consumer line covers what the skill writes itself, before and after the interview, and the file it fills as answers land.

Out:
- `grill-me` and `setup-skills`; both landed in `glossary--grill-me-terms` and already match the grep.
- The workflow sentence in `CLAUDE.md`, `README.md` and `setup-skills` step 4; the parent's last slice.
- The `plugin.json` bump to `0.14.0`; the parent's last slice.
- This repo's own `docs/glossary.md` and its entries (`driver`, `unattended`); the parent's last slice.
- Any change to a consumer's description or README row; the parent's criteria ask none, and a line in a step body is not a description change.
- The git and worktree skills, `close-ticket` and the orchestrators `complete-ticket`, `complete-tasks` and `deliver-brief`; they write no project prose of their own, so they gain no mention of the glossary and stay out of the grep.
- Detecting a human, a `refine-glossary` skill, rewriting other docs on a redefine, eval suites, pushing; out for the parent too.

# Acceptance criteria
- `grep -l 'docs/glossary.md' skills/*/SKILL.md` prints exactly these eleven paths and no other: `skills/add-skill/SKILL.md`, `skills/add-tasks/SKILL.md`, `skills/add-ticket/SKILL.md`, `skills/commit/SKILL.md`, `skills/complete-task/SKILL.md`, `skills/complete-ticket-slice/SKILL.md`, `skills/grill-me/SKILL.md`, `skills/refine-coding-standards/SKILL.md`, `skills/refine-ticket/SKILL.md`, `skills/refine-vision/SKILL.md`, `skills/setup-skills/SKILL.md`.
- In each consumer the mention sits in the named step and nowhere else in the file: `add-ticket` step 4, `refine-ticket` step 2, `refine-vision` step 2, `refine-coding-standards` step 2, `add-skill` step 2, `add-tasks` step 1, `complete-task` step 2, `complete-ticket-slice` step 3, `commit` step 1; `grep -n 'docs/glossary.md'` on each file prints one line, the line of that step.
- Each consumer's line says all four things: the file is read when it exists; a missing or template-only file counts as an empty glossary; each defined term is used in its defined sense in what the skill writes, never redefined in passing; a term the glossary lacks is used as the input uses it.
- No consumer's line writes, creates or edits `docs/glossary.md`; `grep -n 'glossary' skills/complete-task/SKILL.md` shows a read only.
- In a throwaway repo with a vision and a `docs/glossary.md` defining one term in a sense that differs from everyday use, `/jodysalt:add-ticket` with a brief using that term drafts a ticket that uses it in the glossary's sense without asking what it means; `/jodysalt:add-tasks` on that ticket writes task headings and steps in that sense; `/jodysalt:complete-task` on the first task names the thing in that sense in its code, notes and report, and the commit message `commit` writes uses it the same way.
- The same three runs in a repo with no `docs/glossary.md`, and again in one holding only the template, proceed without an error or a question about the file.
- Every skill's frontmatter is byte-for-byte what it was: `git diff --stat` shows only the nine consumer `SKILL.md` files, and `git diff` touches no `description:` line. `README.md` is unchanged.
- `claude plugin validate skills --strict` passes; `plugin.json` still reads `0.13.1`.
- Nothing is pushed.

# Implementation notes
- **Edit each `SKILL.md` in place**, one sentence appended to the named step's paragraph in the voice `grill-me` step 1 already uses: "Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in {what this skill writes}, never redefining one in passing; a term the glossary lacks is used as the input uses it." Vary only the `{what this skill writes}` clause per skill, so the nine lines read as one rule.
- **`add-ticket` step 4** names the ticket and its `## Strategic fit`; the terms then reach `grill-me` through step 7's framing unchanged, since `grill-me` reads the file itself.
- **`refine-ticket` step 2** names the edits and the findings report; a ticket that uses a term in another sense is a finding for step 4 and a keep-or-redefine question `grill-me` already asks, never a silent rewrite.
- **`refine-vision` and `refine-coding-standards` step 2** add the glossary beside the files already explored, before the file the skill fills; the line names the vision or the standards as what is written in the terms.
- **`add-skill` step 2** names the skill file's description, steps and rules.
- **`add-tasks` step 1** names the task headings and steps; the H2 heading is the dedup key, so a heading in the glossary's sense is also the stable one.
- **`complete-task` step 2** names the code, the hand-over notes and the report; add it after `CLAUDE.md` in the same sentence. The worker's step 4 edits only what the task names, so nothing more is needed to keep the glossary read-only.
- **`complete-ticket-slice` step 3** names the verdicts, the evidence and the `{sub}` name, so the judge and the pick use the terms before step 4's sub-agent reads the glossary again through `add-ticket`.
- **`commit` step 1** reads the glossary alongside `git status` and the diffs, naming the subject and body as what uses the terms; step 4's 80/20 pass then has the terms in hand.
- **Grep discipline.** The literal `docs/glossary.md` appears once per consumer file and in no other skill; any further reference inside a consumer says "the glossary", so the one-line criterion holds.
- No description, README row or `plugin.json` edit.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -l 'docs/glossary.md' skills/*/SKILL.md` against the eleven paths above; `grep -c 'docs/glossary.md' skills/*/SKILL.md` prints 1 for each consumer and 0 elsewhere; `grep -n 'docs/glossary.md'` on each of the nine consumer files lands on the named step.
- `git diff -U0 skills/ | grep '^[-+]description:'` prints nothing; `git diff --stat` lists nine files and no `README.md`.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this slice's worktree: `git init`, `setup-skills`, a vision, a `docs/glossary.md` defining one term in a non-everyday sense; then `add-ticket`, `add-tasks` and `complete-task` with a brief using that term, checking the ticket, the task headings and the commit message; then the same three with the glossary deleted, and with it holding the template only.

# Rollout
- Lands on the parent `glossary` branch as one commit; no release until the parent lands with its `0.14.0` bump. Nothing breaking: a repo without a glossary behaves as today, since every line treats a missing file as empty. Fallback is reverting the commit.

## Strategic fit
Advances `glossary` by closing the loop the producer slice opened: a term a person defined through `grill-me` now reaches every ticket, backlog, implementation and commit message, so the parent's two consumer criteria are met and only the steering clause, this repo's own entries and the version bump remain.
