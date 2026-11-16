# Add skills plugin

Write the boilerplate that makes the host repo a skills plugin and hand off: the two manifests of a one-plugin marketplace under `.claude-plugin/`, the `playbook` router with an empty play index under `skills/playbook/`, and the skills table in `README.md`, then invoke `refine-skills-plugin` in the same session, which interviews and fills the descriptions in. It writes no play; the plugin's first play is `jodysalt:playbook add-skill`'s. Branch gate as `add-skill`'s: the plugin is source, and lands through a ticket or a planning branch.

## Plugin

The arguments passed to the play.

The plugin's name, `{plugin}`, normalized to kebab-case (`Acme Tools` becomes `acme-tools`); the marketplace takes the same name. If empty, ask once before anything is written, the recommended answer being the repo directory's name in kebab-case. `{owner}` is what `git config user.name` prints; when it prints nothing, ask for it in the same round.

## Steps

1. **Guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Stop before anything is written when `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` or `skills/playbook/` exists there, naming each one found and pointing at `jodysalt:playbook refine-skills-plugin`: one run under one name writes all three or none. Skills already under `skills/` or `.claude/skills/` do not stop the run; they are left where they are and named in the report.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:playbook start-planning-session add-skills-plugin`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Manifests.** Write the two files below. They are valid as written, so the plugin installs before the refine runs; the `TODO:` descriptions are prompts for `refine-skills-plugin`, and `repository` and `license` are its to add.

   `.claude-plugin/plugin.json`:

   ```json
   {
     "name": "{plugin}",
     "version": "0.1.0",
     "description": "TODO: one sentence on what these skills are for.",
     "author": {
       "name": "{owner}"
     }
   }
   ```

   `.claude-plugin/marketplace.json`:

   ```json
   {
     "name": "{plugin}",
     "owner": {
       "name": "{owner}"
     },
     "description": "TODO: one sentence on what these skills are for.",
     "plugins": [
       {
         "name": "{plugin}",
         "source": "./",
         "description": "TODO: one sentence on what these skills are for."
       }
     ]
   }
   ```

4. **Router.** Read `SKILL.md` from the `playbook` skill's own base directory, two levels above this play, and write it to `skills/playbook/SKILL.md` with two changes: every `jodysalt` becomes `{plugin}`, and the `description:` line keeps its lead sentence through `Plays – ` and ends there with a full stop, the play index empty. The router is copied from the live one on every run, never from a template, so a new plugin starts with the current router. Create `skills/playbook/plays/` holding an empty `.gitkeep`.
5. **`README.md`.** Skip if the file holds a table whose rows link `skills/playbook/plays/*/index.md`, or a line equal to `## Skills`. If the file is missing, create it holding exactly the block below. Otherwise append the block after one blank line (add a newline first when the file doesn't end with one) and leave every existing line as it was. `refine-skill` adds a play's row only to a table that exists, so without this one no play is ever listed. The install instructions are `refine-skills-plugin`'s. The block:

   ```markdown
   ## Skills

   | Skill | Description |
   | --- | --- |
   ```

6. **Hand off.** Invoke `jodysalt:playbook refine-skills-plugin` in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the plugin is `{plugin}`; this is a fresh boilerplate". The interview, the install instructions and the validation are its.
7. **Report.** Before the hand-off's own report, in the turn that invokes it: each path written; the skills found under `skills/` or `.claude/skills/` and left in place; that `claude --plugin-dir .` tries the plugin in one session; and that `jodysalt:playbook add-skill` writes its first play. Say that everything is uncommitted, suggest `jodysalt:playbook commit`, and say that `refine-skills-plugin`'s report follows.

## Rules

- Runs only on the user's direct request, by name or by its trigger. No other play invokes it or offers it, and an unattended run never starts it.
- Never overwrites: a path that exists stops the run before anything is written. `README.md` gains its one block at the end or nothing at all.
- Never writes a play or a helper, and never moves or converts an existing skill.
- Never touches `CLAUDE.md`, `.gitignore` or `docs/`. Never runs `git init`, never stages, commits or pushes.
