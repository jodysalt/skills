---
name: add-skill
description: Writes the boilerplate of a new Claude Code skill as the play `skills/playbook/plays/{name}/index.md` behind its helper in a playbook repo, at `skills/{name}/SKILL.md` in any other repo whose root holds `.claude-plugin/plugin.json`, else at `.claude/skills/{name}/SKILL.md`.
argument-hint: "[what the skill does, e.g. 'runs the migrations and reports the result']"
disable-model-invocation: true
---

Invoke `jodysalt:playbook add-skill $ARGUMENTS` with the Skill tool.
