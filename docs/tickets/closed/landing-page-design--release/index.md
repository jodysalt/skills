---
title: Release
type: chore
priority: high
---

# Goal
The `landing-page-design` change is released as `0.23.0`: `refine-landing-page`'s description says it reports every placeholder, its argument hint offers `look`, its README row matches, and `.claude-plugin/plugin.json` carries the bump, so the first merge of `landing-page-design` to `main` ships the scaffold, the Look branch and the metadata that describes them together. A reader of the README or of the skill's frontmatter learns that a fresh boilerplate's `TODO:`s are findings the skill reports and that `look` is a scope word, without reading the steps.

# Context
- Parent: `docs/tickets/closed/landing-page-design/index.md`. This is its third and last slice, the one its Implementation notes name last: descriptions, rows and the bump. It moves the parent's one remaining unmet criterion – "`.claude-plugin/plugin.json` reads `0.23.0`; … both descriptions and README rows say what the Scope says" – every other criterion having landed with the two closed siblings.
- Shipped by `docs/tickets/closed/landing-page-design--scaffold/index.md`: the three templates, `add-landing-page` as a scaffold, the four branches in `refine-landing-page`, and `add-landing-page`'s new first sentence in its description and `README.md` line 22; `diff` of that row against the description's first sentence prints nothing today. Shipped by `docs/tickets/closed/landing-page-design--look/index.md`: the Look branch, the three mood sets, the accent derivation and `look` in `## Scope` (line 15 of `skills/refine-landing-page/SKILL.md`). Both siblings left `refine-landing-page`'s description, its row and the version for this slice.
- `skills/refine-landing-page/SKILL.md` line 3 today reads, in part, "reads the page, the notes and the mocks under `docs/landing-page/mocks/`, reports what the notes imply and the page lacks, interviews the user one question at a time, …"; line 4 is `argument-hint: "[section names, a mock slug, or 'result' – defaults to the whole page]"`. Step 3 (lines 27–29) already reports every `TODO:` – the look marker, `README.md`'s prompts and any other `TODO:` in the page, `mock.css` or a mock – so the description is behind the steps, and `## Scope` already takes `look`, so the hint is behind the scope. `grep -c 'reports every placeholder' skills/refine-landing-page/SKILL.md` prints 0 today.
- `README.md` line 42 is `refine-landing-page`'s row and equals today's first sentence; line 22 is `add-landing-page`'s row and equals its first sentence. A row is the description's first sentence, cut at the first ". Use when".
- `.claude-plugin/plugin.json` reads `"version": "0.22.0"`; `.claude-plugin/marketplace.json` carries no version. The vision's *`main` is always installable* principle bumps the version on any change to a skill's behaviour; `add-landing-page` and `refine-landing-page` both changed on this branch, so the parent fixed `0.23.0`, a minor bump, as `docs/tickets/closed/landing-page--steering/index.md` fixed `0.22.0` for the last release. `claude plugin validate .` passes today with its two pre-existing warnings (the root `CLAUDE.md` is not plugin context; no plugin icon); `claude plugin validate skills --strict` passes clean with `templates/` present.
- **Why `chore`.** No skill's steps change: two frontmatter fields catch up with steps the siblings already shipped, one README row follows, and the version moves. The steering slice was a `feat` because `setup-skills` wrote a new clause into a fresh repo; nothing a skill writes changes here.
- `docs/glossary.md` defines *boilerplate*, *design language*, *landing page*, *market test* and *mock*; this ticket uses them in those senses and the implementation reads the file and never writes it. A *placeholder* is a `TODO:` in the boilerplate, as the glossary's *boilerplate* entry uses the word.
- The run that drafts this slice is on the `landing-page-design` ticket branch; the planning-session offer was declined.

# Scope
In:
- **`skills/refine-landing-page/SKILL.md`, frontmatter only.** The `description` gains "reports every placeholder and" before "what the notes imply and the page lacks", so the clause reads "reports every placeholder and what the notes imply and the page lacks"; nothing else in the sentence, the trigger phrases or the "never" sentence changes. The whole first sentence becomes:

  > Revisits the landing page at `docs/landing-page/index.html` and improves it in place against the market test's notes in `docs/landing-page/README.md` – reads the page, the notes and the mocks under `docs/landing-page/mocks/`, reports every placeholder and what the notes imply and the page lacks, interviews the user one question at a time, edits the page as answers land, writes or rewrites a mock with its screenshot when an answer needs a screen, and records the result and the decision in `README.md` when the test is over.

  The `argument-hint` becomes exactly `"[section names, a mock slug, 'look', or 'result' – defaults to the whole page]"`.
