[TOC]

<!-- SOURCES:
     1. Drive, "Triply PM - Flows Documentation - markdown", Section 3 "Key Concepts" —
        definitions reused near-verbatim. The source lists twelve terms alphabetically; they
        are regrouped here in the order the ideas build on each other, per the Concepts rule.
     2. Drive, "Triply PM Flows - MVP, requirements..." — adds four concepts absent from the
        markdown draft: tags and groups, services in flows, dataset access level as a flow
        action, and presets. Also confirms conditionals are implemented.
     Anchors used by getting-started/ are preserved: #parameterized-variables,
     #masked-variables, #shacl-validation, #the-management-overview. -->

# Concepts

This chapter explains how Flows is put together. The terms are grouped in the order they build on
each other, rather than alphabetically.

For general linked-data terms such as RDF, SPARQL or SHACL, see the
[glossary](../../../academy/glossary.md).

## Building blocks

### Flow

A pipeline definition stored in TriplyDB. A flow consists of a set of tasks arranged on a canvas,
the connections between those tasks, and any variables associated with it. Flows are versioned
automatically; earlier revisions can be viewed and restored.

### Task

The basic building block of a flow. Each task represents one operation — loading data from a URL,
running a SPARQL CONSTRUCT query, validating with SHACL, storing to a dataset, and so on. Tasks
appear as cards on the canvas. Clicking a task card opens its configuration panel.

### Canvas

The visual workspace where you build a flow. Tasks appear as cards on the canvas; connections
between cards define the execution order. You can rearrange tasks by dragging them, and reorder
execution by changing the connections between them.

The distinction matters: moving a card changes only the layout. Execution order follows the
connections, not the positions.

### Task catalogue

The panel on the left side of the canvas. It lists all available task types, grouped by category.
Use the search bar at the top of the catalogue to find a specific task type.

### Pipeline stages

The logical stages a flow can move data through: **Ingest**, **Clean**, **Transform**,
**Enrich**, **Store**, and **Serve**. Not every flow uses all six — you connect only the stages
your data requires. See [the pipeline model](../index.md#the-pipeline-model) for what each stage
covers.

### Conditional

A flow element that routes execution to different branches depending on whether a condition is
true or false. Use conditionals to skip stages, retry tasks, or branch between different
processing paths within a single flow.

Tasks can also run in parallel or in series. Connecting one task to several downstream tasks runs
them in parallel; connecting several tasks to one downstream task makes it wait for all of them.

## Running a flow

### Flow run

A single execution of a flow. Each run records which user triggered it, the start and end time,
and the status of every task. Runs can be triggered manually, via a schedule, or via HTTP call.

### Schedule

A recurring trigger attached to a flow. Schedules define the interval at which a flow runs
automatically. Variables can be set per schedule, so a single flow can run against different
configurations at different times.

### The management overview

The Flows overview page, accessible from the left-hand navigation panel. It shows all flows in
your organisation with a traffic-light status indicator for each. Use this page to monitor the
health of pipelines across your organisation, see which user triggered each run, and manage
access.

Status updates are shown in real time rather than on refresh.

### Tags and groups

Flows can be tagged and organised into groups. In an organisation running many pipelines this is
what keeps the overview page usable.

### Public flows

A flow can be public, in which case its last run time and status are visible to people who do not
have access to the flow itself. This is how data consumers check whether the data they are
reading is fresh, without being given access to the pipeline that produced it.

## Variables

### Parameterized variables

A named placeholder used in task configurations. You define a variable once and reference it in
multiple configuration fields across one or more tasks. At run time, the variable is resolved to
its value.

Parameterized variables make a flow reusable across environments, datasets, or scheduled runs
without modifying the flow definition. Variables can also be combined into presets for commonly
used combinations.

### Masked variables

A variable whose value is hidden in the interface after it is saved. Other users with execution
rights can trigger a flow that uses masked variables without ever seeing the underlying value.
Masked values are also not exposed in logs or error messages.

Use masked variables to store credentials such as API keys or passwords.

### Presets

A saved combination of variable values. Where the same set of values is used repeatedly — one per
environment, say — a preset avoids re-entering them for every run.

## Extending a flow

### SHACL validation

A task type that runs SHACL shapes against a dataset and produces a validation report. Use SHACL
validation between a Transform task and a Store task to catch data quality issues before they
reach a production dataset. TriplyDB supports a shared SHACL functions library, so validated
patterns can be reused across projects.

### Services

A flow can start, stop and re-synchronise TriplyDB services as part of a pipeline, so a service
serves data produced by the run that just finished rather than the previous one.

### Dataset access level

A flow can change the access level of a dataset. Combined with SHACL validation, this supports a
pattern where data is only made visible once it has passed its checks.

### Connector

A mechanism for plugging custom code into a flow. Connectors are intended for task types that the
built-in catalogue does not yet cover. They let developers supply logic in their own code while
still running it within the governed Flows environment. Connectors can be connected to private
infrastructure.

**Chapter navigation:**

[Overview](../Index.md) 

[Getting Started](../Getting-started/index.md) 

[Concepts](../Concepts/index.md) 

[Reference](../Reference/index.md) 

[FAQ](../FAQ/index.md)



