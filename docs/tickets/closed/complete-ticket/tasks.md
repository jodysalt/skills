# Tasks

## Create `skills/complete-ticket/SKILL.md`, a skill that takes an open ticket from the base branch through its worktree, a just-in-time `add-tasks` and its commit to the end of the Ralph loop, and add its `README.md` row
- **category:** functional
- **status:** done
- **steps:**
  - Write `skills/complete-ticket/SKILL.md` in the house style `skills/add-skill/SKILL.md` describes and `skills/complete-tasks/SKILL.md` shows: frontmatter `name: complete-ticket`, an `argument-hint` like `complete-tasks`', and a `description` saying it takes an open ticket from the base branch to a finished backlog in one command – adds and enters the ticket's worktree when needed, breaks it into tasks with `add-tasks` when it has none and commits them, then runs `complete-tasks` – with the triggers "complete the ticket", "implement X", "start work on X", "work on the X ticket" and `/complete-ticket`, and the nevers: never pushes, never wraps up or merges, never lands a planning branch, never pauses between the tasks and the loop.
  - Body: `## Ticket` resolves `$ARGUMENTS` exactly as `skills/complete-tasks/SKILL.md`'s `## Ticket` does (slug, directory or file; empty takes the current branch's ticket, else the only open ticket, else `ls docs/tickets/open/` and ask; a closed ticket stops it). `## Steps`, numbered: (1) **Guard** – `docs/tickets/open/{slug}/index.md` must exist in the main checkout, the first path in `git worktree list`; otherwise stop, change nothing, and say to land the planning branch that holds it with `jodysalt:wrap-up-worktree` first. (2) **Worktree** – if `git rev-parse --show-toplevel` already equals `<main checkout>/.claude/worktrees/{slug}`, skip; else if that path is registered in `git worktree list`, invoke `jodysalt:enter-worktree {slug}`; else invoke `jodysalt:exit-worktree` when the session is inside another worktree, then `jodysalt:add-worktree {slug}` (declining its offer to enter), then `jodysalt:enter-worktree {slug}`. (3) **Tasks** – if `docs/tickets/open/{slug}/tasks.md` is missing, invoke `jodysalt:add-tasks {slug}`, then `jodysalt:commit` staging only that ticket's `tasks.md` (and a spike's `findings.md` when `add-tasks` created it) with the subject `docs: added tasks for {slug}`, so the loop starts on a clean tree; an existing `tasks.md` skips this step and is never appended to. (4) **Loop** – invoke `jodysalt:complete-tasks {slug}`; on its first failed task stop with its report, leaving the worktree in place. (5) **Report** – the loop's summary, whether tasks were written in step 3, and a suggestion to run `jodysalt:wrap-up-worktree`. `## Rules`: only orchestrates – never implements, edits `tasks.md` itself, spawns workers itself (`complete-tasks` does), asks a question between steps, wraps up, merges or pushes.
  - Add a `README.md` row for `complete-ticket` in the `## Skills` table, in alphabetical order after `complete-task` and before `complete-tasks`, summarising the description in one or two sentences in the style of the neighbouring rows.
  - `grep -c 'complete-ticket' README.md` prints at least 1, and `claude plugin validate skills --strict` passes.

