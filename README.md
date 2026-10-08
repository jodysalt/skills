# Jody Salt's Skills

Agent skills for [Claude Code](https://code.claude.com/docs/en/overview), packaged as a plugin and distributed through this repo's own marketplace.

## Workflow

The skills run one spec-driven workflow: `docs/vision.md` sets direction with its goals and principles, `docs/tickets/` slices a goal into tickets and any ticket into `{slug}--{sub}` sub-tickets, `docs/coding-standards.md` holds the standards each ticket's branch is reviewed against, and each ticket's `tasks.md` is the backlog an unattended loop implements. `setup-skills` creates that layout in a fresh repo and `refine-vision` fills `docs/vision.md` in; draft with `add-ticket`, break a ticket down with `add-tasks`, and run the loop with `complete-tasks`.

## Installation

```bash
claude plugin marketplace add jodysalt/skills
claude plugin install jodysalt@jodysalt
```

Skills are namespaced under the plugin name, so each one runs as `/jodysalt:<skill-name>`. To stay current, run `/plugin`, open **Marketplaces**, select `jodysalt` and choose **Enable auto-update**, or run `claude plugin marketplace update jodysalt` then `claude plugin update jodysalt@jodysalt`. To remove it, run `claude plugin uninstall jodysalt@jodysalt` then `claude plugin marketplace remove jodysalt`.

## Skills

| Skill | Description |
| --- | --- |
| [`add-skill`](./skills/add-skill/SKILL.md) | Drafts a new Claude Code skill at `skills/{name}/SKILL.md` in a plugin repo, else at `.claude/skills/{name}/SKILL.md`, in house style and filled in through `grill-me`. Adds the README row and validates strictly in a plugin repo; reports the owed version bump without making it. Never overwrites an existing skill. |
| [`add-tasks`](./skills/add-tasks/SKILL.md) | Appends self-contained task entries to a ticket's `tasks.md`, beside its `index.md`, ending the list with a full-suite gate and, where the repo holds `docs/coding-standards.md` with a standard in it, a review task that appends refactor tasks for breaches. Append-only. |
| [`add-ticket`](./skills/add-ticket/SKILL.md) | Drafts a new ticket spec at `docs/tickets/open/{slug}/index.md` – one shippable change with a `type` (feat \| fix \| refactor \| chore \| docs \| test \| spike). Use when the user says "add a ticket for X", "create a ticket", "draft a ticket", "spec out Y", "add a fix/chore/refactor for Z", or runs `/add-ticket`. A `feat` ticket names the goal in `docs/vision.md` it delivers with `delivers:` or stands on a principle; any ticket breaks into `{slug}--{sub}` sub-tickets of any type. A `spike` is research ending in a recommendation in `findings.md`. Never touches source code or `vision.md`. |
| [`add-worktree`](./skills/add-worktree/SKILL.md) | Creates a git worktree at `.claude/worktrees/<branch>`, usually named after an open ticket slug, branching from whatever the main checkout has checked out when needed. Never enters it; that is `enter-worktree`. |
| [`close-ticket`](./skills/close-ticket/SKILL.md) | Closes a ticket by moving `docs/tickets/open/{slug}/` to `docs/tickets/closed/{slug}/`, its `tasks.md` included, and rewriting every live path reference to it in other ticket bodies and task entries. Refuses while a task in its `tasks.md` is not done or a `{slug}--{sub}` sub-ticket is open. |
| [`commit`](./skills/commit/SKILL.md) | Creates one git commit in house style: conventional prefix, past-tense subject, bulleted body trimmed with the 80/20 principle, no AI attribution. Never pushes. |
| [`complete-task`](./skills/complete-task/SKILL.md) | Implements the first pending entry in a ticket's `tasks.md`, flips it to `done`, commits via `commit`, and leaves handover notes on the later tasks that need what it learned. Runs unattended. |
| [`complete-tasks`](./skills/complete-tasks/SKILL.md) | Runs the Ralph loop for one ticket: spawns a fresh `complete-task` worker per pending entry until none remain, stopping on the first failure. |
| [`deliver-brief`](./skills/deliver-brief/SKILL.md) | Runs the whole chain from a brief to a branch ready for review – the one the main checkout has checked out, local `main` in the usual case – with no human turn: scaffolds the layout, fills `docs/vision.md`, drafts one ticket for the brief, breaks it down, runs the loop, judges it against its acceptance criteria and grows it by `{slug}--{sub}` sub-tickets until they are met, closing what it finished and playing the user at every question. With no brief, resumes the one open ticket from the docs in the main checkout. |
| [`enter-worktree`](./skills/enter-worktree/SKILL.md) | Switches the session into an existing worktree under `.claude/worktrees/`, from the main checkout or from another worktree. Never creates one. |
| [`exit-worktree`](./skills/exit-worktree/SKILL.md) | Returns the session from a worktree to the main checkout, leaving the worktree and its branch on disk. |
| [`grill-me`](./skills/grill-me/SKILL.md) | Interviews the user one question at a time, highest-leverage decisions first, with a recommended answer for each, and records the answers until a plan or design reaches shared understanding. |
| [`list-worktrees`](./skills/list-worktrees/SKILL.md) | Lists the main checkout and every worktree under `.claude/worktrees/` with its branch, marking the current one and any stale leftovers. Read-only. |
| [`merge-worktree`](./skills/merge-worktree/SKILL.md) | Fast-forwards a worktree's branch into the branch the main checkout has checked out, local `main` in the usual case, after exiting the worktree, refusing a dirty checkout or a base that moved. Never pushes; leaves removal to `remove-worktree`. |
| [`refine-coding-standards`](./skills/refine-coding-standards/SKILL.md) | Revisits `docs/coding-standards.md` and improves it in place – explores the repo, reports which sections still hold the template's prompt, lack a rule or an example, restate a rule a linter already enforces or contradict the code, then interviews the user one question at a time and edits as answers land. |
| [`refine-ticket`](./skills/refine-ticket/SKILL.md) | Revisits an existing open ticket at `docs/tickets/open/{slug}/index.md` and improves it in place – assesses it against the ticket template, verifies its code references against the current codebase, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the X ticket", "revisit X", "flesh out the X ticket", "update the spec for X", or runs `/refine-ticket`. Edits an open ticket in place and makes the small related edits its answers settle – a spike's missing `findings.md`, a `delivers:` retag – without a second question; never moves, closes, or deletes docs, never touches source code, never commits. |
| [`refine-vision`](./skills/refine-vision/SKILL.md) | Revisits `docs/vision.md` and improves it in place – explores the repo, reports which sections are missing or still hold the scaffold's template prompt and what an open ticket cites or contradicts, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the vision", "revisit the vision", "flesh out the vision", "fill in the vision", or runs `/refine-vision`. Edits `docs/vision.md` in place and, when a goal is renamed, the `delivers:` tag in each open ticket's frontmatter with it, keeping open tickets' goal citations in step; never invents content, never rewrites a ticket beyond that tag, never commits. |
| [`remove-worktree`](./skills/remove-worktree/SKILL.md) | Removes one worktree under `.claude/worktrees/` and deletes its branch with the safe `git branch -d` when merged, keeping an unmerged one. Refuses a dirty worktree and never forces. |
| [`remove-worktrees`](./skills/remove-worktrees/SKILL.md) | Removes picked worktrees under `.claude/worktrees/` through `remove-worktree`, skipping a dirty one, and prunes stale leftovers. |
| [`setup-skills`](./skills/setup-skills/SKILL.md) | Scaffolds the layout the other skills in this plugin assume exists – `docs/vision.md` from a template, `docs/coding-standards.md` from a template, `docs/tickets/{open,closed}/` each holding `.gitkeep`, a `## Workflow` section in `CLAUDE.md`, a `.claude/worktrees/` line in `.gitignore`, and a `.vscode/settings.json` that makes VS Code detect the worktrees – from the repo root. Creates only what is missing and never overwrites an existing file; never runs `git init`, never stages, never commits. |
| [`show-worktree`](./skills/show-worktree/SKILL.md) | Reports the checkout the session is in: path, branch, main checkout or worktree, and whether it has uncommitted changes. Read-only. |
| [`squash-commits`](./skills/squash-commits/SKILL.md) | Squashes every commit on the current branch since it forked from its base branch, the main checkout's branch unless named, into one new commit, via `commit`. |
| [`start-planning-session`](./skills/start-planning-session/SKILL.md) | Creates a fresh `planning-<YYYY-MM-DD>` branch as a worktree via `add-worktree` and switches the session into it via `enter-worktree`, so planning docs are drafted there. Joins today's planning worktree when one already exists. |
| [`wrap-up-worktree`](./skills/wrap-up-worktree/SKILL.md) | Lands a finished `.claude/worktrees/<name>` worktree on the branch the main checkout has checked out, local `main` in the usual case, in one command – squashes the branch to one commit, merges it fast-forward only, then removes the worktree and its branch; on a ticket branch with no open sub-ticket it closes the ticket and commits the close first, and on one with an open sub-ticket it lands the branch and leaves the ticket open. Refuses on a dirty checkout, a base branch that moved, or a pending task, before anything changes. |

## Local development

Register your clone as the marketplace instead of GitHub. Claude Code reads the plugin files in place, so edits take effect at the next session start, or immediately with `/reload-plugins`, with no version bump.

```bash
claude plugin marketplace add /path/to/skills
claude plugin install jodysalt@jodysalt
```

Both marketplaces are named `jodysalt`, so run `claude plugin marketplace remove jodysalt` before switching between them. To try the plugin in one session without registering anything, start Claude Code with `claude --plugin-dir /path/to/skills`. Before committing, run `claude plugin validate .` for the manifest and `claude plugin validate skills --strict` for every skill's frontmatter. The root run skips `--strict` because it turns the warning about `CLAUDE.md` at the plugin root into a failure, and that file is this repo's project context rather than plugin content.

## License

[MIT](./LICENSE)
