---
name: add-landing-page
description: Interviews for the offer, the screens and the market test through `grill-me`, then writes the landing page at `docs/landing-page/index.html` with its hypothesis beside it in `docs/landing-page/README.md`, the mocks of the screens its copy shows under `docs/landing-page/mocks/` with their screenshots, and the GitHub Pages workflow at `.github/workflows/landing-page.yml` when missing. Use when the user says "add a landing page", "market-test this idea", "make a landing page for X", or runs `/add-landing-page`. Never overwrites an existing page, never pushes, never commits.
argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"
---

# Add landing page

Create one market test from an idea: interview for the offer, the screens and the test, then leave the landing page, the notes that hold its hypothesis, the mocks of the screens its copy shows with their screenshots, and the workflow that publishes the page uncommitted. It stops there; publishing is the user's, and improving a page that exists is `jodysalt:refine-landing-page`'s. No branch gate: the page is a product artefact, not a planning doc.

## Idea

$ARGUMENTS

The product idea in one line. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/landing-page/index.html` exists under it, stop and say so, naming `jodysalt:refine-landing-page` as the skill that improves an existing page; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the page, the notes and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Interview.** Invoke the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the landing page being drafted at `docs/landing-page/index.html` and its market test at `docs/landing-page/README.md`". Give it this framing:
   - The idea is settled. The repo and `docs/glossary.md` count as explorable; a question they answer is never asked.
   - Nothing is written until the interview closes, since the page is one file written from every answer; steps 3–6 write from the answers. A deferred answer becomes a `TODO:` marker in the written file, never a question later.
   - Four branches in this order, each question with a recommended answer:
     - **Offer:** who it is for; the headline; the one benefit, then up to two more (three recommended); the subhead beneath the headline (recommended: the one benefit as a sentence); the price (a figure recommended; "none yet" is allowed, and the price section then says so plainly); the call to action – its kind, its link and its terms; the objections the FAQ must answer (recommended: the ones the terms imply – when it ships, what happens to the money, how to cancel).
     - **Screens:** how many screens the copy shows (recommended: one per benefit the Offer branch settled; at least one); then one question per screen covering its short name, whose kebab-case form is its `{slug}`; what the screen shows and in what state (a filled dashboard, an empty first run, a confirmation after the action); which benefit it illustrates, when it does; and whether it is a desktop or a phone screen (desktop recommended, screenshot `1280,800`; phone `390,844`). The first screen's question says that screen is the hero, the picture under the headline, and its slug is the `{hero-slug}` the page uses. A deferred answer leaves the screen a `TODO:` sentence in its mock, and the mock is still written.
     - **Test:** the hypothesis (one sentence a result can falsify); the metric (what the user will measure at the link they gave – sign-ups, pre-orders, clicks – recommended: the conversion of visits to that action); the threshold (a number the hypothesis passes at); the window (start and end dates; recommended: from the day the page goes live, fourteen days).
     - **Analytics:** an optional snippet, recommended none; when supplied it is pasted verbatim and never edited.
   - The call-to-action question's recommended answer is an honest waitlist or a real pre-order with its terms on the page. The question warns off the fake "out of stock" after a buy click: ad platforms treat a misleading destination as misrepresentation, and this skill cannot certify a page against any advertiser's policy. Where the user gives no link, the button's `href` is left empty for `jodysalt:refine-landing-page` to report.
3. **Write the page.** Write `docs/landing-page/index.html` from the answers, creating the folder, as one self-contained file. The markup is written from the answers; what follows fixes its shape, not its words.
   - Head: `<!doctype html>`, `<html lang="…">` in the page's language, `<meta charset="utf-8">`, the viewport meta `width=device-width, initial-scale=1`, a `<title>` holding the headline, then `<meta property="og:title">` (the headline), `<meta property="og:description">` (the subhead), `<meta property="og:type" content="website">`, and, only when `git remote get-url origin` matches `github.com[:/]{user}/{repo}(.git)?`, `<meta property="og:url">` as `https://{user}.github.io/{repo}/` and `<meta property="og:image">` as `https://{user}.github.io/{repo}/mock-{hero-slug}.png`; no match, no `og:url` and no `og:image` tag. When the interview supplied an analytics snippet it is pasted byte for byte as the last thing before `</head>`; when none was, nothing goes there.
   - One inline `<style>`: the font stack `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` on `body`, mobile-first rules – one column, `body` or `main` given a `max-width` (around `40rem`) and `margin: 0 auto` with side padding so wide screens centre it, no media query below that width – the button styled as a block the thumb can hit, and nothing else beyond readable spacing and type sizes.
   - No `<link>` and no `<script>` anywhere on the page, the analytics snippet, when supplied, the only exception; no `<img>` but the screenshots, whose `src` is a bare `mock-{slug}.png` beside the page. The page references each screenshot whether or not Chrome took it; a missing file is `jodysalt:refine-landing-page`'s finding.
   - Body, in this order with these ids, so a later skill can match each section to `README.md`:
     - `<header id="headline">` with an `<h1>` holding the headline and a `<p>` holding the subhead.
     - `<figure id="hero">` holding `<img src="mock-{hero-slug}.png" alt="…">`, the `alt` the hero screen's one-line description, and nothing else.
     - `<section id="benefits">` with an `<h2>` and one `<h3>` plus a `<p>` per benefit, the one benefit first; a benefit a screen illustrates gets `<img src="mock-{slug}.png" alt="…">` after its `<p>`, the `alt` that screen's one-line description, and a benefit with no screen gets no `<img>`.
     - `<section id="price">` with the figure and what it buys; when the price is "none yet", a plain sentence saying the price is not set.
     - `<section id="cta">` with one `<a>` styled as the button, its text the call to action's kind (join the waitlist, pre-order) and its `href` the link the user gave – empty (`href=""`) when they gave none – and a sentence of the terms beneath it.
     - `<section id="faq">` with an `<h2>` and one `<h3>` question plus a `<p>` answer per objection from the interview.
     - `<footer id="terms">` stating the pre-order or waitlist terms plainly: when it ships, what happens to the money, how to cancel, each in a sentence; a deferred answer is a `TODO:` sentence in its place.
