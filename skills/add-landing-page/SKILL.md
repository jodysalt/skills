---
name: add-landing-page
description: Scaffolds the market test on a planning branch from the plugin's templates – the landing page at `docs/landing-page/index.html` in the house design language with placeholders and a built-in waitlist, its privacy page, its notes in `docs/landing-page/README.md`, the mocks' stylesheet and index under `docs/landing-page/mocks/`, the Cloudflare Worker that serves the page and stores the waitlist in D1, and the manual deploy workflow when missing – then hands off to `refine-landing-page`, which serves the page locally, interviews and fills it. Use when the user says "add a landing page", "market-test this idea", "make a landing page for X", or runs `/add-landing-page`. Never overwrites an existing page, never pushes, never commits.
argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"
---

# Add landing page

Scaffold one market test from an idea and hand it off: copy the boilerplate – the landing page in the house design language with `TODO:` placeholders where the copy goes and a waitlist modal built in, the mocks' stylesheet and index, the Worker that serves the page and takes the waitlist into D1 – from the templates beside this skill, write the notes with every section a `TODO:` prompt, the Worker's config and the workflow that deploys it by hand, all uncommitted, then invoke `refine-landing-page` in the same session, which serves the page locally, interviews for the copy and fills the placeholders in. It writes nothing from the idea itself; the idea reaches the interview through the hand-off's framing. Publishing is the user's, and improving a page that exists is `refine-landing-page`'s. Branch gate as a spec skill's: the market test is drafted on a planning branch and lands through `wrap-up-worktree`.

## Idea

$ARGUMENTS

The product idea in one line. If empty, ask what the idea is before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/landing-page/index.html` exists under it, stop and say so, naming `jodysalt:refine-landing-page` as the skill that improves an existing page; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the page, the notes and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session landing-page`; on yes pass it and ask nothing else. When `git status --porcelain docs/landing-page` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Copy the boilerplate and write the notes.** The templates live in this skill's own folder, `templates/` under the base directory the Skill tool's "Base directory" line names. Copy each with `cp`, creating the folders, so the copy is byte for byte and never regenerated: `templates/index.html` to `docs/landing-page/index.html`, `templates/privacy.html` to `docs/landing-page/privacy.html`, `templates/mock.css` to `docs/landing-page/mocks/mock.css`, `templates/mocks-index.html` to `docs/landing-page/mocks/index.html`, `templates/worker.js` to `docs/landing-page/worker.js`, `templates/0001_signups.sql` to `docs/landing-page/migrations/0001_signups.sql`, `templates/assetsignore` to `docs/landing-page/.assetsignore` and `templates/gitignore` to `docs/landing-page/.gitignore`. Each of those beyond the page that already exists is left untouched, byte for byte, and the run says so. The page's buttons open its `#waitlist` dialog, whose form posts the email to `/api/waitlist`; its footer and the dialog link the privacy page, which names the controller, what is collected and why, and the two processors, since an email form needs one and ad platforms ask for it before ads run; the Worker serves the folder as static assets, takes that one route into the D1 `signups` table, the list of record, and `.assetsignore` keeps the notes, the mocks, the config, the Worker, the migrations and the deploy's npm install out of what is published. Then write `docs/landing-page/README.md` beside the page, only when it is missing, holding exactly the template below: every section a `TODO:` prompt naming what goes there, which `refine-landing-page` fills from the interview, `## Result` and `## Decision` staying prompts until the test is over.

   ```markdown
   # Market test

   ## Hypothesis
   TODO: the hypothesis – one sentence a result can falsify.

   ## Metric
   TODO: the metric – what is measured: waitlist sign-ups over visitors, pre-orders, clicks.

   ## Threshold
   TODO: the threshold – the number the hypothesis passes at.

   ## Window
   TODO: the window – the start and end dates.

   ## Traffic
   TODO: the traffic – who the visitors are and where they come from, each channel with its budget, keywords and ad copy, the UTM-tagged URL, and what is not counted.

   ## Call to action
   TODO: the call to action – what the buttons do: the waitlist modal and where the email goes, or the pre-order link.

   ## Result
   TODO: the metric's value at the window's end, filled by refine-landing-page.

   ## Decision
   TODO: build, change the offer, or stop – filled by refine-landing-page from the result against the threshold.
   ```
