---
name: add-initiative
description: Drafts a new initiative spec at `docs/initiatives/open/{slug}.md` – a strategic push that bridges `docs/vision.md` to feature tickets. Use when the user says "add an initiative for X", "create an initiative", "spec out a strategic push", runs `/add-initiative`, or when `add-ticket` finds no initiative to tag a feature with. A single shippable change is a ticket, not an initiative. Adds a new bet's section to `vision.md` when the user names one and otherwise leaves it alone; never creates tickets or ticket folders.
argument-hint: "[what the initiative is about, e.g. 'creator onboarding']"
---

# Add initiative

Draft one initiative at `docs/initiatives/open/{slug}.md`. An initiative turns direction from `docs/vision.md` into a focused bet that `feat` tickets roll up under.

## Initiative

$ARGUMENTS

If empty, ask what the initiative is about.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Read** `docs/vision.md` (*Strategic bets* and *Product principles*) and `ls docs/initiatives/*/`.
3. **Sanity gate.** Stop and redirect if any check fails:
   - It spans several `feat` tickets with one user-visible outcome. One shippable change is a ticket: offer to invoke `jodysalt:add-ticket` with the same description.
   - It maps to a strategic bet in `vision.md`. If none fits, push back once: either the user names a new bet, which step 6 adds to `vision.md` from the answers that land, or the initiative doesn't belong. Don't send them to `jodysalt:refine-vision` first for one bet.
   - No open initiative already covers it. If one does, offer to invoke `jodysalt:refine-initiative` on it instead.
4. **Slug.** Stable kebab-case naming the *outcome*, not the mechanism: `creator-onboarding`, not `onboarding-wizard-project` or `q2-work`. No numeric prefix, no date.
5. **Write** the file from this template. The section bodies are prompts for the next step, not content.

   ```markdown
   ---
   title: {Title Case Name}
   started: {today, YYYY-MM-DD}
   ---

   ## Outcome
   The user-visible result this initiative is trying to produce.

   ## Why now
   What changed, what constraint or opportunity makes this the moment. Name the strategic bet from `vision.md` by its exact title.

   ## Success metrics
   How we'll know it worked. Concrete where possible.

   ## Non-goals
   What this initiative is explicitly not trying to fix.

   ## Tickets
   - (feature tickets get appended here by the add-ticket skill as they're drafted)
   ```

6. **Fill it in** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the initiative being drafted at `docs/initiatives/open/{slug}.md`". Give it this framing:
   - Each template section above `## Tickets` is an open decision; `## Why now` names its strategic bet by exact title.
   - `vision.md` and the codebase count as explorable; a question they answer is never asked.
   - Edit the initiative file as answers land, and record a deferred decision as a `TODO:` marker in its section. When step 3 settled on a new bet, add its `### {Title}` section under `## Strategic bets` in `vision.md` once `## Outcome` and `## Why now` have landed – what the bet changes, why now and what success looks like, a few lines drawn from those answers, keeping one `###` per bet – and say so. Any other `vision.md` change is surfaced for `jodysalt:refine-vision`, never made.
7. Confirm the path. If `add-ticket` escalated here, hand control back to it.

## Rules

- Lifecycle is the directory, so there is no `status` field. Closing is a later `git mv` to `closed/`.
- Initiatives are virtual: never create `docs/tickets/{initiative-slug}/`. Tickets live flat under `docs/tickets/{open|closed}/` and point up with an `initiative:` tag.
- Don't forecast an end date. Initiatives are open-ended; each iteration inside one should be as short as possible.
- `vision.md` changes only by gaining the new bet's section; never rewrite what is there. Never create tickets or commit.
