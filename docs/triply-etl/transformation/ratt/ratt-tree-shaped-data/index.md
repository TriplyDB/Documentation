---
title: "Triply ETL: RATT - Tree-Shaped Data"
path: "/docs/triply-etl/ratt-tree-shaped-data"
---

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

In tabular data, keys (or column names) are singular.  But in tree-shaped data apath* of the tree can consist of one or more keys that must be traversed in sequence.

Paths are specified as dot-separated sequences of keys, starting at the top-level and ending at the required value.  For the JSON example in the previous section, RATT can access the `"name"` key inside the `"title"` key, which itself is nested inside the `"metadata"` key.  This path is expressed in [1].  Notice that the path expressed in [1] is different from the path expressed in [2], which also accesses the `"name"` key, but nested inside the `"countries"` and then `"data"` keys.  (The use of the `[0]` index is explained in the next section.)

```
[1] metadata.title.name
[2] data.countries[0].name
```

Path expressions can be used as string keys in many places in RATT.  For example, we can assert the title of a dataset in the following way:

```ts
app.use(
  triple(
    prefix.dataset('my-dataset'),
    dct.title,
    literal('metadata.title.name', 'en')),
)
```

This results in the following assertion:

```trig
dataset:my-dataset dct:title 'Data about countries.'@en.
```


### Dealing with dots in RATT keys

Mishandling dots in RATT keys can be quite troubling and difficult to detect since RATT would not always show an error in the code. In order to prevent that, there is a syntax that allow us to give the code the functionality that is needed. RATT uses the lodash library to implement dot-based path notation. 

Example: 

```ts
  when('narrower_term_lref', [
    triple(iri('_entity'), la.has_member, iri(prefix.collectors, 'narrower_term_lref[0].$text')),
  ]),

  when('["soort_collectie.lref"]', [
    triple(iri('_entity'), crm.P2_has_type, iri(prefix.thesaurus, '["soort_collectie.lref"][0].$text')),
  ]), 
```

Here we can notice that in the first code snippet the notation does not seem to have extra requirements since it is referring to a key that does not use a special character such as dot. The second one, however, has a condition name that contains a dot. Therefore, when conditioning the statement we use the ‘[“a.b”]’ syntax. In this case we can observe using a RATT key as an array key. If we need an element from this array, the key should be addressed with the name notation – ‘[“a.b”].$text’. 

Overall, ‘a.b’ notation allow going into nested object and accessing values within the nest while ‘[“a.b”]’ takes value a.b key as a name, therefore does not go into the nest.
 In the following example the differences can be seen with the corresponding result:

```json
{
  "a": {
    "$text": "1"
  },
  "b": {
    "c": {
      "$text": "2"
    }
  },
  "b.c": {
    "$text": "3"
  },
  "d.d": {
    "e": {
      "$text": "4"
    },
    "f": {
      "$text": "5"
    }
  },
  "g.g": [
    {
      "h.h": {
        "$text": "6"
      }
    },
    {
      "h.h": {
        "$text": "7"
      }
    }
  ]
}
```
| Key                       | Value       |
| ------------------------  | ----------- |
| 'a.$text'                 | 1           | 
| 'b.c.$text'               | 2           |
| '["b.c"].$text'           | 3           |    
| '["d.d"].e.$text'         | 4           |
| '["d.d"].f'.$text'        | 5           |
| '["g.g"][0]["h.h"].$text' | 6           | 
| '["g.g"][1]["h.h"].$text' | 7           |

Using the example at the top: 


```ts
when('["soort_collectie.lref"]', [
  triple(iri('_entity'), crm.P2_has_type, iri(prefix.thesaurus, '["soort_collectie.lref"][0].$text')),
]),
```
```
│   "soort_collectie": [                                               │
│     {                                                                │
│       "value": [                                                     │
│         {                                                            │
│           "$text": "museum",                                         │
│           "@invariant": "false",                                     │
│           "@lang": "en-US"                                           │
│         },                                                           │
│         {                                                            │
│           "$text": "museum",                                         │
│           "@invariant": "false",                                     │
│           "@lang": "nl-NL"                                           │
│         }                                                            │
│       ]                                                              │
│     }                                                                │
│   ],                                                                 │
│   "soort_collectie.lref": [                                          │
│     {                                                                │
│       "$text": "63335"                                               │
│     }                                                                │
│   ], 
```

```
| Key                                | Value       |
| ------------------------           | ----------- |
| ‘[“soort_collectie.lref”][0].$text | 63335       | 
| ‘soort_collectie.lref[0].$text’    | empty       |
| ‘soort_collectie.value[0]$text’    | museum      |    
```

### Accessing lists by index {#accessing-lists-by-index}

Tree-shaped data formats often allow multiple values to be specified in an ordered list.  Examples of this are arrays in JSON and XML elements with the same tag that are directly nested under the same parent element.

RATT is able to access specific elements from lists based on theirindex* or position.  Following the standard practice in Computer Science, RATT refers to the first element in the list as having index 0.  The second element has index 1, etc.

