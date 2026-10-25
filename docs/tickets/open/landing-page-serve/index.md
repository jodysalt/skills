---
title: Landing Page Serve
type: feat
delivers: Market test before building
---

# Goal
While `refine-landing-page` interviews, the landing page is served locally from the moment there is something to serve, so the user watches each edit land in a browser on a reload instead of opening the file by hand or starting a server beside the skill. The scaffold run gets it for free: `add-landing-page` hands off to `refine-landing-page` with the page already copied.

# Context
- `skills/refine-landing-page/SKILL.md`: step 1 guards on `docs/landing-page/index.html`, so from step 2 on there is always a page to serve; step 7 reports; the rule "The screenshot command is the only program run beyond `git` and `date`, and nothing is installed" forbids a server today. `skills/add-landing-page/SKILL.md` step 4 hands off to `refine-landing-page` in the same session with the page already copied, so a server started in `refine-landing-page` covers the scaffold run too; its own rule "The `cp` of step 2 is the only program run beyond `git`" stays true.
- Evidence: during the `../breezybooking` run the maintainer started `npm exec http-server docs/landing-page -p 8080 -c-1` by hand beside the interview; this ticket makes the skill do it.
- `http-server` 14.1.1 probed on the host (node 22.12.0): `npx --yes http-server {dir} -c-1` serves the folder with caching off, so a reload shows the edit; with no `-p` it takes the next free port from 8080 up and prints `Available on:` followed by `http://127.0.0.1:{port}`, while an explicit `-p` on a taken port exits with `EADDRINUSE`; it binds every interface unless `-a 127.0.0.1`; `-o` opens a browser through the OS, `-s` silences the output the URL is read from.
- Serving the folder, not the file, gives `index.html`, `mock-{slug}.png` and `mocks/` one origin, the layout GitHub Pages serves from `gh-pages`.
- Vision: *A website builder* is a non-goal, so the server is a viewer for the file, never a build step or a dependency written into the repo; *Driver-agnostic*, so an unattended run with no browser is not broken by it.
- Glossary: *landing page*, *mock*, *market test* in their defined senses.

# Scope
In:
- **`refine-landing-page` serves the page.** A new step 2, **Serve the page**, the later steps renumbered: from the root, once step 1's guard has passed and before the findings and the interview, run `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1` in the background, its output to a log file in the scratchpad, and read the URL from the log's `Available on:` line. The npm cache download on first use is allowed: nothing is written into the repo. The rule becomes: the screenshot command and the server are the only programs run beyond `git` and `date`, and nothing is written outside `docs/landing-page/`.
- **No `-p`.** `http-server` takes the next free port from 8080 up, so a taken port never stops a run; the skill never picks a port and reads the one it got.
- **`-a 127.0.0.1`.** The unfinished page is not served to the LAN, and the printed URL is always `http://127.0.0.1:{port}/`.
- **No `-o`.** The skill prints the URL as a line the user clicks; an unattended driver has no browser to open.
- **The server lives for the session.** It is left running after the report; a background process ends with the Claude Code session, and nothing in the skill stops it. A later run first looks for a server already serving this repo's page – `pgrep -f "http-server {root}/docs/landing-page"`, the absolute path so two repos' pages are told apart – and, finding one, reads its port (`lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}`) and reuses its URL instead of starting a second; the skill passes the absolute path for that reason.
- **Failure path.** No `npx` on `PATH`, or no `Available on:` line in the log within a few seconds, prints the one command for the user to run – `npx --yes http-server docs/landing-page -a 127.0.0.1 -c-1` – and carries on, as the screenshot step does for Chrome. Nothing else waits on the server; the findings, the interview, the edits and the mocks are the same with or without it.
- **Where the URL appears.** Once right after the server starts, before the findings, and in step 7's report, which also names `{url}mocks/` for the mocks index, where a screenshot's mock opens at its real size.
- **Description and row.** `refine-landing-page`'s description and its `README.md` row gain "serves the page locally while it works" after "reports every placeholder …"; `add-landing-page`'s description and row say the hand-off serves the page. `.claude-plugin/plugin.json` to `0.24.0`.

Out:
- A file watcher or live reload beyond caching off; the user reloads.
- Serving from `add-landing-page` itself; the hand-off is in the same session, so `refine-landing-page`'s server is the scaffold run's too.
- Writing `http-server` into any manifest, lockfile or `.gitignore`; a change to the workflow or the templates; a page served to the network; a stop step.

