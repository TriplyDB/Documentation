[TOC]

# TriplyDB Assets

Assets are a core feature of TriplyDB. Assets allow arbitrary files to be stored in the context of a linked dataset. A typical use case for assets is to upload (new versions of) source files. The TriplyETL pipeline can pick the latest versions of these source files and publish the resulting linked data in the the same dataset.

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

As with other TriplyDB sources, the account name is optional. When omitted, the user account that is associated with the current API Token is used:

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


## Filtering

If the asset name is omitted, *all* assets are returned. This is often unpractical, since only some assets must be processed. For example, if a dataset has PDF and JSON assets, only the latter should be processed by the `fromJson()` source extractor.

For such use cases the `filter` option can be used instead of the `name` option. The `filter` option takes a TypeScript function that maps assets names onto Boolean values (true or false). Only the assets for which the function returns truth are included.

The following snippet processes all and only assets whose name ends in `.json`:

```ts
fromJson(
  Source.TriplyDb.asset(
    'my-dataset',
    { filter: name => name.endsWith('json') }
  )
),
```


## Versioning

It is possible to upload new versions of an existing TriplyDB asset. When no specific version is specified, a TriplyETL pipeline will use the latest version automatically. In order to use a specific version, the `version` option can be set to a version number.

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


## Access

Since TriplyDB assets are part of a TriplyDB dataset:
- they are accessible under the same access level as the rest of the dataset, and
- they are accessible with the same API Token that allows linked data to be published in that dataset.

Notice that this makes it *easier* and *safer* to deal with source data that is not public. When private data is retrieved from [online files](#online-files) or [APIs](#apis), authorization information must be configured at the HTTP level. This is possible but cumbersome. And, depending on the authentication approach, it is required to create a new API Token and securely configure that in addition to the TriplyDB API Token.

Notice that access also is more *transparent* when TriplyDB assets are used. All and only collaborators that have access to the TriplyDB dataset also have access to the source data. It is clear for all collaborators which source files should be used, and which versions are available. This is more transparent than having to share (multiple versions of) source files over email or by other indirect means.


## TriplyDB instance

By default, assets are loaded from the TriplyDB instance that is associated with the currently used API Token. In some situations it is useful to connect to a linked dataset from a different TriplyDB instance. This can be configured with the `triplyDb` option.

The following snippet loads the OWL vocabulary from TriplyDB.com. Notice that the URL of the API must be specified; this is different from the URL of the web-based GUI.

```ts
loadRdf(
  Source.TriplyDb.rdf(
    'w3c',
    'owl',
    { triplyDb: { url: 'https://triplydb.com' } }
  )
),
```

If an asset is part of a non-public dataset, specifying the URL is insufficient. In such cases an API Token from this other TriplyDB instance must be created and configured using the `token` option in combination with the `url` option.


## Compression

Source data is often text-based. This means that such source data can often be compressed to minimize storage space and/or Internet bandwidth.

TriplyETL provides automatic support for the GNU zip (file name extension `*.gz`) compression format.

The following snippet uses a TriplyDB assets that was compressed with GNU zip (file extension `*.gz`):

```ts
fromCsv(Source.TriplyDb.asset('my-dataset', { name: 'example.csv.gz' })),
```
