[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — "Using a saved query as
     RESTful API", unchanged apart from house style. Endpoint reference material was moved
     to reference/api.md; this page keeps the procedure. -->

# Use a query as a RESTful API

A saved query can be used as a RESTful API to retrieve data from your dataset. No client library
is involved — any HTTP client works.

On the query page, the URL next to the keyword **API** is the RESTful API URL. Click the copy
button behind it. For the `timeline-cars` query, this gives:

```uri
https://api.triplydb.com/queries/DBpedia-association/timeline-cars/run
```

Open that URL in a browser, or fetch it with curl, and you get a JSON representation of the data.

If the query is private or internal, the request needs an authorisation header. Without one it
returns an incorrect response rather than an obvious error — see
[Access and security](../../../access-security/index.md) for creating an API token.

<!-- LINK-TODO: currently generics/api-token.md, parked with access-security/. -->

For result sets over 10 000, add the `page` and `pageSize` arguments described in
[Retrieve more than 10 000 results](paginate-results.md).

For the endpoints that return query *metadata* rather than results, see
[Saved query API](../reference/api.md).

