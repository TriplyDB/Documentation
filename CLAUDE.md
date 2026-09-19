# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation repository for Triply products, which includes documentation for:
- **TriplyDB**: An integrated linked data environment for publishing and using linked data knowledge graphs
- **TriplyETL**: A library optimized for building production-grade linked data pipelines  
- **TriplyDB.js**: A library for automating tasks in TriplyDB instances and building applications that tap into linked data knowledge graphs. Its documentation is *not* written here: it is generated from the library's own source and published to https://static.triply.cc/triplydb-js/, which the navigation links out to. Old in-repo URLs are kept alive by the redirects in `mkdocs.yml`.

The documentation is built using MkDocs and published to https://docs.triply.cc/.

## Common Commands

### Development and Building
The site is built with [ProperDocs](https://properdocs.org/), the maintained community fork of MkDocs, run through `uvx` so nothing needs installing first. It needs three companion packages: `mkdocs-mermaid2-plugin`, `mkdocs-redirects`, and `properdocs-theme-readthedocs` (MkDocs bundled the `readthedocs` theme, ProperDocs ships it separately). `-f mkdocs.yml` is required because ProperDocs defaults to `properdocs.yml`; the file keeps its name because the deploy workflow still builds with MkDocs.

```bash
# Serve documentation locally with strict mode (catches broken links/references)
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs properdocs serve -o -f mkdocs.yml --strict

# Build static HTML site for deployment
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs properdocs build -f mkdocs.yml
```

### Deployment
Changes pushed to the master branch automatically deploy to the live documentation site via GitHub Actions.

Changes pushed to the long-lived `next` branch — documentation for the unreleased TriplyDB version —
deploy to <https://docs.triply.cc/next/> instead. Both sites live on the same `gh-pages` branch:
`.github/workflows/main.yml` replaces everything at the root except `next/`, and
`.github/workflows/next.yml` replaces only `next/`. A `concurrency: gh-pages` group keeps the two
from pushing at once. This is why neither workflow uses `mkdocs gh-deploy --force` any more: it
replaces the entire published tree.

Because `mkdocs.yml` sets no `site_url`, every generated link is relative, which is what lets the
same build serve correctly from both `/` and `/next/`. Keep it that way — do not add `site_url`, and
write internal links as relative paths rather than as `/foo/` or `https://docs.triply.cc/foo/`, both
of which would send preview readers back to the live site.

The preview marks itself: `docs/js/triply.js` adds a notice bar when `location.pathname` starts with
`/next/`, styled at the end of `docs/css/triply.css`. It keys off the path rather than a build flag
so that both branches carry the same file and it never merge-conflicts.

Fixes for released documentation go to `master` and are merged forward into `next`; `next` is merged
into `master` at release time.

## Architecture and Structure

### Content Organization
- `docs/` - Main documentation content in Markdown format
- `blog/` - Blog posts organized by date (YYYY-MM-feature-name format)
- `site/` - Generated HTML output (auto-generated, don't edit)
- `readthedocs-triply/` - Custom MkDocs theme files

### Navigation Structure
The site navigation is defined in `mkdocs.yml`:
- TriplyDB's own pages sit at the top level, unlabelled — this site is its documentation first: getting started guides, API docs, changelog, and external links out to the generated TriplyDB-JS and CLI references (marked with an icon; see `readthedocs-triply/nav.html`)
- TriplyETL is one entry beside them, covering the ETL pipeline stages: Sources → Extract → Transform → Assert → Enrich → Validate → Publish
- Any entry with children is a section, rendered as a `<details>` branch that opens and closes; the branch holding the current page is rendered `open`

### Key Files
- `mkdocs.yml` - Main configuration file defining navigation, plugins, and theme settings
- `docs/css/triply-tokens.css` - Design tokens from the TriplyDB console; the colour block is generated output from `core/packages/console-beta/src/theme/cssVars.ts` (regenerate, don't hand-edit)
- `docs/css/triply.css` - Theme layer over the `readthedocs` theme; refer to semantic tokens (`--color-surface-*`, `--color-text-*`, `--color-fill-*`, `--color-border-*`), never to a hex or a raw `--color-brand-*`/`--color-chrome-*` ramp step
- `docs/css/triply-fonts.css`, `docs/fonts/` - Outfit and Source Code Pro, self-hosted (the console's two families)
- `docs/css/triply-highlight.css` - highlight.js token colours, mapped onto the same tokens
- `docs/js/triply.js` - Custom JavaScript for syntax highlighting and UI enhancements
- `requirements.txt` - Python dependencies for MkDocs plugins
- `SCREENSHOTS.md` - How the console screenshots in `docs/assets/` are captured: which demo instance and account to shoot from, the seeded datasets the prose depends on, the viewport conventions, and the traps. Read it before re-taking any screenshot.

### Custom Features
- Theme styled after the TriplyDB console (`core/packages/console-beta`): dark navigation panel, white content paper, pink accent
- Custom ID headers using `{: #custom-id}` syntax for deep linking
- Mermaid diagram support via mkdocs-mermaid2-plugin
- Custom redirects for URL changes defined in mkdocs.yml
- Custom syntax highlighting for Turtle/SPARQL using highlight.js
- Navigation sections are collapsible branches (`readthedocs-triply/nav.html`); a section is a toggle, not a link, so no page needs to stand in for one
- Screenshots in `docs/assets/` are captured from the new console on `demo.triplydb.com`, at a 1280x800 viewport with devicePixelRatio 2; raster images are tracked with git LFS. See `SCREENSHOTS.md`

### Documentation Guidelines
- Always start pages with a level 1 heading (single #)
- Level 2 headings appear as submenu items on each page
- Use GitHub Flavored Markdown with attr_list and toc extensions
- Custom URL mappings for certain navigation items are handled in triply.js:67