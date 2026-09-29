---
name: refine-vision
description: Revisits `docs/vision.md` and improves it in place – explores the repo, reports which sections are missing or still hold the scaffold's template prompt and what an open initiative cites or contradicts, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the vision", "revisit the vision", "flesh out the vision", "fill in the vision", or runs `/refine-vision`. Edits `docs/vision.md` only; never invents content, never touches initiatives or tickets, never commits.
argument-hint: "[what to revisit, e.g. 'target users' – defaults to the whole vision]"
---

# Refine vision

Improve `docs/vision.md` in place: explore, assess, interview, edit. Leave the result uncommitted. Works the same on the template `setup-skills` just wrote and on a vision that has drifted from the initiatives under it.

## Scope

$ARGUMENTS

If given, one or more section names matched case-insensitively against the `## ` headings (`target users`, `strategic bets`, …); the findings and the interview cover only those sections. If empty, the whole file. If a name matches no heading, list the headings and ask.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Explore before asking.** Read `README.md`, `package.json` or the equivalent manifest, everything under `docs/`, `git log --oneline -30` and `docs/initiatives/open/*.md`; recommended answers come from these. Then read `docs/vision.md`. If it doesn't exist, stop and point at `jodysalt:setup-skills`; this skill fills a vision in, it never creates one.
3. **Report findings before editing anything:**
   - Sections missing, or still holding the one-line prompt the `docs/vision.md` template in `setup-skills` writes. The prompts, quoted here so this check reads no other skill:
     - the opening thesis: "One paragraph on what this project is and the direction it is heading."
     - *Target users*: "Who this is for, and who the first user is."
     - *Core problems*: "The problems those users have that this project exists to solve, one bolded name and a sentence each."
     - *Product principles*: "The rules every change is judged by, one bolded name and a sentence each."
     - *Strategic bets*: "The few pushes that move the vision forward, one `###` section per bet; an initiative cites a bet by its exact title." and, under its `### {Bet title}` placeholder, "What this bet changes, why now, and what success looks like."
     - *Non-goals*: "What this project deliberately does not do, one bolded name and a sentence each."
   - A bet an open initiative's `## Why now` cites by exact title with no matching `### ` heading under `## Strategic bets`. A bet no initiative cites is not a finding: a bet can wait for its initiative, and `close-initiative` retires one that is spent.
   - Content an open initiative contradicts: a user, problem, principle, bet or non-goal its `## Outcome` or `## Why now` argues against.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the vision at `docs/vision.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then add the decisions the vision makes without saying so.
   - The README, manifests, docs and git log from step 2 count as explorable; a question they answer is never asked, and each recommended answer cites what it came from.
   - Only an answer the user agrees to lands. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit only `docs/vision.md` as answers land, keeping the opening thesis paragraph, the five `## ` headings in order (*Target users*, *Core problems*, *Product principles*, *Strategic bets*, *Non-goals*) and one `### {Title}` per strategic bet. Initiatives and tickets stay untouched.
5. Stop. Leave the edit uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Edit nothing but `docs/vision.md`.
- Never invent content; ask, or leave a `TODO:` marker.
- Never touch initiatives or tickets; surface what they contradict and leave the fix to `refine-initiative` or `refine-ticket`.
- Keep the section headings and the `###`-per-bet shape: `add-initiative` cites a bet by its exact title and `close-initiative` deletes its section by that title.
