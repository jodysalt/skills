---
name: add-ticket
description: Drafts a new ticket spec at `docs/tickets/open/{slug}/index.md` – one shippable change with a `type` (feat | fix | refactor | chore | docs | test | spike). Use when the user says "add a ticket for X", "create a ticket", "draft a ticket", "spec out Y", "add a fix/chore/refactor for Z", or runs `/add-ticket`. A `feat` ticket tags the bet in `docs/vision.md` it serves or, on the user's say-so, stands on its own; any ticket breaks into `{slug}--{sub}` sub-tickets of any type. A `spike` is research ending in a recommendation in `findings.md`. Never touches source code or `vision.md`.
argument-hint: "[what the ticket is for, e.g. 'scheduled posts']"
---

# Add ticket

Draft one ticket at `docs/tickets/open/{slug}/index.md`. A ticket is one shippable change; a `feat` cites exactly one bet in `docs/vision.md` with `bet:` unless the user says it stands on its own, and a `spike` may. Any ticket may be broken into sub-tickets, each a ticket of any type named `{slug}--{sub}` under an open ticket `{slug}`, to any depth.

## Ticket

$ARGUMENTS

If empty, ask what the change is.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Type.** Pick one: `feat` (adds user-visible behaviour), `fix` (corrects behaviour), `refactor` (no behaviour change), `chore` (cleanup, deps, tooling), `docs`, `test`, `spike` (research that ends in a recommendation and the tickets it implies, not code). A change too large for one backlog is still one ticket; sub-tickets are broken off with this skill as the breakdown shows the need.
3. **Bet gate (`feat` and `spike`).** Skipped for a sub-ticket, which inherits its parent's bet. Otherwise read `## Strategic bets` in `docs/vision.md`. For a `feat`: pick the bet whose exact `###` title the feature serves. If none fits, **stop before writing anything** until the user picks one of three answers: the feature stands on its own, so the ticket is drafted with no `bet:`; drop the feature after pushing back that it may not belong; or name a bet the vision should gain, which is surfaced for `jodysalt:refine-vision` while the ticket waits. For a `spike`: tag the bet that fits, or none, and continue. Other types skip this step.
4. **Read** `docs/vision.md` (for `feat`: *Product principles*, *Target users*, *Core problems*, *Non-goals*), a neighbouring ticket for tone, and for a sub-ticket each parent's `index.md` up the chain: `docs/tickets/*/{slug}/index.md` for each `--` prefix of the new slug. Also read spike findings: for a sub-ticket, `findings.md` of every `type: spike` sibling under the same parent (`docs/tickets/*/{slug}--*/`); for a `feat` that step 3 tagged, `findings.md` of every open or closed spike carrying the same `bet:`. The `# Tickets implied` there are the candidates the feat is chosen from.
5. **Slug.** Stable kebab-case describing the *what*: `scheduled-posts`, `magic-link-login`. No numeric prefix, no date, no "how". A piece broken off an open ticket gets the slug `{slug}--{sub}`, `{slug}` being that ticket's slug, itself possibly holding `--`; `docs/tickets/open/{slug}/` must exist, otherwise stop, say so and `ls docs/tickets/open/`.
6. **Write** `docs/tickets/open/{slug}/index.md` from the template for its type. Frontmatter: `title` and `type` are required; `bet` is required for a `feat` unless the user said it stands on its own, optional for a `spike` (present only when step 3 tagged one), never written on a sub-ticket, and omitted otherwise; `priority` is optional. The section bodies are prompts for the next step, not content. Every type but `spike` uses this template:

   ```markdown
   ---
   title: {Title Case Name}
   type: feat
   bet: {Exact Bet Title}
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
   How this advances its bet. Which `vision.md` principle or target-user problem it serves. What non-goal it respects. (feat tickets; a `feat` that stands on its own names the `vision.md` principle or problem it serves in place of a bet)
   ```

   A `feat` that stands on its own drops `bet:`. A sub-ticket drops `bet:` whatever its type, and a `feat` sub-ticket's `## Strategic fit` prompt is one line instead: how it advances `{slug}`, the parent carrying the trace to the vision.

   A `spike` uses this template instead. Drop `bet:` when step 3 tagged none or was skipped for a sub-ticket, and `## Strategic fit` with it:

   ```markdown
   ---
   title: {Title Case Name}
   type: spike
   bet: {Exact Bet Title}
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
   How this advances its bet. Which `vision.md` principle or target-user problem it serves. What non-goal it respects. (tagged spikes only)
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
   - Each template section is an open decision; for a `feat`, `Strategic fit` must trace to `vision.md` or, for a sub-ticket, to its parent. For a `spike`, `# Done when` is the acceptance section, and `Strategic fit` must trace to `vision.md` only when the spike is tagged.
   - The codebase, `vision.md`, any parent `index.md` and any spike `findings.md` read in step 4 count as explorable; a question they answer is never asked.
   - Edit `index.md` as answers land, and record a deferred decision as a `TODO:` marker in its section. Source code and `vision.md` stay untouched; a gap there is surfaced.

## Rules

- `Strategic fit` must trace to at least one product principle or named target-user problem in `vision.md` or, for a sub-ticket, to its parent. If it can't, push back; the feature may not belong.
- Lifecycle is the directory, so there is no `status` field. New tickets start in `open/`.
- Sub-tickets are flat: `docs/tickets/{open|closed}/{slug}--{sub}/`, never a folder inside the parent's.
- Never rewrite or delete existing tickets; they are project memory. Never touch source code or `vision.md`, and never commit.
