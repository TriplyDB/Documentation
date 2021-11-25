---
title: "SPARQL pagination"
path: "/docs/pagination"
---

This page explains how to retrieve all results from a SPARQL query using pagination.

Often SPARQL queries can return more than 10.000 results, but due to limitations the resultset will only consist out of the first 10.000 results. To retrieve more than 10.000 results you can use pagination. TriplyDB supports two methods to retrieve all results from a SPARQL query. Pagination with the saved query API or Pagination with TriplyDB.js.

## Pagination with the saved query API

Each TriplyDB instance has a fully RESTful API. The TriplyDB RESTful API is extended for saved SPARQL queries. the API for saved queries is extended with two arguments that the query is able to process paginated resultSets. The arguments are ‘page’ and ‘pageSize’. An example of a paginated saved SPARQL query request would look like:
`https://api.triplydb.com/queries/academy/pokemon-color/run?page=3&pageSize=100`

The example request agrument ‘page’ corresponds to the requested page. In the example request this would correspond to the third page of paginated SPARQL query, according to the ‘pageSize’. There is no maximum ‘page’ limit, as a SPARQL query could return an arbitrary number of results. When no results can be retrieved for the requested page an empty page will be returned.

The argument ‘pageSize’ corresponds to how many results each page would contain. The ‘pageSize’ has a default of a 100 returned results and a maximum ‘pageSize’ limit of 10.000 returned results. the request will return an error when the ‘pageSize’ is set higher than 10.000. The ‘pageSize’.

The RESTful API for the saved SPARQL queries follows the specification in full accordance with [the W3C](https://www.w3.org/TR/html401/types.html#type-links) and [WHATWG](https://html.spec.whatwg.org/multipage/links.html#sequential-link-types) standards.

The request will return an response body containing the resultset and a response header. The response header contains a link header with the relative "next" request, the relative "prev" request, and the relative "first" request. By following the "next" link header request you can chain the pagination and retrieve all results.

```json
link:
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=4&pageSize=100>; rel="next",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=2&pageSize=100>; rel="prev",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=1&pageSize=100>; rel="first"
```

## Pagination with TriplyDB.js

**TriplyDB.js** is the official programming library for interacting with [TriplyDB](https://triply.cc/docs/triply-db-getting-started).  TriplyDB.js allows the user to connect to a TriplyDB instance via the TypeScript language. TriplyDB.js has the advantage that it can handle pagination internally so it can reliably retrieve a large number of results.

To get the output for a `construct` or `select` query, follow these steps:

1. Import the triplydb library and set your parameters, regarding the TriplyDB instance and the account in which you have saved the query as well as the name of the query. Do not forget that we perform TriplyDB.js requests within an [async context](#create-your-first-script).

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

2. Get the results of a query by setting a `results` variable.  More specifically, for construct queries:

   ```ts
   const query = await account.getQuery('name-of-some-query')
   const results = query.results().statements()
   ```

   For select queries:

   ```ts
   const query = await account.getQuery('name-of-some-query')
   const results = query.results().bindings()
   ```

   Note that for SPARQL `construct` queries, we use method `.statements()`, while for SPARQL `select` queries, we use method `.bindings()`.

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

3. To read the results you have three options:

    a. Iterate through the results per row in a `for`-loop:

      ```ts
      // Iterating over the results per row
      for await (const row of results) {
        // execute something
      }
      ```

    b. Save the results to a file.  This is only supported form SPARQL `construct` queries:

      ```ts
      // Saving the results of a SPARQL construct query to a file.
      await results.toFile('my-file.nt')
      ```

    c. Load all results into memory.  Note that this is almost never used.  If you want to process results, then option 5a is better; if you want to persist results, then option 5b is better.

      ```ts
      // Loading results for a SPARQL construct or SPARQL select query into memory.
      const array = await results.toArray()
      ```
