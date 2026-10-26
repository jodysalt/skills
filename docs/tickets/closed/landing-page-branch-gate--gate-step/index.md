---
title: Gate Step
type: feat
priority: high
---

# Goal
`add-landing-page` and `refine-landing-page` each offer a planning session before they write, so a market test is drafted in a `planning-<date>-landing-page` worktree and lands on `main` through `wrap-up-worktree`, as the vision and a ticket do. This one slice is the parent's whole scope.

# Context
- Parent: `docs/tickets/closed/landing-page-branch-gate/index.md`. Its Implementation notes say "One slice: the two steps, the leads, `start-planning-session`'s two edits, the rows and the bump." This slice is that backlog. Every parent criterion is unmet today except the glossary one: `docs/glossary.md` already defines *planning branch* (line 35), so it needs no change.
- The gate's wording to copy: `skills/add-ticket/SKILL.md` step 1. It has four clauses: the planning-branch match, the offer passed on yes with nothing else asked, continue on decline, skip when it already ran this conversation.
- `skills/add-landing-page/SKILL.md` today: step 1 *Root and guard* (line 19), 2 copy (line 20), 3 workflow (line 46), 4 hand off (line 73), 5 report (line 74). Its one `step N` cross-reference is the rule "The `cp` of step 2…" (line 80). The lead's last sentence (line 9) is "No branch gate: the page is a product artefact, not a planning doc."
- `skills/refine-landing-page/SKILL.md` today, after `landing-page-serve` (closed, `0.24.0`): step 1 *Root and guard* (line 19), 2 *Serve the page* (line 20), 3 explore (line 27), 4 findings (line 28), 5 interview (line 39), 6 mocks (line 58), 7 result (line 63), 8 report (line 64). `grep -on 'step [0-9]'` lists eleven cross-references, all with N ≥ 2: lines 15 (`step 7`, `step 5`), 33 (`step 3`), 38 (`step 7`), 40 (`step 4`), 49 (`step 6`), 52 (`step 3`), 55 (`step 6` twice), 56 (`step 7`), 64 (`step 2`). The lead's last sentence (line 9) is "No branch gate: the page is a product artefact, not a spec."
- `skills/start-planning-session/SKILL.md`: the description (line 3) names the four escalators; `## Description` (line 15) lists "(the ticket's input, the ticket's slug, `vision`, `coding-standards`)".
- `README.md` rows: `add-landing-page` line 22, `refine-landing-page` line 42, `start-planning-session` line 52. `.claude-plugin/plugin.json` is at `0.24.0`.
- Glossary: *planning branch*, *landing page*, *market test* in their defined senses. This repo has no test suite; checks are `grep`, `claude plugin validate skills --strict` and the manual run.
- Drafted on the `landing-page-branch-gate` ticket branch; the planning-session offer was declined.

# Scope
In: the parent's Scope, unchanged:
- **Step 2, Branch gate, in both skills**, after **Root and guard** and before any write. In `refine-landing-page` it comes before **Serve the page**. The later steps are renumbered and every `step N` cross-reference is fixed. The wording is `add-ticket`'s: when the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session landing-page`. On yes, pass it and ask nothing else. On decline, continue on the current branch. Skip when the gate already ran this conversation.
- **Uncommitted edits.** When `git status --porcelain docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are.
- **Root re-resolved.** The step ends with "the root is `git rev-parse --show-toplevel` from here on", so every later step, and the server, works in the worktree.
- **Hand-off unchanged.** `add-landing-page`'s hand-off step stays as it is; the gate's "already ran" clause covers `refine-landing-page` in the same session.
- **Leads.** Each "No branch gate…" sentence becomes "Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`". `refine-sandbox`'s sentence stands.
- **`start-planning-session`.** Description: "…or when `add-ticket`, `refine-ticket`, `refine-coding-standards`, `refine-vision`, `add-landing-page` or `refine-landing-page` escalates here…". `## Description`: add `landing-page` to the parenthesised list. No step changes.
- **Descriptions and rows.** Both landing-page descriptions gain "on a planning branch" where they say what they write. The `README.md` rows for the three skills follow their descriptions.
- `.claude-plugin/plugin.json` to `0.25.0`.

Out: the parent's Out (a `result` run treated differently, `wrap-up-worktree`, `start-planning-session`'s steps, the closed `landing-page` ticket, `refine-sandbox`, a per-idea description), and any edit to `docs/glossary.md`.

