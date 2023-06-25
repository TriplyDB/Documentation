---
title: "4. TriplyETL: Enrich"
path: "/docs/triply-etl/enrich"
---

The **Enrich** step uses linked data that is asserted in the Internal Store to derive new linked data.

```mermaid
graph LR
  source -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> tdb

  linkStyle 3 stroke:red,stroke-width:3px;
  ld[Internal Store]
  record[Record]
  source[Data Sources]
  tdb[(Triple Store)]
```

If you do not have linked data in your internal store yet, then first perform one of the following steps:
- **1. Extract** allows you to load linked data into your internal store directly, using the [loadRdf()](/docs/triply-etl/extract/formats#loadRdf) function.
- [3. **Assert**](/docs/triply-etl/assert) uses entries from your record to make linked data assertions into your internal store.

TriplyETL supports the following enrichment approaches:

- 4A. [**SHACL Rules**](/docs/triply-etl/enrich/shacl) are able to apply SPARQL Ask and Construct queries to the internal store.
- 4B. [**SPARQL Update**](/docs/triply-etl/enrich/sparql) allows linked data to be added to and deleted from the internal store.
