---
title: Steering
type: feat
priority: high
---

# Goal
The landing page's steering and release, end to end. An adopter reading the workflow paragraph, in `CLAUDE.md` after `setup-skills` scaffolds it, in this plugin's `README.md`, or in `setup-skills` itself, learns that an idea can enter the method through a market test before the vision is written: `add-landing-page` writes the landing page with its hypothesis beside it, and `refine-landing-page` improves the page and records the result the vision then cites. And the plugin releases the whole `landing-page` change at `0.22.0`, so the first merge to `main` after this slice ships the two skills and the steering together.

# Context
- Parent: `docs/tickets/closed/landing-page/index.md`. This slice moves its last unmet criterion, criterion 7, bar the parts the siblings already met: `CLAUDE.md`, `README.md` and `setup-skills` carry the clause, and `plugin.json` is `0.22.0`. The two README rows already match the descriptions and `claude plugin validate skills --strict` already passes.
- Already landed by `docs/tickets/closed/landing-page--page-skill/index.md` and `docs/tickets/closed/landing-page--mocks/index.md`: `skills/add-landing-page/SKILL.md` with its README row at `README.md` line 22. Already landed by `docs/tickets/closed/landing-page--refine-skill/index.md`: `skills/refine-landing-page/SKILL.md` with its README row at line 42. Neither skill changes here.
- `docs/vision.md`'s *Market test before building* goal: "The test is optional; a repo that already knows what it is building starts at `docs/vision.md` as before." *landing page*, *market test* and *mock* are the glossary's senses (`docs/glossary.md`): the landing page is the single static page a market test publishes, and the market test is that page published to measure interest against a threshold set in advance, the vision written from its result. The clause uses them so and defines nothing; the glossary is read, never written.
- The workflow paragraph lives in three places. `CLAUDE.md` line 3 reads exactly:

  > This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, `docs/glossary.md` holds the terms every skill reads before writing, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which works through it one thin slice at a time, each slice a sub-ticket with its own backlog.

  `skills/setup-skills/SKILL.md` step 5's `## Workflow` block (line 66) holds the same paragraph byte for byte under a three-space indent; `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` is empty today. `README.md` line 7 opens "The skills run one spec-driven workflow:", carries the same five clauses, then a second sentence that names the skills bare – "`setup-skills` creates that layout in a fresh repo and `refine-vision` fills `docs/vision.md` in; draft with `add-ticket`, then implement it with `complete-ticket`, …" – where `CLAUDE.md` writes `/jodysalt:add-ticket`. That is the one way the three differ today, and the precedent this slice follows: `README.md` names skills bare, the other two as slash commands.
- `setup-skills` step 5 skips the `CLAUDE.md` step when the file already holds a line equal to `## Workflow`, and its Rules say an existing `CLAUDE.md` gains its one addition at the end or nothing at all. So an existing repo, this one included, never gets the clause by rerunning `setup-skills`; this repo gets it by the edit here and an adopter's repo by hand after the release. `setup-skills`' description and README row (`README.md` line 49) say "a `## Workflow` section in `CLAUDE.md`" and quote none of the block's words, so neither changes. `grep -rl 'backlog an unattended loop implements' . --exclude-dir=.git --exclude-dir=docs` lists exactly the three files; nothing else quotes the paragraph.
- `.claude-plugin/plugin.json` reads `"version": "0.21.0"`; `.claude-plugin/marketplace.json` carries no version. The vision's *`main` is always installable* principle bumps the version on any change to a skill's behaviour; two skills were added and `setup-skills` changes in this slice, so the parent fixed `0.22.0`, a minor bump. `claude plugin validate .` passes today with two pre-existing warnings (the root `CLAUDE.md` is not plugin context; no plugin icon) and `claude plugin validate skills --strict` passes clean.
- **Why `feat`.** `setup-skills` writing a new clause into a fresh repo's `CLAUDE.md` is user-visible behaviour, and the version bump is the release of a feature; `docs/tickets/closed/glossary--steering/index.md`, the same clause-plus-bump slice for the glossary, was a `feat` too. A `chore` would fit the bump alone; it does not fit a skill's output changing.