# Acceptance criteria
Automated:
- `skills/add-landing-page/SKILL.md` and `skills/refine-landing-page/SKILL.md` each hold a **Branch gate** step after the guard and before any write, in `refine-landing-page` before **Serve the page**. Each has `add-ticket`'s four clauses (planning-branch match; offer `jodysalt:start-planning-session landing-page` and pass it on yes; continue on decline; skip when already run), the uncommitted-edits sentence conditioned on `git status --porcelain docs/landing-page`, and the root resolved again after it.
- `grep -c 'No branch gate' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` prints 0 for both, and each lead carries the replacement sentence.
- Every `step N` in both files points at the renumbered step. `add-landing-page`'s rule reads "The `cp` of step 3", and each of `refine-landing-page`'s eleven references is one higher than before.
- `skills/start-planning-session/SKILL.md`'s description names `add-landing-page` and `refine-landing-page`, and its `## Description` list includes `landing-page`.
- `claude plugin validate skills --strict` passes. `.claude-plugin/plugin.json` reads `0.25.0`. `docs/glossary.md` defines *planning branch* and has no diff on this branch. The three descriptions and `README.md` rows say what the Scope says.

Left for a person (manual, not checkable unattended):
- In a fresh `git init` repo on `main`, `add-landing-page` with an idea first offers the planning session. On yes, the files appear under `.claude/worktrees/planning-<today>-landing-page/docs/landing-page/` and `main`'s tree is unchanged. `refine-landing-page` then runs in the same worktree without a second offer. On a repo whose page already exists, the run stops before any offer and `git worktree list` has one entry.
- On `main` in a repo with a page, `refine-landing-page` offers the session once. On yes it edits, and serves, the worktree's page; on decline it edits the page in place as `0.24.0` did. With an uncommitted edit under `docs/landing-page`, the offer names it.

# Implementation notes
- **`add-landing-page`.** Insert step 2 **Branch gate** after line 19 and renumber 2–5 to 3–6. Change the rule's "step 2" to "step 3". Replace the lead's last sentence and add "on a planning branch" to the description.
- **`refine-landing-page`.** Insert step 2 **Branch gate** after line 19 and renumber 2–8 to 3–9, raising each cross-reference listed in Context by one. Replace the lead's last sentence and add "on a planning branch" to the description.
- **Gate wording.** Copy it from `skills/add-ticket/SKILL.md` step 1 with `landing-page` as the fixed description, add the uncommitted-edits sentence, and end with the root sentence.
- **`start-planning-session`.** Edit lines 3 and 15 only.
- **Rows.** Update `README.md` lines 22, 42 and 52 from the descriptions' first sentences.
- **Bump** `.claude-plugin/plugin.json` to `0.25.0`.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -n 'Branch gate\|start-planning-session landing-page\|porcelain docs/landing-page\|show-toplevel' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md`.
- `grep -c 'No branch gate' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` prints 0 and 0.
- `grep -n 'add-landing-page\|landing-page`' skills/start-planning-session/SKILL.md`.
- `grep -n 'step [0-9]' skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md`, read against the new numbering.
- `grep -n '"version"' .claude-plugin/plugin.json` prints `0.25.0`.
- `grep -n 'planning branch' docs/glossary.md`, and `git diff main -- docs/glossary.md` is empty.
- Manual, left for a person: a throwaway repo under `claude --plugin-dir` pointed at this worktree, running the parent's script. On `main`, run `add-landing-page` with the Breezy brief, accept, and confirm the files are in the worktree and `main` is clean. Answer two Offer questions and see them land there. Run `refine-landing-page benefits` in the same session and get no second offer. In a second session on `main`, make an uncommitted edit, run `refine-landing-page`, read the offer, decline, and see the edit in place. Run `add-landing-page` on a repo with a page and see it stop with one worktree listed.

# Rollout
The bump to `0.25.0` lands with this slice; merging the parent to `main` is the release. There is no flag or migration: a user who declines the offer gets the `0.24.0` run. Fallback is reverting the commit.

## Strategic fit
Advances `landing-page-branch-gate` by delivering all of it in one backlog (the two gate steps, the leads, `start-planning-session`'s two edits, the rows and the bump), so every parent criterion is met when this slice lands.
