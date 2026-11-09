---
name: add-course
description: Scaffolds one course on a planning branch from the plugin's templates – an overview page with `TODO:` placeholders at `docs/courses/{slug}/index.html`, a row for it in the courses index at `docs/courses/index.html`, and the shared layout `docs/courses/course.css` and `course.js` when missing – then hands off to `refine-course`, which serves the courses locally, interviews for the audience, outcomes and lessons, researches the subject and writes each lesson. Use when the user says "add a course", "teach me X", "make a course on X", "I want to learn X", or runs `/add-course`. Never overwrites an existing course, never writes lesson content itself, never pushes, never commits.
argument-hint: "[the subject in one line, e.g. 'pricing a SaaS product']"
---

# Add course

Scaffold one course from a subject and hand it off: pick the slug, copy the boilerplate – the overview page with `TODO:` placeholders where the audience, outcomes and lessons go, the shared stylesheet and widgets every course inherits, the index that lists every course – from the templates beside this skill, all uncommitted, then invoke `refine-course` in the same session, which serves the courses locally, interviews for who it is for and what it teaches, researches the subject and writes the lessons. A course is how the method learns a subject so the people building and marketing a product choose better informed. It writes nothing from the subject itself; the subject reaches the interview through the hand-off's framing. Branch gate as a spec skill's: a course is drafted on a planning branch and lands through `wrap-up-worktree`.

## Subject

$ARGUMENTS

The subject to learn, in one line. If empty, ask what the course teaches before anything else.

## Steps

1. **Root and guard.** The root is `git rev-parse --show-toplevel`, else the working directory. Read `docs/glossary.md` when it exists, a missing or template-only file counting as an empty glossary, and use each defined term in its defined sense in the report, never redefining one in passing; a term the glossary lacks is used as the input uses it.
2. **Branch gate.** If the current branch does not match `planning-<YYYY-MM-DD>` followed by anything (a pre-upgrade `planning-2026-10-21` counts), offer to invoke `jodysalt:start-planning-session {slug}`, `{slug}` from step 3 when it has run, else `course`; on yes pass it and ask nothing else. Continue on the current branch if the user declines. Skip if the gate already ran this conversation. Either way, the root is `git rev-parse --show-toplevel` from here on.
3. **Pick the slug.** The slug is the subject's kebab-case form with a leading "learn", "learning", "how to", article or "about" dropped (`learn pricing a SaaS product` becomes `pricing-a-saas-product`). Confirm it in one question with the pick recommended, since it is the folder and the URL. The course's folder is `docs/courses/{slug}`; call it `{folder}`. If `{folder}/` exists, stop and say so, naming `jodysalt:refine-course` as the skill that improves an existing course; nothing is written.
4. **Copy the boilerplate.** The templates live in this skill's own folder, `templates/` under the base directory the Skill tool's "Base directory" line names. Copy each with `cp`, creating the folders, so the copy is byte for byte and never regenerated: `templates/overview.html` to `{folder}/index.html`; and, each only when missing, `templates/course.css` to `docs/courses/course.css`, `templates/course.js` to `docs/courses/course.js` and `templates/index.html` to `docs/courses/index.html`. An existing shared file is left untouched, byte for byte, and the run says so; every page under `docs/courses/{slug}/` links them as `../course.css` and `../course.js`. No lesson page is copied: the lessons are named in the interview, and `refine-course` writes each from `templates/lesson.html` here.
5. **List it.** Insert one row in `docs/courses/index.html`, inside `<ul class="courses">` before its closing tag, in alphabetical order of slug among the rows there: `<li><a href="{slug}/">TODO: the course's title</a> <span class="muted">TODO: the subject in a line</span></li>`. The `TODO:`s are `refine-course`'s to fill. This insertion and the `cp` of step 4 are the only edits.
6. **Hand off.** Invoke the `refine-course` skill from this plugin (`jodysalt:refine-course`) with `{slug}` in the same session – the Skill tool call, never a sub-agent – and state in the same turn the framing "the subject is: {subject}; this is a fresh boilerplate", `{subject}` the line from `## Subject`. The framing is how the subject reaches the interview; `refine-course` reads it from there and otherwise from the folder, finds every `TODO:` the copies left, and asks for each, landing the answers as edits to the boilerplate and the lessons as new pages.
7. **Report.** Before the hand-off's own report, in the turn that invokes it, so the user sees what was scaffolded even when the interview stops early: the slug; the files copied – `{folder}/index.html`, and `docs/courses/course.css`, `course.js` and `index.html`, saying which already existed and were left alone; the row inserted in `docs/courses/index.html`. Name the partners this skill implies and `skills/` lacks, `remove-course` and `list-courses`, for a later `jodysalt:add-skill`, and nothing more. Say that everything is uncommitted and that `refine-course`'s report follows with the interview's result; the commit suggestion is its.

## Rules

- Never overwrites a course; a `{folder}/` that exists stops the run before anything is written. The shared `course.css`, `course.js` and `index.html` follow the same rule without the stop: an existing one is left untouched, byte for byte, while the run carries on and says so.
- Writes nothing outside `docs/courses/`, and no lesson content: the subject reaches `refine-course` through the framing, never the files.
- The `cp` of step 4 is the only program run beyond `git`, and nothing is installed.
- Never pushes, never commits.
- No framework, build step or external asset on a page: a course is vanilla HTML, CSS and JavaScript served from the folder.
- Reads `docs/glossary.md` and never writes it.
