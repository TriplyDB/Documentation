[TOC]

<!-- SOURCES:
     1. Drive, "Triply PM - Flows Documentation - markdown" (1tJiLkTO5Y7m7UHIbONyTccTXOe1hXBdg),
        Section 1 "Introduction" — reused near-verbatim.
     2. Drive, "Triply PM Flows - MVP, requirements, user stories, acceptance criteria"
        (1XsUQuDvFpx10kL7-YqRZpsQuph6LT4bxK0BFgseGTT8), slides "Problem Statement", "Vision",
        "Personas & Stakeholders" — used to ground the audience section, which was previously
        written from inference.

     NOTE: source 2 is an internal deck. Its business case, pricing, sales and billing slides
     are deliberately not used here. Personas are referred to by role, not by their internal
     names (Doris Data, Dave Dev, Matthew Manager, Jenny Journal). -->

# Flows

Flows is a TriplyDB add-on for building and maintaining data processing pipelines without writing
code. You assemble a pipeline by dragging tasks from a catalogue onto a visual canvas, connecting
them in the order they should run, and configuring each task through a form. Where the built-in
task types are not enough, you can extend a flow with custom code through a connector.

## Who it is for

Flows serves four kinds of user, with different needs:

- **Data experts** who load and transform data and want to publish it as linked data, without
  writing orchestration code.
- **Application developers** who need to connect their organisation's own infrastructure — data
  files, databases, private networks — to a pipeline.
- **Managers** who need an overview of the pipelines their organisation runs, who triggered
  them, and how they relate to TriplyDB usage.
- **Data consumers** who never open the canvas, but need to know when a flow last ran and
  whether the data they are reading is fresh.

Flows does not require knowledge of TriplyDB's query languages to get started. A working
knowledge of your own data sources and what you want to do with them is enough.

## What it solves

Building a data pipeline usually means writing a custom script, configuring a separate tool, and
then maintaining both. When something changes in a source system, or when you need to move the
same pipeline to a different environment, that script needs updating — often by the same person
who wrote it.

Flows removes that overhead. Pipelines are defined visually inside TriplyDB, versioned
automatically, and reusable across environments through parameterized variables. Sensitive
credentials such as API keys can be stored as masked variables that other users can trigger
without ever seeing.

It also addresses a structural issue. TriplyETL, Triply's previous pipeline tooling, runs as a
separate application outside TriplyDB. Flows brings this capability directly into TriplyDB,
reducing the number of tools to maintain and making the pipeline part of the same governed
environment as the data it produces.

## The pipeline model

A flow moves data through up to six stages:

| Stage | What happens |
| :---- | :---- |
| **Ingest** | Pull in raw data from external sources |
| **Clean** | Remove noise, nulls, and duplicates |
| **Transform** | Reshape, map, and aggregate |
| **Enrich** | Join with reference data and context |
| **Store** | Persist to a TriplyDB dataset or data lake |
| **Serve** | Expose via API, query, or dashboard |

Not every pipeline uses all six stages. Flows lets you connect only the steps your data requires.

## How it fits into the TriplyDB datacloud

Flows is one of several TriplyDB add-ons that together cover the full knowledge graph lifecycle.
Where [KG Builder](../KG-builder/index.md) assembles graph structures from scratch and the
[Editor](../Editor/index.md) supports day-to-day curation of individual instances, Flows handles
the systematic loading and transformation of data from source systems into your TriplyDB
datasets.

Output datasets produced by a flow are ordinary TriplyDB datasets — they can be queried,
published, and used as input to other add-ons without any additional steps.

Next: [Getting Started](Getting-started/index.md) walks you through building and running your
first flow.

**Chapter navigation:**

[Overview](./Index.md) 

[Getting Started](./Getting-started/index.md) 

[Concepts](./Concepts/index.md) 

[Reference](./Reference/index.md) 

[FAQ](./FAQ/index.md)


