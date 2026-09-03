[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — the intro paragraph,
     "Query metadata", and the explanatory (non-procedural) parts of
     "Download more than 10 000 query results" and "Using a saved query as RESTful API".
     Procedures from those sections live in how-to/; only the model is here.

     This chapter is the one place where genuinely new writing was needed: the source
     documentation explains each feature but never explains how they relate. -->

# Concepts

This chapter explains how a saved query is put together. Read it once and the how-to guides stop
needing footnotes.

For general terms — SPARQL, RDF, IRI, named graph — see the
[glossary](../../../academy/glossary.md).

## The query, the version and the URL

A saved query is a versioned SPARQL query with its own URL.

Those three things are separable, and confusing them causes most of the surprises:

- **The query** is the named object: `timeline-cars` under the account `DBpedia-association`. It
  is what you delete, transfer or copy.
- **A version** is one saved state of that query — its query string and its visualisation
  together. Saving never overwrites; it adds. Version 1 stays reachable after version 9 exists.
- **The URL** addresses either. With a version number it is frozen. Without one it follows the
  latest version, and its results change under you whenever someone saves.

Pinning a version is the right default for anything that must keep working — an application, a
citation, a published data story. Omitting it is right when you want readers to see current work.

## The service binding

A query does not run by itself. It runs against a SPARQL service over a dataset, and that binding
is part of the query: the metadata section carries a link to the dataset and a link to the
service.

Two consequences follow. If the service is stopped or removed, the query stops returning results
even though nothing about the query changed. And a query transferred to another account still
points at the original dataset — transferring moves the query, not the data.

## Metadata

Every saved query has a metadata section. Some of it you write, some of it the system records:

- A **title** and **description**, both of which you supply.
- The **access level** and the **version**, exposed as metadata.
- Links to the **dataset** and the **service** the query runs against.

Access level is the field that decides who can open the URL and who needs an authorisation header
to call the API. It behaves the same way here as everywhere else in TriplyDB — see
[Access and security](../../../access-security/index.md).

<!-- LINK-TODO: access-security/ is parked. Repoint when that chapter lands. -->

Metadata can also be written inside the query string itself, using GRLC annotations. These are
SPARQL comments beginning with `#+`, which means they travel with the query text and are still
valid SPARQL. See [Query metadata](../Reference/query-metadata.md) for the annotation format.

## Results, and the 10 000 limit

A SPARQL query can match more results than a single response is allowed to carry. The result set
returned in one request stops at 10 000.

This is a transport limit, not a query limit — the query itself matched everything. To get the
rest, you page through the result set. Two mechanisms do this:

- **The saved query API** takes `page` and `pageSize` arguments and returns link headers that
  chain one request to the next.
- **TriplyDB.js** handles paging internally, so a large result set can be iterated, written to a
  file, or loaded into memory without managing pages yourself.

Both are described in [Retrieve more than 10 000 results](../How-to/paginate-results.md). Which
to choose is a question of what you are writing: an HTTP client of any language can do the first;
the second needs TypeScript, but is less to get wrong.

## API variables

A saved query can declare API variables — named parameters substituted into the query string when
it runs. This is what makes one saved query serve many questions: an application requests
distinct information based on a limited set of inputs, without building SPARQL strings and
without a separate saved query per case.

Because the substitution happens server-side, the query string stays parameterised correctly.
Variables are passed as arguments to the API endpoint, or as the first argument to `results()` in
TriplyDB.js.

## Where a saved query is consumed

The same query object is reachable from four directions, and it is the same object in all of them
— a new version saved in the IDE is immediately the version those consumers see, unless they
pinned one:

| From | How |
|---|---|
| A browser | The query URL |
| Any HTTP client | The RESTful API `run` endpoint |
| TriplyDB.js | `account.getQuery()` |
| TriplyETL | `Source.TriplyDb.query()` |

