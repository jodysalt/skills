---
title: Task Handover Notes
type: feat
priority: high
---

# Goal
A worker that has just finished a task leaves what it learned on the later tasks that need it, so the next fresh-context worker starts from that instead of rediscovering it. Each Ralph iteration spends its context window on the task, not on re-reading the repo to find what the previous iteration already found: where a thing lives, which command works and how, which judgment call now constrains the rest of the backlog.

# Context
- `skills/complete-task/SKILL.md` runs in a fresh context with no chat history. Step 2 reads the entry's `steps` and `category`, the sibling `index.md`, the initiative and `CLAUDE.md`; step 5 flips the status line and says "Touch nothing else in `tasks.md`"; step 6 makes one commit via `commit`, staging the task's files plus `tasks.md`, and reverts the status flip when the commit fails for good; step 7 reports the heading, what changed, and the judgment calls. Its `description` says it never touches a second task.
- `skills/add-tasks/SKILL.md` fixes the entry shape: an H2 heading plus `- **category:**`, `- **status:**` and `- **steps:**` bullets, and no others. It is append-only, dedups on the H2 heading, and says the loop owns transitions.
- Only `- **status:**` is read by the loop (`complete-tasks` steps 1 and 3), `close-ticket`'s guard and `wrap-up-worktree`'s guard. A new bullet on an entry breaks none of them.
- `skills/complete-tasks/SKILL.md` never edits `tasks.md`; workers own all file changes. Its check after each worker is the noted entry `done` and a clean tree, which a note written before the worker's commit satisfies. Its worker prompt fixes what the worker's final message must state, and its summary carries the workers' judgment calls for the user's return-and-inspect pass.
- `skills/deliver-brief/SKILL.md` reads only the `complete-tasks` stage report, so it needs no change.
- `plugin.json` is `0.5.0`; the version bumps on any change to a skill's behaviour. `README.md` lists every skill in a table, and `claude plugin validate . --strict` and `claude plugin validate skills --strict` gate the manifest and frontmatter.
- No eval suites exist yet; the *Evals for the risky skills* bet in `vision.md` owns them, and `complete-task` is named there.

# Scope

In:
- Notes live on the task entries themselves: a worker appends a `- **notes:**` bullet to the specific pending entries below its own in `docs/tickets/open/{slug}/tasks.md` that need them, so a later worker reads its own entry and gets only the notes meant for it. The bullet is the last in the entry, after `steps`, with one fact per sub-bullet. An entry that already has one gets sub-bullets appended to it, never a second bullet, and no worker removes or rewrites another worker's note.
- The worker scans every pending entry after its own and annotates only those where it holds a fact that worker would otherwise rediscover. Zero notes is a fine outcome, never reported as a gap. Done entries, and the worker's own entry, never gain notes.
- A note is a fact the worker had to discover and the later task will need: where a thing lives (a path, a symbol, the test directory that isn't where you'd look), a command that works and its quirks, a judgment call that now constrains the later task, a setup or environment gotcha. Never what the heading, the steps, `index.md` or `CLAUDE.md` already say, and never a narrative of what the worker did; the commit holds that. The 80/20 principle trims each entry's notes to the vital few: a few bullets, never longer than the entry's own steps.
- A note is a hint, never a backlog edit: it adds facts and leaves a later entry's heading, `category`, `status` and `steps` as `add-tasks` wrote them. The later worker reads its entry's notes in step 2 as context with the same standing as `index.md`; its `steps` stay the acceptance criteria. Where a note and a step conflict, the step wins and the worker stops on the contradiction as it does today.
- The notes are written in a new step between implement and mark-done, so they ride in the task's one commit with `tasks.md` already staged. When the commit fails for good, the worker reverts the notes along with the status flip, so nothing is left in the tree.
- The worker's own entry's notes stay in place as part of the ticket's record.
- The worker's report gains one line per later heading it annotated, and the loop's worker prompt asks for it. The loop summary stays as it is; the notes are in `tasks.md` and in git.
- `complete-task`'s `description` says it never changes a second task's status or steps, in place of never touching one; step 5's "touch nothing else" admits what the hand-over step wrote.
- `add-tasks` names `notes` as a fourth bullet that only the loop writes: it never writes one, and dedup stays on the heading.
- `README.md`'s `complete-task` row says it leaves handover notes on later tasks. `plugin.json` to `0.6.0`.

Out:
- A shared notes file beside `tasks.md`, or notes written into `index.md`; a later worker reads nothing new.
- Rewriting a later entry's `steps` to carry what was learned, amending a step the worker's own change made stale, or marking a later task done because the worker's change already satisfies it. A stale step is still a contradiction for the later worker to report; a later task still earns its own commit.
- Changes to `complete-tasks` beyond the worker prompt's final-message line, and any change to `close-ticket`, `wrap-up-worktree` or `deliver-brief`.
- Eval suites; those belong to the *Evals for the risky skills* bet.

