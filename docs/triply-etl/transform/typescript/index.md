---
title: "2. Transform: TypeScript"
path: "/docs/triply-etl/transform/typescript"
---

[TOC]

# TypeScript

The vast majority of ETLs can be written with the core set of [RATT Transformations](../ratt).  But sometimes a custom transformation is necessary that cannot be handled by this core set.  For such circumstances, TriplyETL allows a custom TypeScript function to be written.

Notice that the use of a custom TypeScript function should be somewhat uncommon.  The vast majority of real-world transformations should be supported by the core set of RATT Transformations.



## Context

Custom TypeScript functions have access to various resources inside the TriplyETL.  These resources include, but are not limited to, the full Record and the full Internal Store.

TriplyETL refers to these resources as the **Context**.

<dl>
<dt><code>context.app</code><dt>
<dd>The TriplyETL pipeline object.</dd>
<dt><code>context.getX</code></dt>
<dd>Tetrieves the value of a specific key in the Record and assumes it has type <code>X</code>, e.g. <code>getAny()</code>, <code>getNumber()</code>, <code>getString()</code>.</dd>
<dt><code>context.record</code></dt>
<dd>The current Record.</dd>
<dt><code>context.store</code></dt>
<dd>The Internal Store.</dd>
</dl>



## Function `custom.add()`

Adds a new entry to the Record, based on more than one existing entry.

