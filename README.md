# Documentation for TriplyDB

This repository contains the TriplyDB documentation files.  These files are used by the Triply documentation website over at <https://triply.cc/docs>.

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

This website uses [MkDocs](https://www.mkdocs.org/) to convert Markdown to HTML so the documentation can be viewed in a web browser. Follow the instructions on their website to install MkDocs.

Required plugins:
- To render `mermaid` you will need to install [this plugin](https://github.com/fralau/mkdocs-mermaid2-plugin).

The following steps often work/suffice:
1. Install Python and Pip.
2. Run `pip install mkdocs`
3. Run `pip install mkdocs-mermaid2-plugin`

## Building and running the Documentation website

After you have successfully installed MkDocs, you can run a local web server with the following command (run from the toot of this repository):
```bash
mkdocs serve
```

To build a static HTML website for deployment, run this command:
```bash
mkdocs build
```
This will generate the required HTML and CSS in a folder `./site`.

To publish this website to [Github Pages](https://triplydb.github.io/Documentation/) run this command:
```bash
mkdocs gh-deploy
```

### Notes about syntax highlighting
This project uses [highlightjs.org](https://highlightjs.org) for rendering code blocks with syntax highlighting. This projects does not have support for Turtle/SPARQL by default. We use a custom build to provide syntax highlighting for these.

```bash
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
cp build/demo/styles/intellij-light.css <path-to-this-repo>/css
```
