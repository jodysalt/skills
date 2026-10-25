# Tasks

## Create skills/add-landing-page/SKILL.md with its frontmatter, opening paragraph, `## Idea` section, step 1 (root, guard, glossary) and Rules
- **category:** functional
- **status:** done
- **steps:**
  - The file follows `skills/add-skill/SKILL.md`'s template shape: frontmatter `name: add-landing-page`, a `description` in three parts (what it does and where it writes – interviews for the offer and the market test, writes the landing page at `docs/landing-page/index.html` with its hypothesis beside it in `docs/landing-page/README.md` and the GitHub Pages workflow when missing; trigger phrases "add a landing page", "market-test this idea", "make a landing page for X", `/add-landing-page`; what it never does – never overwrites an existing page, never pushes, never commits), and `argument-hint: "[the idea in one line, e.g. 'a calendar that books your haircut']"`. `grep -c 'market-test this idea\|add a landing page\|make a landing page for X\|/add-landing-page' skills/add-landing-page/SKILL.md` prints at least 1 for each phrase.
  - `# Add landing page`, one paragraph on the one job and where it stops, then `## Idea` holding a line with a dollar sign followed by `ARGUMENTS`, and the empty case: ask what the idea is before anything else. No planning-branch gate and no `start-planning-session` anywhere: `grep -c 'start-planning-session\|planning-' skills/add-landing-page/SKILL.md` prints 0.
  - Step 1, **Root and guard.**: root is `git rev-parse --show-toplevel`, else the working directory; if `docs/landing-page/index.html` exists, stop, say so and name `jodysalt:refine-landing-page` as the skill that improves an existing page, writing nothing; read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its sense. Steps 2–6 are left as one-line `**Lead.**` placeholders for the next tasks (Interview, Write the page, Write the notes, Write the workflow, Report).
  - `## Rules` lists: never overwrites `docs/landing-page/index.html` or an existing workflow; writes nothing outside `docs/landing-page/` and `.github/workflows/landing-page.yml`; never pushes, never commits, never enables Pages, never picks a payment, form or analytics provider; the analytics snippet appears only when supplied, verbatim; no framework, build step or external asset on the page; reads `docs/glossary.md` and never writes it.
  - `claude plugin validate skills --strict` passes.

## Write step 2 Interview of skills/add-landing-page/SKILL.md: the grill-me framing with the offer, test and analytics branches and the call-to-action warning
- **category:** functional
- **status:** done
- **steps:**
  - Step 2, **Interview.**, invokes `jodysalt:grill-me` with the subject "the landing page being drafted at `docs/landing-page/index.html` and its market test at `docs/landing-page/README.md`" and a framing in the shape of `skills/add-ticket/SKILL.md` step 7: the idea is settled; the repo and `docs/glossary.md` are explorable; nothing is written until the interview closes, since the page is one file written from every answer; a deferred answer becomes a `TODO:` in the written file.
  - Three branches in this order, each question with a recommended answer. **Offer:** who it is for; the headline; the one benefit then up to two more (three recommended); the price (a figure recommended; "none yet" allowed, and the price section then says so plainly); the call to action – its kind, its link and its terms; the objections the FAQ must answer (recommended: the ones the terms imply – when it ships, what happens to the money, how to cancel). **Test:** the hypothesis (one sentence a result can falsify); the metric (what the user will measure at the link they gave – sign-ups, pre-orders, clicks – recommended: the conversion of visits to that action); the threshold (a number the hypothesis passes at); the window (start and end dates; recommended: from the day the page goes live, fourteen days). **Analytics:** an optional snippet, recommended none; when supplied it is pasted verbatim and never edited.
  - The call-to-action question's recommended answer is an honest waitlist or a real pre-order with its terms on the page; the question warns off the fake "out of stock" after a buy click because ad platforms treat a misleading destination as misrepresentation, and says the skill cannot certify a page against any advertiser's policy; where the user gives no link, the button's `href` is left empty for `refine-landing-page` to report. `grep -n 'out of stock' skills/add-landing-page/SKILL.md` and `grep -n 'certify' skills/add-landing-page/SKILL.md` each match inside step 2.
  - `grep -n 'Offer\|Test\|Analytics' skills/add-landing-page/SKILL.md` shows the three branch names in that order within step 2.
