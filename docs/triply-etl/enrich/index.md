[TOC]

# Enrich

The **Enrich** step uses linked data that is asserted in the [internal store](../generic/internal-store.md) to derive new linked data.

```mermaid
graph LR
  sources -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> destinations

  linkStyle 3 stroke:red,stroke-width:3px;
  destinations[("D. Destinations\n(TriplyDB)")]
  ld[C. Internal Store]
  record[B. Record]
  sources[A. Data Sources]
```

TriplyETL supports the following languages for making enrichments:

- [**SHACL Rules**](./shacl/index.md) allows the implementation of business rules that can add linked data to the internal store. TriplyETL supports the following forms of SHACL Rules:

    - [**Triple Rules**](./shacl/triple-rules.md)
    - [**SPARQL Rules**](./shacl/sparql-rules.md)

- SPARQL is a query language that can also be used to add and remove data. This allows SPARQL to be used as an enrichment language. TriplyETL supports the following forms of SPARQL enrichment:

    - [**SPARQL Construct**](./sparql/construct.md) allows linked data to be added to the internal store.
    - [**SPARQL Update**](./sparql/update.md) allows linked data to be added to and deleted from the internal store.



## See also

If you have not loaded any linked data in your Internal Store yet, use one of the following approaches to do so:

- [loadRdf()](../extract/rdf.md)
- [JSON-LD Expansion](../assert/json-ld.md)
- The RATT [statement assertion](../assert/ratt/statements.md) functions.
