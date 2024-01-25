---
title: "TriplyDB Changelog"
path: "/docs/triplydb-changelog"
---

[TOC]


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
