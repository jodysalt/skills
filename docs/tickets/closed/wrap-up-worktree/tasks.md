# Tasks

## Make `skills/close-ticket/SKILL.md` refuse a ticket whose `tasks.md` has an entry not `done`
- **category:** functional
- **status:** done
- **steps:**
  - Step 1's guard in `skills/close-ticket/SKILL.md` gains a stop: `docs/tickets/open/{slug}/tasks.md` holds an entry whose `- **status:**` is anything but `done`; list the unfinished headings and change nothing. No `tasks.md` at all is fine, and done entries stay in the file. The `description` frontmatter says it refuses while a task is not done, and the skill still never commits.
  - `claude plugin validate skills --strict` passes.

## Create `skills/remove-worktree/SKILL.md` that removes one worktree and deletes its merged branch unasked
- **category:** functional
- **status:** done
- **steps:**
  - `claude plugin validate skills --strict` passes with the new skill, whose frontmatter has `name: remove-worktree`, a `description` naming the trigger phrases "remove this worktree", "remove the X worktree", "delete the worktree for X" and `/remove-worktree`, saying it removes one worktree under `.claude/worktrees/` and deletes its branch with the safe `git branch -d` when merged, keeps an unmerged branch, refuses a dirty worktree, never forces and never pushes; and an `argument-hint` of `"[worktree name – defaults to the worktree the session is in]"`.
  - The body has, in this order: a `## Worktree` section (a name under `.claude/worktrees/`; empty means the worktree the session is in; empty from the main checkout means say a name is needed and suggest `jodysalt:list-worktrees`, then stop); Steps that (1) resolve the name to `<main checkout>/.claude/worktrees/<name>` and its branch from `git worktree list`, invoking `jodysalt:exit-worktree` first when the session is inside that worktree; (2) stop with the reason, changing nothing, when the path isn't registered, is the main checkout, or `git -C <path> status --porcelain` is not empty; (3) `git worktree remove .claude/worktrees/<name>`, and on a "Permission denied" on `node_modules` run `chmod -R -N .claude/worktrees/<name>` and retry; (4) `git branch -d <branch>`, and when git refuses it as unmerged keep the branch and say so; (5) report what was removed and what was kept. Rules: never `--force`, never `-D`, never the main checkout, never pushes or touches a remote, never edits docs.
  - `grep -c -- '--force\|-D' skills/remove-worktree/SKILL.md` finds them only in the Rules line that forbids them.

## Make `skills/remove-worktrees/SKILL.md` remove each picked worktree through `jodysalt:remove-worktree`
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/remove-worktrees/SKILL.md`: the `## Worktrees` candidate pick and the stale-directory handling (`git worktree prune`, confirm then `rm -rf`) stay; each picked registered worktree is removed by invoking `jodysalt:remove-worktree <name>`; the dirty-worktree `--force` question goes, and a dirty pick is reported and skipped with a pointer at `git worktree remove --force` by hand; the step 4 branch-deletion question and its `-D` path go, since `remove-worktree` deletes merged branches and keeps unmerged ones; the report lists what each `remove-worktree` call removed and kept. The `description` frontmatter drops "deletes branches only on opt-in" and the force confirmation, and says it delegates to `remove-worktree` and prunes stale leftovers.
  - `grep -c 'jodysalt:remove-worktree ' skills/remove-worktrees/SKILL.md` prints at least 1, and `grep -c 'git branch -d\|git worktree remove \.' skills/remove-worktrees/SKILL.md` prints 0.
  - `claude plugin validate skills --strict` passes.

## Create `skills/wrap-up-worktree/SKILL.md` that lands a finished worktree on local `main` in one command
- **category:** functional
- **status:** done
- **steps:**
  - `claude plugin validate skills --strict` passes with the new skill, whose frontmatter has `name: wrap-up-worktree`, a `description` naming the trigger phrases "wrap up the worktree", "land this worktree", "finish this branch" and `/wrap-up-worktree`, saying it closes the ticket on a ticket branch, squashes, merges fast-forward only and removes the worktree and its branch, refuses on a dirty checkout, a `main` that moved or a pending task, and never pushes; and an `argument-hint` of `"[worktree name – defaults to the worktree the session is in, else a pick from the existing worktrees]"`.
  - The body has, in this order: a `## Worktree` section (a name under `.claude/worktrees/`; empty means the worktree the session is in; empty from the main checkout means `AskUserQuestion` with one option per registered worktree under `.claude/worktrees/` labelled with name and branch, never the main checkout, and none means say so and stop); Steps that (1) invoke `jodysalt:enter-worktree <name>` when the session isn't already in the named worktree, from the main checkout or another worktree; (2) run the guards in parallel before anything changes and stop at the first failure with its reason: `git status --porcelain` empty in the worktree and in the main checkout (the first path in `git worktree list`), the main checkout has `main` checked out, the branch is not `main`, `git rev-list --count main..<branch>` above 0 else say there is nothing to merge and offer `jodysalt:remove-worktree <name>` without running it, `git merge-base --is-ancestor main <branch>` true else "needs rebasing by hand", and when `docs/tickets/open/<branch>/` exists (a ticket branch) every entry in its `tasks.md` is `done`, else list the unfinished headings; with a sentence saying these duplicate `merge-worktree`'s guards on purpose so a stop comes before the close commit and the squash; (3) on a ticket branch, invoke `jodysalt:close-ticket <branch>` then `jodysalt:commit` staging `docs/tickets/open/<branch>`, `docs/tickets/closed/<branch>` and every file `close-ticket` reported rewriting, subject `docs: closed the <branch> ticket`; any other branch skips this step; (4) `jodysalt:squash-commits`; (5) `jodysalt:exit-worktree`; (6) `jodysalt:merge-worktree <name>`, and if it stops, stop here, keeping the worktree and branch; (7) `jodysalt:remove-worktree <name>`; (8) report `git log -1 --stat` on `main`, the references the close rewrote, and a mention of `jodysalt:close-initiative` when every ticket in the owning initiative's `## Tickets` list is now closed, never run. Rules: never pushes, fetches, stashes, rebases, resets or forces; never removes a worktree before a successful merge; never closes an initiative.
  - Each of `jodysalt:enter-worktree`, `jodysalt:close-ticket`, `jodysalt:commit`, `jodysalt:squash-commits`, `jodysalt:exit-worktree`, `jodysalt:merge-worktree` and `jodysalt:remove-worktree ` appears in `skills/wrap-up-worktree/SKILL.md`, and `grep -c 'remove-worktrees' skills/wrap-up-worktree/SKILL.md` prints 0.

