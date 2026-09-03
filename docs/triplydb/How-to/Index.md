<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     This is the Overview entry of the How-to chapter. No source — the old
     triply-db-getting-started section had no index beyond a 75-word landing page.

     Administrator settings stays in this chapter, by decision, under its own
     heading. The dividing line is whether a task needs administrator privileges
     on the instance. -->
# TriplyDB How to

Task-based guides for working with TriplyDB. Each one assumes you know what you
want to do and shows you how to do it.

If you are new to TriplyDB, start with [Getting started](../getting-started/index.md)
instead — it walks the shortest path from an empty account to a queryable
dataset.
<!-- LINK-TODO: getting-started not written yet. -->

If you want to understand the ideas rather than the interface, the
[Triply Academy](../../academy/index.md) covers linked data, SPARQL and modelling
without reference to any product.

## Working with data

These guides need nothing beyond an account and a dataset of your own.

| Guide | What you will do |
| --- | --- |
| [Upload data](upload-data.md) | Create a dataset and fill it from another dataset, a URL, or files |
| [View data](view-data.md) | Browse, query, search and inspect the shape of a dataset |
| [Publish data](publish-data.md) | Set who can see a dataset, describe it, and notify other systems when it changes |
| [Manage services](manage-services.md) | Start the services that make a dataset queryable, and keep them in step with the data |
| [Export data](export-data.md) | Download a dataset or a single graph |

Read them in that order if you are working through a dataset from scratch. They
are otherwise independent.

## For administrators

These guides need administrator privileges on the instance.

| Guide | What you will do |
| --- | --- |
| [Administrator settings](admin-settings.md) | Configure the instance: statistics, branding, example datasets, site-wide prefixes, redirects |

Two further administrator topics live elsewhere. The instance-wide services table
is the second half of [Manage services](manage-services.md), so that services are
documented in one place. Authentication, roles and user accounts are in
[Access and security](../../access-security/index.md).

## Related

- [Concepts](../Concepts/index.md) — what a dataset, graph, service and asset are
- [Reference](../Reference/Index.md) — supported formats, and other lookup material
- [Access and security](../../access-security/index.md) — access levels, roles and
  API tokens
- [FAQ](../FAQ/index.md) — shorter answers to common questions
  
