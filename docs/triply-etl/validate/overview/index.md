---
title: "Validate: Overview"
path: "/docs/triply-etl/validate/overview"
---

TriplyETL is able to automatically validate the linked data that is created in your ETL pipeline.  In fact, Triply believes that *every* ETL should include a validation step to ensure that only valid data is published in knowlede graphs.

## Two approaches

TriplyETL supports two approaches for validating linked data:

- [**Graph Comparison**](/docs/triply-etl/validate/graph-comparison) uses one or more manually created 'gold records'.  Graph comparison ensures that these records are transformed in the intended way by the ETL pipeline.
- [**SHACL Validation**](/docs/triply-etl/validate/shacl) uses a generic data model.  SHACL Validation ensures that each individual record is processed in accordance with the generic data model.

Notice that it is possible to combine these two approaches in the same ETL pipeline: you can use graph comparison to test for specific conformities, and use SHACL to test for generic conformities.
