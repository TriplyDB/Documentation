[TOC]

# SPARQL Rules

SPARQL Rules are a form of [SHACL Rules](./index.md). SPARQL Rules can be arbitrarily complex, utilizing all features available in the SPARQL query language. SPARQL Rules have the following benefits and downsides.

Benefits:

- Simple to use if you are familiar with SPARQL.
- Integrated with the information model.
- Can be used to assert any number of triples.
- Allows arbitrarily complex business rules to be formulated, e.g. using aggregation, filters, external data, property paths, function calls.
- Can use the prefix declarations that are represented in the information model (`sh:namespace` and `sh:prefix`).

Downsides:

- No reflection: the rule is encoded in a literal, so its internal structure cannot be queried as RDF.
- No reflection: cannot use the prefix declarations that occur in the serialization format of the information model in which it occurs (e.g. TriG, Turtle).

The rest of this page describes a examples that uses SPARQL Rules.



## Example 1: Deducing fatherhood

This example uses the same data and rule as the corresponding [Triple Rule example](./triple-rules.md).


### Step 1: Implement the SPARQL Construct query

In natural language, we can define the following rule for deducing fatherhood:

> Persons with at least one child and the male gender, are fathers.

We can implement this deduction with the following a SPARQL Construct query:

```sparql
base <https://triplydb.com/>
prefix sdo: <https://schema.org/>

construct {
  $this a <Father>.
} where {
  $this
    a sdo:Person;
    sdo:children [];
    sdo:gender sdo:Male.
}
```

Notice the following details:

- The conditions are specified in the Where clause.
- The assertion is specified in the Construct template.
- We use the variable name `$this` to bind to the instances for which the rule will be executed. In the SPARQL query language, this name is only a convention, and has exactly the same behavior as using any other variable name such as `?person` or `?x`.

We can run this query directly from TriplyETL, and this will result in the correct deductions. In fact, this is why [SPARQL Construct](../sparql/construct.md) is one of the enrichment configuration languages that are supported by TriplyETL.


### Step 2: Create the node shape

However, SPARQL Rules add more features on top of SPARQL Construct. A SPARQL Rule is added to the information model. In the information model, rules are related to node shapes. When instance data conforms to the node shape, the SPARQL Rule is executed. Notice that this is different from calling SPARQL Construct queries directly, where we must determine when to run which query. SPARQL Rules are triggered by the information model instead. This has many benefits, especially for large collections of business rules, where the execution order may no longer be straightforward.

In order for our SPARQL Construct query to be triggered by a node shape, we need to identify some target criterion that will allow the node shape to trigger the query. One target criterion for node shapes is `sh:targetClass`. We can trigger the SPARQL Construct query for every instance of the class `sdo:Person`. This means that we move the check of whether a resource is a person from the SPARQL Construct query into the node shape. This results in the following linked data snippet:

```turtle
base <https://triplydb.com/>
prefix sdo: <https://schema.org/>
prefix sh: <http://www.w3.org/ns/shacl#>

<Person>
  a sh:NodeShape;
  sh:targetClass sdo:Person;
  sh:rule
    [ a sh:SPARQLRule;
      sh:construct '''
        base <https://triplydb.com/>
        prefix sdo: <https://schema.org/>
        construct {
          $this a <Father>.
        } where {
          $this
            sdo:children [];
            sdo:gender sdo:Male.
        }''' ].
```

Notice the following details:

