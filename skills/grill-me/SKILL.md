---
name: grill-me
description: Interviews the user relentlessly about a plan or design until reaching shared understanding – surfacing the decisions it makes without saying so, walking every branch of the decision tree one question at a time with a recommended answer for each, highest-leverage first, recording each answer as it lands, and defining each ambiguous term in `docs/glossary.md` as the interview meets it. Use when the user wants to stress-test a plan, get grilled on a design, or says "grill me".
argument-hint: "[the plan or design to grill – defaults to what's in context]"
---

# Grill me

## Subject

$ARGUMENTS

If empty, the plan or design currently in context.

## Steps

1. **Map the tree.** Read the subject and list every open decision in it: each point where more than one answer is plausible, and which decisions depend on which. Then look for the decisions it makes without saying so – an assumption it rests on, a failure mode it doesn't handle, an edge it doesn't cover, a non-goal it never states – and add each as an open decision. Anything the codebase can answer, answer by exploring; it never becomes a question. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, then add each ambiguous term as an open decision: a term the subject or conversation uses in more than one plausible sense, uses differently from the glossary, or that the repo already uses two ways. A term the glossary defines and the subject uses in its sense is answered from the glossary, never asked.
2. **Order the questions** with the 80/20 principle, applied to the open decisions from step 1:
   - **Output:** a plan the user can start building without a decision still open that would have changed its shape.
   - **Vital few go first.** A decision whose wrong answer forces a rewrite, or that other decisions hang off, is asked before anything else, in dependency order.
   - **Trivial many go last.** Cosmetic, reversible and convention-driven choices are still asked – nothing is pruned – but only once the vital few are settled.
   - **Watch out ranks with the vital few.** A low-leverage choice that is hard to reverse – a schema, a public name, a file layout – is asked early however small it looks.

   Keep the vital few genuinely few: if more than a third of the decisions land there, look harder. A term ranks like any other decision: one the subject hangs on is asked before the questions that use it, a cosmetic one lands in the batched tail. Open the interview with one short paragraph naming the decisions you see and the order you'll take them, then ask the first question.
3. **Interview** the user relentlessly in that order, one question at a time in the shape below. Walk a branch to the bottom before starting the next. When an answer opens a branch you hadn't mapped, add its decisions to the tree and re-run step 2 only if they change what should come next. If the subject is a file, edit it as each answer lands so the file never lags the conversation. A term is asked in the usual question shape: the term, the senses in play, a recommended definition. As its answer lands, write it to `docs/glossary.md` whether or not the subject is a file – the one file edit this skill makes when its subject is not a file – so the glossary never lags the conversation: a `## Term` section inserted in alphabetical order, the heading in the term's own case, holding the definition in a sentence or two then an optional `Not:` sentence naming what the term is distinguished from. `## Term` is the dedup key, so a redefine rewrites the section under its existing heading. When the file is missing, create it first from the template below, the one `setup-skills` writes, copied verbatim. When the glossary already defines a term the subject uses in another sense, ask once with both senses: *keep* leaves the entry and rewords the subject to the glossary sense; *redefine* rewrites the entry, and the close names every other file under `docs/` using the old sense, found with `grep -rli '<term>' docs/` minus `docs/glossary.md`, left untouched. A silent third definition is never written.

   ```markdown
   # Glossary

   One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.
   ```

4. **Finish the tail.** Once the vital few are settled, work through the trivial many. Independent ones with an obvious default may go in a single message as a list of assumptions, each with the answer you'd take, for the user to accept or correct.
5. **Close** when every decision has an answer you both hold. If the subject is a file, it now holds the answers: summarise what changed in a few lines and leave the edits uncommitted for review, suggesting `jodysalt:commit`. Otherwise end with a decision log – one line per decision, what was decided and why – so the shared understanding outlives the conversation. Either way, the summary or the log names each term defined or redefined in `docs/glossary.md` and, after a redefine, the files under `docs/` still using the old sense.

## Question

Each question is one message, short enough to answer in a line:

- **The decision** in one sentence, and what hangs on it – what it unblocks, or what a wrong answer costs.
- **The plausible options**, two to four. More means the decision needs splitting.
- **Your recommendation** and the reason for it, in a line or two.

## Rules

- The 80/20 pass sets order, never scope. Every open decision is either asked or answered from the codebase.
- One question at a time, except the batched tail in step 4.
- Explore before asking. A question the codebase can answer is never put to the user.
- Never invent an answer. Only what the user agreed goes into the file or the log; a decision they deferred is recorded as open.
- The caller's framing decides who answers. A caller that declares the run unattended makes the recommended answer count as the user's for the trivial many; the vital few go back to the caller, each with its options and recommendation, instead of to a person.
- In a run declared unattended the glossary is read, never written. An unresolved term – one the glossary lacks, or one it defines in a sense the subject does not use – goes back to the caller as a vital-few question with its options and a recommendation.
