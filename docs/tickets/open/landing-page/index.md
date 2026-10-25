---
title: Landing Page
type: feat
delivers: Market test before building
---

# Goal
A product idea can be market-tested before a line of it is built. Two skills carry the test: `add-landing-page` interviews for the offer and writes the landing page with its hypothesis beside it and the mocks of the product screens its copy shows, and `refine-landing-page` improves the page and its mocks against the hypothesis and records the result when the test is over, so the vision that follows cites what the market said. The mocks are the starting point only: once the test is over the repo writes real code, not more mocks.

# Context
- `docs/vision.md`'s *Market test before building* goal: the test is an optional entry to the method, hypothesis, metric, threshold and result live beside the page, mocks outlive the test as design reference, and the vision names no path. `docs/glossary.md` defines *landing page*, *market test* and *mock*; this ticket uses them in those senses.
- Layout, fixed here: `docs/landing-page/index.html` (the landing page), `docs/landing-page/README.md` (hypothesis, metric, threshold, result), `docs/landing-page/mocks/index.html` (the mocks index) and `docs/landing-page/mocks/mock-{slug}.html` (one mock per product screen).
- Deployment is a copy into a publishing branch, per [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): only the page and its assets reach the branch root, so the site is served at `{user}.github.io/{repo}/` and `README.md` and the mocks never ship. The copy is a GitHub Actions workflow `add-landing-page` writes once, `.github/workflows/landing-page.yml`: on push to the default branch it copies `docs/landing-page/` minus `README.md` and `mocks/` to the `gh-pages` branch root; the user enables Pages on that branch once, and no skill pushes. `setup-skills` does not scaffold the folder, since the test is optional; `add-landing-page` creates it.
- `refine-vision` step 2 already reads everything under `docs/`, so it cites `docs/landing-page/README.md` with no change.

# Scope
In:
- `add-landing-page`: interviews through `grill-me` for the offer (headline, who it is for, the benefit, price, the call to action), the screens the copy shows (one mock per screen: what it shows and in what state) and the test (hypothesis, metric, threshold, how long it runs), then writes `docs/landing-page/index.html`, `docs/landing-page/README.md`, the mocks and the workflow. Stops if `index.html` exists and points at `refine-landing-page`.
- The call to action is a link the user supplies – a payment link, a waitlist form, a mailto – and the metric is what the user will measure there; the skill picks no provider and pastes an analytics snippet verbatim only when the user hands one over. The interview recommends an honest waitlist or a real pre-order with its terms on the page and warns off the fake "out of stock" after a buy click, because ad platforms treat a misleading destination as misrepresentation; it says it cannot certify a page against any advertiser's policy.
- Mocks, written by both skills the same way: each screen becomes `docs/landing-page/mocks/mock-{slug}.html` against a shared `docs/landing-page/mocks/mock.css`, with a row in `docs/landing-page/mocks/index.html` linking the mock and its screenshot; then a screenshot best effort, with headless Chrome when `google-chrome`, `chrome` or `chromium` is on the path (`--headless --screenshot=docs/landing-page/mock-{slug}.png --window-size={w},{h}`), else by printing that one command for the user to run. The screenshot sits beside `index.html`, so the workflow ships it and the mock itself stays unpublished.
- `refine-landing-page`: in the shape of the other `refine-*` skills – reads `index.html`, `README.md` and `mocks/`, reports findings (a section the hypothesis implies but the page lacks, a call to action with no destination, a benefit with no screenshot or a referenced screenshot missing, an empty result once the window has closed), interviews through `grill-me`, edits the page in place and adds or rewrites a mock when an answer needs one, re-taking its screenshot. When the user says the test is over it fills `## Result` and `## Decision` in `README.md`. Never creates the page; points at `add-landing-page` when it is missing.
- `README.md`: `# Market test`, then `## Hypothesis`, `## Metric`, `## Threshold`, `## Window` (start and end dates), `## Call to action` (what the button does and where it leads), `## Result`, `## Decision`; the last two start as one-line prompts.
- The page: one self-contained `index.html` – inline CSS, system font stack, mobile-first, `og:` meta tags for ad and social previews; headline, subhead, hero screenshot, benefits, price, call to action, FAQ, and a footer stating the pre-order or waitlist terms plainly. No external asset but the screenshots and a user-supplied analytics snippet.
- Arguments: `add-landing-page [the idea in one line]`, asking when empty; `refine-landing-page [section names, a mock slug, or 'result']`, covering the whole page when empty. No planning-branch gate: the page is a product artefact, not a planning doc.
- The workflow, written only when missing: `actions/checkout` then `peaceiris/actions-gh-pages@v4` with `publish_dir: ./docs/landing-page`, `exclude_assets: README.md,mocks`, `publish_branch: gh-pages`, `permissions: contents: write`, on push to the default branch when `docs/landing-page/**` changes.
- The Workflow paragraph in `CLAUDE.md`, `README.md` and `setup-skills`' CLAUDE.md block gains one clause: an idea can first be market-tested with `add-landing-page` before the vision is written. Two README rows; `plugin.json` to `0.22.0`.

