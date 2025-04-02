---
title: "TriplyDB Changelog"
path: "/docs/triplydb-changelog"
---

[TOC]

## 25.4.100 {#25.4.100}

**Release date:** 2025-04-03

**Features**

- `#9776` [Query jobs] Insights into the error encountered by a query job
- `#9935` [Editor] Allow a SKOS tree hierarchy without concept schemes
- `#10272` [Assets] Gracefully handle uploading an asset with an existing name in the GUI
- `#10054` [Output] Ability to export SPARQL results in more readable turtle format
- `#9768` [SPARQL UPDATE] Performance improvement when using mutations frequently

**Issues fixed**

- `#9765` [Import] XML namespaces not resolved


## 25.3.200 {#25.3.200}

**Release date:** 2025-03-20

**Features**

- `#10129` [Editor] Display a list of concept schemes when no concept is selected
- `#9768` [Graphs] General performance improvements
- `#10189` [SAML] Allow email-based user lookup

**Issues fixed**

- `#10273` [Editor] Oops something went wrong when using the editor
- `#10274` [Editor] Wrong title for property edit dialog
- `#10250` [Editor] Server error when a field was not filled in
- `#10110` [Editor] Super class / parent class cannot be cleared
- `#10269` [Editor] Wrong title in staging dialog
- `#10228` [Triples] Adding statements to the default graph does nothing
- `#10221` [Speedy] Internal performance improvement
- `#10138` [Speedy] Performance improvement for a queries containing multiple SHACL SPARQL functions
- `#10276` [Speedy] 500 error for non-compliant literal
- `#9794` [Data upload] CSV parser throws 500 error when delimiter is not consistent

## 25.3.100 {#25.3.100}

**Release date:** 2025-03-06

**Features**

- `#9896` [Editor] Improved changelog readability
- `#10229` [Datasets] Improved metadata display, added changed date
- `#10150` [Authentication] Improved SAML management
- `#10184` [Dataset] Configuration of auto-generated ID in dataset settings
- `#10131` [Triples] Improvement while filtering and creating terms

**Issues fixed**

- `#10123` [Data stories] Unexpected crashes within visualization.
- `#10116` [Saved queries] API variable dialog, autocomplete display.
- `#10169` [SPARQL-IDE] Autocompletion for literals is missing
- `#10036` [Speedy] Union variables are not translated correctly in SHACL SPARQL functions
- `#10106` [Speedy] GeoSPARQL functions do not work on polygons in different CRSes
- `#10200` [Speedy] Values clause with 2 terminating bindings does not terminate

## 25.2.200 {#25.2.200}

**Release date:** 2025-02-20

**Features**

- `#10037` [SPARQL-IDE] Query autoformat indentation behavior, we use a simple and concise indentation scheme.
- `#10067` [Editor] Configure read-only fields for the SKOS editor.
- `#10052` [Editor] Configure search fields in the data model so that users can search on user defined labels.
- `#10078` [Editor] SKOS Search performance improvements.
- `#10041` [Assets] See who uploaded an asset.
- `#9945` [Speedy] Performance of 20% of our benchmark queries increased by about 40%

**Issues fixed**

- `#10115` [Saved Queries] Autocomplete UI showed multi line options.
- `#10144` [Saved Queries] "Save as new version" appeared not to work (while it did).
- `#10057` [Speedy] SPARQL query with SHACL SPARQL functions return a 500 error
- `#10161` [Speedy] encode_for_uri is implemented incorrect
- `#10163` [Speedy] SHACL rules can not have a limit

## 25.2.100 {#25.2.100} 

**Release date:** 2025-02-06 

**Features**

- `#10094` [Editor] Show all SPARQL based constraint errors in editor
- `#10079` [Editor] Show SPARQL based constraint errors at bottom of the form
- `#10085` [Editor] Remember previous concept scheme hierarchy in the skos tree



## 25.1.200 {#25.1.200} 

**Release date:** 2025-01-23

**Features**

- New version scheme as of this release. Instead of `25.01.2`, we now release `25.1.200`.
  A patch release will be released as `25.1.201`
- `#9581` Added the ability to restore queries that would have been lost due to navigating away from (or refreshing) the query page
- `#3170` Account API tokens are now copied to the clipboard when clicked
- Improved the usability of admin tables

**Issues fixed**

