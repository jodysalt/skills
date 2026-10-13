---
name: deliver-brief
description: Runs the chain a person runs, from a brief to a branch ready for review – the one the main checkout has checked out, local `main` in the usual case – with no human turn: scaffolds the layout when it is missing, drafts one ticket with `add-ticket`, commits it on the base, implements it with `complete-ticket` (which slices and resumes) and lands it with `wrap-up-worktree`, playing the user from the brief at every question. Use when the user says "deliver this brief", "deliver a brief", "build X from this brief", or runs `/deliver-brief`. With no brief, resumes the one open ticket. Never pushes.
argument-hint: "[the brief – empty resumes the one open ticket, from the main checkout]"
---

# Deliver brief

Run the chain a person runs, from a brief to a base branch ready for review: scaffold the layout when it is missing, draft the ticket with `add-ticket`, commit it on the base, implement it with `complete-ticket`, land it with `wrap-up-worktree`. The base is whatever the main checkout has checked out when the run starts, `main` in the usual case; the run never checks out anything else there. Every skill runs as it does today and `deliver-brief` plays the user at every question, so no skill gains a `deliver-brief` mode. Slicing and resuming a stopped slice are `complete-ticket`'s. The root stays thin: it holds the brief, the step the run is at, one report of a few lines per stage, the answers the root gave and the run of `complete-ticket`, and nothing else.

## Brief

$ARGUMENTS

If empty, the run resumes: step 3 takes the one open ticket and continues at step 5.

## Caps

- **Round cap: 3.** Interview rounds per stage, a round being one exchange of vital questions and answers between a stage and the root. A stage still asking after the third round is stuck, and the run stops with a report.

## Stages and the root

A stage is a fresh sub-agent that invokes one skill, does the work and reports in a few lines. The stages, in the order a run meets them: `refine-vision` and `add-ticket`.

The root runs the rest itself, a few tool calls each: `git init`, `jodysalt:setup-skills`, `jodysalt:commit`, `jodysalt:add-worktree`, `jodysalt:enter-worktree`, `jodysalt:exit-worktree`, `jodysalt:complete-ticket` and `jodysalt:wrap-up-worktree`. Checkouts are the reason: a sub-agent is pinned to the checkout it was spawned in, so `EnterWorktree` and `cd` into another worktree are refused, and a switch it did make would move only that agent. `complete-ticket` moves between the ticket's worktree and each slice's, so it runs in the root; the sub-agents it spawns, the slice's `add-ticket` drafter and `complete-tasks`' workers, each work inside the one checkout the root is in when they start.

The root answers every question a root-run skill asks with the run's choice: the named worktree when one asks which, and no to every offer of another skill (`setup-skills` offering `refine-vision`, `add-worktree` offering `enter-worktree`), since the run invokes what it needs itself. A stop from `commit` on a secret or a build artefact ends the run with that report.

## Stage prompt

One template for every stage, `<skill>` and `<argument>` filled in; there is no prompt per stage.

```
You are one stage of an unattended `deliver-brief` run. No person reads this conversation, so never ask one anything.

Your job: invoke the `jodysalt:<skill>` skill with the argument `<argument>` and follow it to completion. If the Skill tool is unavailable, read `${CLAUDE_PLUGIN_ROOT}/skills/<skill>/SKILL.md` and follow it directly, treating the argument as its `$ARGUMENTS`.

Where the skill interviews, `grill-me`'s rule for an unattended caller applies: the recommended answer is the user's for the trivial many, and the vital few go in your report. Take no offer to invoke another skill; report the offer instead. Never push.

Your final message is a few lines: what you did and which files changed; any check the work leaves for a person; and last, either the word `done` or the vital few questions, each with its options and a recommendation.
```

Each stage is spawned with the Agent tool (`general-purpose`) and the root waits for its report before doing anything else; when the tool runs it in the background, the report arrives with its completion notification. A stage inherits the root's model and checkout with no override, and never runs in parallel with another. A report ending in questions is one round. The root answers each from the brief first, then `docs/vision.md` (on a resume, the ticket's `index.md` stands in for the brief), and when both are silent takes the stage's recommendation and says so. It sends the answers, as the user's, to the same sub-agent with `SendMessage` so its context stays intact, and waits for the next report. The root answers at most 3 rounds, the `## Caps` constant; a report that still ends in questions after the third round's answers stops the run with a report naming the stage and its open questions. A report ending in `done` is recorded as that stage's report, and every answer the root gave goes into the commit that follows the stage, when there is one, and the final report.

## Steps

1. **Guard.** If `git rev-parse --is-inside-work-tree` fails there is no repository, and step 2 handles it. Otherwise check the ground, and stop at the first failure with its reason, nothing has changed yet:
   - `git rev-parse --show-toplevel` must equal the first path in `git worktree list`. Otherwise the run was started from inside a worktree: stop and point at `jodysalt:exit-worktree`, because `add-worktree` and `wrap-up-worktree` run from the main checkout.
   - `git branch --show-current` must print a branch: the base. Otherwise `HEAD` is detached: stop and say so, because `wrap-up-worktree` has nothing to fast-forward into.
   - `git status --porcelain` must be empty. Otherwise stop and point at commit or stash; do neither on the person's behalf. `wrap-up-worktree` refuses a dirty main checkout, so the run would stop later with a branch half landed.