- **notes:**
  - Steps 2–6 of `skills/add-landing-page/SKILL.md` exist as one-line placeholders (`N. **Lead.** TODO: …`, lines 20–24); replace the step's line in place, keeping the lead and the numbering.

## Write steps 3 and 4 of skills/add-landing-page/SKILL.md: the self-contained page at docs/landing-page/index.html and the notes at docs/landing-page/README.md
- **category:** functional
- **status:** done
- **steps:**
  - Step 3, **Write the page.**, at `docs/landing-page/index.html`, one self-contained file: `<!doctype html>`, `lang`, viewport meta, `og:title`, `og:description`, `og:type` `website`, and `og:url` as `https://{user}.github.io/{repo}/` only when `git remote get-url origin` matches `github.com[:/]{user}/{repo}(.git)?` (no match, no tag); inline `<style>` with the font stack `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` and mobile-first rules (one column, a `max-width` on wide screens, no media query below it); no `<link>`, no `<script>` and no `<img>` except the analytics snippet pasted verbatim before `</head>` only when supplied. The step lists the sections and ids rather than a full HTML listing: `<header id="headline">` with headline and subhead, `<figure id="hero">` holding an HTML comment naming the screenshot a later run adds, `<section id="benefits">`, `<section id="price">`, `<section id="cta">` with the button linking to the user's link, `<section id="faq">`, `<footer id="terms">` stating the pre-order or waitlist terms plainly.
  - Step 4, **Write the notes.**, at `docs/landing-page/README.md`: `# Market test`, then `## Hypothesis`, `## Metric`, `## Threshold`, `## Window` (start and end dates), `## Call to action` (what the button does and where it leads) filled from the interview, then `## Result` and `## Decision` each holding a one-line prompt for `refine-landing-page` to fill when the test is over.
  - `grep -c 'id="headline"\|id="hero"\|id="benefits"\|id="price"\|id="cta"\|id="faq"\|id="terms"' skills/add-landing-page/SKILL.md` prints at least 1 for each of the seven ids, and `grep -n 'og:url\|system-ui\|## Decision' skills/add-landing-page/SKILL.md` matches all three.
- **notes:**
  - Steps 2–6 of `skills/add-landing-page/SKILL.md` exist as one-line placeholders (`N. **Lead.** TODO: …`, lines 20–24); replace the step's line in place, keeping the lead and the numbering.
  - Step 2 now spans lines 20–27 as a lead line plus indented sub-bullets (three-space indent, five for the branch list), so the placeholders for steps 3–6 sit at lines 28–31; a multi-line step follows that indent shape.

