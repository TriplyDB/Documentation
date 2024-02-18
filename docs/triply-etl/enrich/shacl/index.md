# SHACL Rules

SHACL Rules allow new data to be added to the internal store, based on data that is already present. This makes SHACL Rules a great approach for data enrichment. Since SHACL Rules can be defined as part of the data model by using standardized SHACL properties and classes, it is one of the best approaches for creating and maintaining business rules in complex domains.

The order in which rules are evaluated can be specified in terms of dynamic preconditions, or in terms of a predefined order. It is possible to execute rules iteratively, generating increasingly more data upon each iteration, steadily unlocking more rules as the process unfolds.



## Prerequisites

SHACL Rules can be used when the following preconditions are met:

1. You have a data model that has one or more SHACL Rules.
2. You have some linked data in the internal store. If your internal store is still empty, you can read [the Assert documentation](../../assert/index.md) on how to add linked data to the internal store.

The function for executing SHACL Rules is imported as follows:

```ts
import { executeRules } from '@triplyetl/etl/shacl'
```



## Typical ETL structure

When SHACL Rules are used, the typical structure of the ETL script looks as follows:

1. Assert some linked data into the internal store. This can be done by loading RDF directly with [loadRdf()](../../extract/rdf.md), or by using an [extractor](../../extract/index.md) with [transformations](../../transform/index.md) and [assertions](../../assert/index.md).
2. Execute the SHACL rules with `executeRules()` from library `@triplyetl/etl/shacl`.
3. Do something with the enriched linked data, e.g. publish it to TriplyDB with [toTriplyDb()](../../publish/index.md).

```ts
import { Etl, Source } from '@triplyetl/etl/generic'
import { executeRules } from '@triplyetl/etl/shacl'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    // Step 1. Assert some linked data into the internal store.
    executeRules(Source.file('static/model.trig')), // Step 2
    // Step 3. Do something with the linked data, e.g. publish it to TriplyDB.
  )
  return etl
}
```

## Formulating SHACL Rules

The actual formulation of the SHACL Rules depends on the kind of SHACL Rule that is used. TriplyETL supports the following two kinds of SHACL Rules:

- [Triple Rules](./triple-rules.md)
- [SPARQL Rules](./sparql-rules.md)

SHACL Rules are typically included in the information model of the dataset. Notice that it is possible to combine different kinds of SHACL Rules in the same information model.
