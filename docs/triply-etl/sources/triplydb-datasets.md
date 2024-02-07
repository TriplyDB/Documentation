## TriplyDB datasets

Datasets in TriplyDB store linked data in one or more graphs. Such datasets can be loaded as a TriplyETL source. The following snippet loads a dataset from TriplyDB into the internal RDF store of TriplyETL:

```ts
loadRdf(Source.TriplyDb.rdf('my-account', 'my-dataset')),
```
as well as:

```ts
loadRdf(Source.TriplyDb.rdf('test', { triplyDb: { url: 'https://api.nightly.triplydb.com' } })),

```
As with other TriplyDB sources, the account name is optional. When omitted, a dataset from the user account that is associated with the current API Token is used:

```ts
loadRdf(Source.TriplyDb.rdf('my-dataset')),
```



## Graphs option

By default, all graphs from a linked dataset are loaded. It is possible to specify a only those graphs that should be loaded. The following snippet only loads the data model, but not the instance data:

```ts
loadRdf(
  Source.TriplyDb.rdf(
    'my-account',
    'my-dataset',
    { graphs: ['https://example.com/id/graph/model'] }
  )
),
```



## TriplyDB instance

The `triplyDb` option can be used to specify that a linked dataset from a different TriplyDB instance should be used. This option works in the same way as for TriplyDB assets: [link](#triplydb-instance)
