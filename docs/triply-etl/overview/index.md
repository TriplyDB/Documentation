---
title: "Triply ETL: Overview"
path: "/docs/triply-etl/overview"
---

TriplyETL is a software solution and online service that allows you to build ETL pipelines for creating Linked Data Knowledge Graphs.

## Core Features

TriplyETL has the following core features, that set it apart from other data pipeline products:

1. **DTAP support**: TriplyETL pipelines can run in the four [DTAP environments](https://en.wikipedia.org/wiki/Development,_testing,_acceptance_and_production) that are common in production systems: Development, Testing, Acceptance, and Production.
2. **Backend-agnostic**: TriplyETL has [Source Connectors](source-connectors) for a large number of source systems, from relational databases to spreadsheet files.  But every source connector emits records in one unified format.  This makes it easy to combine data from multiple heterogeneous sources.
3. **Extensible**: TriplyETL comes with a large set of commonly used [Transformations](transformations) and [Assertions](assertions).  These form the basic toolkit for Knowledge Graph construction.  In addition, TriplyETL allows users to define their own custom transformations and assertions in TypeScript.
4. **Scalable**: The TriplyETL [Source Connectors](source-connectors) are designed to emit a stream of self-contained records.  The TriplyETL [Transformations](transformations) and [Assertions](assertions) are designed to be able to run in parallel.  As a result, pipelines in TriplyETL can be distributed over an arbitrary number of parallel workers.  This ensures high pipeline throughput.
5. **Standards-compliant**: TriplyETL implements a large set of linked data standards.  This allows the user to write large parts of the configuration in standardized formats like [SPARQL Construct](), [SPARQL Update](), and [SHACL Rules]().  (Support for JSON-LD and RML is currently under development.)
6. **Assist the user**: Creating knowledge graphs is a difficult task.  It involves many format, standards and operations.  TriplyETL assists the user in completing this difficult task successfully.  TriplyETL ensures that the generated data follows the latest standards, best practices and canonical formats.  TriplyETL also notifies the user if the generated data does not follow the specific data model (see [Validation](validation)).

## Getting started

TriplyETL runs within a Gitlab CI environment ([Figure 1](#figure-1)).

<figure id="figure-1">
  <img src="repository.png">
  <figcaption>Figure 1: The landing page of a TriplyETL project in Gitlab.</figcaption>
</figure>

### Online or offline development

You can configure your TriplyETL pipeline online, using the Visual Studio Code editor from a web browser.  Or you can clone the repository locally to use an editor of your own liking.

If you develop and run a TriplyETL locally, you need to install Node.js 16 or later.

### The main loop

The following code snippet shows the main TriplyETL loop.  Every TriplyETL pipeline consists of such a loop.

```ts
import { Ratt as Etl } from '@triplydb/ratt'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
  )
  return etl
}
```

By adding the following five components, you configure the pipeline to create a Knowledge Graph for your organization:

1. Declarations: declare the prefixes, graph names, and vocabulary that will be used in the pipeline.
2. Source Connectors: connect to the systems that add source data to the Knowledge Graph.
3. Transformations and Assertions: clean/modify/enrich the source data and create linked data assertions that go into the Knowledge Graph.
4. Validation: ensures that data that is added to the Knowledge Graph follows your data model.
5. Publication: makes the Knowledge Graph available in a triple store.

These five components occur in specific places inside the TripleETL main loop, as indicated by the five comments in the following code snippet:

```ts
import { Ratt as Etl } from '@triplydb/ratt'
// 1. Declarations (prefixes, graphs, vocabulary) go here.
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    // 2. Source Connectors appear at the top.
    // 3. Transformations and assertions appear in the middle.
    // 4. Validation occurs directly before publication.
    // 5. Publication appears at the bottom.
  )
  return etl
}
```
