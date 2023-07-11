# Documentation for TriplyDB

This repository contains the TriplyDB documentation files.  These file are used by the Triply documentation website over at <https://triply.cc/docs>.

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

- **Custom Id headers**:
Using the following syntax you are able to assign id's to headers (without having to resort to `html`)

```md
# Header {#id}
```

## Building and running the Documentation website
This website uses [MkDocs](https://www.mkdocs.org/) to convert Markdown to HTML so the documentation can be veiwed in a webbrowser. Follow the instructions on their website to isnatll MkDocs. After you've sucessfully installed MkDocs, you can run a local webserver with the following command (run from the toot of this repository):
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

Required plugins:
- To render `mermaid` you will need to install [this plugin](https://github.com/fralau/mkdocs-mermaid2-plugin).
- Theme [Mkdocs - GitBook Theme](https://gitlab.com/lramage/mkdocs-gitbook-theme)
- Theme [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

Other dependencies:
- [Pygments](https://pygments.org) for syntax highlighting