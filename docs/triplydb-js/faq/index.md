[TOC]

# FAQ

This section includes answers to frequently asked questions. Please contact [info@triply.cc](mailto:info@triply.cc) if you have a question that does not appear in this list.

## How to perform a SPARQL query?

The SPARQL 1.1 Protocol standard specifies a native HTTP API for performing SPARQL requests. Such requests can be performed with regular HTTP libraries.

Here we give an example indicating how such an HTTP library can be used:

```ts
import SuperAgent from 'superagent';
const reply = await SuperAgent.post('SPARQL_ENDPOINT')
  .set('Accept', 'application/sparql-results+json')
  .set('Authorization', 'Bearer ' + process.env.TOKEN)
  .buffer(true)
  .send({ query: 'select * { WHERE_CLAUSE } offset 0 limit 10000' })
// break condition when the result set is empty.

// downsides: caching, string manipulation
```

## What is the latest version of TriplyDB.js?

The latest version of TriplyDB.js can be found in [the NPM repository](https://www.npmjs.com/package/@triply/triplydb).

## What to do when the “Error: Unauthorized” appears?

This error appears whenever an operation is performed for which the user denoted by the current API token is not authorized.

One common appearance of this error is when the environment variable `TOKEN` is not set to an API token.

The current value of the environment variable can be tested by running the following command in the terminal:

```sh
echo $TOKEN
```

## How do I get the results of a saved query using TriplyDB.js?

To reliably retrieve a large number of results as the output of a `construct` or `select` query, follow these steps:

1\. Import the triplydb library.

```ts
import App from '@triply/triplydb';
```

2\. Set your parameters, regarding the TriplyDB server and the account in which you have saved the query as well as the name of the query.

```ts
const triply = App.get({ url: 'https://api.triplydb.com' })
const account = await triply.getAccount('account-name')
const query = await account.getQuery('name-of-some-query')
```

   If the query is not public, you should set your API token rather than the URL.

```ts
const triply = App.get({ token: process.env.TOKEN })
```

3\. Do not forget that we perform TriplyDB.js requests within an [async context](#create-your-first-script). That is:

```ts
async function run() {
  // Your code goes here.
}
run()
```

4\. Get the results of a query by setting a `results` variable. More specifically, for construct queries:

```ts
const results = query.results().statements()
```

   For select queries:

```ts
const results = query.results().bindings()
```

   Note that for SPARQL `construct` queries, we use method `.statements()`, while for SPARQL `select` queries, we use method `.bindings()`.

   Additionally, saved queries can have API variables that allow you to specify variables that are used in the query. Thus, if you have query parameters, pass their values as the first argument to `results` as follows:

```ts
// For SPARQL construct queries.
const results = query
  .results({
    someVariable: 'value of someVariable',
    anotherVariable: 'value of anotherVariable',
  })
  .statements()
// For SPARQL select queries.
const results = query
  .results({
    someVariable: 'value of someVariable',
    anotherVariable: 'value of anotherVariable',
  })
  .bindings()
```

5\. To read the results you have three options:

   5a. Iterate through the results per row in a `for`-loop:

```ts
// Iterating over the results per row
for await (const row of results) {
  // execute something
}
```

   5b. Save the results to a file.

   For saving SPARQL `construct` queries:

```ts
// Saving the results of a SPARQL construct query to a file.
await results.toFile('my-file.nt')
```

   For saving SPARQL `select` queries. Currently we only support saving the file to a .tsv format:

```ts
// Saving the results of a SPARQL select query to a file.
await results.toFile('my-file.tsv')
```

   5c. Load all results into memory. Note that this is almost never used. If you want to process results, then option 5a is better; if you want to persist results, then option 5b is better.

```ts
// Loading results for a SPARQL construct or SPARQL select query into memory.
const array = await results.toArray()
```

## What is an async iterator?

TriplyDB.js makes use of async iterators for retrieving lists of objects. Async iterators are a method of fetching and iterating through large lists, without having to first fetch the whole set.

An example of an async iterator in TriplyDB.js is [`App.getAccounts()`](/triplydb-js/app#appgetaccounts). The following code illustrates how it can be used.

```ts
for await (const account of triply.getAccounts()) {
  console.log(account)
}
```

For cases where you want the complete list, you can use the `toArray` function of the iterator.

```ts
const accounts = await triply.getAccounts().toArray()
```

TriplyDB.js returns async iterators from the following methods:

- [`App.getAccounts()`](/triplydb-js/app#appgetaccounts)
- [`Account.getDatasets()`](/triplydb-js/account#accountgetdatasets)
- [`Account.getQueries()`](/triplydb-js/account#accountgetqueries)
- [`Account.getStories()`](/triplydb-js/account#accountgetstories)
- [`Dataset.getServices()`](/triplydb-js/dataset#datasetgetservices)
- [`Dataset.getAssets()`](/triplydb-js/dataset#datasetgetassets)
- [`Dataset.getGraphs()`](/triplydb-js/dataset#datasetgetgraphs)
- [`Dataset.getStatements()`](/triplydb-js/dataset#datasetgetstatementssubject-string-predicate-string-object-string-graph-string)
- [`Query.results().statements()`](/triplydb-js/query#queryresultsapivariables-object-options-object) for SPARQL `construct` and `describe` queries
- [`Query.results().bindings()`](/triplydb-js/query/#queryresultsapivariables-object-options-object) for SPARQL `select` queries
