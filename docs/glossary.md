# Glossary

One `## ` section per term, alphabetical: what the term means here in a sentence or two, then an optional `Not:` sentence naming what it is not. `grill-me` adds a term when an interview meets an ambiguous one; every skill that writes or implements from a spec reads this file first.

## boilerplate

The files an `add-{foo}` skill writes from its templates before handing off to its pair: for `add-landing-page`, the landing page in the house design language with `TODO:` placeholders where the copy goes and the mocks' stylesheet and index; for `add-skill`, a `SKILL.md` whose sections are prompts.
Not: a file the `refine-{foo}` has filled.

## branch gate

The step a skill that writes to the repo runs before it writes: when the current branch is neither a planning branch nor an open ticket's, it offers `start-planning-session` with its subject as the description, carries on where it is when the user declines, and is skipped once it has run in the conversation.
Not: a guard on what the checkout holds, such as a page that already exists.

## competitor analysis

The document at `docs/competitor-analysis.md` that records an idea's main keywords, the pricing, guarantees and positioning of the three or four competitors those searches rank highest, and the opening the offer should take, written before the market test so the landing page's offer is shaped against it.
Not: the vision's competitive landscape, or a feature comparison.

## deploy

Publishing `docs/landing-page/` as its Cloudflare Worker, the folder its static assets minus what `.assetsignore` lists: the `Landing page` workflow `add-landing-page` writes, run by hand from the Actions tab, or `npx wrangler deploy` in that folder. `refine-landing-page` fills the values it needs and never runs it.
Not: landing the planning branch through `wrap-up-worktree`, which publishes nothing.

## design

One or more static HTML pages under `designs/{name}/` beside the ticket at `docs/tickets/open/{slug}/`, showing one candidate for what the ticket builds: a screen, a flow of screens, or something that is not a screen at all, kept as the reference for what to build and what not to.
Not: a mock, which fakes one screen for a landing page's screenshot; not the design language.

## design language

The fixed set of tokens, type scale, components and breakpoint `add-landing-page` writes every landing page from; a product changes only its accent and mood.
Not: a per-page design, or a CSS framework.

## driver

Whoever invoked a skill: a person at the keyboard, or an agent such as a `deliver-brief` stage, the slice drafter `complete-ticket-slice` spawns, or a `complete-tasks` worker. By the vision's *Driver-agnostic* principle a skill serves either the same way, asking the same questions in the same shape, and learns which it has only from the caller's framing.
Not: a person a skill detects from the session; nothing detects one.

## gate

The task that ends a ticket's backlog, appended by `add-tasks` with one step per check listed under `## Gate` in `docs/testing-strategy.md` – the full suite, locally, by default – and run by a `complete-task` worker like any task; a check may push the branch and watch its CI run when the strategy says so, after every local check has passed.
Not: a task's own verification steps, which stay the narrowest checks; not the branch gate.

## landing page

The single static page a market test publishes to sell the product before it exists.
Not: the product's marketing site once it ships.

## market test

A landing page that sells a product before it exists, published to measure interest against a threshold set in advance; the vision for the product is written from its result.
Not: a survey, interviews, or a page for a product that already ships.

## mock

A static HTML page that fakes one product screen, made for the screenshots a landing page's copy needs and kept as design reference for the tickets that build the real screen.
Not: a test double.

## pair

The `add-{foo}` and `refine-{foo}` skills for one thing the method adds: the add writes the boilerplate and hands off in the same session, the refine improves what exists in place. `add-skill` drafts an `add-{foo}` with its `refine-{foo}`.
Not: a partner.

## partner

A skill an `add-{foo}` implies beyond its pair – `remove-{foo}`, `list-{foo}` – which `add-skill` and `refine-skill` suggest and never draft.
Not: the `refine-{foo}` of the pair.

## planning branch

The `planning-<YYYY-MM-DD>-<description>` worktree `start-planning-session` creates, where anything that lands on `main` through `wrap-up-worktree` without a ticket is drafted: the vision, tickets, designs, the coding standards, the market test and this plugin's skills. A skill that writes one of those runs the branch gate first.
Not: a ticket's own branch, or source such as `Dockerfile.sandbox`, which a ticket lands.

## project command

A command that runs the project's own code or toolchain – a manifest script (`npm run …`, `make …`, `just …`) or the runtime or a tool directly (`npx tsc`, `pytest`) – as tests, type-checks, lints and builds do. In a repo whose `Dockerfile.sandbox` is tailored, `complete-task` runs each one through `run-in-sandbox`.
Not: a command that only reads the checkout, such as `grep`, `git` or `ls`.

## sandbox

A Docker container built from `Dockerfile.sandbox` at the repo root, with the checkout mounted in it, where `run-in-sandbox` runs commands isolated from the host.
Not: Claude Code's own Bash sandbox, which restricts the session's shell commands.

## slice

The thinnest end-to-end piece of an open ticket that moves its unmet acceptance criteria most, specified as a `{slug}--{sub}` sub-ticket, implemented in a worktree forked from the ticket's branch and landed on that branch as one commit; the sub-ticket, its worktree and its commit are all called the slice.
Not: a task, which is one entry in a slice's backlog.

## stage

A fresh sub-agent `deliver-brief` spawns to invoke one skill unattended, do its work and report in a few lines, ending in `done` or the vital few questions for the root to answer.
Not: the root, which runs `complete-ticket` and the worktree skills itself because a sub-agent is pinned to its checkout.

## testing strategy

The document at `docs/testing-strategy.md` that says how this repo verifies a change: `## Coverage`, the test each task category must add; `## Task checks`, the checks a task's own steps may run; `## Gate`, the checks that end a backlog, one per bullet. `setup-skills` writes its defaults, which fit a repo whose full suite runs locally in minutes, `refine-testing-strategy` tailors them, and `add-tasks` reads them when it writes a backlog.
Not: a ticket's `# Test plan`, which says what one change must prove; not `Dockerfile.sandbox`, which says where a command runs.

## unattended

A run whose caller declared in its framing that no person reads the conversation, as `deliver-brief`'s stage prompt and `complete-ticket-slice`'s slice drafter do and as the loop's `complete-task` worker is by its own description. The framing is the only signal. In an unattended run `grill-me`'s recommended answer stands for the trivial many, the vital few go back to the caller with their options and a recommendation, and `docs/glossary.md` is read, never written.
Not: a run with no person present that nobody declared; a skill treats that as a person's run.

## verdict

The user's decision on a design, `build` or `reject`, with its reason in a sentence, made in `refine-design`'s interview and recorded in the design's bullet under the ticket's `# Designs`; a `build` design is the spec of the screen a slice builds and a `reject` one is what it leaves out.
Not: `complete-ticket-slice`'s judgement that an acceptance criterion is met or unmet.

## waitlist

The landing page's built-in call to action: the `#waitlist` modal its buttons open, the Worker's `/api/waitlist` route the modal's form posts the email to, and the D1 `signups` table that stores it, the list of record for the market test's sign-ups.
Not: the `waitlist_signup` PostHog event, which counts beside the table, or a third-party form.
