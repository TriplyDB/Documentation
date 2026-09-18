# Documentation for TriplyDB

This repository contains the TriplyDB documentation files. These files are used by the Triply documentation website over at <https://docs.triply.cc/>.

## Covered products

This repository includes documentation for the following Triply products:

<dl>
  <dt>TriplyDB</dt>
  <dd>An integrated linked data environment for publishing and using linked data knowledge graphs.</dd>
  <dt>TriplyETL</dt>
  <dd>A library that is optimized for building production-grade linked data pipelines.</dd>
  <dt>TriplyDB.js</dt>
  <dd>A library for automating tasks in TriplyDB instances and for building applications that tap into a linked data knowledge graph.</dd>
</dl>

## Contributing

- Feel free to open issues with questions about the documentation.
- Feel free to create pull requests with adjustments or additions that you believe to be valuable.

## Available markdown

You are able to use [GitHub Flavored Markdown](https://github.github.com/gfm/). As well as the following extensions

**Custom ID headers**:
By default ID's will be created from the content of a header, allowing deep linking to them using the #hash part of a URL.
```md
## My Header
```

This will result in link `http://docs.triply.cc/path-to-file/#my-header`.

Using the following syntax you are able to assign custom id's to headers if you do not want the default ID:

```md
## My Header {: #my-custom-header-id}
```
This will result in link `http://docs.triply.cc/path-to-file/#my-custom-header-id`.

## Guideline for authors
- Always start your page with a heading of level 1 (1 hashsign)
- Subheadings of level 2 (2 hashsigns) will appear as submenu on that page
- Level 1 links in the menu that only contain subpage will not be clickable until a developer creates a mapping in `docs/js/triply.js`

## Installation

This website is built with [ProperDocs](https://properdocs.org/), the maintained community fork of MkDocs, which converts Markdown to HTML so the documentation can be viewed in a web browser. Three packages are needed alongside it:

- [mkdocs-mermaid2-plugin](https://github.com/fralau/mkdocs-mermaid2-plugin), to render `mermaid` diagrams.
- [mkdocs-redirects](https://github.com/mkdocs/mkdocs-redirects), to serve the redirects configured in `mkdocs.yml`.
- `properdocs-theme-readthedocs`, which supplies the `readthedocs` theme that `readthedocs-triply/` builds on. MkDocs bundled this theme; ProperDocs ships it separately.

The only thing you need to install yourself is [`uv`](https://docs.astral.sh/uv/getting-started/installation/). Its `uvx` command fetches ProperDocs and the three packages on first use and caches them, so nothing is installed system-wide and there is no environment to activate.

Do not install with a bare `pip install`. On most current Linux distributions and on Homebrew Python that fails with `error: externally-managed-environment`, because the system Python refuses global installs ([PEP 668](https://peps.python.org/pep-0668/)).

## Building and running the Documentation website

Run these commands from the root of this repository. To start a local web server that reloads whenever you edit a page:

```sh
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs properdocs serve -o -f mkdocs.yml
```

Add `--strict` to turn warnings, such as links that point at a page or anchor that does not exist, into build errors:

```sh
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs properdocs serve -o -f mkdocs.yml --strict
```

To build a static HTML website for deployment, run this command:

```sh
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs properdocs build -f mkdocs.yml
```
This will generate the required HTML and CSS in a folder `./site`.

`-o` opens the site in a browser once the first build finishes. It is worth having: ProperDocs does print `Serving on http://127.0.0.1:8000/`, but as the last of roughly eighty lines of INFO output, so it is easy to miss.

The `-f mkdocs.yml` flag is needed because ProperDocs looks for `properdocs.yml` by default. The configuration file keeps its current name because the deployment workflow builds with MkDocs and expects `mkdocs.yml`; without the flag ProperDocs still finds it, but logs a notice that the fallback will eventually be removed.


To publish this website, push your changes to the master branch. The live documentation site should be updated shortly after that. If there are any errors, you can find more details in [the GitHub Actions](https://github.com/TriplyDB/Documentation/actions).

### The `next` branch

Documentation for a TriplyDB version that has not been released yet goes on the long-lived `next`
branch, which publishes to <https://docs.triply.cc/next/> instead of to the live site. Both sites
are served from the same `gh-pages` branch: `master` owns everything at the root, `next` owns the
`next/` subdirectory, and neither deploy touches the other's files.

- Writing about an unreleased feature? Branch off `next` and merge back into `next`.
- Correcting documentation for a version that has shipped? That goes to `master`, and `master` is
  merged into `next` afterwards so the preview does not fall behind.
- Releasing? Merge `next` into `master`. The content becomes the live documentation on the next
  deploy, and `next` continues from there.

Every page of the preview carries a notice along the bottom of the window saying which site it is
and linking to the live one. It is added by `docs/js/triply.js` when the path starts with `/next/`,
so the file stays identical on both branches. The preview is also kept out of search results by
`docs/robots.txt` and a `noindex` meta tag the deploy injects.

### Notes about syntax highlighting
This project uses [highlightjs.org](https://highlightjs.org) for rendering code blocks with syntax highlighting. This projects does not have support for Turtle/SPARQL by default. We use a custom build to provide syntax highlighting for these.

```sh
mkdir Highlight.js
cd Highlight.js
git clone https://github.com/highlightjs/highlight.js.git
git clone https://github.com/mightymax/highlightjs-turtle.git
cd highlight.js/src/languages
ln -s ../../../highlightjs-turtle/src/sparql.js
ln -s ../../../highlightjs-turtle/src/turtle.js
cd ../../
node tools/build.js turtle sparql typescript javascript
cp build/highlight.min.js <path-to-this-repo>/js
```

The colours are not taken from highlight.js' own themes: `docs/css/triply-highlight.css` maps its
token classes onto the design tokens in `docs/css/triply-tokens.css`, so code here is highlighted the
way the TriplyDB query editor highlights it.

### Notes about the theme

The site follows the TriplyDB console's design. Three stylesheets carry that, loaded in this order
(see `extra_css` in `mkdocs.yml`):

- `docs/css/triply-fonts.css` — Outfit and Source Code Pro, self-hosted from `docs/fonts/`.
- `docs/css/triply-tokens.css` — the console's design tokens. The colour block is generated from
  `core/packages/console-beta/src/theme/cssVars.ts`; regenerate it there rather than editing it
  here, so the documentation cannot drift from the product.
- `docs/css/triply.css` — the theme layer over MkDocs' `readthedocs` theme. It refers to the
  semantic tokens (`--color-surface-*`, `--color-text-*`, `--color-fill-*`, `--color-border-*`)
  only, never to a hex or to a raw `--color-brand-*`/`--color-chrome-*` ramp step.
