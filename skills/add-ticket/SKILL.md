---
name: add-ticket
description: Drafts a new ticket spec at `docs/tickets/open/{slug}/index.md` – one shippable change with a `type` (feat | fix | refactor | chore | docs | test | spike) – carrying its brief, the input and what the conversation established, then hands off to `refine-ticket`, which interviews and fills it in, now or in a later session when the user would rather just capture the idea. Use when the user says "add a ticket for X", "create a ticket", "draft a ticket", "jot down a ticket for X", "spec out Y", "add a fix/chore/refactor for Z", or runs `/add-ticket`. A `feat` ticket names the goal in `docs/vision.md` it delivers with `delivers:` or stands on a principle; any ticket breaks into `{slug}--{sub}` sub-tickets of any type. A `spike` is research ending in a recommendation in `findings.md`. Never touches source code or `vision.md`, never commits.
argument-hint: "[what the ticket is for, e.g. 'scheduled posts']"
---

# Add ticket

Draft one ticket at `docs/tickets/open/{slug}/index.md` from the template for its type, its `# Brief` holding everything the refine needs, then hand off to `refine-ticket`, which interviews and fills it in, now or in a later session when the user would rather just capture the idea.

## Ticket

$ARGUMENTS

If empty, ask what the change is.

## Steps

1. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session <description>`, the description being a short kebab-case phrase for the ticket's subject, two to four words, taken from the input above, since the slug is not picked until step 5 (`glossary terms` becomes `glossary-terms`); on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Type.** Pick one: `feat` (adds user-visible behaviour), `fix` (corrects behaviour), `refactor` (no behaviour change), `chore` (cleanup, deps, tooling), `docs`, `test`, `spike` (research that ends in a recommendation and the tickets it implies, not code). A change too large for one backlog is still one ticket; sub-tickets are broken off with this skill as the breakdown shows the need.
3. **Goal gate (`feat` and `spike`).** Skipped for a sub-ticket, which inherits its parent's trace. Otherwise read every `###` heading in `docs/vision.md`. For a `feat`: pick the goal whose exact title the feature delivers. If none fits but a product principle or core problem does, draft with no `delivers:` and name it in `## Strategic fit`. If neither fits, draft with no `delivers:` and say so in `# Brief`, so `refine-ticket` asks whether the feature belongs; no question is asked here, and nothing stops. For a `spike`: tag the goal that fits, or none, and continue. Other types skip this step.
4. **Read** `docs/vision.md` (for `feat`: *Product principles*, *Target users*, *Core problems*, *Non-goals*), a neighbouring ticket for tone, and for a sub-ticket each parent's `index.md` up the chain, `docs/tickets/*/{slug}/index.md` for each `--` prefix of the new slug, with each parent's designs – its `# Designs`, one bullet per design naming `designs/{name}/`, what it shows and its verdict, and the pages under `designs/` – since a `build` design is the spec of the screen a slice builds and a `reject` one is what it leaves out. Also read spike findings: for a sub-ticket, `findings.md` of every `type: spike` sibling under the same parent (`docs/tickets/*/{slug}--*/`); for a `feat` that step 3 tagged, `findings.md` of every open or closed spike carrying the same `delivers:`. The `# Tickets implied` there are the candidates the feat is chosen from. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the ticket and its `## Strategic fit`, never redefining one in passing; a term the glossary lacks is used as the input uses it.
5. **Slug.** Stable kebab-case describing the *what*: `scheduled-posts`, `magic-link-login`. No numeric prefix, no date, no "how". A piece broken off an open ticket gets the slug `{slug}--{sub}`, `{slug}` being that ticket's slug, itself possibly holding `--`; `docs/tickets/open/{slug}/` must exist, otherwise stop, say so and `ls docs/tickets/open/`.
6. **Write** `docs/tickets/open/{slug}/index.md` from the template for its type. Frontmatter: `title` and `type` are required; `delivers` is present on a `feat` when step 3 picked a goal, optional for a `spike` (present only when step 3 tagged one), never written on a sub-ticket, and omitted otherwise; `priority` is optional. The section bodies are prompts for the next step, not content, except `# Brief`, which the write fills: the line from `## Ticket` verbatim, then what the conversation established about the change – the problem, the approach, the code paths, constraints and decisions named – as said, not interpreted, then the path of each spike `findings.md` and each parent design step 4 read, one per line, when any. The brief is how the input reaches `refine-ticket` whether it runs now or in a later session, so nothing the refine needs is left in the conversation. Every type but `spike` uses this template:

   ```markdown
   ---
   title: {Title Case Name}
   type: feat
   delivers: {Exact Goal Title}
   priority: high
   ---

   # Brief
   The input verbatim, what the conversation established, and the paths of the findings and designs read.

   # Goal
   What user outcome are we trying to create?

   # Context
   Relevant code paths, constraints, prior decisions, links.

   # Scope
   What is in and out.

   # Acceptance criteria
   - ...

   # Implementation notes
   Suggested files, APIs, migration concerns.

   # Test plan
   Unit / integration / manual checks.

   # Rollout
   Flags, migrations, monitoring, fallback.

   ## Strategic fit
   What it delivers toward its goal, or the principle or core problem it stands on. What non-goal it respects. (feat tickets)
   ```

   A `feat` with no goal drops `delivers:`. A sub-ticket drops `delivers:` whatever its type, and a `feat` sub-ticket's `## Strategic fit` prompt is one line instead: how it advances `{slug}`, the parent carrying the trace to the vision.

   A `spike` uses this template instead. Drop `delivers:` when step 3 tagged none or was skipped for a sub-ticket, and `## Strategic fit` with it:

   ```markdown
   ---
   title: {Title Case Name}
   type: spike
   delivers: {Exact Goal Title}
   priority: high
   ---

   # Brief
   The input verbatim, what the conversation established, and the paths of the findings and designs read.

   # Question
   The one question, and what hangs on its answer.

   # Context
   What the repo and the docs already say.

   # Approach
   What to read, try or measure, and what is out of the research.

   # Done when
   `findings.md` holds a recommendation and the tickets it implies.

   ## Strategic fit
   What it delivers toward its goal, or the principle or core problem it stands on. What non-goal it respects. (tagged spikes only)
   ```

   For a `spike`, also write `docs/tickets/open/{slug}/findings.md` beside `index.md`, holding exactly these three prompt headings, so the loop fills a file rather than inventing one:

   ```markdown
   # Findings
   What the research found.

   # Recommendation
   The one recommendation, and why.

   # Tickets implied
   The tickets it implies, one bullet each with a type and a one-line goal.
   ```

