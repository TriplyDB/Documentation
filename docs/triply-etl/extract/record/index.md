[TOC]

# Record

When a TriplyETL is connected to one of more data sources, a stream of **Records** will be generated. Records use a generic representation that is independent of the format used in the data sources.



## The generic Record

We illustrate the representation of the generic Record with the following code snippet. This snippet uses extractor [fromJson()](/triply-etl/extract/formats#extractor-fromjson) to extract data from [inline JSON](/triply-etl/extract/types#inline-json) source data:

```ts
import { Etl, fromJson, logRecord } from '@triplyetl/etl/generic'
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

Debug function [logRecord()](/triply-etl/debug#function-logrecord) prints the current record to standard output. When this pipeline is run, the two inline records are printed as follows:

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

Notice that TriplyETL adds two keys to both records: `$recordId` and `$environment` (see [Special Key](#special-keys) for more information).

Now suppose that we change the source system. We no longer use inline JSON, but a local XML file. The contents of the XML file are as follows:

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

Let us change the TriplyETL script to use extractor [fromXml()](/triply-etl/extract/formats#extractor-fromxml) and the [local file](/triply-etl/extract/types#local-files) source type:

```ts
import { Etl, fromXml, logRecord } from '@triplyetl/etl/generic'
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

Notice that the two records that are logged from an XML source are completely identical to the two records that were previously logged from a JSON source. This is an essential property of TriplyETL: it treats data from any source system in the same way, using the same intermediary Record format.

This makes it easy to write pipelines that process data from a large number of different data sources. This also makes replacing a data source in one format with a data source in another format a relatively cheap operation. More often than not, only the source extractor needs to be changed, and all transformations and assertions remain as they were.



## Extractor `loadRecords()`

The `loadRecords()` function allows us to run a sub ETL and store its records to the main ETL. It is used when we would like to add additional data from different source to the main ETL. 

 The function expects two arguments and can be run with the following snippet:

 - `fromSrc` - The Source to load the data from. The list of available extractors can be seen in [Data Formats overview page](/triply-etl/extract/formats/#overview). 
 - `key` - A new key where the records are stored.

```ts
loadRecords(fromSrc, 'key'),
```

It is important to call the `loadRecords()` function **after** loading record data in the main ETL.

The following code snippet extracts records from a json object (main ETL), then extracts records from a json file (`tableMap.json`) stored as an asset and stores them in the key `_table` in the record of the main ETL:

```ts
 fromJson({ country: 'be' }),

 loadRecords(fromJson(Source.TriplyDb.asset('test', { name: 'tableMap.json' })), '_table'),
```
The combined record looks as following: 

```json
{
  "country": "be",
  "$recordId": 1,
  "$environment": "Development",        
  "_table": [
    {
      "be": "http://ex.com/Belgium",    
      "nl": "http://ex.com/Netherlands",
      "de": "http://ex.com/Germany",    
      "en": "http://ex.com/England",
      "$recordId": 1,
      "$environment": "Development",
      "$fileName": "tableMap.json"
    }
  ]
}

```



## Special keys

Records in TriplyETL contain several special keys. These special keys start with a dollar sign character (`$`). The special keys contain values that are inserted during the Extract step. These special keys can be used in the same way as regular keys in your TriplyETL configuration. We now discuss these special keys in detail.


### Special key `$recordId`

The special key `$recordId` assigns a unique number to every record that is processed in one single run of a TriplyETL pipeline.

If the source data does not change, multiple runs of the TriplyETL pipeline will always generate the same record IDs. However, if source data changes, multiple runs of the TriplyETL pipeline may generate different record IDs for the same record.

#### Use case: Unique identifiers

The first main use case of the `$recordId` key is to create IRIs that are unique within one single run of a TriplyETL pipeline.

Suppose the following table is our source data:

| First name | Last name |
| ---------- | --------- |
| John       | Doe       |
| Jane       | Doe       |
| John       | Doe       |

We need to create an IRI for every person in this table. Notice that the table contains no unique properties: there are two different persons with the same first and last name. This means that we cannot use the keys "First name" and "Last name" in our record in order to create our IRIs. Luckily, the source connector adds the `$recordId` for us:

```json
{
  "First name": "John",
  "Last name": "Doe",
  "$recordId": 1
}
{
  "First name": "Jane",
  "Last name": "Doe",
  "$recordId": 2
}
{
  "First name": "John",
  "Last name": "Doe",
  "$recordId": 3
}
```

This allows us to make the following assertion:

```ts
pairs(iri(prefix.id, '$recordId'),
  [a, sdo.Person],
  [sdo.givenName, 'First name'],
  [sdo.familyName, 'Last name'],
),
```

Which results in the following linked data:

```turtle
id:1
  a sdo:Person;
  sdo:givenName 'John';
  sdo:familyName 'Doe'.

id:2
  a sdo:Person;
  sdo:givenName 'Jane';
  sdo:familyName 'Doe'.

id:3
  a sdo:Person;
  sdo:givenName 'John';
  sdo:familyName 'Doe'.
```

Notice that the use of the `$recordId` results in a correct single run of the TriplyETL pipeline. But if the source data changes, the IRIs may change as well. For example, if the first and second row in the source table are swapped, the IRI that denotes "Jane Doe" will change from `id:2` to `id:1`.

#### Use case: Debugging

When you are debugging the configuration of a TriplyETL pipeline, it is sometimes useful to perform a specific actions for a specific record. Assuming the stream of records is stable during the debugging effort, the `$recordId` key can be used to perform such a debugging action; for example:

```ts
whenEqual('$recordId', 908, logRecord()),
```

Do note that it is generally better to run the TriplyETL for a specific record using the `--from-record-id 908 --head 1` command line flags (see [CLI](/triply-etl/cli)).



## Special key `$environment`

The TriplyETL record contains special key `$environment`. Its value denotes the DTAP environment that the pipeline is currently running in. This is one of the followin values: "Development", "Test", "Acceptance", or "Production".




## Special key `$sheetName`

The special key `$sheetName` only occurs in records that original from data source that use the Microsoft Excel format. In such records, this special key contains the name of the sheet from which the record originats.

See [the documentation for the Microsoft Excel format](/triply-etl/extract/formats/#extractor-fromxlsx) for more information about this special key.
