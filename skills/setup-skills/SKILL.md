---
name: setup-skills
description: Scaffolds the layout the other skills in this plugin assume exists – `docs/vision.md` from a template, `docs/coding-standards.md` from a template, `docs/tickets/{open,closed}/` each holding `.gitkeep`, a `## Workflow` section in `CLAUDE.md`, a `.claude/worktrees/` line in `.gitignore`, and a `.vscode/settings.json` that makes VS Code detect the worktrees – from the repo root. Use when the user says "set up the skills", "set up the workflow", "scaffold the workflow", or runs `/setup-skills`. Creates only what is missing and never overwrites an existing file; never runs `git init`, never stages, never commits. Ends by offering `refine-vision` and `refine-coding-standards` to fill in `docs/vision.md` and `docs/coding-standards.md`.
---

# Setup skills

Every other skill in this plugin assumes this layout exists and none creates it. One idempotent pass from the repo root: check each path, create it only when missing, then report. No arguments and no branch gate; a fresh repo may have a single branch, and this layout is what makes planning branches worth having.

## Steps

1. **Directories.** For each of `docs/tickets/open/` and `docs/tickets/closed/`: if the directory exists, skip it whole, `.gitkeep` included; otherwise create it holding an empty `.gitkeep` so git tracks it while empty.
2. **`docs/vision.md`.** Skip if the file exists. Otherwise write it from this template. The section bodies are prompts for `refine-vision`, not content. Keep one `###` per strategic bet: a `feat` ticket cites a bet by its exact title with `bet:`, and `refine-vision` matches on it.

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

   The few pushes that move the vision forward, one `###` section per bet; a `feat` ticket cites a bet by its exact title with `bet:`.

   ### {Bet title}

   What this bet changes, why now, and what success looks like.

   ## Non-goals

   What this project deliberately does not do, one bolded name and a sentence each.
   ```

3. **`docs/coding-standards.md`.** Skip if the file exists. Otherwise write it from this template. The paragraph is the prompt for `refine-coding-standards`, not content; a standard is one `## ` section and the file holds none until one is written, so `add-tasks` appends no review task until then.

   ```markdown
   # Coding standards

   One `## ` section per standard the review enforces: its rule in a sentence or two, then one idiomatic example from this repo's own code. Leave what a linter or formatter already catches to that tool.
   ```

4. **`CLAUDE.md`.** Skip if the file holds a line equal to `## Workflow`. If the file is missing, create it holding exactly the block below. If it exists without that heading, append the block after one blank line (add a newline first when the file doesn't end with one) and leave every existing line as it was. The block:

   ```markdown
   ## Workflow

   This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction and names its strategic bets, `docs/tickets/` slices a bet into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, break a ticket down with `/jodysalt:add-tasks`, and run the loop with `/jodysalt:complete-tasks`.
   ```

5. **`.gitignore`.** Skip if a whole line equals `.claude/worktrees/` or `/.claude/worktrees/`, or if `git check-ignore -q .claude/worktrees` succeeds (the repo already ignores `.claude/` wholesale). Otherwise append `.claude/worktrees/` on its own line (add a newline first when the file doesn't end with one), creating the file when missing. `add-worktree` and Claude Code's own `EnterWorktree` both put worktrees under `.claude/worktrees/` at the repo root; nothing ignores that directory by default, and it must never be committed.
6. **`.vscode/settings.json`.** Skip if the file exists, but when it lacks either key below, say so in the report rather than editing it. Otherwise create the directory and the file holding exactly:

   ```json
   {
     "git.detectWorktrees": true,
     "files.watcherExclude": {
       "**/.claude/worktrees/**": true
     }
   }
   ```

   The first key, off by default, makes VS Code list the `.claude/worktrees/` checkouts in its Source Control Repositories view with open, open in new window and delete. The second stops the root window watching every file in every worktree; `.gitignore` already keeps them out of search and Quick Open but the file watcher ignores it.
7. **Report.** List each path created and each path skipped because it existed. Note when `git check-ignore -q .vscode/settings.json` succeeds, because the VS Code settings then stay local to this machine. State whether the root is inside a git work tree (`git rev-parse --is-inside-work-tree`) and whether the checked-out branch has a commit (`git rev-parse --verify --quiet HEAD` succeeds); when either check fails, say so, because `start-planning-session` and `add-worktree` fork from whatever the main checkout has checked out and an unborn branch has nothing to fork from, and leave it to the user: never run `git init`, create a branch or commit. Offer to invoke `jodysalt:refine-vision` to fill in `docs/vision.md` and `jodysalt:refine-coding-standards` to fill in `docs/coding-standards.md`. Leave everything unstaged and suggest `jodysalt:commit` (a `chore:` commit).

## Rules

- Create only what is missing. Never overwrite, reformat or reorder an existing file; `CLAUDE.md` and `.gitignore` gain their one addition at the end or nothing at all, and `.vscode/settings.json` is written whole or not at all.
- Never run `git init`, never create a branch, never stage, commit or push.
- Runs from the repo root and takes no path argument. No branch gate.
