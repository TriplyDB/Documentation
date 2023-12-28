[TOC]

# TriplyDB Queries

Saved SPARQL queries in TriplyDB can be used as data sources. SPARQL queries are very powerful data sources, since they allow complex filters to be expressed. There are 4 SPARQL query forms, with different source extractors that can process their results:

| Query form | Source extractor |
| --- | --- |
| [SPARQL Ask](#sparql-ask-queries) | [fromJson()](../extract/json.md), [fromXml()](../extract/xml.md) |
| [SPARQL Construct](#sparql-construct-and-describe-queries) | [loadRdf()](../extract/rdf.md) |
| [SPARQL Describe](#sparql-construct-and-describe-queries) | [loadRdf()](../extract/rdf.md) |
| [SPARQL Select](#sparql-select-queries) | [fromCsv()](../extract/csv.md), [fromJson()](../extract/json.md), [fromTsv()](../extract/tsv.md), [fromXml()](../extract/xml.md) |



## SPARQL Ask queries

SPARQL Ask queries can return data in either the JSON or the XML format. This allows them to be processed with the extractors [fromCsv()](../extract/csv.md) and [fromXml()](../extract/xml.md).

The following code snippet connects to the XML results of a SPARQL Ask query in TriplyDB:

```ts
fromXml(Source.TriplyDb.query('my-account', 'my-ask-query')),
```



## SPARQL Construct and Describe queries

SPARQL Construct and Describe queries return data in the RDF format. This allows them to be used with function [loadRdf()](../extract/rdf.md). The following snippet loads the results of a SPARQL query into the internal RDF store of TriplyETL:

```ts
loadRdf(Source.TriplyDb.query('my-account', 'my-construct-query')),
```



## SPARQL Select queries

SPARQL Select queries return data in either the CSV, JSON, TSV, or XML format. This allows them to be used with the following four extractors: [fromCsv()](../extract/csv.md), [fromJson()](../extract/json.md), [fromTsv()](../extract/tsv.md), and [fromXml()](../extract/xml.md).

The following code snippet connects to the table returned by a SPARQL Select query in TriplyDB:

```ts
fromCsv(Source.TriplyDb.query('my-account', 'my-select-query')),
```

As with other TriplyDB sources, the account name is optional. When omitted, the user account that is associated with the current API Token is used:

```ts
loadRdf(Source.TriplyDb.query('my-construct-query')),
```



## Versioning

In production systems, applications must be able to choose whether they want to use the latest version of a query (acceptance mode), or whether they want to use a specific recent version (production mode), or whether they want to use a specific older version (legacy mode).

Versioning is supported by TriplyDB saved queries. When no specific version is specified, a TriplyETL pipeline will use the latest version of a query automatically. In order to use a specific version, the `version` option can be set to a version number.

The following snippet uses a specific version of a query:

```ts
fromJson(Source.TriplyDb.query('my-query', { version: 2 })),
```

Not specifying the `version` option automatically uses the latest version.



## API variables

In production systems, applications often need to request distinct information based on a limited set of input variables. This is supported in TriplyDB saved queries which API variables. API variables ensure that the query string is parameterized correctly, while adhering to the RDF and SPARQL standards.

The following example binds the `?country` variable inside the query string to literal `'Holland'`. This allows the results for Holland to be returned:

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
### Dynamic API variables

In [the previous section](#api-variables) the value `'Holland'` for the API variable `country` was known at the time of writing the TriplyETL configuration. But what do we do if the requested country is not known at the time of writing, but depends on data that is read/transformed during the execution of the TriplyETL pipeline?

In such cases we can use the following [custom middleware](/triply-etl/custom-middlewares) to run the SPARQL query:

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

In the above example, different countries are specified by data values that are read dynamically from the `COUNTRY` key. This key can be a column in a table, or an element in XML, or some other dynamic data location, depending on the data source that is used.

The following line is used to configure the graph where the results from the queries are stored:

```typescript
statement.graph = graph('enrichment')
```
-->



## Pagination

When a bare SPARQL endpoint is queried as an [online API](#apis), there are sometimes issues with retrieving the full result set for larger queries. With TriplyDB saved queries, the process of obtaining all results is abstracted away from the user, with the TriplyETL source performing multiple requests in the background as needed.



## Result graph

It is often useful to store the results of SPARQL Construct and Describe queries in a specific graph. For example, when internal data is enriched with external sources, it is often useful to store the external enrichments in a separate graph. Another example is the use of a query that applies RDF(S) and/or OWL reasoning. In such cases the results of the reasoner may be stored in a specific graph.

The following snippet stores the results of the specified `construct` query in a special enrichment graph:

```typescript
loadRdf(
  Source.TriplyDb.query('my-query', { toGraph: graph.enrichment })
)
```

This snippet assumes that the graph names have been declared (see [Delcarations](../generic/declarations.md#graph-name-declarations)).



## TriplyDB instance

The `triplyDb` option can be used to specify that a query from a different TriplyDB instance should be used. This option works in the same way as for TriplyDB assets: [link](#triplydb-instance)
