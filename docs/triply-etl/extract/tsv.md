[TOC]

# CSV extractor

CSV or Comma Separated Values (file name extension `.csv`) is a popular format for storing tabular source data. TriplyETL has a dedicated `fromCsv()` extractor for this data format.



## Basic usage

The TSV extractor is imported in the following way:

```ts
import { fromTsv, Source } from '@triplyetl/etl/generic'
```

## Extractor for TSV (Tab-Separated Values)

TSV or Tab-Separated Values (file name extension `.tsv`) is a popular format for tabular source data. TriplyETL has a `fromTsv()` extractor to support this format.

The following code snippet extracts records for TSV file that is stored as a [TriplyDB Asset](../sources/triplydb-assets.md):

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

Notice the following details:

- All values have type `string`, including `"ID"` and `"Age"`. The value for field `"Age"` should probably be considered numeric, but the TSV format cannot express this. A TriplyETL [transformation](../transform/index.md) can be used to cast string values to numeric values.
- The trailing space in `"D., Jane "` is omitted from the second record, since training whitespace is removed from all keys and values.
- The `"Age"` key is missing from the second record, since the corresponding TSV cell contains the empty string, which is considered to denote an empty value.