4. **Write the notes.** Write `docs/landing-page/README.md` beside the page: `# Market test`, then `## Hypothesis` (the one falsifiable sentence), `## Metric` (what is measured at the link), `## Threshold` (the number the hypothesis passes at), `## Window` (start and end dates), `## Call to action` (what the button does and where it leads – the link), each filled from the interview, a deferred answer as a `TODO:` line; then `## Result` holding the one line `TODO: the metric's value at the window's end, filled by refine-landing-page.` and `## Decision` holding the one line `TODO: build, change the offer, or stop – filled by refine-landing-page from the result against the threshold.` These two stay prompts until the test is over.
5. **Write the mocks.** For each screen, in order, with its slug, name, description, state and size (`{w},{h}`), write the mock that fakes it and take its screenshot, one screen finished before the next:
   - Write `docs/landing-page/mocks/mock-{slug}.html`, creating the folder: one self-contained page faking that screen in that state – `<!doctype html>`, `<html lang="…">` in the page's language, `<meta charset="utf-8">`, the viewport meta `width=device-width, initial-scale=1`, a `<title>` holding the screen's name, `<link rel="stylesheet" href="mock.css">`, no `<script>`, realistic placeholder content in the product's own words, and the whole screen inside the window at the chosen size so the screenshot is the screen and nothing else. A screen whose description is a `TODO:` holds that sentence in place of the content, and the mock is still written. When `mock-{slug}.html` already exists it is left untouched, byte for byte, and the run says so; the row and the screenshot still happen.
   - With the first mock, when they are missing: `docs/landing-page/mocks/mock.css` – `body` at `margin: 0`, the font stack `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, a `min-height: 100vh` frame, a neutral palette and a handful of classes every mock shares (a top bar, a card, a button, a table), a short file the mocks lean on rather than restyle; and `docs/landing-page/mocks/index.html` – `<!doctype html>`, `<html lang="…">` in the page's language, `<meta charset="utf-8">`, `<title>Mocks</title>`, the same `<link rel="stylesheet" href="mock.css">`, an `<h1>`, and one `<ul>`. Both are left untouched when present.
   - Append `<li><a href="mock-{slug}.html">{screen name}</a> <img src="../mock-{slug}.png" alt="{screen description}"></li>` to that `<ul>` unless the index already holds a row for `mock-{slug}.html`.
   - Find a browser: `command -v google-chrome chrome chromium`, taking the first hit; none, and on macOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` exists, take that. With a browser, run from the root `"{chrome}" --headless --screenshot=docs/landing-page/mock-{slug}.png --window-size={w},{h} docs/landing-page/mocks/mock-{slug}.html`, `{w},{h}` the screen's size. Without one, or when the command exits non-zero or leaves no file, print that one command with `google-chrome` as the binary for the user to run and carry on; the mock, its row and the page that points at `mock-{slug}.png` are written either way, and nothing is installed.
