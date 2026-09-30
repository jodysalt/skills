---
title: Spike Ticket Type
type: feat
initiative: hands-off-delivery
priority: high
---

# Goal
A user, or jarvis's judge, drafts a `spike` when the next ticket is unclear: a research ticket with one question, an approach, and a `findings.md` beside its `index.md` that ends in a recommendation and the tickets it implies. It runs through the same loop and closes like any ticket, so a decision that needs facts gets them written down before a `feat` is drafted against guesses.

# Context
- The initiative's second ticket, and the one the `jarvis` ticket waits on: its judge picks a spike when it cannot tell which ticket moves the metrics or the brief needs facts the repo does not hold, and a spike's findings are the next ticket stage's input.
- No time box, though the initiative names one. A worker cannot watch a clock, so a number in the frontmatter would be a wish in an unattended run, and the task list already bounds the research. The initiative's wording is left for `refine-initiative`.
- Ticket types today are `feat | fix | refactor | chore | docs | test`, enumerated in `add-ticket`'s description and step 2, `refine-ticket`'s frontmatter check, and the README's `add-ticket` row. `add-ticket` has one template for every type, and `refine-ticket` checks the same seven sections whatever the type.
- `add-tasks` already skips the full-suite gate when no task touches code and ends with a review task against the acceptance criteria; it names research notes by example, not spikes by type. `complete-task`, `complete-tasks`, `wrap-up-ticket` and `close-ticket` are type-agnostic: the loop implements whatever the tasks say, and the close moves the folder whole, so `findings.md` travels with it.

# Scope

In:
- `initiative:` is optional on a spike. A spike tags the initiative it serves when there is one and `add-ticket` appends it to that initiative's `## Tickets` list, as it does for a `feat`; with none it stands alone and skips the initiative gate. Jarvis's judge always tags, since spikes only arise on the initiative path; a person with a standalone research question never has to invent an initiative first.
- A short bespoke template in `add-ticket`, used when the type is `spike`: `# Question`, the one question and what hangs on its answer; `# Context`, what the repo and the docs already say; `# Approach`, what to read, try or measure, and what is out of the research; `# Done when`, `findings.md` holds a recommendation and the tickets it implies; and `## Strategic fit` only when the spike tags an initiative. No Test plan or Rollout, since nothing ships. `refine-ticket` checks a spike against these sections, not the feat template's.
- `add-ticket` writes `findings.md` beside `index.md` at draft time, holding three prompt headings, `# Findings`, `# Recommendation` and `# Tickets implied`, so the loop fills a file rather than inventing one and `refine-ticket` can flag its absence.
- `add-tasks` names `type: spike` as docs-only work and gives it a fixed shape: one research task per item in `# Approach`, one task that writes the recommendation and the tickets implied, then the review task against `# Done when` in place of the gate. The task count is what bounds the research.
- When `add-ticket` drafts a `feat` under an initiative, it reads `findings.md` of every spike in that initiative's `## Tickets` list, open or closed, so a person gets what jarvis's judge gets and the tickets implied are the candidates.

Out:
- A time box, in the frontmatter or anywhere else.
- A version bump, on the user's call that nobody consumes the plugin yet.
- Any change to the loop, `wrap-up-ticket` or `close-ticket`; they already handle a spike.
- Turning a spike's tickets implied into tickets automatically; `add-ticket` reads them, a person or jarvis's judge picks.

