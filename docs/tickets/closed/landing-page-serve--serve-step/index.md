---
title: Serve Step
type: feat
priority: high
---

# Goal
`refine-landing-page` serves the landing page locally from its new step 2 on, so the user watches each edit land in a browser on a reload instead of opening the file by hand or starting a server beside the skill; `add-landing-page`'s hand-off gets it for free. This one slice is the parent's whole scope.

# Context
- Parent: `docs/tickets/closed/landing-page-serve/index.md`, whose Implementation notes say "One slice is enough: the step, the rule, the descriptions, the rows and the bump are one backlog." This slice is that backlog and moves all six of the parent's acceptance criteria, every one unmet today.
- `skills/refine-landing-page/SKILL.md` today: step 1 *Root and guard* (line 19), step 2 *Explore before asking* (line 20), step 3 findings (line 21), step 4 interview (line 32), step 5 mocks (line 51), step 6 result (line 56), step 7 report (line 57); the rule "The screenshot command is the only program run beyond `git` and `date`, and nothing is installed" (line 65) and "Writes nothing outside `docs/landing-page/`" (line 62). `grep -on 'step [0-9]'` lists ten cross-references with N ≥ 2: lines 15 (`step 6`, `step 4`, in `## Scope`), 26 (`step 2`), 31 (`step 6`), 33 (`step 3`), 42 (`step 5`), 45 (`step 2`), 48 (`step 5` twice), 49 (`step 6`).
- `skills/add-landing-page/SKILL.md` step 4 (line 73) hands off to `refine-landing-page` in the same session with the page already copied, so the server started there covers the scaffold run; its rule "The `cp` of step 2 is the only program run beyond `git`, and nothing is installed" (line 80) stays true and its steps do not change.
- `README.md` line 22 is `add-landing-page`'s row, line 42 `refine-landing-page`'s. `.claude-plugin/plugin.json` reads `0.23.0`.
- `http-server` 14.1.1 on node 22.12.0, as the parent probed: with no `-p` it takes the next free port from 8080 up and prints `Available on:` then `http://127.0.0.1:{port}`; an explicit `-p` on a taken port exits `EADDRINUSE`; `-a 127.0.0.1` keeps it off the LAN; `-o` opens a browser; `-s` silences the line the URL is read from; `-c-1` turns caching off. `npx` is at `/usr/local/bin/npx` on this machine.
- Glossary: *landing page*, *mock*, *market test*, *driver*, *unattended* in their defined senses. This repo has no test suite; checks are `grep`, `claude plugin validate skills --strict` and the manual run.
- Drafted on the `landing-page-serve` ticket branch; the planning-session offer was declined.

