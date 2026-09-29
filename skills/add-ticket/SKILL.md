---
name: add-ticket
description: Drafts a new ticket spec at `docs/tickets/open/{slug}/index.md` – one shippable change with a `type` (feat | fix | refactor | chore | docs | test). Use when the user says "add a ticket for X", "create a ticket", "draft a ticket", "spec out Y", "add a fix/chore/refactor for Z", or runs `/add-ticket`. A `feat` ticket must tag an existing initiative; with none to tag it escalates to `add-initiative` before writing anything. Never touches source code or `vision.md`.
argument-hint: "[what the ticket is for, e.g. 'scheduled posts']"
---

# Add ticket

Draft one ticket at `docs/tickets/open/{slug}/index.md`. A ticket is one shippable change; a `feat` ticket rolls up under exactly one initiative.

## Ticket

$ARGUMENTS

If empty, ask what the change is.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Type.** Pick one: `feat` (adds user-visible behaviour), `fix` (corrects behaviour), `refactor` (no behaviour change), `chore` (cleanup, deps, tooling), `docs`, `test`. A strategic, multi-ticket push is an initiative: stop and offer to invoke `jodysalt:add-initiative` with the same description.
3. **Initiative gate (`feat` only).** `ls docs/initiatives/open/` and pick the initiative this feature serves. If none fits, **stop before writing anything**: offer to invoke `jodysalt:add-initiative` and resume afterwards, or push back that the feature may not belong. Other types skip this step.
4. **Read** `docs/vision.md` (for `feat`: *Product principles*, *Target users*, *Core problems*, *Non-goals*), the chosen initiative file, and a neighbouring ticket for tone.
5. **Slug.** Stable kebab-case describing the *what*: `scheduled-posts`, `magic-link-login`. No numeric prefix, no date, no "how".
6. **Write** `docs/tickets/open/{slug}/index.md` from this template. Frontmatter: `title` and `type` are required; `initiative` is required for `feat` and omitted otherwise; `priority` is optional. The section bodies are prompts for the next step, not content.

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
   How this advances its initiative. Which `vision.md` principle or target-user problem it serves. What non-goal it respects. (feat tickets)
   ```

7. **Fill it in** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the ticket being drafted at `docs/tickets/open/{slug}/index.md`". Give it this framing:
   - Each template section is an open decision; for a `feat`, `Strategic fit` must trace to `vision.md`.
   - The codebase, the initiative, and `vision.md` count as explorable; a question they answer is never asked.
   - Edit only `index.md` as answers land, and record a deferred decision as a `TODO:` marker in its section.
8. **`feat` only:** append `docs/tickets/open/{slug}/index.md` to the initiative's `## Tickets` list, dropping the template placeholder bullet if it is still there. Don't reorder the list.

## Rules

- `Strategic fit` must trace to at least one product principle or named target-user problem in `vision.md`. If it can't, push back; the feature may not belong.
- Lifecycle is the directory, so there is no `status` field. New tickets start in `open/`.
- Initiatives are virtual: never create `docs/tickets/{initiative-slug}/`.
- Never rewrite or delete existing tickets; they are project memory. Never touch source code or `vision.md`, and never commit.
