---
name: refine-competitor-analysis
description: Revisits the competitor analysis at `docs/competitor-analysis.md` and improves it in place on a planning branch – searches the idea's main keywords, reads the top three or four competitors' sites, reports what the document lacks or what changed, then interviews the user one question at a time and edits as answers land. Use when the user says "refine the competitor analysis", "refresh the competitors", "the competitor analysis needs X", or runs `/refine-competitor-analysis`. Never creates the document, never invents a price, never commits.
argument-hint: "[section names or a competitor's name – defaults to the whole document]"
---

# Refine competitor analysis

Improve an existing competitor analysis in place: search the idea's main keywords, read the top three or four competitors' sites, report what the analysis lacks against what the search found, interview, and fill the pricing, guarantees and positioning in. Leave the result uncommitted. It never creates the document; a repo with no analysis at `docs/competitor-analysis.md` is `jodysalt:add-competitor-analysis`'s. Branch gate as a spec skill's: the analysis is drafted on a planning branch and lands through `wrap-up-worktree`.

## Scope

$ARGUMENTS

If given, section names matched case-insensitively against the document's `##` headings – `keywords`, `competitors`, `opening` – or a competitor's name matched against its `###` headings, with or without the rest; the research, the findings and the interview cover only those. If empty, the whole document. If a name matches nothing, list the names and ask.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. If `docs/competitor-analysis.md` is missing under it, stop and point at `jodysalt:add-competitor-analysis`; this skill improves an analysis, it never creates one, and nothing is written. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the edits and the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything, offer to invoke `jodysalt:start-planning-session competitor-analysis`; when `git status --porcelain docs/competitor-analysis.md` prints anything, the offer says those edits stay in the current checkout, since the worktree forks from the last commit, and that declining keeps working on them where they are. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Explore before asking.** Read `docs/competitor-analysis.md`, and `docs/landing-page/README.md` and `docs/landing-page/index.html` when present, since an offer already on the page is what the opening has to beat. The idea the keywords come from is the caller's framing when it gave one ("the idea is: {idea}"), else the document's own keywords, else the page's headline; with none of those, ask for the idea before anything else. Derive the main keywords from it – three to five phrases a buyer would type – and take `## Keywords` as they stand when the section is filled and in scope.
4. **Research.** Search each keyword with `WebSearch` and read each competitor's home and pricing pages with `WebFetch`. The competitors are the three or four sites that sell to the same buyer and rank highest across the searches, ads and marketplaces aside; for each, take its URL, its pricing (the plans and prices with their unit), its guarantee (refund, trial, or none) and its positioning (who it is for and the promise it leads with, in a sentence), each fact from the page it was read on. When the searches find no one selling to the same buyer, write the searches run under `## Keywords`, ask once for broader or adjacent keywords and search again; still none, `## Competitors` holds one line saying nobody was found and `## Opening` says the buyer may not exist or searches differently, an empty market being a finding the market test then checks. When either tool is unavailable, print the searches to run and the pages to open, and take the URLs and the facts from the user through the interview instead, one question at a time; the document is filled the same way from either source, and nothing is installed. On a filled document the research runs again over the sections in scope, and what it found is held against what the document says.
5. **Report findings before editing anything.** Each finding is named by the section or competitor it is about:
   - Each `##` section the document lacks – `Keywords`, `Competitors`, `Opening` – and each section or competitor field still holding its `TODO:` prompt.
   - Each listed competitor whose pricing, guarantee or positioning the research read differently, quoting both; each competitor found that outranks a listed one across the searches; each listed one the searches no longer surface.
   - A `## Keywords` whose searches surfaced none of the listed competitors.
   - An `## Opening` no listed competitor's facts support, or that `docs/landing-page/index.html`'s price, terms or headline already contradicts.
6. **Interview.** Invoke the `grill-me` skill from this plugin (`jodysalt:grill-me`) with the subject "the competitor analysis at `docs/competitor-analysis.md`". Give it this framing:
   - Seed the decision tree with the findings from step 5, then add the decisions the document makes without saying so: a keyword nobody searches, a competitor that sells to a different buyer, an opening that is a feature rather than a price, a guarantee or a promise.
   - Branches, in this order, each asked only when a finding or the scope raises it: **Keywords** – the three to five phrases, recommended from step 3, the searches run recorded under them; **Competitors** – which three or four of those found make the list, recommended the highest-ranked that sell to the same buyer, then for each the facts the research could not read, one question per fact, never one it could; **Opening** – the gap, recommended as the one thing no listed competitor prices, guarantees or promises that the idea can, in a sentence or two.
   - The document, the notes, the page and what the research read count as explorable; a question they answer is never asked, and each recommended answer cites the page or search it came from.
   - Only an answer the user agrees to lands, a changed fact like a new one. A run where the user declines every question leaves the file byte for byte unchanged.
   - Edit `docs/competitor-analysis.md` as answers land, keeping the skeleton's shape: the three `##` sections in their order, one `###` per competitor holding the four bold fields in their order, a competitor added or removed whole. Each `TODO:` goes as its answer lands; a deferred answer stays a `TODO:` marker in its place.
   - `docs/glossary.md` is read, never written.
7. **Report.** The keywords searched; each competitor listed, added, removed or changed, and what changed; the opening as it now stands; the findings resolved and those left open, each `TODO:` still standing named by its section; the facts taken from the user rather than read, when the tools were unavailable. Say that `docs/competitor-analysis.md` is uncommitted and that `jodysalt:add-landing-page` reads its `## Opening` for the offer, and suggest `jodysalt:commit`, a `docs:` commit.

## Rules

- Never creates `docs/competitor-analysis.md`; a missing document stops the run before anything is written.
- Writes nothing outside `docs/competitor-analysis.md`.
- `WebSearch` and `WebFetch` are the only tools used beyond `git`; nothing is installed and nothing is downloaded into the repo.
- Never invents a price, a guarantee or a positioning; each fact names the page it was read on, or the user who gave it, or stays a `TODO:` marker.
- Never pushes, never commits.
- Reads `docs/glossary.md` and never writes it.
