# Tasks

## Fold the mocks into the description, title paragraph and README.md row of skills/add-landing-page/SKILL.md
- **category:** functional
- **status:** done
- **steps:**
  - The frontmatter `description`'s first sentence says the skill interviews for the offer, the screens and the market test through `grill-me`, then writes the landing page at `docs/landing-page/index.html` with its hypothesis beside it in `docs/landing-page/README.md`, the mocks of the screens its copy shows under `docs/landing-page/mocks/` with their screenshots, and the GitHub Pages workflow at `.github/workflows/landing-page.yml` when missing; the trigger phrases and the "never overwrites an existing page, never pushes, never commits" clause stay. `grep -c 'the screens' skills/add-landing-page/SKILL.md` prints at least 1 and `claude plugin validate skills --strict` passes.
  - The title paragraph under `# Add landing page` names the mocks and their screenshots among what is left uncommitted.
  - The `add-landing-page` row in `README.md` (line 22, directly above the `add-skill` row) is replaced so its text is the new description's first sentence verbatim: `grep -n 'add-landing-page/SKILL.md' README.md` prints one line holding "the screens" and "mocks".

## Add the Screens branch to step 2 of skills/add-landing-page/SKILL.md between Offer and Test
- **category:** functional
- **status:** done
- **steps:**
  - Step 2's branch list reads Offer, Screens, Test, Analytics in that order: `grep -n 'Offer\|Screens\|Test\|Analytics' skills/add-landing-page/SKILL.md` prints the four names on consecutive lines in that order inside step 2.
  - The **Screens** branch opens by asking how many screens the copy shows, recommended one per benefit the Offer branch settled, at least one; then one question per screen: a short name whose kebab-case form is the `{slug}`, what the screen shows and in what state (a filled dashboard, an empty first run, a confirmation after the action), which benefit it illustrates when it does, and whether it is a desktop or a phone screen (desktop recommended, screenshot `1280,800`; phone `390,844`). The first screen is the hero and the question says so; its slug is the `{hero-slug}` the page uses. A deferred answer leaves the screen a `TODO:` sentence in its mock and the mock is still written.
  - Step 2's clause that steps 3–5 write from the answers now reads steps 3–6, since the mocks step lands as step 5 in a later task: `grep -n '3–6\|3-6' skills/add-landing-page/SKILL.md` matches inside step 2.
  - `grep -n '1280,800\|390,844\|hero-slug' skills/add-landing-page/SKILL.md` matches all three inside step 2.

## Change step 3 of skills/add-landing-page/SKILL.md so the page carries the hero and benefit screenshots and og:image
- **category:** functional
- **status:** done
- **steps:**
  - `<figure id="hero">` holds `<img src="mock-{hero-slug}.png" alt="…">`, the `alt` the hero screen's one-line description, in place of the comment `<!-- hero screenshot: … -->`: `grep -c 'hero screenshot:' skills/add-landing-page/SKILL.md` prints 0 and `grep -n 'mock-{hero-slug}.png' skills/add-landing-page/SKILL.md` matches inside step 3.
  - Each benefit a screen illustrates gets `<img src="mock-{slug}.png" alt="…">` after its `<p>`; a benefit with no screen gets no `<img>`.
  - `<meta property="og:image">` is written as `https://{user}.github.io/{repo}/mock-{hero-slug}.png` under the same `git remote get-url origin` match as `og:url`, and is absent when `og:url` is: `grep -n 'og:image' skills/add-landing-page/SKILL.md` matches inside step 3 next to `og:url`.
  - The "no `<link>`, no `<script>` and no `<img>`" bullet now excepts the screenshots: no `<img>` but the screenshots, whose `src` is a bare `mock-{slug}.png` beside the page; the page references each screenshot whether or not Chrome took it, a missing file being `refine-landing-page`'s finding.

