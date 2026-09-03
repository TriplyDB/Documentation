<!-- SOURCE: triply-db-getting-started/data-stories/index.md — the opening paragraph,
     expanded into the four Overview questions. That page is the only prose source; the
     audience and "how it fits" sections are new writing, flagged below. -->

# TriplyDB Data stories

A TriplyDB data story is a way of communicating information about your linked data along with
explanatory text, while also being able to integrate query results.

A story is built from elements stacked in order: paragraphs of text you write, and the live
results of saved SPARQL queries. Readers see the query results as they are now, not a screenshot
taken when the story was written.

## Who it is for

- **Data publishers** who want to explain what a dataset shows, rather than hand someone a query
  and hope they run it.
- **Analysts and researchers** presenting a finding, where the evidence should stay live and
  checkable.
- **Communications and policy staff** who need something publishable on a website, without
  writing any query themselves.

## What it solves

A saved query answers one question and returns a table. It carries no explanation of why the
question matters, what the columns mean, or what the reader should conclude. A slide deck or blog
post can carry that explanation, but its numbers are frozen the moment it is written.

A story is both. The text and the query results live on the same page, and the results re-run
when the page is opened. When the underlying data changes, the story changes with it.

Stories can be kept private, shared by URL, or embedded in your own web page.

## How it fits into the Triply datacloud

A story sits on top of [saved queries](../../Saved-queries/index.md) — each query
element points at a saved query, optionally pinned to a specific version. The query in turn runs
against a dataset in TriplyDB.

That layering is worth knowing: a story is a presentation layer, not a copy. Change the query and
every story that uses it changes too, unless the element pinned a version.

Next: [Getting Started](../Getting-started/index.md) walks you through creating a story and
adding your first two elements.

**Chapter navigation:**

[Overview](../Index.md) 
[Getting Started](../Getting-started/index.md) 
[Concepts](../Concepts/index.md) 
[Reference](../Reference/index.md) 
[FAQ](../FAQ/index.md)



