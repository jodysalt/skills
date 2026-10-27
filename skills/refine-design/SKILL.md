---
name: refine-design
description: Revisits one design under `designs/{name}/` – beside the ticket at `docs/tickets/open/{slug}/`, or under `docs/designs/` before the ticket exists – and improves it in place on a planning branch: reads its pages and its notes, reports every placeholder and what the ticket implies the design lacks, serves the designs folder locally while it works, interviews the user one question at a time, edits the pages and the notes as answers land, adds a page when an answer needs one, and records the verdict, `build` or `reject`, when it is reached. Use when the user says "refine the design", "the X design needs Y", "record the verdict on X", or runs `/refine-design`. Never creates a design, never pushes, never commits.
argument-hint: "[design name, and 'verdict' to record it – defaults to the only design, else asks]"
---

# Refine design

Improve an existing design in place: explore its pages, its notes and the ticket it belongs to, report what the ticket implies and the design lacks, serve the designs folder, interview, edit in place, and, when the decision is made, record the verdict in the notes beside the pages. Leave the result uncommitted. It never creates the design; a name with no `designs/{name}/` is `jodysalt:add-design`'s. Branch gate as a spec skill's: a design is drafted on a planning branch and lands through `wrap-up-worktree`.

## Scope

$ARGUMENTS

If given, a design name with or without `verdict` after it. The name matches a `designs/{name}/` folder under the resolved ticket, `docs/tickets/open/{slug}/designs/` – the only open ticket, else the one matching the current branch – or under `docs/designs/`. `verdict` runs the findings and then step 7 only. If empty, the only design across those folders, else list them and ask. If a name matches nothing, list the names and ask.

## Steps

1. **Resolve and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Resolve the scope to one `{folder}/{name}/`, `{folder}` being `docs/tickets/open/{slug}/designs` or `docs/designs`. If it is missing, stop and say so, naming `jodysalt:add-design`; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the pages, the notes and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session {name}`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Serve the designs.** Serve `{folder}` locally, so the user watches each edit land on a reload:
   - Look for a server already serving this folder: `pgrep -f "http-server {root}/{folder}"`, `{root}` absolute so two repos' designs are told apart.
   - Found, take its port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}`; the URL is `http://127.0.0.1:{port}/{name}/`. The match is usually the shell or `npm exec` that launched the server, and the listener a descendant that renamed itself `http-server`, so when the match holds no listener `{pid}` walks down its children (`pgrep -P {pid}`) until one does.
   - Else, when `command -v npx` finds it, run `npx --yes http-server {root}/{folder} -a 127.0.0.1 -c-1 > {scratchpad}/designs-server.log 2>&1` in the background – the Bash tool's `run_in_background`, a driver without it appending `&` – wait a few seconds, and read the URL from the log: the first `http://127.0.0.1:` line after `Available on:`, with `{name}/` appended.
   - With no `npx`, or no such line in the log, print `npx --yes http-server {folder} -a 127.0.0.1 -c-1` for the user to run and carry on; nothing else waits on the server, and the findings, the interview and the edits are the same without it.
   - The server is left running for the session; nothing in this skill stops it.
4. **Explore before asking.** Read every `{folder}/{name}/*.html`, `{folder}/{name}/README.md`, `{folder}/design.css`, the ticket's `index.md` when the design sits under one – its `# Goal`, `# Scope` and `# Acceptance criteria` – and the README of every other design under `{folder}`, so a verdict already recorded on a sibling is known. Recommended answers come from these.
5. **Report findings before editing anything**, each named by the file and line it is about:
   - Every `TODO:` in a page or in `README.md`, the `## Verdict` prompt aside: that one is the right state until the decision is made, and a finding only when `verdict` is in the scope or every other `TODO:` is gone.
   - A page `## Shows` does not name, or a page it names with no file.
   - A page that does not link `../design.css`, or holds a `<script>`, an external asset or a framework.
   - What the ticket's scope or acceptance criteria name that no page shows, and what a page shows that the ticket's scope rules out.
   - A `## Verdict` set to a value other than `build` or `reject`.
6. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the design at `{folder}/{name}/`". Give it this framing:
   - Seed the decision tree with the findings from step 5, then the decisions the pages make without saying so: the state each page shows, what the user does there and where it leads, which page a flow starts on.
   - The pages, the notes, the stylesheet and the ticket from step 4 count as explorable; a question they answer is never asked, and each recommended answer cites what it came from.
   - Edit the pages and `README.md` as answers land: realistic content in the product's own words, every page linking `../design.css` and leaning on its classes rather than restyling, no `<script>`, no external asset; each `TODO:` goes as its answer lands, and a deferred answer stays a `TODO:` marker where it was. When an answer needs a page the design does not have – the next step of a flow, another state of the same screen – write `{folder}/{name}/{page}.html` from the same shape as `index.html`, link it from the page that leads there, and add its line under `## Shows`. `design.css` is edited only when every design under `{folder}` should change with it, and the report says so.
   - The ticket's `index.md` stays untouched; what the design settles for the ticket is surfaced for `jodysalt:refine-ticket`.
7. **Record the verdict** when `verdict` is in the scope or the interview reaches it: ask whether the design is to be built or rejected, with the reason in a sentence, the recommended answer from the findings; write `build` or `reject` and the reason in place of the `## Verdict` prompt. A design that belongs to no ticket yet gets its verdict the same way; which ticket adopts it is `jodysalt:add-ticket`'s.
8. **Report.** The URL from step 3, or that the designs were not served and the command to serve them; the findings resolved and those left open; the files edited and each page added as `{folder}/{name}/{page}.html`; whether `design.css` changed; the verdict when it was recorded, and otherwise that `## Verdict` is still the prompt and `refine-design {name} verdict` records it. Say what the design settles for the ticket that `jodysalt:refine-ticket` should take up, or, for a design with no ticket, that `jodysalt:add-ticket` drafts the one it belongs to. Say that everything is uncommitted and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Never creates `designs/{name}/`; a missing design stops the run before anything is written.
- Edits only `{folder}/{name}/` and, when every design should change with it, `{folder}/design.css`; the ticket's `index.md`, other designs and source stay untouched.
- The verdict is the user's decision made in the interview, never a silent edit, and only ever `build` or `reject`.
- The server (`http-server`) is the only program run beyond `git`; its npm cache download is the only install, and nothing is written into the repo.
- Never pushes, never commits.
- Reads `docs/glossary.md` and never writes it.
