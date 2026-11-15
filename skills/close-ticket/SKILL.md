---
name: close-ticket
description: Closes a ticket by moving `docs/tickets/open/{slug}/` to `docs/tickets/closed/{slug}/`, its `tasks.md` included, and rewriting every live path reference to it in other ticket bodies and task entries.
argument-hint: "[ticket slug – defaults to the current branch's ticket or the only open ticket]"
disable-model-invocation: true
---

Invoke `jodysalt:playbook close-ticket $ARGUMENTS` with the Skill tool.
