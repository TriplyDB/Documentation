[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: a merge of two places that both documented services —
       - publishing-data/index.md, "Starting services" and "Existing services"
       - admin-settings-pages/index.md, "Services page"
     One home, split by audience: per dataset, then instance-wide.
     No redirect of its own; the two source pages redirect to their main targets. -->

# Manage services

A **service** is what makes a dataset queryable in a particular way. Without one,
a dataset can still be reached through
[TriplyDB.js](../../triplydb-js/index.md) and the Linked Data Fragments API — but
SPARQL, text search and GraphQL each need a service running.

This guide covers creating and maintaining services for a dataset, and the
instance-wide services page that administrators use.

## Create a service

<!-- SOURCE: publishing-data/index.md#starting-services -->

Open a dataset and choose the query interface you want from the left-hand
sidebar — **SPARQL**, for example. If no service of that kind is running, you are
offered the "Create service" page.

<!-- TO CONFIRM: the source says to click a "Services" icon in the left-hand
     sidebar. There is no such icon; the sidebar lists the query interfaces
     themselves. The wording above reflects that correction, but the exact route
     for each service type should be checked against the current interface. -->

Which service types are offered depends on how the instance is configured — e.g.
SPARQL, Jena SPARQL and Elasticsearch. The complete list is in
[Service types](../reference/service-types.md).
<!-- LINK-TODO: reference/service-types.md is not written yet. It should hold the
     single authoritative list — see the review block. -->

![The "Create service" page, offering three service types](../../assets/create-service.png)

One dataset can have several services at once.

## Keep a service in step with its data

<!-- SOURCE: publishing-data/index.md#existing-services -->

Existing services appear as widgets, from which they can be created or deleted.

![A service widget](../../assets/service-widget.png)

A dataset changes whenever a graph is added, deleted or renamed. When that
happens the service holds older data than the dataset, and a synchronisation
button appears on the widget. Click it to bring the service up to date.

This is worth knowing before you go looking for a bug: a query returning stale
results usually means a service that has not been synchronised, not a query that
is wrong.

<!-- NEW: the closing paragraph. The source explains the mechanism without saying
     what it looks like from the outside, which is how people actually meet it. -->

## The instance-wide services page

<!-- SOURCE: admin-settings-pages/index.md#services-page — moved here so that all
     services material lives in one place. -->

Administrators get a page governing every service on the instance: a paginated,
filterable, sortable table with a wildcard search field on the right.

Services in an error state are sorted to the top automatically, so that they can
be dealt with first.

### What the columns show

| Column | Shows |
| --- | --- |
| Name | The service name, linking to the service. Sortable and filterable |
| Type | The service type, e.g. Virtuoso, Jena, Blazegraph, Prolog or Elasticsearch. See [Service types](../reference/service-types.md) |
| Status | Starting, Running, Stopped, Updating or Error |
| Statements | How many statements are loaded. Filtered with a slider |
| Loaded graphs | How many graphs are loaded; together they account for the statement count |
| Dataset | The dataset the service belongs to, linked |
| Owner | The dataset's owner, who also owns the service, linked |
| Created | How long ago it was created; hover for the exact moment |
| Last queried | How long ago it was last queried; hover for the exact moment |
| Auto stops | How long until the service auto-stops, if it has that feature |
| Version | The service version |

Two of those deserve a note.

**Auto stop** reduces memory use by stopping a service that has not been queried
for a while. The timer resets every time the service is used.

**Version** does not update itself. Updating a service can cause downtime, so the
owner decides when it happens.

### What you can do from it

| Action | Notes |
| --- | --- |
| Update | An orange arrow appears beneath a service that can be updated |
| Open additional information | Behind the `i` button: the graphs in the dataset, and the raw service metadata |
| Inspect the logs | Behind the text button |
| Synchronise | Brings a service back in step with its dataset |
| Remove | Frees space on the instance |

For bulk work, use the tickbox on the left of the table. It selects every service
matching the current search criteria, or all of them if there are none, and the
selection can then be updated or removed in one go.

## Related

- [Publish data](publish-data.md) — publishing a dataset publishes its services
- [View data](view-data.md) — the SPARQL IDE and text search that services enable
- [SPARQL: the basics](../../academy/sparql.md) — what a SPARQL service is for

