---
name: add-design
description: Scaffolds one design on a planning branch from the plugin's templates – a page with `TODO:` placeholders and its notes under `designs/{name}/` beside the ticket at `docs/tickets/open/{slug}/`, plus the designs' shared stylesheet when missing – then hands off to `refine-design`, which serves the design locally, interviews and fills it. Use when the user says "add a design", "sketch the X screen", "mock up X for the Y ticket", or runs `/add-design`. Never overwrites an existing design, never writes a design with no open ticket, never pushes, never commits.
argument-hint: "[the design in one line, e.g. 'a day planner']"
---

# Add design

Scaffold one design from a line and hand it off: resolve the ticket it belongs to, copy the boilerplate – a page with `TODO:` placeholders where the content goes, the notes with every section a `TODO:` prompt, the designs' shared stylesheet – from the templates beside this skill, all uncommitted, then invoke `refine-design` in the same session, which serves the design locally, interviews for what it shows and fills the placeholders in. It writes nothing from the line itself; the line reaches the interview through the hand-off's framing. Improving a design that exists is `refine-design`'s. Branch gate as a spec skill's: a design is drafted on a planning branch and lands through `wrap-up-worktree`.

## Design

$ARGUMENTS

The design in one line. If empty, ask what the design shows before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the notes and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session {name}`, `{name}` from step 3 when it has run, else `design`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Resolve the ticket and the name.** A design always belongs to an open ticket. When `docs/tickets/open/` holds none, stop and say so, naming `jodysalt:add-ticket` as the skill that drafts the ticket first; nothing is written. Otherwise the ticket is the only directory there, else the open ticket matching the current branch name, else the one the line names, else ask which with one option per open ticket. The design's folder is `docs/tickets/open/{slug}/designs`; call it `{folder}`. The name is the line's kebab-case form with a leading article or "for" dropped (`for a day planner` becomes `day-planner`). Confirm the ticket and the name in one question with the pick recommended. If `{folder}/{name}/` exists, stop and say so, naming `jodysalt:refine-design` as the skill that improves an existing design; nothing is written.
4. **Copy the boilerplate.** The templates live in this skill's own folder, `templates/` under the base directory the Skill tool's "Base directory" line names. Copy each with `cp`, creating the folders, so the copy is byte for byte and never regenerated: `templates/index.html` to `{folder}/{name}/index.html`, `templates/README.md` to `{folder}/{name}/README.md`, and `templates/design.css` to `{folder}/design.css`. An existing `design.css` is left untouched, byte for byte, and the run says so; every design under `{folder}` links it as `../design.css`.
5. **Hand off.** Invoke the `refine-design` skill from this plugin (`jodysalt:refine-design`) with `{name}` in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the design is: {line}; it belongs to {slug}; this is a fresh boilerplate", `{line}` the line from `## Design`. The framing is how the line reaches the interview; `refine-design` reads it from there and otherwise from the folder, finds every `TODO:` the copies left, and asks for each, landing the answers as edits to the boilerplate.
6. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was scaffolded even when the interview stops early: the ticket the design belongs to; the files copied – `{folder}/{name}/index.html`, `{folder}/{name}/README.md` and `{folder}/design.css`, saying when the stylesheet already existed and was left alone. Say that everything is uncommitted and that `refine-design`'s report follows with the interview's result; the commit suggestion is its.

## Rules

- Never overwrites a design; a `{folder}/{name}/` that exists stops the run before anything is written. `{folder}/design.css` follows the same rule without the stop: it is left untouched, byte for byte, while the run carries on and says so.
- Never writes a design with no open ticket; an empty `docs/tickets/open/` stops the run before anything is written.
- Writes nothing outside `{folder}`.
- The `cp` of step 4 is the only program run beyond `git`, and nothing is installed.
- Never pushes, never commits.
- No framework, build step, script or external asset on the page.
- Reads `docs/glossary.md` and never writes it.