Out:
- Pushing, enabling GitHub Pages, buying a domain, running ads, choosing or configuring an analytics or form provider.
- A framework, build step or CSS toolchain on the page; `setup-skills` scaffolding the folder.
- Judging the vision's success criterion (one real idea end to end); that is the maintainer's next idea, read at `refine-vision`.

# Acceptance criteria
- In a fresh `git init` repo with no `docs/vision.md`, `/jodysalt:add-landing-page` interviews for the offer, the screens and the test and leaves `docs/landing-page/index.html`, `docs/landing-page/README.md` with hypothesis, metric, threshold, window and call to action filled and result and decision as prompts, one `mocks/mock-{slug}.html` per screen with `mocks/mock.css` and `mocks/index.html`, and `.github/workflows/landing-page.yml`, all uncommitted; run again it stops and names `refine-landing-page`.
- With Chrome on the path each mock leaves `docs/landing-page/mock-{slug}.png` and the page references it; with Chrome hidden the skill prints the one screenshot command per mock and still writes the mock, its row and the page.
- The page's call to action is the link the user gave; an analytics snippet appears only when the user supplied one, verbatim; the interview's recommended answer for the call to action is a waitlist or a pre-order with terms, and the fake "out of stock" is warned against in the question.
- `/jodysalt:refine-landing-page` reports a benefit with no screenshot, a missing screenshot file and an empty result as findings, edits the page as answers land, writes a new mock with its row and screenshot when an answer calls for one, and with `result` fills `## Result` and `## Decision` in `README.md`; with no page it stops and names `add-landing-page`.
- The workflow publishes `index.html` and the screenshots to the `gh-pages` branch root and neither `README.md` nor `mocks/`.
- No skill pushes, commits, or writes outside `docs/landing-page/` and `.github/workflows/landing-page.yml`.
- `CLAUDE.md`, `README.md` and `setup-skills` carry the clause; the two README rows match the descriptions; `plugin.json` is `0.22.0`; `claude plugin validate skills --strict` passes.

# Implementation notes
- **Two skills via `add-skill`'s template**: `skills/add-landing-page/SKILL.md` and `skills/refine-landing-page/SKILL.md`. Each reads `docs/glossary.md` and uses *landing page*, *market test* and *mock* in its sense. `add-landing-page` creates and never overwrites; `refine-landing-page` follows `refine-ticket`'s explore, report, interview, edit steps.
- **`add-landing-page`** interview order: offer first (who, headline, benefit, price, call to action and its link), then the screens (one question per screen the copy shows: what it shows and in what state), then the test (hypothesis, metric, threshold, window), then the analytics snippet; writes the page from the sections in Scope, `README.md` from its template, the mocks, the workflow when missing. The call-to-action question carries the advertiser-policy warning in its recommendation.
- **Mock step**, the same words in both skills so a later refactor can lift it out: write `mocks/mock-{slug}.html` against `mock.css` (created with the first mock, as is `mocks/index.html`), append `<li><a href="mock-{slug}.html">…</a> <img src="../mock-{slug}.png"></li>` to the index, then `command -v google-chrome chrome chromium` and the screenshot or the printed command.
- **`refine-landing-page`** findings come from `README.md` against `index.html` and `mocks/`: each `##` the page has no section for, `href` of the call to action empty, a benefit section with no `<img>`, each `<img src>` with no file, `## Result` still a prompt after the window's end date.
- **Steering**: the clause in `CLAUDE.md` line 3, `README.md`'s Workflow paragraph and the CLAUDE.md block `setup-skills` writes, the same words in all three.

# Test plan
- `claude plugin validate skills --strict`.
- Manual, throwaway repo under `claude --plugin-dir` pointed at this ticket's worktree: `git init`, no vision; `add-landing-page` twice (second stops), once with Chrome hidden from the path; `refine-landing-page` adding one mock, then through to a recorded result.
- Workflow: read by eye, then one push to a scratch GitHub repo with Pages on `gh-pages`; the site shows the page and screenshots and 404s on `README.md` and `mocks/`.
- `grep -n add-landing-page CLAUDE.md README.md skills/setup-skills/SKILL.md`.

# Rollout
Bump `plugin.json` to `0.22.0`; merging to `main` is the release. No flag or migration: a repo that never runs `add-landing-page` is untouched. Fallback is reverting the commit. The first real test is the maintainer's next idea; its outcome is read at `refine-vision`, where the goal's success is judged.

## Strategic fit
Delivers *Market test before building*: the two skills are the entry the goal names, and `README.md` beside the page is where its hypothesis and result live, which is *Decisions evaporate* answered one stage earlier than the vision. It follows *One thing, then stop* by splitting creation from refinement, each leaving its files uncommitted, and *Trim with the 80/20 principle* by giving the mocks no skill of their own, since they are the test's starting point and nothing adds one once real code begins, *Explore before asking* by having `refine-landing-page` read the page against the hypothesis before a question, and *Driver-agnostic* by interviewing through `grill-me`. It respects *A website builder*: one static file, no framework, a copy workflow rather than a build, the call to action a link the user supplies and the analytics their own; and *A home for standalone skills*, since the method now names the test as its optional first move.