# Scope

In:
- **The clause, in three places.** One sentence inserted between the paragraph's first sentence (ending "the backlog an unattended loop implements.") and its second, so the paragraph reads layout, then the optional first move, then draft and implement. In `CLAUDE.md` line 3 and `setup-skills` step 5's block (line 66), the sentence is exactly:

  > An idea can first be market-tested, before the vision is written: `/jodysalt:add-landing-page` writes the landing page with its hypothesis beside it, and `/jodysalt:refine-landing-page` improves the page and records the result for the vision to cite.

  So the new `CLAUDE.md` line 3, and the block line under its indent, reads:

  > This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, `docs/glossary.md` holds the terms every skill reads before writing, and each ticket's `tasks.md` is the backlog an unattended loop implements. An idea can first be market-tested, before the vision is written: `/jodysalt:add-landing-page` writes the landing page with its hypothesis beside it, and `/jodysalt:refine-landing-page` improves the page and records the result for the vision to cite. Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which works through it one thin slice at a time, each slice a sub-ticket with its own backlog.

  `README.md` line 7 takes the same sentence at the same position – after its first sentence, before "`setup-skills` creates that layout" – with the two skills named bare, as that paragraph names every skill: "An idea can first be market-tested, before the vision is written: `add-landing-page` writes the landing page with its hypothesis beside it, and `refine-landing-page` improves the page and records the result for the vision to cite." Its prefix and its second sentence stay as they are. The three stay in step: `CLAUDE.md` line 3 and the block line remain byte-identical under the indent, and `README.md`'s sentence is byte-identical to theirs once `/jodysalt:` is stripped.
- **Release.** `.claude-plugin/plugin.json` version from `0.21.0` to `0.22.0`, nothing else in the file changed; `claude plugin validate .` and `claude plugin validate skills --strict` passing.

Out:
- Any change to `skills/add-landing-page/SKILL.md`, `skills/refine-landing-page/SKILL.md`, their README rows, `setup-skills`' description or README row, or any skill's step bodies beyond the one paragraph line inside `setup-skills` step 5's fenced block.
- `docs/vision.md` and `docs/glossary.md`.
- Making `setup-skills` add the clause to an existing `CLAUDE.md`; its never-overwrite rule stands, and an adopter takes the clause by hand after the release.
- A second clause, a mention of the mocks, the workflow file or GitHub Pages in the paragraph; the skills' descriptions carry those.
- Pushing, merging, tagging; `marketplace.json`.

# Acceptance criteria
- `grep -n add-landing-page CLAUDE.md README.md skills/setup-skills/SKILL.md` shows the clause on `CLAUDE.md:3`, `README.md:7` and `skills/setup-skills/SKILL.md:66`, `README.md` also matching its `add-landing-page` row (line 22; the `refine-landing-page` row on line 42 does not contain that string) and nothing else; `grep -c 'An idea can first be market-tested' CLAUDE.md README.md skills/setup-skills/SKILL.md` prints `1` for each.
- In each of the three the sentence sits between "the backlog an unattended loop implements. " and the paragraph's second sentence ("Draft with" in `CLAUDE.md` and the block; "`setup-skills` creates that layout" in `README.md`), and nothing else in the paragraph changed: `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` is empty, and `diff <(grep -o 'An idea can first be market-tested[^.]*\.' CLAUDE.md | sed 's#/jodysalt:##g') <(grep -o 'An idea can first be market-tested[^.]*\.' README.md)` is empty.
- `README.md` line 7 still opens "The skills run one spec-driven workflow:" and still ends with "each slice a sub-ticket with its own backlog."; `README.md`'s diff against the parent branch touches line 7 only.
- `grep -n '"version"' .claude-plugin/plugin.json` prints `0.22.0` and nothing else in the file changed.
- `claude plugin validate .` and `claude plugin validate skills --strict` pass; `git diff -U0 landing-page -- skills/ | grep '^[-+]description:'` prints nothing.
- `git diff --stat landing-page` lists exactly `CLAUDE.md`, `README.md`, `skills/setup-skills/SKILL.md` and `.claude-plugin/plugin.json`, this ticket's own files aside.
- In a throwaway repo with `claude --plugin-dir` pointed at this slice's worktree, `/jodysalt:setup-skills` writes a `CLAUDE.md` whose `## Workflow` paragraph carries the sentence with `/jodysalt:add-landing-page` and `/jodysalt:refine-landing-page`.
- Nothing is pushed.