2. **Scaffold**, on the base in the main checkout. The first case that applies:
   - **No repository, or one whose `HEAD` has no commit** (`git rev-parse --verify --quiet HEAD` fails): `git init -b main` when there is no repository, then `jodysalt:setup-skills`, then one `chore:` commit through `jodysalt:commit` that takes everything present, files that were already there included, because anything left untracked trips the dirty-checkout guard later. It gives the ticket's worktree something to fork from.
   - **A repository whose `docs/vision.md` is missing**, code without the layout: `jodysalt:setup-skills`, then one `chore:` commit through `jodysalt:commit` of what it wrote.
   - **A repository with the layout**: nothing to scaffold.

   Then, in every case, the vision check: the root runs `grep -F` on `docs/vision.md` for the template prompts `setup-skills` writes, each line below a prompt or its opening words, kept in step with `skills/setup-skills/SKILL.md`:

   ```
   One paragraph on what this project is and the direction it is heading.
   Who this is for, and who the first user is.
   The problems those users have that this project exists to solve, one bolded name and a sentence each.
   The rules every change is
   ### {Goal title}
   What is true when this goal is met, and why it matters now.
   What this project deliberately does not do, one bolded name and a sentence each.
   ```

   Any match gets a `refine-vision` stage whose argument is the whole vision, filled from the brief, with a goal for the brief among its `## Goals`; the argument quotes the brief, since a stage sees nothing else of it. Then `jodysalt:commit` in the root as a `docs:` commit with the root's answers in its body. With no brief there is nothing to fill it from, so a match stops the run. The root never adds a goal to a filled vision.
3. **Brief or resume.** With a brief, continue at step 4. With none, `ls -d docs/tickets/open/*/` must hold exactly one slug without `--`; otherwise stop and list what is there. That ticket stands in for the brief, its `index.md` answering where the brief would, and the run continues at step 5 with its slug.
4. **Draft.** An `add-ticket` stage in the main checkout with the brief as its argument, the root declining `add-ticket`'s planning-session offer as the user so the ticket is drafted on the base. Then `jodysalt:commit` in the root as a `docs:` commit staging `docs/tickets/open/{slug}`, with the root's answers and the recommendations it took in its body. A stage that stops at `add-ticket`'s goal gate because nothing in a filled vision fits ends the run with the stop report, naming the brief and the vision's goals and principles; nothing is drafted.
5. **Implement.** `jodysalt:complete-ticket {slug}` in the root, which adds or enters the ticket's worktree, then slices, loops and resumes a stopped slice, entering each slice's worktree and returning to the ticket's. Every question it asks, a slice drafter's among them, the root answers as it answers a stage's. A stop ends the run: the root runs `jodysalt:exit-worktree` so the session ends in the main checkout, leaves the worktrees and their commits on disk for a resume or a person, and prints the stop report. Otherwise the root collects every check `complete-ticket` left for a person.
6. **Land.** `jodysalt:wrap-up-worktree {slug}` in the root, which closes the ticket, squashes the branch to one commit, fast-forwards it into the base and removes the worktree and its branch. A merge that cannot fast-forward ends the run with the stop report.
7. **Report.** Print the final report of `## Report`. The run ends in the main checkout with `git status --porcelain` empty.

## Report

The final report, in this order:

1. On a resume, the ticket taken.
2. The answers the root gave, each with the stage that asked and where the answer came from: the brief, `docs/vision.md`, or the stage's recommendation, taken because both were silent.
3. Every check `complete-ticket` left for a person, a visual match or a manual step in a test plan among them: anything no worker could verify, neither dropped nor marked done.
4. `git log --oneline` of the base branch, named, for the run's commits: the scaffold and vision commits when step 2 made them, then the ticket's `docs:` commit and the landed branch.

On a stop: the reason, the branch, the worktree and the stage, and what is on disk for a resume – a rerun with no brief continues from the docs and the worktree as they are.

## Rules

- Never pushes or fetches.
- Never asks the person anything; the brief is the whole input. A question is answered by a stage or by the root.
- Never retries, re-plans or rolls back a failed task; the first failure ends the run.
- Never runs stages in parallel.
- Gives no skill a `deliver-brief` mode; every skill runs as any user would run it.
- The base branch changes only by fast-forward merge through `jodysalt:wrap-up-worktree`, with one exception: the run's own scaffold and docs commits, made on the base by `jodysalt:commit`. Never a merge commit, a rebase, a reset or a checkout.
- A brief that says "like X" gets X's layout and behaviour, never its brand assets or licensed material.
- The root's transcript holds no stage skill's body and no stage's working: only the stage reports, the root's answers and the run of `complete-ticket`, whose own sub-agents keep their work out of it.
- There is no run log; git history is the trail, and each docs commit's body carries what a person would otherwise have been told.
