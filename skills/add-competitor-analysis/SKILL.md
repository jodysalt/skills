---
name: add-competitor-analysis
description: Writes the skeleton of a competitor analysis at `docs/competitor-analysis.md` on a planning branch – keywords, one section per competitor for pricing, guarantee and positioning, the opening – every section a `TODO:` prompt, then hands off to `refine-competitor-analysis`, which searches and fills it. Use when the user says "add a competitor analysis", "find the competition for X", "who else sells X", or runs `/add-competitor-analysis`. Never overwrites an existing analysis, never searches, never commits.
argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"
---

# Add competitor analysis

Write the skeleton of one competitor analysis from an idea and hand it off: the document at `docs/competitor-analysis.md`, every section a `TODO:` prompt naming what goes there, uncommitted, then invoke `refine-competitor-analysis` in the same session, which searches the keywords, reads the competitors' sites and fills the prompts in. It searches nothing and writes nothing from the idea itself; the idea reaches the research through the hand-off's framing. Improving an analysis that exists is `refine-competitor-analysis`'s. Branch gate as a spec skill's: the analysis is drafted on a planning branch and lands through `wrap-up-worktree`.

## Idea

$ARGUMENTS

The product idea in one line, the same line `add-landing-page` takes. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/competitor-analysis.md` exists under it, stop and say so, naming `jodysalt:refine-competitor-analysis` as the skill that improves an existing analysis; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the document and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session competitor-analysis`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Write the skeleton.** Write `docs/competitor-analysis.md`, creating `docs/` when missing, holding exactly the template below: every section a `TODO:` prompt naming what goes there, which `refine-competitor-analysis` fills from its research and the interview. The three competitor headings stand for the three or four the research finds; the refine renames, adds or removes them.

   ```markdown
   # Competitor analysis

   ## Keywords
   TODO: the main keywords a buyer would search for this idea, one per line, filled by refine-competitor-analysis.

   ## Competitors

   ### TODO: competitor name
   - **URL:** TODO: the site.
   - **Pricing:** TODO: the plans and prices, with their unit.
   - **Guarantee:** TODO: the guarantee, refund or trial, or "none".
   - **Positioning:** TODO: who it is for and the promise it leads with, in a sentence.

   ### TODO: competitor name
   - **URL:** TODO: the site.
   - **Pricing:** TODO: the plans and prices, with their unit.
   - **Guarantee:** TODO: the guarantee, refund or trial, or "none".
   - **Positioning:** TODO: who it is for and the promise it leads with, in a sentence.

   ### TODO: competitor name
   - **URL:** TODO: the site.
   - **Pricing:** TODO: the plans and prices, with their unit.
   - **Guarantee:** TODO: the guarantee, refund or trial, or "none".
   - **Positioning:** TODO: who it is for and the promise it leads with, in a sentence.

   ## Opening
   TODO: the gap the offer should take – what no competitor prices, guarantees or promises – in a sentence or two, filled by refine-competitor-analysis.
   ```
4. **Hand off.** Invoke the `refine-competitor-analysis` skill from this plugin (`jodysalt:refine-competitor-analysis`) with an empty argument, so its scope is the whole document, in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the idea is: {idea}; this is a fresh boilerplate", `{idea}` the line from `## Idea`. The framing is how the idea reaches the research; `refine-competitor-analysis` reads it from there and otherwise from the document, finds every `TODO:` the skeleton left, and fills each from its searches and the interview.
5. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was written even when the research stops early: `docs/competitor-analysis.md`, written. Say that it is uncommitted and that `refine-competitor-analysis`'s report follows with the research's result; the commit suggestion is its.

## Rules

- Never overwrites `docs/competitor-analysis.md`; a document that exists stops the run before anything is written.
- Writes nothing outside `docs/competitor-analysis.md`.
- No program runs beyond `git`, no search is made, and nothing is installed.
- Never pushes, never commits.
- Reads `docs/glossary.md` and never writes it.
