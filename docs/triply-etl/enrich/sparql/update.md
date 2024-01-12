[TOC]

# SPARQL Update

SPARQL is a powerful query language that can be used to modify and enrich linked data in the Internal Store. With SPARQL, you can generate new linked data based on existing linked data, thereby enhancing the contents of the store.

*Support for SPARQL Update is currently experimental. In the meantime, you can use [SHACL Rules](../shacl.md) and [SPARQL Construct](./construct.md) to configure the enrichment step in production systems.*

The function for using SPARQL Update can be imported as follows:

```ts
import { update } from '@triplyetl/etl/sparql'
```



## Insert Data

Insert Data can be used to add linked data to the Internal Store. The following example adds one triple:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl } from '@triplyetl/etl/generic'
import { update } from '@triplyetl/etl/sparql'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    update(`
base <https://triplydb.com/>
insert data { <john> <knows> <mary>. }`),
    logQuads(),
  )
  return etl
}
```

Debug function [logQuads()](../../generic/debug.md#logquads) prints the content of the internal store to standard output:

```turtle
base <https://triplydb.com/>
<john> <knows> <mary>.
```

### Using prefix declarations

Notice that the SPARQL Update function takes a plain string. Any typos you make in this string will only result in errors at runtime, when the query string is interpreted and executed.

One of the more difficult things to get right in a SPARQL string are the prefix declarations. We can use the `prefix` object to insert the correct IRI prefixes.

The following example asserts three triples, and uses the `prefix` object to insert the IRI prefix for Schema.org:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl } from '@triplyetl/etl/generic'
import { update } from '@triplyetl/etl/sparql'
import { sdo } from '@triplyetl/vocabularies'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    update(`
base <https://triplydb.com/>
prefix sdo: <${sdo.$namespace}>
insert data {
  <john>
    a sdo:Person;
    sdo:children <mary>;
    sdo:gender sdo:Male.
}`),
    logQuads(),
  )
  return etl
}
```

This prints the following linked data to standard output:

```turtle
base <https://triplydb.com/>
prefix sdo: <https://schema.org/>

<john>
  a sdo:Person;
  sdo:children <mary>;
  sdo:gender sdo:Male.
```



## Delete Data

While there are not many uses cases for removing data from the internal store, this is an operation that is supported by the SPARQL Update standard.

The following function call removes the parent/child relationship assertion that was added to the internal store earlier:

```ts
update(`
prefix sdo: <${sdo.$namespace}>
delete data { <john> sdo:children <mary>. }`),
```

You can use the debug function [logQuads()](../../generic/debug.md#logquads) before and after this function call, to see the effects on the internal store.



## Delete Insert Where

SPARQL Update can be used to conditionally add and/or remove linked data to/from the internal store. It uses the following keywords for this:

- `where` is the condition that must be met inside the internal store. Conditions can be specified in a generic way by using SPARQL variables. The bindings for these variables are shared with the other two components.
- `delete` is the pattern that is removed from the internal store. This requires that the `where` condition is satisfied in the internal store. Any bindings for variables that are shared between the `where` condition and the `delete` pattern are instantiated before deletion is performed. Deletion is performed before insertion.
- `insert` is the pattern that is added to the internal store. This requires that the `where` condition is satisfied in the internal store. Any bindings for variables that are shared between the `where` condition and the `insert` pattern are instantiated before insertion is performed. Insertion is performed after deletion.

We can use this powerful combination of a `where` condition and a `delete` and `insert` follow-up to implement rules. For example, we may want to formalize the following rule:

> Persons with at least one child and the male gender, are fathers.

At the same time, we may be restricted in the information we are allowed to publish in our linked dataset:

> After fatherhood has been determined, any specific information about parent/child relationships must be removed from the internal store.

The rule can be formalized as follows:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl } from '@triplyetl/etl/generic'
import { update } from '@triplyetl/etl/sparql'
import { sdo } from '@triplyetl/vocabularies'

