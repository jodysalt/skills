---
name: deliver-brief
description: Runs the whole chain from a brief to a branch ready for review – the one the main checkout has checked out, local `main` in the usual case – with no human turn: scaffolds the layout, fills `docs/vision.md`, drafts one ticket for the brief, breaks it down, runs the loop, judges it against its acceptance criteria and grows it by `{slug}--{sub}` sub-tickets until they are met, closing what it finished and playing the user at every question. Use when the user says "deliver this brief", "deliver a brief", "build X from this brief", or runs `/deliver-brief`. With no brief, resumes the one open ticket from the docs in the main checkout. Never pushes.
argument-hint: "[the brief – empty resumes the one open ticket, from the main checkout]"
---

# Deliver brief

Drive the existing chain from a brief to a base branch ready for review, the way a person does. The base is whatever the main checkout has checked out when the run starts, `main` in the usual case: every worktree forks from it and lands on it, and the run never checks out anything else there. Every skill runs as it does today and `deliver-brief` plays the user at every question, so no skill gains a `deliver-brief` mode. The base changes only by fast-forward merge, so `git log` on it reads as the run's history: one commit per planning session and one per ticket branch. The root stays thin. It holds the brief, the step the run is at, the tickets and sub-tickets worked so far, one report of a few lines per stage and the answers the root gave, and nothing else; the work happens in stages.

## Brief

$ARGUMENTS

If empty, the run resumes by step 3's resume rules: the one open ticket whose slug holds no `--` stands in for the brief, and the run continues at the first unfinished piece the docs in the main checkout record.

## Caps

Two constants, fixed here and cited by the steps:

- **Ticket cap: 5.** Tickets per run, every ticket and sub-ticket worked counting one, spikes included. After the fifth the run stops with a report instead of drafting a sixth.
- **Round cap: 3.** Interview rounds per stage, a round being one exchange of vital questions and answers between a stage and the root. A stage still asking after the third round is stuck, and the run stops with a report.

## Stages and the root

A stage is a fresh sub-agent that invokes one skill, does the work and reports in a few lines. The stages, in the order a run meets them: the scout, `refine-vision`, `add-ticket`, `add-tasks`, `complete-tasks`, the judge and `close-ticket`. The scout and the judge invoke no skill; their job is spelled out where they run, in steps 3 and 5.

The root runs the rest itself, a few tool calls each: `git init`, `jodysalt:setup-skills`, `jodysalt:commit`, `jodysalt:squash-commits`, `jodysalt:start-planning-session`, `jodysalt:add-worktree`, `jodysalt:enter-worktree`, `jodysalt:exit-worktree`, `jodysalt:merge-worktree`, `jodysalt:remove-worktree` and `jodysalt:wrap-up-worktree`. Checkouts are the reason: Claude Code's `EnterWorktree` from a sub-agent moves only that agent, and every stage inherits the root's checkout, so a stage that switched would leave the root, and its own workers, somewhere else.

The root answers every question a root-run skill asks with the run's choice: the named worktree when one asks which, and no to every offer of another skill (`setup-skills` offering `refine-vision`, `add-worktree` offering `enter-worktree`, `merge-worktree` offering `remove-worktree`), since the run invokes what it needs itself. A stop from `commit` on a secret or a build artefact ends the run with that report.

## Stage prompt

One template for every stage, `<skill>` and `<argument>` filled in; there is no prompt per stage. For the scout and the judge, which invoke no skill, the job paragraph is the one steps 3 and 5 spell out, and the rest of the template stands.

```
You are one stage of an unattended `deliver-brief` run. No person reads this conversation, so never ask one anything.

Your job: invoke the `jodysalt:<skill>` skill with the argument `<argument>` and follow it to completion. If the Skill tool is unavailable, read `${CLAUDE_PLUGIN_ROOT}/skills/<skill>/SKILL.md` and follow it directly, treating the argument as its `$ARGUMENTS`.

Where the skill interviews, `grill-me`'s rule for an unattended caller applies: the recommended answer is the user's for the trivial many, and the vital few go in your report. Take no offer to invoke another skill; report the offer instead. Never push.

Your final message is a few lines: what you did and which files changed; any check the work leaves for a person; and last, either the word `done` or the vital few questions, each with its options and a recommendation.
```

