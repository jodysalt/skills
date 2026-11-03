---
name: refine-ticket
description: Revisits an existing open ticket at `docs/tickets/open/{slug}/index.md` and improves it in place – assesses it against the ticket template and its designs, verifies its code references against the current codebase, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X ticket", "revisit X", "flesh out the X ticket", "update the spec for X", or runs `/refine-ticket`. Makes the small related edits its answers settle – a spike's missing `findings.md`, a `delivers:` retag – without a second question, and offers to sketch a screen as a design mid-interview only when a person is driving; never moves, closes, or deletes docs, never touches source code, never commits.
argument-hint: "[ticket slug – defaults to the only open ticket or the current branch]"
---

# Refine ticket

Improve one open ticket in place: assess, interview, edit. Leave the result uncommitted.

## Ticket

$ARGUMENTS

If empty: the only directory in `docs/tickets/open/`, else the open ticket matching the current branch name, else `ls docs/tickets/open/` and ask. Confirm the pick. If the slug isn't under `open/`, stop and say so; closed tickets are project memory and don't get reworked.

## Steps

1. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts) and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:start-planning-session <description>`, the description being the ticket's slug; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Read** the ticket directory, the designs under it included – each `designs/*/README.md` for its `## Shows` and `## Verdict`, and its pages; for a `feat` or a `spike`, `docs/vision.md`, so a `delivers:` is checked against its `###` headings and a `feat`'s `Strategic fit` against the vision; and for a slug holding `--`, each parent's `index.md` up the chain, `docs/tickets/*/{parent}/index.md` for each `--` prefix of the slug. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the edits and the findings report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
3. **Verify code references**, read-only: every file path named in `# Context` and `# Implementation notes` (for a `spike`, `# Context` and `# Approach`) still exists, and the constraints, hooks, and config they describe still hold.
4. **Report findings before editing anything:**
   - `TODO:` markers.
   - Empty, skeleton, or missing sections. For a `spike`: `Question`, `Context`, `Approach` and `Done when`, plus `Strategic fit` only when `delivers:` is set. For every other type: `Goal`, `Context`, `Scope`, `Acceptance criteria`, `Implementation notes`, `Test plan`, `Rollout`, plus `Strategic fit` for `feat`.
   - A `spike` whose directory has no `findings.md`; step 6 creates it.
   - Code drift: paths that no longer exist, constraints that have changed.
   - Frontmatter: `type` outside `feat | fix | refactor | chore | docs | test | spike`; a `delivers:` whose title matches no `### ` heading in `docs/vision.md`; a `delivers:` on a sub-ticket, which inherits its parent's trace; a `--` prefix with no folder under `docs/tickets/open/`, the parent closed or never drafted.
   - Thin or untestable acceptance criteria (for a `spike`, `# Done when` is the acceptance section), a `Strategic fit` that no longer traces to `vision.md`, a `feat` sub-ticket whose `## Strategic fit` does not name its parent, a `feat` with no `delivers:` whose `## Strategic fit` names no product principle or core problem from `vision.md`, content contradicted by shipped work.
   - Designs out of step with the ticket: a design whose `## Verdict` is still `TODO:`, which `jodysalt:refine-design {name} verdict` records; a `build` design that `# Scope` and `# Acceptance criteria` never cite; a `reject` design whose screen `# Scope` still includes; and a criterion naming a screen or flow with no design under `designs/`.

   If the work is already shipped, say so and point at `jodysalt:close-ticket`. Don't close it yourself.
5. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the ticket at `docs/tickets/open/{slug}/index.md`". Give it this framing:
   - Seed the decision tree with the findings from step 4, then add the decisions the ticket makes without saying so.
   - The codebase and the ticket's designs count as explorable; a question they answer is never asked, and a recommended answer about a screen cites the design's verdict and the page that shows it.
   - Beyond `index.md`, only the related edits step 6 allows land. Source and `vision.md` stay untouched.
   - In a run not declared unattended, a question about a screen or flow whose options differ in what the user sees or does there, or one the user cannot answer in a line, carries one more option, *sketch it first*: `jodysalt:add-design` when no design under `designs/` shows the screen, `jodysalt:refine-design {name}` when one does, recommended when the other options cannot be weighed in a line. On that pick the skill is invoked in the same session – the Skill tool call, never a sub-agent – with the screen as `add-design`'s line or `{name}` as `refine-design`'s scope; when its report returns, the question is asked again with the design's verdict and what it settled as the recommended answer, and the interview carries on from there. An unattended run never sees the option; its designs stay step 7's next steps.
6. **Edit** within these constraints on top of `grill-me`'s: never invent `Goal`, acceptance criteria, or scope; ask, or leave a `TODO:` marker. A related edit that a finding or an answer settles outright, needing no decision of its own, is made on the spot and named in the report rather than raised as a second question or left to another skill: a spike's missing `findings.md`, created beside `index.md` holding exactly the three prompt headings `# Findings`, `# Recommendation` and `# Tickets implied`; and a `delivers:` retag the interview decides, to the exact title of a `###` heading in `docs/vision.md`. Anything more in `vision.md` or a parent ticket is surfaced for `jodysalt:refine-vision` or a `refine-ticket` run on the parent.
7. Stop. The commit `grill-me`'s close suggests is a `docs:` commit. Then name the next steps in order: `/jodysalt:add-design` for each screen or flow a criterion names that still has no design under `designs/` once the interview is over, named here and never run; on a planning branch, land it with `jodysalt:wrap-up-worktree`; then `/jodysalt:complete-ticket {slug}` when the ticket has no `tasks.md` yet or pending tasks.
