[TOC]

# SPARQL Construct

SPARQL Construct queries can be used to enrich the data that is in the Internal Store.

The following full TriplyETL script loads one triple into the Internal Store, and then uses a SPARQL Construct query to add a second triple:

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