# Acceptance criteria
- In a throwaway repo with a three-entry `tasks.md`, following `complete-task` by hand on the first entry, whose work turns up a fact the third needs: the third entry ends with a `- **notes:**` bullet holding that fact, the second entry is untouched, every `status` line is unchanged apart from the first entry's flip to `done`, and the note is in the first entry's single commit.
- Run on an entry with nothing worth passing on, the only change to `tasks.md` is its status flip, and the report lists no annotated heading without calling that a gap.
- Run on the third entry afterwards, the worker's plan uses the note's fact rather than rediscovering it.
- A note on an entry that already has a `notes` bullet appends a sub-bullet; the earlier note stays verbatim.
- Every later entry's heading, `category`, `status` and `steps` lines are identical before and after a worker run.
- With the commit failing, `tasks.md` holds no note and no status flip afterwards.
- `close-ticket` closes a ticket whose done entries carry `notes`, and `wrap-up-worktree`'s guard passes on it.
- `skills/complete-task/SKILL.md`: step 2 reads the entry's `notes`; a hand-over step sits between implement and mark-done and spells out the filter and the hint-only rule; step 5 admits what it wrote; step 6's failure path reverts the notes; step 7 reports the annotated headings; the `description` says it never changes a second task's status or steps; `grep -c 'Touch nothing else' skills/complete-task/SKILL.md` prints 0.
- `skills/complete-tasks/SKILL.md`: the worker prompt asks for the later task headings the worker left notes on, and nothing else in the file changes.
- `skills/add-tasks/SKILL.md` names `- **notes:**` as a bullet only the loop writes and still writes entries of three bullets.
- `README.md`'s `complete-task` row mentions handover notes, `plugin.json` is `0.6.0`, and both `claude plugin validate` commands pass with `--strict`.
- Nothing is pushed.

# Implementation notes
- `skills/complete-task/SKILL.md`: step 2 reads `steps`, `category` and `notes`. A new step 5, **Hand over**, before the status flip: for every pending entry below this one, append to its `- **notes:**` (creating the bullet last in the entry when missing) the facts this worker had to discover and that entry will need, with the filter and the hint-only rule from `# Scope` written out; zero notes is fine. The old step 5 becomes 6, saying "touch nothing else in `tasks.md` beyond what step 5 wrote"; the commit step's failure path reverts the notes with the status flip; the report step adds the annotated headings. Rules gain: never changes a later entry's heading, `category`, `status` or `steps`; a note is additive and never removes or rewrites another worker's. The `description`'s last sentence changes to match.
- `skills/complete-tasks/SKILL.md`: the worker prompt's final-message sentence adds "and which later task headings you left notes on".
- `skills/add-tasks/SKILL.md`: after the entry shape in step 2, one line saying `- **notes:**` is a fourth bullet the loop's workers append to later entries and `add-tasks` never writes.
- `README.md`: the `complete-task` row. `.claude-plugin/plugin.json`: `0.6.0`.

# Test plan
- `claude plugin validate . --strict` and `claude plugin validate skills --strict` pass.
- Manual, throwaway repo: `git init`, the layout from `setup-skills`, a ticket with a three-entry `tasks.md` whose first task moves a file the third task's steps name by its old location, then each acceptance case in turn, following the edited `skills/complete-task/SKILL.md` from this checkout by hand rather than the installed plugin's copy: the first entry leaves a note on the third, an entry with nothing to pass on flips only its status, the third entry's worker uses the note, a second note appends to the first, later entries' other lines are identical before and after, a forced commit failure leaves no note, and `close-ticket` and `wrap-up-worktree`'s guard pass with notes present.
- Manual, this repo: the rollout run below.

# Rollout
- Bump `plugin.json` to `0.6.0`; merging to `main` is the release, and users on auto-update get the skill at their next session. No flags or migrations; fallback is reverting the commit.
- The ticket's own loop is the skill's first run: `add-tasks` puts the `complete-task` edit first, and `claude --plugin-dir .claude/worktrees/task-handover-notes` with `/jodysalt:complete-tasks task-handover-notes` runs the rest of the backlog with the edited worker, so later tasks in this ticket get notes from earlier ones.

## Strategic fit
Stands on its own. It serves the *Unattended work needs structure* problem in `vision.md`: each task still stands alone, and the fresh session it runs in now starts with what the previous session learned instead of re-exploring the repo. It applies *Trim with the 80/20 principle* to the handover itself, so the notes stay the vital few, and keeps *One thing, then stop*: the worker still does one task, and the notes are that one job's handover rather than a second task. It respects the *A home for standalone skills* non-goal by changing a method skill rather than adding one.
