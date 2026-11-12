# portfolio-v4: notes for agents

How to work in this repository. For how the `docs/` wiki is kept, see `docs/CLAUDE.md`.

## House style: no em dashes in UI copy

Never write an em dash (U+2014, "—") in anything a visitor can read. That covers string literals,
JSX text, template strings, `alt` and `aria-label` text, page titles and descriptions, JSON-LD, and
every data file under `src/data/` (services, projects, scrapbook, the woozyx3 messages, résumé
content). Rewrite with the punctuation that fits the sentence:

- an aside: commas or parentheses
- an explanation or list: a colon
- two thoughts: a period, then start a new sentence
- a label before a message ("Ryan, thanks for..."): a comma
- a title with a subtitle: a colon

Hyphens (`-`) and en dashes (`–`, for ranges such as 2025–2026) are fine.

**Enforced by lint.** `eslint.config.mjs` fails on an em dash (including `—`, `&mdash;`,
`&#8212;` and `&#x2014;`) in any string literal, template string or JSX text. Code comments are not
checked and may keep them. `npx eslint src` must pass; do not disable the rule to get a change in.

**Not covered by lint:** binary files. `public/resume/Demaceo_Vincent_Howard_Resume.pdf` currently
contains one em dash and has to be fixed in its source document and re-exported.
