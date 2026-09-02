[TOC]

<!-- SOURCE: triply-db-getting-started/data-stories/index.md — the concepts here are drawn
     from how terms are used across that page rather than from any definition, because the
     source defines none. The relationships between story, element and saved query are new
     writing and need checking — see the review block. -->

# Concepts

This chapter explains how a data story is put together.

For general linked-data terms such as SPARQL, RDF or IRI, see the
[glossary](../../../academy/glossary.md).

## Story

A page that combines explanatory text with live query results. A story has a title, an access
level, an optional banner image, and an ordered list of elements. It belongs to a user or a
group, and can be copied or transferred to another one.

## Element

One block in a story. Elements are stacked in order and come in two kinds:

- A **paragraph** — text you write in Markdown, rendered as HTML. Images and syntax-highlighted
  code blocks are supported.
- A **query element** — a reference to a saved query, shown with its result and an optional
  caption.

## How a query element relates to its query

A query element does not contain a query. It points at a
[saved query](../../Saved-queries/overview/index.md) that exists independently of the story, and
the result is produced by running that query when the story is opened.

Two things follow. The result a reader sees is current, not a snapshot from when the story was
written. And editing the saved query changes every story that uses it — unless the element pinned
a specific version, which is what the optional version selector is for.

## Edit view and reader view

The same page, seen two ways. The edit view has the controls for adding and changing elements;
the reader view shows the story as your audience will see it. The notepad button in the
bottom-right corner switches between them.

Checking the reader view before sharing is worth the habit — it is the only way to see what the
story looks like without the editing furniture around it.

## Access level

Decides who can open the story. A story must be public before it can be shared by URL with people
outside your organisation, or embedded in an external web page.

Access level is set when the story is created and can be changed afterwards in story settings. It
behaves as it does elsewhere in TriplyDB — see
[Access and security](../../../access-security/index.md).


## Banner

An image shown at the top of the story. Wide images work best.

