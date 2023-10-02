# Enrich

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

## Overview

TriplyETL supports the following enrichment approaches:

- 4A. [**SHACL Rules**](/triply-etl/enrich/shacl) are able to apply SPARQL Ask and Construct queries to the internal store.
- 4B. [**SPARQL Update**](/triply-etl/enrich/sparql) allows linked data to be added to and deleted from the internal store.


## See also

If you do not have linked data in your internal store yet, then first perform one of the following steps:
- **1. Extract** allows you to load linked data into your internal store directly, using the [loadRdf()](/triply-etl/extract/formats#function-loadrdf) function.
- [3. **Assert**](/triply-etl/assert) uses entries from your record to make linked data assertions into your internal store.
