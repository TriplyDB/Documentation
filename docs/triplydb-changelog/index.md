---
title: "TriplyDB Changelog"
path: "/docs/triplydb-changelog"
---

[TOC]

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
