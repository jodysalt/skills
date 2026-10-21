# Tasks

## Add a required `## Description` argument section to skills/start-planning-session/SKILL.md and key steps 1 and 3 on it
- **category:** functional
- **status:** done
- **steps:**
  - Edit `skills/start-planning-session/SKILL.md` body only (frontmatter untouched in this task). Change the `# Start planning session` paragraph to say the session goes into a `planning-<DATE>-<description>` worktree. Insert between that paragraph and `## Steps` a `## Description` section holding `$ARGUMENTS` on its own line, then one paragraph: the description is required and the branch and worktree are `planning-<YYYY-MM-DD>-<description>`; normalize it to kebab-case (`Glossary terms` becomes `glossary-terms`); if empty, ask once with `AskUserQuestion` before creating anything; the recommended answer is the subject the escalating skill holds when one escalated here (the ticket's input, the ticket's slug, `vision`, `coding-standards`), and by hand with nothing said run `ls docs/tickets/open/` and offer one option per open ticket slug, most recently modified first, the first recommended; the built-in "Other" option covers a typed description, so don't add one.
  - Rewrite step 1 to: stop when the current branch already matches `planning-<YYYY-MM-DD>` followed by anything (e.g. `planning-2026-10-21-glossary-terms`, `planning-2026-10-21-glossary-terms-2`, or a pre-upgrade `planning-2026-10-21`); the stop comes before the ask, so an empty argument on a planning branch asks nothing.
  - Rewrite step 3 to: if `git worktree list` has `.claude/worktrees/planning-<today>-<description>`, take it and say the session is joining it; otherwise the next free name is `planning-<today>-<description>`, then `planning-<today>-<description>-2`, `-3`, and so on, checking `git branch --list --all` and `ls .claude/worktrees/`. The join is the exact match only; a registered `planning-<today>-<description>-2` is not joined. Drop today's join-the-highest-suffix rule.
  - Leave steps 2, 4, 5, 6 and the `## Rules` section word for word.
  - Verify: `grep -n '^## Description' skills/start-planning-session/SKILL.md` prints one line and its number is below that of `grep -n '^## Steps'`; `grep -c 'planning-<today>-<description>' skills/start-planning-session/SKILL.md` is at least 2; `grep -c 'highest-numbered' skills/start-planning-session/SKILL.md` prints 0.
  - Verify: `git diff --stat` lists only `skills/start-planning-session/SKILL.md`.

## Rewrite the `description:` and add `argument-hint:` in skills/start-planning-session/SKILL.md frontmatter, and update its README.md row
- **category:** chore
- **status:** done
- **steps:**
  - In the frontmatter of `skills/start-planning-session/SKILL.md`, rewrite `description:` to open "Starts a planning session by creating a fresh `planning-<YYYY-MM-DD>-<description>` branch, the description required, as a git worktree at `.claude/worktrees/planning-<YYYY-MM-DD>-<description>` via `add-worktree` (suffixed `-<N>` when that name is taken) and switching the session into it via `enter-worktree`, so planning docs are drafted there while the main checkout stays where it is. Joins the worktree of the same description instead when today already has one." Keep the existing "Use when ..." triggers, the escalation sentence naming `add-ticket`, `refine-ticket`, `refine-coding-standards` and `refine-vision`, and the closing "Refreshes ... never pushes, merges, checks out, or removes anything." sentence as they are.
  - Add directly under `description:` the line `argument-hint: "[description – what this session plans, e.g. glossary terms]"`, matching the shape of the `argument-hint` line in `skills/add-worktree/SKILL.md`.
  - In `README.md`, replace the `start-planning-session` row's second cell (line 46 today; find it with `grep -n 'start-planning-session' README.md`) with: "Creates a fresh `planning-<YYYY-MM-DD>-<description>` branch as a worktree via `add-worktree`, the description required, and switches the session into it via `enter-worktree`, so planning docs are drafted there. Joins the worktree of the same description when today already has one." Keep the first cell's link as it is.
  - Verify: `grep -n '^argument-hint:' skills/start-planning-session/SKILL.md` prints one line; `grep -c 'planning-<YYYY-MM-DD>-<description>' skills/start-planning-session/SKILL.md` is at least 2 with one hit on the `description:` line (`grep -c '^description:.*planning-<YYYY-MM-DD>-<description>'` prints 1); `grep -c 'planning-<YYYY-MM-DD>-<description>' README.md` prints 1 and `git diff -U0 README.md | grep -c '^[-+][^-+]'` prints 2.
  - Verify: `git diff -U0 skills/ | grep '^[-+]description:'` names only `start-planning-session`'s line, and `grep '"version"' .claude-plugin/plugin.json` still prints `0.14.0`.
- **notes:**
  - `grep -c` counts matching lines, not occurrences: the body holds `planning-<YYYY-MM-DD>-<description>` on exactly one line (the `## Description` paragraph), so the "at least 2" check needs the `description:` line to carry it too.

## Run full test suite for planning-branch-description--required-description
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
