# Tasks

## Write skills/rebase-worktree/SKILL.md with frontmatter, ## Worktree, enter, guards, ancestor check, rebase, conflict handling, report and Rules as docs/tickets/closed/rebase-worktree--core-skill/index.md Scope lists
- **category:** functional
- **status:** done
- **steps:**
  - `grep -c 'rebase the worktree\|rebase X onto main\|update the branch from main\|/rebase-worktree\|argument-hint' skills/rebase-worktree/SKILL.md` finds the frontmatter's trigger phrases and `argument-hint`, and the `description` says it never pushes or fetches.
  - `grep -n 'jodysalt:enter-worktree\|rebase-merge\|merge-base --is-ancestor\|diff-filter=U\|--ours\|--theirs\|rebase --abort\|GIT_EDITOR=true git rebase --continue\|force-with-lease\|untested' skills/rebase-worktree/SKILL.md` shows each step's command, and no line outside `## Rules` and the `--force-with-lease` note runs `git push` or `git fetch`.
  - `claude plugin validate skills --strict` passes.

## Add a rebase-worktree row to the README.md skills table, in alphabetical order, summarising its description
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n 'rebase-worktree' README.md` shows one table row between its alphabetical neighbours.
  - `claude plugin validate .` passes.
- **notes:**
  - The worktree-isolated session refuses compound Bash commands (`cd … && …`, heredocs); run each command alone with absolute paths, e.g. `claude plugin validate /Users/jody/software/skills/.claude/worktrees/rebase-worktree--core-skill`.

## Run full test suite for rebase-worktree--core-skill
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills`) and confirm both pass.
  - `git diff --stat rebase-worktree` lists exactly `skills/rebase-worktree/SKILL.md` and `README.md`, besides `docs/tickets/closed/rebase-worktree--core-skill/`.
- **notes:**
  - The worktree-isolated session refuses compound Bash commands (`cd … && …`, heredocs); run each command alone with absolute paths, or `git -C <worktree path> …` for git.
  - `claude plugin validate .` exits 0 but prints two pre-existing warnings (root `CLAUDE.md` not loaded, `ICON_MISSING`); they are not failures.
