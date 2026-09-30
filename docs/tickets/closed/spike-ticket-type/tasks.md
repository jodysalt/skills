# Tasks

## Add the `spike` type to `skills/add-ticket/SKILL.md` with its own template, a `findings.md` beside `index.md`, and an optional initiative
- **category:** functional
- **status:** done
- **steps:**
  - `claude plugin validate skills --strict` passes, and the frontmatter `description`'s type list reads `(feat | fix | refactor | chore | docs | test | spike)` with one added clause, that a `spike` is research ending in a recommendation in `findings.md`, and the rest of the description unchanged.
  - The body carries these changes and no others. The intro line says a `feat` must tag an initiative and a `spike` may. Step 2's type list gains `spike`, glossed as research that ends in a recommendation and the tickets it implies, not code. Step 3 is headed for `feat` and `spike`: for a `feat` as today; for a `spike`, `ls docs/initiatives/open/` and tag the open initiative that fits, else tag none and continue, never escalating to `jodysalt:add-initiative`. Step 4 reads the chosen initiative file for a tagged spike as for a `feat`. Step 6 says `initiative` is required for `feat`, optional for `spike` (present only when step 3 tagged one) and omitted otherwise, keeps the existing template unchanged for every other type, and adds a second fenced template used when the type is `spike`: frontmatter `title`, `type: spike`, optional `initiative`, optional `priority`; sections exactly `# Question` (the one question, and what hangs on its answer), `# Context` (what the repo and the docs already say), `# Approach` (what to read, try or measure, and what is out of the research), `# Done when` (`findings.md` holds a recommendation and the tickets it implies) and `## Strategic fit` marked `(tagged spikes only)`; no `# Test plan` and no `# Rollout`. Step 6 also writes `docs/tickets/open/{slug}/findings.md` beside `index.md` for a spike, holding exactly the three prompt headings `# Findings`, `# Recommendation` and `# Tickets implied`, each followed by a one-line prompt: what the research found; the one recommendation, and why; the tickets it implies, one bullet each with a type and a one-line goal. Step 7's framing adds that for a `spike`, `# Done when` is the acceptance section and `Strategic fit` must trace to `vision.md` only when the spike is tagged. Step 8 applies to a `feat` and to a `spike` that carries `initiative:`, appending the ticket path to that initiative's `## Tickets` list as today.
  - `grep -c 'Done when' skills/add-ticket/SKILL.md` prints at least 2, `grep -c '# Tickets implied' skills/add-ticket/SKILL.md` prints at least 1, and the offer to invoke `jodysalt:add-initiative` in step 3 still sits in the `feat` branch only.

## Read every spike's `findings.md` in the chosen initiative in `skills/add-ticket/SKILL.md` step 4 before a `feat` interview
- **category:** functional
- **status:** done
- **steps:**
  - Step 4 of `skills/add-ticket/SKILL.md` says that for a `feat` it also reads `findings.md` of every ticket in the chosen initiative's `## Tickets` list whose `index.md` has `type: spike`, open or closed, since the list holds the live path and `docs/tickets/closed/{slug}/findings.md` counts, and that the `# Tickets implied` there are the candidates the feat is chosen from. Step 7's framing lists those findings beside the codebase, the initiative and `vision.md` as explorable, so a question they answer is never asked.
  - `grep -n 'findings.md' skills/add-ticket/SKILL.md` lists a line in step 4 and a line in step 7 as well as the step 6 lines, and `claude plugin validate skills --strict` passes.