# Acceptance criteria
- `skills/refine-landing-page/SKILL.md` has a **Serve the page** step between the guard and the findings whose command is `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1` run in the background with no `-p`, no `-o` and no `-s`, that reads the URL from the log's `Available on:` line, prints it once there and again in the report with `{url}mocks/`, reuses a server `pgrep -f "http-server {root}/docs/landing-page"` already finds, and on a missing `npx` or a log with no `Available on:` line prints the command and carries on. The rule names the server beside the screenshot command and still says nothing is written outside `docs/landing-page/`.
- In a repo with a page, `refine-landing-page` prints `http://127.0.0.1:{port}/` before its findings and `curl -s -o /dev/null -w '%{http_code}' {url}index.html` prints `200` during the interview; an edit that lands is visible on a reload without restarting anything; `lsof -nP -iTCP:{port} -sTCP:LISTEN` shows the listener on `127.0.0.1` only.
- A second `refine-landing-page` run in the same session prints the same URL and starts no second server: `pgrep -fc "http-server {root}/docs/landing-page"` prints `1` after it.
- In a fresh `git init` repo, `add-landing-page` with an idea leaves the page served by the time `refine-landing-page` asks its first question, with no change to `add-landing-page`'s steps beyond its description.
- With `npx` off `PATH` the run prints the one command and completes with the same findings and edits as before; nothing under the repo changes beyond `docs/landing-page/`, and `git status --porcelain` shows no manifest or lockfile.
- `claude plugin validate skills --strict` passes; `.claude-plugin/plugin.json` reads `0.24.0`; the two descriptions and `README.md` rows say what the Scope says.

# Implementation notes
- **`refine-landing-page`.** Insert step 2 **Serve the page** and renumber 2–7 to 3–8, fixing every `step N` cross-reference with N ≥ 2 up by one – ten today, in the scope paragraph and steps 3, 4, 5 and 6 (`grep -on 'step [0-9]' skills/refine-landing-page/SKILL.md` lists them). The step: look for a running server with `pgrep -f "http-server {root}/docs/landing-page"`; found, take its port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}` and the URL is `http://127.0.0.1:{port}/`; else `command -v npx`, and with it run `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1 > {scratchpad}/landing-page-server.log 2>&1` in the background – the Bash tool's `run_in_background`, an agent without it appending `&` – wait a few seconds, and read the first `http://127.0.0.1:` line after `Available on:`; print the URL as one line. On no `npx` or no line, print `npx --yes http-server docs/landing-page -a 127.0.0.1 -c-1` and carry on. The report (now step 8) repeats the URL and `{url}mocks/`, or that the page was not served and the command to serve it.
- **Rules.** Replace "The screenshot command is the only program run beyond `git` and `date`, and nothing is installed" with "The screenshot command and the server are the only programs run beyond `git` and `date`; the server's npm cache download is the only install, and nothing is written into the repo". Keep "Writes nothing outside `docs/landing-page/`" as the server's log is in the scratchpad.
- **`add-landing-page`.** Description, lead paragraph and `README.md` row only: the hand-off serves the page; no step changes.
- **Bump** `.claude-plugin/plugin.json` to `0.24.0`.
- One slice is enough: the step, the rule, the descriptions, the rows and the bump are one backlog.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -n 'Serve the page\|http-server\|Available on\|pgrep\|127.0.0.1' skills/refine-landing-page/SKILL.md`; `grep -c -- '-p \|-o \|-s ' skills/refine-landing-page/SKILL.md` prints 0 for the server command; `grep -n 'step [0-9]' skills/refine-landing-page/SKILL.md` shows every cross-reference pointing at the renumbered step; `grep -n '"version"' .claude-plugin/plugin.json` prints `0.24.0`; `grep -n 'serves the page' README.md skills/*/SKILL.md` hits both skills.
- On the host: `npx --yes http-server {dir} -a 127.0.0.1 -c-1` with 8080 taken prints `Available on:` and `http://127.0.0.1:8081`; `curl` of `index.html` prints `200`; `lsof` shows `127.0.0.1` only; a second start is skipped once `pgrep -f` finds the first.
- Manual, throwaway repo under `claude --plugin-dir` pointed at this ticket's worktree: run `add-landing-page` with the Breezy brief and open the printed URL before the first answer; let an Offer answer land and reload; run `refine-landing-page benefits` in the same session and see the same URL with no second server; run once more with `npx` off `PATH` (`PATH=/usr/bin:/bin`) and see the command printed and the interview unchanged.

# Rollout
Bump `plugin.json` to `0.24.0`; merging to `main` is the release. No flag or migration: a repo with no node gets the command printed and the same run as `0.23.0`; nothing is written into any repo. Fallback is reverting the commit, which drops the step and restores the rule.

## Strategic fit
Delivers *Market test before building* by making the interview a loop the user sees – each answer lands and shows on a reload, so copy and look are judged on the page rather than in the diff. Stands on *Explore before asking*, since the page is up before the first question and the recommended answers can be checked against it; on *Driver-agnostic*, since no browser is opened and an unattended run loses nothing when the server is absent; and on *One thing, then stop*, since the server is a viewer left running and nothing is pushed or committed. It respects *A website builder*: the page is still one static file with no build step, and the server writes nothing into the repo.
