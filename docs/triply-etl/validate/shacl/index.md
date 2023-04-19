---
title: "5B. SHACL Validation"
path: "/docs/triply-etl/validate/shacl"
---

This page documents how SHACL is used to validate linked data in the internal store of your ETL pipeline.

## Prerequisites

SHACL Validation can be used when the following preconditions are met:

1. A data model must be available from a data source.  The data model must use the SHACL standard.
2. Some data must be asserted in the internal store.  If your internal store is still empty, you can read [the Assert documentation](/docs/triply-etl/assert/overview) on how to add assertions to that store.

The function for performing SHACL validation can be imported from the generic TriplyETL library:

```ts
import { validate } from '@triplyetl/etl/shacl'
```

## A complete example

We use the following full TriplyETL script to explain the validation feature.  Do not be afraid by the length of the script; we will go through each part step-by-step.

```ts
import { Etl, Source, declarePrefix, fromJson, toTriplyDb } from "@triplyetl/etl/generic"
import { iri, pairs } from "@triplyetl/etl/ratt"
import { validate } from '@triplyetl/etl/shacl'
import { a, foaf } from "@triplyetl/etl/vocab"

const prefix = {
  id: declarePrefix('https://triplydb.com/Triply/example/id/'),
}

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([{ age: 'twelve', id: '1' }]),
    pairs(iri(prefix.id, 'id'),
      [a, foaf.Person],
      [foaf.age, 'age'],
    ),
    validate(Source.string(`
      prefix foaf: <http://xmlns.com/foaf/0.1/>
      prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      prefix sh:   <http://www.w3.org/ns/shacl#>
      prefix shp:  <https://triplydb.com/Triply/example/model/shp/>
      prefix xsd:  <http://www.w3.org/2001/XMLSchema#>

      shp:Person
        a sh:NodeShape;
        sh:closed true;
        sh:ignoredProperties ( rdf:type );
        sh:property shp:Person_age;
        sh:targetClass foaf:Person.

      shp:Person_age
        a sh:PropertyShape;
        sh:datatype xsd:nonNegativeInteger;
        sh:maxCount 1;
        sh:minCount 1;
        sh:path foaf:age.`
    )),
    toTriplyDb({ dataset: 'test' }),
  )
  return etl
}
```

## Step 1: Source data

In our example we are using the following source data that records the age of a person:

```json
{
  "age": "twelve",
  "id":  "id"
}
```

