# Tasks

## Update refine-landing-page's description and argument-hint in skills/refine-landing-page/SKILL.md and its row in README.md
- **category:** chore
- **status:** done
- **steps:**
  - Line 3 of `skills/refine-landing-page/SKILL.md`: in the description's first sentence, "reports what the notes imply and the page lacks" becomes "reports every placeholder and what the notes imply and the page lacks"; nothing else in the description changes. Line 4: `argument-hint: "[section names, a mock slug, 'look', or 'result' – defaults to the whole page]"`. `grep -c 'reports every placeholder' skills/refine-landing-page/SKILL.md` prints 1; `grep -n "'look'" skills/refine-landing-page/SKILL.md` matches line 4; `git diff -U0 landing-page-design -- skills/refine-landing-page/SKILL.md` touches lines 3–4 only.
  - `README.md` line 42's row text is the new description's first sentence verbatim (up to and including "when the test is over."): extracting the row text and the description's first sentence and running `diff` on the two prints nothing (from a scratchpad `.sh` if the shell tool refuses the pipeline); `git diff -U0 landing-page-design -- README.md` touches line 42 only; line 22's row still equals `add-landing-page`'s first sentence.
  - `claude plugin validate skills --strict` passes.

## Bump .claude-plugin/plugin.json from 0.22.0 to 0.23.0
- **category:** chore
- **status:** done
- **steps:**
  - `grep -n '"version"' .claude-plugin/plugin.json` prints `"version": "0.23.0"`, and `git diff landing-page-design -- .claude-plugin/plugin.json` shows only that line changed (run each `git diff` as its own plain command; the worktree hook refuses chained git).
  - `git diff --stat landing-page-design` lists exactly `skills/refine-landing-page/SKILL.md`, `README.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.

## Run full test suite for landing-page-design--release
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills --strict`) and confirm both pass.
- **notes:**
  - No `Dockerfile.sandbox` at the checkout root: both validate commands run on the host, and the commit and report carry the no-`Dockerfile.sandbox` host-run line.
