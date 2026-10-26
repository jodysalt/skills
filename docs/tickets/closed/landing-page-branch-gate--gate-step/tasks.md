# Tasks

## Add a "Branch gate" step 2 to skills/add-landing-page/SKILL.md, renumber steps 2–5 to 3–6, fix "The `cp` of step 2" to step 3, and replace the lead's "No branch gate" sentence
- **category:** functional
- **status:** done
- **steps:**
  - Insert after step 1 (*Root and guard*) a new step `2. **Branch gate.**` worded from `skills/add-ticket/SKILL.md` step 1: if the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session landing-page`; on yes pass it and ask nothing else; continue on the current branch if the user declines; skip if the gate already ran this conversation. Add: when `git status --porcelain docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are. End the step with "the root is `git rev-parse --show-toplevel` from here on", since step 1's root may be another checkout. The guard in step 1 stays first, so a stop creates nothing and offers nothing.
  - Renumber the old steps 2–5 to 3–6 and change the rule "The `cp` of step 2…" to "step 3"; `grep -n 'step [0-9]' skills/add-landing-page/SKILL.md` shows each reference pointing at the renumbered step. The hand-off step to `refine-landing-page` keeps its wording.
  - Replace the lead's last sentence "No branch gate: the page is a product artefact, not a planning doc." with "Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`."
  - `grep -c 'No branch gate' skills/add-landing-page/SKILL.md` prints 0; `grep -n 'Branch gate\|start-planning-session landing-page\|porcelain docs/landing-page\|show-toplevel' skills/add-landing-page/SKILL.md` hits the step, the lead and the root sentence.

## Add a "Branch gate" step 2 to skills/refine-landing-page/SKILL.md before "Serve the page", renumber steps 2–8 to 3–9 with every cross-reference raised by one, and replace the lead's "No branch gate" sentence
- **category:** functional
- **status:** done
- **steps:**
  - Insert after step 1 (*Root and guard*) and before *Serve the page* a new step `2. **Branch gate.**` with the same wording as `skills/add-landing-page/SKILL.md`'s step 2 (copy it from there if that task is done, else from `skills/add-ticket/SKILL.md` step 1): planning-branch match, offer `jodysalt:start-planning-session landing-page` and pass it on yes with nothing else asked, continue on decline, skip when already run this conversation; the uncommitted-edits sentence conditioned on `git status --porcelain docs/landing-page`; ending "the root is `git rev-parse --show-toplevel` from here on", so *Serve the page* serves the worktree's page.
  - Renumber the old steps 2–8 to 3–9 and raise each `step N` cross-reference by one: before the edit they are at `## Scope` (`step 7`, `step 5`), the findings (`step 3`, `step 7`), the interview (`step 4`, `step 6`, `step 3`, `step 6` twice, `step 7`) and the report (`step 2`) – eleven in all. Afterwards `grep -n 'step [0-9]' skills/refine-landing-page/SKILL.md` shows serve = 3, explore/date = 4, findings = 5, interview/Look branch = 6, mocks = 7, result = 8, report = 9.
  - Replace the lead's last sentence "No branch gate: the page is a product artefact, not a spec." with "Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`." Leave `skills/refine-sandbox/SKILL.md` untouched.
  - `grep -c 'No branch gate' skills/refine-landing-page/SKILL.md` prints 0; `grep -n 'Branch gate\|start-planning-session landing-page\|porcelain docs/landing-page\|show-toplevel' skills/refine-landing-page/SKILL.md` hits the step and the lead.
- **notes:**
  - The finished gate is line 20 of `skills/add-landing-page/SKILL.md`, one paragraph: it keeps `add-ticket`'s "(a pre-upgrade `planning-2026-10-21` counts)" aside and ends "Either way, the root is `git rev-parse --show-toplevel` from here on."
  - The session's worktree guard refuses a Bash `python3` heredoc whose text names `git`; make the edits with the Edit tool.

## Name add-landing-page and refine-landing-page as escalators in skills/start-planning-session/SKILL.md, say "on a planning branch" in both landing-page descriptions, update the three README.md rows, and bump .claude-plugin/plugin.json to 0.25.0
- **category:** chore
- **status:** done
- **steps:**
  - In `skills/start-planning-session/SKILL.md`'s frontmatter `description`, make the escalator list read "…or when `add-ticket`, `refine-ticket`, `refine-coding-standards`, `refine-vision`, `add-landing-page` or `refine-landing-page` escalates here…"; in its `## Description` section add `landing-page` to the parenthesised list of recommended subjects. Change no step.
  - Add "on a planning branch" to the frontmatter `description` of `skills/add-landing-page/SKILL.md` and `skills/refine-landing-page/SKILL.md` where each says what it writes.
  - Update the `README.md` rows for `add-landing-page`, `refine-landing-page` and `start-planning-session` to follow their descriptions.
  - Set `"version"` in `.claude-plugin/plugin.json` to `0.25.0`; `grep -n '"version"' .claude-plugin/plugin.json` prints `0.25.0`.
  - `grep -n 'add-landing-page\|`landing-page`' skills/start-planning-session/SKILL.md` hits the description and `## Description`; `grep -n 'on a planning branch' README.md skills/add-landing-page/SKILL.md skills/refine-landing-page/SKILL.md` hits both descriptions and both rows; `git diff main -- docs/glossary.md` is empty.

## Run full test suite for landing-page-branch-gate--gate-step
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, this repo having no `package.json`) and confirm it passes.