# Scope
In – the parent's Scope, unchanged:
- **`refine-landing-page` step 2, Serve the page**, the later steps renumbered 3–8: from the root, after step 1's guard and before exploring, the findings and the interview, run `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1` in the background, its output to a log file in the scratchpad, and read the URL from the log's `Available on:` line. The npm cache download on first use is allowed; nothing is written into the repo.
- **No `-p`**: the skill never picks a port and reads the one it got. **`-a 127.0.0.1`**: the URL is always `http://127.0.0.1:{port}/`. **No `-o`**: the URL is printed as a line to click. **No `-s`**.
- **The server lives for the session**: left running after the report, nothing in the skill stops it. A later run first looks with `pgrep -f "http-server {root}/docs/landing-page"` (absolute path, so two repos' pages are told apart) and, finding one, reads its port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}` and reuses its URL.
- **Failure path**: no `npx` on `PATH`, or no `Available on:` line in the log within a few seconds, prints `npx --yes http-server docs/landing-page -a 127.0.0.1 -c-1` for the user to run and carries on; nothing else waits on the server.
- **Where the URL appears**: once right after the server starts or is found, before the findings, and in the report (now step 8) with `{url}mocks/` for the mocks index, or that the page was not served and the command to serve it.
- **Rule**: "The screenshot command and the server are the only programs run beyond `git` and `date`; the server's npm cache download is the only install, and nothing is written into the repo"; "Writes nothing outside `docs/landing-page/`" kept.
- **Descriptions and rows**: `refine-landing-page`'s description and `README.md` row gain "serves the page locally while it works" after "reports every placeholder …"; `add-landing-page`'s description, lead paragraph and row say the hand-off serves the page. `.claude-plugin/plugin.json` to `0.24.0`.

Out: a file watcher or live reload; serving from `add-landing-page` itself or any change to its steps; `http-server` in any manifest, lockfile or `.gitignore`; a change to the workflow or the templates; serving to the network; a stop step.

# Acceptance criteria
- `skills/refine-landing-page/SKILL.md` has a **Serve the page** step between the guard and the findings whose command is `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1` run in the background with no `-p`, no `-o` and no `-s`, that reads the URL from the log's `Available on:` line, prints it once there and again in the report with `{url}mocks/`, reuses a server `pgrep -f "http-server {root}/docs/landing-page"` already finds, and on a missing `npx` or a log with no `Available on:` line prints the command and carries on. The rule names the server beside the screenshot command and still says nothing is written outside `docs/landing-page/`.
- In a repo with a page, `refine-landing-page` prints `http://127.0.0.1:{port}/` before its findings and `curl -s -o /dev/null -w '%{http_code}' {url}index.html` prints `200` during the interview; an edit that lands is visible on a reload without restarting anything; `lsof -nP -iTCP:{port} -sTCP:LISTEN` shows the listener on `127.0.0.1` only.
- A second `refine-landing-page` run in the same session prints the same URL and starts no second server: `pgrep -fc "http-server {root}/docs/landing-page"` prints `1` after it.
- In a fresh `git init` repo, `add-landing-page` with an idea leaves the page served by the time `refine-landing-page` asks its first question, with no change to `add-landing-page`'s steps beyond its description.
- With `npx` off `PATH` the run prints the one command and completes with the same findings and edits as before; nothing under the repo changes beyond `docs/landing-page/`, and `git status --porcelain` shows no manifest or lockfile.
- `claude plugin validate skills --strict` passes; `.claude-plugin/plugin.json` reads `0.24.0`; the two descriptions and `README.md` rows say what the Scope says.

# Implementation notes
- **`refine-landing-page`.** Insert step 2 **Serve the page** after line 19 and renumber 2–7 to 3–8, raising each of the ten `step N` cross-references listed in Context by one. The step: `pgrep -f "http-server {root}/docs/landing-page"`; found, take the port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}` and the URL is `http://127.0.0.1:{port}/`; else `command -v npx`, and with it run `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1 > {scratchpad}/landing-page-server.log 2>&1` in the background – the Bash tool's `run_in_background`, a driver without it appending `&` – wait a few seconds, and read the first `http://127.0.0.1:` line after `Available on:`; print the URL as one line. On no `npx` or no line, print `npx --yes http-server docs/landing-page -a 127.0.0.1 -c-1` and carry on. The report repeats the URL and `{url}mocks/`, or that the page was not served and the command.
- **Rules.** Replace line 65 with the Scope's rule; keep line 62.
- **`add-landing-page`.** Description, lead paragraph and `README.md` row only.
- **Bump** `.claude-plugin/plugin.json` to `0.24.0`.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -n 'Serve the page\|http-server\|Available on\|pgrep\|127.0.0.1' skills/refine-landing-page/SKILL.md`; the server command carries no `-p `, `-o ` or `-s `; `grep -n 'step [0-9]' skills/refine-landing-page/SKILL.md` shows every cross-reference pointing at the renumbered step; `grep -n '"version"' .claude-plugin/plugin.json` prints `0.24.0`; `grep -n 'serves the page' README.md skills/*/SKILL.md` hits both skills.
- On the host: `npx --yes http-server {dir} -a 127.0.0.1 -c-1` with 8080 taken prints `Available on:` and `http://127.0.0.1:8081`; `curl` of `index.html` prints `200`; `lsof` shows `127.0.0.1` only; a second start is skipped once `pgrep -f` finds the first.
- Manual, throwaway repo under `claude --plugin-dir` pointed at this worktree: run `add-landing-page` with the Breezy brief and open the printed URL before the first answer; let an Offer answer land and reload; run `refine-landing-page benefits` in the same session and see the same URL with no second server; run once more with `PATH=/usr/bin:/bin` and see the command printed and the interview unchanged.

# Rollout
The bump to `0.24.0` lands with this slice; merging the parent to `main` is the release. No flag or migration: a repo with no node gets the command printed and the same run as `0.23.0`. Fallback is reverting the commit.

## Strategic fit
Advances `landing-page-serve` by delivering all of it in one backlog: the step, the rule, the descriptions, the rows and the bump, so every one of the parent's acceptance criteria is met when this slice lands.
