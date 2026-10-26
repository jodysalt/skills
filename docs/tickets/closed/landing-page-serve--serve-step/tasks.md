# Tasks

## Add a "Serve the page" step 2 to skills/refine-landing-page/SKILL.md, renumber steps 2–7 to 3–8, repeat the URL in the report, and name the server in the rules
- **category:** functional
- **status:** done
- **steps:**
  - Insert after step 1 (*Root and guard*) a new step `2. **Serve the page.**` that: runs `pgrep -f "http-server {root}/docs/landing-page"` (absolute root); when found, takes the port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}` and the URL is `http://127.0.0.1:{port}/`; else checks `command -v npx` and runs `npx --yes http-server {root}/docs/landing-page -a 127.0.0.1 -c-1 > {scratchpad}/landing-page-server.log 2>&1` in the background (the Bash tool's `run_in_background`, a driver without it appending `&`), waits a few seconds and reads the first `http://127.0.0.1:` line after `Available on:`; prints the URL as one line before the findings; on no `npx` or no such line prints `npx --yes http-server docs/landing-page -a 127.0.0.1 -c-1` for the user to run and carries on, nothing else waiting on the server; the server is left running for the session and nothing stops it. The command carries no `-p`, `-o` or `-s`.
  - Renumber the old steps 2–7 to 3–8 and raise every `step N` cross-reference with N ≥ 2 by one (in `## Scope` and the step bodies); `grep -n 'step [0-9]' skills/refine-landing-page/SKILL.md` shows each pointing at the right renumbered step (findings = 4, interview/Look branch = 5, mocks = 6, result = 7, report = 8).
  - The report step (now 8) repeats the URL and `{url}mocks/` for the mocks index, or says the page was not served and gives the command to serve it.
  - In `## Rules`, replace "The screenshot command is the only program run beyond `git` and `date`, and nothing is installed" with "The screenshot command and the server are the only programs run beyond `git` and `date`; the server's npm cache download is the only install, and nothing is written into the repo"; keep "Writes nothing outside `docs/landing-page/`".
  - `grep -n 'Serve the page\|http-server\|Available on\|pgrep\|127.0.0.1' skills/refine-landing-page/SKILL.md` hits the step, the report and the rule; `grep -n 'http-server.*-[pos] ' skills/refine-landing-page/SKILL.md` prints nothing.
  - Probe on the host in a scratch dir holding an `index.html`: start `npx --yes http-server {dir} -a 127.0.0.1 -c-1` in the background and confirm the log has `Available on:` then `http://127.0.0.1:{port}`, `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:{port}/index.html` prints `200`, `lsof -nP -iTCP:{port} -sTCP:LISTEN` shows `127.0.0.1` only, and `pgrep -f "http-server {dir}"` finds it; then kill that probe server.

## Say the page is served in the refine-landing-page and add-landing-page descriptions and README.md rows, and bump .claude-plugin/plugin.json to 0.24.0
- **category:** chore
- **status:** done
- **steps:**
  - In `skills/refine-landing-page/SKILL.md`'s frontmatter `description` and its row in `README.md`, add "serves the page locally while it works" right after "reports every placeholder and what the notes imply and the page lacks".
  - In `skills/add-landing-page/SKILL.md`'s frontmatter `description`, its lead paragraph under `# Add landing page`, and its row in `README.md`, say the hand-off to `refine-landing-page` serves the page; change none of `add-landing-page`'s steps or rules.
  - Set `"version"` in `.claude-plugin/plugin.json` to `0.24.0`; `grep -n '"version"' .claude-plugin/plugin.json` prints `0.24.0`.
  - `grep -n 'serves the page' README.md skills/*/SKILL.md` hits both skills and both rows.

## Run full test suite for landing-page-serve--serve-step
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, this repo having no `package.json`) and confirm it passes.