For the above example record, we can assert the name of thefirst* country as follows:

```ts
app.use(
  triple(
    iri(prefix.country, 'data.countries[0].id'),
    rdfs.label,
    literal('data.countries[0].name', 'en')),
)
```

This results in the following assertion:

```r
country:nl rdfs:label 'The Netherlands'@en.
```

We can also assert the name of thesecond* country.  Notice that only the index is different (‘1’ instead of ‘0’):

```ts
app.use(
  triple(
   iri(prefix.country, 'data.countries[1].id'),
```

This results in the following assertion:

```r
country:de rdfs:label 'Germany'@en.
```

### Iterating over lists of objects {#list-object}

In the previous section, we saw that we were able to assert the name of the first country and the name of the second country.  But what do we do if we want to assert the name for every country in the world?  And what do we do if some countries have a name in 2 languages, but other countries have a name in 1 or 3 languages?  What we need is a simple way to express that we want RATT to make an assertion for every element in a list.

RATT uses the `forEach` function for this purpose.  The following code snippet asserts the name foreach* country in the example data:

```ts
app.use(
  forEach('data.countries',
    triple(
      iri(prefix.country, 'id'),
      rdfs.label,
      literal('name', 'en'))),
)
```

Notice the following details:
- `forEach` uses the path expression `'data.countries'` to identify the list.
- Inside the `forEach` function, each element in the list is made available separately.
- This allows the `'id'` and `'name'` keys to be identified directly.

The above code snippet makes one assertion for every element in the `"countries"` list:

```r
country:nl rdfs:label 'The Netherlands'@en.
country:de rdfs:label 'Germany'@en.
```

Notice that `forEach` only works for lists whose elements areobjects*.  See [Iterating over lists of primitives](#list-primitive) for dealing with lists that do not contain objects.

The elements that `forEach` iterates over are themselves RATT records.  This implies that all functions that work for full RATT records also work for the RATT records inside `forEach`.  The RATT records inside an `forEach `function are smaller.  This allows the regular keys of the iterated-over elements to be accessed directly.

In addition to these regular keys, RATT records inside `forEach` also contain additional keys that simplify common operations.  The following subsections explain the following special keys:

- [Index key (`$index`)](#index-key)
- [Parent key (`$parent`)](#parent-key)
- [Root key (`$root`)](#root-key)


#### Index key (`$index`) {#index-key}

Each RATT record that is made available in `forEach` contains the `$index` key.  The value of this key is the index of the element in the list.  This is the same index that is used to access specific elements in an list, as explained in [the section on accessing lists by index](#accessing-lists-by-index).

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

The following code snippet uses the `$index` key that is made available inside `forEach` in order to create a unique subject IRI for each country:

```ts
app.use(
  forEach('countries',
    triple(
      iri(prefix.country, '$index'),
      rdfs.label,
      literal('name', 'en'))),
)
```

This results in the following assertions:

```r
country:0 rdfs:label 'The Netherlands'@en.
country:1 rdfs:label 'Germany'@en.
country:2 rdfs:label 'Italy'@en.
```


#### Parent key (`$parent`) {#parent-key}

When `forEach` iterates through a list of elements, it makes the enclosingparent* record available under key `$parent`.

The parent record is the record that directly contains the first key that appears in the path that was specified in `forEach`.

For example, the parent record in the following call is the record that directly contains the `"data"` key:

```ts
app.use(
  forEach('data.countries',
    …
  )
)
```

The `$parent` key can be observed when logRecord` is used to print the iterated-over elements to the terminal:


```ts
app.use(
  forEach('data.countries',
    logRecord())
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

Sometimes it may be necessary to access a part of the original RATT record that is outside of the scope of the `forEach` call.

Every RATT record inside a ` forEach` call contains the `"$root"` key.  The value of the root key provides a link to the full RATT record.  Because the `$root` key is part of the linked-to RATT record, it is not possible to print the value of the root key.  (This would result in infinite output.)  For this reason, the value of the `$root` key is printed as the special value `"__circular__"`.

For the above examples, the parent record and root record are the same, but this is not always the case.  Specifically, the parent record and root record are different when `forEach` calls are nested.

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

The following nested `forEach` call shows the difference between the `"$parent"` key and the `$root` key.  The `$parent` key allows the individual country objects to be accessed, while the `"$root"` key allows the entire tree to be accessed:

```ts
app.use(
  forEach('data.countries',
    forEach('labels',
      logRecord())),
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

Function `forEach` does not work with lists containing primitive types, because it assumes a RATT record structure which can only be provided by objects.  Luckily, RATT includes the functions `iri.forEach` and `literal.forEach` that can be specifically used to iterate over lists of primitives.

```ts
  app.use(
    fromJson({"id": "nl", "names": ["The Netherlands", "Holland"]}),
    triple(
      iri(prefix.country, 'id'),
      rdfs.label,
      literal.forEach('names', 'en')),
  )
```

This makes the following assertion:

```r
country:nl rdfs:label 'The Netherlands'@en,
                      'Holland'@en.
```
