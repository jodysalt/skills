# Tasks

## In skills/rebase-worktree/SKILL.md add a Re-verify step between the conflict step and the report that, after a completed rebase in a sandbox-opted-in repo, runs "the tests" through jodysalt:run-in-sandbox and stops on failure with the rebased branch kept, else reports untested; renumber to 1–7 and update the report, description and Rules as docs/tickets/closed/rebase-worktree--sandbox-reverify/index.md Scope lists
- **category:** functional
- **status:** done
- **steps:**
  - `grep -n "^[0-9]\. \*\*\|run-in-sandbox\|Dockerfile.sandbox\|Placeholder\|untested on the new base\|host\|step [0-9]" skills/rebase-worktree/SKILL.md` shows steps 1–7 with the re-verify as step 6, step 4's clean finish naming step 6, the opt-in test, "the tests" through `jodysalt:run-in-sandbox` waited for, the failure and no-Docker stops keeping the rebased branch, the not-opted-in untested note, and a Rules line forbidding running the tests on the host.
  - `grep -n "tasks.md\|Run full test suite" skills/rebase-worktree/SKILL.md` prints nothing.

## In skills/wrap-up-worktree/SKILL.md add "a failing re-verify" to step 5's rebase-worktree stops, keeping the worktree and branch and telling the person to fix the failures before a rerun, and make step 9 relay the re-verify result or the untested note
- **category:** functional
- **status:** done
- **steps:**
  - `grep -n "re-verify\|untested" skills/wrap-up-worktree/SKILL.md` shows step 5's failing-re-verify stop and step 9's relay of the re-verify result or the untested note.

## Mention the sandbox re-verify in the rebase-worktree row of README.md and bump .claude-plugin/plugin.json version to 0.20.0
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n "rebase-worktree" README.md` shows the row mentioning the sandbox re-verify, and `grep -n '"version": "0.20.0"' .claude-plugin/plugin.json` prints one line.
- **notes:**
  - The description in `skills/rebase-worktree/SKILL.md` now reads: "In a repo opted in to the sandbox it re-runs the tests through `run-in-sandbox` after a rebase, stopping on a failure with the rebased branch kept; elsewhere it reports the branch untested on the new base." Match the README row to it.

## In the parent docs/tickets/closed/rebase-worktree/index.md make the "Re-verify after a rebase…" Scope bullet and acceptance criterion 5 run "the tests" through run-in-sandbox with no ticket-gate lookup, drop the Context sentence about add-tasks' full-suite gate entry, and make the Test plan say tests that pass and tests that fail
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n "gate" docs/tickets/closed/rebase-worktree/index.md` prints only the Scope bullet's "no ticket-gate lookup", and `grep -n "the tests" docs/tickets/closed/rebase-worktree/index.md` shows the Scope bullet and criterion 5.

## Run full test suite for rebase-worktree--sandbox-reverify
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills`) and confirm both pass; the existing `ICON_MISSING` and root `CLAUDE.md` warnings are not failures.
  - `git diff --stat rebase-worktree` lists exactly `skills/rebase-worktree/SKILL.md`, `skills/wrap-up-worktree/SKILL.md`, `README.md`, `.claude-plugin/plugin.json` and `docs/tickets/closed/rebase-worktree/index.md`, besides `docs/tickets/closed/rebase-worktree--sandbox-reverify/`.
- **notes:**
  - The session's worktree isolation refuses compound shell commands that mention `git` (`cd … &&`, heredocs); run `git -C <worktree> diff --stat rebase-worktree` or a plain `git` command as its own Bash call.
