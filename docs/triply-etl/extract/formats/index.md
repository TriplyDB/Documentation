---
title: "1. Extract: Data Formats"
path: "/docs/triply-etl/extract/formats"
---

TriplyETL supports the following data formats:

| Extractor | Format | Full name |
| --- | --- | --- |
| [fromCsv()](#fromCsv) | [CSV](#csv) | [Comma-Separated Values](#csv) |
| [fromJson()](#fromJson) | [JSON](#json) | [JavaScript Object Notation](#json) |
| [fromOai()](#fromOai) | [OAI-PMH](#oai-pmh) | [Open Archives Initiative Protocol for Metadata Harvesting](#oai-pmh) |
| [fromPostgres()](#fromPostgres) | [PostgreSQL Query & Postgres API Options](#postgres)| [PostgreSQL Query & Postgres API Options](#postgres)               |
| [fromShapefile()](#fromShapefile) | [ESRI](#esri) | [ESRI Shapefiles](#esri) |
| [fromTsv()](#fromTsv) | [TSV](#tsv) | [Tab-Separated Values](#tsv) |
| [fromXlsx()](#fromXlsx) | [XLSX](#xlsx) | [Microsoft Excel](#xlsx) |
| [fromXml()](#fromXml) | [XML](#xml) | [XML Markup Language](#xml) |
| [loadRdf()](#loadRdf) | [RDF](#rdf) | [Resource Description Format](#rdf) |

All extractors can be imported from the generic library in TriplyETL:

```ts
import { fromCsv, fromJson, fromOai,
         fromPostgres, fromShapefile, fromTsv, fromXlsx,
         fromXml, loadRdf, Source } from '@triplyetl/etl/generic'
```

Notice that you also need to import `Source`, since every extractor requires a source.



## Extractor `fromCsv()` {#csv} {#fromCsv}

CSV or Comma Separated Values (file name extension `.csv`) is a popular format for storing tabular source data. TriplyETL has a dedicated `fromCsv()` extractor for this data format.

The following code snippet extracts records from a local CSV file:

```ts
fromCsv(Source.file('data.csv')),
```

The following code snippet extracts records from an online CSV file, that is hosted at the specified URL:

```ts
fromCsv(Source.url('https://somewhere.com/data.csv')),
```

The following code snippet extracts records from a [TriplyDB Asset](#triplydb-asset). The asset is store in the data with name `'some-data'`, under an account with name `'some-account'`. The name of the asset is `'example.csv'`:

```ts
fromCsv(
  Source.TriplyDb.asset(
    'some-account', 'some-dataset', { name: 'example.csv' }
  )
),
```


### Standards-compliance

The `fromCsv()` extractor implements the official CSV standard: [IETF RFC 4180](https://www.ietf.org/rfc/rfc4180.html).

Some CSV files do not follow the standard precisely. In order to process such CSV files, the default behavior of the extractor can be changed through an optional options parameter. See the [CSV Parse for Node.js](https://csv.js.org/parse/options/) documentation for all the available options.


### Configure the encoding

According to the official CSV standard, CSV sources are allowed to use any encoding. Since the CSV format does not allow the used encoding to be specified in the format itself, a non-standard encoding must always be configured manually. By default, TriplyETL assumes that CSV sources use the UTF-8 encoding. If another encoding is used, this must be explicitly specified by using the optional options parameter.

The following snippet configures that the CSV source uses the ISO Latin-1 encoding:

```ts
fromCsv(
  Source.TriplyDb.asset('my-dataset', { name: 'example.csv' }),
  { encoding: 'latin1' }
),
```

The following encodings are currently supported:

| Value       | Encoding | Standard | Alternative values | 
| ----------- | -------- | -------- | ------------------ |
| `'ascii'`   | US-ASCII | ANSI     | |
| `'latin1'`  | Latin-1 | ISO-8859-1 | `binary` |
| `'utf8'`    | UTF-8 | Unicode | |
| `'utf16le'` | UTF-16 Little Endian | Unicode | `'ucs2'`, `'ucs-2'`, `'utf16-le'` |

Read the [CSV Parse for Node.js](https://csv.js.org/parse/options/encoding/) documentation for more information.


### Use a different separator

Some CSV files only deviate in their use of a different separator character. For example, some CSV files use the semi-colon (`;`) or the at-sign (`@`) for this.

The following snippet extracts records for a CSV file that uses the semi-colon (`;`) as the separator character:

```ts
fromCsv(Source.file('example.csv'), { separator: ';' }),
```

### CSV with tab separators is not TSV

Notice that the popular Tab-Separate Values (TSV) format is not the same as the standardized CSV format with a tab separator character. If you want to process standards-conforming TSV source data, use the [`fromTsv()` extractor](#tsv) instead.


### Record representation

TriplyETL treats every row in a CSV source as one record. The columns are emitted as keys and the cells are emitted as values. All values are of type `string`. Empty cells (i.e. those containing the empty string) are treated as denoting a null value and are therefore excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys and values in the record.

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
- All values have type `string`, including `"ID"` and `"Age"`. The value for field `"Age"` should probably be considered numeric, but the CSV format cannot express this. A TriplyETL [transformation](/docs/triply-etl/transform) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding CSV cell contains the empty string, which is considered to denote an empty value.



## Extractor `fromJson()` {#fromJson} {#json}

JSON (JavaScript Object Notation) is a popular open standard for interchanging tree-shaped data. TriplyETL has a dedicated `fromJson()` extractor for this format.

The following code snippet connects to a JSON source that is stored as a [TriplyDB asset](/docs/triply-etl/extract/types#triplydb-assets):

```ts
fromJson(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.json.gz' }
  )
),
```

The following example uses an in-line specified JSON source:

```ts
fromJson([{ a: "a", b: "b", c: "c" }]),
```

TriplyETL supports the [IETF RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) standard for JSON.


### Nested keys

Since JSON is a tree-shaped format, it is able to store values in a nested structure. This requires a sequence or 'path' of keys to be specified.

We use the following example data:

```json
{
  "metadata": {
    "title": {
      "name": "Data about countries."
    }
  },
  "data": {
    "countries": [
      {
        "country.id": "nl",
        "name": "The Netherlands"
      },
      {
        "country.id": "de",
        "name": "Germany"
      }
    ]
  }
}
```

Paths are specified as dot-separated sequences of keys, starting at the top-level and ending at the required value. For the JSON example in the previous section, TriplyETL can access the `"name"` key inside the `"title"` key, which itself is nested inside the `"metadata"` key. This path is expressed in [1]. Notice that the path expressed in [1] is different from the path expressed in [2], which also accesses the `"name"` key, but nested inside the `"countries"` and then `"data"` keys. (The use of the `[0]` index is explained in the next section.)

```
[1] metadata.title.name
[2] data.countries[0].name
```

Path expressions can be used as string keys in many places in TriplyETL. For example, we can assert the title of a dataset in the following way:

```ts
triple('_dataset', dct.title, 'metadata.title.name'),
```

This asserts the following linked data:

```turtle
dataset:my-dataset dct:title 'Data about countries.'.
```


### Dealing with dots in keys

In the previous section we saw that dots are used to separate keys in paths. However, sometimes a dot can occur as a regular character inside a key. In such cases, we need to apply additional escaping of the key name to avoid naming conflicts.

The example data from the previous section contains the following key:

```ts
"country.id"
```

Notice that the dot is here part of the key name. We can refer to these keys as follows:

```ts
triple('_country', dct.id, 'data.countries[0].["country.id"]'),
```

Notice the use of additional escaping: `["..."]`


### Accessing lists by index

Tree-shaped data formats often allow multiple values to be specified in an ordered list. Examples of this are arrays in JSON and XML elements with the same tag that are directly nested under the same parent element.

TriplyETL is able to access specific elements from lists based on theirindex* or position. Following the standard practice in Computer Science, TriplyETL refers to the first element in the list as having index 0. The second element has index 1, etc.

For the above example record, we can assert the name of thefirst* country as follows:

```ts
triple(
  iri(prefix.id, 'data.countries[0].["country.id"]'),
  rdfs.label,
  'data.countries[0].name'
),
```

This results in the following linked data:

```turtle
id:nl rdfs:label 'The Netherlands'.
```

We can also assert the name of the second country. Notice that only the index is different (`1` instead of `0`):

```ts
triple(
  iri(prefix.id, 'data.countries[1].["country.id"]'),
  rdfs.label,
  'data.countries[1].name'
),
```

This results in the following linked data:

```turtle
id:de rdfs:label 'Germany'.
```



## Extractor `fromOai()` {#fromOai} {#oai-pmh}

In GLAM domains (Galleries, Libraries, Archives, Museums), the Open Archives Initiative (OAI), Protocol for Metadata Harvesting (PMH) is a popular protocol and format for publishing data collections. TriplyETL includes the `fromOai()` extractor to tap into these data collections.

The `fromOai()` extractor ensures a continuous stream of data records. Under the hood, the extractor uses resumption tokens to iterate over large collections.

An OAI-PMH endpoint can be configured by specifying its URL (parameter `url`). Since one OAI-PMH endpoint typically publishes multiple datasets, it is also common to specify the `set` parameter.

The following code snippet connects to an example dataset that is published in an example OAI-PMH endpoint:

```ts
fromOai({
  url: 'https://somewhere.com/webapioai/oai.ashx',
  set: 'some-dataset',
}),
```

TriplyETL supports the [OAI-PMH](https://www.openarchives.org/pmh/) standard.



## Extractor `fromTsv()` {#fromTsv} {#tsv}

TSV or Tab-Separated Values (file name extension `.tsv`) is a popular format for tabular source data. TriplyETL has a `fromTsv()` extractor to support this format.

The following code snippet extracts records for TSV file that is stored as a [TriplyDB Asset](/docs/triply-etl/extract/types#triplydb-assets):

```ts
fromTsv(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.tsv.gz' }
  )
),
```

TriplyETL supports the [IANA](https://www.iana.org/assignments/media-types/text/tab-separated-values) standard definition of the TSV format.


### Record representation

TriplyETL treats every row in a TSV source as one record. The columns are emitted as keys and the cells are emitted as values. All values are of type `string`. Cells that contain the empty string are treated as denoting an empty value and are excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys or values in the record.

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
- All values have type `string`, including `"ID"` and `"Age"`. The value for field `"Age"` should probably be considered numeric, but the TSV format cannot express this. A TriplyETL [transformation](/docs/triply-etl/transform) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding TSV cell contains the empty string, which is considered to denote an empty value.



## Extractor `fromXlsx()` {#fromXlsx} {#xlsx}

XLSX or Office Open XML Workbook (file name extension `.xlsx`) is a popular format for storing tabular source data. This is the standard file format for Microsoft Excel. TriplyETL has a dedicated `fromXlsx()` extractor for such sources.

The following code snippet shows how a [TriplyDB assets](/docs/triply-etl/extract/types#triplydb-assets) is used to process records from an XLSX source:

```ts
fromXlsx(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.xlsx' }
  )
),
```

The `fromXlsx()` extractor emits one record per row in the source file.


### Sheets

It is common for XLSX files to have multiple sheets. By default the `fromXlsx()` extractor enumerates all rows from all sheets as records. If only some sheets should be used, this can be specified as a configuration option.

The following code snippet only emits records/rows from the `'people'` and `'projects'` sheets in the XLSX source file `'example.xlsx'`. Rows from other sheets in the same XLSX file are not emitted:

```ts
fromXlsx(Source.file('example.xlsx'), { sheetNames: ['people', 'projects'] }),
```


### Record representation

TriplyETL treats every row in XLSX sheet as one record. The columns are emitted as keys and the cells are emitted as values. Unlike other tabular formats like [CSV](#csv) and [TSV](#tsv), values in XLSX can have different types.

For example, the following table:

| ID | Name      | Age |
| -- | --------- | --- |
|  1 | Doe, John |  32 |
|  2 | D., Jane  |     |

can be emitted as the following two TriplyETL records:

```json
{
  "$recordId": 1,
  "$environment": "Development",
  "$sheetName": "Sheet1",
  "$fileName": "static/Untitled 1.xlsx",
  "ID": "1",
  "Name": "Doe, John",
  "Age": 32
}
{
  "$recordId": 2,
  "$environment": "Development",
  "$sheetName": "Sheet1",
  "$fileName": "static/Untitled 1.xlsx",
  "ID": "2",
  "Name": "D., Jane",
}
```

Notice the following:
- The value for the `"Age"` key is a number.
- The special keys `$recordId`, `$environment`, and `$fileName` are documented in the section on [Special Keys](#special key).
- The special key `$sheetName` is unique to the `fromXslx()` extractor and is documented in the next subsection.


### Special key `$sheetName` {#sheetName}

For every record emitted by the `fromXlsx()` extractor. the `$sheetName` special key contains the name of the Excel sheet from which that record originates. The presence of the sheet name allows the TriplyETL configuration to be adjusted for different sheet.

For example, an Excel spreadsheet may contain a `"companies"` sheet and a `"persons"` sheet. The name of the sheet may be used to determine which class should be asserted. The following snippet uses transformation [translateAll()](#translateAll) to map sheet names to class IRIs:

```ts
fromXlsx(Source.file('example.xlsx')),
translateAll({
  content: '$sheetName',
  table: {
    'companies': sdo.Organization,
    'persons': sdo.Person,
  },
  key: '_class',
}),
triple(iri(prefix.id, '$recordId'), a, '_class'),
```



## Extractor `fromPostgres() {#fromPostgres} {#postgres} {#postgresql}

PostgreSQL or Postgres is an open-source relational database system. Postgres supports both SQL (relational) and JSON (non-relational) querying.

TriplyETL has a `fromPostgres()` extractor to retrieve data from a Postgres database. This can be done via Postgres connectors or via URL using the following code snippet:

```sh
fromPostgres([<PostgreSQL query/queries>],{<Postgres Options>})
```


### Retrieving data via Postgres connectors

The first option for retrieving Postgres data is by using Postgres connectors.

Below is an example using a publicly available database from [RNA central](https://rnacentral.org/help/public-database).

```sh
fromPostgres(`SELECT * FROM rnc_database`, {
  host: "hh-pgsql-public.ebi.ac.uk",
  port: 5432,
  database: "pfmegrnargs",
  user: "reader",
  password: "NWDMCE5xdipIjRrp",
}),
```


### Retrieving data via URL

The second option is by simply using a database URL. Below we are using the same example database as above, but this time instead of adding Postgres connectors, we are accessing it via URL.

```sh
fromPostgres(
  'select * from rnc_database',
  { url: 'postgres://reader:NWDMCE5xdipIjRrp@hh-pgsql-public.ebi.ac.uk:5432/pfmegrnargs' }
),
```



## Extractor `fromXml()` {#fromXml} {#xml}

XML or Extensible Markup Language is a popular open format for tree-shaped source data.

The following snippets connects to an XML file that is made available as a [TriplyDB asset](/docs/triply-etl/extract/types#triplydb-assets):

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element' }
),
```

Notice that the `fromXml()` extractor requires a `selectors` option. This specifies the subtrees in the XML that should be treated as individual records. In the above snippet the records are the subtrees that occur between the `<first-element>` opening tag and the `</first-element>` closing tag.

If a deeper path must be specified, sequential tags in the path must be separated by a dot:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element.second-element.third-element' }
),
```

It is common for large XML sources to contain different kinds of records. Different kinds of records often occur under different paths. It is therefore possible to specify multiple paths, all of which will be used for extract records from the XML source.

The following code snippet extracts records for three different paths in the same XML source:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', { name: 'my-data.xml' }),
  {
    selectors: [
      'first-element.second-element.third-element',
      'first-element.second-element.alt-element',
      'first-element.second-element.other-element',
    ]
  }
),
```

TriplyETL supports the W3C XML standard.


### Nested keys

Since XML can store tree-shaped data, it can have nested keys and indexed array. See the following subsections of the JSON documentation for how to extract data from such tree structures:

- [Nested keys](#nested-keys)
- [Dealing with dots in keys](#dealing-with-dots-in-keys)
- [Accessing lists by index](#accessing-lists-by-index)



## Function `loadRdf()` {#loadRdf} {#rdf}

RDF or Resource Description Framework is the standardized and open format for linked data.

Data in the RDF format is treated in a different way than other formats. RDF data does not appear in clearly structured records, it no longer needs to be asserted (since it already is linked data), and transformations can be performed with linked data standards such as SHACL Rules.

For this reason, RDF sources are directly loaded into the Internal Store, and the Record step is completely skipped.

The following code snippet loads the RDF from the specified TriplyDB dataset into the Internal Store:

```sh
loadRdf(Source.TriplyDb.rdf('my-account', 'my-dataset')),
```
