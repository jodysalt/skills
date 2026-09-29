---
title: Setup Skills and Refine Vision
type: feat
initiative: one-command-adoption
priority: high
---

# Goal
A user who has installed the plugin runs `/jodysalt:setup-skills` in a repo with none of the workflow's layout and gets everything the other skills assume exists: `docs/vision.md` from a template, `docs/initiatives/{open,closed}/`, `docs/tickets/{open,closed}/`, an empty `tasks.md`, a CLAUDE.md pointer at the workflow, and a `worktrees/` line in `.gitignore`. It ends by offering `/jodysalt:refine-vision`, which interviews them and fills `vision.md` in. Their first `/jodysalt:add-initiative` and `/jodysalt:add-ticket` then run without a file created by hand.

# Context
- Every other skill assumes the layout exists and none creates it. `add-ticket` and `add-initiative` read `docs/vision.md` and `ls docs/initiatives/open/`; `add-ticket` writes under `docs/tickets/open/`; `close-ticket` and `close-initiative` `git mv` into `docs/tickets/closed/` and `docs/initiatives/closed/`; `add-tasks`, `complete-task` and `remove-completed-tasks` read and edit `tasks.md`, and the last expects it to reduce to `# Tasks` plus a trailing newline; `complete-task` reads `CLAUDE.md` for the repo's coding norms; `add-worktree` creates `worktrees/<branch>` under the repo root, which the maintainer's SaaS repo keeps out of git via `.gitignore`.
- The only layout in existence is the maintainer's SaaS repo's, built by hand: `docs/vision.md`, the four directories with `.gitkeep` in the empty ones, `tasks.md` holding `# Tasks`, `worktrees/` in `.gitignore`, and a `docs/README.md` that the initiative decided not to reproduce.
- This repo has `docs/vision.md` and, hand-made during planning, `docs/initiatives/open/` and `docs/tickets/open/`. It has no `docs/*/closed/`, no `tasks.md`, no `CLAUDE.md`, and no `.gitignore` line for `worktrees/`. The scaffold's first run (see Rollout) must fill those gaps and leave the rest alone.
- A skill is one `skills/{name}/SKILL.md` with `name`, `description` and optional `argument-hint` frontmatter. Templates live inline in the body (`add-ticket`, `add-initiative`); no skill ships supporting files or scripts. `claude plugin validate . --strict` gates manifests and frontmatter.
- The vision template's sections are this repo's `docs/vision.md`: an opening thesis paragraph, then *Target users*, *Core problems*, *Product principles*, *Strategic bets* (one `###` per bet) and *Non-goals*. `close-initiative` deletes a bet's `###` section by exact title, so the template must keep that shape.
- `README.md` lists every skill in a table and says nothing about the workflow itself. `plugin.json` is at `0.1.0`; `vision.md` bumps the version on any change to a skill's behaviour.
- `refine-vision` ships in this ticket too, in the shape of `refine-initiative`: read, report findings, interview through `grill-me`, edit in place, leave uncommitted. It becomes the second skill allowed to edit `vision.md`; `close-initiative`'s description still claims to be the only one, and `add-initiative`'s sanity gate still tells the user that a missing bet is "the user's edit, never yours".

# Scope

In:
- Two new skills, `skills/setup-skills/SKILL.md` and `skills/refine-vision/SKILL.md`, run as `/jodysalt:setup-skills` (no arguments) and `/jodysalt:refine-vision`, plus their rows in the README skills table and the plugin version bump.
- From the repo root, creates each of these only when missing and never rewrites one that exists:
  - `docs/vision.md` from a template inline in the skill body: the sections of this repo's `vision.md`, each holding a one-line prompt.
  - `docs/initiatives/open/`, `docs/initiatives/closed/`, `docs/tickets/open/`, `docs/tickets/closed/`, each with a `.gitkeep` so git tracks it while empty.
  - `tasks.md` holding `# Tasks` and a trailing newline.
- `CLAUDE.md`: creates it, or appends a `## Workflow` section when no heading by that name exists. The section says the repo runs the plugin's workflow, names the chain (vision, initiatives, tickets, tasks, loop) and the skill that moves each step.
- `.gitignore`: creates it, or appends a `worktrees/` line when no such line exists.
- Ends with a report: each path created, each path skipped because it existed, and an offer to invoke `jodysalt:refine-vision` to fill in `docs/vision.md`. Leaves everything unstaged and suggests `jodysalt:commit`.
- Runs outside a git repo, and in one with no `main` branch, all the same. The report flags either case, because `start-planning-session` and `add-worktree` fork from `main`.
- A short Workflow section in this repo's `README.md`: the chain (vision, initiatives, tickets, tasks, loop) and the skill that moves each step. The CLAUDE.md pointer echoes its wording.
- `refine-vision`: reads `docs/vision.md`, reports its findings, then interviews the user through `grill-me` and edits `vision.md` as answers land, keeping the opening thesis, the five section headings, and one `###` per strategic bet. Works on the scaffold's fresh template and on a vision that has drifted.
- `refine-vision` explores before it asks: it reads the README, package manifests, existing docs and the recent git log, and seeds each question's recommended answer from them. Only an answer the user agrees to lands in `vision.md`.
- Its findings report, before any edit, lists: sections missing or still holding the template prompt; a bet an open initiative cites by exact title that has no `###` in `vision.md`; content an open initiative contradicts. A bet no initiative cites is not a finding.
- `add-initiative`'s sanity gate, when no bet in `vision.md` matches, offers to invoke `jodysalt:refine-vision` alongside its existing push-back. One line; no other change to that skill.
- `refine-vision` has the same branch gate as `refine-initiative` (offer `start-planning-session`, skip if it already ran) and an optional argument naming what to revisit, defaulting to the whole file.
- `close-initiative`'s description drops the claim to be the only skill that edits `vision.md`.

