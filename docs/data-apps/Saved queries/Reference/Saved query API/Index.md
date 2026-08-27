[TOC]

<!-- SOURCE: triply-api/index.md — the "Queries" section and the retrieval half of
     "Query metadata (GRLC)". Reproduced here because it is saved-query material sitting
     in a page about the whole API; triply-api/ is unchanged in this round and keeps it.
     This page should become canonical and triply-api/ should link here. -->

# Saved query API

Endpoints that return information *about* saved queries. To run a query and get results, see
[Use a query as a RESTful API](../how-to/use-as-restful-api.md).

## Metadata endpoints

| Scope | Endpoint |
|---|---|
| All saved queries | `https://api.triplydb.com/queries` |
| All saved queries of an account | `https://api.triplydb.com/queries/ACCOUNT` |
| One saved query | `https://api.triplydb.com/queries/ACCOUNT/QUERY` |

## Retrieving the query text

Request the `text/plain` content type to get the query string together with its GRLC metadata
annotations:

```sh
curl -vL -H 'Accept: text/plain' 'https://api.triplydb.com/queries/JD/pokemonNetwork'
```

The response is a valid SPARQL query, annotations included:

```sparql
#+ description: This query shows a small subgraph from the Pokemon dataset.
#+ endpoint: https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
#+ endpoint_in_url: false
construct where { ?s ?p ?o. }
limit 100
```

Because the annotations are SPARQL comments, the result can be pasted into an editor and run
without editing.

## Related

- [Query metadata](query-metadata.md) — what the annotations mean
- [TriplyDB.js `Query`](../../../triplydb-js/query.md) — the same operations from TypeScript
- [TriplyDB OpenAPI documentation](https://api.triplydb.com/api-docs) — the interactive reference