## Insert step 5 Write the mocks into skills/add-landing-page/SKILL.md, renumbering the workflow to 6 and the report to 7
- **category:** functional
- **status:** done
- **steps:**
  - A new `5. **Write the mocks.**` sits after step 4 (notes) and before the workflow step; the workflow is `6.` and the report `7.`: `grep -nE '^[0-9]+\. \*\*' skills/add-landing-page/SKILL.md` lists Root and guard, Interview, Write the page, Write the notes, Write the mocks, Write the workflow, Report as 1–7.
  - The step names its inputs up front – "for each screen, in order, with its slug, name, description, state and size" – and never says "the interview" or "step 2" or any other step number, so `refine-landing-page` can paste it as it stands: `grep -n 'interview\|step 2' skills/add-landing-page/SKILL.md` matches nothing between the step 5 lead and the step 6 lead.
  - Its body, as sub-bullets: (a) write `docs/landing-page/mocks/mock-{slug}.html`, creating the folder – `<!doctype html>`, `lang`, viewport meta, `<title>` the screen's name, `<link rel="stylesheet" href="mock.css">`, no `<script>`, realistic placeholder content in the product's own words, the whole screen inside the window at the chosen size; when the file exists it is left untouched and the run says so, the row and screenshot still happening; (b) with the first mock, when missing: `docs/landing-page/mocks/mock.css` – `body` at `margin: 0`, the font stack `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, a `min-height: 100vh` frame, a neutral palette and a handful of shared classes (a top bar, a card, a button, a table) – and `docs/landing-page/mocks/index.html` – `<!doctype html>`, `<title>Mocks</title>`, the same `<link>`, an `<h1>`, one `<ul>`; both left untouched when present; (c) append `<li><a href="mock-{slug}.html">{screen name}</a> <img src="../mock-{slug}.png" alt="{screen description}"></li>` to that `<ul>` unless the index already holds a row for `mock-{slug}.html`; (d) find a browser with `command -v google-chrome chrome chromium`, taking the first hit, else on macOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` when it exists; with one, run from the root `"{chrome}" --headless --screenshot=docs/landing-page/mock-{slug}.png --window-size={w},{h} docs/landing-page/mocks/mock-{slug}.html`; without one, or on a non-zero exit or no file, print that one command with `google-chrome` as the binary for the user to run and carry on; nothing is installed.
  - `grep -n 'command -v google-chrome chrome chromium\|--window-size={w},{h}\|Google Chrome.app\|mock.css\|mocks/index.html' skills/add-landing-page/SKILL.md` matches all five inside step 5, and `claude plugin validate skills --strict` passes.
- **notes:**
  - Step 2 already reads `steps 3–6` and `Four branches`, so the renumbering left is the `5.` and `6.` leads of the workflow and report steps only; the Screens branch sits on one line (line 25) and names each screen's answers as its short name (kebab-case `{slug}`), what it shows and in what state, the benefit it illustrates, and desktop `1280,800` or phone `390,844`, with `{hero-slug}` the first screen's slug.

## Add the mocks to step 7 Report and the Rules of skills/add-landing-page/SKILL.md
- **category:** functional
- **status:** done
- **steps:**
  - Step 7 (**Report.**) adds: the mocks written (each `mocks/mock-{slug}.html`), `mocks/mock.css` and `mocks/index.html` when created, each screenshot taken at `docs/landing-page/mock-{slug}.png`, and, for each not taken, the one command to run, saying the page already points at that file and that a macOS user substitutes the app path.
  - `## Rules` gains: never overwrites an existing mock, `mock.css` or `mocks/index.html`; the screenshot command is the only program run beyond `git`, and nothing is installed. The existing "writes nothing outside `docs/landing-page/` and `.github/workflows/landing-page.yml`" rule stands unchanged.
  - `grep -n 'never overwrites' skills/add-landing-page/SKILL.md` shows the page rule and the mock rule; `grep -n 'nothing is installed' skills/add-landing-page/SKILL.md` matches in the Rules.
- **notes:**
  - Step 5's browser sub-bullet (line 46 of `skills/add-landing-page/SKILL.md`) already ends "and nothing is installed", so `grep -n 'nothing is installed'` matches there before any Rules line; the Rules entry is still to be added, and the macOS app path literal `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` sits on that same line for the report to point at.

## Prove step 5 of skills/add-landing-page/SKILL.md by writing one mock, mock.css and the index by hand in a scratch repo and running the screenshot command
- **category:** non-functional
- **status:** done
- **steps:**
  - In a throwaway `git init` repo under the session scratchpad, follow step 5 of `skills/add-landing-page/SKILL.md` literally for one desktop screen (slug `dashboard`, size `1280,800`), writing `docs/landing-page/mocks/mock-dashboard.html`, `mock.css` and `index.html` exactly as the step text instructs and nothing it does not say; where the text is too vague to write a file from, fix the step in `skills/add-landing-page/SKILL.md` and note the fix in the commit.
  - Run the step's browser lookup as written; with a browser found (on this machine `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` is expected), run the step's screenshot command verbatim: `test -s docs/landing-page/mock-dashboard.png` succeeds and `file docs/landing-page/mock-dashboard.png` says PNG. With `PATH=/usr/bin:/bin` and the app path treated as absent, confirm the printed fallback is exactly `google-chrome --headless --screenshot=docs/landing-page/mock-dashboard.png --window-size=1280,800 docs/landing-page/mocks/mock-dashboard.html`.
  - `grep -c '<script' docs/landing-page/mocks/mock-dashboard.html` prints 0; `grep -n 'mock-dashboard.html\|../mock-dashboard.png' docs/landing-page/mocks/index.html` matches one `<li>`; `git status --porcelain -uall` lists only paths under `docs/landing-page/`, none staged. Remove the scratch repo afterwards.
- **notes:**
  - Step 5 is lines 42–46 of `skills/add-landing-page/SKILL.md`: the lead, then four sub-bullets (mock, `mock.css` and `mocks/index.html` on first use, index row, browser lookup and screenshot).
  - On this machine `command -v google-chrome chrome chromium` prints nothing and exits 1, while `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` exists; `command -v` with several names exits non-zero whenever any name is missing even as it prints the ones found, so "the first hit" is the first line of its stdout, never a zero exit.

## Run full test suite for landing-page--mocks
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills --strict`) and confirm both pass.
