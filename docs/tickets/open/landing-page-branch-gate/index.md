---
title: Landing Page Branch Gate
type: feat
delivers: Market test before building
---

# Goal
A market test is drafted the way the vision and a ticket are: `add-landing-page` and `refine-landing-page` offer a planning session before they write, so the page, its notes and its mocks take shape in a `planning-<date>-landing-page` worktree and land on `main` through `wrap-up-worktree` as one squashed commit, instead of on whatever branch the session happened to be on.

# Context
- The gate, as `skills/add-ticket/SKILL.md` step 1 words it and `refine-ticket`, `refine-vision` and `refine-coding-standards` copy it: when the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session <description>`, on yes pass it and ask nothing else, continue on the current branch when the user declines, skip when the gate already ran this conversation.
- `skills/add-landing-page/SKILL.md`'s lead ends "No branch gate: the page is a product artefact, not a planning doc" and `skills/refine-landing-page/SKILL.md`'s "No branch gate: the page is a product artefact, not a spec"; the closed `landing-page` ticket recorded that decision and this ticket reverses it, the closed ticket left as it is. `skills/refine-sandbox/SKILL.md`'s "No branch gate: the file is source, not a planning doc" stands.
- `skills/start-planning-session/SKILL.md`: its description names the four skills that escalate to it, and its `## Description` section recommends "the subject the escalating skill holds (the ticket's input, the ticket's slug, `vision`, `coding-standards`)".
- Both landing-page skills resolve the root in step 1 as `git rev-parse --show-toplevel`; entering the worktree changes that answer, so the root is read after the gate. `add-landing-page` step 4 hands off to `refine-landing-page` in the same session; the gate's "already ran this conversation" clause means the hand-off never gates twice, and the session is on the planning branch by then in any case.
- The open `landing-page-serve` ticket inserts a **Serve the page** step between `refine-landing-page`'s guard and findings on the same file; this ticket names steps, never numbers them, so it lands after `landing-page-serve` without conflict.
- Glossary: *planning branch*, defined by this ticket; *landing page*, *market test* in their defined senses.

# Scope
In:
- **Guard, then gate, in both skills.** Step 1 stays the guard against the checkout the session is in – `add-landing-page` stops when `docs/landing-page/index.html` exists, `refine-landing-page` when it is missing – so a stop creates nothing. A new step, **Branch gate**, follows it with `add-ticket`'s wording: when the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session landing-page`, on yes pass it and ask nothing else, continue on the current branch when the user declines, skip when the gate already ran this conversation. The root is resolved again after the gate, since the worktree is the root from then on, and every later step writes there; in `refine-landing-page` the gate comes before **Serve the page**, so the server serves the worktree's page.
- **Uncommitted page edits are named in the offer.** When `git status --porcelain docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are.
- **The description is `landing-page`** from both skills, so a scaffold run and a same-day refine join one worktree, `planning-<date>-landing-page`.
- **The hand-off is unchanged.** `add-landing-page`'s step that invokes `refine-landing-page` stays as it is; the session is on the planning branch by then and the gate's "already ran this conversation" clause covers it.
- **`start-planning-session`** gains `add-landing-page` and `refine-landing-page` among the escalators in its description and `landing-page` in its `## Description` list of recommended answers; no step changes.
- **Leads.** The "No branch gate…" sentence in each lead becomes "Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`". `refine-sandbox`'s sentence stands, now matching the glossary's *planning branch*.
- **Descriptions and rows.** Both descriptions gain "on a planning branch" where they say what they write, and their `README.md` rows follow; `start-planning-session`'s row follows its description.
- `docs/glossary.md` gains *planning branch* (written by this draft). `.claude-plugin/plugin.json` to `0.25.0`, after `landing-page-serve`'s `0.24.0`; this ticket is implemented after that one.

Out:
- Treating a `result` run differently; it gates like any run, the result landing through `wrap-up-worktree` too.
- Any change to `wrap-up-worktree`, to `start-planning-session`'s steps, or to the closed `landing-page` ticket.
- A gate on `refine-sandbox`; folding this into `landing-page-serve`; a per-idea description.

