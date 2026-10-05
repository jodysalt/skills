# Tasks

## Make `skills/complete-task/SKILL.md` leave handover notes on the later tasks that need what its worker learned
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/complete-task/SKILL.md`: step 2 reads the entry's `steps`, `category` and `notes`, the notes being context with the same standing as `index.md` while `steps` stay the acceptance criteria, so a note that conflicts with a step is a contradiction for step 3 and the step wins. A new step 5, **Hand over**, sits between **Implement** and **Mark done**: scan every entry below this one whose status line is `- **status:** pending` and, on each one that needs a fact this worker had to discover, append that fact as a sub-bullet under its `- **notes:**` bullet, creating the bullet last in the entry after `steps` when it is missing, one fact per sub-bullet, appending to an existing bullet rather than adding a second and never removing or rewriting another worker's sub-bullet. What counts: where a thing lives (a path, a symbol, a test directory that isn't where you'd look), a command that works and its quirks, a judgment call that now constrains the later task, a setup or environment gotcha; never what the heading, the steps, `index.md` or `CLAUDE.md` already say, and never a narrative of what this worker did, which the commit holds. Trim with the 80/20 principle: a few sub-bullets, never longer than the entry's own steps. A note is a hint, never a backlog edit: the later entry's heading, `category`, `status` and `steps` stay as `add-tasks` wrote them, a later task is never marked done because this change already satisfies it, and a stale step is still that worker's contradiction to report. Done entries and this worker's own entry never gain notes; zero notes is a fine outcome, never reported as a gap. The old step 5 becomes 6, **Mark done**, saying to touch nothing else in `tasks.md` beyond what step 5 wrote; the old step 6 becomes 7, **Commit**, whose failure path reverts the notes along with the status flip so `tasks.md` holds neither; the old step 7 becomes 8, **Report**, adding one line per later task heading annotated. Rules gain: never changes a later entry's heading, `category`, `status` or `steps`; a note is additive and never removes or rewrites another worker's. The `description`'s last sentence, "Never touches a second task, never pushes.", becomes one saying it leaves handover notes on later tasks and never changes a second task's status or steps, never pushes.
  - `grep -c 'Touch nothing else' skills/complete-task/SKILL.md` prints 0, `grep -c 'Hand over' skills/complete-task/SKILL.md` prints 1, and `grep -c '\*\*notes:\*\*' skills/complete-task/SKILL.md` prints at least 1.
  - `claude plugin validate skills --strict` passes.

## Make the worker prompt in `skills/complete-tasks/SKILL.md` ask for the later task headings the worker left notes on
- **category:** functional
- **status:** done
- **steps:**
  - In step 2 of `skills/complete-tasks/SKILL.md`, the worker prompt's final sentence, "Your final message must state the task heading you worked on, what changed, whether every step was satisfied, and any judgment calls you made on ambiguous steps.", gains ", and which later task headings you left notes on" before its full stop. Nothing else in the file changes: `git diff --stat` lists only that file with one insertion and one deletion.
  - `grep -c 'left notes on' skills/complete-tasks/SKILL.md` prints 1.

## Make `skills/add-tasks/SKILL.md` name `- **notes:**` as a fourth bullet only the loop's workers write
- **category:** chore
- **status:** done
- **steps:**
  - In step 2 of `skills/add-tasks/SKILL.md`, between the entry-shape code block and the **Heading** bullet, one new bullet, **notes:**, says a `- **notes:**` bullet is a fourth, last bullet that `complete-task` workers append to later pending entries as handover from what they learned, that this skill never writes one, and that dedup stays on the H2 heading. The code block and the rest of the file are unchanged, so entries this skill writes still have exactly three bullets.
  - `grep -c '\*\*notes:\*\*' skills/add-tasks/SKILL.md` prints 1, and that line is outside the code block.
  - `claude plugin validate skills --strict` passes.
- **notes:**
  - Entry 1's steps in this `tasks.md` quote the pending status line verbatim, so an unanchored first-match substitution for the status flip edits that step instead of a status line; anchor the match to the whole line or edit under the heading, and check the diff shows one hunk.

## Update the `complete-task` row in the `README.md` skills table to say it leaves handover notes on later tasks
- **category:** chore
- **status:** done
- **steps:**
  - The `complete-task` row in `README.md` says it implements the first pending entry in a ticket's `tasks.md`, flips it to `done`, commits via `commit`, and leaves handover notes on the later tasks that need what it learned, running unattended; no other row changes.
  - `grep -c 'handover notes' README.md` prints 1.
- **notes:**
  - Entry 1's steps in this `tasks.md` quote the pending status line verbatim, so an unanchored first-match substitution for the status flip edits that step instead of a status line; anchor the match to the whole line or edit under the heading, and check the diff shows one hunk.

## Bump `.claude-plugin/plugin.json` to version `0.6.0`
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c '"version": "0.6.0"' .claude-plugin/plugin.json` prints 1 and nothing else in the file changed.
  - `claude plugin validate .` passes; `--strict` is not used on the root because it turns the warning about `CLAUDE.md` at the plugin root into a failure, and that file is this repo's project context rather than plugin content.
