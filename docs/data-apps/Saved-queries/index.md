[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — opening paragraph,
     expanded into the four Overview questions. No other page contributes here. -->

# Saved queries

A saved query is a versioned SPARQL query with its own URL. Using that URL you can view any
version of the query and its results, run the query from a browser or from a program, and hand
the query to someone else without explaining how to run a SPARQL request first.

## Who it is for

Saved queries are used by three kinds of people, often on the same query:

- **Data publishers** who want a question answered the same way every time, by anyone who opens
  the link.
- **Developers** who need a stable HTTP endpoint that returns data in a predictable format,
  without embedding a SPARQL string in their application.
- **Analysts** working in Python, R or a notebook, who want the result set rather than the query
  language.

## What it solves

A SPARQL query written in the [SPARQL IDE](../../triplydb/How-to/view-data.md) exists only in
the browser tab it was typed in. Sharing it means sharing a query string, and running it again
means pasting that string back into an editor. Nothing records which version produced which
result.

Saving the query changes four things:

- **It gets a URL.** Persistent, linkable, and citable, with or without a version number.
- **It gets versions.** Every save adds a version; older versions stay reachable.
- **It gets metadata.** A title, a description, an access level, and the dataset and service it
  runs against.
- **It gets an API.** The same query is available as a RESTful endpoint that returns JSON,
  with support for paging through result sets larger than a single response can carry.

## How it fits into the Triply datacloud

A saved query sits between a dataset and everything that consumes it. It is created from the
SPARQL IDE over a dataset in TriplyDB, and it is consumed by
[TriplyETL](../../triply-etl/sources/triplydb-queries.md) as a data source, by
[TriplyDB.js](../../triplydb-js/query.md), and by any application that can make an HTTP
request.

Because the query is versioned, each of those consumers can pin the version it was built
against, or follow the latest one.

Next: [Getting Started](../Getting-started/index.md) walks you through saving your first query
and running it from its own URL.