const baseIri = 'https://triplydb.com/'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    update(`
base <${baseIri}>
prefix sdo: <${sdo.$namespace}>
insert data {
  <john>
    a sdo:Person;
    sdo:children <mary>;
    sdo:gender sdo:Male.
}`),
    update(`
base <${baseIri}>
prefix sdo: <${sdo.$namespace}>
delete { $person sdo:children ?child. }
insert { $person a <Father>. }
where {
  $person
    a sdo:Person;
    sdo:children ?child;
    sdo:gender sdo:Male.
}`),
    logQuads(),
  )
  return etl
}
```



<!-- TODO
## Load

This operation reads the contents of a document representing a graph and loads it into a graph in the Graph Store.

Example:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl } from '@triplyetl/etl/generic'
import { update } from '@triplyetl/etl/sparql'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    update(`
base <https://triplydb.com/>
insert data { graph <g> { <s> <p> <o>. } }`),
    update(`
base <https://triplydb.com/>
load <g> into graph <h>`),
    logQuads(),
  )
  return etl
}
```

In this example, the `Load` operation is used to load the contents of a document specified by `<IRIref_from>` into the graph specified by `<IRIref_to>`. The document referred to by `<IRIref_from>` represents a graph, and its contents will be added to the graph identified by `<IRIref_to>`. This allows you to incorporate data from an external source or document into a specific graph within the Graph Store.



## Clear

This operation removes all triples in one or more graphs.

Example:

```sparql
clear graph <IRIref>
```

In this example, the `Clear` operation is used to remove all the triples contained within a specific graph identified by `<IRIref>`. It clears the entire contents of the graph, effectively deleting all the triples associated with that graph. This operation allows you to start with a clean slate by removing all existing data within the specified graph, providing a way to reset or empty the graph as needed.

* Please note that you need to replace `<IRIref_from>` and `<IRIref_to>` with appropriate IRIs or URLs for the actual data sources or destinations.


### A complete example

To demonstrate the usage of the `update()` function with SPARQL Update queries, we provide a complete TriplyETL script example. In this example, we will show how to generate new linked data based on existing linked data using SPARQL Update.

```ts
import { Etl, Source, declarePrefix, fromJson, toTriplyDb } from "@triplyetl/etl/generic";
import { iri, pairs } from "@triplyetl/etl/ratt";
import { update } from '@triplyetl/etl/sparql';
import { a, foaf } from "@triplyetl/vocabularies";

const prefix = {
  id: declarePrefix('https://triplydb.com/Triply/example/id/'),
};

export default async function (): Promise<Etl> {
  const etl = new Etl();
  etl.use(
    fromJson([{ age: 'twenty', id: '1' }]),
    pairs(
      iri(prefix.id, 'id'),
      [a, foaf.Person],
      [foaf.age, 'age'],
    ),
    update(`
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      INSERT {
        ?person foaf:isAdult "true"^^xsd:boolean .
      }
      WHERE {
        ?person foaf:age ?age .
        FILTER (xsd:integer(?age) >= 18)
      }
    `),
    toTriplyDb({ dataset: 'test' }),
  );
  return etl;
}
```


### Source data

In our example, we are using the following source data that records the age of a person:

```json
{
  "age": "twenty",
  "id":  "id"
}
```

In this example, the data source is in the form of [inline JSON](../../sources/inline-json.md), but please note that any valid source format can be used:

```ts
fromJson([{ age: 'twenty', id: '1' }]),
```


### Target data without SPARQL Update

Based on the source data in Step 1, without applying SPARQL Update, the resulting linked data in TriplyDB would be:

```turtle
id:1
  a foaf:Person;
  foaf:age 'twenty'.
```


### Target data with SPARQL Update

By applying the SPARQL Update query using the `update()` function, an additional triple will be added to the data. In this case, the new triple indicates that the person in the source data is an adult based on the age condition. Consequently, the updated data in TriplyDB would appear as:

```turtle
id:1
  a foaf:Person;
  foaf:age 'twenty';
  foaf:isAdult 'true'.
```

By following this example and adjusting the SPARQL Update query according to your requirements, you can generate new linked data based on existing linked data in your TriplyETL process.
-->
