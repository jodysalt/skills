---
name: add-skill
description: Drafts a new Claude Code skill at `skills/{name}/SKILL.md` when the repo root holds `.claude-plugin/plugin.json`, else at `.claude/skills/{name}/SKILL.md` – frontmatter that says when it triggers and what it never does, an argument section, steps and rules in this plugin's house style, filled in through `grill-me`. Use when the user says "add a skill for X", "create a skill", "make a skill that does Y", "write a skill", or runs `/add-skill`. In a plugin repo it adds the README row and runs `claude plugin validate` strictly, and reports that the version owes a bump without making it. Never overwrites or edits an existing skill, never commits.
argument-hint: "[what the skill does, e.g. 'runs the migrations and reports the result']"
---

# Add skill

Draft one skill in house style: a `SKILL.md` whose frontmatter says when it triggers and what it never does, whose body takes an argument, walks numbered steps and ends in rules. The template's section bodies are prompts; `grill-me` fills them in. No branch gate: a skill is source, not a planning doc.

## Skill

$ARGUMENTS

If empty, ask what the skill should do.

## Steps

1. **Target.** The root is `git rev-parse --show-toplevel`, else the working directory. When the root holds `.claude-plugin/plugin.json`, the skill goes at `skills/{name}/SKILL.md` and runs as `/{plugin}:{name}`, `{plugin}` being the manifest's `name`; otherwise at `.claude/skills/{name}/SKILL.md`, run as `/{name}`. Call the directory `{dir}`.
2. **Read** `CLAUDE.md` for the repo's norms and one or two skills already under `{dir}` for tone, when any exist.
3. **Name.** Kebab-case verb-noun naming what it does: `add-skill`, `run-migrations`, `close-ticket`. No prefix, no date. It is the directory and the slash command, so confirm it with the user before writing. Stop and say so if `{dir}/{name}/SKILL.md` exists: editing an existing skill is out of scope.
4. **Write** `{dir}/{name}/SKILL.md` from this template. Frontmatter is `name`, equal to the directory, `description` in three parts, and `argument-hint`, dropped when the skill takes no argument. Any other field – `disable-model-invocation`, `context: fork`, `allowed-tools` – appears only when step 5 lands an answer that needs it. The section bodies are prompts for the next step, not content. `{arguments placeholder}` stands for a dollar sign followed by `ARGUMENTS`, the line Claude Code replaces with what the user typed; write it out, on its own line.

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

5. **Fill it in** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the skill being drafted at `{dir}/{name}/SKILL.md`". Give it this framing:
   - Each template prompt is an open decision: the description's three parts and its trigger phrases, the argument and its empty case, each step, each rule. The name is settled. A frontmatter field beyond the three is a decision only when a step needs it: `disable-model-invocation` for side effects a stray mention must not trigger, `context: fork` for work that should not share the caller's context.
   - The codebase, `CLAUDE.md` and the skills under `{dir}` count as explorable; a question they answer is never asked.
   - Edit `SKILL.md` as answers land, and record a deferred decision as a `TODO:` marker in its section. Another skill is named the way it is invoked: `{plugin}:{name}` for a plugin skill, the bare name for a sibling under `{dir}`.
   - The skill stays one file. No `scripts/`, `references/` or other supporting files.
6. **Validate.** Run `claude plugin validate {dir} --strict` and fix what it reports before going on. It reads `.claude/skills/` as it reads `skills/`, and it tolerates unknown frontmatter keys, so step 4's three fields plus what an answer needed is the whole list.
7. **README row.** In a plugin repo whose `README.md` holds a table with rows linking `skills/*/SKILL.md`, add a row for the new skill in alphabetical position, its text the description's first sentence. No table, no row. Outside a plugin repo, skip this step.
8. **Report.** The path; the row, when one was added; the validation result; in a plugin repo, that `.claude-plugin/plugin.json` is at its current version and owes a bump the commit that lands the skill should make, never made here; and how to load the skill: `/reload-plugins` for a project skill, `claude --plugin-dir .` or `/reload-plugins` for a plugin clone registered as a local marketplace. Leave everything unstaged and suggest `jodysalt:commit` (a `feat:` commit).

## Rules

- Never overwrite or edit an existing skill; a path that exists stops the run before anything is written.
- `SKILL.md` only: no supporting files, and no personal `~/.claude/skills/` target.
- Never bumps the plugin version, never edits `README.md` beyond its skills table, never touches `CLAUDE.md`, never commits.
