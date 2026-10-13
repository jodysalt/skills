# Tasks

## Rewrite the body of `skills/deliver-brief/SKILL.md` as guard, scaffold, brief-or-resume, draft, implement, land and report, dropping the scout, judge, pick path, planning sessions, ticket cap, cursor and merge sweep
- **category:** functional
- **status:** done
- **steps:**
  - Rewrite from `docs/tickets/closed/deliver-brief-in-slices/index.md` `# Scope` rather than trimming the old body; keep the `## Stage prompt` template and the root's answering order (brief, then `docs/vision.md`, then the stage's recommendation, answers sent with `SendMessage` to the same sub-agent) verbatim where they still apply. Leave the frontmatter `description:` for the next task.
  - Steps, in order: **Guard** (from the main checkout: `git rev-parse --show-toplevel` is the first path in `git worktree list`, a branch checked out, `git status --porcelain` empty; no repository is not a failure). **Scaffold** on the base with no planning session: no repo or no commit → `git init -b main` when needed, `jodysalt:setup-skills`, one `chore:` commit of everything; repo without `docs/vision.md` → `setup-skills` and a `chore:` commit; a vision still holding a template prompt (found with `grep -F` against the prompts `skills/setup-skills/SKILL.md` writes — read them there now and inline them) → a `refine-vision` stage with the brief quoted and a goal for the brief, then a `docs:` commit. **Brief or resume**: no brief → `ls -d docs/tickets/open/*/` must hold exactly one slug without `--`, else stop listing them; continue at Implement. **Draft**: an `add-ticket` stage on the base with the brief, the root declining the planning-session offer, then `jodysalt:commit` staging `docs/tickets/open/{slug}` as `docs:` with the root's answers in the body; a stop at the goal gate ends the run, and the root never adds a goal to a filled vision. **Implement**: `jodysalt:add-worktree {slug}` when missing, `jodysalt:enter-worktree {slug}`, then a `complete-ticket` stage with the slug; a stop in its report ends the run after `jodysalt:exit-worktree`, worktree left on disk. **Land**: `jodysalt:wrap-up-worktree {slug}`; a refused fast-forward ends the run. **Report** as the ticket's Scope says, including the stop shape.
  - `## Caps` keeps only the 3-round cap. The fast-forward-only rule in `## Rules` / `## Stages and the root` gains its one exception: the run's docs and scaffold commits on the base.
  - `grep -n "scout\|judge\|ticket cap\|planning" skills/deliver-brief/SKILL.md` prints only the line that declines `add-ticket`'s planning-session offer; `claude plugin validate skills --strict` passes.

## Rewrite the `description:` of `skills/deliver-brief/SKILL.md` and its `README.md` row for the shrunk chain
- **category:** chore
- **status:** done
- **steps:**
  - Rewrite the frontmatter `description:` to say it scaffolds when missing, drafts one ticket with `add-ticket`, commits it on the base, implements it with `complete-ticket` (which slices and resumes) and lands it with `wrap-up-worktree`, playing the user from the brief; with no brief it resumes the one open ticket. Keep its trigger phrases ("deliver this brief", "deliver a brief", "build X from this brief", `/deliver-brief`) and its "Never pushes" clause; drop mentions of judging, sub-tickets grown by the skill, and planning.
  - Make the `deliver-brief` row in `README.md` match the description's lead sentence.
  - `grep -n "deliver-brief" README.md` shows the updated row; `claude plugin validate skills --strict` passes.
- **notes:**
  - The body is clean of `scout|judge|ticket cap|planning` except the Draft step (line 70); the current `description:` still matches via "judges", so the new one must avoid "judge" for the ticket's grep criterion to hold.
  - The body's lead sentence ("Run the chain a person runs, from a brief to a base branch ready for review: scaffold …, draft …, commit …, implement …, land …") is a ready phrasing to mirror.

## Bump `.claude-plugin/plugin.json` version to `0.13.0`
- **category:** chore
- **status:** done
- **steps:**
  - Set `"version"` in `.claude-plugin/plugin.json` from `0.12.0` to `0.13.0`.
  - `grep -n '"version": "0.13.0"' .claude-plugin/plugin.json` prints one line.

## Run full test suite for deliver-brief-in-slices
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warning about `CLAUDE.md`.
