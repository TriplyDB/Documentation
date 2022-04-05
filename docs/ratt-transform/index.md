---
title: "RATT"
path: "/docs/ratt-transform"
---

**RATT can only be used in combination with [TriplyDB](https://triply.cc/triplydb). Contact [info@triply.cc](mailto:info@triply.cc) for more information, or to check if you are allowed to use it.**

RATT is a [TypeScript package](https://www.npmjs.com/package/@triply/ratt) that is developed by [Triply](https://triply.cc/).  RATT makes it possible to develop and maintain production-grade linked data pipelines. It is used in combination with one of the [TriplyDB subscriptions](https://triply.cc/subscriptions) to create large-scale knowledge graphs.


## Transforming values

Source data does not always have the correct form for direct use in RDF triples.  For example:

- Values may need to be mapped onto a prepared list of IRIs or literals (e.g. from country names to country-denoting IRIs).
- Values may need to be translated into standards-compliant formats (e.g., from country name to ISO 3166 country codes).
- Multiple values may need to be combined into one value (e.g., street name and house number may be concatenated into an address).
- A simple value with a separator may need to be split into multiple values (e.g., from `'apple, orange'` to `'apple'` and `'orange'`).
- Values may need to be cleaned because they are dirty in the source (e.g., from `'001 '` to `1`).

When we transform values in a RATT record, we must think about the following two factors:

1. Does the transformation use the value (a) in the same entry, (b) from one other entry, or (c) from multiple other entries?
2. Do we store the result of the transformation (a) in a new entry, or (b) in an existing entry?

When we plot these two factors onto a table, we get the following overview of the RATT transformation functions:

|                     | Create a new entry | Change an existing entry  |
| ------------------- | ------------------ | ------------------------- |
| From the same entry | impossible         | [`change`](#change)       |
| From another entry  | [`copy`](#copy)    | [`replace`](#replace)     |
| From the context    | [`add`](#add)      | Write a custom Middleware |

The following sections explain how these 4 transformation functions work.



### Change an existing entry in-place (<code>change</code>) {#change}

The `change` function allows the value of an existing entry to be modified in-place.  This is typically done to clean a value or to map string values into IRIs.

#### Function signature

This function has the following signature:

```ts
app.use(
  mw.change({
    key: 'KEY_NAME',
    type: 'VALUE_TYPE',
    change: value => FUNCTION_BODY}),
)
```

The function can be configured in the following ways:
- `ENTRY_NAME` must be the name of an entry in the RATT record.
- `VALUE_TYPE` must be one of the following type-denoting strings:
  - `'array'` an array whose elements have type `any`.
  - `'boolean'` a Boolean value (`true` or `false`).
  - `'iri'` a universal identifier / IRI term.
  - `'literal'` an RDF literal term.
  - `'number'` a natural number or floating-point number.
  - `'string'` a sequence of characters.
  - `'unknown'` an unknown type.
- `FUNCTION_BODY` a function body that returns the new value.

#### Error conditions

This function emits an error if the specified key (`KEY_NAME`) does not exist in the RATT record.  Use [`copy`](#copy) if you want to create a new entry based on an existing one.

#### Use cases

This section provides common use cases where the `change` function is applied.  These use cases also serve as examples for how the `change` function can be used in general to fit your needs.

##### Add padding

Sometimes a target value must have a specific length.  If the source value does not have that length, it may be padded with leading characters to fit the target length.

A concrete linked data example is years before the year 1000.  Such years are often represented by fewer digits, but the [XML Schema Datatypes standard](https://www.w3.org/TR/xmlschema11-2/#rf-lexicalMappings-datetime) requires that all years are represented with at least 4 digits.

Suppose we have the following table of input data:

| Artifact | Year |
| -------- | ---- |
| 00000001 |  612 |
| 00000002 | 1702 |

We can ensure that all years will have at least 4 digits by calling the following function:

```ts
mw.change({
  key: 'Year',
  type: 'string',
  change: value => value.padStart(4, '0'),
}),
```

After applying the function, the RATT record looks as follows:

| Artifact | Year |
| -------- | ---- |
| 00000001 | 0612 |
| 00000002 | 1702 |


##### Cast numeric data

Some source data formats are unable to represent numeric data.  A common example of this is [CSV/TSV](#csv), where every cell in a table is represented as a string.

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
mw.change({
  key: 'Inhabitants',
  type: 'unknown',
  change: value => +(value as number)}),
```

Notice that the type must be set to `'unknown'` because a string is not allowed to be cast to a number in TypeScript (because not every string *can* be cast to a number).

After the `change` has been applied, the RATT record looks like this:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | 0           |
| Germany     | 83190556    |
| Italy       | null        |
| Netherlands | 17650200    |

Notice that strings that encode a number are correctly transformed, and non-empty strings that do not encode a number are transformed to `null`.  Most of the time, this is exactly the behavior that you want in a linked data pipeline.  When [creating statements](#create-statements) later, no statement will be created for entries that have value `null`.  See the [section on working with null values](#null-values) for more information.

Also notice that the empty string is cast to the number zero.  Most of the time, this is *not* what you want.  If you want to prevent this transformation from happening, and you almost certainly do, you must [process this data conditionally](#process-data-conditionally).


##### Change values using a known translation table {#translation-table}

We sometimes want to translate a finite set of known values in the source data to corresponding linked data terms.

###### When to use?

This approach is used when:

- The set of values is small.
- The set of values is known ahead of time.
- The appearance of a new value is considered an error in the source data.
- The corresponding linked data terms are known ahead of time.

###### Translation table

Because the translation from source values to linked data terms is known ahead of time, a translation table can be constructed.

We use the following example, where English names of countries are translated to linked data IRIs:

| Source value | Linked data term |
| ------------ | ---------------- |
| Belgium      | `country.be`     |
| France       | `country.fr`     |
| Germany      | `country.de`     |
| Netherlands  | `country.nl`     |
| Austria      | `country.at`     |

###### Implementation

The translation table can be implemented with a `switch`-statement.  Every `case`-statement corresponds with one translation.  The `default`-statement ensures that (future) unanticipated source values will be noticed.

```ts
mw.change({
  key: 'Source value',
  type: 'string',
  change: value => {
    switch(value) {
    case 'Belgium':     return country.be
    case 'France':      return country.fr
    case 'Germany':     return country.de
    case 'Netherlands': return country.nl
    case 'Austria':     return country.at
    default: throw Error(`Unexpected country name ${value}.`)}}}),
```


##### Split values

Sometimes a value in the source data contains a concatenation of multiple smaller values.

###### Source format considerations

In tabular source data the concatenation of multiple values is not uncommon.  Depending on how you look at it, such concatenations may be considered a data quality issue.  Tree-shaped source formats often do allow multiple values to be stored natively, for example JSON and XML.  If your tabular source data often contains multiple values in one cell, consider changing the source format to more reliably represent the encoded information.

###### When to use?

This approach is used when:

- The source data contains singular values that encode multiple values.
- The source data cannot be easily changed to a format that stores these multiple values natively (see above).
- The values are reliably separated with a known separator string.

###### Implementation

The following implementation uses the `change` function to split values:

```ts
app.use(
  mw.change({
    key: 'KEY_NAME',
    type: 'string',
    change: values =>
      values.split('SEPARATOR')
        .map(value => value.trim())
        .filter(value => value)}),
)
```

The following values must be added for a concrete application:
- `KEY_NAME` must be the name of a key in the RATT record.
- `SEPARATOR` must be the string that separates the multiple values (e.g., `,` or `;` are commonly used for this).

Notice the following details about this implementation:
- The `map` function is called immediately after splitting, to ensure that surrounding whitespace is removed from the newly split values.
- The `filter` function is called to remove empty strings from the results.  Such empty values are almost never stored in linked data.

Notice that the functional style of programming allows us to perform multiple tasks concisely using maps and filters.

###### Example

Assuming the following source data:

| Parent | Child           |
| ------ | --------------- |
| Mary   | 'Kate, John ,,' |
| John   | 'Mary,,,      ' |

We use the following RATT code:

```ts
app.use(
  mw.change({
    key: 'Child',
    type: 'string',
    change: values =>
      values.split(',')
        .map(value => value.trim())
        .filter(value => value)}),
)
```

This results in the following RATT record:

| Parent | Child           |
| ------ | --------------- |
| Mary   | ['Kate','John'] |
| John   | ['Mary']        |



#### Changing variants

A *variant* is a value that does not always have the same type.  Variants appear in dirty source data, where a value is sometimes given in one way and sometimes in another way.

If variants are very common then it may be a good idea to look for better source data.  But if that is not feasible, the `change` value can be used to change such variants into uniform values.

Notice that this use case only works for values that have a known set of potential types.  If the source data contains values whose types can vary arbitrarily, then there is no point in using the data.  This means that the source data inherently has no structure, and that traditional transformations cannot be applied.

##### When to use?

This use case can be applied if the following conditions are met:

- The type of a value differs between records.
- The different types that the value can have are known ahead of time.
- The different types that the value can have can be determined unambiguously.

##### Implementation

In such cases we must set the `type` to `'unknown'`.  This allows us to cast the value to a variant.  A variant is represented with the pipe character `|` in TypeScript:

```ts
app.use(
  mw.change({
    key: 'KEY',
    type: 'unknown',
    change: value => {
      const tmp = value as TYPE_1 | ... | TYPE_N
      if (typeof tmp === TYPE_1) {
        FUNCTION_BODY_1
      ...
      } else if (typeof tmp === TYPE_N) {
        FUNCTION_BODY_N
      }}}),
)
```

Notice that a temporary object (`tmp`) is used to store the variant that is the result of casting the current `value`.

For each of the types (`TYPE_1` through `TYPE_N`) in the variant there is a dedicated function body (`FUNCTION_BODY_1` through `FUNCTION_BODY_N`).  There are *N* `if`-clauses that check for the type of the current `value`.

##### Example

In the following example the `name` of a person is sometimes given as a plain string and sometimes as an object with a `fistName` and a `lastName` key:

Record 1:
- name: 'John Doe'

Record 2:
- name:
  - firstName: 'Jane'
  - lastName: 'Doe'

The following function transforms this variant to a uniform string type:

```ts
app.use(
  mw.change({
    key: 'name',
    type: 'unknown',
    change: value => {
      const tmp = value as {firstName: string, lastName: string} | string
      if (typeof tmp === 'string') {
        return tmp
      } else {
        return tmp.firstName+' '+tmp.lastName
      }}}),
)
```

This results in a uniform (i.e., non-variant) RATT record:

| name       |
| ---------- |
| 'John Doe' |
| 'Jane Doe' |



### Copy an existing entry over to a new entry (<code>copy</code>) {#copy}

Copying is the act of creating a new thing that is based on a specific existing thing.

#### Function signature

The `copy` function has the following signature:

```ts
app.use(
  mw.copy({
    fromKey: 'FROM_KEY',
    toKey: 'TO_KEY',
    type: 'VALUE_TYPE',
    change: value => FUNCTION_BODY}),
)
```

This function copies the value from ‘foo’ to ‘bar’.  The `type` key ensures that the value in ‘foo’ is cast to the specified type prior to being copied.

The optional `change` key allows the cast value to be transformed prior to storing it in ‘bar’.  Leaving the `change` key out results in a direct copy in which the value is not modified.

This function emits an error if `fromKey` and `toKey` are the same.  If you want to change a value in-place you should use [`change`](#change) instead.

This function emits an error if `toKey` already exists.  If you want to replace the value in an existing entry then you should use [`replace`](#replace) instead.

The `change` function only takes the `value` argument and does not take the `context` argument.  If you need the `context` argument then they must use [`add`](#add) instead.



### Replace an existing entry based on one other entry (<code>replace</code>) {#replace}

#### Function signature

The `replace` function has the following signature:

```ts
app.use(
  mw.replace({
    fromKey: 'FROM_KEY',
    toKey: 'FROM_TYPE',
    type: 'VALUE_TYPE',
    change?: value => FUNCTION_BODY}),
)
```

- `FROM_KEY` is the name of the entry whose value is going to be used to replace the old value with.
- `FROM_TYPE` is the name of the type that the value in `FROM_KEY` is cast to prior to calling the `change` function on it.
- `TO_KEY` is the name of the entry whose value is going to be replaced.
- The `change` key optionally specifies a function that takes the cast `value` of `FROM_KEY` and that returns the value that will be stored in `TO_KEY`.  If the `change` function is not specified, it is identical to `value => value`.

##### Error conditions

This function emits an error under the following conditions:
- If `FROM_KEY` does not exist in the current RATT record.
- If `TO_KEY` does not exist in the current RATT record.
- If `FROM_KEY` and `TO_KEY` are the same.  Use [`change`](#chage) if you want to change a value in-place.



### Add a new entry based one more than one other entries (<code>add</code>) {#add}

Sometimes a new entry must be added to the RATT record.  If this entry is based on exactly one existing entry then function [`copy`](#copy) is used.  But if the newly added entry depends on more than one entry, then function `add` must be used.

Notice that it is bad practice to use `add` to add a new entry that is based on exactly one existing entry.  In such cases, the use of `copy` is better because it does not require access to the full RATT context.

#### Function signature

The `add` function has the following signature:

```ts
app.use(
  mw.add({
    key: 'NEW_KEY',
    value: context => FUNCTION_BODY}),
)
```

The function can be configured in the following ways:
- `NEW_KEY` must be the name of a new entry in the RATT record.
- `FUNCTION_BODY` the body of a function, taking the RATT context as its input parameter (`context)` and ending with a `return` statement returning the newly added value.

#### Error conditions

This function emits an error if `NEW_KEY` already exists in the current RATT record.

#### Use cases

A common use case for `add` is to create a new column that combines values from two or more entries.

For example, a RATT Record may contain a column for the first name and a column for the last name of persons:

| First name | Last name |
| ---------- | --------- |
| John       | Doe       |
| Jane       | Doe       |

The following example code uses `add` to concatenate these two value into a new value called `Full name`:

```ts
app.use(
  mw.add({
    key: 'Full name',
    value: context =>
      context.asString('First name') +
      ' ' +
      context.asString('Last name')}),
)
```

After this `add` transformation, the RATT Record looks as follows:

| First name | Last name | Full name |
| ---------- | --------- | --------- |
| John       | Doe       | John Doe  |
| Jane       | Doe       | Jane Doe  |


### Record-wide transformations

So far this section has described value-level transformations.  This subsection describes transformations that are applied to the RATT Record level.  These transformations can also be applied at the value level, but would be repetitive to apply multiple times.

#### Remove trailing whitespace

Whitespace at the beginning or end of value is almost never useful.  At the same time, such superfluous whitespace often appears in several parts of the source data.  Since it would be inefficient to remove trailing whitespace on a per-key basis, it is better to remove it for all keys at once.

The following example code removes training whitespace from all values in the current RATT Record:

```ts
app.use(
  mw.trimStrings(),
)
```



## Create statements {#create-statements}

After source data is connected and transformed, the RATT Record is ready to be transformed to linked data.  Linked data statements are assertions or factual statements that consist of 3 terms (triple) or 4 terms (quadruples).

Statements are created with the `mw.addQuad` function.  Calls to this function are part of the pipeline, and must appear inside the scope of `app.use`.


### Create static statements {#static-assertions}

Static linked data statements are statements that only make use of constant terms (see [working with IRIs](#working-with-iris)).  Constant terms are introduced at the beginning of a RATT pipeline, typically prior to the occurrence of the first `app.use` scope.

The following static statements make use of the constant terms introduced in the section on [working with IRIs](#working-with-iris).

```ts
app.use(
  // “John is a person.”
  mw.addQuad(ex.john, a, foaf.Person),
  // “Mary is a person.”
  mw.addQuad(ex.mary, a, foaf.Person),
)
```


### Create dynamic statements {#dynamic-assertions}

Dynamic statements are statements that are based on some aspect of the source data.

We use the following RATT Record as an example:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | null        |
| Germany     | 83190556    |
| Netherlands | 17650200    |

We start with creating the prefix and term declarations (see the section on [working with IRIs](#working-with-iris) for more information):

```ts
const prefix_base = Ratt.prefixer('https://triplydb.com/Triply/example/')
const prefix = {
  def: Ratt.prefixer(prefix_base('def/')),
  id: Ratt.prefixer(prefix_base('id/')),
  xsd: Ratt.prefixer('http://www.w3.org/2001/XMLSchema#'),
}

const def = {
  Country: prefix.def('Country'),
  name: prefix.def('inhabitants'),
}

const xsd = {
  positiveInteger: prefix.xsd('positiveInteger'),
  string: prefix.xsd('string'),
}
```

With these prefix and term constants in place, a dynamic statement is created as follows:

```ts
app.use(
  mw.addQuad(
    mw.toIri('Country', {prefix: prefix.id}),
    def.inhabitants,
    mw.toLiteral('Inhabitants', {datatype: xsd.positiveInteger})),
)
```

Notice the following details:
- `mw.toIri` is used to create a dynamic IRI term.
- Arguments `Country` and `Inhabitants` allow values for these keys to be used from processed RATT Records.
- The IRI prefix for the subject term is specified with constant `prefix.id`.
- `mw.toLiteral` is used to create a dynamic literal term.
- For literals a datatype IRI can be specified.  If no datatype IRI is specified then the default IRI is `xsd.string`.

#### Static and dynamic triples

Be aware that there are different approaches for *static* and *dynamic* IRIs:

- Static IRIs are created with prefix declarations (example [1a]).
- Dynamic IRIs are created with `mw.toIri` and prefix declarations (example [2a]).

```ts
[1a] prefix.id('person')
[2a] mw.toIri('person', {prefix: prefix.id}),
```

Notation [1a] creates the *static* IRI [1b].  This IRI does not depend on the currently processed RATT record.

Notation [2a] creates the *dynamic* IRI in [2b], assuming the `"person"` key contains the value `"John"`.  This IRI depends on the currently processed RATT record.

For a different RATT record, IRI [2c] may be created instead (assuming the `"person"` key contains the value `"Jane"`).

```turtle
[1b] id:person
[2b] id:John
[2c] id:Jane
```

##### When should you use an IRI instead of an URI (which is a literal)?

An IRI is used to identify something, for example the city of Amsterdam. It is expected that accessing it returns linked data. An IRI can be used to make assertions about a subject. On the other hand, a URI is expected to return a non-linked data content, for example an HTML website, and can be used as objects in linked data, for example for inserting further information about the subject resource.
In the example below, the subject IRI is described further by the object's URL.

```sh
<https://dbpedia.org/resource/Amsterdam> rdfs:seeAlso "https://www.iamsterdam.com"^^xsd:anyURI.
```

An IRI can be created with `mw.toIri`, while a URI is created by using `mw.toLiteral` .

##### Limitation of `mw.toLiteral` and `mw.toIri`

There is a limitation for both `mw.toLiteral` and `mw.toIri`. It is not possible to change the value in the record in the `mw.toLiteral` and `mw.toIri` middlewares. The value that is at that moment stored in the record for that key, is then added as either an IRI when called with the `mw.toIri` function or as a literal when called with the function `mw.toLiteral`.

The limitation is shown in the example below. In the example we want to round the inhabitants number to the nearest thousand. We can not transform this in the mw.toLiteral function. Instead we need to add a change middleware which will execute the transformation.

```ts
app.use(
  mw.change({
    key: 'Inhabitants',
    type: 'number',
    change: (value) => value/1000
  ),
  mw.addQuad(
    mw.toIri('Country', {prefix: prefix.id}),
    def.inhabitants,
    mw.toLiteral('Inhabitants', {datatype: xsd.positiveInteger})
  ),
)
```

## Record IDs

If your RATT Records do not contain a unique ID then you can use the `recordId` entry that RATT adds automatically.  These `recordId` values are unique for every record processed in the same pipeline, but they are not an entry into the RATT Record by default.

Record IDs are consistently assigned across runs of the same pipeline.  They generate the same output as long as the input does not change.

The following example code shows how the record ID can be added to each RATT Record:

```ts
app.use(
  mw.add({
    key: 'ID',
    value: context => app.prefix.observation(context.recordId.toString()) }),
  mw.addQuad(mw.toIri(key_id, {prefix: prefix.id}), a, def.Country),
)
```



## Process data conditionally {#process-data-conditionally}

Source data often contains optional values.  These are values that appear in some, but not all records.

Source data often contains 'special' values to denote the absence of a value.  Common examples are values such as `'NULL'` or the empty string (`''`) or 'clear' outliers such as `9999` for a missing year.  We call such values ‘null values’.

The `mw.when` function supports the creation of triples under certain conditions.  The first argument that this function takes establishes whether or not a certain condition is met.  After that, one or more additional statement arguments appear that will only be called if the condition is satisfied.  The generic structure of `mw.when` is as follows:

```ts
app.use(
  mw.when(
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
  mw.when(
    context => context.getNumber('CREATED') != 9999),
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      dct.created,
      mw.toLiteral('CREATED', {datatype: xsd.gYear}))),
)
```

Notice that the conditional function inside the `mw.when` function takes the current RATT context as its single argument and returns a Boolean.


### Missing values

If a value is sometimes completely missing from a source data record, then the following construct can be used to only add a triple in case the value is present:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  mw.when(
    context => context.isNotEmpty('ZIPCODE'),
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      def.zipcode,
      mw.toLiteral('ZIPCODE')),
    ...,
  ),
)
```

Because missing values are very common in source data, RATT introduces special support for when the value for a specific key is missing.  Instead of having to write `context => context.isNotEmpty('foo')` one can simply write the key name instead.  The above example is equivalent to the following:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  mw.when(
    'ZIPCODE',
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      def.zipcode,
      mw.toLiteral('ZIPCODE')),
    ...,
  ),
)
```


### The empty string

Because source data often uses the empty string to signify NULL values, this particular string is treated in a special way by RATT.

```ts
app.use(
  mw.when(
    key.zipcode,
    // Skipped for the empty string.
    ...),
)
```

Notice that it is almost never useful to store the empty string in linked data.  So the treatment of the empty string as a NULL value is the correct default behavior.

## Tree-shaped data

Tree-shaped data is very common in different source systems.  We will use the following JSON source data as an example in this section:

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
        "id": "nl",
        "name": "The Netherlands"
      },
      {
        "id": "de",
        "name": "Germany"
      }
    ]
  }
}
```

The principles that are documented in this section can be applied to any form of tree-shaped data.  For example, the following XML snippet is very similar to the JSON example:

```xml
<?xml version="1.0"?>
<root>
  <metadata>
    <title>
      <name>Data about countries.</name>
    </title>
  </metadata>
  <data>
    <countries>
      <id>nl</id>
      <name>The Netherlands</name>
    </countries>
    <countries>
      <id>de</id>
      <name>Germany</name>
    </countries>
  </data>
</root>
```

### Specifying paths (nested keys)

In tabular data, keys (or column names) are singular.  But in tree-shaped data a *path* of the tree can consist of one or more keys that must be traversed in sequence.

Paths are specified as dot-separated sequences of keys, starting at the top-level and ending at the required value.  For the JSON example in the previous section, RATT can access the `"name"` key inside the `"title"` key, which itself is nested inside the `"metadata"` key.  This path is expressed in [1].  Notice that the path expressed in [1] is different from the path expressed in [2], which also accesses the `"name"` key, but nested inside the `"countries"` and then `"data"` keys.  (The use of the `[0]` index is explained in the next section.)

```
[1] metadata.title.name
[2] data.countries[0].name
```

Path expressions can be used as string keys in many places in RATT.  For example, we can assert the title of a dataset in the following way:

```ts
app.use(
  mw.addQuad(
    prefix.dataset('my-dataset'),
    dct.title,
    mw.toLiteral('metadata.title.name', {language: 'en'})),
)
```

This results in the following assertion:

```trig
dataset:my-dataset dct:title 'Data about countries.'@en.
```

### Accessing lists by index {#accessing-lists-by-index}

Tree-shaped data formats often allow multiple values to be specified in an ordered list.  Examples of this are arrays in JSON and XML elements with the same tag that are directly nested under the same parent element.

RATT is able to access specific elements from lists based on their *index* or position.  Following the standard practice in Computer Science, RATT refers to the first element in the list as having index 0.  The second element has index 1, etc.

For the above example record, we can assert the name of the *first* country as follows:

```ts
app.use(
  mw.addQuad(
    mw.toIri('data.countries[0].id', {prefix: prefix.country}),
    rdfs.label,
    mw.toLiteral('data.countries[0].name', {language: 'en'})),
)
```

This results in the following assertion:

```trig
country:nl rdfs:label 'The Netherlands'@en.
```

We can also assert the name of the *second* country.  Notice that only the index is different (‘1’ instead of ‘0’):

```ts
app.use(
  mw.addQuad(
    mw.toIri('data.countries[1].id', {prefix: prefix.country}),
    rdfs.label,
    mw.toLiteral('data.countries[1].name', {language: 'en'})),
)
```

This results in the following assertion:

```trig
country:de rdfs:label 'Germany'@en.
```

### Iterating over lists of objects {#list-object}

In the previous section, we saw that we were able to assert the name of the first country and the name of the second country.  But what do we do if we want to assert the name for every country in the world?  And what do we do if some countries have a name in 2 languages, but other countries have a name in 1 or 3 languages?  What we need is a simple way to express that we want RATT to make an assertion for every element in a list.

RATT uses the `mw.forEach` function for this purpose.  The following code snippet asserts the name for *each* country in the example data:

```ts
app.use(
  mw.forEach('data.countries',
    mw.addQuad(
      mw.toIri('id', {prefix: prefix.country}),
      rdfs.label,
      mw.toLiteral('name', {language: 'en'}))),
)
```

Notice the following details:
- `mw.forEach` uses the path expression `'data.countries'` to identify the list.
- Inside the `mw.forEach` function, each element in the list is made available separately.
- This allows the `'id'` and `'name'` keys to be identified directly.

The above code snippet makes one assertion for every element in the `"countries"` list:

```trig
country:nl rdfs:label 'The Netherlands'@en.
country:de rdfs:label 'Germany'@en.
```

Notice that `mw.forEach` only works for lists whose elements are *objects*.  See [Iterating over lists of primitives](#list-primitive) for dealing with lists that do not contain objects.

The elements that `mw.forEach` iterates over are themselves RATT records.  This implies that all functions that work for full RATT records also work for the RATT records inside `mw.forEach`.  The RATT records inside an `mw.forEach `function are smaller.  This allows the regular keys of the iterated-over elements to be accessed directly.

In addition to these regular keys, RATT records inside `mw.forEach` also contain additional keys that simplify common operations.  The following subsections explain the following special keys:

- [Index key (`$index`)](#index-key)
- [Parent key (`$parent`)](#parent-key)
- [Root key (`$root`)](#root-key)


#### Index key (`$index`) {#index-key}

Each RATT record that is made available in `mw.forEach` contains the `$index` key.  The value of this key is the index of the element in the list.  This is the same index that is used to access specific elements in an list, as explained in [the section on accessing lists by index](#accessing-lists-by-index).

The index key is often useful for assigning a unique subject IRI to every element.

Suppose we have the following source data.  We do not want to use the values of the `"name"` key for our subject IRI, because these names contain spaces and possibly other problematic characters that make the IRI more difficult to read and use.

```json
{
  "countries": [
    {
      "name": "The Netherlands"
    },
    {
      "name": "Germany"
    },
    {
      "name": "Italy"
    },
    …
  ]
}
```

The following code snippet uses the `$index` key that is made available inside `mw.forEach` in order to create a unique subject IRI for each country:

```ts
app.use(
  mw.forEach('countries',
    mw.addQuad(
      mw.toIri('$index', {prefix: prefix.country}),
      rdfs.label,
      mw.toLiteral('name', {language: 'en'}))),
)
```

This results in the following assertions:

```trig
country:0 rdfs:label 'The Netherlands'@en.
country:1 rdfs:label 'Germany'@en.
country:2 rdfs:label 'Italy'@en.
```


#### Parent key (`$parent`) {#parent-key}

When `mw.forEach` iterates through a list of elements, it makes the enclosing *parent* record available under key `$parent`.

The parent record is the record that directly contains the first key that appears in the path that was specified in `mw.forEach`.

For example, the parent record in the following call is the record that directly contains the `"data"` key:

```ts
app.use(
  mw.forEach('data.countries',
    …
  )
)
```

The `$parent` key can be observed when `logRecord` is used to print the iterated-over elements to the terminal:

```ts
app.use(
  mw.forEach('data.countries',
    mw.debug.logRecord()),
  )
)
```

For our example source data, this emits the following 2 RATT records:

```json
{
  "id": "en",
  "name": "The Netherlands",
  "$index": 0,
  "$parent": {
    "data": {
      "labels": [
        {
          "id": "en",
          "name": "The Netherlands",
        },
        {
          "id": "de"
          "name": "Germany",
        }
      ]
    }
  },
  "$root": "__circular__"
}
```

and:

```json
{
  "id": "de",
  "name": "Germany",
  "$index": 1,
  "$parent": {
    "data": {
      "labels": [
        {
          "id": "en",
          "name": "The Netherlands",
        },
        {
          "id": "de"
          "name": "Germany",
        }
      ]
    }
  },
  "$root": "__circular__"
}
```

The `$root` key is explained in [the next section](#root-key).


#### Root key (`$root`) {#root-key}

Sometimes it may be necessary to access a part of the original RATT record that is outside of the scope of the `mw.forEach` call.

Every RATT record inside a ` mw.forEach` call contains the `"$root"` key.  The value of the root key provides a link to the full RATT record.  Because the `$root` key is part of the linked-to RATT record, it is not possible to print the value of the root key.  (This would result in infinite output.)  For this reason, the value of the `$root` key is printed as the special value `"__circular__"`.

For the above examples, the parent record and root record are the same, but this is not always the case.  Specifically, the parent record and root record are different when `mw.forEach` calls are nested.

The following data contains an inner list (key `"labels"`) inside an outer list (`"countries"`):

```json
{
  "data": {
    "countries": [
      {
        "id": "NL",
        "labels": [
          {
            "name": "The Netherlands",
            "locale": "en-us"
          },
          {
            "name": "Nederland",
            "locale": "nl-nl"
          }
        ]
      },
      {
        "id": "EN",
        "labels": [
          {
            "name": "England",
            "locale": "en-gb"
          }
        ]
      }
    ]
  }
}
```

The following nested `mw.forEach` call shows the difference between the `"$parent"` key and the `$root` key.  The `$parent` key allows the individual country objects to be accessed, while the `"$root"` key allows the entire tree to be accessed:

```ts
app.use(
  mw.forEach('data.countries',
    mw.forEach('labels',
      mw.debug.logRecord())),
)
```

The following RATT record is printed first (3 records are printed in total).  Notice that the value of the outer `$parent` and `"$root"` keys are now different:
- The `$parent` key allows access to the first country.
- The `$root` key allows access to the full record (describing multiple countries).

```json
{
  "name": "The Netherlands",
  "locale": "en-us",
  "$index": 0,
  "$parent": {
    "id": "NL",
    "labels": [
      {
        "name": "The Netherlands",
        "locale": "en-us"
      },
      {
        "name": "Nederland",
        "locale": "nl-nl"
      }
    ],
    "$index": 0,
    "$parent": {
      "data": {
        "countries": [
          {
            "id": "NL",
            "labels": "__circular__"
          },
          {
            "id": "EN",
            "labels": [
              {
                "name": "England",
                "locale": "en-gb"
              }
            ]
          }
        ]
      }
    },
    "$root": "__circular__"
  },
  "$root": "__circular__"
}
```


### Iterating over lists of primitives {#list-primitive}

In [the previous section](#list-object) we showed how to iterate over lists of objects.  But what happens if a list does not contain objects but elements of primitive type?  Examples include lists of strings or lists of numbers.

Function `mw.forEach` does not work with lists containing primitive types, because it assumes a RATT record structure which can only be provided by objects.  Luckily, RATT includes the functions `mw.toIri.forEach` and `mw.toLiteral.forEach` that can be specifically used to iterate over lists of primitives.

```ts
  app.use(
    mw.fromJson({"id": "nl", "names": ["The Netherlands", "Holland"]}),
    mw.addQuad(
      mw.toIri('id', {prefix: prefix.country}),
      rdfs.label,
      mw.toLiteral.forEach('names', {language: 'en'})),
  )
```

This makes the following assertion:

```trig
country:nl rdfs:label 'The Netherlands'@en,
                      'Holland'@en.
```
