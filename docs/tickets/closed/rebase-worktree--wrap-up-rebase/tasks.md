# Tasks

## In skills/wrap-up-worktree/SKILL.md drop the is-ancestor guard and its "on purpose" sentence, add a Rebase step invoking jodysalt:rebase-worktree between Squash and Leave, renumber steps 1–9 with their cross-references, and update the intro, description, report and Rules as docs/tickets/closed/rebase-worktree--wrap-up-rebase/index.md Scope lists
- **category:** functional
- **status:** done
- **steps:**
  - `grep -n "is-ancestor\|rebasing by hand\|on purpose\|a base branch that moved" skills/wrap-up-worktree/SKILL.md` prints nothing.
  - `grep -n "^[0-9]\. \*\*\|jodysalt:rebase-worktree\|step [0-9]" skills/wrap-up-worktree/SKILL.md` shows steps 1–9 in the order close, squash, rebase, exit, merge, remove, report, the rebase step saying a stop keeps the worktree and branch and a rerun is safe, every "step N" naming the step it meant before, and a Rules line "rebases only through `jodysalt:rebase-worktree`" with "rebases" gone from the never-list.

## In skills/merge-worktree/SKILL.md point step 3's ancestor stop and the Rules line at /jodysalt:rebase-worktree <name>, keeping it fast-forward only
- **category:** functional
- **status:** done
- **steps:**
  - `grep -n "rebasing by hand\|user's to rebase" skills/merge-worktree/SKILL.md` prints nothing, and `grep -c "/jodysalt:rebase-worktree <name>" skills/merge-worktree/SKILL.md` prints 2.

## In skills/deliver-brief/SKILL.md make step 6 say the root runs wrap-up-worktree unattended so a rebase conflict aborts and ends the run with the stop report, and let the base-change rule allow the rebase inside jodysalt:wrap-up-worktree only
- **category:** functional
- **status:** done
- **steps:**
  - `grep -n "rebase" skills/deliver-brief/SKILL.md` shows step 6's abort-and-stop-report sentence and a Rules line allowing the rebase inside `jodysalt:wrap-up-worktree` that still forbids a merge commit, a reset and a checkout.

## Drop "a base branch that moved" from the wrap-up-worktree row in README.md to match its description
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n "wrap-up-worktree" README.md` shows the row without "a base branch that moved".

## Run full test suite for rebase-worktree--wrap-up-rebase
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills`) and confirm both pass; the existing `ICON_MISSING` and root `CLAUDE.md` warnings are not failures.
  - `git diff --stat rebase-worktree` lists exactly `skills/wrap-up-worktree/SKILL.md`, `skills/merge-worktree/SKILL.md`, `skills/deliver-brief/SKILL.md` and `README.md`, besides `docs/tickets/closed/rebase-worktree--wrap-up-rebase/`.
