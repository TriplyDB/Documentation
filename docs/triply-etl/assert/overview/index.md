---
title: "Assert: SPARQL"
path: "/docs/triply-etl/assert/overview"
---

The Assert step uses data from the record to add linked data to the internal store.  Assertion are statements of fact.

```mermaid
graph LR
  source -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> tdb

  linkStyle 2 stroke:red,stroke-width:3px;
  ld[Internal Store]
  record[Record]
  source[Data Sources]
  tdb[(Triple Store)]
```

Assertions are sometimes called 'triples' in linked data, since they are composed of three parts: subject, predicate, and object.

TriplyETL supports the following assertion approaches:

- [JSON-LD](/docs/triply-etl/assert/json-ld) includes an Expansion algorithm that allows a JSON-LD context to be applied to the record, and it includes a Deserialization algorithm that allows linked data to be generated (= asserted) based on the Expanded record.
- [RATT assertions](/docs/triply-etl/assert/ratt) are a set of commonly used assertion functions.
