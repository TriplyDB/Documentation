---
title: "Triply ETL: Control"
path: "/docs/triply-etl/control"
---

This page documents how you can use control structures in your ETL configuration.

## Process data conditionally {#process-data-conditionally}

Source data often contains optional values.  These are values that appear in some, but not all records.

Source data often contains 'special' values to denote the absence of a value.  Common examples are values such as `'NULL'` or the empty string (`''`) or 'clear' outliers such as `9999` for a missing year.  We call such values ‘null values’.

The `when` function supports the creation of triples under certain conditions.  The first argument that this function takes establishes whether or not a certain condition is met.  After that, one or more additional statement arguments appear that will only be called if the condition is satisfied.  The generic structure of `when` is as follows:

```ts
app.use(
  when(
    '{condition}',
    '{statement-1}',
    '{statement-2}',
    '{statement-3}',
    ...,
  )
)
```

Notice that it is often useful to specify multiple statements under the same condition:

1. The first statement transforms an optional value, and the second statement uses the transformed optional value to make a triple assertion.
2. The first statement asserts one triple based on the optional value, and the second statement asserts a second triple based on the same optional value.

### Null values {#null-values}

If a key contains a null value in some records, then we need to specifically identify the criteria under which a triple must be added.

```ts
app.use(
  // The source data uses '9999' to denote an unknown creation year.
  when(
    context => context.getNumber('CREATED') != 9999),
    triple(
      iri(prefix.id, 'ID'),
      dct.created,
      literal('CREATED', xsd.gYear))),
```

Notice that the conditional function inside the `when` function takes the current RATT context as its single argument and returns a Boolean.


### Missing values

If a value is sometimes completely missing from a source data record, then the following construct can be used to only add a triple in case the value is present:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  when(
    context => context.isNotEmpty('ZIPCODE'),
    triple(
      iri(prefix.id, 'ID'),
      def.zipcode,
      literal('ZIPCODE')),
    ...,
  ),
)
```

Because missing values are very common in source data, RATT introduces special support for when the value for a specific key is missing.  Instead of having to write `context => context.isNotEmpty('foo')` one can simply write the key name instead.  The above example is equivalent to the following:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  when(
    'ZIPCODE',
    triple(
      iri(prefix.id, 'ID'),
      def.zipcode,
      literal('ZIPCODE')),
    ...,
  ),
)
```

It is also possible to check if a value is completely missing from the source data with `ctx.isEmpty()`

A note for finding more methods RATT:

One of the many advantages using Typescript is code completion. As such any methods available on a class in Ratt can be accessed using your IDE's intellisense (`ctrl + space` in VSCODE). In Ratt the `context` and `mw` are two such classes that can be accessed in this way.

### The empty string

Because source data often uses the empty string to signify NULL values, this particular string is treated in a special way by RATT.

```ts
app.use(
  when(
    key.zipcode,
    // Skipped for the empty string.
    ...),
)
```

Notice that it is almost never useful to store the empty string in linked data.  So the treatment of the empty string as a NULL value is the correct default behavior.

### Custom functions

If we want to extract a string value from the source data, we can write a custom function which can be used with `when` . `when` can receive two parameters: string(a key value) or a function.
If `when` receives a string, it checks whether it is empty or not. But in case of a custom method specific instructions are required. For example,

```ts
(ctx) => ctx.isNotEmpty('foo') && ctx.getString('foo') === 'foo'
```

Notice details:

`ctx.isNotEmpty('foo')` checks whether the string is empty or not and only if it is not empty, the function moves to the next step
`ctx.getString('bla') === 'something’`, which is the next step, extracts 'foo' when it fulfills the required criteria
