---
title: "Triply ETL: RATT - Numeric data"
path: "/docs/triply-etl/numeric-data"
---

## Cast numeric data

Some source data formats are unable to represent numeric data.  A common example of this is [CSV/TSV](https://triply.cc/docs/ratt-extract#csv-tsv), where every cell in a table is represented as a string.

If a source data format that cannot represent numeric data is used, it is often useful to cast such strings to numbers in RATT using the `change` function.

For example, assume the following input table using strings to encode the number of inhabitants for each country:

| Country     | Inhabitants   |
| ----------- | ------------- |
| France      | ''            |
| Germany     | '83190556'    |
| Italy       | 'empty'       |
| Netherlands | '17650200'    |

We can cast values with the `'Inhabitants'` key to a number in the following way:

```ts
change({
  key: 'Inhabitants',
  type: 'unknown',
  change: value => +(value as number)}),
```

Notice that the type must be set to `'unknown'` because a string is not allowed to be cast to a number in TypeScript (because not every stringcan* be cast to a number).

After the `change` has been applied, the RATT record looks like this:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | 0           |
| Germany     | 83190556    |
| Italy       | null        |
| Netherlands | 17650200    |

Notice that strings that encode a number are correctly transformed, and non-empty strings that do not encode a number are transformed to `null`.  Most of the time, this is exactly the behavior that you want in a linked data pipeline.  When [creating statements](#create-statements) later, no statement will be created for entries that have value `null`.  See the [section on working with null values](#null-values) for more information.

Also notice that the empty string is cast to the number zero.  Most of the time, this isnot* what you want.  If you want to prevent this transformation from happening, and you almost certainly do, you must [process this data conditionally](#process-data-conditionally).
