---
title: One Command Adoption
started: 2026-09-28
---

## Outcome
A repo that has never seen the workflow is ready for it after two skill runs. A scaffold skill creates the layout: `docs/vision.md` from a template, `docs/initiatives/{open,closed}/`, `docs/tickets/{open,closed}/`, an empty `tasks.md`, a CLAUDE.md pointer at the workflow, and whatever else an installed skill assumes exists (a `worktrees/` line in `.gitignore`, for one); the scaffold ticket fixes the exact list. The scaffold ends by offering `refine-vision`, a skill in the shape of `refine-initiative` that assesses `vision.md` against the template, interviews the user through the gaps, and edits it in place; it works as well on a vision that has drifted as on a fresh template, and becomes the second skill allowed to edit `vision.md`. From there `/jodysalt:add-initiative` and `/jodysalt:add-ticket` run without anyone creating a file by hand. The scaffold's first run is in this repo, as the scaffold ticket's rollout: it fills in what this hand-made layout lacks and leaves what exists alone. This repo's README gains a short Workflow section naming the chain (vision, initiatives, tickets, tasks, loop) and the skill that moves each step; the scaffold writes no `docs/README.md`, because the skills carry the templates and rules.

## Why now
The *Adoption in one command* bet in `vision.md`. The skills were extracted from the maintainer's SaaS repo, where the layout they rest on was built by hand over months. The published plugin now reaches repos that have none of it, and the first skill a newcomer runs fails on a missing `docs/vision.md` or `docs/initiatives/open/`: the *Conventions are hard to adopt* problem in `vision.md`. Two other bets wait on this one. *Dogfooding* needs the layout in this repo, which lacks it too (this initiative was drafted into a hand-made directory). *Adoption beyond the first user* needs a repo the maintainer does not own to set the workflow up without help.

## Success metrics
- In a fresh `git init` repo with the plugin installed, the maintainer runs the scaffold, `refine-vision`, `add-initiative` and `add-ticket` in that order, creates no file by hand, and has a drafted ticket in under an hour.
- This repo's `docs/tickets/{open,closed}/`, `tasks.md` and CLAUDE.md pointer were produced by the scaffold, not by hand, and its `vision.md` and this initiative survived the run untouched.

## Non-goals
- Moving the first user's repo onto the published plugin and deleting its local skill copies. That is the *Adoption beyond the first user* bet; this initiative only readies a repo that has no layout.
- Running this repo's own workflow end to end. The scaffold's first run lands here, and the rest of the *Dogfooding* bet is its own initiative.
- Eval suites for the scaffold or `refine-vision`. Neither runs unattended or rewrites paths across a repo, so the *Evals for the risky skills* bet decides; strict validation and the throwaway-repo run are the checks here.
- Anything no skill needs: CI, git hooks, permission settings, a sample initiative or ticket, or a `docs/README.md` that duplicates what the skills already carry.
- Writing `vision.md` for the user. `refine-vision` interviews; it never invents an answer.

## Tickets
- docs/tickets/closed/setup-skills/index.md
