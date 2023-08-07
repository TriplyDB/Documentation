## Create statements {#create-statements}

After source data is connected and transformed, the RATT Record is ready to be transformed to linked data.  Linked data statements are assertions or factual statements that consist of 3 terms (triple) or 4 terms (quadruples).


Statements are created with the `triple` function.  Calls to this function are part of the pipeline, and must appear inside the scope of `app.use`.



### Create static statements {#static-assertions}

Static linked data statements are statements that only make use of constant terms (see [working with IRIs](https://triply.cc/docs/ratt-extract#working-with-iris)).  Constant terms are introduced at the beginning of a RATT pipeline, typically prior to the occurrence of the first `app.use` scope.

The following static statements make use of the constant terms introduced in the section on [working with IRIs](https://triply.cc/docs/ratt-extract#working-with-iris).

```ts
app.use(
  // “John is a person.”
  triple(ex.john, a, foaf.Person),
  // “Mary is a person.”
  triple(ex.mary, a, foaf.Person),
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

We start with creating the prefix and term declarations (see the section on [working with IRIs](https://triply.cc/docs/ratt-extract#working-with-iris) for more information):

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


const input_string  = ['Country', 'inhabitants']
```

With these prefix and term constants in place, a dynamic statement is created as follows:

```ts
app.use(
  triple(
    iri('Country', {prefix: prefix.id}),
    def.inhabitants,
    literal('Inhabitants', {datatype: xsd.positiveInteger})),
)
```

Notice the following details:
- `iri` is used to create a dynamic IRI term.
- Arguments `Country` and `Inhabitants` allow values for these keys to be used from processed RATT Records.
- The IRI prefix for the subject term is specified with constant `prefix.id`.
- `literal` is used to create a dynamic literal term.
- For literals a datatype IRI can be specified.  If no datatype IRI is specified then the default IRI is `xsd.string`.

`iri.hashed`can be used instead of `iri` when the ETL has a high number of blank nodes and they need more than one constant as input to hash a unique IRI.

```ts
app.use(
  triple(
    iri.hashed(prefix.id, input_string),
    def.inhabitants,
    mw.toLiteral('Inhabitants', {datatype: xsd.positiveInteger})),
)
```


Notice the following details:
- `input_string` can pass more than one constant to hash a unique IRI term.


#### Static and dynamic triples

Be aware that there are different approaches for *static* and *dynamic* IRIs:

- Static IRIs are created with prefix declarations (example [1a]).
- Dynamic IRIs are created with `iri`,`iri.hashed` and prefix declarations (example [2a]).

```ts
[1a] prefix.id('person')
[2a] iri(prefix.id, 'person'),
[3a] iri.hashed(prefix.id, ['person','age']),

```

Notation [1a] creates the *static* IRI [1b].  This IRI does not depend on the currently processed RATT record.

Notation [2a] creates the *dynamic* IRI in [2b], assuming the `"person"` key contains the value `"John"`.  This IRI depends on the currently processed RATT record.

For a different RATT record, IRI [2c] may be created instead (assuming the `"person"` key contains the value `"Jane"`).

Notation [3a] creates the *dynamic* IRI in [3b], assuming the `"person"` key contains the value `"Sam"` and the
`"age"` key contains the value `"30"`. For a different RATT record, IRI [3c] may be created instead (assuming the `"person"` key contains the value `"Roland"` and `"age"` key contains the value `"20"`).

```turtle
[1b] id:person
[2b] id:John
[2c] id:Jane
[3b] id:Sam , age: 30
[3c] id:Sam , age: 20
```



##### When should you use an IRI instead of an URI (which is a literal)?

An IRI is used to identify something, for example the city of Amsterdam. It is expected that accessing it returns linked data. An IRI can be used to make assertions about a subject. On the other hand, a URI is expected to return a non-linked data content, for example an HTML website, and can be used as objects in linked data, for example for inserting further information about the subject resource.
In the example below, the subject IRI is described further by the object's URL.

```sh
<https://dbpedia.org/resource/Amsterdam> rdfs:seeAlso "https://www.iamsterdam.com"^^xsd:anyURI.
```

An IRI can be created with `iri`, while an URI is created by using `literal` .

##### Limitation of `literal`, `iri` and `iri.hashed`

There is a limitation for both `literal`, `iri` and `iri.hashed`. It is not possible to change the value in the record in the `literal`, `iri` and `iri.hashed` middlewares. The value that is at that moment stored in the record for that key, is then added as either an IRI when called with the `iri`/`iri.hashed` function or as a literal when called with the function `literal`.

The limitation is shown in the example below. In the example we want to round the inhabitants number to the nearest thousand. We can not transform this in the `literal` function. Instead we need to add a `change` middleware which will execute the transformation.

```ts
app.use(
  change({
    key: 'Inhabitants',
    type: 'number',
    change: (value) => value/1000
  }),
  triple(
    iri(prefix.id, 'Country'),
    def.name,

    literal('Inhabitants', xsd.positiveInteger)
  ),
)
```

## Record IDs

If your RATT Records do not contain a unique ID then you can use the `recordId` entry that RATT adds automatically.  These `recordId` values are unique for every record processed in the same pipeline, but they are not an entry into the RATT Record by default.

Record IDs are consistently assigned across runs of the same pipeline.  They generate the same output as long as the input does not change.

The following example code shows how the record ID can be added to each RATT Record:

```ts
app.use(
  add({
    key: 'ID',
    value: context => app.prefix.observation(context.recordId.toString()) }),
  triple(iri(prefix.id, key_id), a, def.Country),
)
```



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

RATT is able to access specific elements from lists based on their *index* or position.  Following the standard practice in Computer Science, RATT refers to the first element in the list as having index 0.  The second element has index 1, etc.

For the above example record, we can assert the name of the *first* country as follows:

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

We can also assert the name of the *second* country.  Notice that only the index is different (‘1’ instead of ‘0’):

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

RATT uses the `forEach` function for this purpose.  The following code snippet asserts the name for *each* country in the example data:

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

Notice that `forEach` only works for lists whose elements are *objects*.  See [Iterating over lists of primitives](#list-primitive) for dealing with lists that do not contain objects.

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

When `forEach` iterates through a list of elements, it makes the enclosing *parent* record available under key `$parent`.

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


## Transforming RDF data
If you have RDF data that does not need to be transformed, see [copying source data](https://triply.cc/docs/ratt-working-with-ratt#function-direct-copying-of-source-data-to-destination).
If you have RDF data that _does_ need to be transformed, you can use the following pattern. This example renames the graph.

```ts
const app = new Ratt({
  defaultGraph: graph.model,
  prefixes: prefix,
  sources: {
    inputFile: Ratt.Source.file(`data/shapes.trig`)
  },

  destinations: {
   dataset: Ratt.Destination.TriplyDb.rdf(organization, dataset, remoteOptions)
  },
})

app.use(
  loadRdf(app.sources.inputFile),
  mapQuads(
    (quad, ctx) => ctx.store.quad(
      quad.subject,
      quad.predicate,
      quad.object,
      app.prefix.somePrefix("graph")
    )
  ),
  toRdf(app.destinations.dataset)
)
```

Similarly, you can change all the subject, predicates or objects in your data.

Also, you can choose to transform triples of a specific subject, predicate, object or graph name. in this case, you should use:

```ts
mapQuads(
  (quad, ctx) => ctx.store.quad(
    quad.subject,
    app.prefix.example('new-predicate'),
    quad.object,
    quad.graph
  ),
  {predicate: app.prefix.example("old-predicate")}
)
```
