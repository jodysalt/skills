# Add market test

Set up one market test from an idea in one command: invoke `add-competitor-analysis` with the idea, which writes the analysis and hands off to `refine-competitor-analysis` to research and fill it, then `add-landing-page` with the same idea, which scaffolds the page and hands off to `refine-landing-page` to interview and fill it against that analysis. It only orchestrates those two skills and writes nothing itself; each half's interview, files and report are its own, and revisiting both later is `refine-market-test`'s.

## Idea

The arguments passed to the play.

The product idea in one line, passed as it stands to both skills. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Check `docs/competitor-analysis.md` and `docs/landing-page/index.html` under it. Both present: stop, change nothing, and point at `jodysalt:playbook refine-market-test`. One present: say so, name the refine that improves it (`jodysalt:playbook refine-competitor-analysis` or `jodysalt:playbook refine-landing-page`), and run only the missing half below.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:playbook start-planning-session market-test`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation; either way the two skills below skip theirs. The root is `git rev-parse --show-toplevel` from here on.
3. **Analysis.** When `docs/competitor-analysis.md` is missing, invoke the `add-competitor-analysis` skill from this plugin (`jodysalt:playbook add-competitor-analysis`) with the idea – the Skill tool call, never a sub-agent – and let it run to the end of its hand-off: it writes the skeleton and `refine-competitor-analysis` researches and fills it in the same session. Its report is its own.
4. **Page.** When `docs/landing-page/index.html` is missing, invoke the `add-landing-page` skill from this plugin (`jodysalt:playbook add-landing-page`) with the same idea, the same way, and let it run to the end of its hand-off: it scaffolds the page and `refine-landing-page` interviews and fills it, reading the analysis step 3 left. Its report is its own.
5. **Report.** Which halves ran and which were skipped as already present, in one line each, after the inner reports; that everything is uncommitted; and the next steps in order: `jodysalt:playbook commit`, then `jodysalt:playbook wrap-up-worktree` to land the planning branch, and `jodysalt:playbook refine-market-test result` when the window ends.

## Rules

- Pure orchestrator: writes no file itself, asks no question the two skills do not ask, and never overwrites either half; an existing file is skipped, never replaced.
- Never pushes, never commits, never publishes the page.
- The two skills are invoked in that order and never in parallel, since the page's interview reads the analysis.
