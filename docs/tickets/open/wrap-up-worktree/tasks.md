# Tasks

## Make `skills/close-ticket/SKILL.md` refuse a ticket whose `tasks.md` has an entry not `done`
- **category:** functional
- **status:** pending
- **steps:**
  - Step 1's guard in `skills/close-ticket/SKILL.md` gains a third stop: `docs/tickets/open/{slug}/tasks.md` holds an entry whose `- **status:**` is anything but `done`; list the unfinished headings and change nothing. No `tasks.md` at all is fine, and done entries stay in the file. The `description` frontmatter says it refuses while a task is not done, and the skill still never commits. `grep -c 'done' skills/close-ticket/SKILL.md` rises by at least 2 from before the edit.
  - `claude plugin validate skills --strict` passes.

## Create `skills/wrap-up-worktree/SKILL.md` that lands a finished worktree on local `main` in one command
- **category:** functional
- **status:** pending
- **steps:**
  - `claude plugin validate skills --strict` passes with the new skill, whose frontmatter has `name: wrap-up-worktree`, a `description` naming the trigger phrases "wrap up the worktree", "land this worktree", "finish this branch" and `/wrap-up-worktree`, saying it closes the ticket on a ticket branch, squashes, merges fast-forward only and removes the worktree and its branch, refuses on a dirty checkout, a `main` that moved or a pending task, and never pushes; and an `argument-hint` of `"[worktree name – defaults to the worktree the session is in, else a pick from the existing worktrees]"`.
  - The body has, in this order: a `## Worktree` section (a name under `.claude/worktrees/`; empty means the worktree the session is in; empty from the main checkout means `AskUserQuestion` with one option per registered worktree under `.claude/worktrees/` labelled with name and branch, never the main checkout, and none means say so and stop); Steps that (1) invoke `jodysalt:enter-worktree <name>` when the session isn't already in the named worktree, from the main checkout or another worktree; (2) run the guards in parallel before anything changes and stop at the first failure with its reason: `git status --porcelain` empty in the worktree and in the main checkout (the first path in `git worktree list`), the main checkout has `main` checked out, the branch is not `main`, `git rev-list --count main..<branch>` above 0 else say there is nothing to merge and offer `jodysalt:remove-worktrees <name>` without running it, `git merge-base --is-ancestor main <branch>` true else "needs rebasing by hand", and when `docs/tickets/open/<branch>/` exists (a ticket branch) every entry in its `tasks.md` is `done`, else list the unfinished headings; with a sentence saying these duplicate `merge-worktree`'s guards on purpose so a stop comes before the close commit and the squash; (3) on a ticket branch, invoke `jodysalt:close-ticket <branch>` then `jodysalt:commit` staging `docs/tickets/open/<branch>`, `docs/tickets/closed/<branch>` and every file `close-ticket` reported rewriting, subject `docs: closed the <branch> ticket`; any other branch skips this step; (4) `jodysalt:squash-commits`; (5) `jodysalt:exit-worktree`; (6) `jodysalt:merge-worktree <name>`, and if it stops, stop here, keeping the worktree and branch; (7) `jodysalt:remove-worktrees <name>`, answering yes to deleting the branch; (8) report `git log -1 --stat` on `main`, the references the close rewrote, and a mention of `jodysalt:close-initiative` when every ticket in the owning initiative's `## Tickets` list is now closed, never run. Rules: never pushes, fetches, stashes, rebases, resets or forces; never removes a worktree before a successful merge; never closes an initiative.
  - `grep -c 'jodysalt:' skills/wrap-up-worktree/SKILL.md` prints at least 7, and each of `jodysalt:enter-worktree`, `jodysalt:close-ticket`, `jodysalt:commit`, `jodysalt:squash-commits`, `jodysalt:exit-worktree`, `jodysalt:merge-worktree` and `jodysalt:remove-worktrees` appears.

## Make `skills/deliver-brief/SKILL.md` land every branch through `jodysalt:wrap-up-worktree`
- **category:** functional
- **status:** pending
- **steps:**
  - In `skills/deliver-brief/SKILL.md`: the stage list near the top drops `wrap-up-ticket`; the root-run list gains `jodysalt:wrap-up-worktree`; step 4's closing `squash-commits`, `exit-worktree`, `merge-worktree <planning worktree name>` and `remove-worktrees <name>` sequence becomes `jodysalt:wrap-up-worktree <planning worktree name>` in the root, a merge that cannot fast-forward still stopping the run with a report; step 5's `wrap-up-ticket` stage and the squash/exit/merge/remove bullet after it become one root bullet, `jodysalt:wrap-up-worktree <slug>`, which closes the ticket, folds the task commits and the close into one commit and lands it, its `close-initiative` mention ignored because the judge decides in step 6; step 6's **Done** planning session ends with `jodysalt:wrap-up-worktree <planning worktree name>` in place of the same four; and step 3's resume cursor says a ticket with every entry done continues at step 5 from `wrap-up-worktree` on. The resume rule that runs `merge-worktree` then `remove-worktrees` on a leftover worktree stays as it is, as does the rule that `main` changes only through `jodysalt:merge-worktree`.
  - `grep -c 'wrap-up-ticket' skills/deliver-brief/SKILL.md` prints 0 and `grep -c 'wrap-up-worktree' skills/deliver-brief/SKILL.md` prints at least 5.
  - `claude plugin validate skills --strict` passes.

