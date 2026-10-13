---
title: Ticket Slicing
type: feat
priority: high
---

# Goal
A user implements any ticket, however large, with one command that works in thin, end-to-end slices: `/jodysalt:complete-ticket` enters the ticket's worktree and calls `complete-ticket-slice` until its report ends in `done`, so every backlog is written just before the loop that runs it and the ticket's branch reads as one commit per slice. A run that stops on a failed task resumes with the same command. `deliver-brief-in-slices` builds on this to shrink `deliver-brief` to the same chain.

# Context
- `complete-ticket` today writes one backlog for the whole ticket with `add-tasks` and runs the loop. A complicated ticket gets a monolithic backlog up front, and nothing in the skill breaks the ticket down further.
- `complete-ticket-slice` (plugin `0.11.0`) judges a ticket's acceptance criteria, picks the thinnest slice that moves the unmet ones, drafts it as `{slug}--{sub}` through an unattended `add-ticket`, implements it in `.claude/worktrees/{slug}--{sub}` forked from the parent branch, closes it, squashes it against the parent and fast-forwards it in. Its report's last line is `done` or the slice slug with the criteria still unmet. Its step 1 refuses to run while a slice worktree exists, telling a person to finish the tasks there; the close, squash, merge and removal are then owed and nothing resumes them.
- `deliver-brief` carries its own judge stage, a pick that drafts a sub-ticket on the ticket branch, lands the parent open, forks the sub-ticket's worktree from the base and runs `complete-ticket` on it, a parent judge from the main checkout, a planning session per parent pick, a 5-ticket cap, and resume rules that walk `docs/tickets/open/{slug}--*/` in the main checkout and merge every worktree ahead of the base into it. Under slicing, sub-tickets live only on the parent branch, so the cursor finds nothing and the merge sweep would fast-forward a slice branch onto the base.
- `wrap-up-worktree` closes a ticket branch only when `docs/tickets/open/<branch>--*` is empty, and `close-ticket` refuses otherwise. Slices close on the parent branch before it lands, so both work unchanged.
- The workflow sentence in this repo's `CLAUDE.md`, `setup-skills` step 4 and the `README.md` Workflow paragraph says `complete-ticket` "breaks the ticket into tasks on its own branch just before running the loop".
- `plugin.json` is `0.11.0` and bumps on any change to a skill's behaviour. `claude plugin validate skills --strict` gates the frontmatter; the root check passes with a pre-existing warning about `CLAUDE.md`.

# Scope

In:
- **`complete-ticket` slices, always.** Its tasks step goes: it never runs `add-tasks` on the parent. After the worktree step it invokes `jodysalt:complete-ticket-slice {slug}` and reads the report's last line: `done` ends the loop; a slice slug calls again. A `complete-ticket-slice` report that is neither `done` nor a slice slug is a failure: stop with that report, worktree in place.
- **No slice cap**, as `complete-tasks` has no task cap.
- **`complete-ticket` resumes.** An existing parent worktree is entered, not re-added, as today; a parent `tasks.md` from before this ticket is run through `complete-tasks` first when it has a pending entry, then slicing continues; a stopped slice is `complete-ticket-slice`'s to resume.
- **`complete-ticket-slice` resumes a stopped slice.** Step 1's refusal becomes a resume: when `.claude/worktrees/{slug}--{sub}` is registered for exactly one `{sub}`, enter it and continue at the loop step when its `tasks.md` has a pending entry, else at the close step when every entry is done and `docs/tickets/open/{slug}--{sub}` still exists, else at the squash step; the judge and the draft are skipped. More than one slice worktree stops the run naming them.
- **Steering.** The workflow sentence in `setup-skills` step 4, this repo's `CLAUDE.md` and `README.md` becomes, in substance, "then implement it with `complete-ticket`, which works through it one thin slice at a time, each slice a sub-ticket with its own backlog". `complete-ticket`'s description and README row follow.
- `plugin.json` to `0.12.0`.

