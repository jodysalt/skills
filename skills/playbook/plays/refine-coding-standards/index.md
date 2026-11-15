# Refine coding standards

Improve `docs/coding-standards.md` in place: explore, assess, interview, edit. Leave the result uncommitted. Works the same on the template `setup-skills` just wrote and on a standards file the code has drifted from.

## Scope

The arguments passed to the play.

If given, one or more standard headings matched case-insensitively against the file's `## ` headings; the findings and the interview cover only those standards. If empty, the whole file. If a heading matches none, list the headings and ask.

## Steps

1. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:playbook start-planning-session <description>`, the description being `coding-standards`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Explore before asking.** Read `CLAUDE.md`, `package.json` or the equivalent manifest, every linter and formatter config, `git log --oneline -30`, and source files sampled by `git log --format= --name-only | sort | uniq -c | sort -rn`, most-changed first; recommended answers come from these. Then read `docs/coding-standards.md`. If it doesn't exist, stop and point at `jodysalt:playbook setup-skills`; this skill fills the file in, it never creates it. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the standards, never redefining one in passing; a term the glossary lacks is used as the input uses it.
3. **Report findings before editing anything:**
   - The template's prompt paragraph still present, quoted here so this check reads no other skill: "One `## ` section per standard the review enforces: its rule in a sentence or two, then one idiomatic example from this repo's own code. Leave what a linter or formatter already catches to that tool."
   - A `## ` section missing its rule or its example.
   - A standard a linter or formatter config from step 2 already enforces.
   - A standard the code contradicts throughout.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:playbook grill-me`) with the subject "the coding standards at `docs/coding-standards.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then the candidate standards: a convention the code mostly follows but not always, and the idioms of any framework the manifest names. Each comes with its example lifted from a file that already follows it, citing that file, or, when no file does, a minimal example in the framework's idiom, said to be so. Never a rule a configured linter or formatter enforces.
   - The files explored in step 2 count as explorable; a question they answer is never asked.
   - Only an answer the user agrees to lands. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `docs/coding-standards.md` as answers land, keeping `# Coding standards` and one `## ` section of rule then example per standard.
5. Stop. Leave the edit uncommitted for review and suggest `jodysalt:playbook commit` (a `docs:` commit).

## Rules

- Edit `docs/coding-standards.md` and nothing else.
- Never invent a standard; ask, or leave a `TODO:` marker.
- Never create the file; a missing one is `jodysalt:playbook setup-skills`'s to write.
- Keep the `## `-per-standard shape: `add-tasks` switches the review on at the file's first `## ` heading, and the review names a breached standard by its heading.