- **notes:**
  - Entry 1's steps in this `tasks.md` quote the pending status line verbatim, so an unanchored first-match substitution for the status flip edits that step instead of a status line; anchor the match to the whole line or edit under the heading, and check the diff shows one hunk.

## Walk `skills/complete-task/SKILL.md` by hand in a throwaway repo and confirm every handover case
- **category:** functional
- **status:** done
- **steps:**
  - Read `complete-task` from this checkout's `skills/complete-task/SKILL.md` and follow it by hand, playing the worker, rather than invoking the installed plugin, whose copy predates these edits; `setup-skills`, `commit`, `close-ticket` and `wrap-up-worktree` are unchanged by this ticket and may be invoked as `jodysalt:<name>`. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow `skills/setup-skills/SKILL.md` as written, write `lib/greet.txt` holding `hello`, write `docs/tickets/open/demo-ticket/index.md` with `title: Demo ticket` and `type: feat` and no `initiative:`, and a `tasks.md` of three `pending` entries in the `add-tasks` shape: (1) "Move `lib/greet.txt` to `src/greet.txt` with `git mv`", step `test -f src/greet.txt && ! test -e lib/greet.txt`; (2) "Add a `LICENSE` file holding the MIT licence text", step `grep -c 'MIT License' LICENSE` prints 1; (3) "Append the line `bye` to `greet.txt`", step "the last line of `greet.txt` is `bye`", naming no directory. Commit everything, then `git worktree add .claude/worktrees/demo-ticket -b demo-ticket main` and work inside that worktree from here on.
  - Commit failure first: install a pre-commit hook that exits 1 at `$(git rev-parse --git-common-dir)/hooks/pre-commit`, follow `complete-task` on entry 1, and confirm the commit is refused and afterwards `git diff -- docs/tickets/open/demo-ticket/tasks.md` is empty: no `notes` bullet and no status flip. Remove the hook and `git reset --hard`. Then follow it on entry 1 for real: entry 3 ends with a `- **notes:**` bullet whose one sub-bullet says `greet.txt` now lives at `src/greet.txt`, entry 2 is untouched, every `status` line is unchanged apart from entry 1's flip to `done`, `git show HEAD -- docs/tickets/open/demo-ticket/tasks.md` contains the note alongside the move, and the report names entry 3's heading as annotated. Then follow it on entry 2: `git show HEAD -- docs/tickets/open/demo-ticket/tasks.md` shows one removed and one added line, both its status flip, and the report lists no annotated heading without calling that a gap.
  - Append case, on a branch: `git checkout -b variant HEAD~1`, replace entry 2's heading and step with "Make `src/greet.txt` read-only with `chmod 444`", step `test ! -w src/greet.txt`, commit that edit, and follow `complete-task` on it: entry 3's existing `- **notes:**` bullet gains a second sub-bullet saying the file is read-only and needs `chmod u+w` before a write, the first sub-bullet stays verbatim, and `grep -c '\*\*notes:\*\*' docs/tickets/open/demo-ticket/tasks.md` prints 1. Then `git checkout demo-ticket`, `chmod 644 src/greet.txt`, `git branch -D variant`, and follow `complete-task` on entry 3: the plan's bullets take `src/greet.txt` from the note, the worker runs no `find` or `ls` to locate the file, and the last line of `src/greet.txt` is `bye`. Before and after each of the three real runs, `diff` copies of `tasks.md` and confirm every hunk is the worked entry's status flip or an added `notes` line, so every later entry's heading, `category`, `status` and `steps` lines are byte-identical.
  - With all three entries `done`, follow `wrap-up-worktree` from inside the worktree with no argument: its guard passes with `notes` present, `main` ends one commit ahead, `docs/tickets/closed/demo-ticket/tasks.md` on `main` still holds the `- **notes:**` bullet and `docs/tickets/open/demo-ticket/` does not exist. Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.
- **notes:**
  - Entry 1's steps in this `tasks.md` quote the pending status line verbatim, so an unanchored first-match substitution for the status flip edits that step instead of a status line; anchor the match to the whole line or edit under the heading, and check the diff shows one hunk.

## Run full test suite for task-handover-notes
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate .` and confirm it passes; the root run skips `--strict` because of the root `CLAUDE.md` warning.
  - Run `claude plugin validate skills --strict` and confirm it passes.
- **notes:**
  - Entry 1's steps in this `tasks.md` quote the pending status line verbatim, so an unanchored first-match substitution for the status flip edits that step instead of a status line; anchor the match to the whole line or edit under the heading, and check the diff shows one hunk.
