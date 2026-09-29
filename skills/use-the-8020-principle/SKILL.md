---
name: use-the-8020-principle
description: Applies the 80/20 (Pareto) principle to whatever is in the current context, separating the vital few inputs that drive most of the results from the trivial many. Use whenever the user asks what matters most, what to focus on or cut, how to prioritise a long list (tasks, features, customers, bugs, costs, arguments), or mentions 80/20, Pareto, "vital few", leverage, or "moving the needle" – even if they don't ask for an "80/20 analysis" by name.
argument-hint: "[what to apply it to, e.g. 'the commit body', 'this task list']"
---

# Use the 80/20 principle

The universe is wonky: a small share of inputs produces most of the output – the vital few. Effort spread evenly across everything therefore wastes most of it. Use the 80/20 principle to separate the vital few from the trivial many, so the user can concentrate on what actually moves the result.

## Target

$ARGUMENTS

If the target above is empty, apply the principle to the whole current context. If it names a thing, work on that thing only.

## Step 1: Name the output

Before ranking anything, state in one sentence the result being optimised for (revenue, bugs closed, hours saved, reader persuasion, etc.). If the context doesn't make it clear, say what you're assuming and carry on – or ask, if a wrong assumption would waste the user's time.

Then list the candidate inputs: the tasks, features, customers, causes, costs, arguments or whatever else in the context could contribute to that output.

## Step 2: Pick a mode

- **80/20 Analysis** (quantitative): use when the context contains numbers that measure each input's contribution – revenue per customer, hours per task, occurrences per bug, and so on.
- **80/20 Thinking** (qualitative): use when it doesn't. Most requests fall here.

If there is partial data, use Analysis for what's measured and Thinking for the rest, and say which is which.

### 80/20 Analysis

1. Attach a contribution figure to every input, using only the numbers in context. Never invent figures; if one is missing, say so and use Thinking for that input.
2. Sort inputs by contribution, largest first.
3. Compute each input's share of the total and the running cumulative share.
4. Draw the line where the cumulative share reaches roughly 80%. Everything above the line is the vital few.
5. Show the working as a table: input, contribution, share, cumulative share.

### 80/20 Thinking

1. For each input, ask: "If this disappeared tomorrow, how much would the output drop?" Rate it high, medium or low.
2. Rank the inputs by that answer.
3. Draw the line where the highs end – or where the drop from one input to the next is steepest.
4. Say plainly that this is a judgement call, and give a one-line reason for each input placed above the line.

## Step 3: Report

Work through this structure before answering. Show it in full when the user asked what matters; when they asked for an action, deliver the trimmed result and summarise what was cut in one or two lines.

```
**Goal:** [the output from Step 1]

**Vital few** (do these)
- [Input] – [why it drives the output]
- ...

**Trivial many** (deprioritise, batch, automate, delegate or drop)
- [Input], [input], ...

**Watch out:** [anything in the trivial many that the vital few depend on, or that is required regardless – deadlines, legal, safety, hygiene]

**Recommended next move:** [one or two sentences]
```

## Rules of thumb

- Don't force the numbers. The real split may be 70/30 or 95/5; the point is the imbalance, not the ratio. Report what the data shows.
- The trivial many are low-leverage, not worthless. Prefer "deprioritise" to "delete" unless the user has said they want to cut.
- Keep the vital few genuinely few. If more than a third of the inputs end up above the line, the cut is too generous – look harder.
- Be blunt. Trimming is the value of the exercise; a hedged list that keeps everything is the skill failing.

## Example

**Input:** "I've got ten things on my list this week: finish the client proposal, fix a flaky test, tidy the repo, write the team newsletter, prep for Thursday's demo, update my LinkedIn, review Sam's PR, reply to the vendor, refactor the settings page, book travel for the conference. Which ones matter?"

**Output (80/20 Thinking):**

**Goal:** Keep revenue moving this week (proposal, demo) and keep the team unblocked.

**Vital few** (do these)
- Client proposal – direct revenue, deadline-bound.
- Demo prep – the demo is the next revenue step and can't be re-run.
- Sam's PR review – blocks someone else's work.

**Trivial many** (deprioritise, batch, automate, delegate or drop)
- Flaky test, repo tidy, newsletter, LinkedIn, vendor reply, settings refactor, travel booking.

**Watch out:** Travel booking is low-leverage but has a hard deadline and takes five minutes – do it, don't drop it. If the vendor reply is blocking the proposal, it moves above the line.

**Recommended next move:** Do the PR review today, block tomorrow morning for the proposal and Wednesday for demo prep; batch the rest into one Friday afternoon slot or push to next week.