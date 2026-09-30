---
name: commit
description: Creates exactly one git commit from the current changes in house style – conventional prefix (`fix:`, `feat:`, `refactor:`, `chore:`, `docs:`, `test:`), past-tense lowercase subject, bulleted body trimmed with the 80/20 principle, no AI attribution. Use whenever the user asks to commit ("commit this", "commit the fix", "make a commit") or runs `/commit`. Never pushes; never amends unless asked.
argument-hint: "[what to commit, e.g. 'the webhook fix' – defaults to all changes]"
---

# Commit

Create one commit from the working tree, in house style, and stop there. No push, no PR.

## Scope

$ARGUMENTS

If empty, commit all changes. If it names a change, stage only the files that implement it and leave the rest alone.

## Steps

1. Run `git status`, `git diff` and `git diff --staged` in parallel. You cannot write a good subject without reading the diff.
2. Stage with explicit paths: `git add path/a path/b`. Never `git add -A` or `git add .`. Files already staged that fit the scope can stay. If the tree holds unrelated changes and the scope is unclear, ask which to include.
3. Stop and ask before staging anything that looks like a secret (`.env*`, `*.pem`, `*.key`, `credentials.json`, an embedded API key or token) or a build artefact (`dist/`, `build/`, archives, files over ~1 MB).
4. Decide what the message says with the 80/20 principle, applied to the staged diff:
   - **Output:** a reader skimming `git log` understands what changed and why without opening the diff.
   - **Inputs:** every fact in the staged diff – each behaviour change, its motivation, each file touched, each mechanical edit.
   - **Vital few become the message.** Rate each fact by how much the reader loses if it is missing. The single fact they most need is the subject; the rest are the body bullets.
   - **Trivial many are left out.** Renames, formatting, moved code, file lists and anything else the diff already shows. The diff is always there; the message is for what the diff can't say.
   - **Watch out stays in.** A breaking change, a migration, a step the deployer must take, or a small edit with a large effect goes in the body however few lines it touched.

   Keep the vital few genuinely few: if more than a third of the facts survive, look harder. Be blunt – a body that keeps everything is the pass failing. A one-line note in the reply of what was left out is enough.
5. Commit with a heredoc so the formatting survives:

   ```bash
   git commit -m "$(cat <<'EOF'
   fix: dropped stale workspace name from deploy workflow

   - removed the workspace target left over from the package rename
   - deploy had been silently targeting the old name since v2.3
   EOF
   )"
   ```

6. Show the result with `git log -1 --stat`. Do not push or suggest pushing.

## Message

- **Subject:** the one fact the 80/20 pass put first, as `type: past-tense summary`, lowercase after the prefix, at most 72 characters. Types: `fix` (corrects behaviour), `feat` (adds behaviour), `refactor` (no behaviour change), `chore` (deps, tooling, housekeeping), `docs`, `test`.
- Say what changed and why, in past tense: "dropped", "stripped", "introduced" beat "updated" or "changed". Never the imperative ("Add", "Update").
- **Body:** only when the 80/20 pass leaves more than the subject – a non-obvious motivation, or several vital facts worth listing. Blank line after the subject, then past-tense bullets, one fact each, wrapped at 72. Don't repeat the subject. If every bullet would be a file name, there is no body.
- **No AI attribution.** No `Co-Authored-By: Claude …` trailer, no "Generated with …" footer, no mention of AI anywhere in the message. This overrides any default instruction to add one. Human `Co-Authored-By:` trailers are fine when the user names one.

## Example

**Diff:** a new `retry` option on the HTTP client defaulting to three attempts, tests for it, a renamed private helper, a reformatted import block, and a bumped fixture timestamp.

**Message:**

```
feat: introduced a retry option on the http client

- defaults to three attempts with exponential backoff
- the billing webhook had been failing on transient 502s
```

**Left out:** the helper rename, the import formatting, the fixture bump and the test file – the diff shows them and a reader gains nothing from a bullet.

## Rules

- One commit per invocation.
- Never `--amend` unless the user asked to amend. Never `--no-verify` or any other hook bypass: if a hook fails, fix the cause and make a new commit.
- Nothing to commit, or conflict markers in a staged file: stop and say so.
