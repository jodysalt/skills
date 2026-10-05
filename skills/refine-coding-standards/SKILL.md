---
name: refine-coding-standards
description: Revisits `docs/coding-standards.md` and improves it in place – explores the repo, reports which sections still hold the template's prompt, lack a rule or an example, restate a rule a linter already enforces or contradict the code, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the coding standards", "write the coding standards", "fill in the coding standards", or runs `/refine-coding-standards`. Edits `docs/coding-standards.md` in place only and never creates it; never invents a standard, never recommends what a linter or formatter already enforces, never commits.
argument-hint: "[standard headings to revisit, e.g. 'error handling' – defaults to the whole file]"
---

# Refine coding standards

Improve `docs/coding-standards.md` in place: explore, assess, interview, edit. Leave the result uncommitted. Works the same on the template `setup-skills` just wrote and on a standards file the code has drifted from.

## Scope

$ARGUMENTS

If given, one or more standard headings matched case-insensitively against the file's `## ` headings; the findings and the interview cover only those standards. If empty, the whole file. If a heading matches none, list the headings and ask.

## Steps

1. **Branch gate.** If the current branch is not `planning-<YYYY-MM-DD>` (optionally `-<N>`), offer to invoke `jodysalt:start-planning-session`. Continue on the current branch if the user declines. Skip if the gate already ran this conversation.
2. **Explore before asking.** Read `CLAUDE.md`, `package.json` or the equivalent manifest, every linter and formatter config, `git log --oneline -30`, and source files sampled by `git log --format= --name-only | sort | uniq -c | sort -rn`, most-changed first; recommended answers come from these. Then read `docs/coding-standards.md`. If it doesn't exist, stop and point at `jodysalt:setup-skills`; this skill fills the file in, it never creates it.
3. **Report findings before editing anything:**
   - The template's prompt paragraph still present, quoted here so this check reads no other skill: "One `## ` section per standard the review enforces: its rule in a sentence or two, then one idiomatic example from this repo's own code. Leave what a linter or formatter already catches to that tool."
   - A `## ` section missing its rule or its example.
   - A standard a linter or formatter config from step 2 already enforces.
   - A standard the code contradicts throughout.
4. **Interview** by invoking the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the coding standards at `docs/coding-standards.md`". Give it this framing:
   - Seed the decision tree with the findings from step 3, then the candidate standards: a convention the code mostly follows but not always, and the idioms of any framework the manifest names. Each comes with its example lifted from a file that already follows it, citing that file, or, when no file does, a minimal example in the framework's idiom, said to be so. Never a rule a configured linter or formatter enforces.
   - The files explored in step 2 count as explorable; a question they answer is never asked.
   - Only an answer the user agrees to lands. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `docs/coding-standards.md` as answers land, keeping `# Coding standards` and one `## ` section of rule then example per standard.
5. Stop. Leave the edit uncommitted for review and suggest `jodysalt:commit` (a `docs:` commit).

## Rules

- Edit `docs/coding-standards.md` and nothing else.
- Never invent a standard; ask, or leave a `TODO:` marker.
- Never create the file; a missing one is `jodysalt:setup-skills`'s to write.
- Keep the `## `-per-standard shape: `add-tasks` switches the review on at the file's first `## ` heading, and the review names a breached standard by its heading.
