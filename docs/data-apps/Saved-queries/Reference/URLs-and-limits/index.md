[TOC]

<!-- SOURCE: assembled from statements scattered across
     triply-db-getting-started/saved-queries/index.md — the URL examples in "Sharing a
     saved query" and "Using a saved query as RESTful API", and the argument descriptions
     in "Pagination with the saved query API". Nothing here is new; it is the same facts
     in table form. -->

# URLs and limits

## URL patterns

`ACCOUNT`, `QUERY` and `VERSION` are user-chosen names and numbers.

| Purpose | Pattern |
|---|---|
| Query page, latest version | `https://triplydb.com/ACCOUNT/-/queries/QUERY` |
| Query page, specific version | `https://triplydb.com/ACCOUNT/-/queries/QUERY/VERSION` |
| Run the query (RESTful API) | `https://api.triplydb.com/queries/ACCOUNT/QUERY/run` |
| Metadata for one query | `https://api.triplydb.com/queries/ACCOUNT/QUERY` |
| Metadata for all queries of an account | `https://api.triplydb.com/queries/ACCOUNT` |
| Metadata for all saved queries | `https://api.triplydb.com/queries` |

A query URL without a version number resolves to the latest version.

## Pagination arguments

Both apply to the `run` endpoint.

| Argument | Meaning | Default | Maximum |
|---|---|---|---|
| `page` | Which page of the result set to return | 1 | None — an out-of-range page returns an empty page |
| `pageSize` | Results per page | 100 | 10 000 — a higher value returns an error |

Example: `https://api.triplydb.com/queries/academy/pokemon-color/run?page=3&pageSize=100`

Responses follow [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288.html) and carry a `link`
header with `next`, `prev` and `first`.

## Limits

| Limit | Value |
|---|---|
| Results in a single result set | 10 000 |
| Maximum `pageSize` | 10 000 |
| Maximum `page` | None |

