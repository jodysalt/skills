## Workflow

This repo runs the `jodysalt` plugin's spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, and each ticket's `tasks.md` is the backlog an unattended loop implements. Draft with `/jodysalt:add-ticket`, break a ticket down with `/jodysalt:add-tasks`, and run the loop with `/jodysalt:complete-tasks`.
