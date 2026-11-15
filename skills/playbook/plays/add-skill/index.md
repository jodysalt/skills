# Add skill

Write one skill's boilerplate in house style and hand it off: a `SKILL.md` whose frontmatter says when it triggers and what it never does, whose body takes an argument, walks numbered steps and ends in rules, every section a prompt, then invoke `refine-skill` in the same session, which interviews, fills the prompts in, validates and adds the row in `README.md`. Whatever the method adds comes as a pair, so a skill that can plausibly take the `add-{foo}` form is suggested as one, and an `add-{foo}` is drafted with its `refine-{foo}`. In a playbook repo the skill is written as a play behind a helper, with its entry in the play index. Branch gate as a spec skill's, an open ticket's branch passing too: a skill is source, and lands through a ticket or a planning branch.

## Skill

The arguments passed to the play.

If empty, ask what the skill should do.

## Steps

1. **Target.** The root is `git rev-parse --show-toplevel`, else the working directory. There are three targets, checked in this order. A playbook repo, where the root holds `.claude-plugin/plugin.json` and `skills/playbook/`: the skill is written as a play at `skills/playbook/plays/{name}/index.md` behind a helper at `skills/{name}/SKILL.md`, with an entry in the play index, the list after `Plays – ` in the `description:` line of `skills/playbook/SKILL.md`, and runs as `/{plugin}:{name}` or `/{plugin}:playbook {name}`, `{plugin}` being the manifest's `name`. A plugin repo without `skills/playbook/`: when the root holds `.claude-plugin/plugin.json`, the skill goes at `skills/{name}/SKILL.md` and runs as `/{plugin}:{name}`, `{plugin}` being the manifest's `name`. Any other repo: otherwise at `.claude/skills/{name}/SKILL.md`, run as `/{name}`. Call the directory `{dir}`, `skills` in a playbook repo.
2. **Name.** Kebab-case verb-noun naming what it does: `add-skill`, `run-migrations`, `close-ticket`. No prefix, no date. When the input adds, sets up or scaffolds a thing and the name is not `add-{foo}`, suggest `add-{foo}` for that thing with the reason – it gets a `refine-{foo}` beside it, so the thing can always be refined – the user's pick standing. It is the directory and the slash command, so confirm it with the user before writing. An `add-{foo}` is drafted with `refine-{foo}` beside it; say so. Stop and say so if `{dir}/{name}/SKILL.md` exists for either name: editing an existing skill is `jodysalt:playbook refine-skill`'s. In a playbook repo, stop instead, before anything is written, when `skills/playbook/plays/{name}/` or `skills/{name}/` exists, for either name of a pair, pointing at `jodysalt:playbook refine-skill` the same way; the name `playbook` is refused by the same guard, being the router's. There a name may start with `_`: a `_{name}` play is called only from other plays, so confirm that is meant.
3. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:playbook start-planning-session {name}`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
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

   In a playbook repo, write three things in place of that file, and for a pair all three for each name:

   - **The play**, `skills/playbook/plays/{name}/index.md`: the template above with no frontmatter, starting at `# {Title}`, and with the line "The arguments passed to the play." where the template holds `{arguments placeholder}`; the title, lead, steps and rules prompts are unchanged, and the pair's two differences apply as they do to a skill.
   - **The helper**, `skills/{name}/SKILL.md`, in the shape of `skills/commit/SKILL.md`, from the template below: `name` equal to the directory, a one-sentence `description` prompt, the `argument-hint`, dropped when the play takes no argument, `disable-model-invocation: true`, and a one-line body, `{plugin}` written out as the manifest's `name` and `{arguments placeholder}` written out inside that line.

     ```markdown
     ---
     name: {name}
     description: {What it does and where it writes, one sentence.}
     argument-hint: "[{what the argument is, e.g. '...'}]"
     disable-model-invocation: true
     ---

     Invoke `{plugin}:playbook {name} {arguments placeholder}` with the Skill tool.
     ```
   - **The index entry**, `{name} ({trigger})`, added to the play index in alphabetical position; the trigger is one short phrase taken from the input, the one least like the play's own name, and `refine-skill`'s interview may change it.

   A `_{name}` play is its `index.md` alone: no helper and no index entry, so `skills/playbook/SKILL.md` and every `skills/*/SKILL.md` stay as they were.

   The room rule: the `description:` line of `skills/playbook/SKILL.md` never exceeds 1,536 characters, measured by `grep -m1 '^description:' skills/playbook/SKILL.md | wc -m`. When an entry would take it past that, shorten the lead sentence before `Plays – ` first, then other plays' triggers, longest first, until the line fits. Never drop an entry, and report every sentence and trigger shortened.
5. **Hand off.** Invoke the `refine-skill` skill from this plugin (`jodysalt:playbook refine-skill`) with `{name}`, or the pair's two names, in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the skill should: {input}; this is a fresh boilerplate", `{input}` the line from `## Skill`. The framing is how the input reaches the interview; `refine-skill` reads it from there and otherwise from the file, finds every prompt the template left, and asks for each, landing the answers as edits. In a playbook repo the framing ends "this is a fresh boilerplate: a play, its helper and its entry in the play index", or "a `_` play, with no helper and no index entry", so the interview fills the play's prompts and the helper's `description` and settles the trigger. The interview, the validation, the row in `README.md` and the version-bump report are its.
6. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was written even when the interview stops early: the path or paths written – in a playbook repo the play, the helper and the index entry added for each name, with everything the room rule shortened, or the play alone for a `_{name}` – and the partners the new skill implies, as suggestions for a later `add-skill` run and nothing more – `remove-{foo}` for an `add-{foo}`, `list-{foo}` for a thing there can be several of, and whatever else the input implies. Say that everything is uncommitted and that `refine-skill`'s report follows.

## Rules

- Never overwrite or edit an existing skill; a path that exists stops the run before anything is written. The one exception is the play index line of `skills/playbook/SKILL.md` in a playbook repo, edited to add the entry and, by the room rule, to make room for it; nothing else in that file or in any other play or helper is touched.
- In a playbook repo a public play is never written without its helper and its index entry, and a `_{name}` play never with either.
- Never a personal `~/.claude/skills/` target.
- Never drafts a partner; it names them. Never bumps the plugin version, never edits `README.md`, never touches `CLAUDE.md`, never commits.
