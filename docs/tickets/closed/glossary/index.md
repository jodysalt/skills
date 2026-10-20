---
title: Glossary
type: feat
priority: high
---

# Goal
Every stakeholder in a repo, person or agent, reads and writes its specs in one vocabulary. A `docs/glossary.md` holds the project's terms with precise definitions. When a person is driving an interview, `grill-me` notices a term used ambiguously, asks what it means and records the answer there, so the definition outlives the conversation. Every skill that writes a spec, a backlog or a commit, or implements from one, reads the glossary first and uses each term in its defined sense, so a ticket, its tasks and its implementation stop drifting on language.

# Context
- `grill-me` (plugin `0.13.1`) maps a subject's open decisions, ranks them with the 80/20 principle, asks one at a time with a recommendation and records each answer as it lands. Its rule *the caller's framing decides who answers* already distinguishes a run a person drives from one a caller declares unattended: the recommended answer stands for the trivial many and the vital few go back to the caller. `deliver-brief` stages and the `add-ticket` sub-agent in `complete-ticket-slice` declare their runs unattended this way. Nothing detects a human, and the vision's *Driver-agnostic* principle says nothing should.
- Every interview skill (`add-ticket`, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill`) fills its file by invoking `grill-me`, so a step added there reaches all of them.
- The repo's two doc precedents: `docs/coding-standards.md` holds one `## ` section per standard, and `setup-skills` scaffolds it from a template whose paragraph is the prompt; `refine-coding-standards` edits it in place and never creates it. `docs/vision.md` lists names as `- **Name.** sentence` bullets. `add-tasks` dedups task entries on their H2 heading.
- Skills that write project prose or implement from it each have a Read step: `add-ticket` step 4, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill` step 2, `add-tasks` step 1, `complete-task`, `complete-ticket-slice` (its judge and pick), `commit`. The git and worktree skills, `close-ticket` and the orchestrators (`complete-ticket`, `complete-tasks`, `deliver-brief`) write no project prose of their own.
- The workflow sentence lives in three places: `setup-skills` step 4, this repo's `CLAUDE.md` and the `README.md` Workflow paragraph. `README.md` holds one row per skill matching its description. `claude plugin validate skills --strict` gates the frontmatter. `plugin.json` is `0.13.1` and bumps on any change to a skill's behaviour.
- The vision keeps interview skills eval-free; a person reads every turn.

# Scope

In:
- **Driver gate reuses the unattended-caller rule.** No new detection of a human. A `grill-me` run its caller has not declared unattended asks about ambiguous terms and writes the glossary. A run declared unattended (`deliver-brief` stages, the `add-ticket` sub-agent in `complete-ticket-slice`) reads the glossary, never writes it, and returns each term it cannot resolve to its caller as a vital-few question with options and a recommendation, by the rule `grill-me` already holds.
- **Glossary-writing is a step inside `grill-me`**, so every skill that interviews through it (`add-ticket`, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill`) inherits it. No new skill.
- **Terms are decisions in the tree.** `grill-me` step 1 reads `docs/glossary.md`, then adds each ambiguous term as an open decision: a term the subject or conversation uses in more than one plausible sense, uses differently from the glossary, or that the repo already uses two ways. Step 2 ranks it like any other decision, so a term the subject hangs on is asked before the questions that use it and a cosmetic one lands in the batched tail. The question follows the usual shape: the term, the senses in play, a recommended definition. The definition is written to the glossary as the answer lands, so the file never lags the conversation, and the decision log names each term defined.
- **Conflicts are asked, never ruled.** When the glossary defines a term and the subject uses it in another sense, one question offers both senses: *keep* rewords the subject to the glossary sense; *redefine* rewrites the entry and the close names every other doc under `docs/` that uses the old sense (`grep -rli`), left untouched for the user. A silent third definition is never written.
- **Scaffolding.** `setup-skills` gains a step that writes `docs/glossary.md` from the template when missing, so rerunning it is the migration for a repo that adopted earlier. `grill-me` also writes the template on its first definition when the file is missing, so an adopter's first interview is never blocked. Consumers treat a missing or template-only file as an empty glossary.
- **Consumers.** Every skill that writes project prose or implements from it reads `docs/glossary.md` in its Read step, before producing output: `add-ticket`, `refine-ticket`, `refine-vision`, `refine-coding-standards`, `add-skill`, `grill-me`, `add-tasks`, `complete-task`, `complete-ticket-slice` (its judge and pick) and `commit`. Consuming means using a defined term in its defined sense in everything written and never redefining one in passing; a term the glossary lacks is used as the input uses it. A missing or empty glossary is an empty glossary, never an error.
- **Per-repo glossary.** The template ships with no terms. A repo's glossary holds that repo's vocabulary; this repo dogfoods its own, defining the workflow's terms as its interviews meet them.
- **Steering.** The workflow sentence in `setup-skills` step 4, this repo's `CLAUDE.md` and `README.md` gains a clause naming `docs/glossary.md` as the shared vocabulary every skill reads. The descriptions and README rows of `grill-me` and `setup-skills` follow.
- `plugin.json` to `0.14.0`.