Each stage is spawned with the Agent tool (`general-purpose`, run synchronously so the root blocks until the report), inherits the root's model and checkout with no override, and never runs in parallel with another. A report ending in questions is one round. The root answers each from the brief first, then `docs/vision.md` (on a resume, the ticket's `index.md` stands in for the brief), and when both are silent takes the stage's recommendation and says so. It sends the answers, as the user's, to the same sub-agent with `SendMessage` so its context stays intact, and waits for the next report. The root answers at most 3 rounds, the `## Caps` constant; a report that still ends in questions after the third round's answers stops the run with a report naming the stage and its open questions. A report ending in `done` is recorded as that stage's report, and every answer the root gave goes into that stage's commit body and the final report.

## Steps

1. **Guard.** If `git rev-parse --is-inside-work-tree` fails there is no repository, and step 2 handles it. Otherwise check the ground, and stop at the first failure with its reason, nothing has changed yet:
   - `git rev-parse --show-toplevel` must equal the first path in `git worktree list`. Otherwise the run was started from inside a worktree: stop and point at `jodysalt:exit-worktree`, because `add-worktree` and `merge-worktree` run from the main checkout.
   - `git branch --show-current` must print a branch: the base. Otherwise `HEAD` is detached: stop and say so, because `merge-worktree` has nothing to fast-forward into.
   - `git status --porcelain` must be empty. Otherwise stop and point at commit or stash; do neither on the person's behalf. `merge-worktree` refuses a dirty main checkout, so the run would stop later with a branch half landed.
2. **Directory state.** One of three:
   - **No repository, or one whose `HEAD` has no commit** (`git rev-parse --verify --quiet HEAD` fails): `git init -b main` when there is no repository, then `jodysalt:setup-skills`, then one `chore:` commit through `jodysalt:commit` that takes everything present, files that were already there included, because anything left untracked trips the dirty-checkout guard later. This is the one thing the scaffold refuses to do, and it gives the planning branches something to fork from.
   - **A repository whose `docs/vision.md` is missing**, code without the layout: the scaffold is a planning session of its own. `jodysalt:start-planning-session`, `jodysalt:setup-skills`, `jodysalt:commit` (`chore:`), `jodysalt:squash-commits` (which reports nothing to squash for one commit, and that is fine), `jodysalt:exit-worktree`, `jodysalt:merge-worktree <planning worktree name>` and `jodysalt:remove-worktree <name>`.
   - **A repository with the layout**: continue at step 3.
3. **Scout, or resume.** With a brief, the scout stage; with none, the resume rules.
   - **With a brief, the scout stage.** A stage whose job, in place of a skill, is to read the brief and explore the repo: `README.md`, the manifest, everything under `docs/`, `git log --oneline -30` and `docs/vision.md`. It reports, in a few lines:
     - The reading it took of the brief and why.
     - The ticket's type (`feat | fix | refactor | chore | docs | test | spike`), applying the judgment `add-ticket` step 2 applies: a brief too large for one backlog is still one ticket, and sub-tickets are broken off as the judge shows the need.
     - For a `feat`, the `###` bet under `## Strategic bets` in `docs/vision.md` that covers it, named by its exact title, or that none does.
     - Whether any section of `docs/vision.md` still holds the one-line prompt the `setup-skills` template writes; the thesis prompt "One paragraph on what this project is and the direction it is heading." is the example.

     The root only ratifies: it takes the type and the bet as reported. Every brief becomes one ticket, whatever its size; step 5's judge grows it by sub-tickets until its acceptance criteria are met.
   - **With no brief, the resume rules**, run from the main checkout:
     - `ls -d docs/tickets/open/*/` must hold exactly one slug without `--`; otherwise stop and list what is there. That ticket stands in for the brief, its `index.md` answering where the brief would.
     - Then every worktree `git worktree list` registers under `.claude/worktrees/`. One whose `git -C <path> status --porcelain` is not empty stops the run naming it. One whose branch has commits not on the base (`git rev-list --count <base>..<branch>` above 0) gets `jodysalt:merge-worktree <name>` then `jodysalt:remove-worktree <name>`, a merge that cannot fast-forward stopping the run. One with nothing to merge is kept, and reused when it is the cursor ticket's.
     - Then the cursor: the deepest open ticket under the brief's, found by following `docs/tickets/open/{slug}--*/` down from it while a match exists. The run drafts one sub-ticket at a time, so a level with more than one match stops the run and lists them. That ticket continues: with no `tasks.md`, at step 4 from `add-tasks` on; with a pending entry, at step 5, entering its existing worktree instead of adding one when it exists; with every entry done, at step 5's judge. The brief's ticket itself, with no open sub-ticket and no `tasks.md`, continues at step 4 from `add-tasks` on like any other.

     A resumed run counts the tickets it works toward the 5-ticket cap as any run does.
