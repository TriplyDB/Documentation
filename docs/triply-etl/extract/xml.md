[TOC]

# XML extractor

XML or Extensible Markup Language (file name extension `.xml`) is a popular open format for tree-shaped source data. TriplyETL has a dedicated `fromXml()` extractor for this data format.



## Basic usage

The XML extractor is imported in the following way:

```ts
import { fromXml, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records from an XML file that is stored as a [TriplyDB Asset](../sources/triplydb-assets.md):

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  {selectors: 'first-element'}
),
```

Notice that the `fromXml()` extractor requires a `selectors` option. This specifies the subtrees in the XML that should be treated as individual records. In the above snippet the records are the subtrees that occur between the `<first-element>` opening tag and the `</first-element>` closing tag.



## Path selectors

If a deeper path must be specified, sequential tags in the path must be separated by a dot:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element.second-element.third-element' }
),
```

It is common for large XML sources to contain different kinds of records. Different kinds of records often occur under different paths. It is therefore possible to specify multiple paths, all of which will be used for extract records from the XML source.

The following code snippet extracts records for three different paths in the same XML source:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  {
    selectors: [
      'first-element.second-element.third-element',
      'first-element.second-element.alt-element',
      'first-element.second-element.other-element',
    ]
  }
),
```

TriplyETL supports the W3C XML standard.



### Nested keys

Since XML can store tree-shaped data, it can have nested keys (paths) and indexed arrays.

```xml
<?xml version="1.0"?>
<root>
  <metadata>
    <title>
      <name>Data about countries.</name>
    </title>
  </metadata>
  <data>
    <country "country.id"="nl">
      <name>The Netherlands</name>
    </country>
    <country "country.id"="de">
      <name>Germany</name>
    </country>
  </data>
</root>
```

Paths are specified as dot-separated sequences of keys, starting at the top-level and ending at the required value. For the XML example above, TriplyETL can access the textual content inside the `"name"` key, which itself is nested inside the `"title"`, `"metadata"`, and `"root"` keys. This path is expressed in [1]. Notice that the path expressed in [1] is different from the path expressed in [2], which accesses the textual content of the `"name"` key, but nested inside the `"country"`, `"data"`, and `"root"` keys. (The use of the `[0]` index is explained in the next section.)

```
[1] root.metadata.title.name.$text
[2] root.data.country[0].name.$text
```

Path expressions can be used as string keys in many places in TriplyETL. For example, we can assert the title of a dataset in the following way:

```ts
etl.use(
  triple(
    prefix.dataset('my-dataset'),
    dct.title,
    literal('root.metadata.title.name.$text', 'en')
  ),
)
```

This results in the following assertion:

```trig
dataset:my-dataset dct:title 'Data about countries.'@en.
```


### Dealing with dots in keys

In the previous section we saw that dots are used to separate keys in paths. However, sometimes a dot can occur as a regular character inside a key. In such cases, we need to apply additional escaping of the key name to avoid naming conflicts.

The example data from the previous section contains XML attribute [1], which is represented by key [2] in the TriplyETL record.

```
[1] country.id
[2] ["@country.id"]
```

Notice that the dot in [2] is part of the key name. The escape notation `["..."]` ensures that the dot is not misinterpreted as denoting a sequence of keys.

Overall, ‘a.b’ notation allow going into nested object and accessing values within the nest while ‘[“a.b”]’ takes value a.b key as a name, therefore does not go into the nest.

The following extensive example shows how complex sequences of keys with dots in them can be used:

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

<!--
Another example:

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
| Key                               | Value  |
| --------------------------------- | ------ |
| ["soort_collectie.lref"][0].$text | 63335  |
| soort_collectie.lref[0].$text     | error  |
| soort_collectie.value[0]$text     | museum |
```
--->

## Index-based list access

Tree-shaped data formats often allow multiple values to be specified in an ordered list. Examples of this are arrays in JSON and XML elements with the same tag that are directly nested under the same parent element.

TriplyETL is able to access specific elements from lists based on their index or position. Following the standard practice in Computer Science, TriplyETL refers to the first element in the list as having index 0. The second element has index 1, etc.

For the above example record, we can assert the name of the first country as follows:

```ts
triple(
  iri(prefix.country, 'root.data.country[0].["@country.id"]'),
  rdfs.label,
  literal('root.data.countries[0].name.$text', 'en')
),
```

This results in the following assertion:

```turtle
country:nl rdfs:label 'The Netherlands'@en.
```

We can also assert the name of the second country. Notice that only the index is different (‘1’ instead of ‘0’):

```ts
triple(
  iri(prefix.country, 'root.data.countries[1].["@country.id"]'),
  ...
```

This results in the following assertion:

```r
country:de rdfs:label 'Germany'@en.
```
