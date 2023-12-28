[TOC]

# Local files

Local files are files that are on the same computer that the TriplyETL pipeline runs on. TriplyETL supports local files with the `Source.file()` function.



## Basic usage

Local files are declared by using the `Source` object, which is imported in the following way:

```ts
import { Source } from '@triplyetl/etl/generic'
```

The following code snippet uses a local JSON file. The local file is used by the [fromJson() extractor](../extract/json.md):

```ts
fromJson(Source.file('./static/example.json')),
```


## Multiple local files

It is possible to specify one or more local files, by using array notation. The following code snippet extracts records from a large number of local JSON files:

```ts
fromJson(Source.file([
  './static/data-001.json',
  './static/data-002.json',
  ...,
  './static/data-999.json',
])),
```



## Production systems

Local files are not typically used in production systems. The reason for this is that it is difficult to guarantee that all project partners have exactly the same local files on their respective computers. The risk of using outdated files, and the overhead of securely sharing files with multiple team members, are often sufficient reason to use [TriplyDB Assets](./triplydb-assets.md) instead.