The value of the entry is the result of an arbitrary TypeScript function that has access to the full [Context](#context).

### Function signature

The `custom.add` function has the following signature:

```ts
etl.use(
  custom.add({
    value: context => FUNCTION_BODY,
    key: 'NEW_KEY',
  }),
)
```

The function can be configured in the following ways:
- `FUNCTION_BODY` the body of a function, taking the Context as its input parameter (`context)` and ending with a `return` statement returning the newly added value.
- `NEW_KEY` must be the name of a new entry in the Record.

### Error conditions

This function emits an error if `NEW_KEY` already exists in the current Record.

### See also

Notice that it is bad practice to use `custom.add()` for adding a new entry that is based on exactly one existing entry.  In such cases, the use of function `custom.copy()`
### Example: Numeric calculations

Suppose the source data contains a numeric balance and a numeric rate.  We can use function `custom.add()` to calculate the interest and store it in a new key:

```ts
import { Etl, fromJson } from '@triplyetl/etl/generic'
import { custom, logRecord } from '@triplyetl/etl/ratt'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([
      { balance: 100, rate: 0.1 },
      { balance: 200, rate: 0.2 }
    ]),
    custom.add({
      value: context => context.getNumber('balance') * context.getNumber('rate'),
      key: 'interest',
    }),
    logRecord(),
  )
  return etl
}
```

This prints the following two records:

```json
{
  "balance": 100,
  "rate": 0.1,
  "interest": 10
}
{
  "balance": 200,
  "rate": 0.2,
  "interest": 40
}
```



## Function `custom.change()` <!-- {#change} -->

Changes an existing entry in the Record.  The `change` function takes the old value and returns the new value.

### Function signature

This function has the following signature:

```ts
etl.use(
  custom.change({
    key: 'KEY_NAME',
    type: 'VALUE_TYPE',
    change: value => FUNCTION_BODY,
  }),
)
```

The function can be configured in the following way:
- `KEY_NAME` must be the name of a key in the record.
- `VALUE_TYPE` must be one of the following type-denoting strings:
  - `'array'` an array whose elements have type `any`.
  - `'boolean'` a Boolean value (`true` or `false`).
  - `'iri'` a universal identifier / IRI term.
  - `'literal'` an RDF literal term.
  - `'number'` a natural number or floating-point number.
  - `'string'` a sequence of characters.
  - `'unknown'` an unknown type.
- `FUNCTION_BODY` a function body that returns the new value.

### Error conditions

This function emits an error if the specified key (`KEY_NAME`) does not exist in the RATT record.  Use `custom.copy()` if you want to create a new entry based on an existing one.

### Example: Numeric calculation

Suppose the source data contains a balance in thousands.  We can use function `custom.change()` to multiply the balance inplace:

```ts
import { Etl, fromJson } from '@triplyetl/etl/generic'
import { custom, logRecord } from '@triplyetl/etl/ratt'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([{ balance: 100 }, { balance: 200 }]),
    custom.change({
      change: value => 1_000 * value,
      type: 'number',
      key: 'balance',
    }),
    logRecord(),
  )
  return etl
}
```

This prints the following two records:

```json
{
  "balance": 100000
}
{
  "balance": 200000
}
```

Notice that the values for the `balance` keys were changed.

### Example: Cast numeric data

Some source data formats are unable to represent numeric data. A good example are the [CSV](../../extract/formats#extractor-fromcsv) and [TSV](../../extract/formats#extractor-fromtsv) formats, where every cell value is represented as a string.

If such a source data format that cannot represent numeric data is used, it is often useful to explicitly cast string values to numbers.

For example, assume the following input table that uses strings to encode the number of inhabitants for each country:

| Country     | Inhabitants   |
| ----------- | ------------- |
| France      | ''            |
| Germany     | '83190556'    |
| Italy       | 'empty'       |
| Netherlands | '17650200'    |

We can use the `custom.change()` function to cast the values stored in the `'Inhabitants'` key to numbers in the following way:

```ts
custom.change({
  change: value => +(value as number),
  type: 'unknown',
  key: 'Inhabitants',
}),
```

Notice that the type must be set to `'unknown'` because a string is not allowed to be cast to a number in TypeScript (because not every string *can* be cast to a number).

After `custom.change()` has been applied, the record looks as follows:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | 0           |
| Germany     | 83190556    |
| Italy       | null        |
| Netherlands | 17650200    |

Notice that strings that encode a number are correctly transformed, and non-empty strings that do not encode a number are transformed to `null`.  Most of the time, this is the behavior that you want in a linked data pipeline.
<!-- TODO
When [creating statements](#create-statements) later, no statement will be created for entries that have value `null`.  See the [section on working with null values](#null-values) for more information.
-->

Also notice that the empty string is cast to the number zero. Most of the time, this is *not* what you want. If you want to prevent this transformation from happening, and you almost certainly do, you must process the source data conditionally, using [control structures](../../control).

### Example: Variant type

A *variant* is a value that does not always have the same type.  Variants may appear in dirty source data, where a value is sometimes given in one way and sometimes in another.

In such cases, the `type` parameter must be set to `'unknown'`.  Inside the body of the `change` function we first cast the `value` to a variant type.  In TypeScript the notation for this is a sequence of types separated by the pipe (`|`) character.  Finally, the `typeof` operator is used to clean the source data to a uniform type that is easier to process in the rest of the ETL.

The following code snippet processes source data where the balance is sometimes specified as a number and sometimes as a string:

```ts
import { Etl, fromJson } from '@triplyetl/etl/generic'
import { custom, logRecord } from '@triplyetl/etl/ratt'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([{ balance: 100 }, { balance: "200" }]),
    custom.change({
      key: 'balance',
      type: 'unknown',
      change: value => {
        const tmp = value as number | string
        switch (typeof tmp) {
          case 'number':
            return value as number
          case 'string':
            return parseInt(value as string)
        }
      },
    }),
    logRecord(),
  )
  return etl
}
```

This prints the following two records, where the balance is now always a number that can be uniformly processed:

```json
{
  "balance": 100
}
{
  "balance": 200
}
```

### Example: String or object

In the following example the `name` of a person is sometimes given as a plain string and sometimes as an object with a `fistName` and a `lastName` key:

The following function transforms this variant to a uniform string type:

```ts
import { Etl, fromJson } from '@triplyetl/etl/generic'
import { custom, logRecord } from '@triplyetl/etl/ratt'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([
      { name: 'John Doe' },
      { name: { firstName: 'Jane', lastName: 'Doe' } }
    ]),
    custom.change({
      key: 'name',
      type: 'unknown',
      change: value => {
        const tmp = value as { firstName: string, lastName: string } | string
        switch (typeof tmp) {
          case 'string':
            return tmp
          case 'object':
            return tmp.firstName + ' ' + tmp.lastName
        }
      },
    }),
    logRecord(),
  )
  return etl
}
```

This print the following two records that can now be uniformly processed:

```json
{
  "name": "John Doe"
}
{
  "name": "Jane Doe"
}
```



<!-- TODO
## `custom.addFrom.context()`
## `custom.addFrom.value()`
-->



## `custom.replace()` 

Replaces the value of an existing key based on the value from another key.

### Function signature

The `custom.replace()` function has the following signature:

```ts
etl.use(
  custom.replace({
    fromKey: 'FROM_KEY',
    type: 'VALUE_TYPE',
    change?: value => FUNCTION_BODY,
    toKey: 'FROM_TYPE',
  }),
)
```

- `fromKey` is the name of the key whose value is going to be used to replace the old value with.
- `type` is the name of the type of the value in `fromKey`.
- The `change` key optionally specifies a function that takes the cast `value` of `fromKey` and that returns the value that will be stored in `toKey`.  If the `change` function is not specified, it is identical to `value => value`.
- `toKey` is the name of the existing key whose value is going to be replaced.

### Error conditions

This function emits an error under the following conditions:
- `fromKey` does not specify a key name that exists in the current Record.
- `toKey` does not specify a key name that exists in the current Record.
- `fromKey` and `toKey` are the same.

### See also

If `fromKey` and `toKey` are the same, then function [custom.change()](#function-customchange) must be used instead.



<!-- TODO
## `etl.before()`
etl.before(async () => {
  BODY
}

## `etl.after()`

etl.after(async () => {
  BODY
}
-->
