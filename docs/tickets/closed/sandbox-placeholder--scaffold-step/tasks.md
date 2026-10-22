# Tasks

## Add step 8 `Dockerfile.sandbox` to skills/setup-skills/SKILL.md, writing the placeholder template verbatim when the file is missing, and renumber Report to step 9 offering jodysalt:refine-sandbox
- **category:** functional
- **status:** done
- **steps:**
  - After step 7 (`.vscode/settings.json`) insert `8. **`Dockerfile.sandbox`.** Skip if the file exists at the repo root. Otherwise write it from this template.` plus one sentence saying the comments are prompts for `refine-sandbox`, not content, and the first line is the marker `run-in-sandbox` and `refine-sandbox` match exactly. The template, inside a ```` ```dockerfile ```` block indented like steps 2–4's, is verbatim the 8-line block under "Step 8 template" in `docs/tickets/closed/sandbox-placeholder--scaffold-step/index.md`, its first line exactly `# Placeholder: run /jodysalt:refine-sandbox to tailor this file to the project.`
  - Renumber the old `8. **Report.**` to `9.`; it lists `Dockerfile.sandbox` among paths created or skipped, and its offer sentence becomes: offer to invoke `jodysalt:refine-vision` to fill in `docs/vision.md`, `jodysalt:refine-coding-standards` to fill in `docs/coding-standards.md` and `jodysalt:refine-sandbox` to tailor `Dockerfile.sandbox`.
  - `grep -n '^8\. \*\*`Dockerfile.sandbox`' skills/setup-skills/SKILL.md` and `grep -n '^9\. \*\*Report' skills/setup-skills/SKILL.md` each print one line, and `grep -rn 'step 8' skills/` shows no reference to the Report by its old number.
  - In a fresh `mktemp -d` directory under the session scratchpad, extract the template from step 8 with `sed` (the lines between the ```` ```dockerfile ```` fence and its closing fence, leading indentation stripped) into `Dockerfile.sandbox`; `head -1` prints the marker exactly, and `docker build -f Dockerfile.sandbox .` run in that directory succeeds.

## Name the placeholder `Dockerfile.sandbox` and the refine-sandbox offer in the setup-skills description and README.md row, and bump .claude-plugin/plugin.json to 0.18.0
- **category:** chore
- **status:** done
- **steps:**
  - In `skills/setup-skills/SKILL.md` frontmatter `description`, add "a placeholder `Dockerfile.sandbox`" to the list of scaffolded paths and extend the last sentence to offer `refine-sandbox` to tailor `Dockerfile.sandbox` beside `refine-vision` and `refine-coding-standards`; keep the "Use when" phrases and the "never" clauses.
  - In `README.md`, the `setup-skills` row names the placeholder `Dockerfile.sandbox` in the same path list and gains the `refine-sandbox` offer, so it matches the description: `grep -n 'setup-skills/SKILL.md' README.md` shows both.
  - `.claude-plugin/plugin.json` `"version": "0.17.0"` becomes `"version": "0.18.0"`, nothing else in it changed: `grep '"version"' .claude-plugin/plugin.json` prints `0.18.0`.

## Run full test suite for sandbox-placeholder--scaffold-step
- **category:** chore
- **status:** done
- **steps:**
  - Run the full test suite (`claude plugin validate skills --strict`, then `claude plugin validate .`) and confirm both pass, the root check allowed only its pre-existing warnings about `CLAUDE.md` and the missing plugin icon.
