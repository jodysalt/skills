---
name: add-landing-page
description: Scaffolds the market test on a planning branch from the plugin's templates – the landing page at `docs/landing-page/index.html` in the house design language with placeholders, its notes in `docs/landing-page/README.md`, the mocks' stylesheet and index under `docs/landing-page/mocks/`, the workflow when missing – then hands off to `refine-landing-page`, which serves the page locally, interviews and fills it. Use when the user says "add a landing page", "market-test this idea", "make a landing page for X", or runs `/add-landing-page`. Never overwrites an existing page, never pushes, never commits.
argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"
---

# Add landing page

Scaffold one market test from an idea and hand it off: copy the boilerplate – the landing page in the house design language with `TODO:` placeholders where the copy goes, the mocks' stylesheet and index – from the templates beside this skill, write the notes with every section a `TODO:` prompt and the workflow that publishes the page, all uncommitted, then invoke `refine-landing-page` in the same session, which serves the page locally, interviews for the copy and fills the placeholders in. It writes nothing from the idea itself; the idea reaches the interview through the hand-off's framing. Publishing is the user's, and improving a page that exists is `refine-landing-page`'s. Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`.

## Idea

$ARGUMENTS

The product idea in one line. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/landing-page/index.html` exists under it, stop and say so, naming `jodysalt:refine-landing-page` as the skill that improves an existing page; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the page, the notes and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session landing-page`; on yes pass it and ask nothing else. When `git status --porcelain docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Copy the boilerplate and write the notes.** The templates live in this skill's own folder, `templates/` under the base directory the Skill tool's "Base directory" line names. Copy each with `cp`, creating the folders, so the copy is byte for byte and never regenerated: `templates/index.html` to `docs/landing-page/index.html`, `templates/mock.css` to `docs/landing-page/mocks/mock.css`, and `templates/mocks-index.html` to `docs/landing-page/mocks/index.html`. An existing `mock.css` or `mocks/index.html` is left untouched, byte for byte, and the run says so. Then write `docs/landing-page/README.md` beside the page, only when it is missing, holding exactly the template below: every section a `TODO:` prompt naming what goes there, which `refine-landing-page` fills from the interview, `## Result` and `## Decision` staying prompts until the test is over.

   ```markdown
   # Market test

   ## Hypothesis
   TODO: the hypothesis – one sentence a result can falsify.

   ## Metric
   TODO: the metric – what is measured at the link the call to action gives: sign-ups, pre-orders, clicks.

   ## Threshold
   TODO: the threshold – the number the hypothesis passes at.

   ## Window
   TODO: the window – the start and end dates.

   ## Call to action
   TODO: the call to action – what the button does and where it leads, the link.

   ## Result
   TODO: the metric's value at the window's end, filled by refine-landing-page.

   ## Decision
   TODO: build, change the offer, or stop – filled by refine-landing-page from the result against the threshold.
   ```
4. **Write the workflow.** Write `.github/workflows/landing-page.yml` only when it is missing, creating the folders. When the file exists, say so and leave it untouched, byte for byte; it is not read or compared. The file is this skill's one literal, so every run writes the same thing: the YAML below, with its one placeholder `{default-branch}` replaced by the default branch – `git symbolic-ref --short refs/remotes/origin/HEAD` with its `origin/` prefix removed, else `git branch --show-current`, else `main`. `${{ secrets.GITHUB_TOKEN }}` is written as it stands; it is GitHub's expression, not a placeholder.

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
5. **Hand off.** Invoke the `refine-landing-page` skill from this plugin (`jodysalt:refine-landing-page`) with an empty argument, so its scope is the whole page, in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the idea is: {idea}; this is a fresh boilerplate", `{idea}` the line from `## Idea`. The framing is how the idea reaches the interview; `refine-landing-page` reads it from there and otherwise from the page, finds every `TODO:` the copies and the notes left, and asks for each, landing the answers as edits to the boilerplate.
6. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was scaffolded even when the interview stops early: the four files copied or written – `docs/landing-page/index.html`, `docs/landing-page/mocks/mock.css` and `docs/landing-page/mocks/index.html` from the templates, saying which already existed and were left alone, and `docs/landing-page/README.md` – and `.github/workflows/landing-page.yml`, written or already there and left alone. Say that everything is uncommitted and that `refine-landing-page`'s report follows with the interview's result; the commit suggestion and the publishing steps are its.

## Rules

- Never overwrites `docs/landing-page/index.html` or an existing `.github/workflows/landing-page.yml`; a page that exists stops the run before anything is written. `docs/landing-page/README.md`, `mocks/mock.css` and `mocks/index.html` follow the same rule without the stop: each is left untouched, byte for byte, while the run carries on and says so.
- Writes nothing outside `docs/landing-page/` and `.github/workflows/landing-page.yml`.
- The `cp` of step 3 is the only program run beyond `git`, and nothing is installed.
- Never pushes, never commits, never enables GitHub Pages.
- No framework, build step or external asset on the page.
- Reads `docs/glossary.md` and never writes it.
