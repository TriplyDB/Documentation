[TOC]

# Validate

The **Validate** step ensures that the linked data a pipeline produces conforms to the requirements specified in the data model. Every ETL should include the Validate step to ensure that only valid data is published in knowledge graphs.

```mermaid
graph LR
  sources -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> destinations

  linkStyle 4 stroke:red,stroke-width:3px;
  destinations[("D. Destinations\n(TriplyDB)")]
  ld[C. Internal Store]
  record[B. Record]
  sources[A. Data Sources]
```

TriplyETL supports the following two approaches for validating linked data:

- [**Graph Comparison**](./graph-comparison.md) uses one or more manually created 'gold records'. Graph comparison ensures that these records are transformed in the intended way by the ETL pipeline.
- [**SHACL Validation**](./shacl.md) uses a generic data model. SHACL Validation ensures that each individual record is processed in accordance with the generic data model.
- [**Value Validation**](./validators.md) 

Notice that it is possible to combine these two approaches in the same ETL pipeline: you can use graph comparison to test for specific conformities, and use SHACL to test for generic conformities.