In our example the data source is [inline JSON](/docs/triply-etl/extract/types#inline-json), but notice that any source format could have been used:

```ts
fromJson([{ age: 'twelve', id: '1' }]),
```

## Step 2: Target data (informal)

Based on the source data in Step 1, we want to publish the following linked data in TriplyDB:

```turtle
id:123
  a foaf:Person;
  foaf:age 'twelve'.
```

## Step 3: Information Model (informal)

Our intended target data in Step 2 looks ok at first glance.  But we want to specify the requirements for our data in generic terms.  Such a specification is called an *Information Model*.

> An *Information Model* is a generic specification of the requirements for our data.

It is common to illustrate an Information Model with a picture:

```mermaid
classDiagram
  class foaf_Person {
    foaf_age: xsd_nonNegativeInteger [1..1]
  }
```

This Information Model specifies that instances of class `foaf:Person` must have exactly one value for the `foaf:age` property.  Values for this property must have datatype `xsd:nonNegativeInteger`.

## Step 4: Transformation

We now have source data (Step 1), and a fair intuition about our target data (Step 2), and an Information Model (Step 3).  We can automate the mapping from source to target data with an [Assertion](/docs/triply-etl/assert/overview):

```ts
etl.use(
  fromJson([{ age: 'twelve', id: '1' }]),
  pairs(iri(prefix.id, 'id'),
    [a, foaf.Person],
    [foaf.age, 'age'],
  ),
)
```

That looks about right: we create instances of class `foaf:Person` and triples that assert a `foaf:age` property for each such person.

However, a linked data expert may notice that the value `'twelve'` from the source data will not be transformed into a non-negative integer (`xsd:nonNegativeInteger`).  Indeed, our `'age'` assertion will create a literal with datatype `xsd:string`.  Oops, that violates the Information Model!

How can we automate such checks?  The above example is relatively simple, so a linked data expert may notice the error and fix it.  But what happens when the ETL configuration is hundreds of lines long and is spread across multiple files?  What happens when there is a large number of classes, and each class has a large number of properties?  What if some of the properties are required, while others are optional?  Etc.  Obviously, any real-world ETL will quickly become too complex to validate by hand.  For this reason, TriplyETL provides automated validation.

Triply considers having an automated validation step best practice for *any* ETL.  This is the case even for small and simple ETLs, since they tend to grow into complex ones some day.

## Step 5: Information Model (formal)

The linked data ecosystem includes the SHACL standard for encoding Information Models.  SHACL allows us to formally express the picture from Step 3.  The model is itself expressed in linked data:

```turtle
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix sh:   <http://www.w3.org/ns/shacl#>
prefix shp:  <https://triplydb.com/Triply/example/model/shp/>
prefix xsd:  <http://www.w3.org/2001/XMLSchema#>

shp:Person
  a sh:NodeShape;
  sh:closed true;
  sh:ignoredProperties ( rdf:type );
  sh:property shp:Person_age;
  sh:targetClass foaf:Person.

shp:Person_age
  a sh:PropertyShape;
  sh:datatype xsd:nonNegativeInteger;
  sh:maxCount 1;
  sh:minCount 1;
  sh:path foaf:age.
```

Notice the following details:
- We enforce a Closed World Semantics (CWA) in our Information Models with the `sh:closed` property.  If a property is not explicitly specified in our Information Model, it is not allowed to be used with instance data.
- We create IRIs in the dedicated `shp:` namespace for nodes in the Information Model.
- Elements in our Information Model are always in a one-to-one correspondence with elements in our Knowledge Model:
  - Node shapes such as `shp:Person` relate to a specific class such as `foaf:Person`.
  - Property shapes such as `shp:Person_age` relate to a specific property such as `foaf:age`.

## Step 6: Use the `validate()` function

TriplyETL has a dedicated function that can be used to automatically enforce Information Models such as the one expressed in Step 5.

Since the Information Model is relatively small, it can be specified in-line using the [string source type](/docs/triply-etl/extract/types/#strings).  Larger models will probably be stored in a separate file or in a TriplyDB graph or asset.

```ts
validate(Source.string(`
  prefix foaf: <http://xmlns.com/foaf/0.1/>
  prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  prefix sh:   <http://www.w3.org/ns/shacl#>
  prefix shp:  <https://triplydb.com/Triply/example/model/shp/>
  prefix xsd:  <http://www.w3.org/2001/XMLSchema#>

  shp:Person
    a sh:NodeShape;
    sh:closed true;
    sh:ignoredProperties ( rdf:type );
    sh:property shp:Person_age;
    sh:targetClass foaf:Person.

  shp:Person_age
    a sh:PropertyShape;
    sh:datatype xsd:nonNegativeInteger;
    sh:maxCount 1;
    sh:minCount 1;
    sh:path foaf:age.`
)),
```

When we run the `validate()` function at the end of our ETL script, we will receive the following error:

```
ERROR (Record #1) SHACL Violation on node id:1 for path
                  foaf:age, source shape shp:Person_age:
                    1. Value does not have datatype xsd:nonNegativeInteger
```

Oops!  The value for the `foaf:age` property has an incorrect datatype.  This is indeed the automated check and feedback that we want.

Notice that the requirement that was violated (`shp:Person_age`) is mentioned in the notification.  If we want to learn more, we can look up this node in our Information Model.

If we want to take a look at a concrete example in our instance data, we can also take look at node `id:1` which is also mentioned in the notfication.

## Step 7: Fix the validation error

Now that we receive the automated validation error in Step 6, we can look for ways to fix our ETL.  Let us take one more look at our current assertions:

```ts
etl.run(
  fromJson([{ age: 'twelve', id: '1' }]),
  pairs(iri(prefix.id, 'id'),
    [a, foaf.Person],
    [foaf.age, 'age'],
  ),
)
```

We could change the term assertion for the value of `foaf:age` to explicitly make use of the `xsd:nonNegativeInteger` datatype:

```ts
literal('age', xsd.nonNegativeInteger)
```

But that would not work in TriplyETL: the Triply software (luckily!) does not allow us to create incorrect linked data.  Since the following literal would be incorrect, TriplyETL does not even allow us to assert it:

```turtle
'twelve'^^xsd:nonNegativeInteger
```

Well, it is nice that TriplyETL does not allow us to create incorrect data.  But how can we fix the issue at hand?  How can we create linked data that follows our Information Model?

As in any ETL error, there are 3 possible solutions:

1. Change the data in the source system.
2. Change the ETL transformations and/or assertions.
3. Change the Information Model.

### Option 1: Change the source data

In this case, changing the data in the source system seem the most logical.  After all, there may be multiple ways in which the age of a person can be described using one or more English words.  Expressing ages numerically is a good idea in general, since it will make the source data easier to interpret.

### Option 2: Change the transformation and/or assertions

Alternatively, it is possible to transform English words that denote numbers to their corresponding numeric values.  Since people can get up to one hundred years old, or even older, there are many words that we must consider and transform.  This can be done with the [`translateAll()` transformation](/docs/triply-etl/transform/ratt#translateall):

```ts
translateAll({
  content: 'age',
  table: {
    'one': 1,
    ...
    'twelve': 12,
    ...,
    'one hundred': 100,
    ...,
  },
  key: '_age',
}),
pairs(iri(prefix.id, 'id'),
  [a, foaf.Person],
  [foaf.age, literal('_age', xsd.nonNegativeInteger)],
),
```

But even the above transformation may not suffice.  The same number can be expressed in multiple ways in natural language, so the mapping will never be truly complete and reliable.  This seems to be the worst of the three options in this case.

### Option 3: Change the Information Model

Finally, we could loosen the Information Model.  For example, we could change the datatype to check for strings:

```turtle
shp:Person_age sh:datatype xsd:string.
```

But that would invalidate ETLs that generate numeric ages for persons, even though that seems perfectly fine, if not better than generating strings.  Also, this would allow literals like `'abc'` to pass validation as a legal value for `foaf:age`.

Alternatively, we can remove the `sh:datatype` requirement from our Information Model entirely.  That would allow either string-based ages or numeric ages to be specified.  But now even weirder values for age, e.g. `'2023-01-01'^^xsd:date`, would be considered valid values for age.



## End notes

Notice that TriplyETL does not tell you which of the 3 options you should follow in order to fix issues in your ETL.  After all, creating an ETL requires domain knowledge based on which you weight the pros and const of different options.  However, TriplyETL does give you the tools to discover issues that prompt you to come up with such solutions.  And once you have decided on a specific solution, TriplyETL provides you with the tools to implement it.



<!-- TODO
## Validating RDF output

TriplyETL is able to automatically validate the RDF that is generated in the pipeline against a SHACL information model.

```ts
etl.use(
  // Create all linked data statements.
  // …
  // Now that all the data is created, validate it using a model.
  validate(etl.sources.model),
)
```


### Validation report

Validation creates a report that is asserted in linked data.  This report can be stored as a named graph in the created linked dataset.

The following example code stores the validation report in a dedicated named graph:

```ts
const prefix = {
  graph: 'https://triplydb.com/Triply/example/graph/',
}

const graph = {
  report: prefix.graph('report'),
}

etl.use(
  // Create all linked data statements.
  // …
  // Now that all the data is created, validate it using a model.
  validate(
    etl.sources.model,
    { report: { destination: app.sources.dataset, graph: graph.report } }
  ),
)
```



### Termination conditions

The `validate()` function can optionally be given the `terminateOn` option.  This option determines when validation halts.  It can take the following values:

- `'Never'` Do not halt; run the validation for the full dataset.
- `'Violation'` Halt validation when the first SHACL Violation is encountered.
- `'Warning'` Halt validation when the first SHACL Violation or SHACL Warning is encountered.
- `'Info'` Halt validation when the first SHACL Violation or SHACL Warning or SHACL Informational message is encountered.
- `undefined` Halt validation when the first SHACL message is encountered.

The following example code lets validation run for the full dataset, regardless of how many violations, warnings, and/or information messages are encountered:

```ts
etl.use(
  // Create all linked data statements.
  // …
  // Now that all the data is created, validate it using a model.
  validateShacl(etl.sources.model, { terminateOn: 'Never' }),
)
```

### Log conditions

The `validateShacl` function can optionally be given the `log` option.  This option determines when and which violations should be printed. The values are the same as in 'terminateOn' option. Note that `log` is about printing on your terminal and not about the violation report.

 ```ts
etl.use(
  // Create all linked data statements.
  // …
  // Now that all the data is created, validate it using a model.
  validate(app.sources.model, { log: "Never" }),
)
```
-->
