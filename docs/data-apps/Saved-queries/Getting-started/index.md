[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — sections
     "How to save a query" (both routes, authorisation note, save-query-highlighted.png)
     and the first half of "Sharing a saved query" (the query URL).
     Rewritten into numbered steps; no sentence of substance dropped.

     Images assume this file sits three levels deep, at
     data-apps/saved-queries/getting-started/ — hence ../../../assets/. -->

# Getting Started

By the end of this page you have a saved query with its own URL, a second version of it, and the
RESTful API link that runs it.

To use this app, you need an active TriplyDB dataset. If you don't have one yet, see the
[TriplyDB Getting Started guide](../../../triplydb/Getting-started/index.md).

You also need to be logged in and have authorisation rights on the dataset. Without them the save
button does not appear.

## Step 1 — Open the SPARQL IDE

Open your dataset and start a SPARQL service if none is running. Go to the
[SPARQL IDE](../../../triplydb/How-to/view-data.md) tab. The editor opens with an empty query.

## Step 2 — Write a query and run it

Type a query and run it. Choose a visualisation for the result — Table, Response, Chart, Geo and
the others are all saved along with the query, so pick the one you want people to see when they
open the link.

## Step 3 — Save the query

Click the save button.

![The save query button highlighted](../../../assets/save-query-highlighted.png)

The query is saved as version 1 and gets its own page. You are now looking at the saved query
rather than at the IDE — the two look similar, and the difference matters for several of the
how-to guides.

## Step 4 — Read the query URL

The address of the page you are on is the query's URL. For a query named `timeline-cars` under
the account `DBpedia-association`, version 9 is:

```uri
https://triplydb.com/DBpedia-association/-/queries/timeline-cars/9
```

Leave the version number off and the URL always resolves to the latest version:

```uri
https://triplydb.com/DBpedia-association/-/queries/timeline-cars
```

Both forms are shareable. Which one to use is a decision, not a detail — see
[Share a query](../How-to/share-a-query.md).

## Step 5 — Create a second version

Go to the **Saved Queries** tab of the dataset and click your query. Change something in the
query or in the visualisation, then click save again. The query is now at version 2, and version
1 is still reachable at its own URL.

## Step 6 — Copy the API link

On the query page, find the URL next to the keyword **API** and click the copy button behind it:

```uri
https://api.triplydb.com/queries/DBpedia-association/timeline-cars/run
```

Open that URL in a browser or fetch it with curl and you get the query result as JSON. That is
the whole RESTful API — no client library required.

## What you now have

A versioned query with a persistent URL, a second version proving that versioning works, and an
API endpoint you can call from anything that speaks HTTP.

From here:

- [How-to guides](../How-to/index.md) — sharing, downloading results, paging past 10 000 results,
  calling the API from Python or R, transferring a query to another account.
- [Concepts](../Concepts/index.md) — how versions, the service binding and API variables relate
  to each other.