## Make `skills/deliver-brief/SKILL.md` land every branch through `jodysalt:wrap-up-worktree` and remove leftovers through `jodysalt:remove-worktree`
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/deliver-brief/SKILL.md`: the stage list near the top drops `wrap-up-ticket`; the root-run list gains `jodysalt:wrap-up-worktree` and names `jodysalt:remove-worktree` in place of `jodysalt:remove-worktrees`; the paragraph on answering root-run skills drops "yes to deleting its branch", since nothing asks; step 3's resume rule runs `jodysalt:merge-worktree <name>` then `jodysalt:remove-worktree <name>` on a leftover worktree with commits not on `main`, otherwise unchanged; step 3's resume cursor says a ticket with every entry done continues at step 5 from `wrap-up-worktree` on; step 4's closing squash/exit/merge/remove sequence becomes `jodysalt:wrap-up-worktree <planning worktree name>` in the root, a merge that cannot fast-forward still stopping the run with a report; step 5's `wrap-up-ticket` stage and the squash/exit/merge/remove bullet after it become one root bullet, `jodysalt:wrap-up-worktree <slug>`, which closes the ticket, folds the task commits and the close into one commit and lands it, its `close-initiative` mention ignored because the judge decides in step 6; and step 6's **Done** planning session ends with `jodysalt:wrap-up-worktree <planning worktree name>` in place of the same four. The scaffold path in step 3 for a repository missing `docs/vision.md` names `remove-worktree` wherever it named `remove-worktrees`. The rule that `main` changes only through `jodysalt:merge-worktree` stays.
  - `grep -c 'wrap-up-ticket\|remove-worktrees\|yes to deleting' skills/deliver-brief/SKILL.md` prints 0, and `grep -c 'wrap-up-worktree' skills/deliver-brief/SKILL.md` prints at least 5.
  - `claude plugin validate skills --strict` passes.

## Point `merge-worktree` and the worktree skills' removal pointers at `jodysalt:remove-worktree`
- **category:** chore
- **status:** done
- **steps:**
  - `skills/merge-worktree/SKILL.md` offers `jodysalt:remove-worktree <name>` after the merge, in step 5 and in its `description` and Rules, in place of `remove-worktrees`. The removal pointers in `skills/exit-worktree/SKILL.md`, `skills/add-worktree/SKILL.md`, `skills/enter-worktree/SKILL.md`, `skills/start-planning-session/SKILL.md` and `skills/show-worktree/SKILL.md` name `jodysalt:remove-worktree`; `skills/list-worktrees/SKILL.md` names `jodysalt:remove-worktree` for removal and keeps `jodysalt:remove-worktrees` for stale directories.
  - `grep -rln 'remove-worktrees' skills` prints only `skills/remove-worktrees/SKILL.md`, `skills/list-worktrees/SKILL.md` and, until the retire task runs, `skills/wrap-up-ticket/SKILL.md` if it names it.
  - `claude plugin validate skills --strict` passes.

## Retire `wrap-up-ticket`: delete `skills/wrap-up-ticket/`, update the `README.md` skills table, and rewrite the `hands-off-delivery` outcome's chain clause
- **category:** chore
- **status:** done
- **steps:**
  - `skills/wrap-up-ticket/` no longer exists. In the `README.md` skills table, kept alphabetical: the `wrap-up-ticket` row is replaced by a `wrap-up-worktree` row saying it closes the ticket on a ticket branch, squashes, fast-forwards the branch into local `main` and removes the worktree and its branch, refusing a dirty checkout, a `main` that moved or a pending task; a new `remove-worktree` row sits before `remove-worktrees`, saying it removes one worktree and deletes its branch when merged, never forcing; and the `remove-worktrees` row says it removes picked worktrees through `remove-worktree` and prunes stale leftovers. In the `## Outcome` of `docs/initiatives/closed/hands-off-delivery.md`, the clause "code lands on a ticket branch through `add-worktree`, `complete-tasks` and `wrap-up-ticket`; every branch ends with `squash-commits`, so it reaches `main` as one commit through a new `merge-worktree` skill, fast-forward only, after which `remove-worktrees` clears the worktree and its branch" says instead that code lands through `add-worktree` and `complete-tasks`, and every branch ends with `wrap-up-worktree`, which squashes it to one commit, fast-forwards it into `main` through `merge-worktree` and clears the worktree and branch with `remove-worktree`; the paragraph naming the fourth ticket keeps its mention of `wrap-up-ticket` retiring. Closed tickets are not touched.
  - `grep -rn 'wrap-up-ticket' skills README.md` prints nothing; `grep -c 'wrap-up-ticket' docs/initiatives/closed/hands-off-delivery.md` prints 1; `grep -c 'remove-worktrees' docs/initiatives/closed/hands-off-delivery.md` prints 0; `grep -c '\[`remove-worktree`\]' README.md` prints 1.