## Assess a `type: spike` ticket against the spike template in `skills/refine-ticket/SKILL.md` and flag a missing `findings.md`
- **category:** functional
- **status:** done
- **steps:**
  - Step 2 of `skills/refine-ticket/SKILL.md` reads the initiative and `docs/vision.md` for a `feat` and for a `spike` that carries `initiative:`. Step 3 verifies the paths in `# Context` and `# Approach` for a spike, in place of `# Implementation notes`. Step 4's frontmatter bullet reads: `type` outside `feat | fix | refactor | chore | docs | test | spike`; a `feat` without `initiative:`; an `initiative:` slug on a `feat` or a `spike` with no file under `docs/initiatives/`. Step 4's sections bullet checks `Question`, `Context`, `Approach` and `Done when` when the type is `spike`, plus `Strategic fit` only when `initiative:` is set, and the existing list for every other type. Step 4 gains a finding for a spike whose directory has no `findings.md`, naming the three prompt headings it should hold, `# Findings`, `# Recommendation` and `# Tickets implied`; the skill still edits only `index.md`. Step 4's thin-acceptance-criteria bullet counts `# Done when` as the acceptance section for a spike.
  - `grep -c 'test | spike' skills/refine-ticket/SKILL.md` prints 1, `grep -c 'findings.md' skills/refine-ticket/SKILL.md` prints at least 1, `grep -c 'Done when' skills/refine-ticket/SKILL.md` prints at least 1, and `claude plugin validate skills --strict` passes.

## Name `type: spike` as docs-only work in `skills/add-tasks/SKILL.md` step 3 and fix its task shape
- **category:** functional
- **status:** done
- **steps:**
  - Step 3 of `skills/add-tasks/SKILL.md` names `type: spike` explicitly beside the docs-only examples in its skip sentence and adds the fixed shape a spike gets in place of implementation tasks and the gate: one `chore` research task per item in the ticket's `# Approach`, each writing what it finds under `# Findings` in `docs/tickets/open/{slug}/findings.md` with that path inlined in its heading; then one `chore` task that writes `# Recommendation` and `# Tickets implied` in the same file from the findings; then the review task against the ticket's `# Done when` in place of the gate, with the report saying the gate was skipped because a spike ships no code. It says the task count is what bounds the research, since a spike has no time box.
  - `grep -c 'type: spike' skills/add-tasks/SKILL.md` prints at least 1, `grep -c 'Done when' skills/add-tasks/SKILL.md` prints at least 1, `grep -c 'findings.md' skills/add-tasks/SKILL.md` prints at least 1, and `claude plugin validate skills --strict` passes.

## Name the `spike` type in the `add-ticket` row of the skills table in `README.md`
- **category:** chore
- **status:** done
- **steps:**
  - The `add-ticket` row of the skills table in `README.md` reads: Drafts a new ticket at `docs/tickets/open/{slug}/index.md`: one shippable change with a `type` (`feat | fix | refactor | chore | docs | test | spike`). A `feat` ticket must tag an initiative; a `spike` is research that ends in a recommendation in `findings.md` and may tag one. `grep -c 'feat | fix | refactor | chore | docs | test | spike' README.md` prints 1 and no other row changed.
  - `grep -c '"version": "0.2.0"' .claude-plugin/plugin.json` prints 1; this ticket bumps no version.

