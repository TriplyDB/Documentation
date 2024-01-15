[TOC]

# SPARQL Construct

SPARQL Construct queries can be used to enrich the data that is in the Internal Store.

The following full TriplyETL script loads one triple into the Internal Store, and then uses a SPARQL Construct query to add a second triple:

## Signature

This function has the following signature:

```ts
construct(query, opts?)
```

## Parameters

* `query`: is a query string, this can be a SPARQL query string, reference to a query file, or an operation on the Context (`(ctx: Context) => string|string[]`). The aforementioned can query arguments can also be provided in an array of arguments for the `query` parameter.
* `opts`: an optional object containing options for SPARQL Construct
  * `toGraph`: an optional argument to store the construct query results provided graph, defaults to the ETL's default graph.

## Example Usage

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, loadRdf, Source } from '@triplyetl/etl/generic'
import { construct } from '@triplyetl/etl/sparql'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    loadRdf(Source.string('<s><p><o>.')),
    construct('construct { ?o ?p ?s. } where { ?s ?p ?o. }'),
    logQuads(),
  )
  return etl
}
```

This results in the following linked data:

```turtle
<s> <p> <o>.
<o> <p> <s>.
```
