---
title: "Triply ETL: Source Connectors"
path: "/docs/triply-etl/source-connectors"
---

TriplyETL Source Connectors allow one or more backend systems to be connected to your TriplyETL pipeline.

## A simple example

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

## Sources {#sources}

In the simple example, source data was specified in-line.  This is a special feature of the `fromJson()` source connector.  We often use such in-line data in our documentation examples, since it makes code snippets self-container.  In real pipelines data is not specified in-line but originates from one of the following sources:

- [Local file](#local-file)
- [TriplyDB Asset](#triplydb-asset)
- [Online file](#online-file)

### Local file

The following connects to a JSON source that is stored in a local file:

```ts
fromJson(Etl.Source.file('./static/example.json')),
```

### TriplyDB Asset

The following connects to a JSON source that is stored in a TriplyDB Asset:

```ts
fromJson(Etl.Source.TriplyDb.asset('some-account', 'some-dataset', { name: 'example.json' })),
```

TriplyDB Assets are a storage facility in TriplyDB that allows storage of arbitrary files, including source data files.  Assets have many benefits over using [local files](#local-file) or generic [online files](#online-file):

- **Shareable**: TriplyDB Assets can be added to the same TriplyDB Dataset that a TriplyETL pipeline publishes in.  This means that collaborators that work on the same pipeline automatically have access to the relevant source files.
- **Secure**: TriplyDB Assets are accessible under the same access restrictions as the TriplyDB Datasets to which they belong.  This means that source files are shared in a secure way.
- **Versioned**: TriplyDB Assets are versioned.  If a new version of the same source file becomes available, this file can be uploaded to the same TriplyDB Asset.  If there are problems with a newer source file, your collaborators are always able to temporarily roll back to using an earlier version of the source data.
- **Transparent**: All collaborators have access to the same TriplyDB Assets.  This makes it transparent which source files should be used, and which versions are available.  This is much more transparent than having to share (versions of) files over email or by other indirect means.
- **Backed-up**: TriplyDB instances that are maintained by Triply are also backed up regularly.  This includes the source files that are uploaded as TriplyDB Assets.  This is much more secure than storing source files on a local laptop that can break, or where files can get lost otherwise.

### Online file {#online-file}

The following connects to a JSON source that is stored in a publicly accessible location on the Internet:

```ts
fromJson(Etl.Source.url('https://somewhere.com/example.json')),
```

If you want to connect to *non-public* online sources, use [TriplyDB Assets](#TriplyDB-Asset) instead.

## Source Connectors {#source-connectors}

TriplyETL has the following Source Connectors:

| Source Connector  | Format                            | Standard |
| ----------------- | --------------------------------- | -------- |
| `fromCsv()`       | Comma-Separated Values (CSV)      | [IETF RFC 4180](https://www.ietf.org/rfc/rfc4180.html) |
| `fromJson()`      | JavaScript Object Notation (JSON) | RFC |
| `fromOai()`       | Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) | [OAI](https://www.openarchives.org/pmh/) |
| `fromShapefile()` | ESRI Shapefiles                   |      |
| `fromTsv()`       | Tab-Separated Values (TSV)        | [IANA](https://www.iana.org/assignments/media-types/text/tab-separated-values) |
| `fromXlsx()`      | Microsoft Excel (XLSX)            | todo |
| `fromXml()`       | XML Markup Language (XML)         | W3C  |

### Comma-Separated Values (CSV) {#csv}

Comma Separated Values (file name extension `.csv`) is a popular formats for storing tabular source data.  TriplyETL has a dedicated `fromCsv()` connector for such sources.

The following code snippet connects to a local CSV source file:

```ts
etl.use(
  fromCsv(Etl.Source.file('data.csv')),
)
```

The following code snippet connects to an online CSV source file:

```ts
etl.use(
  fromCsv(Etl.Source.url('https://somewhere.com/data.csv')),
)
```

The following code snippet shows connects to a [TriplyDB Asset](#triplydb-asset):

```ts
etl.use(
  fromCsv(
    Etl.Source.TriplyDb.asset(
      'some-account',
      'some-dataset',
      { name: 'example.csv' }
    )
  ),
)
```

#### Customization

By default, the `fromCsv()` connector implements the official CSV standard: [IETF RFC 4180](https://www.ietf.org/rfc/rfc4180.html).  It is possible to change this default behavior by specifying numerous options to the `fromCsv()` connector.

Notice that the popular Tab-Separate Values (TSV) format is not the same as the standardized CSV format with a tab character as the field separator.  If you want to process standards-conforming TSV source data, use the [`fromTsv()` connector](#tsv) instead.

#### Record representation

TriplyETL treats every row in a CSV source as one record.  The columns are emitted as key and the cells are emitted as values.  All values are of type `string`.  Cells that contain the empty string are treated as denoting an empty value and are excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys or values in the record.

For example, the following table:

| ID | Name      | Age |
| -- | --------- | --- |
|  1 | Doe, John |  32 |
|  2 | D., Jane  |     |

can be expressed by the following CSV snippet:

```txt
ID,Name,Age
1,"Doe, John",32
2,"D., Jane ",
```

which is emitted as the following two TriplyETL records:

```json
{
  "ID": "1",
  "Name": "Doe, John",
  "Age": "32"
}
{
  "ID": "2",
  "Name": "D., Jane"
}
```

Notice that:
- All values have type `string`, including `"ID"` and `"Age"`.  The value for field `"Age"` should probably be considered numeric, but the CSV format cannot express this.  A TriplyETL [transformation](#transformations) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding CSV cell contains the empty string, which is considered to denote an empty value.

### JavaScript Object Notation (JSON) {#json}

JSON (JavaScript Object Notation) is a popular open standard for interchanging tree-shaped data.  TriplyETL has a dedicated `fromJson()` connector for this format.

The following code snippet connects to a JSON source that is stored as a [TriplyDB Asset](#triplydb-asset):

```ts
etl.use(
  fromJson(
    Etl.Source.TriplyDb.asset(
      'account',
      'dataset',
      { name: 'example.json.gz' }
    )
  ),
)
```

The following example uses an in-line specified JSON source:

```ts
etl.use(
  fromJson([{ a: "a", b: "b", c: "c" }]),
)
```

### Microsoft Excel (XLSX) {#excel}

Microsoft Excel (file name extension `.xlsx`) is a popular format for storing tabular source data.  TriplyETL has a dedicated `fromXlsx()` connector for such sources.

The following code snippet shows how a [TriplyDB Assets](#triplydb-asset) is used to process records from an Excel source:

```ts
etl.use(
  fromXlsx(
    Etl.Source.TriplyDb.asset(
      'some-account',
      'some-dataset',
      { name: 'example.xlsx' }
    )
  ),
)
```

The `fromXlsx()` connector emits one record per row in the source file.

#### Sheets

It is common for Excel files to have multiple sheets.  By default the `fromXlsx()` connector enumerate all rows from all sheets as records.  If only some sheets should be used, this can be specified as a configuration option.

The following code snippet only emits rows from the `'people'` and `'projects'` sheets in the Excel source file `'example.xlsx'`.  Rows from other sheets in the same Excel file are not emitted:

```ts
fromXlsx(
  Etl.Source.file('example.xlsx'),
  { sheetNames: ['people', 'projects'] }
)
```

### Protocol for Metadata Harvesting (OAI-PMH) {#oai-pmh}

In the GLAM domain (Galleries, Libraries, Archives, Museums) the Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) is a popular mechanism for publishing data collections.  TriplyETL includes the `fromOai()` connector to tap into these data collections.

The `fromOai()` connector ensures a continuous stream of data records.  Under the hood, this connector uses resumption tokens to iterate over large collections.

An OAI-PMH endpoint can be configured by specifying its URL (parameter `url`).  Since one OAI-PMH endpoint typically publishes multiple datasets, it is also common to specify the `set` parameter.

The following code snippet connects to an example dataset that is published in an example OAI-PMH endpoint:

```ts
etl.use(
  fromOai({
    url: 'https://somewhere.com/webapioai/oai.ashx',
    set: 'some-dataset',
  })
)
```

TriplyETL implements the [OAI-PMH standard](https://www.openarchives.org/pmh/).

### Tab-Separated Values (TSV) {#tsv}

Tab-Separated Values (file name extension `.tsv`) is a popular format for tabular source data.  TriplyETL has a `fromTsv()` connector to support this format.

The following code snippet shows how a [TriplyDB Asset](#triplydb-asset) is used to process records from a TSV source:

```ts
etl.use(
  fromTsv(
    Etl.Source.TriplyDb.asset('some-account', 'some-dataset', { name: 'example.tsv.gz' })
  ),
)
```

TriplyETL enforces the [IANA](https://www.iana.org/assignments/media-types/text/tab-separated-values) standard definition of the TSV format.

#### Record representation

TriplyETL treats every row in a CSV source as one record.  The columns are emitted as key and the cells are emitted as values.  All values are of type `string`.  Cells that contain the empty string are treated as denoting an empty value and are excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys or values in the record.

For example, the following table:

| ID | Name      | Age |
| -- | --------- | --- |
|  1 | Doe, John |  32 |
|  2 | D., Jane  |     |

can be expressed by the following TSV snippet:

```txt
ID	Name	Age
1	Doe, John	32
2	D., Jane 	
```

which is emitted as the following two TriplyETL records:

```json
{
  "ID": "1",
  "Name": "Doe, John",
  "Age": "32"
}
{
  "ID": "2",
  "Name": "D., Jane"
}
```

Notice that:
- All values have type `string`, including `"ID"` and `"Age"`.  The value for field `"Age"` should probably be considered numeric, but the TSV format cannot express this.  A TriplyETL [transformation](#transformations) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding TSV cell contains the empty string, which is considered to denote an empty value.

## Compression

Source data is often text-based.  This means that such source data can often be compressed to minimize storage space and/or Internet bandwidth.

TriplyETL provides automatic support for the GNU zip (file name extension `*.gz`) compression format.

```ts

```

Notice that the TriplyDB Assets uses GNU zip (file extension `*.gz`) compression.  This is one of the compression formats that is supported by TriplyETL.

## Special Keys

The source connectors in TriplyETL add several special keys to your records.  These special keys start with a dollar sign character (`$`) and can be used in your pipeline configuration.  We now discuss these special keys in details.

### `$recordId`

The special key `$recordId` assigns a unique number to every record that is processed in one single run of a TriplyETL pipeline.  This number is not unique across different runs of a TriplyETL pipeline.  After all, the records emitted by a database or REST API may change over time, and a spreadsheet may be updated to include new sheets and rows.

#### Use case: Unique identifiers

The first main use case of the `$recordId` key is to create IRIs that are unique within one single run of a TriplyETL pipeline.

Suppose the following table is our source data:

| First name | Last name |
| ---------- | --------- |
| John       | Doe       |
| Jane       | Doe       |
| John       | Doe       |

We need to create an IRI for every person in this table.  Notice that the table contains no unique properties: there are two different persons with the same first and last name.  This means that we cannot use the keys "First name" and "Last name" in our record in order to create our IRIs.  Luckily, the source connector adds the `$recordId` for us:

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

Notice that the use of the `$recordId` results in a correct single run of the TriplyETL pipeline.  But if the source data changes, the IRIs may change as well.  For example, if the first and second row in the source table are swapped, the IRI that denotes "Jane Doe" will change from `id:2` to `id:1`.

### Use case: Debugging

When you are debugging the configuration of a TriplyETL pipeline, it is sometimes useful to perform a specific actions for a specific record.  Assuming the stream of records is stable during the debugging effort, the `$recordId` key can be used to perform such a debugging action; for example:

```ts
whenEqual('$recordId', 908, logRecord()),
```

Do note that it is generally better to run the TriplyETL for a specific record using the `--from-record-id 908 --head 1` command line flags (see [CLI](/docs/triply-etl/cli)).

## Next steps

Source Connectors generate a stream of unified records.  This decouples pipeline configuration from heterogeneous source system structure.

See the [Transformations](transformations) and [Assertions](assertions) sections for how to work with the unified records that stream from one or more source connections.