4. **Write the Worker's config and the workflow.** Two literals, each written only when its file is missing, creating the folders; a file that exists is said so and left untouched, byte for byte, neither read nor compared. Their one placeholder `{repo}` is the repo's name: the last path segment of `git remote get-url origin` with any `.git` removed, else the basename of the first path in `git worktree list`. `TODO:` and `${{ secrets.… }}` are written as they stand: the first is `refine-landing-page`'s to fill, the second GitHub's expression.

   `docs/landing-page/wrangler.toml`:

   ```toml
   # Serves this folder as static assets through a Worker; POST /api/waitlist stores emails in D1.
   # Local: `npx wrangler d1 migrations apply {repo}-waitlist --local && npx wrangler dev`.
   name = "{repo}-landing-page"
   main = "worker.js"
   compatibility_date = "2025-09-01"
   # TODO: deploy – the domain the page is served at, an active zone in the same Cloudflare account; delete the line to serve at workers.dev.
   routes = [{ pattern = "TODO: domain", custom_domain = true }]

   [assets]
   directory = "."
   binding = "ASSETS"
   run_worker_first = ["/api/*"]

   [[d1_databases]]
   binding = "DB"
   database_name = "{repo}-waitlist"
   # TODO: deploy – the id `npx wrangler d1 create {repo}-waitlist` prints.
   database_id = "TODO: database id"
   migrations_dir = "migrations"
   ```

   `.github/workflows/landing-page.yml`:

   ```yaml
   name: Landing page

   on: workflow_dispatch

   permissions:
     contents: read

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: cloudflare/wrangler-action@v3
           with:
             apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
             accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
             wranglerVersion: '4.156.1'
             workingDirectory: docs/landing-page
             command: |
               d1 migrations apply {repo}-waitlist --remote
               deploy
   ```

   The workflow runs only when the user dispatches it, so a page landing on the default branch half-filled never ships: it applies the migrations to the remote database, then deploys the Worker with the folder as its assets, minus what `.assetsignore` lists. The version is pinned because the action's default wrangler ignores `run_worker_first`, and `.assetsignore` lists `node_modules` and the package files because the action installs wrangler into the working directory, which is also the assets folder.
5. **Hand off.** Invoke the `refine-landing-page` skill from this plugin (`jodysalt:refine-landing-page`) with an empty argument, so its scope is the whole page, in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the idea is: {idea}; this is a fresh boilerplate", `{idea}` the line from `## Idea`. The framing is how the idea reaches the interview; `refine-landing-page` reads it from there and otherwise from the page, finds every `TODO:` the copies and the notes left, and asks for each, landing the answers as edits to the boilerplate.
6. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was scaffolded even when the interview stops early: the files copied or written – `docs/landing-page/index.html`, `docs/landing-page/privacy.html`, `docs/landing-page/mocks/mock.css`, `docs/landing-page/mocks/index.html`, `docs/landing-page/worker.js`, `docs/landing-page/migrations/0001_signups.sql`, `docs/landing-page/.assetsignore` and `docs/landing-page/.gitignore` from the templates, `docs/landing-page/README.md`, `docs/landing-page/wrangler.toml` and `.github/workflows/landing-page.yml`, saying which already existed and were left alone. Say that everything is uncommitted and that `refine-landing-page`'s report follows with the interview's result; the commit suggestion and the deploy steps are its.

## Rules

- Never overwrites `docs/landing-page/index.html`; a page that exists stops the run before anything is written. Every other file it writes follows the same rule without the stop: each is left untouched, byte for byte, while the run carries on and says so.
- Writes nothing outside `docs/landing-page/` and `.github/workflows/landing-page.yml`.
- The `cp` of step 3 is the only program run beyond `git`, and nothing is installed; never runs `wrangler`, never touches a Cloudflare account.
- Never pushes, never commits, never deploys.
- No framework, build step or external asset on the page but the templates' own script and the PostHog snippet.
- Reads `docs/glossary.md` and never writes it.
