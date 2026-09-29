---
name: setup-skills
description: Scaffolds the layout the other skills in this plugin assume exists – `docs/vision.md` from a template, `docs/initiatives/{open,closed}/` and `docs/tickets/{open,closed}/` each holding `.gitkeep`, a `## Workflow` section in `CLAUDE.md`, a `.claude/worktrees/` line in `.gitignore`, and a `.vscode/settings.json` that makes VS Code detect the worktrees – from the repo root. Use when the user says "set up the skills", "set up the workflow", "scaffold the workflow", or runs `/setup-skills`. Creates only what is missing and never overwrites an existing file; never runs `git init`, never stages, never commits. Ends by offering `refine-vision` to fill in `docs/vision.md`.
---

# Setup skills

Every other skill in this plugin assumes this layout exists and none creates it. One idempotent pass from the repo root: check each path, create it only when missing, then report. No arguments and no branch gate; a fresh repo may have a single branch, and this layout is what makes planning branches worth having.

## Steps

1. **Directories.** For each of `docs/initiatives/open/`, `docs/initiatives/closed/`, `docs/tickets/open/` and `docs/tickets/closed/`: if the directory exists, skip it whole, `.gitkeep` included; otherwise create it holding an empty `.gitkeep` so git tracks it while empty.
2. **`docs/vision.md`.** Skip if the file exists. Otherwise write it from this template. The section bodies are prompts for `refine-vision`, not content. Keep one `###` per strategic bet: `add-initiative` cites a bet by its exact title and `close-initiative` deletes its section by that title.

   ```markdown
   # Vision

   One paragraph on what this project is and the direction it is heading.

   ## Target users

   Who this is for, and who the first user is.

   ## Core problems

   The problems those users have that this project exists to solve, one bolded name and a sentence each.

   ## Product principles

   The rules every change is judged by, one bolded name and a sentence each.

   ## Strategic bets

   The few pushes that move the vision forward, one `###` section per bet; an initiative cites a bet by its exact title.

   ### {Bet title}

   What this bet changes, why now, and what success looks like.

   ## Non-goals

   What this project deliberately does not do, one bolded name and a sentence each.
   ```

3. **`CLAUDE.md`.** Skip if the file holds a line equal to `## Workflow`. If the file is missing, create it holding exactly the block below. If it exists without that heading, append the block after one blank line (add a newline first when the file doesn't end with one) and leave every existing line as it was. The block:

   ```markdown
   ## Workflow

   This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction and names its strategic bets, `docs/initiatives/` turns a bet into a focused push, `docs/tickets/` makes that concrete, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-initiative` and `/jodysalt:add-ticket`, break a ticket down with `/jodysalt:add-tasks`, and run the loop with `/jodysalt:complete-tasks`.
   ```

4. **`.gitignore`.** Skip if a whole line equals `.claude/worktrees/` or `/.claude/worktrees/`, or if `git check-ignore -q .claude/worktrees` succeeds (the repo already ignores `.claude/` wholesale). Otherwise append `.claude/worktrees/` on its own line (add a newline first when the file doesn't end with one), creating the file when missing. `add-worktree` and Claude Code's own `EnterWorktree` both put worktrees under `.claude/worktrees/` at the repo root; nothing ignores that directory by default, and it must never be committed.
5. **`.vscode/settings.json`.** Skip if the file exists, but when it lacks either key below, say so in the report rather than editing it. Otherwise create the directory and the file holding exactly:

   ```json
   {
     "git.detectWorktrees": true,
     "files.watcherExclude": {
       "**/.claude/worktrees/**": true
     }
   }
   ```

   The first key, off by default, makes VS Code list the `.claude/worktrees/` checkouts in its Source Control Repositories view with open, open in new window and delete. The second stops the root window watching every file in every worktree; `.gitignore` already keeps them out of search and Quick Open but the file watcher ignores it.
6. **Report.** List each path created and each path skipped because it existed. Note when `git check-ignore -q .vscode/settings.json` succeeds, because the VS Code settings then stay local to this machine. State whether the root is inside a git work tree (`git rev-parse --is-inside-work-tree`) and whether a `main` branch exists (`git branch --list main` prints a line); when either check fails, say so, because `start-planning-session` and `add-worktree` fork from `main`, and leave it to the user: never run `git init` or create a branch. Offer to invoke `jodysalt:refine-vision` to fill in `docs/vision.md`. Leave everything unstaged and suggest `jodysalt:commit` (a `chore:` commit).

## Rules

- Create only what is missing. Never overwrite, reformat or reorder an existing file; `CLAUDE.md` and `.gitignore` gain their one addition at the end or nothing at all, and `.vscode/settings.json` is written whole or not at all.
- Never run `git init`, never create a branch, never stage, commit or push.
- Runs from the repo root and takes no path argument. No branch gate.