4. **Planning session.** The docs for the brief, or for the next sub-ticket, drafted on a planning branch and landed on the base as one commit. In this order, a resume entering where step 3's cursor says:
   - `jodysalt:start-planning-session` in the root. Its refresh of the base is best effort and allowed to fail offline or without an upstream; the session carries on from the base as-is, as the skill does.
   - A `refine-vision` stage when the scout reported template prompts, with the argument the whole vision, filled from the brief, a bet for the brief among its `## Strategic bets` when the ticket is a `feat`; or, for a `feat` the scout found no bet for in a filled vision, with the argument a new bet under `## Strategic bets` for the brief. The argument quotes the brief in both cases, since a stage sees nothing else of it. The root adds a bet for a `feat` with none unless the brief says the feature stands on its own; then no bet is added and the ticket stands alone.
   - An `add-ticket` stage whose argument is the brief with the type and the bet the scout reported, or the bet `refine-vision` just added, so the stage takes `add-ticket`'s bet gate without a round; it states instead that the feature stands on its own when the scout found no bet and the root chose not to add one, so the stage takes the standalone answer without a round. On a loop from step 5's parent judge, the argument is the judge's pick as a sub-ticket of the judged ticket, `{slug}--{sub}`, with its reason, a spike's pick being its question.
   - An `add-tasks` stage, `jodysalt:add-tasks` with the slug being worked as its argument: the one the `add-ticket` stage reported, or the cursor's on a resume.
   - After every stage, `jodysalt:commit` in the root as a `docs:` commit whose body carries what a person would otherwise have been told: the answers the root gave and the recommendations it took because the brief and the vision were silent, any check the stage left for the person, and, for a session a judge sent the run back to, the verdict per criterion and why this sub-ticket next.
   - Then `jodysalt:wrap-up-worktree <planning worktree name>` in the root, which squashes the planning branch, fast-forwards it into the base and removes the worktree and its branch. A merge that cannot fast-forward stops the run with a report. `squash-commits`, which it runs, synthesises its body from the stage commits, so nothing a stage commit said is lost.
