---
name: jarvis
description: Runs the whole chain from a brief to a `main` ready for review with no human turn – scaffolds the layout, fills `docs/vision.md`, drafts the initiative and its tickets one at a time, breaks each one down, runs the loop and closes what it finished, playing the user at every question. Use when the user says "run jarvis", "deliver this brief", "jarvis, build X", or runs `/jarvis`. With no brief, resumes the only open initiative from the docs on `main`. Never pushes.
argument-hint: "[the brief – empty resumes the only open initiative, from the main checkout]"
---

# Jarvis

Drive the existing chain from a brief to a `main` ready for review, the way a person does. Every skill runs as it does today and `jarvis` plays the user at every question, so no skill gains a jarvis mode. `main` changes only by fast-forward merge, so `git log` on `main` reads as the run's history: one commit per planning session and one per ticket. The root stays thin. It holds the brief, the step the run is at, the tickets worked so far, one report of a few lines per stage and the answers the root gave, and nothing else; the work happens in stages.

## Brief

$ARGUMENTS

If empty, the run resumes by step 3's resume rules: the only open initiative stands in for the brief, and the run continues at the first unfinished piece the docs on `main` record.

## Caps

Two constants, fixed here and cited by the steps:

- **Ticket cap: 5.** Tickets per run, spikes included. After the fifth ticket the run stops with a report instead of drafting a sixth.
- **Round cap: 3.** Interview rounds per stage, a round being one exchange of vital questions and answers between a stage and the root. A stage still asking after the third round is stuck, and the run stops with a report.

## Stages and the root

A stage is a fresh sub-agent that invokes one skill, does the work and reports in a few lines. The stages, in the order a run meets them: the scout, `refine-vision`, `add-initiative`, `add-ticket`, `add-tasks`, `complete-tasks`, `wrap-up-ticket`, the judge and `close-initiative`. The scout and the judge invoke no skill; their job is spelled out where they run, in steps 3 and 6.

The root runs the rest itself, a few tool calls each: `git init`, `jodysalt:setup-skills`, `jodysalt:commit`, `jodysalt:squash-commits`, `jodysalt:start-planning-session`, `jodysalt:add-worktree`, `jodysalt:enter-worktree`, `jodysalt:exit-worktree`, `jodysalt:merge-worktree` and `jodysalt:remove-worktrees`. Checkouts are the reason: Claude Code's `EnterWorktree` from a sub-agent moves only that agent, and every stage inherits the root's checkout, so a stage that switched would leave the root, and its own workers, somewhere else.

The root answers every question a root-run skill asks with the run's choice: the named worktree when one asks which, yes to deleting its branch, and no to every offer of another skill (`setup-skills` offering `refine-vision`, `add-worktree` offering `enter-worktree`, `merge-worktree` offering `remove-worktrees`), since the run invokes what it needs itself. A stop from `commit` on a secret or a build artefact ends the run with that report.

## Stage prompt

One template for every stage, `<skill>` and `<argument>` filled in; there is no prompt per stage. For the scout and the judge, which invoke no skill, the job paragraph is the one steps 3 and 6 spell out, and the rest of the template stands.

```
You are one stage of an unattended `jarvis` run. No person reads this conversation, so never ask one anything.

Your job: invoke the `jodysalt:<skill>` skill with the argument `<argument>` and follow it to completion. If the Skill tool is unavailable, read `${CLAUDE_PLUGIN_ROOT}/skills/<skill>/SKILL.md` and follow it directly, treating the argument as its `$ARGUMENTS`.

Where the skill interviews, `grill-me`'s rule for an unattended caller applies: the recommended answer is the user's for the trivial many, and the vital few go in your report. Take no offer to invoke another skill; report the offer instead. Never push.

Your final message is a few lines: what you did and which files changed; any check the work leaves for a person; and last, either the word `done` or the vital few questions, each with its options and a recommendation.
```

Each stage is spawned with the Agent tool (`general-purpose`, run synchronously so the root blocks until the report), inherits the root's model and checkout with no override, and never runs in parallel with another. A report ending in questions is one round. The root answers each from the brief first, then `docs/vision.md` (on a resume, the initiative file stands in for the brief), and when both are silent takes the stage's recommendation and says so. It sends the answers, as the user's, to the same sub-agent with `SendMessage` so its context stays intact, and waits for the next report. The root answers at most 3 rounds, the `## Caps` constant; a report that still ends in questions after the third round's answers stops the run with a report naming the stage and its open questions. A report ending in `done` is recorded as that stage's report, and every answer the root gave goes into that stage's commit body and the final report.

## Steps

1. **Guard.** If `git rev-parse --is-inside-work-tree` fails there is no repository, and step 2 handles it. Otherwise check the ground, and stop at the first failure with its reason, nothing has changed yet:
   - `git rev-parse --show-toplevel` must equal the first path in `git worktree list`. Otherwise the run was started from inside a worktree: stop and point at `jodysalt:exit-worktree`, because `add-worktree` and `merge-worktree` run from the main checkout.
   - `git status --porcelain` must be empty. Otherwise stop and point at commit or stash; do neither on the person's behalf. `merge-worktree` refuses a dirty main checkout, so the run would stop later with a branch half landed.
2. **Directory state.** One of three:
   - **No repository, or one with no commit on `main`** (`git rev-parse --verify --quiet main` fails): `git init -b main` when there is no repository, then `jodysalt:setup-skills`, then one `chore:` commit through `jodysalt:commit` that takes everything present, files that were already there included, because anything left untracked trips the dirty-main guard later. This is the one thing the scaffold refuses to do, and it gives the planning branches something to fork from.
   - **A repository whose `docs/vision.md` is missing**, code without the layout: the scaffold is a planning session of its own. `jodysalt:start-planning-session`, `jodysalt:setup-skills`, `jodysalt:commit` (`chore:`), `jodysalt:squash-commits` (which reports nothing to squash for one commit, and that is fine), `jodysalt:exit-worktree`, `jodysalt:merge-worktree <planning worktree name>` and `jodysalt:remove-worktrees <name>`, yes to deleting its branch.
   - **A repository with the layout**: continue at step 3.

## Report

The final report, in this order:

1. The reading the scout took of the brief and why, so a person who meant another reading sees it first. On a resume, the initiative taken and the piece resumed at.
2. The answers the root gave, each with the stage that asked and where the answer came from: the brief, `docs/vision.md`, or the stage's recommendation, taken because both were silent.
3. Every check left for the person, a visual match or a manual step in a test plan among them: anything no worker could verify, neither dropped nor marked done.
4. `git log --oneline` of `main` for the run's commits.

On a stop: the reason, the branch, the worktree and the stage, and what is left on disk for a resume or a person, the docs as they were.

## Rules

- Never pushes or fetches.
- Never asks the person anything; the brief is the whole input. A question is answered by a stage or by the root.
- Never retries, re-plans or rolls back a failed task; the loop's first failure ends the run.
- Never runs workers or tickets in parallel.
- Gives no skill a jarvis mode; every skill runs as it does today.
- `main` changes only by fast-forward merge through `jodysalt:merge-worktree`, the scaffold's first commit on an empty `main` aside: never a merge commit, a rebase or a reset.
- A brief that says "like X" gets X's layout and behaviour, never its brand assets or licensed material.
- The root's transcript holds no stage skill's body and no worker's report: only the stage reports and the root's answers.
- There is no run log; git history is the trail, and each planning commit's body carries what a person would otherwise have been told.
