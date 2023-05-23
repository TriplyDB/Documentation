---
title: "4. Enrich: SPARQL Update"
path: "/docs/triply-etl/enrich/sparql"
---

SPARQL Update is a powerful feature that allows you to modify and enrich linked data in the internal store. With SPARQL Update, you can generate new linked data based on existing linked data, thereby enhancing the content of the store.

## How to write SPARQL Update queries

There are several operations available for SPARQL Update queries:

### 1. `INSERT DATA`

This operation adds triples, given inline in the request, into the Graph Store.
   
Example:

```code
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
INSERT DATA
{ 
  <http://example/person1> foaf:age "twenty" ;
                           foaf:id "1" .
}
```

In this example, the `INSERT DATA` operation is used to add new triples to the graph store. The `PREFIX` statement declares a namespace prefix for the `foaf` namespace. The subsequent `INSERT DATA` block specifies the triples that should be inserted.

In this case, the triples being inserted are:

- `<http://example/person1> foaf:age "twenty"`
- `<http://example/person1> foaf:id "1"`
  
These triples represent information about a person, where their age is "twenty" and their ID is "1". By executing this `INSERT DATA` operation, these triples will be added to the graph store.
### 2. `DELETE DATA`

This operation removes triples, given inline in the request, from the graphs in the Graph Store.

```
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
DELETE DATA
{
  <http://example/person1> foaf:age "20" ;
                           foaf:id "1" .
}
```
In this example, the `DELETE DATA` operation is used to remove specific triples from the graph store. The `PREFIX` statement declares a namespace prefix for the `foaf` namespace. The subsequent `DELETE DATA` block specifies the triples that should be deleted.

In this case, the triples being deleted are:

- `<http://example/person1> foaf:age "20"`
- `<http://example/person1> foaf:id "1"`
  
These triples represent information about a person, where their age is "20" and their ID is "1". By executing this `DELETE DATA` operation, these specific triples will be removed from the graph store.

3. `DELETE/INSERT`

This operation removes or adds triples to the Graph Store based on bindings for a query pattern specified in a `WHERE` clause. It allows more flexibility in modifying data. Note that `DELETE` and `INSERT` could also be used separately.

Example:

```
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

WITH <http://example/addresses>
DELETE { ?person foaf:givenName 'Bill' }
INSERT { ?person foaf:givenName 'William' }
WHERE
{
  ?person dc:id "1" ;
          foaf:givenName 'Bill' .
}
```

In this example, we are specifying the target graph from which we want to `DELETE/INSERT` triples. In the delete part, we remove the triple `?person foaf:givenName 'Bill'`, and in the insert part, we replace it with the triple `?person foaf:givenName 'William'`. The where part ensures that the triple being removed actually exists before performing the `DELETE/INSERT` operation.

### 4. `LOAD`

This operation reads the contents of a document representing a graph and loads it into a graph in the Graph Store.
   
Example:

```
LOAD <IRIref_from> INTO GRAPH <IRIref_to>
```


In this example, the `LOAD` operation is used to load the contents of a document specified by `<IRIref_from>` into the graph specified by `<IRIref_to>`. The document referred to by `<IRIref_from>` represents a graph, and its contents will be added to the graph identified by `<IRIref_to>`. This allows you to incorporate data from an external source or document into a specific graph within the Graph Store.

### 5. `CLEAR`

This operation removes all triples in one or more graphs.

Example:

```
CLEAR GRAPH <IRIref>
```

In this example, the `CLEAR` operation is used to remove all the triples contained within a specific graph identified by `<IRIref>`. It clears the entire contents of the graph, effectively deleting all the triples associated with that graph. This operation allows you to start with a clean slate by removing all existing data within the specified graph, providing a way to reset or empty the graph as needed.

* Please note that you need to replace `<IRIref_from>` and `<IRIref_to>` with appropriate IRIs or URLs for the actual data sources or destinations.


## How to use SPARQL Update in your ETL?

### Prerequisites

To incorporate and use SPARQL Update in your ETL process, you need to follow these prerequisites:

1. Include the library `@triplyetl/etl/sparql` in your ETL project:
   
```code
import { update } from "@triplyetl/etl/sparql"
```
2. Call the `update()` function to execute SPARQL Update queries.
   
By including the mentioned library and invoking the `update()` function, you can effectively use SPARQL Update within your TriplyETL workflow.

### A complete example

To demonstrate the usage of the `update()` function with SPARQL Update queries, we provide a complete TriplyETL script example. In this example, we will show how to generate new linked data based on existing linked data using SPARQL Update.

```ts
import { Etl, Source, declarePrefix, fromJson, toTriplyDb } from "@triplyetl/etl/generic";
import { iri, pairs } from "@triplyetl/etl/ratt";
import { update } from '@triplyetl/etl/sparql';
import { a, foaf } from "@triplyetl/etl/vocab";

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

```code
{
  "age": "twenty",
  "id":  "id"
}
```
In this example, the data source is in the form of [inline JSON](/docs/triply-etl/extract/types#inline-json), but please note that any valid source format can be used:

```code
fromJson([{ age: 'twenty', id: '1' }]),
```

### Target data without SPARQL Update

Based on the source data in Step 1, without applying SPARQL Update, the resulting linked data in TriplyDB would be:

```code
id:1
  a foaf:Person;
  foaf:age 'twenty'.
```

### Target data with SPARQL Update

By applying the SPARQL Update query using the `update()` function, an additional triple will be added to the data. In this case, the new triple indicates that the person in the source data is an adult based on the age condition. Consequently, the updated data in TriplyDB would appear as:

```code
id:1
  a foaf:Person;
  foaf:age 'twenty';
  foaf:isAdult 'true'.
```

By following this example and adjusting the SPARQL Update query according to your requirements, you can generate new linked data based on existing linked data in your TriplyETL process.