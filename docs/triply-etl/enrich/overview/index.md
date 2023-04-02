---
title: "Enrich: Overview"
path: "/docs/triply-etl/enrich/overview"
---

The Enrich step uses linked data that is asserted in the internal store (see [Assert](/docs/triply-etl/assert/overview)) to derive new linked data.

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

TriplyETL supports the following enrichment approaches:

- [SHACL Rules](/docs/triply-etl/enrich/shacl) are able to apply SPARQL Ask and Construct queries to the internal store.
- [SPARQL Update](/docs/triply-etl/enrich/sparql) allows linked data to be added to and deleted from the internal store.
