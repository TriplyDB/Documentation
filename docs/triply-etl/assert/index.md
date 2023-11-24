[TOC]

# Assert

The **Assert** step uses data from the Record to add linked data to the Internal Store.

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

Assertion are statements of fact.  In linked data, assertions are commonly called 'triples' or 'quads'.  A triple is composed of three parts: a subject term, a predicate term, and an object term.  A quad or quadruple also has a fourth graph term.

## Overview

TriplyETL supports the following assertion approaches:

- 3A. **RATT** (RDF All The Things) contains a core set of TypeScript functions for making linked data assertions:
    - [RATT Term Assertions](ratt/term): functions that are used to assert terms (IRIs or literals).
    - [RATT Statement Assertions](ratt/statement): functions that are used to assert statements (triples or quads).
<!--
- 3B. [**JSON-LD**](/triply-etl/assert/json-ld) can be used to assert data according to a JSON-LD Context.
-->

- 3B. [**RML**](../rml) inserts the data that has been transformed (from a non-RDF format into RDF triples) into the store.
- 3C. [**XSLT**](../xslt) inserts the data that has been transformed (from XML to XML or RDF) using stylesheet parameter in `loadRdf()` function into the store 
## Next steps

After linked data has been asserted into the Internal Store, the following steps can be preformed:

- [4. **Enrich**](../enrich/) improves or extends linked data in the Internal Store.
- [5. **Validate**](../validate) ensures that linked data in the Internal Store is correct.
- [6. **Publish**](../publish) makes linked data available in a Triple Store for others to use.
