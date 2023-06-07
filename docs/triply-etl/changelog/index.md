---
title: "TriplyETL: Changelog"
path: "/docs/triply-etl/changelog"
---

The current version of TriplyETL **2.0.5**

# Changes in TriplyETL 2.0.5

Release date: 2023-05-25

## [Changed] New default engine for SPARQL Construct

The default engine for evaluating SPARQL Construct queries (function [construct()](/docs/triply-etl/enrich/sparql)) has changed from Comunica to Speedy. Speedy is a new SPARQL implementation that is developed by Triply; Comunica is an open source engine that is developed by the open source community. Since SPARQL is a standardized query language, this change should not cause a difference in behavior for your ETL pipelines.

In the unexpected case where an ETL pipeline *is* negatively affected by this change, the old situation can be restored by explicitly configuring the Comunica engine:

```ts
import { construct } from '@triplyetl/etl/sparql'

construct(Source.TriplyDb.query('my-query'), { sparqlEngine: 'comunica' }),
```

The benefit of switching to the Speedy engine is that this engine is expected to be faster for most queries. Overall, this change will result in speed improvements for your TriplyETL pipelines.

## [Added] New debug function logMemory()

A new debug function [logMemory()](/docs/triply-etl/debug#logMemory) is added. This prints an overview of the current memory usage of TriplyETL. This function can be used to detect memory bugs.

## [Added] New CLI tool for comparing graphs

The new CLI tool [compare](/docs/triply-etl/cli#tools-compare) allows graph comparison to be performed from the command-line. This uses the same algorithm that is used by the [compareGraphs()](/docs/triply-etl/validate/graph-comparison) validator function.

FIX: issues #127, #167, #160, #169,

# Changes in TriplyETL 2.0.4

# Changes in TriplyETL 2.0.3

# Changes in TriplyETL 2.0.2

# Changes in TriplyETL 2.0.1
