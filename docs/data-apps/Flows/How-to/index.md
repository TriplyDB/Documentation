[TOC]

<!-- SOURCES: no how-to prose exists in either source. The guides below are groupings of
     material drawn from:
     1. Drive, "Triply PM - Flows Documentation - markdown" — the "From here you can" list at
        the end of Section 2, and the procedural Q&A answers in Section 4;
     2. Drive, "Triply PM Flows - MVP, requirements, user stories, acceptance criteria" — the
        acceptance criteria that describe a user action rather than a system property.

     These eight replace an earlier list of twenty-six one-feature-per-guide entries. The
     grouping principle is one guide per job someone is trying to finish. Guides 1-4 follow the
     shape of a pipeline, so reading straight through gives the arc rather than an alphabetical
     pile.

     A ninth guide, "Connect your own systems" (connectors, private databases and file servers),
     is deliberately deferred. It has no prose in either source and needs developer input. -->

# How-to guides

Each guide covers one job you might want to finish with a flow, from the moment you know what you
want to achieve to the moment it is done.

This chapter is still being written. The table below is the plan, and names where the material
for each guide already exists.

## Building a pipeline

| Guide | What it will cover | Status | Existing material |
| :---- | :---- | :---- | :---- |
| **1. Structure a flow on the canvas** | Adding tasks and connecting them; changing execution order; running tasks in parallel or in series; branching with a conditional; recognising and fixing a misconfigured task; undoing a change and restoring an earlier revision | To write | FAQ, three answers; Concepts, Canvas and Conditional |
| **2. Load and transform source data into RDF** | Importing RDF from a public URL; reading CSV and XML; uploading a file; reshaping the result with a CONSTRUCT query, through to triples in a dataset | To write | Getting Started, Steps 3–4; Reference, Input data. No prose exists for CSV or XML |
| **3. Validate data with SHACL** | Adding a validation step between Transform and Store; reading the report; building a shared functions library so shapes are reused across projects | To write | Concepts, SHACL validation. No prose exists |
| **4. Publish results and refresh services** | Changing a dataset's access level from within the flow once validation passes, and re-syncing a service so it serves the data the run just produced | To write | Concepts, Services and Dataset access level |

## Operating a pipeline

| Guide | What it will cover | Status | Existing material |
| :---- | :---- | :---- | :---- |
| **5. Make a flow reusable with variables** | Defining parameterized variables and referencing them in task configurations; storing credentials as masked variables; saving presets; setting values per schedule | To write | FAQ, two answers; Concepts, three entries |
| **6. Schedule and trigger runs** | Setting a recurring schedule with its own variable values; triggering manually; triggering over HTTP from an external system | To write | FAQ, one answer; Concepts, Schedule and Flow run |
| **7. Monitor runs and notify people** | Reading the run log; investigating a failed run; stopping a run in progress; owner notifications on failure; emailing stakeholders; exposing last-run status on a public flow | To write | FAQ, four answers; Reference, Run statuses and Notifications |
| **8. Organise and share flows** | Tagging flows and putting them in groups; controlling who can view and trigger each one; transferring a flow to another account | To write | FAQ, two answers; Concepts, Tags and groups |

*More content will follow shortly.*

---

## ⚠ Needs input before publishing

- **Nothing here is written yet.** The table is a plan, not a chapter. Until the guides exist,
  the FAQ carries the load — several of its answers are how-to guides compressed into two
  sentences.
- **Write 2 and 3 first.** They are the only guides with no prose in either source, so their
  absence is what a reader will notice. Everything else can be expanded from an existing FAQ
  answer, which is much faster work.
- **Guide 2 is a merge and will be the longest.** Loading and transforming are separate features
  but one job — nobody loads a CSV and stops. If it grows past a comfortable length, the natural
  split is by source format rather than by stage.
- **Guide 4 documents a pattern, not a feature.** Access level and service re-sync are unrelated
  settings until you see them as the release step: validate, make visible, refresh the service.
  Confirm with the product team that this is the intended pattern before writing it up as one.
- **Connectors are missing on purpose.** Custom code, private databases and file servers were
  pulled out as a ninth guide and deferred. Neither source has prose on them and both mark them
  as implemented, so this needs developer input rather than editing. It is likely to be an early
  question from enterprise customers.
- **No support-driven content.** These groupings come from the product sources, not from real
  questions. Once Flows is in customers' hands, Zoho Desk tickets should reshape both the list
  and the order.