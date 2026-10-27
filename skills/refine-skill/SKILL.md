---
name: refine-skill
description: Revisits an existing Claude Code skill at `skills/{name}/SKILL.md` when the repo root holds `.claude-plugin/plugin.json`, else at `.claude/skills/{name}/SKILL.md`, and improves it in place – reads the skills it names and the skills naming it, reports what can be removed before what is missing or out of step, then interviews the user one question at a time and edits as answers land; an `add-{foo}` and its `refine-{foo}` are refined together. Use when the user says "refine the X skill", "the X skill should Y", "tidy up the X skill", or runs `/refine-skill`. In a plugin repo it keeps the README row in step and runs `claude plugin validate` strictly, and reports that the version owes a bump without making it. Never creates a skill, never commits.
argument-hint: "[skill name, or an add-foo refine-foo pair, e.g. 'add-ticket' or 'add-deploy-config refine-deploy-config']"
---

# Refine skill

Improve one existing skill, or an `add-{foo}` `refine-{foo}` pair, in place: explore, report what can go before what is missing, interview, edit. Leave the result uncommitted. Works the same on the boilerplate `add-skill` just wrote and on a skill that has drifted from the skills around it. It never creates a skill; a path that is missing is `jodysalt:add-skill`'s.

## Skill

$ARGUMENTS

One skill name, or two names forming a pair, `add-{foo} refine-{foo}`, refined together in one interview, since a hand-off has two ends. If empty, `ls {dir}` and ask which, one option per skill.

## Steps

1. **Target and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. When the root holds `.claude-plugin/plugin.json`, `{dir}` is `skills` and a skill runs as `/{plugin}:{name}`, `{plugin}` being the manifest's `name`; otherwise `{dir}` is `.claude/skills` and it runs as `/{name}`. If `{dir}/{name}/SKILL.md` is missing for a name given, stop and point at `jodysalt:add-skill`; nothing is written.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:start-planning-session {name}`, the first name given; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Explore before asking.** Read the skill, `CLAUDE.md`, `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, the *Product principles* of `docs/vision.md` when it exists, every skill the skill names and every skill naming it (`grep -l '{name}' {dir}/*/SKILL.md`), the skill's row in `README.md` when a table there links `skills/*/SKILL.md`, and `start-planning-session`'s description when the skill holds a branch gate. Recommended answers come from these, and each defined term is used in its defined sense, never redefined in passing; a term the glossary lacks is used as the skill uses it.
4. **Report findings before editing anything**, removals first, each named by the step, rule or line it is about:
   - What can go: a step or rule restating what a skill it invokes already does; a rule no step needs; a sentence repeating the lead; a frontmatter field no step needs; a template prompt or `TODO:` still standing.
   - The frontmatter: a description not in its three parts – what it does and where it writes, the "Use when" phrases with `/{name}`, what it never does; a `name` not equal to the directory; an `argument-hint` with no argument section, or the reverse.
   - The pair and the partners: an `add-{foo}` whose steps do not end by handing off to `refine-{foo}`, or that fills in, validates or reports what the refine should; a `refine-{foo}` with no `add-{foo}`, or the reverse; and each partner the skill implies that `{dir}` lacks – `remove-{foo}` for an `add-{foo}`, and whatever else its job implies – named as a suggestion for `jodysalt:add-skill`, never drafted here.
   - Callers out of step: a hand-off worded differently at its two ends; `start-planning-session`'s description missing this skill when it gates; a `README.md` row that is not the description's first sentence.
   - A term used in a sense the glossary does not define.
5. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the skill at `{dir}/{name}/SKILL.md`", both paths for a pair. Give it this framing:
   - Seed the decision tree with the findings from step 4, removals asked before additions, then add the decisions the skill makes without saying so.
   - The codebase, `CLAUDE.md` and the skills under `{dir}` count as explorable; a question they answer is never asked.
   - Only an answer the user agrees to lands, a removal like an addition. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `SKILL.md` as answers land; when a hand-off changes, edit the pair's other file in the same answer, so its two ends never disagree. Another skill is named the way it is invoked: `{plugin}:{name}` for a plugin skill, the bare name for a sibling under `{dir}`. A frontmatter field beyond `name`, `description` and `argument-hint` appears only when a step needs it: `disable-model-invocation` for side effects a stray mention must not trigger, `context: fork` for work that should not share the caller's context. The skill stays one file. Anything in a skill outside the pair is surfaced for a `refine-skill` run on it.
6. **Validate.** Run `claude plugin validate {dir} --strict` and fix what it reports before going on. It reads `.claude/skills/` as it reads `skills/`, and it tolerates unknown frontmatter keys.
7. **README row.** In a plugin repo whose `README.md` holds a table with rows linking `skills/*/SKILL.md`, sync the skill's row outright: add it in alphabetical position when missing, and rewrite its text to the description's first sentence when they differ. No table, no row. Outside a plugin repo, skip this step.
8. **Report.** What was removed and what was added, step by step; the partners step 4 suggested; the validation result; the row, when one was added or rewritten; in a plugin repo, that `.claude-plugin/plugin.json` is at its current version and owes a bump the commit that lands the change should make, never made here; and how to reload the skill: `/reload-plugins` for a project skill, `claude --plugin-dir .` or `/reload-plugins` for a plugin clone registered as a local marketplace. Leave everything unstaged and suggest `jodysalt:commit` (a `feat:` commit when the skill's behaviour changed, `refactor:` when only its wording did).

## Rules

- Edits the named skill or pair and its `README.md` row, and nothing else: never creates a skill, never bumps the plugin version, never touches `CLAUDE.md`, never commits.
- A removal needs the user's yes like an addition. Never invent content; ask, or leave a `TODO:` marker.
- `SKILL.md` only: no supporting files, and no personal `~/.claude/skills/` target.
