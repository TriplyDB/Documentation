---
title: "SPARQL pagination"
path: "/docs/pagination"
---

[TOC]

# SPARQL Pagination

This page explains how to retrieve all results from a SPARQL query using pagination.

Often SPARQL queries can return more than 10.000 results, but due to limitations the result set will only consist out of the first 10.000 results. To retrieve more than 10.000 results you can use pagination. TriplyDB supports two methods to retrieve all results from a SPARQL query. Pagination with the saved query API or Pagination with TriplyDB.js.

## Pagination with the saved query API

Each TriplyDB instance has a fully RESTful API. The TriplyDB RESTful API is extended for saved SPARQL queries. The API for saved queries is extended with two arguments that the query is able to process paginated result sets. The arguments are ‘page’ and ‘pageSize’. An example of a paginated saved SPARQL query request would look like:
`https://api.triplydb.com/queries/academy/pokemon-color/run?page=3&pageSize=100`

The example request argument ‘page’ corresponds to the requested page. In the example request this would correspond to the third page of paginated SPARQL query, according to the ‘pageSize’. There is no maximum ‘page’ limit, as a SPARQL query could return an arbitrary number of results. When no results can be retrieved for the requested page an empty page will be returned.

The argument ‘pageSize’ corresponds to how many results each page would contain. The ‘pageSize’ has a default of 100 returned results and a maximum ‘pageSize’ limit of 10.000 returned results. The request will return an error when the ‘pageSize’ is set higher than 10.000.

The RESTful API for the saved SPARQL queries follows the [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288.html) standard.

The request will return a response body containing the result set and a response header. The response header contains a link header with the relative "next" request, the relative "prev" request, and the relative "first" request. By following the "next" link header request you can chain the pagination and retrieve all results.

```json
link:
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=4&pageSize=100>; rel="next",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=2&pageSize=100>; rel="prev",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=1&pageSize=100>; rel="first"
```

## Pagination with TriplyDB.js

**TriplyDB.js** is the official programming library for interacting with [TriplyDB](https://triply.cc/docs/triply-db). TriplyDB.js allows the user to connect to a TriplyDB instance via the TypeScript language. TriplyDB.js has the advantage that it can handle pagination internally so it can reliably retrieve a large number of results.

To get the output for a `construct` or `select` query, follow these steps:

1\. Import the triplydb library and set your parameters, regarding the TriplyDB instance and the account in which you have saved the query as well as the name of the query. Do not forget that we perform TriplyDB.js requests within an [async context](#create-your-first-script).

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

2\. Get the results of a query by setting a `results` variable.  More specifically, for construct queries you use the `statements()` call:

```ts
const query = await account.getQuery('name-of-some-query')
const results = query.results().statements()
```

For select queries you use the `bindings()` call:

```ts
const query = await account.getQuery('name-of-some-query')
const results = query.results().bindings()
```

Additionally, saved queries can have 'API variables' that allow you to specify variables that are used in the query. Thus, if you have query parameters, pass their values as the first argument to `results` as follows:

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

3\. To iterate the results of your SPARQL query you have three options:

3.1\. Iterate through the results per row in a `for`-loop:

```ts
// Iterating over the results.
for await (const row of results) {
  // execute something
}
```
Note: For select queries the `for`-loop iterates over the rows of the result set. For construct queries the `for`-loop iterates over the statements in the result set.

3.2\. Save the results to a file. This is only supported for SPARQL `construct` queries:

```ts
// Saving the results of a SPARQL construct query to a file.
await results.toFile('my-file.nt')
```

3.3\. Load all results into memory in the form of an Array. Note that this is almost never used. If you want to process results, then use the 3a option; if you want to persist results, then option 3b suits better.

```ts
// Loading results for a SPARQL construct or SPARQL select query into memory.
const array = await results.toArray()
```
