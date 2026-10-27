# Vision

An opinionated, spec-driven workflow for Claude Code, from vision to goals to tickets, sub-tickets and tasks to an unattended loop, driven by hand or by one command, plus the git and thinking skills the workflow depends on.

## Target users

Any Claude Code user who wants their agent to work from a spec rather than from chat, or who has an idea and an empty repo and wants to test the market before writing one. The first user is the maintainer's SaaS repo, which the skills were extracted from and which now consumes the published plugin.

## Core problems

- **Decisions evaporate.** Plans, trade-offs and answers live in chat scrollback and are gone by the next session. The workflow writes them down as a vision with its goals and principles and as tickets that cite them, so every change traces back to why.
- **Agents drift without a spec.** A ticket implemented from a conversation looks different every time. A ticket with a goal, scope, acceptance criteria and a test plan does not.
- **Unattended work needs structure.** A loop that implements tasks in fresh sessions with no chat context only works if each task stands alone and each change lands as one clean commit.
- **Conventions are hard to adopt.** The layout the workflow rests on has to exist before the first skill runs.

## Product principles

- **One opinionated method.** A skill belongs here only if the method uses it. Anything that stands alone belongs somewhere else.
- **Explore before asking.** A question the codebase can answer is never put to the user. When a question is needed, it comes one at a time with a recommended answer.
- **Driver-agnostic.** A skill serves whoever invoked it, a person or an agent. It asks the same questions the same way and never assumes a human is reading the turn.
- **Trim with the 80/20 principle.** Commit messages, skill bodies and question order all separate the vital few from the trivial many. Refining anything starts with what can be removed while it works as well or better, before anything is added.
- **Add, then refine.** Whatever the method adds comes as a pair: `add-{foo}` writes the boilerplate and hands off to `refine-{foo}`, which improves what exists in place, so anything added can always be refined and the two share no steps. A skill that can plausibly take the `add-{foo}` form does, and names the partners it implies, `remove-{foo}` first.
- **Branches before `main`.** A planning doc is drafted on a planning branch and a change to source is made on a ticket's branch; a skill that writes to the repo runs the branch gate first, so nothing is edited on the base by accident.
- **One thing, then stop.** A skill does its one job, leaves the result for review, and never pushes.
- **Claude Code first.** Skills call each other by namespaced name and spawn sub-agents where the method needs it. Nothing else leans on Claude Code without a reason, so the bodies stay readable to other agents where that is cheap.
- **`main` is always installable.** Users auto-update from it, so every merge is a release. The plugin version bumps on any change to a skill's behaviour.
- **Dogfooding.** This repo runs its own workflow: its purpose lives in this file, changes to the skills arrive as tickets, and the loop implements them. No change to a skill lands without a ticket behind it.

## Goals

### Evals for the risky skills

Strict validation gates every skill. The skills that run unattended (`complete-task`, `complete-tasks`) and the one that moves files and rewrites paths across a repo (`close-ticket`) also get eval suites, because nobody is watching when they regress. Interview skills stay eval-free; a human reads every turn, and when `deliver-brief` drives them instead, its own suite covers the run. Success: a regression in a risky skill fails an eval before it reaches `main`.

### Market test before building

A product idea can enter the method through a market test: a single static landing page that sells the product before it exists, hosted from the repo on GitHub Pages or the like, and the product mocks whose screenshots give the page its copy and which outlive the test as the design the first tickets are drafted against. Its hypothesis, metric and threshold are written down beside the page before it goes live, and its result lands there too, so `refine-vision` can cite what the market said instead of what the maintainer remembers. The test is optional; a repo that already knows what it is building starts at `docs/vision.md` as before. Success: one real idea goes through it end to end in a repo with no vision yet – page and mocks scaffolded by the skills, published, the result written beside the page, and `docs/vision.md` then written citing it – whether the idea passed or failed.

### Adoption beyond the first user

The first user's repo installs the plugin, deletes its local skill copies, and keeps only repo-specific detail in its own CLAUDE.md or a small local skill. Then one repo the maintainer does not own adopts the workflow end to end: scaffold, ticket, tasks, loop. Success: both have happened.

## Non-goals

- **A marketplace for other people's plugins.** The `jodysalt` marketplace publishes this plugin.
- **A home for standalone skills.** A useful skill the method does not call does not belong here, however good it is.
- **A website builder.** A landing page is one static file with no framework or build step; ads, traffic and analytics are the user's own.
- **Portability as a goal.** Skill bodies avoid needless Claude Code specifics, but the method depends on Claude Code and is not contorted to run elsewhere.
- **Several plugins.** The skills form one call chain and ship as one plugin. Installing all of them costs a user only their descriptions in context.
- **A feature of the first user's product.** The skills were extracted from it, but it consumes the plugin and does not own it.
