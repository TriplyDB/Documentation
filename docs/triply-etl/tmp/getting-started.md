[TOC]

# Getting started
## Transforming RDF data

If you have RDF data that does not need to be transformed, see [copying source data](https://triply.cc/docs/ratt-working-with-ratt#function-direct-copying-of-source-data-to-destination).
If you have RDF data that _does_ need to be transformed, you can use the following pattern. This example renames the graph.

```ts
const etl = new Etl({ defaultGraph: graph.model })
etl.use(
  loadRdf(Source.file(`data/shapes.trig`)),
  mapQuads(
    (quad, ctx) => ctx.store.quad(
      quad.subject,
      quad.predicate,
      quad.object,
      iri(prefix.graph, 'new-graph')
    )
  ),
  toRdf(Destination.TriplyDb.rdf('my-dataset', remoteOptions))
)
```

Similarly, you can change all the subject, predicates or objects in your data.

Also, you can choose to transform triples of a specific subject, predicate, object or graph name. in this case, you should use:

```ts
mapQuads(
  (quad, ctx) => ctx.store.quad(
    quad.subject,
    app.prefix.example('new-predicate'),
    quad.object,
    quad.graph
  ),
  {predicate: app.prefix.example("old-predicate")}
)
```

## Connect a data source

This section extends the pipeline from [the previous section](#publish-to-triplydb) by connecting a data source. TriplyETL can connect to database systems and web APIs, but to keep things simple we will use the following tabular input data from a local file:

| ID    | NAME  |
| ----- | ----- |
| 00001 | Anna  |
| 00002 | Bob   |
| 00003 | Carol |

We then perform the following steps to build a pipelines that processes this data source:

1\. Create a text file called `example.csv` in a text editor, and copy/paste the following source data into that file:

```csv
ID,NAME
00001,Anna
00002,Bob
00003,Carol
```

2\. Open text file `main.ts` and add the following content:


```ts
import { Etl, declarePrefix, fromCsv, iri, literal, rdfs,
        Source, toRdf, triple } from '@triplyetl/etl/generic'
import { rdfs } from '@triplyetl/etl/vocab'

export default async function (): Promise<Etl> {
  const etl = new Etl({
    prefixes: {
      ex: declarePrefix('https://example.com/'),
    },
  })
  etl.use(
    // Connects the tabular source data to the pipeline.
    // Every row in the table is processed as a TriplyETL record.
    fromCsv(Source.file('example.csv')),
    // Create a linked data statement that is based on the
    // source data.
    triple(iri(etl.prefix.ex, 'ID'), rdfs.label, 'NAME'),
    toRdf(Destination.file('example.ttl'))
  )
  return etl
}
```

<!--
// Create a universally unique identifier (IRI) based
// on the value in the 'ID' column and the declared
// 'person' prefix.

// Create a string literal based on the value in the
// 'NAME' column.
-->

3\. Transpile the code with:


```sh
npm run build
```

4\. Run the ETL with:


```sh
npx etl
```

The TriplyETL script will give you a link to the uploaded dataset. This dataset contains the following graph content:




## Important terms before starting to work with TriplyETL

### Middlewares

The most common occurrence in ETL are the middlewares. Middlewares are essentially reusable pieces of code that execute a certain long and/or complex piece of functionality. An middleware is a piece of code that transforms a record and can be invoked with app.use().

Example of middleware function:

```ts
loadRdf(Source.TriplyDb.query('my-account', 'my-query')),
```

### What is a record?

TriplyETL doesn't have infinite memory and not all data can be loaded at once. So instead of loading data all at once, first one part of data is processed and written to the file, and then the second one, third one, and so on. These parts are called records. Each record goes through all middlewares before a new record is started.

### What is the store?

As mentioned above, when ETL is running we go through data record by record. Together with the input data we also have output data. Before being written to the final destination (triplyDB or file), output data has to be kept somewhere and that's what store  is for. The store is for temporarily storing linked data. Every record has its own store.
toRdf reads from the store.

```ts
etl.use(
  toRdf(Ratt.Destination.file('example.ttl'))
)
```

### What is the context(ctx)?

In TriplyETL, the context is an object that represents the current record. The context gives us access to the triple store, the in memory storage of our triples. It also contains utility functions that will be used to modify and transform our source data into linked data. Some examples of ctx:

```ts
ctx.getString("address")
ctx.getIri(...)
ctx.getArray(...)
ctx.store.addQuad(...)
ctx.store.getQuad(...)
//etc.
```



## A JSON data source

The following code snippet uses extractor [fromJson()](#fromJson) with two inline example records:

```ts
import { fromJson, logRecord, Etl } from '@triplydb/etl/generic'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([
      { id: '123', name: 'John' },
      { id: '456', name: 'Jane' },
    ]),
    logRecord(),
  )
  return etl
}
```

Debug function `logRecord()` prints the current record to standard output. When this pipeline is run, the two records are printed as follows:

```json
{
  "id": "123",
  "name": "John",
  "$recordId": 1,
  "$environment": "Development"
}
{
  "id": "456",
  "name": "Jane",
  "$recordId": 2,
  "$environment": "Development"
}
```

Notice that TriplyETL adds two keys to both records: `$recordId` and `$environment` (see [Special Key](#special-keys)).



## An XML data source

Now suppose that we change the source system. We no longer use in-line JSON, but will instead use an XML file. The contents of the XML file are as follows:

```xml
<?xml version="1.0"?>
<persons>
  <person>
    <id>123</id>
    <name>John</name>
  </person>
  <person>
    <id>456</id>
    <name>Jane</name>
  </person>
</persons>
```

Let us change the TriplyETL script to use the XML source connector:

```ts
import { Etl, fromXml, logRecord, Source } from '@triplyetl/etl/generic'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromXml(Source.file('example.xml')),
    logRecord(),
  )
  return etl
}
```

This new script logs the following two records:

```json
{
  "id": "123",
  "name": "John",
  "$recordId": 1,
  "$environment": "Development"
}
{
  "id": "456",
  "name": "Jane",
  "$recordId": 2,
  "$environment": "Development"
}
```

Notice that the two records that are logged from an XML source are completely identical to the two records that were previously logged from a JSON source. This is an essential property of TriplyETL: it treats data from any source system in the same way, using the same intermediary record format. This makes it easy to write pipelines that process data from a large number of different data sources. This also makes replacing a data source in one format with a data source in another format a relatively cheap operation. More often than not, only the source connector needs to be changed, and all transformations and assertions remain as they were.
