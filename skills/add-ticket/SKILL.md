---
name: add-ticket
description: Drafts a new ticket spec at `docs/tickets/open/{slug}/index.md` – one shippable change with a `type` (feat | fix | refactor | chore | docs | test | spike). Use when the user says "add a ticket for X", "create a ticket", "draft a ticket", "spec out Y", "add a fix/chore/refactor for Z", or runs `/add-ticket`. A `feat` ticket tags the open initiative that fits or, with none and the user's say-so, stands on its own. A `spike` is research ending in a recommendation in `findings.md`. Never touches source code or `vision.md`.
argument-hint: "[what the ticket is for, e.g. 'scheduled posts']"
---

# Add ticket

Draft one ticket at `docs/tickets/open/{slug}/index.md`. A ticket is one shippable change; a `feat` ticket tags exactly one initiative unless the user says it stands on its own, and a `spike` may tag one.

## Ticket

$ARGUMENTS

If empty, ask what the change is.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Type.** Pick one: `feat` (adds user-visible behaviour), `fix` (corrects behaviour), `refactor` (no behaviour change), `chore` (cleanup, deps, tooling), `docs`, `test`, `spike` (research that ends in a recommendation and the tickets it implies, not code). A strategic, multi-ticket push is an initiative: stop and offer to invoke `jodysalt:add-initiative` with the same description.
3. **Initiative gate (`feat` and `spike`).** For a `feat`: `ls docs/initiatives/open/` and pick the initiative this feature serves. If none fits, **stop before writing anything** until the user picks one of three answers: invoke `jodysalt:add-initiative` and resume afterwards; drop the feature after pushing back that it may not belong; or, when the user says the feature stands on its own, draft the ticket with no `initiative:`. For a `spike`: `ls docs/initiatives/open/` and tag the open initiative that fits; if none fits, tag none and continue, never escalating to `jodysalt:add-initiative`. Other types skip this step.
4. **Read** `docs/vision.md` (for `feat`: *Product principles*, *Target users*, *Core problems*, *Non-goals*), the chosen initiative file (for a `feat` or a `spike` that step 3 tagged), and a neighbouring ticket for tone. For a `feat` that step 3 tagged, also read `findings.md` of every ticket in the chosen initiative's `## Tickets` list whose `index.md` has `type: spike`, open or closed: the list holds the live path, so `docs/tickets/closed/{slug}/findings.md` counts. The `# Tickets implied` there are the candidates the feat is chosen from.
5. **Slug.** Stable kebab-case describing the *what*: `scheduled-posts`, `magic-link-login`. No numeric prefix, no date, no "how".
6. **Write** `docs/tickets/open/{slug}/index.md` from the template for its type. Frontmatter: `title` and `type` are required; `initiative` is required for `feat` unless the user said it stands on its own, optional for `spike` (present only when step 3 tagged one) and omitted otherwise; `priority` is optional. The section bodies are prompts for the next step, not content. Every type but `spike` uses this template:

   ```markdown
   ---
   title: {Title Case Name}
   type: feat
   initiative: {initiative-slug}
   priority: high
   ---

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
   How this advances its initiative. Which `vision.md` principle or target-user problem it serves. What non-goal it respects. (feat tickets; a `feat` that stands on its own names the `vision.md` principle or problem it serves in place of an initiative)
   ```

   A `feat` that stands on its own drops `initiative:`.

   A `spike` uses this template instead. Drop `initiative:` when step 3 tagged none, and `## Strategic fit` with it:

   ```markdown
   ---
   title: {Title Case Name}
   type: spike
   initiative: {initiative-slug}
   priority: high
   ---

   # Question
   The one question, and what hangs on its answer.

   # Context
   What the repo and the docs already say.

   # Approach
   What to read, try or measure, and what is out of the research.

   # Done when
   `findings.md` holds a recommendation and the tickets it implies.

   ## Strategic fit
   How this advances its initiative. Which `vision.md` principle or target-user problem it serves. What non-goal it respects. (tagged spikes only)
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

7. **Fill it in** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the ticket being drafted at `docs/tickets/open/{slug}/index.md`". Give it this framing:
   - Each template section is an open decision; for a `feat`, `Strategic fit` must trace to `vision.md`. For a `spike`, `# Done when` is the acceptance section, and `Strategic fit` must trace to `vision.md` only when the spike is tagged.
   - The codebase, the initiative, `vision.md`, and any spike `findings.md` read in step 4 count as explorable; a question they answer is never asked.
   - Edit only `index.md` as answers land, and record a deferred decision as a `TODO:` marker in its section.
8. **`feat` or `spike` with `initiative:`:** append `docs/tickets/open/{slug}/index.md` to the initiative's `## Tickets` list, dropping the template placeholder bullet if it is still there. Don't reorder the list.

## Rules

- `Strategic fit` must trace to at least one product principle or named target-user problem in `vision.md`. If it can't, push back; the feature may not belong.
- Lifecycle is the directory, so there is no `status` field. New tickets start in `open/`.
- Initiatives are virtual: never create `docs/tickets/{initiative-slug}/`.
- Never rewrite or delete existing tickets; they are project memory. Never touch source code or `vision.md`, and never commit.
