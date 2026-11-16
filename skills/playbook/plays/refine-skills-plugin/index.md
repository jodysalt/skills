# Refine skills plugin

Improve the skills plugin that exists in place: read its two manifests under `.claude-plugin/` and its `README.md`, report what is unfilled or out of step, interview, edit, validate. Leave the result uncommitted. Works the same on the boilerplate `add-skills-plugin` just wrote and on a plugin whose manifests have drifted. It never creates the plugin; missing manifests are `jodysalt:playbook add-skills-plugin`'s, and a play is `jodysalt:playbook refine-skill`'s. Takes no argument: a repo holds one plugin.

## Steps

1. **Guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `.claude-plugin/plugin.json` or `.claude-plugin/marketplace.json` is missing there, stop and point at `jodysalt:playbook add-skills-plugin`; nothing is written. Otherwise read both. `{plugin}` is the `name` in `.claude-plugin/plugin.json`.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything and `docs/tickets/open/<branch>/` does not exist, offer to invoke `jodysalt:playbook start-planning-session refine-skills-plugin`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Report findings before editing anything**, each named by the file and field it is about: a `description` still holding `TODO:`; a `name`, a `description` or an owner the two manifests disagree on; a `repository` missing from `.claude-plugin/plugin.json` when `git remote get-url origin` prints one; a `license` missing when a `LICENSE` file sits at the root; a `README.md` with no `## Installation` section, or one whose commands name another marketplace or plugin.
4. **Interview** by invoking `jodysalt:playbook grill-me` with the subject "the skills plugin's manifests at `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`", seeded with the findings. Only an answer the user agrees to lands, and a description lands in all three places it is written in the same answer, so the manifests never disagree.
5. **Installation.** When `git remote get-url origin` gives a GitHub `{owner}/{repo}` and the user agreed in the interview, write the `## Installation` section of `README.md`, before `## Skills` when that heading exists and at the end otherwise, creating the file when missing: the two commands `claude plugin marketplace add {owner}/{repo}` and `claude plugin install {plugin}@{plugin}` in one `bash` block. With no such remote, write nothing and say in the report that the section waits on one.
6. **Validate.** Run `claude plugin validate . --strict` from the root and fix what it reports in the manifests before going on.
7. **Report.** What changed, file by file and field by field; the findings the user declined, still standing; the validation result; that `.claude-plugin/plugin.json` is at its current version and owes a bump in the commit that lands a change to a play's behaviour, never made here. Leave everything unstaged and suggest `jodysalt:playbook commit` (a `chore:` commit).

## Rules

- Edits the two manifests and the `## Installation` section of `README.md`, and nothing else: never the router, a play, a helper or the skills table.
- Never creates the plugin, never bumps the version, never renames the plugin or the marketplace: a rename breaks every install, so a `name` the manifests disagree on is reported and asked about, never settled silently.
- A change needs the user's yes. Never invent a description; ask, or leave the `TODO:`.
- Never stages, commits or pushes.
