# Jody Salt's Skills

Agent skills for [Claude Code](https://code.claude.com/docs/en/overview), packaged as a plugin and distributed through this repo's own marketplace.

## Workflow

The skills run one spec-driven workflow: `docs/vision.md` sets direction and names its strategic bets, `docs/initiatives/` turns a bet into a focused push, `docs/tickets/` makes that concrete, and each ticket's `tasks.md` is the backlog an unattended loop implements. `setup-skills` creates that layout in a fresh repo and `refine-vision` fills `docs/vision.md` in; draft with `add-initiative` and `add-ticket`, break a ticket down with `add-tasks`, and run the loop with `complete-tasks`.

## Installation

```bash
claude plugin marketplace add jodysalt/skills
claude plugin install jodysalt@jodysalt
```

Skills are namespaced under the plugin name, so each one runs as `/jodysalt:<skill-name>`. To stay current, run `/plugin`, open **Marketplaces**, select `jodysalt` and choose **Enable auto-update**, or run `claude plugin marketplace update jodysalt` then `claude plugin update jodysalt@jodysalt`. To remove it, run `claude plugin uninstall jodysalt@jodysalt` then `claude plugin marketplace remove jodysalt`.

## Skills

| Skill | Description |
| --- | --- |
| [`add-initiative`](./skills/add-initiative/SKILL.md) | Drafts a new initiative at `docs/initiatives/open/{slug}.md`: a strategic push that bridges `docs/vision.md` to feature tickets. |
| [`add-tasks`](./skills/add-tasks/SKILL.md) | Appends self-contained task entries to a ticket's `tasks.md`, beside its `index.md`, ending the list with a full-suite gate. Append-only. |
| [`add-ticket`](./skills/add-ticket/SKILL.md) | Drafts a new ticket at `docs/tickets/open/{slug}/index.md`: one shippable change with a `type` (`feat | fix | refactor | chore | docs | test | spike`). A `feat` ticket must tag an initiative; a `spike` is research that ends in a recommendation in `findings.md` and may tag one. |
| [`add-worktree`](./skills/add-worktree/SKILL.md) | Creates a git worktree at `.claude/worktrees/<branch>`, usually named after an open ticket slug, branching from local `main` when needed. Never enters it; that is `enter-worktree`. |
| [`close-initiative`](./skills/close-initiative/SKILL.md) | Moves an initiative to `docs/initiatives/closed/`, rewrites path references, and retires its strategic bet from `vision.md` when no open initiative cites it. |
| [`close-ticket`](./skills/close-ticket/SKILL.md) | Moves a ticket, `tasks.md` included, to `docs/tickets/closed/` and rewrites every live path reference in its initiative, other tickets, and task entries. Leaves the move uncommitted. |
| [`commit`](./skills/commit/SKILL.md) | Creates one git commit in house style: conventional prefix, past-tense subject, bulleted body trimmed with the 80/20 principle, no AI attribution. Never pushes. |
| [`complete-task`](./skills/complete-task/SKILL.md) | Implements the first pending entry in a ticket's `tasks.md`, flips it to `done`, and commits via `commit`. Runs unattended. |
| [`complete-tasks`](./skills/complete-tasks/SKILL.md) | Runs the Ralph loop for one ticket: spawns a fresh `complete-task` worker per pending entry until none remain, stopping on the first failure. |
| [`enter-worktree`](./skills/enter-worktree/SKILL.md) | Switches the session into an existing worktree under `.claude/worktrees/`, from the main checkout or from another worktree. Never creates one. |
| [`exit-worktree`](./skills/exit-worktree/SKILL.md) | Returns the session from a worktree to the main checkout, leaving the worktree and its branch on disk. |
| [`grill-me`](./skills/grill-me/SKILL.md) | Interviews the user one question at a time, highest-leverage decisions first, with a recommended answer for each, and records the answers until a plan or design reaches shared understanding. |
| [`list-worktrees`](./skills/list-worktrees/SKILL.md) | Lists the main checkout and every worktree under `.claude/worktrees/` with its branch, marking the current one and any stale leftovers. Read-only. |
| [`merge-worktree`](./skills/merge-worktree/SKILL.md) | Fast-forwards a worktree's branch into local `main` after exiting the worktree, refusing a dirty checkout or a `main` that moved. Never pushes; leaves removal to `remove-worktrees`. |
| [`refine-initiative`](./skills/refine-initiative/SKILL.md) | Assesses an open initiative against its template, `vision.md`, and its tickets, then interviews the user through the gaps and edits it in place. |
| [`refine-ticket`](./skills/refine-ticket/SKILL.md) | Assesses an open ticket against its template and the current codebase, then interviews the user through the gaps and edits it in place. |
| [`refine-vision`](./skills/refine-vision/SKILL.md) | Reports what `docs/vision.md` is missing or an open initiative contradicts, then interviews the user through the gaps and edits it in place. |
| [`remove-worktrees`](./skills/remove-worktrees/SKILL.md) | Removes chosen worktrees under `.claude/worktrees/` and stale leftovers, with confirmation before any force removal or branch deletion. |
| [`setup-skills`](./skills/setup-skills/SKILL.md) | Creates the layout the other skills assume (`docs/vision.md` from a template, `docs/{initiatives,tickets}/{open,closed}/`, a CLAUDE.md pointer, a `.claude/worktrees/` ignore line and VS Code worktree settings), creating only what is missing. |
| [`show-worktree`](./skills/show-worktree/SKILL.md) | Reports the checkout the session is in: path, branch, main checkout or worktree, and whether it has uncommitted changes. Read-only. |
| [`squash-commits`](./skills/squash-commits/SKILL.md) | Squashes every commit on the current branch since it forked from `main` into one new commit, via `commit`. |
| [`start-planning-session`](./skills/start-planning-session/SKILL.md) | Creates a fresh `planning-<YYYY-MM-DD>` branch as a worktree via `add-worktree` and switches the session into it via `enter-worktree`, so planning docs are drafted there. Joins today's planning worktree when one already exists. |
| [`use-the-8020-principle`](./skills/use-the-8020-principle/SKILL.md) | Applies the 80/20 (Pareto) principle to whatever is in context, separating the vital few inputs that drive most of the result from the trivial many. Use to prioritise a list or decide what to focus on or cut. |
| [`wrap-up-ticket`](./skills/wrap-up-ticket/SKILL.md) | Guards a finished ticket's `tasks.md`, then runs `close-ticket` and `commit` in sequence, producing one `docs:` commit. |

## Local development

Register your clone as the marketplace instead of GitHub. Claude Code reads the plugin files in place, so edits take effect at the next session start, or immediately with `/reload-plugins`, with no version bump.

```bash
claude plugin marketplace add /path/to/skills
claude plugin install jodysalt@jodysalt
```

Both marketplaces are named `jodysalt`, so run `claude plugin marketplace remove jodysalt` before switching between them. To try the plugin in one session without registering anything, start Claude Code with `claude --plugin-dir /path/to/skills`. Before committing, run `claude plugin validate . --strict` for the manifest and `claude plugin validate skills --strict` for every skill's frontmatter.

## License

[MIT](./LICENSE)
