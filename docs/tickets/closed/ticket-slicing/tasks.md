# Tasks

## Turn the slice-worktree refusal in step 1 of `skills/complete-ticket-slice/SKILL.md` into a resume of the stopped slice
- **category:** functional
- **status:** done
- **steps:**
  - In `skills/complete-ticket-slice/SKILL.md` step 1 (**Guard**), replace the refusal on `ls -d <main checkout>/.claude/worktrees/{slug}--* 2>/dev/null` with a resume branch: when exactly one `.claude/worktrees/{slug}--{sub}` is registered in `git worktree list`, skip the judge (step 3), draft (step 4), fork (step 5) and tasks (step 6), invoke `jodysalt:enter-worktree {slug}--{sub}`, and continue at step 7 (**Loop**) when `docs/tickets/open/{slug}--{sub}/tasks.md` has a `- **status:** pending` entry, else at step 8 (**Close the slice**) when every entry is done and `docs/tickets/open/{slug}--{sub}` still exists, else at step 9 (**Land on the parent**). When more than one `{slug}--*` slice worktree exists, stop and name each. Keep the main-checkout `index.md` guard as is.
  - Update step 7's closing clause ("step 1 names it on the next call") to say the next call resumes it at step 1. Leave steps 3–6 and 8–10's behaviour and the judge, pick and landing otherwise unchanged.
  - Add "resumes a stopped slice" (in substance) to the `description:` frontmatter, keeping its trigger phrases and its "never lands the ticket on the base, never pushes" clause, and make the `complete-ticket-slice` row in `README.md` match.
  - `grep -n "resume" skills/complete-ticket-slice/SKILL.md` shows step 1's resume branch and the description; `claude plugin validate skills --strict` passes.

## Make `skills/complete-ticket/SKILL.md` slice every ticket with `complete-ticket-slice` up to a cap of 10, honouring a pre-existing `tasks.md`
- **category:** functional
- **status:** done
- **steps:**
  - Step 3 (**Tasks**) no longer invokes `jodysalt:add-tasks` and never writes a parent `tasks.md`; it becomes a compatibility step: when `docs/tickets/open/{slug}/tasks.md` exists with a `- **status:** pending` entry, invoke `jodysalt:complete-tasks {slug}` and on its first failed task stop with its report, worktree in place; otherwise skip.
  - Step 4 becomes the slice loop: invoke `jodysalt:complete-ticket-slice {slug}` and read its report's last line. `done` ends the loop; a line starting with a `{slug}--{sub}` slice slug counts one toward the cap and calls again; anything else is a failure: stop with that report, worktree in place. At the cap, stop with a report naming the criteria still unmet (from the last report line) and leave the worktree in place.
  - Add a `## Caps` section (as `skills/deliver-brief/SKILL.md` has) holding the slice cap, 10, and have step 4 cite it.
  - Step 5 (**Report**) names the slices landed, the last verdict, whether step 3 ran a pre-existing backlog, and suggests `jodysalt:wrap-up-worktree`. Step 2 (**Worktree**) is unchanged, so an existing parent worktree is entered, not re-added.
  - Rewrite the body's opening paragraph and the `description:` frontmatter to drop "breaks the ticket into tasks"/"writes … tasks with `add-tasks`" and say it works through the ticket one thin slice at a time via `complete-ticket-slice`, keeping the trigger phrases and the "never pushes, never wraps up or merges, never lands a planning branch" clauses. Update the Rules so they still say it only orchestrates.
  - Update the `complete-ticket` row in `README.md` to match the new description.
  - `grep -n "add-tasks\|complete-ticket-slice\|Caps" skills/complete-ticket/SKILL.md` shows no `add-tasks` invocation, the slice loop, and the cap; `claude plugin validate skills --strict` passes.
- **notes:**
  - A `README.md` skill row holds only the description's lead sentence (no "Use when…" triggers, no "never" clauses); match that part.
  - `complete-ticket-slice` step 1 now resumes a single registered `{slug}--*` slice worktree itself, and stops naming them when there are several, so `complete-ticket` need not detect stopped slices.

## Replace the workflow sentence about `complete-ticket` in `CLAUDE.md`, `README.md` and `skills/setup-skills/SKILL.md` step 4
- **category:** chore
- **status:** done
- **steps:**
  - In `CLAUDE.md` line 3, the `README.md` Workflow paragraph (line 7) and `skills/setup-skills/SKILL.md` step 4 (the quoted `## Workflow` block), replace "which breaks the ticket into tasks on its own branch just before running the loop" with the same sentence in all three, in substance: "which works through it one thin slice at a time, each slice a sub-ticket with its own backlog". Keep each file's `/jodysalt:` prefix conventions as they are.
  - `grep -n "breaks the ticket into tasks" CLAUDE.md README.md skills/setup-skills/SKILL.md` prints nothing, and `grep -n "one thin slice at a time" CLAUDE.md README.md skills/setup-skills/SKILL.md` prints three lines.

## Bump `.claude-plugin/plugin.json` version to `0.12.0`
- **category:** chore
- **status:** done
- **steps:**
  - Set `"version"` in `.claude-plugin/plugin.json` from `0.11.0` to `0.12.0`.
  - `grep -n '"version": "0.12.0"' .claude-plugin/plugin.json` prints one line.

## Run full test suite for ticket-slicing
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
