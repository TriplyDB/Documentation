[TOC]

# Debug

TriplyETL includes functions that can be used during debugging. These debug function allow you to inspect in a detailed way how data flows through your pipeline. This allows you to find problems more quickly, and allows you to determine whether data is handled correctly by your TriplyETL configuration.

## Overview

The following debug function are available:

| Function | Description |
| --- | --- |
| [logMemory()](#logmemory) | Prints the current memory consumption. |
| [logQuads()](#logquads) | Prints the contents of the internal store to standard output. |
| [logQuery()](#logquery) | Prints a query string to standard output. |
| [logRecord()](#logrecord) | Prints the record in its current state to standard output. |
| [traceEnd()](#functions-tracestart-and-traceend) | Ends a trace of the record and internal store. |
| [traceStart()](#functions-tracestart-and-traceend) | Starts a trace of the record and internal store. |

These functions can be imported from the debug module:

```ts
import { logMemory, logQuads, logQuery, logRecord, traceEnd,
         traceStart } from '@triplyetl/etl/debug'
```



## Function `logMemory()`

This function prints information about the current memory consumption. It includes the following fields:

| Field name | Meaning | Use case |
| --- | --- |
| CallCount | The number of times that a specific use of `logMemory()` can been invoked. | Find a location in your ETL script that is visited many times, e.g. because it occurs inside a (nested) loop. |
| RecordId | The numeric identifier of the record that is currently processed. | Find a specific record that causes memory consumption to increase. |
| Heap used | The number of megabytes that are currently used on the heap. | Find places in your ETL where an unexpected amount of memory is used. |
| Heap total | The number of megabytes that are currently allocated on the heap. | Find places in your ETL where memory reallocation occurs. |

The following code snippet prints the memory consumption of TriplyETL for each record (first call), and for each member of key `'a'` (second call):

```ts
fromJson([{ a: [{ b: 1 }, { b: 2 }] }, { a: [] }, { a: [] }]),
logMemory(),
forEach('a', logMemory()),
```

This prints the following messages to standard output:

```
Info CallCount: 1 | RecordId: 1 | Heap (MB) used: 92 / total: 122
Info CallCount: 1 | RecordId: 1 | Heap (MB) used: 92 / total: 122
Info CallCount: 2 | RecordId: 1 | Heap (MB) used: 92 / total: 122
Info CallCount: 2 | RecordId: 2 | Heap (MB) used: 92 / total: 122
Info CallCount: 3 | RecordId: 2 | Heap (MB) used: 92 / total: 122
```



## Function `logQuads()`

This function prints the current contents of the internal store to standard output.

The following snippet asserts one triple into the default graph of the internal store, and then prints the contents of the internal store:

```ts
fromJson([{}]),
triple(rdfs.Class, a, rdfs.Class),
logQuads(),
```

This results in the following output:

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix sdo: <https://schema.org/>.

<https://triplydb.com/graph/default> {
rdfs:Class a rdfs:Class
}
```



## Function `logQuery()`

This function prints a query string to standard output. This is specifically useful when the query string is stored in an external system, e.g. a SPARQL query string that is stored on a TriplyDB server:

```ts
logQuery(Source.TriplyDb.query('my-account', 'my-query')),
```

Depending on the query string that is stored in `'my-query'`, this could result in the following output:

```sparql
select * {
  ?s ?p ?o.
}
limit 10
```



## Function `logRecord()`

This function prints the current state of the record to standard output. The record is a generic representation of the data that is extracted from one of the data sources (see the [Record documentation page](./record.md) for more information).

The following snippet prints the inline JSON record to standard output:

```ts
fromJson([{ a: 1 }]),
logRecord(),
```

This emits the following:

```json
{
  "a": 1,
  "$recordId": 1,
  "$environment": "Development"
}
```

### Use when writing a new ETL

When writing a new ETL, `logRecord()` is often used as the first function to invoke immediately after extracting the record. For example:

```ts
fromJson(Source.url('https://example.com/some/api/call')),
logRecord(),
```

Since this prints a full overview of what is available in the data source, this forms a good starting point for writing the rest of the ETL configurations.

### Observe the effects of transformations

Another common use case for `logRecord()` is to observe the record at different moments in time. This is specifically useful to observe the effects of [transformation functions](../transform/index.md), since these are the functions that modify the record.

The following snippet logs the record directly before and directly after the transformation function `split()` is called.

```ts
fromJson([{ a: '1, 2, 3' }]),
logRecord(),
split({ content: 'a', separator: ',', key: 'b' }),
logRecord(),
```

This makes it easy to observe the result of applying the transformation function:

```json
Running lib/main.js
{
  "a": "1, 2, 3",
  "$recordId": 1,
  "$environment": "Development"
}
{
  "a": "1, 2, 3",
  "$recordId": 1,
  "$environment": "Development",
  "b": [
    "1",
    "2",
    "3"
  ]
}
```

### Log a specific key

Since records can be quite long, in some cases it may be easier to print only a specific key.

The following code snippet only prints the key that was added by the transformation function:

```ts
fromJson([{ a: '1, 2, 3' }]),
split({ content: 'a', separator: ',', key: 'b' }),
logRecord({ key: 'b' }),
```

This results in the following output:

```json
[
  "1",
  "2",
  "3"
]
```



## Functions `traceStart()` and `traceEnd()`

Sometimes you are interested to find one specific record based on a certain value of a key and/or to see the changes in this record made by specific middlewares. For these purposes, `trace` middleware can be used.

Below, there is an example of how this middleware can be used:

```ts
fromJson([
  { a: 1, b: 1 }, // first dummy record
  { a: 2, b: 2 }, // second dummy record
]),
change({key:'a', type:'number', change: (val) => val +100}), // change the 'a' key
traceStart(),
change({key:'b', type:'number', change: (val) => val +100}), // change the 'b' key
traceEnd(),
```

The result would be:

```sh
┌─────────────────────────────────────┐
│      Record trace information       │
│ {                                   │
│   "a": 101,                         │
│   "b": 1                            │
│   "b": 101                          │
│ }                                   │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Quads trace information (unchanged) │
│ empty                               │
│                                     │
└─────────────────────────────────────┘


 To rerun the traced middlewares for this record use the following command:
 > npx etl lib/{script-name} --trace .trace-1650542307095
```

In your terminal the line with <span style="color:red">"b": 1</span> will be red colored, showing the previous state of this key-value and the line with <span style="color:green">"b": 101</span> will be green colored, showing the new state.

Also you can rerun the  trace information for this specific record by running:

```sh
npx etl lib/{script-name} --trace .trace-1650542307095
```
