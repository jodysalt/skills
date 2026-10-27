---
name: add-market-test
description: Sets up one market test from an idea in one command – runs `add-competitor-analysis` then `add-landing-page` with the same idea, each handing off to its own refine, so the analysis at `docs/competitor-analysis.md` is researched before the page at `docs/landing-page/index.html` is filled against it; skips a half that already exists. Use when the user says "add a market test", "market-test this idea end to end", "set up a market test for X", or runs `/add-market-test`. Pure orchestrator: writes nothing itself, never overwrites either half, never pushes, never commits.
argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"
---

# Add market test

Set up one market test from an idea in one command: invoke `add-competitor-analysis` with the idea, which writes the analysis and hands off to `refine-competitor-analysis` to research and fill it, then `add-landing-page` with the same idea, which scaffolds the page and hands off to `refine-landing-page` to interview and fill it against that analysis. It only orchestrates those two skills and writes nothing itself; each half's interview, files and report are its own, and revisiting both later is `refine-market-test`'s.

## Idea

$ARGUMENTS

The product idea in one line, passed as it stands to both skills. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Check `docs/competitor-analysis.md` and `docs/landing-page/index.html` under it. Both present: stop, change nothing, and point at `jodysalt:refine-market-test`. One present: say so, name the refine that improves it (`jodysalt:refine-competitor-analysis` or `jodysalt:refine-landing-page`), and run only the missing half below.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session market-test`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation; either way the two skills below skip theirs. The root is `git rev-parse --show-toplevel` from here on.
3. **Analysis.** When `docs/competitor-analysis.md` is missing, invoke the `add-competitor-analysis` skill from this plugin (`jodysalt:add-competitor-analysis`) with the idea – the Skill tool call, never a sub-agent – and let it run to the end of its hand-off: it writes the skeleton and `refine-competitor-analysis` researches and fills it in the same session. Its report is its own.
4. **Page.** When `docs/landing-page/index.html` is missing, invoke the `add-landing-page` skill from this plugin (`jodysalt:add-landing-page`) with the same idea, the same way, and let it run to the end of its hand-off: it scaffolds the page and `refine-landing-page` interviews and fills it, reading the analysis step 3 left. Its report is its own.
5. **Report.** Which halves ran and which were skipped as already present, in one line each, after the inner reports; that everything is uncommitted; and the next steps in order: `jodysalt:commit`, then `jodysalt:wrap-up-worktree` to land the planning branch, and `jodysalt:refine-market-test result` when the window ends.

## Rules

- Pure orchestrator: writes no file itself, asks no question the two skills do not ask, and never overwrites either half; an existing file is skipped, never replaced.
- Never pushes, never commits, never publishes the page.
- The two skills are invoked in that order and never in parallel, since the page's interview reads the analysis.
