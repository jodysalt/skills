---
title: Gate Description
type: feat
priority: medium
---

# Goal
The four skills that escalate to `start-planning-session` pass the description themselves, and the change ships. On `main`, `/jodysalt:add-ticket glossary terms` offers the planning session as today and, on yes, invokes `jodysalt:start-planning-session glossary-terms`, so the session lands in `.claude/worktrees/planning-<today>-glossary-terms` with no question added; `refine-ticket`, `refine-vision` and `refine-coding-standards` do the same with the ticket's slug, `vision` and `coding-standards`. Inside a `planning-<today>-glossary-terms` worktree, or a pre-upgrade `planning-<today>` one, none of the four offers anything. The plugin reads `0.15.0`, so the first merge to `main` releases the required description and the gates together.

# Context
- Parent: `docs/tickets/closed/planning-branch-description/index.md`. This slice moves its two unmet criteria, the escalating-skill one (`/jodysalt:add-ticket <input>` on `main` offers the planning session as today and, on yes, invokes `start-planning-session` with a description derived from the input, asking nothing extra; the other three with the ticket's slug, `vision` and `coding-standards`) and the pre-upgrade one (on a bare-date worktree `/jodysalt:add-ticket` skips the offer), plus the half of the last that the first slice left: `plugin.json` at `0.15.0` and `claude plugin validate skills --strict` passing. It is the parent's final slice.
- Already landed by `docs/tickets/closed/planning-branch-description--required-description/index.md`, on this branch at commit `7a2f257`: `skills/start-planning-session/SKILL.md` has a `## Description` argument section (`$ARGUMENTS`, required, normalized to kebab-case the way `add-worktree` normalizes a typed name, asked once with a recommended answer when empty) and an `argument-hint`; its step 1 stops when the branch matches `planning-<YYYY-MM-DD>` followed by anything; its step 3 joins the exact `.claude/worktrees/planning-<today>-<description>` or takes the next free `planning-<today>-<description>`, `-2`, `-3`; its frontmatter description and `README.md` line 46 name the required description. Its `## Description` names the recommended answer by hand as "the subject the escalating skill holds when one escalated here (the ticket's input, the ticket's slug, `vision`, `coding-standards`)", the same derivation this slice makes the four gates pass; once they pass it, that fallback is reached only when a gate is invoked by hand with nothing said. Nothing in that skill changes here.
- The branch gate is step 1 of `skills/add-ticket/SKILL.md`, `skills/refine-ticket/SKILL.md`, `skills/refine-vision/SKILL.md` and `skills/refine-coding-standards/SKILL.md`, line 19 of each, the same sentence byte for byte in all four:

  > 1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.

  So today a session on a new-shaped branch such as `planning-2026-10-21-glossary-terms` is offered the planning session again, and on yes `start-planning-session` stops at its own step 1; on `main` it is invoked with no argument and asks for the description, a question the gate could have answered.
- Each of the four knows its subject before step 1, so the derived description costs no question. `add-ticket`'s `## Ticket` section holds `$ARGUMENTS` and asks what the change is when empty; its slug is not picked until step 5, so the gate's description is a phrase for the subject, not the slug. `refine-ticket`'s `## Ticket` section resolves the slug (the argument, else the only open ticket, else the one matching the branch, else ask) and confirms it. `refine-vision` and `refine-coding-standards` take an optional section scope; their subject is the file, so the description is the constant `vision` or `coding-standards`.
- The four frontmatter descriptions do not describe the gate or the offer, and their `README.md` rows mirror the descriptions, so neither changes; `deliver-brief` step 4 and `complete-ticket-slice` step 4 decline the offer as the user and keep working, since the offer's wording stays.
- `.claude-plugin/plugin.json` reads `"version": "0.14.0"`. The vision's *`main` is always installable* principle bumps the version on any change to a skill's behaviour; the parent set `0.15.0`, a minor bump, as the glossary feat took `0.13.1` to `0.14.0` in its last slice (`docs/tickets/closed/glossary--steering/index.md`). `claude plugin validate skills --strict` passes on this branch today.
- The run that drafts this slice is on `planning-branch-description`, a ticket branch; the gate offered and was declined.

# Scope

In:
- **The gate widened, in four places.** Step 1 of `add-ticket`, `refine-ticket`, `refine-vision` and `refine-coding-standards` offers the planning session when the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, so `planning-2026-10-21-glossary-terms`, `planning-2026-10-21-glossary-terms-2` and a pre-upgrade `planning-2026-10-21` or `planning-2026-10-21-2` all skip the offer, the same test `start-planning-session` step 1 makes.
- **The gate passes the description.** On yes, each invokes `jodysalt:start-planning-session <description>` with one derived from its subject, asking nothing extra: `add-ticket` a short kebab-case phrase for the ticket's subject, two to four words, taken from its input, the slug not being picked until step 5; `refine-ticket` the ticket's slug; `refine-vision` `vision`; `refine-coding-standards` `coding-standards`. `start-planning-session` normalizes the argument as it does any other, so the gate hands over the phrase and leaves the kebab-casing to it.
- **The four lines stay in step.** The step-1 sentence stays byte-identical across the four apart from the clause naming the derived description, as it is today, so a later change to the gate is one `sed` across four files.
- **Release.** `.claude-plugin/plugin.json` from `0.14.0` to `0.15.0`, nothing else in it changed, and `claude plugin validate skills --strict` passing on the final tree.

Out:
- The offer's wording and the user's side of it: the gate still offers once and continues on the current branch when declined; the four frontmatter descriptions and their `README.md` rows stay as they are.
- `skills/start-planning-session/SKILL.md`, its `README.md` row, and `add-worktree`, `enter-worktree` and `wrap-up-worktree`: done by the first slice or untouched by the parent.
- `deliver-brief`, which keeps declining the offer and drafts on the base; `complete-ticket-slice`, whose drafter does the same.
- Any eval; the vision reserves them for the risky skills and these are interview skills. Pushing. Renaming or migrating a bare-date worktree.

# Acceptance criteria
- `grep -c 'planning-<YYYY-MM-DD>` followed by anything' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md skills/refine-vision/SKILL.md skills/refine-coding-standards/SKILL.md` prints `1` for each; `grep -l 'optionally `-<N>`' skills/*/SKILL.md` prints nothing.
- `grep -n 'jodysalt:start-planning-session' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md skills/refine-vision/SKILL.md skills/refine-coding-standards/SKILL.md` prints one line per file, each at line 19 and each invoking the skill with a description: `add-ticket`'s names a two-to-four-word kebab-case phrase for the ticket's subject taken from its input, `refine-ticket`'s the ticket's slug, `refine-vision`'s `vision`, `refine-coding-standards`'s `coding-standards`; each line still says to continue on the current branch when the user declines and to skip when the gate already ran this conversation.
- `diff <(sed -n 19p skills/add-ticket/SKILL.md) <(sed -n 19p skills/refine-ticket/SKILL.md)` and the same against `refine-vision` and `refine-coding-standards` each differ in the derived-description clause only.
- In a throwaway repo on `main` with `claude --plugin-dir` pointed at this slice's worktree, `/jodysalt:add-ticket glossary terms` offers the planning session; on yes the session ends up in `.claude/worktrees/planning-<today>-glossary-terms` on the branch of that name with no other question asked before the draft begins, and `git branch --show-current` there prints the name. `/jodysalt:refine-ticket <slug>` on `main` lands in `planning-<today>-<slug>`, `/jodysalt:refine-vision` in `planning-<today>-vision` and `/jodysalt:refine-coding-standards` in `planning-<today>-coding-standards`, the same way.
- Inside a `planning-<today>-glossary-terms` worktree, and inside a pre-upgrade `planning-<today>` worktree, `/jodysalt:add-ticket <input>` makes no planning-session offer and drafts there; the other three skip the offer the same way.
- `.claude-plugin/plugin.json` reads `"version": "0.15.0"` and nothing else in it changed.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the parent branch lists exactly `skills/add-ticket/SKILL.md`, `skills/refine-ticket/SKILL.md`, `skills/refine-vision/SKILL.md`, `skills/refine-coding-standards/SKILL.md` and `.claude-plugin/plugin.json`, this ticket's own files aside; `git diff -U0 skills/ | grep '^[-+]description:'` prints nothing; `README.md` and `skills/start-planning-session/SKILL.md` are unchanged.
- Nothing is pushed.

# Implementation notes
- **The gate line.** Replace line 19 of each of the four with the same sentence, the clause in angle brackets being the one place they differ:

  > 1. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session <description>`, the description being <clause>; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.

  The clauses: `add-ticket`: "a short kebab-case phrase for the ticket's subject, two to four words, taken from the input above, since the slug is not picked until step 5 (`glossary terms` becomes `glossary-terms`)"; `refine-ticket`: "the ticket's slug"; `refine-vision`: "`vision`"; `refine-coding-standards`: "`coding-standards`". The offer itself keeps its shape, one offer the user accepts or declines; only the argument on yes is new.
- **`add-ticket`'s phrase.** It names the subject, not the change's shape: from "add a ticket for a planning branch named for what it plans" something like `planning-branch-name`; from a slug-shaped input, the input's own words. `start-planning-session` kebab-cases whatever is passed, so the gate never normalizes.
- **One `sed` for the shared text.** Apply the pattern change (`(optionally `-<N>`)` to `followed by anything`, plus the pre-upgrade parenthesis) across the four in one command, then edit the clause per file, then run the `diff` checks above so the four stay in step.
- **Release.** `.claude-plugin/plugin.json`: `"version": "0.14.0"` to `"version": "0.15.0"`, nothing else. Then `claude plugin validate skills --strict`.
- **Not touched.** `start-planning-session`, `README.md`, the four frontmatter descriptions, `deliver-brief`, `complete-ticket-slice`, `add-worktree`, `enter-worktree`, `wrap-up-worktree`.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep`, `diff` and `git diff` checks above against the parent branch; `grep '"version"' .claude-plugin/plugin.json` reads `0.15.0`.
- Manual, throwaway repo scaffolded with `setup-skills` with `claude --plugin-dir` pointed at this slice's worktree, each acceptance criterion in turn: `/jodysalt:add-ticket glossary terms` on `main`, accepting the offer and checking the worktree name and that no description question came; `/jodysalt:refine-ticket <slug>`, `/jodysalt:refine-vision` and `/jodysalt:refine-coding-standards` on `main` the same way; then `/jodysalt:add-ticket` inside the new-shaped worktree and inside a bare-date worktree made by hand with `add-worktree planning-<today>`, checking no offer is made.
- No eval suite.

# Rollout
- Lands on the parent `planning-branch-description` branch as one commit; the parent then lands on `main` through `wrap-up-worktree` and users auto-update to `0.15.0`, the required description and the gates arriving together. A bare-date worktree passes the widened gate and lands unchanged, so nothing migrates. `deliver-brief` and `complete-ticket-slice` keep declining the unchanged offer. Fallback is reverting the commit; the first slice stands alone without it, its skill asking for the description when the gates pass none.

## Strategic fit
Advances `planning-branch-description` by closing it: the four gates accept both branch shapes and pass the description the parent says they pass, so no question is added by that route, and the `0.15.0` bump with the validate pass releases the whole change, leaving the parent nothing unmet.
