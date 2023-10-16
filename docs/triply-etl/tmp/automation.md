---
title: "TriplyETL: Automation"
path: "/docs/triply-etl/automation"
---

[TOC]

TriplyETL runs within a Gitlab CI environment ([Figure 1](#figure-1)).

<figure id="figure-1">
  <img src="repository.png">
  <figcaption>Figure 1: The landing page of a TriplyETL project in Gitlab.</figcaption>
</figure>



## Special key: `$environment`

The special key `$environment` denotes the DTAP environment in which the TriplyETL pipeline is running.  This allows special actions to be performed based on whether the pipeline runs in `"Debug"`, `"Test"`, `"Acceptance"`, or `"Production"` mode.

See the [DTAP documentation](/triply-etl/dtap) for more information.
