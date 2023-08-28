---
title: "1. TriplyETL: Generic"
path: "/docs/triply-etl/generic"
---
**Generic** functions in TriplyETL are low-level functions, that do not call any other functions in the TriplyETL but rather use the operating system or framework to compute the result. 

# Overview

The following generic functions are currently available:

| Function | Description |
| --- | --- |
| [resetStore()](#resetStore) | Clears the Internal Store. |


# Function `resetStore()` {#resetStore}

All [assert functions](/docs/triply-etl/assert/index.md) store data in the Internal Store. The data from the Internal Store is published to TriplyDB or saved to a local file. 

The `resetStore` function clears the current Internal Store. After the call of the function, the Internal Store is empty and new data can be stored there. 

## Example 

To show the use of `resetStore`, we first assert a triple and show the content of the Internal Store using the [logQuads()](/docs/triply-etl/debug/index.md#function-logquads-logquads):

```ts
triple(iri(prefix.id, str(1)), a, sdo.Person),
logQuads(),
```

The console output is the following:
```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix sdo: <https://schema.org/>.

<https://triplydb.com/graph/default> {
<https://example.org/id/person/1> a sdo:Person
}
```
The output shows prefix declarations (starting with `@prefix`) and Internal Store with a quad. 

Now let's call `resetStore()` function and show the current state of the Internal Store. 
```
resetStore(),
logQuads()
```
The console output only shows the prefix declarations, because our Internal Store is empty:

```
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix sdo: <https://schema.org/>.


```