6. **Write the workflow.** Write `.github/workflows/landing-page.yml` only when it is missing, creating the folders. When the file exists, say so and leave it untouched, byte for byte; it is not read or compared. The file is this skill's one literal, so every run writes the same thing: the YAML below, with its one placeholder `{default-branch}` replaced by the default branch – `git symbolic-ref --short refs/remotes/origin/HEAD` with its `origin/` prefix removed, else `git branch --show-current`, else `main`. `${{ secrets.GITHUB_TOKEN }}` is written as it stands; it is GitHub's expression, not a placeholder.

   ```yaml
   name: Landing page

   on:
     push:
       branches: [{default-branch}]
       paths: ['docs/landing-page/**']

   permissions:
     contents: write

   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./docs/landing-page
             exclude_assets: README.md,mocks
             publish_branch: gh-pages
   ```

   On a push to that branch that touches `docs/landing-page/`, the action copies the folder minus `README.md` and `mocks` to the root of the `gh-pages` branch, so the site is served at `https://{user}.github.io/{repo}/` and the notes never ship.
7. **Report.** The paths – `docs/landing-page/index.html`, `docs/landing-page/README.md`, each mock written as `mocks/mock-{slug}.html` (saying which already existed and were left alone), `mocks/mock.css` and `mocks/index.html` when this run created them, each screenshot taken at `docs/landing-page/mock-{slug}.png`, and `.github/workflows/landing-page.yml` – saying which were written and, for the workflow, whether it already existed and was left alone. For each screenshot not taken, the one command to run – `google-chrome --headless --screenshot=docs/landing-page/mock-{slug}.png --window-size={w},{h} docs/landing-page/mocks/mock-{slug}.html` – saying the page already points at `mock-{slug}.png` and, once, that a macOS user substitutes `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` for `google-chrome`. Say that everything is uncommitted, and that publishing is the user's: enable GitHub Pages on the `gh-pages` branch once in the repo's settings, then push the default branch, and the workflow publishes the page. Suggest `jodysalt:commit` (a `feat:` commit) and name `jodysalt:refine-landing-page` for later changes to the page and for recording the result when the test is over.

## Rules

- Never overwrites `docs/landing-page/index.html` or an existing `.github/workflows/landing-page.yml`; a page that exists stops the run before anything is written. The mocks follow the same rule without the stop: it never overwrites an existing mock, `mock.css` or `mocks/index.html`, each left untouched byte for byte while the run carries on and says so.
- Writes nothing outside `docs/landing-page/` and `.github/workflows/landing-page.yml`.
- The screenshot command is the only program run beyond `git`, and nothing is installed.
- Never pushes, never commits, never enables GitHub Pages, never picks a payment, form or analytics provider.
- The analytics snippet appears only when the user supplied one, pasted verbatim and never edited.
- No framework, build step or external asset on the page.
- Reads `docs/glossary.md` and never writes it.
