---
name: refine-tutorial
description: Revisits one tutorial under `docs/tutorials/{slug}/` and improves it in place on a planning branch – reads its overview, its lessons and the shared layout, reports every placeholder, every lesson missing a part of the lesson shape and every page out of step with the layout, serves the tutorials folder locally while it works, interviews the user one question at a time for the audience, the outcomes and the lesson list, then researches the subject on the web and writes each lesson as its own page from the lesson template, with its sources under the overview's Further reading, editing as answers land. Use when the user says "refine the tutorial", "the X tutorial needs Y", "add a lesson on Z to X", "finish the X tutorial", or runs `/refine-tutorial`. Never creates a tutorial, never loads a framework or external asset, never pushes, never commits.
argument-hint: "[tutorial slug – defaults to the only tutorial, else asks]"
---

# Refine tutorial

Improve an existing tutorial in place: explore its pages and the shared layout, report what is unfilled, malformed or out of step, serve the tutorials folder, interview for who it is for and what it teaches, then research the subject and write the lessons, each a page in the lesson shape – outcome, concept, visual, try it, check, recap and next – so the reader learns by seeing and doing, not only reading. Leave the result uncommitted. It never creates the tutorial; a slug with no `docs/tutorials/{slug}/` is `jodysalt:add-tutorial`'s. Branch gate as a spec skill's: a tutorial is drafted on a planning branch and lands through `wrap-up-worktree`.

## Scope

$ARGUMENTS

If given, a tutorial slug matching a `docs/tutorials/{slug}/` folder. If empty, the only tutorial there, else list them and ask. If a slug matches nothing, list the slugs and ask.

## Steps

1. **Resolve and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Resolve the scope to one `{folder}`, `docs/tutorials/{slug}`. If it is missing, stop and say so, naming `jodysalt:add-tutorial`; nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the pages and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session {slug}`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Serve the tutorials.** Serve `docs/tutorials` locally, so the user watches each edit land on a reload:
   - Look for a server already serving this repo's tutorials: `pgrep -f "http-server {root}/docs/tutorials"`, `{root}` absolute so two repos' tutorials are told apart.
   - Found, take its port from `lsof -nP -iTCP -sTCP:LISTEN -a -p {pid}`; the URL is `http://127.0.0.1:{port}/{slug}/`. The match is usually the shell or `npm exec` that launched the server, and the listener a descendant that renamed itself `http-server`, so when the match holds no listener `{pid}` walks down its children (`pgrep -P {pid}`) until one does.
   - Else, when `command -v npx` finds it, run `npx --yes http-server {root}/docs/tutorials -a 127.0.0.1 -c-1 > {scratchpad}/tutorials-server.log 2>&1` in the background – the Bash tool's `run_in_background`, a driver without it appending `&` – wait a few seconds, and read the URL from the log: the first `http://127.0.0.1:` line after `Available on:`, with `{slug}/` appended.
   - With no `npx`, or no such line in the log, print `npx --yes http-server docs/tutorials -a 127.0.0.1 -c-1` for the user to run and carry on; nothing else waits on the server, and the findings, the interview and the edits are the same without it.
   - The server is left running for the session; nothing in this skill stops it.
4. **Explore before asking.** Read `{folder}/index.html`, every `{folder}/*.html`, `docs/tutorials/tutorial.css`, `docs/tutorials/tutorial.js` – its header comment documents the widgets a lesson may use – and the tutorial's row in `docs/tutorials/index.html`. Recommended answers come from these and from the subject in the caller's framing.
5. **Report findings before editing anything**, each named by the file and line it is about:
   - Every `TODO:` in the overview, a lesson or the tutorial's row in `docs/tutorials/index.html`.
   - A lesson the overview's `<ol class="lessons">` lists with no file, a `{n}-{name}.html` the list does not name, or a lesson whose `prev`/`next` links do not match the list's order.
   - A lesson missing a part of the lesson shape – a section of class `outcome`, `concept`, `visual`, `try`, `check` or `recap` – or whose check has no quiz, or whose visual holds no figure.
   - A page that does not link `../tutorial.css` and `../tutorial.js`, or loads a framework, a stylesheet or a script from outside the folder, or any external asset.
   - An overview whose Further reading holds no source while a lesson is written, or a lesson stating a fact no listed source covers.
   - An inline script a lesson could have done with a `tutorial.js` widget, and a widget three or more lessons re-implement, which belongs in `tutorial.js`.
6. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the tutorial at `{folder}/`". Give it this framing:
   - Seed the decision tree with the findings from step 5, then the decisions the tutorial makes without saying so: who the reader is and what they already know, the outcomes in the reader's words, the lessons – how many, their titles and order, what each teaches and builds on – the depth and the length of each, and the tone.
   - The pages, the shared layout and the subject from the framing count as explorable; a question they answer is never asked, and each recommended answer cites what it came from.
   - Edit the overview as answers land: the title, the lede, the audience, the outcomes, the lesson list with one `<li data-lesson="n">` linking `{n}-{name}.html` per lesson, the row in `docs/tutorials/index.html`; each `TODO:` goes as its answer lands, and a deferred answer stays a `TODO:` marker where it was.
7. **Research and write the lessons**, once the lesson list is settled, one lesson at a time so the user reviews each on a reload before the next is written:
   - Research the lesson's idea on the web with the driver's search and fetch tools (`WebSearch`, `WebFetch`), reading two or three sources that agree before a fact lands; a fact the sources contradict is written with the disagreement named, never resolved silently.
   - Write `{folder}/{n}-{name}.html` from the lesson template beside `add-tutorial`, `../add-tutorial/templates/lesson.html` under this skill's base directory, copied with `cp` then edited, so every lesson shares the shape: the outcome in one sentence; the concept in short paragraphs, one idea each, building on the lesson before; the visual as an inline SVG or `<canvas>` that shows the idea, themed with the stylesheet's `accent`, `muted` and `line` classes; try it, a control with `data-var` driving the figure through `tutorial.bind`, or a stepper when the idea is a sequence; the check, a quiz whose wrong answers are plausible and whose feedback teaches; the recap, what to remember and what the next lesson adds; `prev` and `next` links and `data-lesson="{n}"` matching the list. A part the lesson truly has nothing for is dropped and the report says which.
   - Add each source read to the overview's Further reading as the lesson lands, title then link, deduplicated.
   - `tutorial.css` and `tutorial.js` are edited only when every tutorial under `docs/tutorials/` should change with it – a widget three lessons need, a token every page should share – and the report says so.
8. **Report.** The URL from step 3, or that the tutorials were not served and the command to serve them; the findings resolved and those left open; the files edited and each lesson written as `{folder}/{n}-{name}.html`, with the parts dropped and why; the sources added to Further reading; whether `tutorial.css` or `tutorial.js` changed. Say that everything is uncommitted and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Never creates `docs/tutorials/{slug}/`; a missing tutorial stops the run before anything is written.
- Edits only `{folder}/`, the tutorial's row in `docs/tutorials/index.html` and, when every tutorial should change with it, `docs/tutorials/tutorial.css` and `tutorial.js`; other tutorials and source stay untouched.
- A fact lands only from sources the overview lists; never invents a fact, a figure or a quote, and names a disagreement between sources instead of settling it.
- No framework, build step, CDN or external asset on a page: a lesson is vanilla HTML, inline SVG or `<canvas>`, and scripts from the folder only.
- The server (`http-server`) and the `cp` of the lesson template are the only programs run beyond `git`; the server's npm cache download is the only install, and nothing is written into the repo by it.
- Never pushes, never commits.
- Reads `docs/glossary.md` and never writes it.