Out:
- A size heuristic or an author's mark that chooses between one backlog and slices; every ticket is sliced.
- Changing `complete-ticket-slice`'s judge, pick or landing; only its step 1 changes.
- Changing `add-tasks`, `complete-tasks`, `wrap-up-worktree` or `close-ticket`.
- Rewriting `deliver-brief`; that is `docs/tickets/closed/deliver-brief-in-slices/`, which builds on this ticket. Until it lands, `deliver-brief`'s judge, pick path and resume rules assume the old sub-ticket model and are not used on a sliced ticket.
- Migrating the first user's repo; its `CLAUDE.md` sentence is updated by hand.
- Eval suites. Pushing.

# Acceptance criteria
- In a throwaway repo with a ticket landed on `main` and no worktree, `/jodysalt:complete-ticket {slug}` creates and enters `.claude/worktrees/{slug}`, writes no parent `tasks.md`, and runs `complete-ticket-slice` until `done`: each slice closed under `docs/tickets/closed/{slug}--*/` on the branch, one commit per slice on `{slug}`, nothing on `main`, then a report naming the slices and suggesting `wrap-up-worktree`.
- A ticket one slice covers ends after one slice and `done`.
- Interrupted mid-slice and run again, `/jodysalt:complete-ticket {slug}` enters the parent worktree and `complete-ticket-slice` resumes the slice at its next pending task, or at its close when every task is done, without drafting another; it then carries on to `done`. With two slice worktrees present it stops naming both.
- A ticket whose `tasks.md` was written before this release runs those pending entries first, then slices.
- `/jodysalt:wrap-up-worktree {slug}` afterwards closes the ticket and lands one commit on `main`, every slice folded in.
- `CLAUDE.md`, `README.md` and `setup-skills` carry the new workflow sentence; README rows match every changed description; `plugin.json` is `0.12.0`; `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- `complete-ticket`: step 3 (tasks) becomes the compatibility run of a pre-existing `tasks.md`; step 4 becomes the slice loop, uncapped; step 5 reports the slices and the last verdict. The description and the body paragraph drop "breaks the ticket into tasks".
- `complete-ticket-slice`: step 1's second guard becomes the resume branch; steps 7 to 9 are the entry points. The description gains "resumes a stopped slice".
- `setup-skills` step 4, `CLAUDE.md` line 3 and `README.md`'s Workflow paragraph take the same sentence.
- Descriptions are frontmatter, so `--strict` checks them; keep each skill's trigger phrases and "never" clauses.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this ticket's worktree: `git init`, `setup-skills`, a vision, a ticket drafted and landed, then every `complete-ticket` case above, including an interruption with `Ctrl-C` mid-loop and a resume, a ticket with a pre-existing `tasks.md`, and the `wrap-up-worktree` landing.
- Manual, this repo: `grep -n complete-ticket CLAUDE.md README.md skills/setup-skills/SKILL.md`.

# Rollout
- Bump `plugin.json` to `0.12.0`; merging to `main` is the release. Breaking for a run in flight: a ticket branch holding sub-tickets drafted the old way, each with its own worktree from the base, is landed by hand with `wrap-up-worktree` per sub-ticket before this release is used on it. A pre-existing parent `tasks.md` is honoured. Fallback is reverting the commit.
- The first user's repo gets the new `CLAUDE.md` sentence by hand.

## Strategic fit
Stands on *Unattended work needs structure*: a slice is a backlog small enough to stand alone, written just before it runs, with a judgment between slices instead of one guess up front. It serves *Agents drift without a spec*, since each slice is a sub-ticket with its own criteria. It follows *One opinionated method* by giving every ticket one path and *One thing, then stop* by keeping the judge in the skill that slices, so `deliver-brief-in-slices` can drop its own. It respects the *Several plugins* non-goal; nothing leaves the one plugin.