## Write steps 5 and 6 of skills/add-landing-page/SKILL.md: the gh-pages workflow literal written only when missing, and the report
- **category:** functional
- **status:** done
- **steps:**
  - Step 5, **Write the workflow.**, at `.github/workflows/landing-page.yml` only when missing, saying so when present and leaving it untouched. The YAML is written out in the step as the skill's one literal, with one placeholder for the default branch – `git symbolic-ref --short refs/remotes/origin/HEAD` minus `origin/`, else `git branch --show-current`, else `main`: `on: push` to that branch with `paths: ['docs/landing-page/**']`; `permissions: contents: write`; one job on `ubuntu-latest` running `actions/checkout@v4` then `peaceiris/actions-gh-pages@v4` with `github_token: ${{ secrets.GITHUB_TOKEN }}`, `publish_dir: ./docs/landing-page`, `exclude_assets: README.md,mocks`, `publish_branch: gh-pages`.
  - Step 6, **Report.**, names the three paths, which were written and whether the workflow already existed; says everything is uncommitted; says publishing is the user's – enable GitHub Pages on `gh-pages` once, then push the default branch; suggests `jodysalt:commit` (a `feat:` commit) and names `jodysalt:refine-landing-page` for later changes and the result.
  - `grep -n 'peaceiris/actions-gh-pages@v4\|exclude_assets: README.md,mocks\|publish_branch: gh-pages\|publish_dir: ./docs/landing-page\|contents: write' skills/add-landing-page/SKILL.md` matches all five, and `grep -c 'git push\|git commit\|git add' skills/add-landing-page/SKILL.md` prints 0 outside the Rules' "never" clauses (check the matches by eye).
- **notes:**
  - Steps 2–6 of `skills/add-landing-page/SKILL.md` exist as one-line placeholders (`N. **Lead.** TODO: …`, lines 20–24); replace the step's line in place, keeping the lead and the numbering.
  - Step 2 now spans lines 20–27 as a lead line plus indented sub-bullets (three-space indent, five for the branch list), so the placeholders for steps 3–6 sit at lines 28–31; a multi-line step follows that indent shape.
  - Step 3 now spans lines 28–39 (its section list a five-space-indented sub-list) and step 4 is the one line 40, so the placeholders for steps 5 and 6 sit at lines 41–42; the YAML literal fits as a fenced block indented three spaces under the step 5 lead.

## Add the add-landing-page row as the first row of the skills table in README.md
- **category:** chore
- **status:** done
- **steps:**
  - The row `| [\`add-landing-page\`](./skills/add-landing-page/SKILL.md) | … |` sits directly above the `add-skill` row, its text the skill description's first sentence: `grep -n 'add-landing-page/SKILL.md\|add-skill/SKILL.md' README.md` prints the new row's line number one below the table's header separator and one above `add-skill`'s.
  - `grep -n '"version"' .claude-plugin/plugin.json` still prints `"version": "0.21.0"`; the bump belongs to the parent's last slice.

## Prove skills/add-landing-page/SKILL.md steps 3–5 by writing the page, notes and workflow by hand in a scratch repo under the session scratchpad
- **category:** non-functional
- **status:** done
- **steps:**
  - In a throwaway `git init` repo under the scratchpad with no `docs/vision.md` and a fake `origin` remote `git@github.com:someone/idea.git`, follow steps 3–5 of `skills/add-landing-page/SKILL.md` literally with sample answers (a waitlist link, three benefits, a price, no analytics snippet) and write the three files exactly as the step text instructs, filling nothing the text does not say; where the text is too vague to write a file from, fix the step in `skills/add-landing-page/SKILL.md` and note the fix in the commit.
  - In the scratch repo: `grep -c 'id="headline"\|id="hero"\|id="benefits"\|id="price"\|id="cta"\|id="faq"\|id="terms"' docs/landing-page/index.html` prints 7; `grep -c '<script\|<link\|<img' docs/landing-page/index.html` prints 0; `grep -n 'og:title\|og:description\|og:type\|og:url' docs/landing-page/index.html` matches all four, `og:url` reading `https://someone.github.io/idea/`; `grep -n '^## ' docs/landing-page/README.md` lists Hypothesis, Metric, Threshold, Window, Call to action, Result, Decision in that order; `grep -n 'publish_dir\|exclude_assets\|publish_branch\|paths' .github/workflows/landing-page.yml` matches all four; `git status --porcelain` lists only `docs/landing-page/` and `.github/`, none staged. Remove the scratch repo afterwards.
- **notes:**
  - Step 3's hero comment keeps `mock-{slug}.png` with the braces literal: no mock exists in a first run, so the slug is unknown and the later run that adds the screenshot fills it; write it as the step text shows rather than inventing a slug.
  - `grep -c` counts lines, not matches, so a `<style>` line that holds both `system-ui` and an id would still count once; keep each `id="…"` on its own line in the hand-written page so the count of 7 holds.
  - Step 5's YAML is the fenced block at `skills/add-landing-page/SKILL.md` lines 43–65, copied as is with only `{default-branch}` replaced; in a scratch repo with a fake `origin` that was never fetched, `git symbolic-ref --short refs/remotes/origin/HEAD` fails, so the fallback `git branch --show-current` names the `git init` branch (`main` or `master` per the host's `init.defaultBranch`), and that is the right value to write.

## Run full test suite for landing-page--page-skill
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate .` and `claude plugin validate skills --strict`) and confirm both pass.
