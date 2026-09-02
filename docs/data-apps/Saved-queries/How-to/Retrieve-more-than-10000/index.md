[TOC]

<!-- SOURCE: two pages, merged rather than copied.
     1. triply-db-getting-started/saved-queries/index.md — "Download more than 10 000 query
        results - SPARQL pagination", including both sub-sections.
     2. generics/sparql-pagination.md (orphan page) — near-verbatim duplicate of the same
        material. Differences were checked line by line: the orphan page has no unique content.
        It should be redirected here, not kept.
     Code samples unchanged. -->

# Retrieve more than 10 000 results

A SPARQL query often matches more than 10 000 results, but a result set is limited to the first
10 000. To retrieve the rest, page through the results. TriplyDB supports two methods: the saved
query API, and TriplyDB.js.

## Pagination with the saved query API

Each TriplyDB instance has a fully RESTful API, extended for saved SPARQL queries with two
arguments that let a query return paginated result sets: `page` and `pageSize`.

```uri
https://api.triplydb.com/queries/academy/pokemon-color/run?page=3&pageSize=100
```

`page` is the requested page — in this example the third page, sized according to `pageSize`.
There is no maximum, since a query can return an arbitrary number of results. Requesting a page
with no results returns an empty page.

`pageSize` is how many results a page contains. The default is 100 and the maximum is 10 000.
Setting it higher returns an error.

The API follows the [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288.html) standard. The
response body contains the result set; the response header contains a link header with the
relative `next`, `prev` and `first` requests. Follow `next` to chain the requests and retrieve
everything:

```http
link:
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=4&pageSize=100>; rel="next",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=2&pageSize=100>; rel="prev",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=1&pageSize=100>; rel="first"
```

## Pagination with TriplyDB.js

[TriplyDB.js](../../../triplydb-js/index.md) is the official programming library for interacting
with TriplyDB, in TypeScript. It handles pagination internally, so it can reliably retrieve a
large number of results.

To get the output of a `construct` or `select` query:

**1. Import the library and set your parameters** — the instance, the account the query is saved
in, and the query name. TriplyDB.js requests run in an async context.

```ts
import Client from '@triply/triplydb'
async function run() {
  // Your code goes here.
  const client = Client.get({token: process.env.TRIPLYDB_TOKEN})
  const account = await client.getAccount('account-name')
  const query = await account.getQuery('name-of-some-query')
}
run()
```

**2. Get the results by setting a `results` variable.** For construct queries, use `statements()`:

```ts
const query = await account.getQuery('name-of-some-query')
const results = query.results().statements()
```

For select queries, use `bindings()`:

```ts
const query = await account.getQuery('name-of-some-query')
const results = query.results().bindings()
```

If the query has API variables, pass their values as the first argument to `results`:

```ts
// For SPARQL construct queries.
const results = query.results({
  someVariable: 'value of someVariable',
  anotherVariable: 'value of anotherVariable'
}).statements()
// For SPARQL select queries.
const results = query.results({
  someVariable: 'value of someVariable',
  anotherVariable: 'value of anotherVariable'
}).bindings()
```

**3. Iterate the results.** Three options:

a. Loop through the results row by row:

```ts
// Iterating over the results.
for await (const row of results) {
  // execute something
}
```

For select queries the loop iterates over rows; for construct queries, over statements.

b. Save the results to a file. Supported for `construct` queries only:

```ts
// Saving the results of a SPARQL construct query to a file.
await results.toFile('my-file.nt')
```

c. Load all results into memory as an array. This is almost never the right choice — use option a
to process results, option b to persist them:

```ts
// Loading results for a SPARQL construct or SPARQL select query into memory.
const array = await results.toArray()
```

