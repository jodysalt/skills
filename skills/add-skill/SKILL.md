---
name: add-skill
description: Writes the boilerplate of a new Claude Code skill at `skills/{name}/SKILL.md` when the repo root holds `.claude-plugin/plugin.json`, else at `.claude/skills/{name}/SKILL.md` – frontmatter, an argument section, steps and rules in this plugin's house style, every section a prompt – then hands off to `refine-skill`, which interviews and fills it in; a skill that could take the `add-{foo}` form is suggested as one, and an `add-{foo}` is drafted with its `refine-{foo}`. Use when the user says "add a skill for X", "create a skill", "make a skill that does Y", "write a skill", or runs `/add-skill`. Never overwrites or edits an existing skill, never drafts a partner, never commits.
argument-hint: "[what the skill does, e.g. 'runs the migrations and reports the result']"
---

# Add skill

Write one skill's boilerplate in house style and hand it off: a `SKILL.md` whose frontmatter says when it triggers and what it never does, whose body takes an argument, walks numbered steps and ends in rules, every section a prompt, then invoke `refine-skill` in the same session, which interviews, fills the prompts in, validates and adds the row in `README.md`. Whatever the method adds comes as a pair, so a skill that can plausibly take the `add-{foo}` form is suggested as one, and an `add-{foo}` is drafted with its `refine-{foo}`. Branch gate as a spec skill's, an open ticket's branch passing too: a skill is source, and lands through a ticket or a planning branch.

## Skill

$ARGUMENTS

If empty, ask what the skill should do.

## Steps

1. **Target.** The root is `git rev-parse --show-toplevel`, else the working directory. When the root holds `.claude-plugin/plugin.json`, the skill goes at `skills/{name}/SKILL.md` and runs as `/{plugin}:{name}`, `{plugin}` being the manifest's `name`; otherwise at `.claude/skills/{name}/SKILL.md`, run as `/{name}`. Call the directory `{dir}`.
2. **Name.** Kebab-case verb-noun naming what it does: `add-skill`, `run-migrations`, `close-ticket`. No prefix, no date. When the input adds, sets up or scaffolds a thing and the name is not `add-{foo}`, suggest `add-{foo}` for that thing with the reason – it gets a `refine-{foo}` beside it, so the thing can always be refined – the user's pick standing. It is the directory and the slash command, so confirm it with the user before writing. An `add-{foo}` is drafted with `refine-{foo}` beside it; say so. Stop and say so if `{dir}/{name}/SKILL.md` exists for either name: editing an existing skill is `jodysalt:refine-skill`'s.
3. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:start-planning-session {name}`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
4. **Write** `{dir}/{name}/SKILL.md` from this template. Frontmatter is `name`, equal to the directory, `description` in three parts, and `argument-hint`, dropped when the skill takes no argument; any other field is `refine-skill`'s to add when a step needs it. The section bodies are prompts for the interview, not content. `{arguments placeholder}` stands for a dollar sign followed by `ARGUMENTS`, the line Claude Code replaces with what the user typed; write it out, on its own line.

   ```markdown
   ---
   name: {name}
   description: {What it does and where it writes, one sentence.} Use when the user says "{phrase}", "{phrase}", or runs `/{name}`. {What it never does.}
   argument-hint: "[{what the argument is, e.g. '...'}]"
   ---

   # {Title}

   One paragraph: the one job this skill does and where it stops.

   ## {Argument}

   {arguments placeholder}

   What the argument is, how it is resolved, and what happens when it is empty.

   ## Steps

   1. **{Lead.}** What to read or check before anything changes.
   2. **{Lead.}** The work, one numbered step per decision point.
   3. **Report.** What the user sees at the end, and what is left uncommitted.

   ## Rules

   - What it never does.
   ```

   For a pair, both files come from the template with two differences. In `add-{foo}` the lead prompt is "One paragraph: write the boilerplate for {foo} and hand off to `refine-{foo}`, and where it stops." and a step **Hand off** – "Invoke `refine-{foo}` in the same session, framed with the input." – comes before **Report**. In `refine-{foo}` the lead prompt is "One paragraph: improve the {foo} that exists in place – explore, report, interview, edit – and where it stops."
5. **Hand off.** Invoke the `refine-skill` skill from this plugin (`jodysalt:refine-skill`) with `{name}`, or the pair's two names, in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the skill should: {input}; this is a fresh boilerplate", `{input}` the line from `## Skill`. The framing is how the input reaches the interview; `refine-skill` reads it from there and otherwise from the file, finds every prompt the template left, and asks for each, landing the answers as edits. The interview, the validation, the row in `README.md` and the version-bump report are its.
6. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was written even when the interview stops early: the path or paths written, and the partners the new skill implies, as suggestions for a later `add-skill` run and nothing more – `remove-{foo}` for an `add-{foo}`, `list-{foo}` for a thing there can be several of, and whatever else the input implies. Say that everything is uncommitted and that `refine-skill`'s report follows.

## Rules

- Never overwrite or edit an existing skill; a path that exists stops the run before anything is written.
- `SKILL.md` only: no supporting files, and no personal `~/.claude/skills/` target.
- Never drafts a partner; it names them. Never bumps the plugin version, never edits `README.md`, never touches `CLAUDE.md`, never commits.
