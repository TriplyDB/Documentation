---
title: "TriplyDB Changelog"
path: "/docs/triplydb-changelog"
---

[TOC]

## 24.08.2 {#24.08.2}

**Features**

- `#8929` Added the display name of the user who created a version to the list of query versions
- `#9399` The class frequencies have been added to Graphs page of a dataset. The Class frequency tab under Insights is still available but is deprecated. This will be removed in a future release
- `#9400` The Copy dataset button has been moved from the Dataset panel to a drop-down menu instead. This makes it consistent with actions on saved queries and stories

**Issues fixed**

- `#9565` Failing uploads aren't reported to users in real-time
- `#9507` [SPARQL-IDE] The edit dialog of the Google chart visualization has incorrect styling
- `#9271` [SPARQL-IDE] Incorrect coloring for SPARQL variables that are used after the `WHERE` clause and are not projected outward

## 24.08.1 {#24.08.1}

**Features**

- `#9388` Improved navigation of the admin settings pages
- `#9453` [SPARQL-IDE] Increased the maximum pitch in the geo visualization
- `#8495` [Speedy] Support more Coordinate Reference Systems

**Issues fixed**

- `#9483` When paginating over the results of a saved query, in certain cases the limit of a subselect is wrongfully removed

## 24.08.0 {#24.08.0}

**Issues fixed**

- `#9328` Captions to query visualizations in stories are too wide
- `#9428` [SPARQL-IDE] API variables that are used in the query string are incorrectly colored

## 24.07.1 {#24.07.1}

**Features**

- `#8928` [SPARQL-IDE] Improved usability of the gallery visualization with customization of keywords
- `#8587` [Speedy] Improved the performance of queries that use arbitrary length path matching by 5-100x
- `#9035` [Speedy] Added support for federating to internal or private Speedy SPARQL endpoints on the same instance, given the necessary permissions
- `#9380` Improved the look and feel of the dataset panel to accommodate upcoming features

**Issues fixed**

- `#9371` Changing a query in a data story does not update the query result
- `#9385` [Speedy] Using SHACL SPARQL functions in combination with a `LIMIT` clause returned an error
- `#9395` [Speedy] In a rare instance, query reordering produces incorrect results

## 24.07.0 {#24.07.0}

**Features**

- `#9191` [Speedy] Added support for using SHACL SPARQL functions defined within a dataset
- `#7003` [Speedy] Added support for the `x` and `q` flags, in the `regex()` and `replace()` functions
- `#9051` [SPARQL-IDE] Added a button to auto-format SPARQL queries

**Issues fixed**

- `#9330` Using saved query variables sometimes creates a syntactically invalid query
- `#9173` Unclear error message when upload JSON-LD files with an invalid IRI

## 24.06.1 {#24.06.1}

**Features**

- `#9122` [Speedy] Added support for the `units` vocabulary in the GeoSPARQL functions `geof:distance` and `geof:buffer`

**Issues fixed**

- `#9298` Unable to upload files from a URL with many redirects
- `#9312` SPARQL results in CSV and TSV formats incorrectly handle escape characters in literals
- `#9237` [SPARQL-IDE] Repair messages do not signify their actions well enough
- `#9122` [Speedy] GeoSPARQL functions `geof:sfWithin`, `geof:sfOverlaps` and `geof:sfTouches` did not support complex polygons

## 24.06.0 {#24.06.0}

**Issues fixed**

- `#9212` [SPARQL-IDE] Unused variables are sometimes displayed incorrectly on first load
- `#9214` [SPARQL-IDE] Unexpected syntax error for a valid query

## 24.05.1 {#24.05.1}

**Features**

- `#9081` [SPARQL-IDE] Support for a JSON-LD visualization is now more prominent
- `#9146` [SPARQL-IDE] Added informative hints for SPARQL queries that return 0 results

**Issues fixed**

- `#9083` Parallel LD-uploads cause conflicting graphs

## 24.05.0 {#24.05.0}

**Features**

- `#9063` [Speedy] Added support for `geof:buffer` GeoSPARQL functions

**Issues fixed**

- `#8960` Inconsistent formatting notation for numbers
- `#9174` [SPARQL IDE] Saved Query editor crashes when a JSON-LD Frame is applied

## 24.04.1 {#24.04.1}

**Features**

- `#9136` [SPARQL-IDE] Added support for rendering gLTF 3D models
- `#9059`-`#9062` [Speedy] Added support for `geof:distance`, `geof:minZ`, `geof:maxZ` and `geof:boundary` GeoSPARQL functions

**Issues fixed**

- `#9114` TriplyDB reports valid IRIs as invalid when they contain atypical characters
- `#9152` Virtuoso SPARQL service exhibits different querying behaviour after sync operation
- `#9160` [SPARQL-IDE] Chart visualization not working for certain SPARQL responses

## 24.04.0 {#24.04.0}

**Features**

- `#9050` Added a button to display the available keyboard shortcuts for the SPARQL-IDE
- `#9055`-`#9058` [Speedy] Added support for `geof:sfWithin`, `geof:sfOverlaps`, `geof:sfTouches` and `geof:aggBoundingBox` GeoSPARQL functions

**Issues fixed**

- `#9048` [SPARQL-IDE] Non-string literals were not accepted as valid
- `#9005` [SPARQL-IDE] Variable auto-complete not working in `BIND` clause
- `#9068` [SPARQL-IDE] Query can be executed when there is no service available
- `#9053` [SPARQL-IDE] Saved query view shows "large result" dialog when not applicable


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
