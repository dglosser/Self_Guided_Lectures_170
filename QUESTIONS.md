# Open choices

Decisions that weren't specified in the brief, what I chose, and why. Each one
is a one-line change if you'd rather it went the other way.

---

**1. The existing file `lecture 2s bond-energy-solver.html` — what number is it?**

Chose: `lecture-number` = `2s`, displayed as **2s**, sorting just after lecture 2.
Why: `2s` in the filename reads as "lecture 2, supplement". The letter-suffix
support the brief asked for (`7a`, `7b`) handles it exactly, so the file could be
filed without renaming it — which the guardrails prohibit anyway.
If `2s` means something else (lecture 2 section s? lecture 25?), edit the
`content` attribute of that one meta tag. Nothing else changes.

**2. The file was not renamed, and three meta tags were added to it.**

Per the guardrails: don't rename, add the tag instead. The tags added were
`lecture-number`, `lecture-title`, and `lecture-topic`, inserted directly after
the existing `<meta name="viewport">` line. No other content in that file was
touched. `lecture-title` was set to the existing `<title>` text; `lecture-topic`
is a one-line description I wrote from the file's own subtitle — **check that
line**, it's the only place I put words near your course content.

**3. Line endings are forced to LF in the generated `index.html`.**

Python on Windows would otherwise write CRLF while the Ubuntu CI runner writes
LF. Two "identical" runs would then differ by every line, and the Action would
commit a line-ending flip on every push — exactly the churn the idempotency
requirement exists to prevent. `open(..., newline="\n")` pins it.

**4. Invalid `lecture-number` meta tag falls back to the filename.**

The brief made the meta tag primary. If the tag is present but unparseable
(`content="seven"`), I fall back to the filename pattern rather than sending the
file to Unfiled. If neither works, it goes to Unfiled with a warning that quotes
the bad value back to you, so the typo is visible.

**5. Extra excluded directories.**

The brief listed `.git/`, `assets/`, `img/`, `css/`, `js/`, `template/`. I also
excluded `.github/`, `images/`, `templates/`, and `node_modules/`, plus any
directory starting with a dot. Same intent, fewer surprises later.

**6. Unfiled entries show their filename; numbered ones don't.**

You need to know *which* file needs a tag, and its title alone may not identify
it. Numbered entries stay clean — number, title, optional topic.

**7. Duplicate numbers are reported, not blocked.**

Two files both claiming `7a` sort by filename and both appear. The script prints
a `note:` line naming them. Nothing fails — the brief said gaps and collisions
are yours to manage.

**8. The index has a dark-mode block.**

`prefers-color-scheme: dark` swaps six CSS variables. Reading a lecture list on a
phone at night is the use case; it's legibility, not decoration. Delete the
`@media` block in `STYLE` in `build_index.py` if you'd rather it stayed light.

**9. The GitHub Pages section in the README is written conditionally.**

I couldn't verify from here whether Pages is enabled on this repo, so the README
says "if this repo is (or becomes) a Pages site". The relative-link requirement
holds either way and is enforced in the generated output.

**10. Page heading and subtitle are hardcoded at the top of `build_index.py`.**

`PAGE_HEADING = "ENGR 170 — Self-Guided Lectures"` per the brief. The subtitle
line ("Supplemental self-guided lectures and problems") is lifted from your
README's own description. Both are single constants near the top of the file.

**11. (2026-08-25, revised) The filename fallback was widened to match how you
actually name files.**

The brief specified `L##_slug.html`. In practice the files are named
`lecture 2s bond-energy-solver.html` and `lecture3s_density-solver.html`, so the
fallback never fired and both landed in Unfiled until meta tags were added by
hand. The pattern now accepts `L`, `lec`, `lect`, or `lecture` (any case),
followed by digits, an optional letter suffix, and an optional slug, with `_`,
`-`, a space, or nothing as the separator.

The guard: *something* has to say "lecture" before the digits. Without that,
any filename containing a number would be swept in. Verified non-matches:
`Lattice_notes`, `lecture-notes`, `notes_lecture3`, `2s_density`,
`lecturer-bio`. Meta tags still take precedence over all of it.

**12. Default branch assumed to be `main`.**

The workflow triggers on pushes to `main`, which matches this repo. If that ever
changes, edit the `branches:` line in `.github/workflows/build-index.yml`.
