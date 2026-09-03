<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     step condensed from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: no source. The old triply-db-getting-started section was named for
     this purpose but was in fact six full how-to pages. This page is the shortest
     path through them: account, dataset, data, service, query. Every step here is
     the minimum from a how-to guide, with a link to the full version.

     RULE APPLIED: nothing optional. Anything a reader can skip and still end up
     with a queryable dataset belongs in How to, not here. -->

# TriplyDB Getting started

This page takes you from nothing to a dataset you can query, in four steps. It
should take about fifteen minutes.

Everything optional has been left out. Each step links to the full guide if you
want the detail.

<!-- NEW: the fifteen-minute estimate is a guess and should be checked by someone
     who has watched a newcomer do this. -->

## Before you start

You need an account on a TriplyDB instance — `triplydb.com` or your
organisation's own. Sign up or log in before going further.

You do not need to know SPARQL. Step 5 gives you a query to paste.

## 1. Create a dataset

<!-- SOURCE: uploading-data/index.md#creating-a-new-dataset, reduced to the
     required fields only. -->

From the home screen, click the `+` beside "Your datasets".

Enter a **dataset name** — letters, numbers and hyphens. Everything else in the
dialog is optional and can be filled in later.

New datasets are **Private**, which is the right setting while you are
experimenting. Nobody else can see it.

Full guide: [Upload data](../How-to/upload-data.md).

## 2. Add data

<!-- SOURCE: uploading-data/index.md#adding-data — all three routes, plus the
     starter dataset from admin-settings-pages/index.md#setting-starter-dataset. -->

The "Add data" pane opens automatically after you create a dataset. It offers
three routes, and which one suits you depends on what you have to hand.

**If you have a data file**, drag it onto the cloud icon, or click the icon to
browse for it. This is the most reliable route, because it does not depend on
what the instance already holds. The file must be RDF, CSV, TSV or XML — see
[Supported file formats](../Reference/file-formats.md).

**If the instance already publishes datasets**, type in the **"Add data from an
existing dataset"** field, pick one from the dropdown, choose its graphs and click
**Import graphs**. On a new or private instance this dropdown may be empty, which
is not an error — there is simply nothing published yet to copy from.

**If the data is online**, paste its address into the **"Add data from a URL"**
field. The URL has to be publicly reachable.

<!-- NEW: the three-route framing and the note about the empty dropdown. The
     source describes all three routes neutrally; a newcomer needs to be told
     which to choose and what an empty dropdown means. -->

### If you have nothing to load

Some instances offer a **starter dataset** — a small, beginner-friendly dataset
shown on your account page while you have no datasets of your own, with a button
to import a copy. If you see one, it is the fastest way to get something to look
at, and it replaces steps 1 and 2 entirely.

Whether a starter dataset exists depends on whether an administrator has
configured one. See
[Administrator settings](../How-to/admin-settings.md#starter-dataset).

Your data now lives in one or more **graphs** inside the dataset. See
[Concepts](../Concepts/index.md).

## 3. Look at what you loaded

<!-- SOURCE: viewing-data/index.md — the linked data browser and table, reduced to
     one sentence each. -->

Two views are available immediately, with no further setup:

- The **linked data browser** shows one resource at a time and lets you follow
  properties to the next one.
- The **linked data table** shows every triple, with columns for subject,
  predicate, object and graph.

Full guide: [View data](../How-to/view-data.md).

## 4. SPARQL

<!-- SOURCE: publishing-data/index.md#starting-services, for the fact that
     querying requires a running service and that the service holds a copy of the
     data. The navigation is NOT from the source: the source says to click a
     "Services" icon in the left-hand sidebar, which does not exist. Corrected on
     review to clicking SPARQL. -->

Querying needs a running **service** — a copy of your data, prepared for a
particular query language.

Click **SPARQL** in the left-hand sidebar of your dataset. 

<!-- NEW: this step and its query. No existing page walks a newcomer through a
     first query — viewing-data documents the IDE, and the Academy teaches SPARQL,
     but nothing joins the two. The query below is deliberately the simplest one
     that returns something from any dataset. -->

Paste
this in:

```sparql
select ?subject ?predicate ?object
where {
  ?subject ?predicate ?object.
}
limit 10
```

Run it. Ten triples come back — proof that the dataset, the service and the query
editor are all working.

That query matches everything, which is why it always returns something and why
it is never useful beyond this moment. To write queries that answer real
questions, start with [SPARQL: the basics](../../academy/sparql.md).

## What next

| If you want to | Go to |
| --- | --- |
| Share the dataset with others | [Publish data](../How-to/publish-data.md) |
| Understand what a graph or service is | [Concepts](../Concepts/index.md) |
| Learn to write queries | [SPARQL: the basics](../../academy/sparql.md) |
| Get the data back out | [Export data](../How-to/export-data.md) |
| Automate loading it | [TriplyETL](../../triply-etl/index.md) |

