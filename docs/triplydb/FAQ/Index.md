[TOC]

<!-- SOURCE: no source page. The old documentation had no FAQ. Every question here is
     derived from a statement in the TriplyDB how-to and reference chapters — the answers
     are recycled, the questions are new. Nothing has been mined from Zoho Desk yet, so
     this is a seed, not a real FAQ.

     Links use the capitalised folder names as they currently stand in the repository. -->

# FAQ

## Datasets and data

**What data formats can I upload?**

The RDF serialisations — Turtle, TriG, N-Triples, N-Quads, JSON-LD, RDF/XML — plus CSV, TSV
and XML, which are converted on the way in. Files may be compressed. See
[Supported file formats](../Reference/file-formats.md).

**Why was my file rejected?**

Data that is not well-formed is refused rather than partially loaded, so a dataset never ends
up half-populated. See [When data is rejected](../How-to/upload-data.md#when-data-is-rejected).

**Can I store files that are not RDF?**

Yes, as assets — images, PDFs, source files, anything binary. They live alongside the dataset
rather than in it. See [Assets](../How-to/upload-data.md#assets-binary-data).

**What is the difference between a dataset and a graph?**

A dataset is the container; a graph is a named set of statements inside it. Splitting data
across graphs lets you replace or query one part without touching the rest. See
[Concepts](../Concepts/Index.md).

## Services

**I uploaded data but my query returns nothing.**

Check that a service is running, and that it is in step with the data. A service holds its own
copy, so data added after the service started is not visible until it is synchronised. See
[Keep a service in step with its data](../How-to/manage-services.md#keep-a-service-in-step-with-its-data).

**Which service type should I choose?**

It depends on what you need to do with the data. See
[Service types](../Reference/service-types.md).

**Why did my service stop on its own?**

Some services stop automatically when they have not been queried for a while, to free up
memory. The timer resets on every use, and the service restarts when queried again.

## Sharing and access

**Who can see my dataset?**

Whoever its access level allows. New content is Private until you change it. See
[Access levels](../../access-security/access-levels.md).

**I made a query public but people get no results.**

The query is public, the dataset behind it probably is not. Visitors can see the query and
its query string but receive no results from a private dataset. See
[When access levels interact](../../access-security/access-levels.md#when-access-levels-interact).

**How do I let another system know when my data changes?**

Use a webhook. See [Webhooks](../How-to/publish-data.md#webhooks).

## Querying and viewing

**How do I explore a dataset without writing a query?**

The linked data browser walks it one resource at a time; the linked data table shows the raw
triples. See [View data](../How-to/view-data.md).

**Can I search my data as text rather than by pattern?**

Yes, with an Elasticsearch service. See
[Elasticsearch](../How-to/view-data.md#elasticsearch).

**Where does the GraphQL schema come from?**

It is generated from the SHACL shapes in your dataset, not written by hand. See
[GraphQL](../Reference/graphQL.md).

**How do I keep a query I wrote?**

Save it. It gets a URL, versions, and an API endpoint. See
[Saved queries](../../data-apps/Saved-queries/index.md).

## Exporting

**Can I get my data back out?**

Yes, a whole dataset or one graph at a time. Exports are compressed. See
[Export data](../How-to/export-data.md).

**Chapter navigation:**

[Overview](../index.md) 
[Getting Started](../Getting-started/index.md) 
[Concepts](../Concepts/index.md) 
[Reference](../Reference/Index.md) 
[FAQ](../FAQ/index.md)

