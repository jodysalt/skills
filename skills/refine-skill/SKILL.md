---
name: refine-skill
description: Revisits an existing Claude Code skill, the play `skills/playbook/plays/{name}/index.md` behind its helper in a playbook repo, `skills/{name}/SKILL.md` in any other repo whose root holds `.claude-plugin/plugin.json`, else `.claude/skills/{name}/SKILL.md`, and improves it in place.
argument-hint: "[skill name, or an add-foo refine-foo pair, e.g. 'add-ticket' or 'add-deploy-config refine-deploy-config']"
disable-model-invocation: true
---

Invoke `jodysalt:playbook refine-skill $ARGUMENTS` with the Skill tool.