## Retire `wrap-up-ticket`: delete `skills/wrap-up-ticket/`, swap its `README.md` row for `wrap-up-worktree`, and rewrite its mention in `docs/initiatives/open/hands-off-delivery.md`
- **category:** chore
- **status:** pending
- **steps:**
  - `skills/wrap-up-ticket/` no longer exists. In `README.md` the `wrap-up-ticket` row is replaced, in the same place so the table stays alphabetical, by `| [\`wrap-up-worktree\`](./skills/wrap-up-worktree/SKILL.md) | ... |` whose description, in the table's style, says it closes the ticket on a ticket branch, squashes, fast-forwards the branch into local `main` and removes the worktree and its branch, refusing a dirty checkout, a `main` that moved or a pending task. In the `## Outcome` of `docs/initiatives/open/hands-off-delivery.md`, the clause "code lands on a ticket branch through `add-worktree`, `complete-tasks` and `wrap-up-ticket`; every branch ends with `squash-commits`, so it reaches `main` as one commit through a new `merge-worktree` skill, fast-forward only, after which `remove-worktrees` clears the worktree and its branch" says instead that code lands through `add-worktree` and `complete-tasks`, and every branch ends with `wrap-up-worktree`, which squashes it to one commit, fast-forwards it into `main` through `merge-worktree` and clears the worktree and branch with `remove-worktrees`; the paragraph naming the fourth ticket keeps its mention of `wrap-up-ticket` retiring. Closed tickets are not touched.
  - `grep -rn 'wrap-up-ticket' skills README.md` prints nothing, and `grep -c 'wrap-up-ticket' docs/initiatives/open/hands-off-delivery.md` prints 1.

## Bump `.claude-plugin/plugin.json` to version `0.4.0`
- **category:** chore
- **status:** pending
- **steps:**
  - `grep -c '"version": "0.4.0"' .claude-plugin/plugin.json` prints 1 and nothing else in the file changed.
  - `claude plugin validate . --strict` passes.

## Walk `skills/wrap-up-worktree/SKILL.md` step by step in a throwaway repo and confirm every path and guard
- **category:** functional
- **status:** pending
- **steps:**
  - Read `close-ticket` and `wrap-up-worktree` from this checkout's `skills/<name>/SKILL.md` and follow them by hand rather than invoking the installed plugin, whose copy predates these edits; the other skills they call are unchanged and may be invoked as `jodysalt:<name>`. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow `skills/setup-skills/SKILL.md` as written, write `docs/initiatives/open/demo.md` with `title: Demo`, a one-line `## Outcome` and a `## Tickets` section listing `docs/tickets/open/demo-ticket/index.md`, write that ticket with `type: feat`, `initiative: demo` and a `tasks.md` of two entries, and commit everything. `git worktree add .claude/worktrees/demo-ticket -b demo-ticket main`, two commits on it, both entries set to `done`. Following `wrap-up-worktree` from inside that worktree with no argument: `main` ends one commit ahead holding the work, `docs/tickets/closed/demo-ticket/` exists and `docs/tickets/open/demo-ticket/` does not, `demo.md` lists the `closed/` path, the session is in the main checkout, `git worktree list` and `git branch --list demo-ticket` show nothing for `demo-ticket`, and the report mentions `close-initiative`.
  - In the same repo, confirm each stop leaves `git rev-parse main` unchanged and the worktree in place, undoing each setup before the next: a ticket worktree with a `pending` entry (the unfinished heading is listed); `touch dirty` inside the worktree; `touch dirty` in the main checkout; a commit on `main` the branch lacks ("needs rebasing by hand"); a worktree with no commits ahead ("nothing to merge", `remove-worktrees` offered, not run). Then a planning worktree `planning-2026-01-01` with two commits, landed from the main checkout by name, lands as one commit touching no ticket; a second planning worktree landed from the main checkout with no argument is offered in a pick that excludes the main checkout; and a ticket worktree whose close was committed before a stop lands on re-run with the close skipped. Last, `close-ticket` alone on a ticket with a `pending` entry stops and lists it.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Run full test suite for wrap-up-worktree
- **category:** chore
- **status:** pending
- **steps:**
  - Run `claude plugin validate . --strict` and confirm it passes.
  - Run `claude plugin validate skills --strict` and confirm it passes.