## Walk `add-ticket`, `add-tasks` and `refine-ticket` through a tagged and an untagged spike in a throwaway repo
- **category:** functional
- **status:** done
- **steps:**
  - Read each skill from this checkout's `skills/<name>/SKILL.md` and follow it by hand rather than invoking the installed plugin, whose copy predates these edits. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow `skills/setup-skills/SKILL.md` as written, write `docs/initiatives/open/demo.md` by hand with a `title: Demo` frontmatter, a one-line `## Outcome`, and a `## Tickets` section holding only the placeholder bullet `- (feature tickets get appended here by the add-ticket skill as they're drafted)`, and commit everything. Play the user throughout: decline every branch gate and continue on `main`, tag `demo` when the initiative gate offers it for the first spike and tag none for the second, and skip step 7's `grill-me` interview in `add-ticket`, leaving the template prompts in place.
  - Follow `skills/add-ticket/SKILL.md` as written for the spike "which database should the demo use" tagged `demo`: `docs/tickets/open/<slug>/index.md` has `type: spike`, `initiative: demo`, the headings `# Question`, `# Context`, `# Approach`, `# Done when` and `## Strategic fit` and no `# Test plan` or `# Rollout`; `findings.md` sits beside it holding `# Findings`, `# Recommendation` and `# Tickets implied`; and `demo.md`'s `## Tickets` lists `docs/tickets/open/<slug>/index.md` with the placeholder gone. Then a second spike, "does the demo need a licence header", with no initiative: its `index.md` has no `initiative:` and no `## Strategic fit`, `findings.md` exists, `jodysalt:add-initiative` was never offered, and `demo.md` is unchanged.
  - Fill the first spike's `# Approach` with three bullets by hand, then follow `skills/add-tasks/SKILL.md` as written for it: its `tasks.md` holds exactly five entries, three research tasks naming `findings.md`, one recommendation task and one review task against `# Done when`, with no `## Run full test suite` entry, and the report says the gate was skipped and why.
  - Follow `skills/refine-ticket/SKILL.md` steps 1 to 4 as written for the second spike, stopping after the step 4 report both times: first the report accepts `type: spike`, lists no missing `Implementation notes`, `Test plan`, `Rollout` or `Strategic fit`, and does not flag `findings.md`; then `rm` that spike's `findings.md` and repeat, and the report flags it as missing.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Fill a spike's `findings.md` through the loop in a throwaway repo, close it with `wrap-up-ticket`, and confirm a `feat` draft reads it
- **category:** functional
- **status:** done
- **steps:**
  - Read `add-ticket` and `add-tasks` from this checkout's `skills/<name>/SKILL.md` and follow them by hand rather than invoking the installed plugin, whose copy predates these edits; `complete-tasks` and `wrap-up-ticket` are unchanged, so the installed `jodysalt:complete-tasks` and `jodysalt:wrap-up-ticket` may be invoked. In a fresh directory under the session's scratchpad, not this repo: `git init -b main`, follow `skills/setup-skills/SKILL.md` as written, write `docs/initiatives/open/demo.md` by hand with a `title: Demo` frontmatter, a one-line `## Outcome`, and a `## Tickets` section listing `docs/tickets/open/db-choice/index.md`; write `docs/tickets/open/db-choice/index.md` by hand from the spike template in `skills/add-ticket/SKILL.md` with `type: spike`, `initiative: demo`, the `# Question` "SQLite or Postgres for the demo?", and two `# Approach` bullets, "list what each needs to install and run locally" and "list what each needs for one user on one machine"; write `findings.md` beside it holding the three prompt headings `# Findings`, `# Recommendation` and `# Tickets implied`; follow `skills/add-tasks/SKILL.md` as written for `db-choice`; commit everything via `jodysalt:commit`.
  - Run `jodysalt:complete-tasks` for `db-choice`: every entry in its `tasks.md` ends `done`, `git status --porcelain` is empty, `git log --oneline` shows one commit per entry, and `findings.md` holds prose under all three headings with at least one bullet under `# Tickets implied`.
  - Run `jodysalt:wrap-up-ticket` for `db-choice`: `docs/tickets/closed/db-choice/findings.md` exists, `docs/tickets/open/db-choice/` does not, `demo.md`'s `## Tickets` lists the `closed/` path, and `git log -1` is a single `docs:` commit.
  - Follow `skills/add-ticket/SKILL.md` steps 1 to 4 as written for a `feat` under `demo`, playing the user (decline the branch gate, pick `demo`), and stop after step 4: the step reads `docs/tickets/closed/db-choice/findings.md` and names its `# Tickets implied` as the candidates before any interview would start. Write no feat.
  - Remove the throwaway directory afterwards, and touch nothing in this repo but this file's status line.

## Run full test suite for spike-ticket-type
- **category:** chore
- **status:** done
- **steps:**
  - Run `claude plugin validate . --strict` and confirm it passes.
  - Run `claude plugin validate skills --strict` and confirm it passes.