Out:
- Detecting a human from the session; the caller's framing stays the only signal, so *Driver-agnostic* holds.
- A `refine-glossary` skill or any other dedicated pass over the file; the glossary grows one term at a time as interviews meet them.
- The git and worktree skills (`add-worktree`, `enter-worktree`, `exit-worktree`, `list-worktrees`, `merge-worktree`, `remove-worktree`, `remove-worktrees`, `show-worktree`, `squash-commits`, `wrap-up-worktree`, `start-planning-session`, `close-ticket`) and the orchestrators (`complete-ticket`, `complete-tasks`, `deliver-brief`); they write no project prose of their own.
- Seeding the template with the workflow's own terms, or a glossary shipped inside the plugin; a possible follow-up.
- Rewriting other docs when a term is redefined; they are named, not edited.
- Eval suites. Pushing.

# Acceptance criteria
- In a throwaway repo with no `docs/glossary.md`, `/jodysalt:setup-skills` creates it from the template and a rerun skips it; a repo that already has one is left untouched.
- In a throwaway repo with a vision and no `docs/glossary.md`, a person runs `/jodysalt:add-ticket` with a brief that uses one word in two senses: `grill-me` opens by naming the term among the decisions, asks it before the question that depends on it with the senses and a recommended definition, creates `docs/glossary.md` from the template, and holds the agreed `## Term` entry before the next question is asked. The close names the term among what changed.
- With a term already defined there, a second interview whose subject uses it in another sense asks keep or redefine once: *keep* leaves the entry and rewords the subject; *redefine* rewrites the entry and the close lists every other file under `docs/` using the old sense, unchanged.
- The same repo with the same brief under `/jodysalt:deliver-brief` writes nothing to `docs/glossary.md`, and the term reaches the stage's report as a vital-few question with options and a recommendation.
- With a glossary defining a term, `add-ticket`, `add-tasks` and `complete-task` each read it before writing, and the ticket, the task headings and the commit message use the term in its defined sense; a run with no glossary file or a template-only one proceeds without error.
- Every skill listed under Consumers holds a Read of `docs/glossary.md` in its Read step and none of the skills listed under Out does: `grep -l 'docs/glossary.md' skills/*/SKILL.md` matches exactly the consumer set plus `setup-skills`.
- This repo's own `docs/glossary.md` exists and defines at least `driver` and `unattended` as this ticket uses them.
- `CLAUDE.md`, `README.md` and `setup-skills` carry the new workflow clause; README rows match every changed description; `plugin.json` is `0.14.0`; `claude plugin validate skills --strict` passes.
- Nothing is pushed.

# Implementation notes
- **Glossary shape.** `docs/glossary.md` opens with `# Glossary` and one prompt paragraph (the template, as `coding-standards.md` does), then one `## Term` section per term in alphabetical order: the definition in a sentence or two, then an optional `Not:` sentence naming what the term is distinguished from. The `##` heading is the dedup key, as `add-tasks` dedups on H2. Template:

  ```markdown
  # Glossary

  One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.
  ```

- **`grill-me`.** Step 1 gains the glossary read and the terms as open decisions; step 3 gains the write-as-it-lands and the conflict question; step 5's summary and decision log name each term defined or redefined and, after a redefine, the files still using the old sense. The rules gain: in a run declared unattended the glossary is read, never written, and an unresolved term goes back to the caller as a vital-few question. The description gains the glossary in one clause.
- **`setup-skills`.** A step between `docs/coding-standards.md` and `CLAUDE.md` writing the template when missing, reported like the others; step 4's workflow block gains the clause.
- **Consumers.** One line in each Read step: read `docs/glossary.md` when it exists and use each defined term in its defined sense; `commit` reads it before drafting the message. `complete-task` runs unattended, so its line is read-only by construction.
- **Steering.** `CLAUDE.md` line 3 and `README.md`'s Workflow paragraph take the same clause as `setup-skills` step 4. Descriptions are frontmatter, so `--strict` checks them; keep each skill's trigger phrases and "never" clauses.

# Test plan
- `claude plugin validate skills --strict`.
- `grep -l 'docs/glossary.md' skills/*/SKILL.md` against the consumer set plus `setup-skills`.
- Manual, throwaway repo with `claude --plugin-dir` pointed at this ticket's worktree: `git init`, `setup-skills` with and without an existing glossary, a vision, then each `add-ticket` case above (first definition, keep, redefine), the `deliver-brief` case, and one `add-tasks` plus `complete-task` run against a glossary term.
- Manual, this repo: `grep -n glossary CLAUDE.md README.md skills/setup-skills/SKILL.md` and `cat docs/glossary.md`.

# Rollout
- Bump `plugin.json` to `0.14.0`; merging to `main` is the release. Nothing breaking: a repo without a glossary behaves as today until `setup-skills` is rerun or an interview defines a term. Fallback is reverting the commit.
- The first user's repo gets `docs/glossary.md` by rerunning `setup-skills` and the new `CLAUDE.md` clause by hand.

## Strategic fit
Stands on *Decisions evaporate*: a meaning agreed in an interview is written down where every later session reads it, instead of living in scrollback. It serves *Agents drift without a spec*, since a spec, its backlog and its implementation now share one vocabulary, and *Explore before asking*, since a term the glossary answers is never asked again. It follows *Driver-agnostic* by reusing the caller's framing rather than detecting a person, and *One opinionated method* by adding no skill the method does not already call. It respects the *A home for standalone skills* non-goal; the glossary is a step in `grill-me`, not a tool of its own.
