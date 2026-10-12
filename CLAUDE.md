## Workflow

This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, then implement it with `/jodysalt:complete-ticket`, which breaks the ticket into tasks on its own branch just before running the loop.