7. **Now or later.** Ask one question with `AskUserQuestion`: refine the ticket now, recommended, or later, when the idea is down and the interview can wait for another session. An input that already answers it – "just capture it", "refine later" – is taken as the answer and nothing is asked. In a run framed as unattended the recommendation stands and nothing is asked. On *now*, step 8 then step 9; on *later*, step 9 alone.
8. **Hand off.** Invoke the `refine-ticket` skill from this plugin (`jodysalt:refine-ticket`) with `{slug}` in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "this is a fresh boilerplate". The input and the findings reach the interview through the ticket's `# Brief`; `refine-ticket` reads it there, reports every template prompt the write left, and asks for each, landing the answers as edits to the template. A caller that framed this run as unattended is passed on in the same framing, so the interview's vital few come back the same way.
9. **Report.** On *now*, before the hand-off's own report, in the turn that invokes it, so the user sees what was drafted even when the interview stops early: the path written, its `type`, its `delivers:` or the principle its `## Strategic fit` will stand on, and for a `spike` the `findings.md` beside it. Say that everything is uncommitted and that `refine-ticket`'s report follows with the interview's result and the next steps; the commit suggestion is its. On *later*, the same, then that the ticket holds its brief and every template prompt, that `/jodysalt:refine-ticket {slug}` picks it up in any session, and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Lifecycle is the directory, so there is no `status` field. New tickets start in `open/`.
- Sub-tickets are flat: `docs/tickets/{open|closed}/{slug}--{sub}/`, never a folder inside the parent's.
