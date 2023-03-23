---
title: "Triply ETL: Extract: Data formats"
path: "/docs/triply-etl/extract/formats"
---

TriplyETL supports the following data formats:

| Extractor                  | Format                            |
| -------------------------- | --------------------------------- |
| [`fromCsv()`](#csv)        | Comma-Separated Values (CSV)      |
| [`fromJson()`](#json)      | JavaScript Object Notation (JSON) |
| [`fromOai()`](#oai-pmh)    | Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) |
| [`fromShapefile()`](#esri) | ESRI Shapefiles                   |
| [`fromTsv()`](#tsv)        | Tab-Separated Values (TSV)        |
| [`fromXlsx()`](#xlsx)      | Microsoft Excel (XLSX)            |
| [`fromXml()`](#xml)        | XML Markup Language (XML)         |



## Comma-Separated Values (CSV) {#csv}

Comma Separated Values (file name extension `.csv`) is a popular formats for storing tabular source data.  TriplyETL has a dedicated `fromCsv()` connector for such sources.

The following code snippet connects to a local CSV source file:

```ts
fromCsv(Etl.Source.file('data.csv')),
```

The following code snippet connects to an online CSV source file:

```ts
fromCsv(Etl.Source.url('https://somewhere.com/data.csv')),
```

The following code snippet shows connects to a [TriplyDB Asset](#triplydb-asset):

```ts
fromCsv(
  Etl.Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.csv' }
  )
),
```

By default, the `fromCsv()` connector implements the official CSV standard: [IETF RFC 4180](https://www.ietf.org/rfc/rfc4180.html).  It is possible to change this default behavior by specifying numerous options to the `fromCsv()` connector.  See the [CSV Parse for Node.js](https://csv.js.org/parse/options/) documentation for all available options.

### Configure the encoding

The CSV format is allowed to use any encoding.  Since the CSV does not allow the used encoding to be stored as metadata, a non-standard encoding must be explicitly configured.  By default, TriplyETL assumes that CSV sources use UTF-8 encoding.  If any other encoding is used, this must be explicitly specified in the source connected.

The following snippet configures that the CSV source uses ISO Latin-1 encoding:

```ts
fromCsv(
  Etl.Source.TriplyDb.asset('my-dataset', { name: 'example.csv' }),
  { encoding: 'latin1' }
),
```

The following encodings are currently supported.  Let us know at <mailto:support@triply.cc> if your encoding is not yet supported.

| Value       | Encoding | Standard | Alternative values | 
| ----------- | -------- | -------- | ------------------ |
| `'ascii'`   | US-ASCII | ANSI     | |
| `'latin1'`  | Latin-1 | ISO-8859-1 | `binary` |
| `'utf8'`    | UTF-8 | Unicode | |
| `'utf16le'` | UTF-16 Little Endian | Unicode | `'ucs2'`, `'ucs-2'`, `'utf16-le'` |

You can read the [CSV Parse for Node.js](https://csv.js.org/parse/options/encoding/) documentation for more information.

### Configure the separator

Some CSV files only deviate in their use of a different separator character.  For example, some CSV files use the semi-colon (`;`) or the at-sign (`@`) for this.  The following snippet connects to a CSV source that uses the semi-colon as a separator:

```ts
fromCsv(Etl.Source.file('example.csv'), { separator: ';' }),
```

### CSV with tab separators is not TSV

Notice that the popular Tab-Separate Values (TSV) format is not the same as the standardized CSV format with a tab character as the field separator.  If you want to process standards-conforming TSV source data, use the [`fromTsv()` connector](#tsv) instead.

### Record representation

TriplyETL treats every row in a CSV source as one record.  The columns are emitted as keys and the cells are emitted as values.  All values are of type `string`.  Cells that contain the empty string are treated as denoting an empty value and are excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys or values in the record.

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
- All values have type `string`, including `"ID"` and `"Age"`.  The value for field `"Age"` should probably be considered numeric, but the CSV format cannot express this.  A TriplyETL [transformation](/docs/triply-etl/transformations) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding CSV cell contains the empty string, which is considered to denote an empty value.



## JavaScript Object Notation (JSON) {#json}

JSON (JavaScript Object Notation) is a popular open standard for interchanging tree-shaped data.  TriplyETL has a dedicated `fromJson()` connector for this format.

The following code snippet connects to a JSON source that is stored as a [TriplyDB asset](#triplydb-asset):

```ts
fromJson(
  Etl.Source.TriplyDb.asset(
    'account',
    'dataset',
    { name: 'example.json.gz' }
  )
),
```

The following example uses an in-line specified JSON source:

```ts
fromJson([{ a: "a", b: "b", c: "c" }]),
```

TriplyETL supports the [IETF RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) standard for JSON.



## Protocol for Metadata Harvesting (OAI-PMH) {#oai-pmh}

In the GLAM domain (Galleries, Libraries, Archives, Museums) the Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) is a popular mechanism for publishing data collections.  TriplyETL includes the `fromOai()` connector to tap into these data collections.

The `fromOai()` connector ensures a continuous stream of data records.  Under the hood, this connector uses resumption tokens to iterate over large collections.

An OAI-PMH endpoint can be configured by specifying its URL (parameter `url`).  Since one OAI-PMH endpoint typically publishes multiple datasets, it is also common to specify the `set` parameter.

The following code snippet connects to an example dataset that is published in an example OAI-PMH endpoint:

```ts
fromOai({
  url: 'https://somewhere.com/webapioai/oai.ashx',
  set: 'some-dataset',
}),
```

TriplyETL supports the [OAI-PMH](https://www.openarchives.org/pmh/) standard.



## Tab-Separated Values (TSV) {#tsv}

Tab-Separated Values (file name extension `.tsv`) is a popular format for tabular source data.  TriplyETL has a `fromTsv()` connector to support this format.

The following code snippet shows how a [TriplyDB Asset](#triplydb-asset) is used to process records from a TSV source:

```ts
fromTsv(
  Etl.Source.TriplyDb.asset('some-account', 'some-dataset', { name: 'example.tsv.gz' })
),
```

TriplyETL supports the [IANA](https://www.iana.org/assignments/media-types/text/tab-separated-values) standard definition of the TSV format.

### Record representation

TriplyETL treats every row in a TSV source as one record.  The columns are emitted as keys and the cells are emitted as values.  All values are of type `string`.  Cells that contain the empty string are treated as denoting an empty value and are excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys or values in the record.

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



## Microsoft Excel (XLSX) {#xlsx}

Microsoft Excel (file name extension `.xlsx`) is a popular format for storing tabular source data.  TriplyETL has a dedicated `fromXlsx()` connector for such sources.

The following code snippet shows how a [TriplyDB assets](#triplydb-asset) is used to process records from an Excel source:

```ts
fromXlsx(
  Etl.Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.xlsx' }
  )
),
```

The `fromXlsx()` connector emits one record per row in the source file.

### Sheets

It is common for Excel files to have multiple sheets.  By default the `fromXlsx()` connector enumerate all rows from all sheets as records.  If only some sheets should be used, this can be specified as a configuration option.

The following code snippet only emits rows from the `'people'` and `'projects'` sheets in the Excel source file `'example.xlsx'`.  Rows from other sheets in the same Excel file are not emitted:

```ts
fromXlsx(
  Etl.Source.file('example.xlsx'),
  { sheetNames: ['people', 'projects'] }
)
```

### Record representation

TriplyETL treats every row in Excel sheet as one record.  The columns are emitted as keys and the cells are emitted as values.  Unlike other tabular formats like [CSV](#csv) and [TSV](#tsv), values in Excel can have different types.

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
- The special key `$sheetName` is unique to the `fromXslx()` source connector and is documented in the next subsection.

### Special key `$sheetName` {#sheetName}

For every record emitted by the `fromXlsx()` source connector. the `$sheetName` special key contains the name of the Excel sheet from which that record originates.  The presence of the sheet name allows the TriplyETL configuration to be adjusted for different sheet.

For example, an Excel spreadsheet may contain a `"companies"` sheet and a `"persons"` sheet.  The name of the sheet may be used to determine which class should be asserted.  The following snippet uses the [`translateAll()`](#translateAll) transformation to map sheet names to class IRIs:

```ts
fromXlsx(Etl.Source.file('example.xlsx')),
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



## Extensible Markup Language (XML) {#xml}

Extensible Markup Language (XML) is a popular tree-shaped source data format.

The following snippets connects to an XML file that is made available as a [TriplyDB asset](#triplydb-asset):

```ts
fromXml(
  Etl.Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element' }
),
```

Notice that the `fromXml()` source connector requires a `selectors` option.  This specifies the subtrees in the XML that should be treated as individual records.  In the above snippet the records are the subtrees that occur between the `<first-element>` opening tag and the `</first-element>` closing tag.

If a deeper path must be specified, sequential tags in the path must be separated by a dot:

```ts
fromXml(
  Etl.Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element.second-element.third-element' }
),
```

Sometimes there are multiple paths that point to different kinds of records, all within the same large XML source.  In such cases the multiple paths can be specified in an array:

```ts
fromXml(
  Etl.Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  {
    selectors: [
      'first-element.second-element.third-element',
      'first-element.second-element.alt-element',
      'first-element.second-element.other-element',
    ]
  }
),
```

TriplyETL supports the [W3C](https://www.w3.org/TR/xml/) XML standard.
