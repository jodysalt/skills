---
name: refine-market-test
description: Revisits one market test in one command – runs `refine-competitor-analysis` to refresh the competitors, then `refine-landing-page` to improve the page at `docs/landing-page/index.html` against the refreshed analysis, or with `result` only the page, to record the outcome. Use when the user says "refine the market test", "refresh the market test", "record the market test result", or runs `/refine-market-test`. Pure orchestrator: writes nothing itself, never creates either half, never pushes, never commits.
argument-hint: "['result' to record the outcome – defaults to both halves, whole]"
---

# Refine market test

Revisit one market test in one command: invoke `refine-competitor-analysis`, which re-searches the competitors and reports what changed, then `refine-landing-page`, which improves the page against the refreshed analysis and the notes. It only orchestrates those two skills and writes nothing itself; each half's findings, interview and report are its own. It never creates either half; a repo with no analysis or no page is `jodysalt:add-market-test`'s.

## Scope

$ARGUMENTS

If given, `result`: the analysis is left as it is and only `refine-landing-page result` runs, since recording the outcome needs no competitor refresh. If empty, both halves, whole. Anything else: say the two scopes and ask.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/competitor-analysis.md` or `docs/landing-page/index.html` is missing under it, stop, change nothing, and point at `jodysalt:add-market-test`, which adds the missing half.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session market-test`; when `git status --porcelain docs/competitor-analysis.md docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are. Continue on the current branch if the user declines. Skip if the gate already ran this conversation; either way the two skills below skip theirs. The root is `git rev-parse --show-toplevel` from here on.
3. **Analysis.** Unless the scope is `result`, invoke the `refine-competitor-analysis` skill from this plugin (`jodysalt:refine-competitor-analysis`) with an empty argument – the Skill tool call, never a sub-agent – and let it run to its report: it re-searches the keywords and reports and lands what changed.
4. **Page.** Invoke the `refine-landing-page` skill from this plugin (`jodysalt:refine-landing-page`) with the scope as given – `result`, or empty – the same way, and let it run to its report: it reads the refreshed analysis and improves the page, or records the result.
5. **Report.** Which halves ran, in one line each, after the inner reports; that everything is uncommitted; and the next steps: `jodysalt:commit`, then `jodysalt:wrap-up-worktree` to land the planning branch.

## Rules

- Pure orchestrator: writes no file itself, asks no question the two skills do not ask, and never creates either half.
- Never pushes, never commits, never publishes the page.
- The two skills are invoked in that order and never in parallel, since the page's interview reads the analysis.