## Make `skills/add-tasks/SKILL.md` add a one-line nudge toward `complete-ticket` to its report when run off the ticket's own branch
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/add-tasks/SKILL.md` step 6 (**Report**), append a sentence: when `git branch --show-current` is not `{slug}`, the report ends with one line saying tasks are best written on the ticket's own branch just before the loop runs, so changes landing in between can't make them stale, and that `jodysalt:complete-ticket {slug}` does that. The tasks are still written as before; nothing else in the skill changes, its `description` and `README.md` row included.
  - `grep -c 'complete-ticket' skills/add-tasks/SKILL.md` prints 1 and `git diff --stat -- skills/add-tasks/SKILL.md` shows only that file changed by a few lines.
  - `claude plugin validate skills --strict` passes.

## Make `skills/add-ticket/SKILL.md` and `skills/refine-ticket/SKILL.md` end by naming commit, `wrap-up-worktree` and `complete-ticket` as the next steps instead of leaving `add-tasks` to be suggested
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/add-ticket/SKILL.md`, add a step 8 after step 7: **Hand off.** Once `grill-me` closes, end with the next steps in order: `jodysalt:commit` (a `docs:` commit); on a planning branch, land it with `jodysalt:wrap-up-worktree`; then `/jodysalt:complete-ticket {slug}`, which breaks the ticket into tasks on its own branch just before the loop. Never suggest `jodysalt:add-tasks` here.
  - In `skills/refine-ticket/SKILL.md`, step 7 keeps "Stop. Leave the edits uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit)." and gains the same two following steps: on a planning branch, `jodysalt:wrap-up-worktree`; then `/jodysalt:complete-ticket {slug}` when the ticket has no `tasks.md` yet or pending tasks.
  - `grep -c 'complete-ticket' skills/add-ticket/SKILL.md skills/refine-ticket/SKILL.md` prints at least 1 for each file, and `grep -c 'add-tasks' skills/add-ticket/SKILL.md` prints 1 (only the new "never suggest" sentence).
  - `claude plugin validate skills --strict` passes.

## Rewrite the workflow sentence in `skills/setup-skills/SKILL.md`'s `CLAUDE.md` block, this repo's `CLAUDE.md` and `README.md` to point at `complete-ticket` instead of `add-tasks` and `complete-tasks`
- **category:** chore
- **status:** done
- **steps:**
  - In `skills/setup-skills/SKILL.md` step 4's block and in `CLAUDE.md` line 3, replace "Draft with `/jodysalt:add-ticket`, break a ticket down with `/jodysalt:add-tasks`, and run the loop with `/jodysalt:complete-tasks`." with "Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which breaks the ticket into tasks on its own branch just before running the loop." The two lines stay identical to each other.
  - In `README.md`'s `## Workflow` paragraph (line 7), replace "draft with `add-ticket`, break a ticket down with `add-tasks`, and run the loop with `complete-tasks`." with "draft with `add-ticket`, then implement it with `complete-ticket`, which breaks the ticket into tasks on its own branch just before running the loop."
  - `grep -c 'complete-ticket' CLAUDE.md skills/setup-skills/SKILL.md` prints 1 for each file, and `diff <(sed -n 3p CLAUDE.md) <(grep -m1 'Draft with' skills/setup-skills/SKILL.md | sed 's/^ *//')` prints nothing.
  - `claude plugin validate skills --strict` passes.

## Make `skills/deliver-brief/SKILL.md` run one `complete-ticket` stage per ticket in place of its `add-tasks` and `complete-tasks` stages
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/deliver-brief/SKILL.md`: the `description` says "breaks it down and runs the loop" in substance, as today. `## Stages and the root` lists the stages as the scout, `refine-vision`, `add-ticket`, `complete-ticket`, the judge and `close-ticket`. Step 3's resume cursor bullet says the ticket continues at step 5 when it has no `tasks.md` or a pending entry (entering its existing worktree when one exists), and at step 5's judge when every entry is done; the clause "with no `tasks.md`, at step 4 from `add-tasks` on" and "The brief's ticket itself, with no open sub-ticket and no `tasks.md`, continues at step 4 from `add-tasks` on like any other" go, the latter becoming step 5. Step 4 loses its `add-tasks` stage bullet, so a planning session drafts docs only. Step 5's second bullet becomes a `complete-ticket` stage, `jodysalt:complete-ticket` with the slug as its argument, spawned after the root's `add-worktree`/`enter-worktree` so it starts in the ticket's worktree and needs no switch; it writes and commits the tasks when there are none and runs the loop, and its first failed task ends the run as the `complete-tasks` stage's does today. The cap-count and checks-for-the-person bullet reads the `complete-ticket` stage's report. Step 5's pick paragraph's "Then step 4 from `add-tasks` on for the new sub-ticket, a planning session as step 4 describes, and step 5 for it" becomes "Then step 5 for the new sub-ticket", and the parent-judge paragraph's "the `add-ticket` stage taking the pick … and `add-tasks` following, then step 5" drops "and `add-tasks` following". The root still runs every worktree skill itself and never invokes `complete-ticket` in its own transcript.
  - `grep -c 'add-tasks' skills/deliver-brief/SKILL.md` prints 0, `grep -c 'complete-tasks' skills/deliver-brief/SKILL.md` prints 0, and `grep -c 'complete-ticket' skills/deliver-brief/SKILL.md` prints at least 3.
  - Update `deliver-brief`'s `README.md` row only if its `description` changed, to match it.
  - `claude plugin validate skills --strict` passes.

