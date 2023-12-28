[TOC]

# JSON extractor

JSON or JavaScript Object Notation (file name extension `.json`) is a popular open standard for interchanging tree-shaped data. TriplyETL has a dedicated `fromJson()` extractor for this format.



## Basic usage

The JSON extractor is imported in the following way:

```ts
import { fromJson, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records from a JSON source that is stored as a [TriplyDB asset](../sources/triplydb-assets.md):

```ts
fromJson(
  Source.TriplyDb.asset(
    'some-account',
    'some-dataset',
    { name: 'example.json.gz' }
  )
),
```

The following example uses an in-line specified JSON source:

```ts
fromJson([{ a: 'a', b: 'b', c: 'c' }]),
```

TriplyETL supports the [IETF RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) standard for JSON.



## Nested keys

Since JSON is a tree-shaped format, it is able to store values in a nested structure. This requires a sequence or 'path' of keys to be specified.

We use the following example data:

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
        "country.id": "nl",
        "name": "The Netherlands"
      },
      {
        "country.id": "de",
        "name": "Germany"
      }
    ]
  }
}
```

Paths are specified as dot-separated sequences of keys, starting at the top-level and ending at the required value. For the JSON example in the previous section, TriplyETL can access the `"name"` key inside the `"title"` key, which itself is nested inside the `"metadata"` key. This path is expressed in [1]. Notice that the path expressed in [1] is different from the path expressed in [2], which also accesses the `"name"` key, but nested inside the `"countries"` and then `"data"` keys. (The use of the `[0]` index is explained in the next section.)

```
[1] metadata.title.name
[2] data.countries[0].name
```

Path expressions can be used as string keys in many places in TriplyETL. For example, we can assert the title of a dataset in the following way:

```ts
triple('_dataset', dct.title, 'metadata.title.name'),
```

This asserts the following linked data:

```turtle
dataset:my-dataset dct:title 'Data about countries.'.
```



## Dealing with dots in keys

In the previous section we saw that dots are used to separate keys in paths. However, sometimes a dot can occur as a regular character inside a key. In such cases, we need to apply additional escaping of the key name to avoid naming conflicts.

The example data from the previous section contains the following key:

```ts
"country.id"
```

Notice that the dot is here part of the key name. We can refer to these keys as follows:

```ts
triple('_country', dct.id, 'data.countries[0].["country.id"]'),
```

Notice the use of additional escaping: `["..."]`



## Index-based list access

Tree-shaped data formats often allow multiple values to be specified in an ordered list. Examples of this are arrays in JSON and XML elements with the same tag that are directly nested under the same parent element.

TriplyETL is able to access specific elements from lists based on theirindex* or position. Following the standard practice in Computer Science, TriplyETL refers to the first element in the list as having index 0. The second element has index 1, etc.

For the above example record, we can assert the name of thefirst* country as follows:

```ts
triple(
  iri(prefix.id, 'data.countries[0].["country.id"]'),
  rdfs.label,
  'data.countries[0].name'
),
```

This results in the following linked data:

```turtle
id:nl rdfs:label 'The Netherlands'.
```

We can also assert the name of the second country. Notice that only the index is different (`1` instead of `0`):

```ts
triple(
  iri(prefix.id, 'data.countries[1].["country.id"]'),
  rdfs.label,
  'data.countries[1].name'
),
```

This results in the following linked data:

```turtle
id:de rdfs:label 'Germany'.
```