# Acceptance criteria
- `skills/add-landing-page/SKILL.md` and `skills/refine-landing-page/SKILL.md` each hold a **Branch gate** step after the guard and before any write, with `add-ticket`'s four clauses (planning-branch match, offer `jodysalt:start-planning-session landing-page` and pass it on yes, continue on decline, skip when already run), the uncommitted-edits sentence conditioned on `git status --porcelain docs/landing-page`, and the root resolved again after it; neither lead says "No branch gate"; `grep -c 'No branch gate' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` prints 0 for both.
- In a fresh `git init` repo on `main`, `add-landing-page` with an idea first offers the planning session; on yes the files appear under `.claude/worktrees/planning-<today>-landing-page/docs/landing-page/` and `main`'s tree is unchanged; `refine-landing-page` then runs in the same worktree without a second offer. On a repo whose page already exists, the run stops before any offer and `git worktree list` has one entry.
- On `main` in a repo with a page, `refine-landing-page` offers the session once and, on yes, edits the worktree's page; on decline it edits the page in place as `0.24.0` did. With an uncommitted edit under `docs/landing-page`, the offer names it.
- `skills/start-planning-session/SKILL.md`'s description names `add-landing-page` and `refine-landing-page` and its `## Description` list includes `landing-page`.
- `claude plugin validate skills --strict` passes; `.claude-plugin/plugin.json` reads `0.25.0`; `docs/glossary.md` defines *planning branch*; the three descriptions and `README.md` rows say what the Scope says.

# Implementation notes
- **Both skills.** Insert **Branch gate** as the step after **Root and guard**, renumbering what follows and fixing every `step N` cross-reference the file holds (`grep -on 'step [0-9]' skills/{add,refine}-landing-page/SKILL.md`); in `refine-landing-page` it sits before **Serve the page**, which `landing-page-serve` adds first. Copy the gate's wording from `skills/add-ticket/SKILL.md` step 1 with `landing-page` as the description, add the uncommitted-edits sentence, and end the step with "the root is `git rev-parse --show-toplevel` from here on", since step 1's root may be another checkout. Rewrite the lead's last sentence.
- **`start-planning-session`.** Description: "…or when `add-ticket`, `refine-ticket`, `refine-coding-standards`, `refine-vision`, `add-landing-page` or `refine-landing-page` escalates here…". `## Description`: add `landing-page` to the parenthesised list.
- **Rows.** `README.md` rows for the three skills from their descriptions' first sentences.
- **Bump** `.claude-plugin/plugin.json` to `0.25.0`.
- One slice: the two steps, the leads, `start-planning-session`'s two edits, the rows and the bump.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -n 'Branch gate\|start-planning-session landing-page\|porcelain docs/landing-page\|show-toplevel' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md`; `grep -c 'No branch gate' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` prints 0 and 0; `grep -n 'add-landing-page\|landing-page`' skills/start-planning-session/SKILL.md`; `grep -n 'step [0-9]' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` shows every cross-reference pointing at the renumbered step; `grep -n '"version"' .claude-plugin/plugin.json` prints `0.25.0`; `grep -n 'planning branch' docs/glossary.md`.
- Manual, throwaway repo under `claude --plugin-dir` pointed at this ticket's worktree: on `main`, `add-landing-page` with the Breezy brief, accept the offer, confirm the files are in the worktree and `main` is clean, answer two Offer questions and see them land there; run `refine-landing-page benefits` in the same session with no second offer; in a second session on `main`, make an uncommitted edit to the page, run `refine-landing-page` and read the offer, decline, and see the edit in place; run `add-landing-page` on a repo with a page and see it stop with one worktree listed.

# Rollout
Bump `plugin.json` to `0.25.0`; merging to `main` is the release. No flag or migration: a user who declines the offer gets the `0.24.0` run on the current branch; a page already written is untouched. Fallback is reverting the commit.

## Strategic fit
Delivers *Market test before building* by giving the market test the same path to `main` as every other planning doc – drafted in a worktree, squashed and fast-forwarded by `wrap-up-worktree` – so the goal's "page and mocks scaffolded, published, the result written beside the page" happens on the branch the method already lands planning from. Stands on *One opinionated method*, since one gate governs everything that lands without a ticket, and on *Decisions evaporate*, since the reversal of the no-gate decision and the term *planning branch* are written down here and in the glossary. It respects *A website builder*: the worktree holds the same one static file, no build step.
