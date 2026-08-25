# Self_Guided_Lectures_170

Materials science and engineering supplemental self guided lectures/problems

`index.html` is **generated** — do not edit it by hand. `build_index.py` scans the
repo, reads metadata out of each lecture file, and rewrites the index. A GitHub
Action reruns it on every push.

---

## Adding a lecture

1. Copy `template/lecture-template.html` to a new file in the repo root.
2. Name it so the filename carries the number — `lecture7_phase-diagrams.html`
   or `L07_phase-diagrams.html`, either works.
3. Fill in the three meta tags at the top of the `<head>`.
4. Commit and push. The index rebuilds itself.

### The metadata convention

Each lecture declares its own place in the index. Two mechanisms, in this order
of precedence:

**Primary — meta tags in the `<head>`:**

```html
<meta name="lecture-number" content="7">
<meta name="lecture-title" content="Phase Diagrams I">
<meta name="lecture-topic" content="Crystal structure and defects">
```

`lecture-number` is digits, optionally with a single letter suffix (`7`, `07`,
`7a`). `lecture-topic` is optional — it becomes the one-line description under
the link. Leave it out and the entry is just number + title.

**Fallback — the filename.** The pattern is *(the word "lecture" in some form)*
+ *number* + *optional letter* + *optional slug*. All of these work:

```
L07_phase-diagrams.html          -> 7,  "Phase Diagrams"
L07a_phase-diagrams.html         -> 7a
lecture3s_density-solver.html    -> 3s, "Density Solver"
lecture 2s bond-energy-solver.html -> 2s, "Bond Energy Solver"
Lecture-12.html                  -> 12
```

`L`, `lec`, `lect`, and `lecture` are all accepted, case-insensitively, and the
separator can be `_`, `-`, a space, or nothing. The slug becomes the title with
hyphens and underscores turned into spaces and title-cased.

Something has to say "lecture" before the digits — otherwise every file with a
number in its name would get swept into the index. `Lattice_notes.html` and
`lecture-notes.html` both correctly fail to match and go to Unfiled.

**Title fallback order:** `lecture-title` meta → `<title>` → filename slug.

**Neither?** The file is *not* dropped. It appears in an **Unfiled** section at
the bottom of the index, and `build_index.py` prints a warning naming the file.
That's the signal to add a meta tag.

Gaps in the numbering are fine and are never flagged — add lectures as you write
them.

### Renaming vs. tagging

You never have to rename a file. A file whose name doesn't fit the pattern just
needs a `lecture-number` meta tag; the tag always wins over the filename.

---

## Running the build by hand

From the repo root, in Windows Terminal / PowerShell:

```
py build_index.py
```

(Use `py`, not `python` — on this machine `python` hits the Microsoft Store
alias stub.) It prints how many lectures it found, the numbers, and any
warnings. You are never blocked on the Action working.

### What the script does and doesn't do

- Scans the repo root and one level of subdirectories for `*.html`.
- Skips `index.html` itself and anything under `.git/`, `.github/`, `assets/`,
  `img/`, `images/`, `css/`, `js/`, `template/`, `templates/`, `node_modules/`.
- Standard library only — no pip install, ever.
- Overwrites `index.html`. It writes nothing else and deletes nothing.
- Output is **deterministic**: no timestamps, no "generated on" line, no random
  ordering. Two runs with no file changes produce a byte-identical file. That is
  deliberate — the Action commits only when `index.html` changes, and a
  timestamp would mean a commit on every push forever.
- Exits non-zero only on a real error (unreadable file, can't write the index).
  A missing meta tag is a warning, not a failure.

---

## The GitHub Action

`.github/workflows/build-index.yml` runs on every push to `main`, and can also
be triggered by hand from the **Actions** tab (`workflow_dispatch`). It checks
out the repo, runs `python build_index.py`, and commits `index.html` with the
message `Rebuild lecture index` — only if the file actually changed.

Two things in that file that look optional and are not:

- `permissions: contents: write` on the job. Without it the push step fails with
  a 403. This is the most common way this workflow breaks.
- The comment about loops. The workflow commits to the repo that triggers it,
  which is safe **only** because commits pushed with the default `GITHUB_TOKEN`
  do not trigger further workflow runs. If anyone ever swaps in a Personal
  Access Token or a deploy key to "fix" something, every rebuild commit starts
  another run — an infinite loop.

---

## GitHub Pages

If this repo is (or becomes) a GitHub Pages site:

- Pages serves `index.html` from the repo root on the default branch by default,
  so the generated index is automatically the landing page.
- Every link in the index is **relative** (`L07_phase-diagrams.html`), never an
  absolute local path. `build_index.py` only ever emits relative paths, with
  spaces and special characters percent-encoded.
- Anything a lecture loads — images, CSV or JSON data, fonts — must be committed
  to the repo too. A lecture that pulls a file from the local disk
  (`C:\Users\...`) or from a OneDrive link renders blank for students. Keep
  assets in the repo and reference them relatively.

---

## Note: this repo lives inside OneDrive

The working copy is under `OneDrive\Documents\GitHub\`. That works, but there is
a known failure mode: OneDrive and git can both touch `.git/` at the same time,
which produces lock-file errors (`Unable to create '.git/index.lock'`) or a
corrupted index — most often during a `git pull` while sync is active.

Two mitigations, neither of them applied here:

- Exclude the `.git` folder from OneDrive sync, or
- Move the repo outside the OneDrive tree. A git repo already has GitHub as its
  backup; OneDrive is redundant for it.

Nothing has been moved. This note exists so the symptom is recognizable if it
ever shows up.
