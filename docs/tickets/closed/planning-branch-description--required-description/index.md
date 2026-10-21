---
title: Required Description
type: feat
priority: medium
---

# Goal
`start-planning-session` alone, end to end. It takes one required argument, the description, and names the branch and worktree `planning-<YYYY-MM-DD>-<description>`, so `/jodysalt:start-planning-session glossary terms` on `main` creates and enters `.claude/worktrees/planning-<today>-glossary-terms` with no question asked, a run with no argument asks for the description once with a recommended answer before creating anything, a rerun with the same description joins the worktree it made, a different description the same day gets its own, and a branch left without a worktree yields to `-2`. After this slice the branch list and `git worktree list` say what each planning session was about; the four skills that escalate here still invoke it with no argument, so by that route the skill asks.

# Context
- Parent: `docs/tickets/closed/planning-branch-description/index.md`. This slice moves its first four acceptance criteria (argument, no argument, rerun and second description, `-2` collision) and the steering half of the last (the skill's description and its `README.md` row); the `0.15.0` bump and the validate pass in that criterion, and the two escalating-skill criteria, wait for the next slice.
- `skills/start-planning-session/SKILL.md` at plugin `0.14.0` has no argument section and no `argument-hint`; `add-worktree` and `enter-worktree` have both (23 skills carry `argument-hint`). Its body today: step 1 stops when the branch matches `planning-<YYYY-MM-DD>` (optionally `-<N>`); step 2 refreshes the base best effort; step 3 joins the highest-numbered `.claude/worktrees/planning-<today>` or `planning-<today>-<N>` in `git worktree list`, else takes the next free `planning-<today>`, `-2`, `-3`, checking `git branch --list --all` and `ls .claude/worktrees/`; steps 4 and 5 invoke `jodysalt:add-worktree` and `jodysalt:enter-worktree` with the name; step 6 confirms and hands back. Its frontmatter description and `README.md` line 46 describe the bare-date pattern and "joins today's planning worktree".
- `add-worktree`'s `## Branch` section is the shape for the argument section: `$ARGUMENTS`, then what to do when empty, then "Normalize a typed name to kebab-case (`Fix Signup Bug` becomes `fix-signup-bug`)". Its ask is one `AskUserQuestion` with a recommended answer and the built-in "Other" for a typed name. `add-worktree` and `enter-worktree` take any branch name, so `planning-<today>-<description>` needs nothing from them.
- The branch gate in step 1 of `add-ticket`, `refine-ticket`, `refine-vision` and `refine-coding-standards` (line 19 of each) still matches `planning-<YYYY-MM-DD>` (optionally `-<N>`) and invokes `jodysalt:start-planning-session` with no argument. Until the next slice widens it, a session on a new-shaped branch such as `planning-2026-10-21-glossary-terms` is offered the planning session again by those four; the driver declines and continues, as `deliver-brief` step 4 and `complete-ticket-slice` step 4 already do. No other skill matches the pattern: `wrap-up-worktree` step 3 and `complete-ticket` step 1 tell a planning branch from a ticket branch by whether `docs/tickets/open/<branch>` exists, so a branch of the new shape lands through `wrap-up-worktree` unchanged.
- The run that drafts this slice is itself on `planning-branch-description`, a ticket branch; the gate offered and was declined.

# Scope

In:
- **`## Description` argument section** in `skills/start-planning-session/SKILL.md` between the heading paragraph and `## Steps`, in `add-worktree`'s shape: `$ARGUMENTS`; the description is required and is normalized to kebab-case the way `add-worktree` normalizes a typed name (`Glossary terms` becomes `glossary-terms`), with no length cap and no vocabulary; when empty, ask once with `AskUserQuestion`, before anything is created, with a recommended answer and the built-in "Other" for a typed description. An `argument-hint` line in the frontmatter, as `add-worktree` has.
- **Step 1 widened.** Stop when the current branch matches `planning-<YYYY-MM-DD>` followed by anything, so `planning-2026-10-21-glossary-terms`, `planning-2026-10-21-glossary-terms-2` and a pre-upgrade `planning-2026-10-21` or `planning-2026-10-21-2` all count as a started session.
- **Step 3 keyed on the description.** When `git worktree list` registers `.claude/worktrees/planning-<today>-<description>`, join it and say so. Otherwise the next free name: `planning-<today>-<description>`, then `planning-<today>-<description>-2`, `-3`, and so on, checked against `git branch --list --all` and `ls .claude/worktrees/` as today, so a branch left without a worktree yields to the suffix. A different description on the same day never matches and gets its own worktree. Steps 4 to 6 pass the chosen name to `add-worktree` and `enter-worktree` as today.
- **Steering.** The frontmatter description and the `README.md` row for `start-planning-session` name the required description and the `planning-<YYYY-MM-DD>-<description>` pattern, keeping the "Use when" triggers and the escalation sentence.

Out:
- The branch gate in `add-ticket`, `refine-ticket`, `refine-vision` and `refine-coding-standards`: they keep matching the old pattern and invoking the skill with no argument, so by that route the skill asks. The next slice widens the gate and passes the derived description.
- `.claude-plugin/plugin.json` to `0.15.0`; the parent's release slice.
- Any eval; the vision reserves them for the risky skills. Pushing.
- Renaming or migrating a bare-date worktree; any change to `add-worktree`, `enter-worktree` or `wrap-up-worktree`; a length cap or vocabulary for the description; `deliver-brief`.

# Acceptance criteria
- In a throwaway repo on `main` with `claude --plugin-dir` pointed at this slice's worktree, `/jodysalt:start-planning-session glossary terms` creates and enters `.claude/worktrees/planning-<today>-glossary-terms` on the branch `planning-<today>-glossary-terms`, forked from `main`, with no question asked; `git branch --show-current` there prints the name.
- `/jodysalt:start-planning-session` with no argument asks for a description once, with a recommended answer, before `add-worktree` is invoked; `git worktree list` is unchanged until the answer lands.
- `/jodysalt:start-planning-session glossary terms` again, from `main`, joins the existing worktree and says so; `/jodysalt:start-planning-session vision` the same day creates `.claude/worktrees/planning-<today>-vision` beside the first, and `git worktree list` registers both.
- With the branch `planning-<today>-glossary-terms` existing and no worktree registered for it (`git worktree remove` after the first run), `/jodysalt:start-planning-session glossary terms` creates `.claude/worktrees/planning-<today>-glossary-terms-2` on the branch of that name.
- Inside a `planning-<today>-glossary-terms` worktree, and inside a pre-upgrade `planning-<today>` worktree, `/jodysalt:start-planning-session` stops at step 1 without asking for a description or creating anything.
- `grep -c 'planning-<YYYY-MM-DD>-<description>' skills/start-planning-session/SKILL.md` is at least 2, one hit in the `description:` line; `README.md` line 46 names the required description and the same pattern; `grep -n '^argument-hint:' skills/start-planning-session/SKILL.md` prints one line; `grep -n '^## Description' skills/start-planning-session/SKILL.md` prints one line above `## Steps`.
- `claude plugin validate skills --strict` passes.
- `git diff --stat` against the parent branch lists exactly `skills/start-planning-session/SKILL.md` and `README.md`, this ticket's own files aside; `.claude-plugin/plugin.json` still reads `0.14.0`; `git diff -U0 skills/ | grep '^[-+]description:'` touches `start-planning-session` only, and `README.md`'s diff touches line 46 only.
- Nothing is pushed.

# Implementation notes
- **Argument section.** Insert after the `# Start planning session` paragraph, which now says the session goes into a `planning-<DATE>-<description>` worktree:

  ```markdown
  ## Description

  $ARGUMENTS

  What this session plans, required: the branch and worktree are `planning-<YYYY-MM-DD>-<description>`. Normalize it to kebab-case (`Glossary terms` becomes `glossary-terms`). If empty, ask once with `AskUserQuestion` before creating anything. The recommended answer is the subject the escalating skill holds when one escalated here (the ticket's input, the ticket's slug, `vision`, `coding-standards`); by hand with nothing said, run `ls docs/tickets/open/` and offer one option per open ticket slug, most recently modified first, the first recommended. The built-in "Other" option covers a typed description, so don't add one.
  ```

  The recommended answer is settled by the parent's "as `add-worktree` asks for a branch": an escalating skill's subject when one escalated, so the question agrees with the argument the next slice makes the four gates pass; otherwise the open ticket slugs most recently modified first, the first recommended, mirroring `add-worktree`'s `## Branch` section.
- **Frontmatter.** `argument-hint: "[description – what this session plans, e.g. glossary terms]"` under `description:`. Rewrite `description:` to open "Starts a planning session by creating a fresh `planning-<YYYY-MM-DD>-<description>` branch, the description required, as a git worktree at `.claude/worktrees/planning-<YYYY-MM-DD>-<description>` via `add-worktree` (suffixed `-<N>` when that name is taken)", then "Joins the worktree of the same description instead when today already has one", keeping the "Use when" triggers, the escalation sentence and the closing "never" clause as they are.
- **Step 1.** "If the current branch already matches `planning-<YYYY-MM-DD>` followed by anything (e.g. `planning-2026-10-21-glossary-terms`, `planning-2026-10-21-glossary-terms-2`, or a pre-upgrade `planning-2026-10-21`), stop; the session is already started." The stop comes before the ask, so an empty argument on a planning branch asks nothing.
- **Step 3.** "**Pick the name.** If `git worktree list` has `.claude/worktrees/planning-<today>-<description>`, take it and say the session is joining it. Otherwise the next free name: `planning-<today>-<description>`, then `planning-<today>-<description>-2`, `-3`, and so on, checking `git branch --list --all` and `ls .claude/worktrees/`." The join is the exact match only, as the parent's *Join only an exact match* says: a registered `planning-<today>-<description>-2` is not joined, so with the branch `planning-<today>-<description>` left bare a rerun creates `-3`. Today's join-the-highest-suffix rule goes; the suffix is only ever the next free name.
- **Steps 2, 4, 5, 6 and the rules** stay word for word; `add-worktree` and `enter-worktree` take the new name as any other.
- **README row.** Line 46: "Creates a fresh `planning-<YYYY-MM-DD>-<description>` branch as a worktree via `add-worktree`, the description required, and switches the session into it via `enter-worktree`, so planning docs are drafted there. Joins the worktree of the same description when today already has one."
- **Not touched.** The four escalating skills, `plugin.json`, `add-worktree`, `enter-worktree`, `wrap-up-worktree`.

# Test plan
- `claude plugin validate skills --strict`.
- The `grep` checks above on `skills/start-planning-session/SKILL.md` and `README.md`; `git diff --stat` and `git diff -U0 skills/ | grep '^[-+]description:'` against the parent branch; `grep '"version"' .claude-plugin/plugin.json` still `0.14.0`.
- Manual, throwaway repo scaffolded with `setup-skills` with `claude --plugin-dir` pointed at this slice's worktree, each acceptance criterion in turn: with `glossary terms`, with no argument (answer the question, check nothing was created before it), a rerun with the same description from `main`, `vision` the same day, `git worktree remove` then the same description again for `-2`, and the no-op inside a new-shaped and a bare-date worktree.
- No eval suite.

# Rollout
- Lands on the parent `planning-branch-description` branch as one commit; no release until the parent lands with its `0.15.0` bump. Between this slice and the next, the four escalating skills keep offering the planning session on a new-shaped branch and keep invoking the skill with no argument, so the skill asks; the driver declines or answers, nothing breaks. A bare-date worktree passes the widened step 1 and lands through `wrap-up-worktree` unchanged. Fallback is reverting the commit.

## Strategic fit
Advances `planning-branch-description` by delivering the skill the parent is about: the description is required, the name carries it, the join and the collision suffix key on it, and the skill's own steering says so, leaving the parent only the four gates that pass the description, the version bump and the validate pass.
