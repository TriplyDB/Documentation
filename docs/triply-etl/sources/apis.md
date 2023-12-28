[TOC]

# APIs

The URL source type can also be used to extract records from online endpoints and APIs.

The following code snippet extracts records from a TriplyDB REST API:

```ts
fromJson(Source.url('https://api.triplydb.com/datasets')),
```


### Raw SPARQL endpoints

SPARQL endpoints are online APIs. The following code snippet issues a raw SPARQL query against a public SPARQL endpoint. Since we specified CSV as the result set format (Media Type `text/csv`), the result set can be accessed as any other CSV source:

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
- reliable retrieval of large result sets
- API variables
- versioning

These features are all supported by [TriplyDB queries](#triplydb-queries). It is therefore simpler and safer to use TriplyDB queries. Still, when used outside of production systems, raw SPARQL endpoints can still be used as regular web APIs.
