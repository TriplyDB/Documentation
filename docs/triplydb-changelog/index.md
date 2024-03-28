---
title: "TriplyDB Changelog"
path: "/docs/triplydb-changelog"
---

[TOC]

## 24.03.1 {#24.03.1}

**Features**

- `#8580` Added saved query execution status in the TriplyDB administrator view
- `#8798` Improved the performance when navigating to most queries and stories, by proactively caching query results
- `#8580` [Speedy] Added support for `xsd:negativeinteger`, `xsd:positiveInteger`, `xsd:nonNegativeInteger` and `xsd:nonPositiveInteger` casting functions
- `#8681` [Speedy] Improved query performance when federating to a public dataset on the same TriplyDB instance
- `#9000` [SPARQL-IDE] Unreferenced variables are now identifiable by their colour
- `#9028` [SPARQL-IDE] Improved the rendering of polygons on a map and map interactions on mobile devices

**Issues fixed**

- `#8601` [SPARQL-IDE] Unexpected auto-complete after operator
- `#8954` [SPARQL-IDE] SPARQL IDE shows 2D data in tilted view
- `#9004` [SPARQL-IDE] LD-frame editor doesn't show icon to display the entire query
- `#9006` [SPARQL-IDE] Auto-indent references the next line instead of the previous line
- `#9029` [SPARQL-IDE] Unactionable warning for some plugins in stories


## 24.03.0 {#24.03.0}

**Issues fixed**

- `#8600` [SPARQL-IDE] Automatically inserted brackets caused syntax errors
- `#8999` [SPARQL-IDE] Editor inserts duplicate prefix declarations when comments are used
- `#8780` [Speedy] Queries with `LIMIT` statements took longer to execute than expected

## 24.02.2 {#24.02.2}

**Features**

- `#8659` [SPARQL-IDE] Show a notification when a SPARQL result set contains unrecognized geographic shapes
- `#8868` [Speedy] Improved the performance of some aggregates queries.
- `#8834 / #8892` [SPARQL-IDE] More errors are now validated by the SPARQL IDE. For example, nested aggregates (`count(count(...))`) now report as an error.
- `#8834` TriplyDB supports query annotations. An TriplyDB SPARQL annotation looks like this:
    ```
    #! cache: false
    ```
    This annotation makes ensure that the TriplyDB cache is bypassed.




**Issues fixed**

- `#8913` [Speedy] Some arithmetic SPARQL functions return 0 results
- `#8598` [SPARQL-IDE] Triggering context menu behaves odd when one is already open
- `#8660` [SPARQL-IDE] QGIS does not recognized the an exported shapefile
- `#8918` Some small services fail to consistently start



## 24.02.1 {#24.02.1}

**Features**

- `#8795` Support use of the `<style></style>` attribute in markdown and HTML (used in dataset/account/query descriptions, or by the SPARQL  IDE)
- `#8796` Support different size dimensions for story elements



**Issues fixed**

- `#8720` Invalid saved-query variables are not validated in the stories UI
- `#8792` [SPARQL-IDE] A combination of the pivot table and google charts visualization may not render
- `#8779` [SPARQL-IDE] Multiline errors are not rendered correctly
- `#8690` [Speedy] Some atypical queries with large group-by's may result in an error
- `#8606` [Speedy] Some valid regular expressions throw an error
- `#8765` [Speedy] Federating to virtuoso does not work in some cases
- `#8749` Syncing a service may fail when there are many concurrent requests
- `#8686` Syncing a service may fail after a service is renamed
- `#8793` [SPARQL IDE] The gallery image-widget result (populated by the `?imageWidget` variable) is not shown when printing a story




## 24.02.0 {#24.02.0}

**Features**

- `#7616` Render skolemized IRIs better
- `#8728` [SPARQL IDE] Improved ui for rendering grouped geo shapes


**Issues fixed**