- **`README.md` line 42**: the row's text becomes that first sentence verbatim; the link cell stays. Line 22 is checked, not edited: it already equals `add-landing-page`'s first sentence.
- **`.claude-plugin/plugin.json`**: `"version": "0.22.0"` to `"version": "0.23.0"`, nothing else in the file.
- **Validation**: `claude plugin validate .` and `claude plugin validate skills --strict` pass after the edits.

Out:
- Any change to either skill's title paragraph, steps or rules, to the three templates, to `add-landing-page`'s frontmatter or row, to `CLAUDE.md`, `docs/vision.md` or `docs/glossary.md`.
- A new trigger phrase (such as "this is a fresh boilerplate"); the hint's wording beyond adding `look`.
- `marketplace.json`; pushing, merging, tagging.

# Acceptance criteria
- `grep -c 'reports every placeholder' skills/refine-landing-page/SKILL.md` prints 1, the match on line 3 inside the frontmatter; `grep -n "'look'" skills/refine-landing-page/SKILL.md` matches line 4, the `argument-hint` line, which reads `argument-hint: "[section names, a mock slug, 'look', or 'result' – defaults to the whole page]"`.
- `git diff -U0 landing-page-design -- skills/refine-landing-page/SKILL.md` touches lines 3 and 4 only.
- `diff <(sed -n '42p' README.md | sed 's/^| \[`refine-landing-page`\](\.\/skills\/refine-landing-page\/SKILL\.md) | //; s/ |$//') <(sed -n '3p' skills/refine-landing-page/SKILL.md | sed 's/^description: //; s/\. Use when.*$/./')` prints nothing, and the same with `add-landing-page` and line 22 prints nothing; `git diff -U0 landing-page-design -- README.md` touches line 42 only.
- `grep -n '"version"' .claude-plugin/plugin.json` prints `0.23.0`; `git diff landing-page-design -- .claude-plugin/plugin.json` shows only that line.
- `claude plugin validate .` and `claude plugin validate skills --strict` pass.
- `git diff --stat landing-page-design` lists exactly `skills/refine-landing-page/SKILL.md`, `README.md` and `.claude-plugin/plugin.json`, this ticket's own files aside. Nothing is pushed.

# Implementation notes
- **Description.** One `sed` on line 3 of `skills/refine-landing-page/SKILL.md`: `reports what the notes imply and the page lacks` → `reports every placeholder and what the notes imply and the page lacks`. Then the hint on line 4: `a mock slug, or 'result'` → `a mock slug, 'look', or 'result'`. Nothing below the frontmatter is touched; the phrase "reports every placeholder" must not be added anywhere else, or the `grep -c` prints 2.
- **Row.** Replace the text of `README.md` line 42 with the new first sentence, extracted from line 3 rather than retyped, so the `diff` is empty by construction; the row's link cell is as it is. Run the same `diff` for line 22 as a check and edit nothing there.
- **Version.** Edit the one `"version"` line in `.claude-plugin/plugin.json`; keep the rest byte for byte. Then both validators.
- **Commit.** One `chore:` commit on the slice's branch via `jodysalt:commit`; the slice lands on `landing-page-design` squashed.

# Test plan
- `claude plugin validate .` (passes with its two pre-existing warnings) and `claude plugin validate skills --strict`.
- The greps and diffs above: `grep -c 'reports every placeholder'` (1); `grep -n "'look'"` (line 4); the two row-vs-description `diff`s (empty); `grep -n '"version"' .claude-plugin/plugin.json` (`0.23.0`); `git diff landing-page-design -- .claude-plugin/plugin.json` (one line); `git diff --stat landing-page-design` (the three files).
- Left for a person: with `claude --plugin-dir` pointed at this worktree, `/jodysalt:refine-landing-page` shows the hint with `'look'` in it, and the skill picker's description for `refine-landing-page` names the placeholders.

# Rollout
Lands on the `landing-page-design` branch as one commit. The parent then has every criterion met, so `complete-ticket` reports `done`, and `wrap-up-worktree` landing `landing-page-design` on `main` is the `0.23.0` release, since users auto-update from `main`. Nothing breaking: a page written by `0.22.0` keeps its look – `refine-landing-page` edits what is there and never restyles unasked, its findings being the same ids and `TODO:`s – and still takes `refine-landing-page`; only a fresh `add-landing-page` run takes the templates. Fallback is reverting the commit.

## Strategic fit
Advances `landing-page-design` by meeting its last unmet criterion – the descriptions and rows saying what the Scope says and the version at `0.23.0` – so the branch becomes the release that ships the scaffold and the Look branch.