## Bump `.claude-plugin/plugin.json` to version `0.4.0`
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c '"version": "0.4.0"' .claude-plugin/plugin.json` prints 1 and nothing else in the file changed.
  - `claude plugin validate . --strict` passes.

## Walk `skills/remove-worktree/SKILL.md` and `skills/remove-worktrees/SKILL.md` step by step in a throwaway repo
- **category:** functional
- **status:** done
- **steps:**
  - Read `remove-worktree`, `remove-worktrees` and `exit-worktree` from this checkout's `skills/<name>/SKILL.md` and follow them by hand rather than invoking the installed plugin, whose copy predates these edits. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, one commit, then worktrees under `.claude/worktrees/` for `merged` (branch fast-forwarded into `main`), `unmerged` (one commit not on `main`) and `dirty` (an untracked file). Following `remove-worktree`: `merged` goes with its branch and no question; `unmerged` goes, its branch stays and the report says so; `dirty` stops with the reason and nothing changes; and, entered with `cd` and run with no name, a fresh merged worktree is exited first and removed.
  - Following `remove-worktrees` with two fresh merged worktrees, `dirty`, and a stale directory `mkdir .claude/worktrees/stale` picked together: both merged worktrees and their branches go through `remove-worktree`, no branch question is asked, `dirty` is skipped and reported with the `--force` pointer, and `stale` is pruned.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Walk `skills/wrap-up-worktree/SKILL.md` step by step in a throwaway repo and confirm every path and guard
- **category:** functional
- **status:** done
- **steps:**
  - Read `close-ticket`, `remove-worktree` and `wrap-up-worktree` from this checkout's `skills/<name>/SKILL.md` and follow them by hand rather than invoking the installed plugin, whose copy predates these edits; `commit`, `squash-commits`, `enter-worktree`, `exit-worktree` and `merge-worktree` behave as the installed copies do, apart from the offer `merge-worktree` makes, and may be invoked as `jodysalt:<name>`. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow `skills/setup-skills/SKILL.md` as written, write `docs/initiatives/open/demo.md` with `title: Demo`, a one-line `## Outcome` and a `## Tickets` section listing `docs/tickets/open/demo-ticket/index.md`, write that ticket with `type: feat`, `initiative: demo` and a `tasks.md` of two entries, and commit everything. `git worktree add .claude/worktrees/demo-ticket -b demo-ticket main`, two commits on it, both entries set to `done`. Following `wrap-up-worktree` from inside that worktree with no argument: `main` ends one commit ahead holding the work, `docs/tickets/closed/demo-ticket/` exists and `docs/tickets/open/demo-ticket/` does not, `demo.md` lists the `closed/` path, the session is in the main checkout, `git worktree list` and `git branch --list demo-ticket` show nothing for `demo-ticket`, no question was asked on the way, and the report mentions `close-initiative`.
  - In the same repo, confirm each stop leaves `git rev-parse main` unchanged and the worktree in place, undoing each setup before the next: a ticket worktree with a `pending` entry (the unfinished heading is listed); `touch dirty` inside the worktree; `touch dirty` in the main checkout; a commit on `main` the branch lacks ("needs rebasing by hand"); a worktree with no commits ahead ("nothing to merge", `remove-worktree` offered, not run). Then a planning worktree `planning-2026-01-01` with two commits, landed from the main checkout by name, lands as one commit touching no ticket; a second planning worktree landed from the main checkout with no argument is offered in a pick that excludes the main checkout; and a ticket worktree whose close was committed before a stop lands on re-run with the close skipped. Last, `close-ticket` alone on a ticket with a `pending` entry stops and lists it.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Run full test suite for wrap-up-worktree
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate . --strict` and confirm it passes.
  - Run `claude plugin validate skills --strict` and confirm it passes.
