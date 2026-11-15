---
name: refine-design
description: "Revisits one design under `designs/{name}/` beside the ticket at `docs/tickets/open/{slug}/` and improves it in place on a planning branch: reads its pages and the ticket, reports every placeholder and what the ticket implies the design lacks, serves the designs folder locally while it works, interviews the user one question at a time, edits the pages as answers land, adds a page when an answer needs one, and records the design under the ticket's `# Designs` with its verdict, `build` or `reject`, when it is reached."
argument-hint: "[design name, and 'verdict' to record it – defaults to the only design, else asks]"
disable-model-invocation: true
---

Invoke `jodysalt:playbook refine-design $ARGUMENTS` with the Skill tool.