Out:
- `vision.md` content the user did not agree to. `refine-vision` proposes and records; it never decides.
- Any edit by `refine-vision` outside `docs/vision.md`.
- Overwriting, reformatting or reordering anything that already exists.
- Any initiative, ticket or task content, sample or otherwise.
- `git init`, branch changes, commits or pushes.
- CI, git hooks, permission settings, or a `docs/README.md` (initiative non-goals).

# Acceptance criteria
- In an empty git repo, `/jodysalt:setup-skills` creates `docs/vision.md`, the four directories each holding `.gitkeep`, `tasks.md`, `CLAUDE.md` with a `## Workflow` section, and `.gitignore` holding `worktrees/`, and touches nothing else.
- `docs/vision.md` has an opening thesis prompt and the headings *Target users*, *Core problems*, *Product principles*, *Strategic bets* and *Non-goals*, each followed by a one-line prompt, so `add-ticket` and `add-initiative` find every section they read.
- `tasks.md` is exactly `# Tasks` plus a trailing newline; `remove-completed-tasks` on it reports nothing to remove and leaves it unchanged.
- Running the skill a second time changes no file and reports every path as skipped.
- In a repo with an existing `CLAUDE.md` and `.gitignore`, both gain their one addition at the end and every existing line survives byte for byte; a `CLAUDE.md` that already has a `## Workflow` heading and a `.gitignore` that already lists `worktrees/` are left alone.
- In this repo, the run creates only `docs/initiatives/closed/.gitkeep`, `docs/tickets/closed/.gitkeep`, `tasks.md`, `CLAUDE.md` and the `.gitignore` line; `docs/vision.md`, the open initiative and this ticket are unchanged.
- The closing report lists what was created and what was skipped, offers `jodysalt:refine-vision`, and suggests `jodysalt:commit`. Nothing is staged or committed.
- In a directory that is not a git repo, or a repo with no `main` branch, the run completes and the report says which is missing. The skill never runs `git init` or creates a branch.
- After the run, `/jodysalt:add-initiative` and `/jodysalt:add-ticket` in the scaffolded repo pass their reads of `docs/vision.md` and `docs/initiatives/open/` without a missing-file error.
- `/jodysalt:refine-vision` on the scaffold's template ends with every section holding agreed content, no template prompt left, and at least one `### {Title}` bet that `add-initiative` can cite by exact title. Only `docs/vision.md` changed, nothing is staged, and the report suggests `jodysalt:commit`.
- `/jodysalt:refine-vision` on this repo's `vision.md` reports its findings before editing anything and, if the user declines every question, leaves the file byte for byte unchanged.
- In a repo with a README that names its users and purpose, `refine-vision`'s first questions carry recommendations drawn from it rather than the template prompt.
- `add-initiative` run against a vision with no matching bet offers `jodysalt:refine-vision` in its push-back.
- On a `vision.md` whose *Target users* still holds the template prompt and whose open initiative cites a bet title absent from *Strategic bets*, `refine-vision` reports both before asking anything, and does not report bets that no initiative cites.
- `refine-vision` on a non-planning branch offers `start-planning-session` first, and a run with an argument such as `target users` asks only about that section.
- `README.md` has a Workflow section and rows for `setup-skills` and `refine-vision` in the skills table; `close-initiative`'s description no longer calls itself the only skill that edits `vision.md`; `plugin.json` carries a new version; `claude plugin validate . --strict` passes.

# Implementation notes
- One file, `skills/setup-skills/SKILL.md`, in the shape of the other skills: frontmatter (`name`, `description` naming the trigger phrases "set up the skills", "set up the workflow", `/setup-skills`; no `argument-hint`), a Steps list, a Rules list. The description says it never overwrites and never commits.
- Steps: check each path in turn and create only what is missing, so the skill reads as one idempotent pass rather than a create-then-check. Order: directories and `.gitkeep`s, `docs/vision.md`, `tasks.md`, `CLAUDE.md`, `.gitignore`, then the report.
- The `vision.md` template lives inline in the body, as the ticket and initiative templates do in `add-ticket` and `add-initiative`. Its section bodies are prompts, not content; the Strategic bets section shows one `### {Bet title}` placeholder so the `###`-per-bet shape that `close-initiative` deletes by exact title is visible.
- CLAUDE.md addition, appended after a blank line when the heading is absent:

  ```markdown
  ## Workflow

  This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction, `docs/initiatives/` turns it into bets, `docs/tickets/` makes those concrete, and `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-initiative` and `/jodysalt:add-ticket`, break a ticket down with `/jodysalt:add-tasks`, and run the loop with `/jodysalt:complete-tasks`.
  ```

