[TOC]

<!-- SOURCES:
     1. Drive, "Triply PM - Flows Documentation - markdown" — run statuses (Section 2, Step 6),
        pipeline stages (Sections 1 and 3), variable types and trigger methods (Section 3).
     2. Drive, "Triply PM Flows - MVP, requirements, user stories, acceptance criteria",
        acceptance-criteria tables across all feature slides — the source of the capability
        and limitations tables below.

     IMPORTANT: source 2 is an internal deck. Its statuses are as of the deck's last update
     (27 July 2026) and describe build state, not a published commitment. Everything below is
     phrased as what Flows does or does not do today; roadmap language and internal priority
     ratings are deliberately not reproduced. Re-check every row before publishing. -->

# Reference

Look-up material for Flows. For procedures, see the [how-to guides](../how-to/index.md).

## Run statuses

Shown per task in the run log panel while a flow is running.

| Indicator | Meaning |
| :---- | :---- |
| Grey | Waiting to start |
| Spinning | Currently running |
| Green | Completed successfully |
| Red | Failed |

The Flows overview page shows a traffic-light status per flow rather than per task. Status
updates appear in real time.

## Pipeline stages

| Stage | What happens |
| :---- | :---- |
| Ingest | Pull in raw data from external sources |
| Clean | Remove noise, nulls, and duplicates |
| Transform | Reshape, map, and aggregate |
| Enrich | Join with reference data and context |
| Store | Persist to a TriplyDB dataset or data lake |
| Serve | Expose via API, query, or dashboard |

## Input data

| Source | Supported |
| :---- | :---- |
| RDF from a public URL | Yes |
| CSV | Yes |
| XML | Yes |
| Private infrastructure (files, databases) | Yes, through a connector |


## Variable types

| Type | Value visible after saving | Typical use |
| :---- | :---- | :---- |
| Parameterized | Yes | Dataset names, file URLs, environment-specific values |
| Masked | No | API keys, passwords, other credentials |

Masked values are also withheld from logs and error messages. Variables can be combined into
presets, and set per schedule. Multi-line values are not supported.

## Ways to trigger a run

| Method | Where |
| :---- | :---- |
| Manually | **Run now** on the flow canvas |
| On a schedule | The **Schedule** tab on the flow canvas |
| Over HTTP | Endpoint and authentication details are in the flow's settings |

## What a flow can do to a dataset

| Action | Supported |
| :---- | :---- |
| Write triples to a dataset | Yes |
| Create the output dataset if it does not exist | Yes |
| Change a dataset's access level | Yes |
| Start, stop or re-sync a service | Yes |
| Run SHACL validation and produce a report | Yes |



