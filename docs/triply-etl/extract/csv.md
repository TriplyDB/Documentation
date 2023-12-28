[TOC]

# CSV extractor

CSV or Comma Separated Values (file name extension `.csv`) is a popular format for storing tabular source data. TriplyETL has a dedicated `fromCsv()` extractor for this data format.



## Basic usage

The CSV extractor is imported in the following way:

```ts
import { fromCsv, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records from a local CSV file:

```ts
fromCsv(Source.file('data.csv')),
```

The following code snippet extracts records from an online CSV file, that is hosted at the specified URL:

```ts
fromCsv(Source.url('https://somewhere.com/data.csv')),
```

The following code snippet extracts records from a [TriplyDB Asset](../sources/triplydb-assets.md). The asset is store in the data with name `'some-data'`, under an account with name `'some-account'`. The name of the asset is `'example.csv'`:

```ts
fromCsv(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.csv' }
  )
),
```



## Standards-compliance

The `fromCsv()` extractor implements the official CSV standard: [IETF RFC 4180](https://www.ietf.org/rfc/rfc4180.html).

Some CSV files do not follow the standard precisely. In order to process such CSV files, the default behavior of the extractor can be changed through an optional options parameter. See the [CSV Parse for Node.js](https://csv.js.org/parse/options/) documentation for all the available options.



## Encoding configuration

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



## Separator configuration

Some CSV files only deviate in their use of a different separator character. For example, some CSV files use the semi-colon (`;`) or the at-sign (`@`) for this.

The following snippet extracts records for a CSV file that uses the semi-colon (`;`) as the separator character:

```ts
fromCsv(Source.file('example.csv'), { separator: ';' }),
```



## CSV with tab separators is not TSV

Notice that the popular Tab-Separate Values (TSV) format is not the same as the standardized CSV format with a tab separator character. If you want to process standards-conforming TSV source data, use the [`fromTsv()` extractor](#extractor-fromtsv) instead.



## Record representation

TriplyETL treats every row in a CSV source as one [record](../sources/index.md). The columns are emitted as keys and the cells are emitted as values. All values are of type `string`. Empty cells (i.e. those containing the empty string) are treated as denoting a null value and are therefore excluded from the record. Any trailing whitespace that appears in headers or cells is removed from the keys and values in the record.

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

Notice the following details:
- All values have type `string`, including `"ID"` and `"Age"`. The value for field `"Age"` should probably be considered numeric, but the CSV format cannot express this. A TriplyETL [transformation](../transform/index.md) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding CSV cell contains the empty string, which is considered to denote an empty value.
