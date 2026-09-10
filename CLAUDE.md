# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation repository for Triply products, which includes documentation for:
- **TriplyDB**: An integrated linked data environment for publishing and using linked data knowledge graphs
- **TriplyETL**: A library optimized for building production-grade linked data pipelines  
- **TriplyDB.js**: A library for automating tasks in TriplyDB instances and building applications that tap into linked data knowledge graphs

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

## Architecture and Structure

### Content Organization
- `docs/` - Main documentation content in Markdown format
- `blog/` - Blog posts organized by date (YYYY-MM-feature-name format)
- `site/` - Generated HTML output (auto-generated, don't edit)
- `readthedocs-triply/` - Custom MkDocs theme files

### Navigation Structure
The site navigation is defined in `mkdocs.yml` with a hierarchical structure:
- TriplyDB section includes getting started guides, API docs, TriplyDB-JS library docs, CLI docs, and changelog
- TriplyETL section covers the ETL pipeline stages: Sources → Extract → Transform → Assert → Enrich → Validate → Publish

### Key Files
- `mkdocs.yml` - Main configuration file defining navigation, plugins, and theme settings
- `docs/js/triply.js` - Custom JavaScript for navigation URL mappings and UI enhancements
- `requirements.txt` - Python dependencies for MkDocs plugins

### Custom Features
- Custom ID headers using `{: #custom-id}` syntax for deep linking
- Mermaid diagram support via mkdocs-mermaid2-plugin
- Custom redirects for URL changes defined in mkdocs.yml
- Custom syntax highlighting for Turtle/SPARQL using highlight.js
- Level 1 menu items with only subpages require URL mappings in triply.js

### Documentation Guidelines
- Always start pages with a level 1 heading (single #)
- Level 2 headings appear as submenu items on each page
- Use GitHub Flavored Markdown with attr_list and toc extensions
- Custom URL mappings for certain navigation items are handled in triply.js:67