# Implementation notes
- **The sentence.** Insert "An idea can first be market-tested, before the vision is written: `/jodysalt:add-landing-page` writes the landing page with its hypothesis beside it, and `/jodysalt:refine-landing-page` improves the page and records the result for the vision to cite. " after "the backlog an unattended loop implements. " in `CLAUDE.md` line 3 and `skills/setup-skills/SKILL.md` line 66, and the same text with `/jodysalt:` stripped at the same anchor in `README.md` line 7; one `sed` pattern on the anchor keeps them in step, then run the two `diff`s above. Touch nothing else in `setup-skills`.
- The sentence names the two skills in the order they run and says what each leaves – the landing page with its hypothesis beside it, the result for the vision to cite – because that is what the vision's goal says the test is for; it names no path, as the vision names none, and no mock, since the mocks are the page's means, not the method's step.
- **Version.** Edit the one `"version"` line in `.claude-plugin/plugin.json`; keep the rest of the file as it is. Then both validators.
- **Commit.** One `feat:` commit on the `landing-page` branch via `jodysalt:commit`.

# Test plan
- `claude plugin validate .` (passes with its two pre-existing warnings) and `claude plugin validate skills --strict`.
- `grep -n add-landing-page CLAUDE.md README.md skills/setup-skills/SKILL.md`; `grep -c 'An idea can first be market-tested' CLAUDE.md README.md skills/setup-skills/SKILL.md`.
- `diff <(sed -n 3p CLAUDE.md) <(sed -n 66p skills/setup-skills/SKILL.md | sed 's/^   //')` and `diff <(grep -o 'An idea can first be market-tested[^.]*\.' CLAUDE.md | sed 's#/jodysalt:##g') <(grep -o 'An idea can first be market-tested[^.]*\.' README.md)`, both empty.
- `grep -n '"version"' .claude-plugin/plugin.json` prints `0.22.0`.
- `git diff --stat landing-page` and `git diff -U0 landing-page -- skills/ | grep '^[-+]description:'`.
- Left for a person: a throwaway repo with `claude --plugin-dir` pointed at this worktree, `git init`, `/jodysalt:setup-skills`, then `grep add-landing-page CLAUDE.md`.

# Rollout
- Lands on the `landing-page` branch as one commit. The parent then has every criterion met, so `complete-ticket` reports `done` and `wrap-up-worktree` landing `landing-page` on `main` is the `0.22.0` release, since users auto-update from `main`. Nothing breaking: a fresh repo's `CLAUDE.md` gains one sentence of prose from `setup-skills`, and a repo that never runs `add-landing-page` is otherwise untouched. Fallback is reverting the commit.
- Because `setup-skills` skips the `CLAUDE.md` step when `## Workflow` exists, no existing repo gets the sentence by rerunning it: this repo gets it by this slice's edit, and the first user's repo takes it by hand after the release; neither rerun is this slice's work.

## Strategic fit
Advances `landing-page` by meeting its last unmet criterion: adopters are steered to the market test from every place the workflow paragraph lives, as the optional first move the vision's goal describes, and the `0.22.0` bump releases the two skill slices with it.
