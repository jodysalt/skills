---
name: add-tasks
description: Appends task entries to a ticket's `tasks.md` at `docs/tickets/open/{slug}/tasks.md` – the backlog the Ralph loop (`complete-tasks`) works through one fresh session at a time – creating the file on first use. Use when the user says "add tasks for docs/tickets/open/X/index.md", "break this ticket into tasks", "generate the Ralph backlog for X", or runs `/add-tasks`. The source is a ticket only. Every entry is self-contained and selectively verified, and the ticket's list ends with one full-suite gate. Strictly append-only; never edits, reorders, or implements.
argument-hint: "[ticket slug or path – defaults to the current branch's ticket or the only open ticket]"
---

# Add tasks

Append entries to the ticket's `tasks.md`, beside its `index.md`. The Ralph loop picks the first `pending` entry and implements it in a fresh session with no chat context, so every entry must stand alone.

## Ticket

$ARGUMENTS

A slug, a `docs/tickets/open/{slug}` directory, or any file inside it, reduced to the slug. If empty: the open ticket named by the current branch, else the only directory in `docs/tickets/open/`, else `ls docs/tickets/open/` and ask. Confirm the pick. Stop if the branch or the argument names a closed ticket; closed tickets take no new work. Anything else – a verbal description, an arbitrary file, an issue URL, pasted text – is not a source: offer to invoke `jodysalt:add-ticket` first.

## Steps

1. **Read** `docs/tickets/open/{slug}/index.md` and, when it carries `initiative:`, the initiative file too, so entries serve the outcome and not just the ticket text. Then read `docs/tickets/open/{slug}/tasks.md` in full if it exists; existing headings are needed for dedup. If it doesn't, create it holding exactly `# Tasks` followed by one newline.
2. **Draft entries** in this shape:

   ```markdown
   ## Task description here
   - **category:** functional | non-functional | bug | chore
   - **status:** pending
   - **steps:**
     - Verification step 1
     - Verification step 2
   ```

   - **Heading:** specific enough that a fresh agent can implement it from the heading and bullets alone. Inline file paths, symbols, and acceptance criteria; never "as discussed" or "per the ticket". The sibling `index.md` is context, not a substitute.
   - **Granularity:** one Ralph iteration each, no mid-way decisions. Split anything that would span several commits.
   - **Order:** independent where possible; when B needs A, A comes first. The loop consumes top-down.
   - **category:** `functional` (user-visible behaviour), `non-functional` (perf, security, infra, observability), `bug`, `chore` (cleanup, docs, refactors, deps). No others.
   - **status:** always `pending`.
   - **steps:** the narrowest checks that catch this change's likely regressions – the 20% of checks that cover 80% of the risk. Prefer one scoped test script from the repo's `package.json` (`npm run test:unit`, `test:e2e`, and so on) over several; a grep for a symbol, a type-check, or a single-URL assertion can stand in. Never zero steps. Never the full suite. Never two test commands in one step.

3. **Completion gate.** After the implementation tasks, append exactly one:

   ```markdown
   ## Run full test suite for {slug}
   - **category:** chore
   - **status:** pending
   - **steps:**
     - Run the full test suite (`npm run test`) and confirm every suite passes.
   ```

   Skip it when no task touches code, config, or tests (docs-only work, specs, research notes, a ticket whose `index.md` has `type: spike`). Make the last task a review of the output against the ticket's acceptance criteria instead, and say the gate was skipped and why.

   A `type: spike` ticket ships no code, so in place of implementation tasks and the gate it gets this fixed shape: one `chore` research task per item in the ticket's `# Approach`, each writing what it finds under `# Findings` in `docs/tickets/open/{slug}/findings.md`, with that path inlined in its heading; then one `chore` task that writes `# Recommendation` and `# Tickets implied` in the same file from the findings; then the review task, against the ticket's `# Done when`, in place of the gate, with the report saying the gate was skipped because a spike ships no code. A spike has no time box, so the task count is what bounds the research.

4. **Dedup** by H2 heading against existing entries, gate included. Append only the net-new entries to the end of the ticket's `tasks.md`.
5. **Report** a numbered list of the entries appended and any duplicates skipped. Don't commit, and don't start implementing.

## Rules

- Append-only: never edit, reorder, or remove existing entries, and never change a `status`; the loop owns transitions.
- Touches nothing but the ticket's `tasks.md`.
