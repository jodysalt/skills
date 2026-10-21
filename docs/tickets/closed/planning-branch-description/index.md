---
title: Planning Branch Description
type: feat
priority: medium
---

# Goal
A planning branch is named for what it plans. `start-planning-session` names its branch and worktree `planning-<YYYY-MM-DD>-<description>`, the description required, so `git worktree list` and the branch list say what each planning session was about instead of only when it happened.

# Context
- `start-planning-session` (plugin `0.14.0`) takes no argument. Step 1 stops when the branch already matches `planning-<YYYY-MM-DD>` (optionally `-<N>`); step 3 joins the highest-numbered `planning-<today>` worktree when one exists, else takes the next free `planning-<today>`, `-2`, `-3`; steps 4 and 5 delegate to `add-worktree` and `enter-worktree`. Its description and the `README.md` row describe the same pattern.
- The branch gate in step 1 of `add-ticket`, `refine-ticket`, `refine-vision` and `refine-coding-standards` matches the same `planning-<YYYY-MM-DD>` (optionally `-<N>`) pattern and offers to invoke `jodysalt:start-planning-session` with no argument. `deliver-brief` step 4 declines that offer as the user, so it never reaches this skill.
- `add-worktree` normalizes a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`); the precedent for how a description is cleaned.
- `plugin.json` is `0.14.0` and bumps on any change to a skill's behaviour; the glossary feat took it from `0.13.1` to `0.14.0`.

# Scope

In:
- **The description is required.** `start-planning-session` takes one argument, the description, and names the branch and worktree `planning-<YYYY-MM-DD>-<description>`. With no argument it asks for one, one question with a recommended answer, as `add-worktree` asks for a branch.
- **The escalating skill passes it.** The branch gate in `add-ticket`, `refine-ticket`, `refine-vision` and `refine-coding-standards` invokes `jodysalt:start-planning-session <description>` with one derived from its subject, so no question is added there: `add-ticket` from the ticket's input, `refine-ticket` the ticket's slug, `refine-vision` `vision`, `refine-coding-standards` `coding-standards`.
- **Join only an exact match.** When `git worktree list` registers `.claude/worktrees/planning-<today>-<description>`, the session joins it; otherwise the skill creates it. A different description on the same day gets its own worktree.
- **The collision suffix stays, after the description.** When the branch `planning-<today>-<description>` exists with no worktree registered, the next free name is `planning-<today>-<description>-2`, `-3`, and so on, checked against `git branch --list --all` and `ls .claude/worktrees/` as today.
- **The branch gate accepts the new shape and the old.** Step 1 of `start-planning-session` and the branch gate in the four escalating skills match `planning-<YYYY-MM-DD>` followed by anything, so `planning-2026-10-21-glossary`, `planning-2026-10-21-glossary-2` and a pre-upgrade `planning-2026-10-21` all count as a planning session.
- **Normalization.** The description is normalized to kebab-case the way `add-worktree` normalizes a typed name (`Glossary terms` becomes `glossary-terms`), with no length cap.
- **`add-ticket`'s description** is a short kebab-case phrase for the ticket's subject, two to four words, taken from its input; its slug is not picked until step 5.
- **Steering.** The `start-planning-session` description and its `README.md` row name the required description and the new pattern. The four escalating skills' descriptions stay as they are; the offer is unchanged from the user's side.
- `plugin.json` to `0.15.0`.

Out:
- `deliver-brief`, which keeps declining the offer and drafts on the base.
- Renaming or migrating an existing `planning-<YYYY-MM-DD>` worktree; it passes the gate and lands as before.
- A length cap or vocabulary for the description.

# Acceptance criteria
- In a throwaway repo on `main`, `/jodysalt:start-planning-session glossary terms` creates and enters `.claude/worktrees/planning-<today>-glossary-terms` on the branch `planning-<today>-glossary-terms`, forked from `main`, with no question asked.
- `/jodysalt:start-planning-session` with no argument asks for a description once, with a recommended answer, before creating anything.
- Running it again with the same description joins the existing worktree and says so; running it with a different description the same day creates a second worktree beside the first.
- When the branch `planning-<today>-<description>` exists and no worktree is registered for it, the next free name is `planning-<today>-<description>-2`.
- `/jodysalt:add-ticket <input>` on `main` offers the planning session as today and, on yes, invokes `start-planning-session` with a description derived from the input, asking nothing extra; `refine-ticket`, `refine-vision` and `refine-coding-standards` do the same with the ticket's slug, `vision` and `coding-standards`.
- On a pre-upgrade `planning-<today>` worktree, `/jodysalt:add-ticket` skips the offer; the gate still accepts the bare date.
- The `start-planning-session` description and its `README.md` row name the required description and the new pattern, `plugin.json` reads `0.15.0`, and `claude plugin validate skills --strict` passes.

# Implementation notes
- `skills/start-planning-session/SKILL.md`: add a `## Description` argument section (the argument, kebab-cased; when empty, ask once with a recommendation); step 1 matches `planning-<YYYY-MM-DD>` followed by anything; step 3 joins `.claude/worktrees/planning-<today>-<description>` when registered, else takes the next free `planning-<today>-<description>`, `-2`, `-3`; update the frontmatter description.
- `skills/add-ticket/SKILL.md`, `skills/refine-ticket/SKILL.md`, `skills/refine-vision/SKILL.md`, `skills/refine-coding-standards/SKILL.md`: the branch gate matches the widened pattern and invokes `jodysalt:start-planning-session <description>` with the derived description.
- `README.md` row for `start-planning-session`; `.claude-plugin/plugin.json` to `0.15.0`.
- Nothing else changes: `add-worktree`, `enter-worktree` and `wrap-up-worktree` already take any branch name.

# Test plan
Manual, in a throwaway repo scaffolded with `setup-skills`: each acceptance criterion in turn, by hand with an argument, by hand with none, via `/jodysalt:add-ticket` on `main`, a rerun with the same description, a run with a different description, and a run on a pre-upgrade bare-date worktree. `claude plugin validate skills --strict` on the plugin. No eval suite; the vision reserves them for the risky skills.

# Rollout
No flag. Ships in `0.15.0`; users auto-update from `main`. An existing bare-date planning worktree passes the widened gate and lands through `wrap-up-worktree` unchanged, so nothing migrates.

## Strategic fit
Stands on the core problem *Decisions evaporate*: a planning branch named for what it plans records in `git worktree list` and the branch list what each session was about, where a bare date records only when. Stands on *Explore before asking*: the escalating skill passes the description it already knows, so no question is added, and by hand the one question comes with a recommended answer. Respects the non-goal *A home for standalone skills*: the change stays inside the method's own skill and the four that escalate to it.
