---
name: refine-vision
description: Revisits `docs/vision.md` and improves it in place – explores the repo, reports which sections are missing or still hold the scaffold's template prompt and what an open ticket cites or contradicts, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the vision", "revisit the vision", "flesh out the vision", "fill in the vision", or runs `/refine-vision`. Edits `docs/vision.md` in place and, when a goal is renamed, the `delivers:` tag in each open ticket's frontmatter with it, keeping open tickets' goal citations in step; never invents content, never rewrites a ticket beyond that tag, never commits.
argument-hint: "[what to revisit, e.g. 'target users' – defaults to the whole vision]"
---

# Refine vision

Improve `docs/vision.md` in place: explore, assess, interview, edit. Leave the result uncommitted. Works the same on the template `setup-skills` just wrote and on a vision that has drifted from the tickets under it.

## Scope

$ARGUMENTS

If given, one or more section names matched case-insensitively against the `## ` headings (`target users`, `goals`, …); the findings and the interview cover only those sections. If empty, the whole file. If a name matches no heading, list the headings and ask.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Explore before asking.** Read `README.md`, `package.json` or the equivalent manifest, everything under `docs/`, `git log --oneline -30` and `docs/tickets/open/*/index.md`; recommended answers come from these. Then read `docs/vision.md`. If it doesn't exist, stop and point at `jodysalt:setup-skills`; this skill fills a vision in, it never creates one.
3. **Report findings before editing anything:**
   - Sections missing, or still holding the one-line prompt the `docs/vision.md` template in `setup-skills` writes. *Target users*, *Core problems*, *Product principles* and *Non-goals* are reported missing by name; the `###` section is reported missing only when no `##` section in the file holds a `###` heading, whatever that section is called, `## Goals` being the scaffold's default, so a repo whose section is `## Outcomes` gets no finding for it. The prompts, quoted here so this check reads no other skill:
     - the opening thesis: "One paragraph on what this project is and the direction it is heading."
     - *Target users*: "Who this is for, and who the first user is."
     - *Core problems*: "The problems those users have that this project exists to solve, one bolded name and a sentence each."
     - *Product principles*: "The rules every change is judged by, one bolded name and a sentence each."
     - *Goals*: "The outcomes the vision commits to, one `###` section per goal; a `feat` ticket names the goal it delivers by its exact title with `delivers:`." and, under its `### {Goal title}` placeholder, "What is true when this goal is met, and why it matters now."
     - *Non-goals*: "What this project deliberately does not do, one bolded name and a sentence each."
   - A `delivers:` in an open ticket's frontmatter whose title matches no `### ` heading in the file. A goal no ticket cites is not a finding: a goal can wait for its ticket, and it is retired here, by deleting its section, when the user says it is met.
   - Content an open ticket contradicts: a user, problem, principle, goal or non-goal its `# Goal` or `## Strategic fit` argues against.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the vision at `docs/vision.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then add the decisions the vision makes without saying so.
   - The README, manifests, docs and git log from step 2 count as explorable; a question they answer is never asked, and each recommended answer cites what it came from.
   - Only an answer the user agrees to lands. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `docs/vision.md` as answers land, keeping the opening thesis paragraph, the `## ` headings in order (*Target users*, *Core problems*, *Product principles*, the `###` section, *Goals* by default, *Non-goals*) and one `### {Title}` per goal. When an answer renames a goal, rewrite the `delivers:` line in every open ticket's frontmatter that names it by the old title in the same edit and say so, since `add-ticket` writes the exact title; that needs no second question. Anything more in a ticket is surfaced, not changed.
5. Stop. Leave the edit uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Edit `docs/vision.md`, plus a renamed goal's `delivers:` tags in open tickets, and nothing else.
- Never invent content; ask, or leave a `TODO:` marker.
- Never rewrite a ticket beyond that tag; surface what it contradicts and leave the fix to `refine-ticket`.
- Keep the section headings and the `###`-per-goal shape: `add-ticket` cites a goal by its exact title, and a goal is retired here when the user says it is met, by deleting its section.
