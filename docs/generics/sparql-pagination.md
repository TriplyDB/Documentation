---
title: "SPARQL pagination"
path: "/docs/pagination"
---

This page explains how to retrieve all results from a SPARQL query using pagination.

Often SPARQL queries can return more than 10_000 results, but due to limitations the resultset will only consist out of the first 10_000 results. To retrieve more than 10_000 results you can use pagination. TriplyDB supports two methods to retrieve all results from a SPARQL query. Pagination with the saved query API or Pagination with TriplyDB.js.

## Pagination with the saved query API

Each TriplyDB instance has a fully RESTful API. We've extended the API that we can use the RESTful API also for a saved SPARQL queries. We've added two arguments to the API for saved queries to have the query be able to process paginated resultSets. The arguments are ‘page’ and ‘pageSize’. An example of a paginated saved SPARQL query request would look like:
`https://api.triplydb.com/queries/academy/pokemon-color/run?page=3&pageSize=100`

As shown in the example request ‘page’ corresponds to the requested page. So in the example request this would correspond to the third page of paginated SPARQL query, according to the ‘pageSize’. Where there is no maximum ‘page’ limit, as a SPARQL query could return an arbitrary number of results. When no results can be retrieved for the requested page an empty page will be returned.

The argument ‘pageSize’ corresponds to how many results each page would contain. The ‘pageSize’ has a default of a 100 returned results and a maximum ‘pageSize’ limit of 10_000 returned results. the request will return an error when the ‘pageSize’ is set higher than 10_000. The ‘pageSize’.

For the RESTful API for the saved SPARQL queries we follow the specification in full accordance with [the W3C](https://www.w3.org/TR/html401/types.html#type-links) and [WHATWG](https://html.spec.whatwg.org/multipage/links.html#sequential-link-types) standards.

The request will return an response body containing the resultset and a response header. The response header contains a link header with the relative "next" request, the relative "prev" request, and the relative "first" request. By following the "next" link header request you can chain the pagination and retrieve all results.

```json
link:
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=4&pageSize=100>; rel="next",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=2&pageSize=100>; rel="prev",
    <https://api.triplydb.com/queries/academy/pokemon-color/run?page=1&pageSize=100>; rel="first"
```

## Pagination with TriplyDB.js
