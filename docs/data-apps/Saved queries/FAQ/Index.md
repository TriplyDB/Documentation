[TOC]

<!-- SOURCE: no source page. Every question here is derived from a statement in
     triply-db-getting-started/saved-queries/index.md or triply-api/index.md — the
     answers are reused, the questions are new. Nothing has been mined from Zoho Desk
     yet, so this is a seed, not a real FAQ. -->

# FAQ

## Saving and versions

**Do I need special rights to save a query?**

Yes. You need to be logged in and have authorisation rights on the dataset. Without them the save
button does not appear.

**Does saving overwrite my previous query?**

No. Every save creates a new version, and older versions stay reachable at their own URLs. See
[Manage versions](../how-to/manage-versions.md).

**If I delete a query, do the old versions survive?**

No. Deleting removes the query and all of its versions.

## Links and access

**Does my link show the latest version or the one I was looking at?**

It depends on the link. A URL ending in a version number always shows that version. A URL without
one follows the latest version, so its results change when someone saves a new one.

**I shared a link and my colleague sees nothing.**

Check the query's access level. Sharing a link does not grant access to the underlying dataset —
a private query stays private to people who cannot see it.

**Can I move a query to an organisation?**

Yes, and you can copy it instead of moving it. See
[Transfer or copy a query](../how-to/transfer-or-copy.md). Transfer is in the settings field;
copy is in the three-dot menu.

## Results

**Why do I only get 10 000 results?**

A single result set stops at 10 000 results. The query matched more — you need to page through
them. See [Retrieve more than 10 000 results](../how-to/paginate-results.md).

**I set `pageSize` to 50 000 and got an error.**

The maximum `pageSize` is 10 000. Above that, the request fails.

**Why is the download button doing nothing on my map?**

Not every visualisation can be downloaded. Gallery, Geo, Geo-3D, Geo events and Timeline have no
download; the others produce `.csv`, `.json`, `.svg`, `.html` or `.png`. See
[Result formats](../reference/result-formats.md).

## API and scripts

**My API request returns an incorrect response.**

If the query is private or internal, the request needs an authorisation header. Without one, the
response is wrong rather than obviously refused.

**Where do I find the API link?**

On the query page, next to the keyword **API**, with a copy button behind it.

**Can I use a saved query in a notebook without writing the connector myself?**

Yes. The `</>` button on the query page generates a Python or R snippet that fetches the results
into a `data` variable. See [Use a query in Python or R](../how-to/use-in-python-or-r.md).

**Can I use a saved query as a data source in TriplyETL?**

Yes, with `Source.TriplyDb.query()`, and you can pin a version. See the
[TriplyETL documentation](../../../triply-etl/sources/triplydb-queries.md).

