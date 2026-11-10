# portfolio-v4 -- documentation

Demaceo Vincent's portfolio: a Next.js "desktop OS" landing page whose apps open as Glass overlays.

This directory is a wiki maintained by an LLM: linked markdown pages, nothing outside the
repository. The rules are in [`CLAUDE.md`](CLAUDE.md).

## Start here

1. [[glass-overlays]] -- how every modal, AppView and the ⌘K palette are built and themed

This wiki grows as work touches new areas; uncovered areas have no page yet.

---

## concepts

_No pages yet._

## architecture

_No pages yet._

## subsystems

- [[glass-overlays]] -- Glass tokens, `.glass-scope` bridge, ModalFrame/AppView shells, ⌘K palette, icon sizing
- [[seo-indexing]] -- sitemap.xml, robots.txt, `SITE_URL` canonical host, what is deliberately not indexed

## decisions

_No pages yet._

## reference

_No pages yet._

## operations

_No pages yet._

## history

_No pages yet._

---

## Using this wiki

```
/docs-sync     right after a deploy or release -- reads only what changed since verified_at
/docs-lint     integrity check (orphans, broken links, broken sources, stale, unverified)
/docs-query    ask the docs. If it is not there, the answer says so
/docs-status   commits not yet reflected, stale pages, recent work
```

Every page carries `verified_at`, the commit it was checked against. Change code, run
`/docs-sync`.
