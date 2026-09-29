# Tasks

## Create `skills/merge-worktree/SKILL.md` that fast-forwards a worktree's branch into local `main`
- **category:** functional
- **status:** done
- **steps:**
  - `claude plugin validate skills --strict` passes with the new skill, whose frontmatter has `name: merge-worktree`, a `description` naming the trigger phrases "merge the worktree", "merge X into main", "land the X branch" and `/merge-worktree` and stating fast-forward only, never pushes, never removes, and an `argument-hint` of `"[worktree name – defaults to the worktree just left, else a pick from the existing worktrees]"`.
  - `grep -c 'git merge --ff-only' skills/merge-worktree/SKILL.md` prints at least 1, and the body has, in this order: a `## Worktree` section (the argument is a name under `.claude/worktrees/`; empty means the worktree just left, else `AskUserQuestion` with one option per registered worktree under `.claude/worktrees/`, never the main checkout); Steps that (1) invoke `jodysalt:exit-worktree` when `git rev-parse --show-toplevel` isn't the first path in `git worktree list`, remembering the name, (2) resolve the name to `<main checkout>/.claude/worktrees/<name>` and its branch from `git worktree list`, stopping when unregistered, (3) run the guards in parallel and stop at the first failure with its reason: main checkout `git status --porcelain` empty, `git -C <worktree> status --porcelain` empty, branch not `main`, `git rev-list --count main..<branch>` above 0 else "nothing to merge", `git merge-base --is-ancestor main <branch>` true else "needs rebasing by hand", (4) `git merge --ff-only <branch>` from the main checkout, (5) report `git log -1 --stat` and the commit count, mention `jodysalt:squash-commits` when the count was above 1, and offer `jodysalt:remove-worktrees <name>` without running it; and Rules: never stash, reset, force or `--no-ff`; never pushes or fetches; never removes a worktree or deletes a branch; local `main` is the only target.
  - `grep -c 'jodysalt:exit-worktree' skills/merge-worktree/SKILL.md` and `grep -c 'jodysalt:remove-worktrees' skills/merge-worktree/SKILL.md` each print at least 1.

## Add the `merge-worktree` row to the skills table in `README.md`
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c '\[`merge-worktree`\](./skills/merge-worktree/SKILL.md)' README.md` prints 1, the row sits between the `list-worktrees` and `refine-initiative` rows to keep the table alphabetical, and its description matches the table's style: fast-forwards a worktree's branch into local `main` after exiting the worktree, refuses a dirty checkout or a `main` that moved, never pushes, leaves removal to `remove-worktrees`.

## Bump `.claude-plugin/plugin.json` to version `0.2.0`
- **category:** chore
- **status:** done
- **steps:**
  - `grep -c '"version": "0.2.0"' .claude-plugin/plugin.json` prints 1 and nothing else in the file changed.
  - `claude plugin validate . --strict` passes.

## Walk `skills/merge-worktree/SKILL.md` step by step in a throwaway repo and confirm every guard
- **category:** functional
- **status:** done
- **steps:**
  - In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, one commit, `git worktree add .claude/worktrees/feature -b feature main`, two commits on `feature`. Following the skill's steps exactly as written, with `feature` as the argument, from the main checkout: `main` ends at `feature`'s tip (`git rev-parse main` equals `git rev-parse feature`), the worktree and branch still exist, and the report gives a count of 2 and mentions `squash-commits`.
  - In the same repo, run the skill's steps once per guard and confirm each stops with its reason and leaves `git rev-parse main` unchanged. First `git reset --hard HEAD~2` in the main checkout so `feature` is ahead again. Then, undoing each setup before the next: `touch dirty` in the main checkout; `touch dirty` inside the worktree; a new commit on `main` that `feature` lacks, undone with `git reset --hard HEAD~1`; `git worktree add -f .claude/worktrees/onmain main` and the name `onmain`; the name `nosuch`. Last, merge `feature` for real and run again to get "nothing to merge".
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Run full test suite for merge-worktree
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate . --strict` and confirm it passes.
  - Run `claude plugin validate skills --strict` and confirm it passes.
