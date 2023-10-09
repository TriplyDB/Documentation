# Control Structures

This page documents how you can use control structures in your ETL configuration.



## Process data conditionally (`when()`)

Source data often contains optional values.  These are values that appear in some, but not all records.

Source data often contains 'special' values that denote the absence of a value.  Common examples are values such as `'NULL'` or the empty string (`''`) or 'clear' outliers such as `9999` for a missing year.  We call such values ‘null values’.

The `when()` function allows part of a TriplyETL configuration to run when certain conditions are met.  The first parameter is used to determine whether or not the remaining parameters should be called:

```ts
when('{condition}',
  '{statement-1}',
  '{statement-2}',
  '{statement-3}',
  // etc
),
```

Notice that it is often useful to specify multiple statements under the same condition:

1. The first statement transforms an optional value, and the second statement uses the transformed optional value to make a triple assertion.
2. The first statement asserts one triple based on the optional value, and the second statement asserts a second triple based on the same optional value.



### Missing values

If a value is sometimes completely missing from a source data record, the `when()` conditional function can be used.

The following code snippet assets a triple if and only if a value for the `'zipcode'` key is present in the Record:

```ts
when(context => context.isNotEmpty('zipcode'),
  triple(iri(prefix.id, 'id'), def.zipcode, 'zipcode'),
),
```

Since checking for the presence or absence of a single record is very common, the above can also be written as follows:

```ts
when('zipcode',
  triple(iri(prefix.id, 'id'), def.zipcode, 'zipcode'),
),
```



### The empty string

In many source data formats, the empty string is used to signify a missing value, this particular string is treated in a special way by `when()`.  A key whose value is the empty string is treated in the same way as a key that is altogether absent.

The following code snippet will *not* print the record to standard output, because the `'zipcode'` key is considered empty:

```ts
fromJson([{ zipcode: '' }]),
when('zipcode',
  logRecord(),
),
```

Notice that it is almost never useful to store the empty string in linked data.  So the treatment of empty strings as NULL values is the correct default behavior.



## NULL values (`when()` and `whenNotEqual()`)

If a key contains specific values that are indended to represent NULL values, then these must be specifically identified the first `when()` parameter.

The following code snippet identifies the value 9999 for the `'created'` key as denoting a NULL values.  This means that the year 9999 is used in the source system whenever the actual year of creation was unknown.

```ts
when(context => context.getNumber('created') != 9999,
  triple(iri(prefix.id, 'id'), dct.created, literal('created', xsd.gYear)),
),
```

Since checking the value of one specific key is very common, the above can be written as follows, using the more specific `whenNotEqual` function:

```ts
whenNotEqual('created', 9999,
  triple(iri(prefix.id, 'id'), dct.created, literal('created', xsd.gYear)),
),
```

Notice that the use of `whenNotEqual()` makes the configuration easier to read.  The same shorthand notation works when there are multiple NULL values in the source data.

The following code snippet only asserts a triple if the year of creation is neither 9999 nor -1.  Notice that the array can contain any number of potential NULL values:

```ts
whenNotEqual('created', [-1, 9999],
  triple(iri(prefix.id, 'id'), dct.created, literal('created', xsd.gYear)),
),
```



## Iterating over lists of objects (`forEach()`)

In the previous section, we saw that we were able to assert the name of the first country and the name of the second country.  But what do we do if we want to assert the name for every country in the world?  And what do we do if some countries have a name in 2 languages, but other countries have a name in 1 or 3 languages?  What we need is a simple way to express that we want to make an assertion for every element in a list.

TriplyETL provides the `forEach()` function for this purpose.  The following code snippet asserts the name for each country in the example data:

```ts
forEach('data.countries',
  triple(iri(prefix.id, 'id'), rdfs.label, 'name'),
),
```

Notice the following details:
- `forEach()` uses the path expression `'data.countries'` to identify the list.
- Inside the `forEach()` function, each element in the list is made available separately.
- This allows the `'id'` and `'name'` keys to be identified directly.

The above code snippet makes one assertion for every element in the `"countries"` list:

```turtle
country:nl rdfs:label 'The Netherlands'.
country:de rdfs:label 'Germany'.
```

