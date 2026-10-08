# Vision

An opinionated, spec-driven workflow for Claude Code, from vision to goals to tickets, sub-tickets and tasks to an unattended loop, driven by hand or by one command, plus the git and thinking skills the workflow depends on.

## Target users

Any Claude Code user who wants their agent to work from a spec rather than from chat. The first user is the maintainer's SaaS repo, which the skills were extracted from and which now consumes the published plugin.

## Core problems

- **Decisions evaporate.** Plans, trade-offs and answers live in chat scrollback and are gone by the next session. The workflow writes them down as a vision with its goals and principles and as tickets that cite them, so every change traces back to why.
- **Agents drift without a spec.** A ticket implemented from a conversation looks different every time. A ticket with a goal, scope, acceptance criteria and a test plan does not.
- **Unattended work needs structure.** A loop that implements tasks in fresh sessions with no chat context only works if each task stands alone and each change lands as one clean commit.
- **Conventions are hard to adopt.** The layout the workflow rests on has to exist before the first skill runs.

## Product principles

- **One opinionated method.** A skill belongs here only if the method uses it. Anything that stands alone belongs somewhere else.
- **Explore before asking.** A question the codebase can answer is never put to the user. When a question is needed, it comes one at a time with a recommended answer.
- **Driver-agnostic.** A skill serves whoever invoked it, a person or an agent. It asks the same questions the same way and never assumes a human is reading the turn.
- **Trim with the 80/20 principle.** Commit messages, skill bodies and question order all separate the vital few from the trivial many.
- **One thing, then stop.** A skill does its one job, leaves the result for review, and never pushes.
- **Claude Code first.** Skills call each other by namespaced name and spawn sub-agents where the method needs it. Nothing else leans on Claude Code without a reason, so the bodies stay readable to other agents where that is cheap.
- **`main` is always installable.** Users auto-update from it, so every merge is a release. The plugin version bumps on any change to a skill's behaviour.
- **Dogfooding.** This repo runs its own workflow: its purpose lives in this file, changes to the skills arrive as tickets, and the loop implements them. No change to a skill lands without a ticket behind it.

## Goals

### Evals for the risky skills

Strict validation gates every skill. The skills that run unattended (`complete-task`, `complete-tasks`) and the one that moves files and rewrites paths across a repo (`close-ticket`) also get eval suites, because nobody is watching when they regress. Interview skills stay eval-free; a human reads every turn, and when `deliver-brief` drives them instead, its own suite covers the run. Success: a regression in a risky skill fails an eval before it reaches `main`.

### Adoption beyond the first user

The first user's repo installs the plugin, deletes its local skill copies, and keeps only repo-specific detail in its own CLAUDE.md or a small local skill. Then one repo the maintainer does not own adopts the workflow end to end: scaffold, ticket, tasks, loop. Success: both have happened.

## Non-goals

- **A marketplace for other people's plugins.** The `jodysalt` marketplace publishes this plugin.
- **A home for standalone skills.** A useful skill the method does not call does not belong here, however good it is.
- **Portability as a goal.** Skill bodies avoid needless Claude Code specifics, but the method depends on Claude Code and is not contorted to run elsewhere.
- **Several plugins.** The skills form one call chain and ship as one plugin. Installing all of them costs a user only their descriptions in context.
- **A feature of the first user's product.** The skills were extracted from it, but it consumes the plugin and does not own it.