5. **Ticket.** The slug step 4 drafted, or the one step 3's cursor resumed, from its worktree through the loop and the judge to one commit on the base. In this order, a resume entering where the cursor says once the first bullet has run:
   - `jodysalt:add-worktree <slug>` in the root, skipped when `.claude/worktrees/<slug>` already exists, then `jodysalt:enter-worktree <slug>`.
   - A `complete-tasks` stage, `jodysalt:complete-tasks` with the slug as its argument. On the first failed task the stage's report ends the run: the root runs `jodysalt:exit-worktree` so the session ends in the main checkout, leaves the worktree and its commits on disk for a resume or a person, and prints the stop report of `## Report`, naming the branch, the worktree and the stage.
   - The root then counts the ticket toward the 5-ticket cap, the `## Caps` constant, and collects from the `complete-tasks` stage report every check left for the person, for the final report.
   - **The judge**, a stage in the ticket's worktree whose job, in place of a skill, is to read the ticket's `# Acceptance criteria`, its sub-tickets under `docs/tickets/*/{slug}--*/` with the `findings.md` of each spike among them, and the repo as it is. It reports, in a few lines:
     - Each criterion met or unmet, with a line of evidence.
     - Next, one of three: a sub-ticket that moves the unmet criteria most, as a one-line goal with its type; a spike, as the question to answer, when it cannot tell which sub-ticket moves them or the ticket needs facts the repo does not hold; or done, when every criterion is met.

     The root ratifies: it takes the verdict and the pick as reported. Then one of three:
   - **Done:** `jodysalt:wrap-up-worktree <slug>` in the root, which closes the ticket, since it has no open sub-ticket, folds the workers' task commits and the close into one commit, fast-forwards it into the base and removes the worktree and its branch. A merge that cannot fast-forward stops the run with a report. When `<slug>` holds no `--` this was the brief's ticket and the run continues at step 6; otherwise a sub-ticket closed, and the judge runs on its parent as the paragraph below says.
   - **A pick, under the cap:** an `add-ticket` stage on the ticket's own branch, in the worktree the root is in, with the pick as a sub-ticket of this ticket – `{slug}--{sub}` – and its reason as argument, a spike's pick being its question; the root declines `add-ticket`'s planning-session offer as the user, so the sub-ticket is drafted on the ticket branch. Then `jodysalt:commit` in the root as a `docs:` commit carrying the verdict per criterion and the reason for the pick. Then `jodysalt:wrap-up-worktree <slug>`, which lands the branch and leaves the ticket under `docs/tickets/open/` because a sub-ticket is open; a merge that cannot fast-forward stops the run with a report. Then step 4 from `add-tasks` on for the new sub-ticket, a planning session as step 4 describes, and step 5 for it.
   - **A pick, with 5 tickets worked**, the `## Caps` constant: the run ends at step 6 with the stop report instead, the cap its reason and the verdict and the pick in it for the person. The root runs `jodysalt:exit-worktree` so the session ends in the main checkout and leaves the worktree and its commits on disk; the docs stay as they are, so a resume lands those commits in its sweep and runs the judge again.

   **After a sub-ticket closes**, by its own `wrap-up-worktree` above or by the planning session below when it was itself a parent, the judge runs on its parent from the main checkout, reading the same things of the parent, and the root ratifies as above. A pick under the cap is drafted by step 4 in a planning session, the `add-ticket` stage taking the pick as a sub-ticket of the parent with its reason and `add-tasks` following, then step 5 for the new sub-ticket; a pick at the cap is the stop report. Done is a planning session that closes the parent: `jodysalt:start-planning-session` in the root; a `close-ticket` stage, `jodysalt:close-ticket` with the parent's slug as its argument; `jodysalt:commit` in the root as a `docs:` commit with the verdict per criterion in the body; then `jodysalt:wrap-up-worktree <planning worktree name>` in the root, a merge that cannot fast-forward stopping the run. The run ends at step 6 when the brief's ticket is closed.
6. **Report.** Print the final report of `## Report`. The run ends in the main checkout with `git status --porcelain` empty.

## Report

The final report, in this order:

1. The reading the scout took of the brief and why, so a person who meant another reading sees it first. On a resume, the ticket taken and the piece resumed at.
2. The answers the root gave, each with the stage that asked and where the answer came from: the brief, `docs/vision.md`, or the stage's recommendation, taken because both were silent.
3. Every check left for the person, a visual match or a manual step in a test plan among them: anything no worker could verify, neither dropped nor marked done.
4. `git log --oneline` of the base branch, named, for the run's commits.

On a stop: the reason, the branch, the worktree and the stage, and what is left on disk for a resume or a person, the docs as they were.

## Rules

- Never pushes or fetches.
- Never asks the person anything; the brief is the whole input. A question is answered by a stage or by the root.
- Never retries, re-plans or rolls back a failed task; the loop's first failure ends the run.
- Never runs workers or tickets in parallel.
- Gives no skill a `deliver-brief` mode; every skill runs as any user would run it.
- The base branch changes only by fast-forward merge through `jodysalt:merge-worktree`, the scaffold's first commit on an unborn branch aside: never a merge commit, a rebase, a reset or a checkout.
- A brief that says "like X" gets X's layout and behaviour, never its brand assets or licensed material.
- The root's transcript holds no stage skill's body and no worker's report: only the stage reports and the root's answers.
- There is no run log; git history is the trail, and each planning commit's body carries what a person would otherwise have been told.