- We introduce a node shape that targets all instances of `sdo:Person`.
- The node shape is connected to a SPARQL Rule via the `sh:rule` property.
- The SPARQL Rule has its own RDF resource, and is connected to the query string via the `sh:construct` property.
- The SPARQL Construct query from [Step 1](#step-1-implement-the-sparql-construct-query) no longer include the `a sdo:Person` line. This line is no longer needed, since the node shape will only trigger for instances of `sdo:Person` in the first place.
- The SPARQL Construct query uses variable name `$this` to bind to the instances for which the rule will be executed. While this name is only a convention in the SPARQL query language, it has a special meaning in the SPARQL Rule. This variable will be bound for all targets of the node shape (i.e. for every person in the data).
- The literal that contains the SPARQL Construct query uses triple quoted literals notation (`'''...'''`). This notation allows us to use unescaped newlines inside the literal, which allows us to inline the query string in a readable way.


### Step 3: Write and run the script

The following script is completely self-contained. By copy/pasting it into TriplyETL, you can execute the rule over the instance data, and deduce the fact that John is a father.

Notice that the script includes the following components:

  1. Load the instance data from [Step 1](#step-1-load-instance-data) with [loadRdf()](../../extract/rdf.md).
  2. Execute the rule from [Step 2](#step-2-create-the-node-shape) with [executeRules()](./index.md).
  3. Print the contents of the internal store with [logQuads()](../../generic/debug.md#function-logquads).

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, Source, loadRdf } from '@triplyetl/etl/generic'
import { executeRules } from '@triplyetl/etl/shacl'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    loadRdf(Source.string(`
      base <https://triplydb.com/>
      prefix sdo: <https://schema.org/>
      <john>
        a sdo:Person;
        sdo:children <mary>;
        sdo:gender sdo:Male.`)),
    executeRules(Source.string(`
      base <https://triplydb.com/>
      prefix sdo: <https://schema.org/>
      prefix sh: <http://www.w3.org/ns/shacl#>
      <Person>
        a sh:NodeShape;
        sh:targetClass sdo:Person;
        sh:rule
          [ a sh:SPARQLRule;
            sh:construct '''
              base <https://triplydb.com/>
              prefix sdo: <https://schema.org/>
              construct {
                $this a <Father>.
              } where {
                $this
                  sdo:children [];
                  sdo:gender sdo:Male.
              }''' ].`)),
    logQuads(),
  )
  return etl
}
```

When we run this script (command `npx etl`), the following linked data is printed:

```turtle
<john>
  a
    sdo:Person,
    <Father>;
  sdo:children <mary>;
  sdo:gender sdo:Male.
```

Notice that the fatherhood assertion was correctly added to the internal store, based on the Triple Rule in the data model.


### Step 4: Using files (optional)

The script in [Step 3](#step-3-write-and-run-the-script) includes both the instance data and the information model as inline strings, using [Source.string()](../../sources/inline-strings.md). This is great for creating a self-contained example, but not realistic when the number of rules increases.

We therefore show the same script after these inline components have been stored in separate files:

- The instance data is stored in file `static/instances.trig`.
- The information model is stored in file `static/model.trig`.

Now the instance data and information model can be edited in their own files, and the script stays concise:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, Source, loadRdf } from '@triplyetl/etl/generic'
import { executeRules } from '@triplyetl/etl/shacl'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    loadRdf(Source.file('static/instances.trig')),
    executeRules(Source.file('static/model.trig')),
    logQuads(),
  )
  return etl
}
```



## Example 2:

In this example, we start out with a data source that is not linked data:

```json
{ "age": 20, "name": "ann" },
{ "age": 12, "name": "peter" },
```

We use the [fromJson()](../../extract/json.md) extractor and specify the source data as [inline JSON](../../sources/inline-json.md). We use the RATT assertion function [pairs()](../../assert/ratt/statements.md#pairs) to add linked data to the internal store.

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, Source, declarePrefix, fromJson } from '@triplyetl/etl/generic'
import { iri, pairs } from '@triplyetl/etl/ratt'
import { executeRules } from '@triplyetl/etl/shacl'
import { a, foaf } from '@triplyetl/vocabularies'

const id = declarePrefix('https://triplydb.com/')

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([
      { age: 20, name: 'ann' },
      { age: 12, name: 'peter' },
    ]),
    pairs(iri(id, 'name'),
      [a, foaf.Person],
      [foaf.age, 'age'],
    ),
    executeRules(Source.file('static/model.trig')),
    logQuads(),
  )
  return etl
}
```

The model (file `static/model.trig`) makes use of a SPARQL Rule, to assert that persons who are at least 18 years old are adults:

```turtle
base <https://triplydb.com/>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix sh: <http://www.w3.org/ns/shacl#>

<Person>
  sh:targetClass foaf:Person;
  sh:rule
    [ a sh:SPARQLRule;
      sh:prefixes <>;
      sh:construct '''
        construct {
          $this a ex:Adult.
        } where {
          $this foaf:age ?age.
          filter(?age >= 18)
        }''' ].
```

Notice that the SPARQL query string (the value of `sh:construct`) does not declare the `ex:` and `foaf:` prefixes. Instead, the rule refers to generic declarations (with property `sh:prefixes`) that occur later in the `model.trig` file:

```turtle
<>
  sh:declare
    [ sh:namespace <https://triplydb.com/>;
      sh:prefix 'ex' ],
    [ sh:namespace <http://xmlns.com/foaf/0.1/>;
      sh:prefix 'foaf' ].
```

This notation allows the same prefix declarations to be reused by an arbitrary number of SPARQL Rules.
