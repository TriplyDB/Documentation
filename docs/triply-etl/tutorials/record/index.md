---
title: "TriplyETL Tutorials: Record"
path: "/docs/triply-etl/tutorials/record"
---

In this tutorial you learn how to use the generic record representation that is used by TriplyETL.

## A JSON data source

The following code snippet uses the [`fromJson`](#fromJson) connector with two inline example records:

```ts
import { fromJson, logRecord, Ratt as Etl } from '@triplydb/ratt'
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

Function `logRecord()` prints the current record to standard output.  When this pipeline is run, the two records are printed as follows:

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

Now suppose that we change the source system.  We no longer use in-line JSON, but will instead use an XML file.  The contents of the XML file are as follows:

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
import { fromXml, logRecord, Ratt as Etl } from '@triplydb/ratt'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromXml(Etl.Source.file('example.xml')),
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

Notice that the two records that are logged from an XML source are completely identical to the two records that were previously logged from a JSON source.  This is an essential property of TriplyETL: it treats data from any source system in the same way, using the same intermediary record format.  This makes it easy to write pipelines that process data from a large number of different data sources.  This also makes replacing a data source in one format with a data source in another format a relatively cheap operation.  More often than not, only the source connector needs to be changed, and all transformations and assertions remain as they were.


## Special keys

TODO

## Apply a transformation

TODO

## Next steps

TODO