# Acceptance criteria
- `/jodysalt:add-ticket` with a research question drafts `docs/tickets/open/{slug}/index.md` with `type: spike` and the spike template's sections, `# Question`, `# Context`, `# Approach` and `# Done when`, and `findings.md` beside it with its three prompt headings.
- With an open initiative that fits, the spike carries `initiative:`, gains `## Strategic fit`, and is appended to that initiative's `## Tickets` list; with none, it has neither and the initiative gate never fires.
- `refine-ticket` accepts `type: spike`, assesses it against the spike template rather than the feat one, and flags a missing `findings.md`.
- `add-tasks` on a spike appends one research task per `# Approach` item, a task that writes the recommendation and the tickets implied, and the review task, skips the full-suite gate and says why.
- The loop fills `findings.md` through those tasks, `wrap-up-ticket` closes the spike, and `findings.md` is under `docs/tickets/closed/{slug}/` afterwards.
- `add-ticket` drafting a `feat` under an initiative that lists a spike reads that spike's `findings.md` before interviewing.
- The type list reads `feat | fix | refactor | chore | docs | test | spike` in `add-ticket`'s description, `refine-ticket`'s check and the README row, and `plugin.json` still says `0.2.0`.
- Both `claude plugin validate` commands pass with `--strict`.

# Implementation notes
- `skills/add-ticket/SKILL.md`: `spike` joins the type list in the description and step 2, glossed as research that ends in a recommendation, not code. Step 3's gate stays `feat` only; for a spike it becomes an offer to tag an open initiative that fits, else none. Step 4 reads, for a `feat`, the `findings.md` of every spike in the chosen initiative's `## Tickets` list. Step 6 picks the spike template when the type is `spike`, its frontmatter `title`, `type`, optional `initiative` and optional `priority`, and writes `findings.md` beside it. Step 7's framing names `# Done when` as the acceptance section. Step 8 appends a spike that carries `initiative:` as it appends a `feat`.
- `skills/refine-ticket/SKILL.md`: step 4's type list gains `spike`; its section check uses the spike template's sections when the type is `spike`, flags a missing `findings.md`, expects `Strategic fit` only when tagged, and applies the `initiative:` slug check to a tagged spike as to a `feat`.
- `skills/add-tasks/SKILL.md`: step 3's docs-only sentence names `type: spike` and the fixed shape, research tasks from `# Approach`, the recommendation task, then the review task.
- `README.md`: the `add-ticket` row names the new type.
- No change to `complete-task`, `complete-tasks`, `wrap-up-ticket`, `close-ticket` or `plugin.json`.

# Test plan
- `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.
- Manual, throwaway repo scaffolded by `setup-skills` with one open initiative: `add-ticket` drafts a spike tagged with it and a second spike with no initiative, checking the template, `findings.md` and the initiative's `## Tickets` list; `add-tasks` on the tagged spike gives the spike shape and skips the gate; `complete-tasks` fills `findings.md`; `wrap-up-ticket` closes it and `findings.md` sits under `closed/`; `refine-ticket` on the untagged spike accepts the type, checks the spike sections, and flags `findings.md` after it is deleted; `add-ticket` drafting a `feat` under that initiative reads the closed spike's findings.
- No spike is drafted by hand in this repo; the first real one is whichever jarvis's judge picks.

# Rollout
- Merging to `main` is the release. No flags or migrations; fallback is reverting the commit. Existing tickets are untouched, since every change is keyed on `type: spike`.
- No version bump, on the user's call that nobody consumes the plugin yet. That leaves `vision.md`'s rule, a bump on any change to a skill's behaviour, unmet by this ticket; the rule is left for `refine-vision`, and the `jarvis` ticket's `0.3.0` stands until then.
- Lands before `jarvis`, which waits on it.

## Strategic fit
The second ticket of `hands-off-delivery` and the judge's escape hatch: without it an unattended run that cannot tell which ticket moves the metrics has nowhere to go but a stop. It serves *Explore before asking* in `vision.md`, since a question the repo cannot answer becomes research rather than a guess put to a person, and the *Decisions evaporate* problem, since the findings close as a ticket and stay as project memory, and the *Agents drift without a spec* problem, since the next `feat` is drafted against findings. It respects the initiative's non-goal of a jarvis mode in any skill, because a spike is a ticket type any driver uses the same way, and the vision's *A home for standalone skills*: no new skill, three existing ones learn a type.
