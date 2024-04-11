[TOC]

# Sources

TriplyETL **Sources** are locations that hold data that can be extracted with one or more [TriplyETL extractors](../extract/index.md).

```mermaid
graph LR
  sources -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> destinations

  style sources fill:#f9f,stroke:#333,stroke-width:4px
  destinations[("D. Destinations\n(TriplyDB)")]
  ld[C. Internal Store]
  record[B. Record]
  sources[A. Data Sources]
```

The following kinds of sources are supported:

- [APIs](./apis.md)
- [Inline JSON](./inline-json.md)
- [Inline strings](./inline-strings.md)
- [Local files](./local-files.md)
- [Online files](./online-files.md)
- [TriplyDB Assets](./triplydb-assets.md)
- [TriplyDB Datasets](./triplydb-datasets.md)
- [TriplyDB Queries](./triplydb-queries.md)