- `#9716` [Speedy] Unexpected `group_concat` result when pre-bindings are used
- `#10066` [Speedy] SHACL SPARQL function is executed even when the argument to it is unbound
- `#9171` [SPARQL-IDE] Unexpected indentation after semi-colon
- `#10045` [SPARQL-IDE] Empty lines are introduced when adding prefix declarations

## 25.01.1 {#25.01.1} 

**Release date:** 2025-01-09

**Issues fixed**

- `#9929` Query jobs may incidentally hang
- `#10062` Speedy queries that use federation may now work in firewalled on-premise environments
- `#9999` Default variable values of saved queries are not always applied in query jobs

## 24.12.2 {#24.12.2} 

**Release date:** 2024-12-18

**Issues fixed**

- `#10006` Cancelling a linked data upload may result in an error
- `#9711` [SaaS] Incidental requests are dropped

## 24.12.1 {#24.12.1} 

**Release date:** 2024-12-05

**Issues fixed**

- `#9888` [Query job] Query job for very simple construct query may fail
- `#9959` [SPARQL IDE] SPARQL IDE may show same autocomplete suggestion multiple times
- `#9954` [Query job] Query jobs may get sometimes inadvertently cancelled
- `#9927` [Stories] Stories with many queries are slow to load in the browser 

## 24.11.2 {#24.11.2} 

**Release date:** 2024-11-22

**Issues fixed**

- `#9017` [Speedy] Some queries take too long when reordering/optimizing a query
- `#9780` [SaaS] Enable OCSP stapling for TLS

## 24.11.1 {#24.11.1} 

**Release date:** 2024-11-08

**Issues fixed**

- `#8878` Include correct dataset modification date for JSON schema descriptions
- `#9694` Speedy SPARQL endpoints are not included in the dataset NDE descriptions
- `#9807` Parsing of XML content assigns an incorrect datatype 
- `#9752` Parsing of XML is incorrect for escaped ampersand
- `#9718` Unintentional grey bar after renaming a graph
- `#9767` [Speedy] Incorrect n-triples serialization when handling blank nodes from external SPARQL endpoints
- `#9557` [SPARQL-IDE] Yellow marker in SPARQL Editor is incorrect. This feature has been disabled until we improve some of the rough edges in future releases.
- `#9791` [SPARQL-IDE] Error when tying to view a populated query from a gallery visualization with a query variable
- `#9774` [SPARQL-IDE] Copy shortened URL doesn't work for webkit browsers

## 24.10.2 {#24.10.2} 

**Release date:** 2024-10-25

**Issues fixed**

- `#9739` [Query jobs] Query job artifacts, exposed to system administrators, are
  incomplete
- `#9740` [Query jobs] Cannot start a query job for queries with a default variable
- `#9701` [Query jobs] A query job with invalid graph name fails at a late stage, where we
  expect it to fail early

## 24.10.1 {#24.10.1}

**Release date:** 2024-10-11

**Issues fixed**

- `#9695` [Speedy] `ORDER BY` doesn't order by the second operand if the first one is an error
- `#9658` [SPARQL-IDE] Capture position doesn't work with height settings for stories

## 24.09.2 {#24.09.2}

**Release date:** 2024-09-27

**Features**

- `#8471` Admins on a TriplyDB instance can restrict users to only one active session
- `#9148` [SPARQL-IDE] Added support for overlaying 3D tiles, from a URL, in the Geo visualization

**Issues fixed**

- `#9646` Base URI when uploading data always uses the uploading account instead of the target account
- `#9561` Saving a new version of a saved query does not always save its visualization configuration
- `#9600` When editing query metadata, the service "Speedy" is not always visible
- `#9633` [Speedy] Regression, introduced in version 24.09.1, causing fatal error when executing certain queries

## 24.09.1 {#24.09.1}

**Features**

- `#9535` [SPARQL-IDE] The camera point-of-view can be saved as part of a query, in the geo visualization. This enables more precise use in stories
- `#9527` [Speedy] Improved the user message when there are errors within a SHACL SPARQL function

**Issues fixed**

- `#9556 / #9550` [Speedy] Reordering of queries with both an OPTIONAL and ORDER BY clause did not always return the correct result
- `#9579` [Speedy] Incorrect coordinate transformation from epsg:7415 to epsg:28992 when using `geof:transform` GeoSPARQL function
- `#9528` [Speedy] Incorrect results when using a SHACL SPARQL function due to reordering
- `#9569` [Speedy] Incorrect results when using a SHACL SPARQL function with blank nodes
- `#9523` [SPARQL-IDE] Unable to export certain chart visualizations to SVG

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