- `.gitignore` match is a whole line equal to `worktrees/` (or `/worktrees/`); anything else appends `worktrees/` on its own line.
- README Workflow section sits between the intro and the Skills table, and its wording is the source the CLAUDE.md snippet echoes.
- No branch gate: a fresh repo may have a single branch, and the layout is what makes planning branches meaningful.
- The skill runs from the repo root and never takes a path argument. It checks `git rev-parse --is-inside-work-tree` and `git branch --list main` only to word the report.
- The version bump is the implementer's call under the rule in `vision.md`; this ticket does not fix the number.
- `skills/refine-vision/SKILL.md` follows `refine-initiative` step for step: read, report findings, invoke `jodysalt:grill-me` with the subject "the vision at `docs/vision.md`", edit only that file as answers land, stop and suggest `jodysalt:commit`. Its rules: never invent content; keep the section headings and the `###`-per-bet shape; never touch initiatives or tickets.
- `refine-vision`'s exploration step runs before the findings report: README, `package.json` or the equivalent manifest, anything under `docs/`, and `git log --oneline -30`. The grill framing tells `grill-me` these count as explorable and that each recommendation should cite what it came from.
- In `add-initiative` step 3, the bet check's push-back gains the offer: "either `vision.md` needs updating first (offer to invoke `jodysalt:refine-vision`; never edit it yourself) or the initiative doesn't belong".
- `refine-vision` frontmatter: `argument-hint: "[what to revisit, e.g. 'target users' – defaults to the whole vision]"`. Its step 3 report checks each section against the template's prompt text, greps `docs/initiatives/open/*.md` for the bet titles they cite and looks each up as a `### ` heading, and reads open initiatives for claims the vision contradicts.

# Test plan
- `claude plugin validate . --strict` passes with both new skills and the edited `add-initiative` and `close-initiative`.
- Manual, fresh repo: `git init` a throwaway directory, start `claude --plugin-dir /path/to/skills` there, run `/jodysalt:setup-skills`; check every path in Acceptance criteria exists with the expected content and `git status` shows nothing else. Run it again and confirm `git status` is unchanged and the report says skipped throughout.
- Manual, existing files: seed the throwaway repo with a `CLAUDE.md` and a `.gitignore` of a few lines, run the skill, and diff to confirm only the appended block and line changed. Repeat with the heading and line already present to confirm a no-op.
- Manual, chain: in the scaffolded repo, accept the scaffold's offer of `/jodysalt:refine-vision`, answer its interview until every section is filled, then run `/jodysalt:add-initiative` and `/jodysalt:add-ticket` far enough to pass their reads of `vision.md` and `docs/initiatives/open/`.
- Manual, existing vision: run `/jodysalt:refine-vision` in this repo on the planning branch, check its findings against `docs/vision.md`, answer one question, confirm `git status` shows only `docs/vision.md`, then discard the change with `git checkout docs/vision.md`.
- Manual, this repo: the Rollout run below, checked against the acceptance criterion for this repo.

# Rollout
- The scaffold's first run is here, on the ticket branch, via `claude --plugin-dir .`: it creates the two `closed/` directories, `tasks.md`, `CLAUDE.md` and the `.gitignore` line, and leaves `docs/vision.md`, the open initiative and this ticket untouched. That result is committed as part of the ticket.
- Bump `plugin.json` per the version rule in `vision.md`, since a new skill changes what the plugin does.
- Merging to `main` is the release; users on auto-update get the skill at their next session. No flags or migrations. Fallback is reverting the commit; scaffolded files in user repos are theirs.
- Both skills land together, so the scaffold's offer of `refine-vision` works from the first release.

## Strategic fit
The only ticket of `one-command-adoption` and its whole outcome: after these two runs, a repo has every file and directory the other skills assume and a `vision.md` the user agreed to, section by section, which is the *Decisions evaporate* problem answered at the top of the chain. It answers the *Conventions are hard to adopt* core problem in `vision.md` directly ("today nothing creates it") and serves *One thing, then stop*: it creates the layout, reports, and leaves the result unstaged. *Explore before asking* shapes the idempotent design, since the skill inspects the repo instead of asking what exists. It respects the *Dogfooding* boundary the initiative drew (the first run is here, the rest is another initiative) and the non-goal on standalone skills: the scaffold exists only because the method's other skills need what it creates.