## Bump `.claude-plugin/plugin.json` to `0.10.0`
- **category:** chore
- **status:** done
- **steps:**
  - Set `"version": "0.10.0"` in `.claude-plugin/plugin.json`; nothing else in the file changes.
  - `grep -c '"version": "0.10.0"' .claude-plugin/plugin.json` prints 1 and `claude plugin validate .` passes.

## Walk the new `skills/complete-ticket/SKILL.md`, the `add-tasks` nudge and the `add-ticket` hand-off by hand in a throwaway repo
- **category:** functional
- **status:** done
- **steps:**
  - In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow this checkout's `skills/setup-skills/SKILL.md` by hand, write a small `docs`-type ticket at `docs/tickets/open/hello/index.md` (adding a `HELLO.md` file), and commit. From the main checkout, follow this checkout's `skills/complete-ticket/SKILL.md` for `hello`: it creates and enters `.claude/worktrees/hello`, writes `tasks.md` by following this checkout's `skills/add-tasks/SKILL.md` with no nudge in its report, commits it as `docs: added tasks for hello`, runs the loop to the end with no question, and suggests `wrap-up-worktree`. The `CLAUDE.md` block names `complete-ticket`.
  - Draft a second ticket `bye` on a `planning-<date>` worktree without landing it, and follow `complete-ticket` for `bye`: it stops before changing anything and points at `wrap-up-worktree`. Land it, then from inside the planning worktree follow `complete-ticket` again: it exits that worktree first and ends in `.claude/worktrees/bye`. Commit a third ticket `third` on `main`, then from the main checkout follow `add-tasks` for `third` and confirm the tasks are written and the report carries the nudge naming `complete-ticket`.
  - Follow this checkout's `skills/add-ticket/SKILL.md` to its end for a throwaway ticket and confirm it names `commit`, `wrap-up-worktree` and `/jodysalt:complete-ticket {slug}` and not `add-tasks`.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this entry's status line.
- **notes:**
  - The `add-tasks` nudge sits at the end of step 6 (**Report**) of `skills/add-tasks/SKILL.md` and fires only when `git branch --show-current` differs from the slug, so `hello` on its own branch shows none and `third` on `main` does.

## Walk the edited `skills/deliver-brief/SKILL.md` by hand in a throwaway repo, including an interruption and a resume
- **category:** functional
- **status:** done
- **steps:**
  - Follow `deliver-brief` from this checkout's `skills/deliver-brief/SKILL.md` by hand, playing the root, with each stage an Agent told to read this checkout's `skills/<name>/SKILL.md` for the skill it invokes, and the root-run skills followed from this checkout too. In a fresh directory under the session's scratchpad, not this repo, scaffolded and with a vision filled by hand, the brief "a Node package exposing `slugify(text)` in `index.js` with a test in `test.js` run by `npm test`": the run spawns no `add-tasks` or `complete-tasks` stage and one `complete-ticket` stage per ticket; `git log --format=%s --name-only` on `main` shows no planning commit touching a `tasks.md`; the ticket closes and `npm test` passes.
  - Run it again for a second brief, stopping it by hand after its planning session lands and before the `complete-ticket` stage, then run it with no brief: it resumes at step 5 in the ticket's worktree and finishes.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this entry's status line.
- **notes:**
  - The session's sandbox refuses compound or `cd`-then-`git` commands in the scratchpad repo; plain single `git -C <literal absolute path> …` calls run fine, and files are best written with the Write tool.
  - Entering a worktree by hand works with `cd <absolute path>` (enter-worktree's no-tool fallback); `.claude/worktrees/` sits under the throwaway repo itself, so `rm -rf` of the repo removes every worktree with it.

## Run full test suite for complete-ticket
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate .` and confirm it passes.
  - Run `claude plugin validate skills --strict` and confirm it passes.
