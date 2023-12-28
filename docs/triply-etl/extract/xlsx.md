[TOC]

# XLSX extractor (Microsoft Excel)

XLSX or Office Open XML Workbook for Microsoft Excel (file name extension `.xlsx`) is a popular format for storing tabular source data. This is the standard file format for Microsoft Excel. TriplyETL has a dedicated `fromXlsx()` extractor for such sources.



## Basic usage

The XLSX extractor is imported in the following way:

```ts
import { fromXlsx, Source } from '@triplyetl/etl/generic'
```

The following code snippet shows how a [TriplyDB assets](../sources/triplydb-assets.md) is used to process records from an XLSX source:

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



## Multiple sheets

It is common for XLSX files to have multiple sheets. By default the `fromXlsx()` extractor enumerates all rows from all sheets as records. If only some sheets should be used, this can be specified as a configuration option.

The following code snippet only emits records/rows from the `'people'` and `'projects'` sheets in the XLSX source file `'example.xlsx'`. Rows from other sheets in the same XLSX file are not emitted:

```ts
fromXlsx(Source.file('example.xlsx'), { sheetNames: ['people', 'projects'] }),
```



## Record representation

TriplyETL treats every row in XLSX sheet as one [record](../generic/record.md). The columns are emitted as keys and the cells are emitted as values. Unlike other tabular formats like [CSV](#extractor-fromcsv) and [TSV](#extractor-fromtsv), values in XLSX can have different types.

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
- The special keys `$recordId`, `$environment`, and `$fileName` are documented in the section on [Special Keys](#special-key-sheetname).
- The special key `$sheetName` is unique to the `fromXslx()` extractor and is documented in the next subsection.



## Special key '$sheetName'

For every record emitted by the `fromXlsx()` extractor. the `$sheetName` special key contains the name of the Excel sheet from which that record originates. The presence of the sheet name allows the TriplyETL configuration to be adjusted for different sheet.

For example, an Excel spreadsheet may contain a 'companies' sheet and a 'persons' sheet. The name of the sheet may be used to determine which class should be asserted. The following snippet uses transformation [translateAll()](../transform/ratt.md#function-translateall) to map sheet names to class IRIs:

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
