---
title: "1B. Extract: Source types"
path: "/docs/triply-etl/extract/types"
---

This page documents the different data source types that can be used in TriplyETL:

| Source type                             | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| [Local files](#local-files)             | Local files that contain data.              |
| [Online files](#online-files)           | Online files that contain data.             |
| [APIs](#apis)                           | APIs that return data.                      |
| [TriplyDB assets](#triplydb-assets)     | Files stored in TriplyDB ('Assets').        |
| [TriplyDB datasets](#triplydb-datasets) | Linked datasets stored in TriplyDB graphs.  |
| [TriplyDB queries](#triplydb-queries)   | Saved queries in TriplyDB that return data. |
| [Inline JSON](#inline-json)             | A JSON object or an array of JSON objects.  |
| [Strings](#strings)                     | A string serialization of data.             |



## Local files

The following code snippet extracts records from a local file that uses the [JSON format](/docs/triply-etl/extract/formats#json):

```ts
fromJson(Source.file('./static/example.json')),
```

It is possible to specify an arbitrary number of local files by using array notation:

```ts
fromJson(Source.file([
  './static/data-001.json',
  './static/data-002.json',
  ...,
  './static/data-999.json',
])),
```

Notice that local files are not typically used in production systems, since it is difficult to guarantee that all project partners have exactly the same local files on their computer.

The risk of using outdated files and the overhead of securely sharing local files with multiple team members are often sufficient reasons to use other source types instead.



## Online files {#online-files}

The following code snippet connects to a JSON source that is stored in a publicly accessible location on the Internet:

```ts
fromJson(Source.url('https://somewhere.com/example.json')),
```

If needed, you can configure details about how the HTTP request should be made made.  This can be done with the optional options parameter.  All options provided by the [node-fetch library](https://github.com/node-fetch/node-fetch#options) can be used.

For example, the following requests private data that is accessed using basic authentication with username and password:

```ts
fromJson(Etl.Source.url(
  'https://somewhere.com/example.json',
  {
    request: {
      headers: {
        Authorization: `Basic ${username}:${password}`
      }
    }
  }
)),
```


### Use in production systems

Online files are typically not used in production pipelines, because the availability of many Internet resources is outside of the control of the project team.  Internet resources that are not maintained by team members may be subject to content-wise changes, which may affect the production pipeline.

If the project team controls the Internet resources, then risks are smaller.  But at that point it is even better to upload the online files as [TriplyDB asset](#triplydb-assets) for additional benefits such as access controls.



## APIs

The URL source type can also be used to extract records from online endpoints and APIs.

The following code snippet extracts records from a TriplyDB REST API:

```ts
fromJson(Source.url('https://api.triplydb.com/datasets')),
```


### Raw SPARQL endpoints

SPARQL endpoints are online APIs.  The following code snippet issues a raw SPARQL query against a public SPARQL endpoint.  Since we specified CSV as the result set format (Media Type `text/csv`), the resultset can be accessed as any other CSV source:

```typescript
fromCsv(
  Source.url(
    'https://dbpedia.org/sparql',
    {
      request: {
        headers: {
          accept: 'text/csv',
          'content-type': 'application/query-string',
        },
        body: 'select * { ?s ?p ?o. } limit 1',
        method: 'POST',
      },
    }
  )
)
```

#### Use in production systems

Raw SPARQL endpoints lack several features that are essential for use in production systems:
- secure access control
- pagination
- reliable retrieval of large resultsets
- API variables
- versioning

These features are all supported by [TriplyDB queries](#triplydb-queries).  It is therefore simpler and safer to use TriplyDB queries.  Still, when used outside of production systems, raw SPARQL endpoints can still be used as regular web APIs.



## TriplyDB assets {#triplydb-assets}

Assets are a core feature of TriplyDB.  Assets allow arbitrary files to be stored in the context of a linked dataset.  A typical use case for assets is to upload (new versions of) source files.  The TriplyETL pipeline can pick the latest versions of these source files and publish the resulting linked data in the the same dataset.

The following code snippet uses a JSON source that is stored in a TriplyDB asset:

```ts
fromJson(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.json' }
  )
),
```

As with other TriplyDB sources, the account name is optional.  When omitted, the user account that is associated with the current API Token is used:

```ts
loadRdf(
  Source.TriplyDb.rdf('my-dataset', { name: 'example.json' })
),
```

As with other source type, multiple assets can be specified:

```ts
fromCsv([
  Source.TriplyDb.asset('my-dataset', { name: 'table1.csv' }),
  Source.TriplyDb.asset('my-dataset', { name: 'table2.csv' }),
]),
```


### Filtering

If the asset name is omitted, *all* assets are returned.  This is often unpractical, since only some assets must be processed.  For example, if a dataset has PDF and JSON assets, only the latter should be processed by the `fromJson()` source extractor.

For such use cases the `filter` option can be used instead of the `name` option.  The `filter` option takes a TypeScript function that maps assets names onto Boolean values (true or false).  Only the assets for which the function returns truth are included.

The following snippet processes all and only assets whose name ends in `.json`:

```ts
fromJson(
  Source.TriplyDb.asset(
    'my-dataset',
    { filter: name => name.endsWith('json') }
  )
),
```


### Versioning

It is possible to upload new versions of an existing TriplyDB asset.  When no specific version is specified, a TriplyETL pipeline will use the latest version automatically.  In order to use a specific version, the `version` option can be set to a version number.

The following snippet uses a specific version of an asset:

```ts
fromJson(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.json', assetVersion: 2 }
  )
),
```


### Access

Since TriplyDB assets are part of a TriplyDB dataset:
- they are accessible under the same access level as the rest of the dataset, and
- they are accessible with the same API Token that allows linked data to be published in that dataset.

Notice that this makes it *easier* and *safer* to deal with source data that is not public.  When private data is retrieved from [online files](#online-files) or [APIs](#apis), authorization information must be configured at the HTTP level.  This is possible but cumbersome.  And, depending on the authentication approach, it is required to create a new API Token and securely configure that in addition to the TriplyDB API Token.

Notice that access also is more *transparent* when TriplyDB assets are used.  All and only collaborators that have access to the TriplyDB dataset also have access to the source data.  It is clear for all collaborators which source files should be used, and which versions are available.  This is more transparent than having to share (multiple versions of) source files over email or by other indirect means.


### TriplyDB instance {#triplydb-option}

By default, assets are loaded from the TriplyDB instance that is associated with the currently used API Token.  In some situations it is useful to connect to a linked dataset from a different TriplyDB instance.  This can be configured with the `triplyDb` option.

The following snippet loads the OWL vocabulary from TriplyDB.com.  Notice that the URL of the API must be specified; this is different from the URL of the web-based GUI.

```ts
loadRdf(
  Source.TriplyDb.rdf(
    'w3c',
    'owl',
    { triplyDb: { url: 'https://triplydb.com' } }
  )
),
```

If an asset is part of a non-public dataset, specifying the URL is insufficient.  In such cases an API Token from this other TriplyDB instance must be created and configured using the `token` option in combination with the `url` option.


### Compression

Source data is often text-based.  This means that such source data can often be compressed to minimize storage space and/or Internet bandwidth.

TriplyETL provides automatic support for the GNU zip (file name extension `*.gz`) compression format.

The following snippet uses a TriplyDB assets that was compressed with GNU zip (file extension `*.gz`):

```ts
fromCsv(
  Source.TriplyDb.asset('my-dataset', { name: 'example.csv.gz' })
),
```



## TriplyDB datasets

Datasets in TriplyDB store linked data in one or more graphs.  Such datasets can be loaded as a TriplyETL source.  The following snippet loads a dataset from TriplyDB into the internal RDF store of TriplyETL:

```ts
loadRdf(Source.TriplyDb.rdf('my-account', 'my-dataset')),
```

As with other TriplyDB sources, the account name is optional.  When omitted, a dataset from the user account that is associated with the current API Token is used:

```ts
loadRdf(Source.TriplyDb.rdf('my-dataset')),
```


### Graphs option

By default, all graphs from a linked dataset are loaded.  It is possible to specify a only those graphs that should be loaded.  The following snippet only loads the data model, but not the instance data:

```ts
loadRdf(
  Source.TriplyDb.rdf(
    'my-account',
    'my-dataset',
    { graphs: ['https://example.com/id/graph/model'] }
  )
),
```


### TriplyDB instance

The `triplyDb` option can be used to specify that a linked dataset from a different TriplyDB instance should be used.  This option works in the same way as for TriplyDB assets: [link](#triplydb-option)



## TriplyDB queries

Saved SPARQL queries in TriplyDB can be used as data sources.  SPARQL queries are very powerful data sources, since they allow complex filters to be expressed.  There are 4 SPARQL query forms, with different source extractors that can process their results:

| Query form                       | Source extractor          |
| -------------------------------- | ------------------------- |
| [SPARQL `ask`](#ask)             | [`fromJson()`](/docs/triply-etl/extract/formats#json), [`fromXml()`](/docs/triply-etl/extract/formats#xml) |
| [SPARQL `construct`](#construct-describe) | [`loadRdf()`](/docs/triply-etl/extract/formats#rdf) |
| [SPARQL `describe`](#construct-describe)   | [`loadRdf()`](/docs/triply-etl/extract/formats#rdf) |
| [SPARQL `select`](#select)       | [`fromCsv()`](/docs/triply-etl/extract/formats#csv), [`fromJson()`](/docs/triply-etl/extract/formats#json), [`fromTsv()`](/docs/triply-etl/extract/formats#tsv), [`fromXml()`](/docs/triply-etl/extract/formats#xml) |


### SPARQL `ask` queries {#ask}

SPARQL `ask` queries return data in either the JSON or the XML format.  This allows them to be processed with the [`fromCsv()`](/docs/triply-etl/extract/formats#csv) and [`fromXml()`](/docs/triply-etl/extract/formats#xml) extractors.

The following code snippet connects to the XML results of a SPARQL `ask` query in TriplyDB:

```ts
fromXml(Source.TriplyDb.query('my-account', 'my-ask-query')),
```


### SPARQL `construct` and `describe` queries {#construct-describe}

SPARQL `construct` and `describe` queries return data in the RDF format.  This allows them to be used with the [`loadRdf()`](/docs/triply-etl/extract/formats#rdf) function.  The following snippet loads the results of a SPARQL query into the internal RDF store of TriplyETL:

```ts
loadRdf(Source.TriplyDb.query('my-account', 'my-construct-query')),
```


### SPARQL `select` queries {#select}

SPARQL `select` queries return data in either the CSV, JSON, TSV, or XML format.  This allows them to be used with the four corresponding source extractors: [`fromCsv()`](/docs/triply-etl/extract/formats#csv), [`fromJson()`](/docs/triply-etl/extract/formats#json), [`fromTsv()`](/docs/triply-etl/extract/formats#tsv), and [`fromXml()`](/docs/triply-etl/extract/formats#xml).

The following code snippet connects to the table returned by a TriplyDB `select` query:

```ts
fromCsv(Source.TriplyDb.query('my-account', 'my-select-query')),
```

As with other TriplyDB sources, the account name is optional.  When omitted, the user account that is associated with the current API Token is used:

```ts
loadRdf(Source.TriplyDb.query('my-construct-query')),
```


### Versioning

In production systems, applications must be able to choose whether they want to use the latest version of a query (acceptance mode), or whether they want to use a specific recent version (production mode), or whether they want to use a specific older version (legacy mode).

Versioning is supported by TriplyDB saved queries.  When no specific version is specified, a TriplyETL pipeline will use the latest version of a query automatically.  In order to use a specific version, the `version` option can be set to a version number.

The following snippet uses a specific version of a query:

```ts
fromJson(Source.TriplyDb.query('my-query', { version: 2 })),
```

Not specifying the `version` option automatically uses the latest version.


### API variables

In production systems, applications often need to request distinct information based on a limited set of input variables.  This is supported in TriplyDB saved queries which API variables.  API variables ensure that the query string is parameterized correctly, while adhering to the RDF and SPARQL standards.

The following example binds the `?country` variable inside the query string to literal `'Holland'`.  This allows the results for Holland to be returned:

```ts
fromCsv(
  Source.TriplyDb.query(
    'information-about-countries',
    {
      variables: {
        country: 'Holland'
      }
    }
  )
),
```

<!-- TODO
#### Dynamic API variables

In [the previous section](#api-variables) the value `'Holland'` for the API variable `country` was known at the time of writing the TriplyETL configuration.  But what do we do if the requested country is not known at the time of writing, but depends on data that is read/transformed during the execution of the TriplyETL pipeline?

In such cases we can use the following [custom middleware](/docs/triply-etl/custom-middlewares) to run the SPARQL query:

```ts
etl.use(
  async (context, next) => {
    const api_variables = {
      country: context.getString('COUNTRY')
    }
    const myQuery = await account.getQuery('my-query')
    for await (const statement of myQuery.results(api_variables).statements()) {
      statement.graph = graph('enrichment')
      context.store.addQuad(statement)
    }
    return next()
  }),
```

In the above example, different countries are specified by data values that are read dynamically from the `COUNTRY` key.  This key can be a column in a table, or an element in XML, or some other dynamic data location, depending on the data source that is used.

The following line is used to configure the graph where the results from the queries are stored:

```typescript
statement.graph = graph('enrichment')
```
-->


### Pagination

When a bare SPARQL endpoint is queried as an [online API](#apis), there are sometimes issues with retrieving the full resultset for larger queries.  With TriplyDB saved queries, the process of obtaining all results is abstracted away from the user, with the TriplyETL source performing multiple requests in the background as needed.


### Result graph

It is often useful to store the results of SPARQL `construct` and `describe` queries in a specific graph.  For example, when internal data is enriched with external sources, it is often useful to store the external enrichments in a separate graph.  Another example is the use of a query that applies RDF(S) and/or OWL reasoning.  In such cases the results of the reasoner may be stored in a specific graph.

The following snippet stores the results of the specified `construct` query in a special enrichment graph:

```typescript
loadRdf(
  Source.TriplyDb.query('my-query', { toGraph: graph.enrichment })
)
```

This snippet assumes that the graph names have been declared (see [Delcarations](/docs/triply-etl/declarations#graphs)).


### TriplyDB instance

The `triplyDb` option can be used to specify that a query from a different TriplyDB instance should be used.  This option works in the same way as for TriplyDB assets: [link](#triplydb-option)



## Strings

Data in the JSON or RDF formats can be specified with inline strings.

The following code snippet loads triples into the Internal Store:

```ts
loadRdf(Etl.Source.string(`
prefix person: <https://example.com/id/person/>
prefix sdo:    <https://schema.org/>

person:1
  a sdo:Person;
  sdo:name 'J. Doe'.`)),
```

This loads the following triples:

```mermaid
graph LR
  person:1 -- a --> sdo:Person
  person:1 -- sdo:name --> J.Doe
```

The following example makes RDF source data available to the [`validateShacl()`](/docs/triply-etl/validation) function:

```ts
validateShacl(Etl.Source.string(`
prefix sh:  <http://www.w3.org/ns/shacl#>
prefix shp: <https://example.com/model/shp/>
prefix sdo: <https://schema.org/>

shp:Person
  a sh:NodeShape;
  sh:property shp:Person_name;
  sh:targetClass sdo:Person.

shp:Person_name
  a sh:PropertyShape;
  sh:datatype xsd:string;
  sh:minLength 1;
  sh:path sdo:name.`))
```

This makes the following linked data SHACL specification available:

```mermaid
graph LR
  shp:Person -- a --> sh:NodeShape
  shp:Person -- sh:property --> shp:Person_name
  shp:Person -- sh:targetClass --> sdo:Person
  shp:Person_name -- a --> sh:PropertyShape
  shp:Person_name -- sh:datatype --> xsd:string
  shp:Person_name -- sh:minLength --> 1
  shp:Person_name -- sh:path --> sdo:name
```

The following example makes a string source available to the `fromJson()` source extractor:

```ts
fromJson(Source.string(`
[
  { id: '123', name: 'John' },
  { id: '456', name: 'Jane' }
]`)),
```

Notice that the [inline JSON](#inline-json) source is often a more intuitive specification format for the `fromJson()` source extractor than its corresponding string source.

While [inline JSON](#inline-json) and [string sources](#strings) are mostly used for small examples, local files are somewhat more widely used.



## Inline JSON

Because TriplyETL configurations are implemented in TypeScript, it is possible to specify JSON data inline with TypeScript Objects.  JSON is the only data format that be specified in such a native inline way in TriplyETL.

The following code snippet specifies two records using inline TypeScript objects:

```ts
fromJson([
  { id: '123', name: 'John' },
  { id: '456', name: 'Jane' },
]),
```

This results in the following two records:

```json
{
  "id": "123",
  "name": "John"
}
{
  "id": "456",
  "name": "Jane"
}
```

In documentation, we often use such inline JSON sources since that makes code snippets self-contained, without having to rely on external sources such as files.  In production systems this native inline source type is almost never used.
