---
title: "RATT: Assertions"
path: "/docs/triply-etl/transformation/ratt/assertions"
---

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

Be aware that there are different approaches forstatic* anddynamic* IRIs:

- Static IRIs are created with prefix declarations (example [1a]).
- Dynamic IRIs are created with `iri`,`iri.hashed` and prefix declarations (example [2a]).

```ts
[1a] prefix.id('person')
[2a] iri(prefix.id, 'person'),
[3a] iri.hashed(prefix.id, ['person','age']),

```

Notation [1a] creates thestatic* IRI [1b].  This IRI does not depend on the currently processed RATT record.

Notation [2a] creates thedynamic* IRI in [2b], assuming the `"person"` key contains the value `"John"`.  This IRI depends on the currently processed RATT record.

For a different RATT record, IRI [2c] may be created instead (assuming the `"person"` key contains the value `"Jane"`).

Notation [3a] creates thedynamic* IRI in [3b], assuming the `"person"` key contains the value `"Sam"` and the
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
