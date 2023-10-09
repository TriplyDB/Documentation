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

- **Custom ID headers**:
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

### Notes abouth syntax highlighting
This project uses [highlightjs.org](https://highlightjs.org) for rendering code blocks with syntax highlighting. This projects does not have supprt for Turtle/SPARQL by default. We use a custom build to provide syntax hightlighting for these.

Make sure to continue reading after this bash script before you run it!
```bash
mkdir Highlight.js
cd Highlight.js
git clone https://github.com/highlightjs/highlight.js.git
git clone https://github.com/highlightjs/highlightjs-turtle.git
cd highlight.js/src/languages
ln -s ../../../highlightjs-turtle/src/sparql.js
ln -s ../../../highlightjs-turtle/src/turtle.js
cd ../../
node tools/build.js turtle sparql typescript javascript
cp build/highlight.min.js <path-to-this-repo>/js
cp build/demo/styles/vs.css <path-to-this-repo>/css
```

**Important**
The files `highlightjs-turtle/src/turtle.js` and `highlightjs-turtle/src/sparql.js` require a patch before you can use them: both files have `function(hljs)` in the file, which should be changed to `export default function(hljs)`, see the following patch:

```patch
diff --git a/src/sparql.js b/src/sparql.js
index 687d33c..c16a1ce 100644
--- a/src/sparql.js
+++ b/src/sparql.js
@@ -7,7 +7,7 @@ Description: SPARQL Protocol and RDF Query Language for the semantic web
 Website: https://www.w3.org/TR/sparql11-query/, http://www.w3.org/TR/sparql11-update/, https://www.w3.org/TR/sparql11-federated-query/, http://rawgit2.com/VladimirAlexiev/grammar-diagrams/master/sparql-grammar.xhtml
 */
 
-function(hljs) {
+export default function(hljs) {
   var ttl = hljs.getLanguage('ttl').exports;
   var KEYWORDS = {
     keyword: 'base|10 prefix|10 @base|10 @prefix|10 add all as|0 ask bind by|0 clear construct|10 copymove create data default define delete describe distinct drop exists filter from|0 graph|10 group having in|0 insert limit load minus named|10 not offset optional order reduced select|0 service silent to union using values where with|0',
diff --git a/src/turtle.js b/src/turtle.js
index 1021873..d7765b1 100644
--- a/src/turtle.js
+++ b/src/turtle.js
@@ -6,7 +6,7 @@ Description: Terse RDF Triple Language for the semantic web
 Website: https://www.w3.org/TR/turtle/
 */
 
-function(hljs) {
+export default function(hljs) {
   var KEYWORDS = {
     keyword: 'base|10 prefix|10 @base|10 @prefix|10',
     literal: 'true|0 false|0',
```