Notice that `forEach()` only works for lists whose elements are objects*.  See [Iterating over lists of primitives](/triply-etl/tmp/tmp.md#list-primitive) for dealing with lists that do not contain objects.

The elements that `forEach()` iterates over are themselves (sub)records.  This implies that all functions that work for full records also work for the (sub)records inside `forEach()`.  The (sub)records inside an `forEach()` function are smaller.  This allows the regular keys of the iterated-over elements to be accessed directly.

In addition to these regular keys, (sub)records inside `forEach()` also contain additional keys that simplify common operations.  The following subsections explain the following special keys:

- [Index key (`$index`)](#index-key-index)
- [Parent key (`$parent`)](#parent-key-parent)
- [Root key (`$root`)](#root-key-root)


### Index key (`$index`)

Each (sub)record that is made available in `forEach()` contains the `$index` key.  The value of this key is the index of the element in the list.  This is the same index that is used to access specific elements in an list, as explained in [the section on accessing lists by index](/triply-etl/extract/formats#accessing-lists-by-index).

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
    }
  ]
}
```

The following code snippet uses the `$index` key that is made available inside `forEach` in order to create a unique subject IRI for each country:

```ts
forEach('countries',
  triple(iri(prefix.id, '$index'), rdfs.label, 'name'),
),
```

This results in the following assertions:

```turtle
country:0 rdfs:label 'The Netherlands'.
country:1 rdfs:label 'Germany'.
country:2 rdfs:label 'Italy'.
```


### Parent key (`$parent`)

When `forEach()` iterates through a list of elements, it makes the enclosingparent* record available under key `$parent`.

The parent record is the record that directly contains the first key that appears in the path that was specified in `forEach()`.

For example, the parent record in the following call is the record that directly contains the `"data"` key:

```ts
forEach('data.countries',
  // etc
),
```

The `$parent` key can be observed when logRecord` is used to print the iterated-over elements to the terminal:


```ts
forEach('data.countries',
  logRecord(),
),
```

For our example source data, this emits the following 2 records:

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

The `$root` key is explained in [the next section](#root-key-root).


### Root key (`$root`)

Sometimes it may be necessary to access a part of the original record that is outside of the scope of the `forEach()` call.

Every (sub)record inside a ` forEach()` call contains the `"$root"` key.  The value of the root key provides a link to the full record.  Because the `$root` key is part of the linked-to record, it is not possible to print the value of the root key.  (This would result in infinite output.)  For this reason, the value of the `$root` key is printed as the special value `"__circular__"`.

For the above examples, the parent record and root record are the same, but this is not always the case.  Specifically, the parent record and root record are different when `forEach()` calls are nested.

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

The following nested `forEach()` call shows the difference between the `"$parent"` key and the `$root` key.  The `$parent` key allows the individual country objects to be accessed, while the `"$root"` key allows the entire tree to be accessed:

```ts
forEach('data.countries',
  forEach('labels',
    logRecord(),
  ),
),
```

The following record is printed first (3 records are printed in total).  Notice that the value of the outer `$parent` and `"$root"` keys are now different:
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



## Specify multiple conditions (`ifElse()`)

The `ifElse()` function in TriplyETL allows us to specify multiple conditions based on which other functions are run.
Every condition is specified with an `if` key. In case the condition is true, the functions specified in the `then` key are run.
If none of the `if` conditions are true, the functions specified in an `else` key, if present, are run.
 
### Parameters

The first parameter must be an `{ if: ..., then: ... }` object. 
The non-first parameters are either additional `{ if: ..., then: ... }` objects or a final `{ else: ... }` object.
 
Each `if` key specifies a condition that is either true or false.
Conditions are either a key name or a function that takes the Etl Context and returns a Boolean value.
Specifying a key name is identical to specifying the following function:

`ctx => ctx.getString('KEY')`
 
The `then` and `else` keys take either one function, or an array of zero or more functions.

### Example 1

The following code snippet uses different conditions to determine the age category that a person belongs to:
 
```ts
fromJson([
  { id: 'johndoe', age: 12 },
  { id: 'janedoe', age: 32 },
  // ...
]),
addIri({
  prefix: prefix.person,
  content: 'id',
  key: '_person',
}),
ifElse({
  if: ctx => ctx.getNumber('age') < 12,
  then: triple('_person', a, def.Child),
}, {
  if: ctx => {
    const age = ctx.getNumber('age')
    return age >= 12 && age < 20
  },
  then: triple('_person', a, def.Teenager),
}, {
  if: ctx => {
    const age = ctx.getNumber('age')
    return age >= 20 && age < 65
  },
  then: triple('_person', a, def.Adult),
}, {
  else: triple('_person', a, def.Senior),
}),
```
 
### Example 2

The following snippet either asserts data about persons or data about organizations, and uses an `ifElse` to make the conditional determination on which assertion to make:
 
```ts
fromJson([
  { first: 'John', last: 'Doe' },
  { name: 'Triply' },
]),
ifElse({
  if: 'name',
  then:
    pairs(iri(prefix.id, 'name'),
      [a, sdo.Organization],
      [sdo.name, 'name'],
    ),
}, {
  else: [
    concat({
      content: ['first', 'last'],
      separator: '-',
      key: 'name',
    }),
    pairs(iri(prefix.id, 'name'),
      [a, sdo.Person],
      [sdo.givenName, 'first'],
      [sdo.familyName, 'last'],
    ),
  ],
}),
```



## Switch between different cases (`_switch()`)

The function `_switch()` allows us to switch between different cases, based on the value of a specified key.

The signature is as follows;

```ts
_switch(key,
  [value_1, functions_1],
  ...,
  [value_n, functions_n],
  default_functions,
)
```

### Parameters

- `key` The key parameter whose value is compared against the specified values.
- Each case consists of a list of two elements:
  - `value_i` is the value that is checked for equivalence with the value stored in `key`.
  - `functions_i` is the function or list of functions that is executed when the value in `key` is equivalent to `value_i`.
- `default_functions` is the function or list of functions that is executed when `key` matches neither of the cases.

Notice that we must write `_switch()` because `switch` is a reserved keyword in ECMAScript.

An error is emitted if the value for `key` does not match any of the cases and no default case is specified.
 
### Example 1

When an ETL uses multiple data sources, we can use a `_switch()` to run a dedicated sub-ETL for each data source.
 
Suppose we have two tabular data sources: `file.episodes` and `file.people`.
We can use the following `_switch()` statement to run different sub-ETLs:
 
```ts
_switch(key.fileName,
  [file.episodes, etl_episodes],
  [file.people, etl_people],
),
```
 
### Example 2

When ETLs transform different kinds of entities, it can be useful to run a sub-ETL based on the type of entity.
 
For example, if the current Etl Record represents a person, we want to assert their age. But if the current Etl Record represents a location, we want to assert its latitude and longitude:
 
```ts
const etl_location = [
  triple('iri', sdo.latitude, literal('lat', xsd.double)),
  triple('iri', sdo.longitude, literal('long', xsd.double)),
]
 
const etl_person = [
  triple('iri', sdo.age, literal('age', xsd.nonNegativeInteger)),
]
 
etl.run(
  _switch('type',
    ['location', etl_location],
    ['person', etl_person],
 ),
)
```
