---
title: "Triply ETL: Getting Started"
path: "/docs/triply-etl/getting-started"
---

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

By adding the following five components, you configure the pipeline to create a linked data knowledge graph for your organization:

1. **Declarations** declare IRI prefixes, graph names, and vocabularies that are used in the pipeline configuration.
2. **Source Connectors** connect to the systems that add source data to your knowledge graph.
3. **Transformations** clean, modify, and enrich the source data.
4. **Assertions** generate the linked data that goes into the knowledge graph.
5. **Validation** ensures that the linked data that is added to the knowledge graph follows your data model.
6. **Publication** makes the linked data knowledge graph available in a triple store.

These six components occur in specific places inside the TripleETL main loop, as indicated by the comments in the following code snippet:

```ts
import { Ratt as Etl } from '@triplydb/ratt'
// 1. Declarations are made before the main loop.
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    // 2. Source Connectors appear at the top.
    // 3. Transformations appear in the middle.
    // 4. Assertions appear in the middle.
    // 5. Validation occurs directly before publication.
    // 6. Publication appears at the bottom.
  )
  return etl
}
```