- Speedy may return too many results when using a `FROM` clause 
- `#8695 #8602 #8603 #8770` [SPARQL IDE] Fixed UX issues with tabs and autocompletion



## 24.01.0 {#24.01.0}

**Features**
- `#8502` [SPARQL IDE] Add confirmation mechanisms in the browser to avoid the browser rendering too much information. This avoids issues where the browser is rendered unresponsive


**Issues fixed**

- `#8584` Insufficient request validation using the saved-query API
- `#8092` Dataset metadata may report wrong number of statements for atypical uploads
- `#8364` Uploads with combinations of atypical invalid IRIs may result in an error
- `#8697` [SPARQL IDE] Changing the network visualization may result in an client-side error
- `#8588` Saved queries with an LD-Frame always show up as modified and in draft state



## 23.12.1 {#23.12.1}

**Features**

- `#4209` Add queries overview page for TriplyDB administrators   
- `#8494` Improve UX for service selection in saved queries by removing the option for selecting one specific service. This option was unintuitive and not recommended. Instead, using a service type is recommended (and not the only available option).
- `#8558` `#8556`:[SPARQL speedy] Improve performance of queries with `filter not exists` and `optionals` by 30% to 180%.



**Issues fixed**

- `#8584` Uninformative error message when using terms autocompletion API
- `#8512` Uninformative error message when requesting elasticsearch mapping information during a sync operation



## 23.12.0 {#23.12.0}

**Features**

- `#8224` [SPARQL IDE] Replace the current SPARQL editor with SPARQL IDE. The new SPARQL IDE will be gradually enabled on all TriplyDB deployments.
    - The editor and result visualization have a slightly different look
    - Added shortcuts for powerusers (press `<ctrl>-?` on the SPARQL IDE page to show them)
    - Performance improvements when writing larger queries
    - Consolidated the visualizations: the geo 3d plugin is now combined with the regular geo plugin, and the markup visualization is now part of the gallery visualization.
    - The new editor is backwards compatible with the old editor.
    - The geo-events plugin (where geographic information can be rendered as a timeline) is deprecated and not present in the SPARQL IDE.
- `#8420` `#8457` [SPARQL speedy] Improve performance of most SPARQL queries with 40% to 200%
- `#8504` Improve UX for service selection in saved queries: the type of a manually created service has precendence now over speedy
- `#8456` Support in the UI for deleting all dataset assets
- `#8481` Include link to changelog in the footer of all TriplyDB pages


## 23.11.1 {#23.11.1}

**Features**

- `#8266` Automatic date detection and indexing in Elasticsearch

**Issues fixed**

- `#8459` Unable to upload instance logo
- `#8444` Virtuoso service becomes unresponsive for atypical SPARQL query
- `#8414` [SPARQL speedy] Querying non-existent graph may result in an error
- `#8415` [SPARQL speedy] Query with service clause and filter may result in an error



- `#8256` Jena concistently fails to start for a specific dataset
- `#8371` The LD-Browser does not render an image, even though an image is present in the describe result.


## 23.11.0 {#23.11.0}

**Features**

- `#8324` Added quick-actions for changing the saved-query access level from the stories page. These quick-actions are shown when the story access level is incompatible with the saved-query access level (e.g., the story is public, but a saved-query is private)
- `#8308` [SPARQL Speedy] Support for the [geof:area](https://opengeospatial.github.io/ogc-geosparql/geosparql11/spec.html#_function_geofarea) function 
- `#8309` [SPARQL Speedy] Support for the [geof:transform](https://opengeospatial.github.io/ogc-geosparql/geosparql11/spec.html#_function_geoftransform) function 

**Issues fixed**

- `#8352` Setting custom mapping in Elasticsearch may result in default mappings getting ignored
- `#8326` Setting invalid custom mappings for Elasticsearch results in uninformative error
- `#8256` Jena concistently fails to start for a specific dataset
- `#8371` The LD-Browser does not render an image, even though an image is present in the describe result.
