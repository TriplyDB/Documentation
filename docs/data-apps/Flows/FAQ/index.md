[TOC]

<!-- SOURCES:
     1. Drive, "Triply PM - Flows Documentation - markdown", Section 4 "Q&A" — reused
        near-verbatim, grouping unchanged.
     2. Drive, "Triply PM Flows - MVP, requirements..." — corrects the multi-line variables
        answer and adds four questions the acceptance criteria imply but the Q&A never asked. -->

# FAQ

## Getting started

**Do I need to know SPARQL to use Flows?**

No. Most task types are configured through forms rather than query languages. SPARQL is needed
only if you add a SPARQL CONSTRUCT or SPARQL SELECT task to your flow. Other transformation tasks
do not require it.

**Does my organisation need Flows to be enabled before I can use it?**

Yes. Flows must be enabled for your organisation. Contact your TriplyDB administrator or Triply
support if you cannot see Flows in the left-hand navigation panel.

**Which data formats can Flows read?**

Flows can import RDF from a public URL, and read CSV and XML. JSON and Excel are not supported
yet. For anything else, including relational databases and files on your own network, use a
[connector](../Concepts/index.md#connector). See [Input data](../Reference/index.md#input-data).


**Can I use Flows as a replacement for TriplyETL?**

Flows is Triply's strategic direction for pipeline work and is intended to replace TriplyETL for
new projects. If you are currently running TriplyETL pipelines, contact Triply to discuss your
migration path.

## Building flows

**How do I change the order in which tasks run?**

Delete the existing connection between two tasks by clicking it and pressing Delete, then draw a
new connection in the order you want. Rearranging the visual layout of cards does not affect
execution order — that is determined by the connections, not the positions.

**Can I run tasks in parallel?**

Yes. Connect one task to multiple downstream tasks to have them run in parallel. Connect multiple
tasks to a single downstream task to have it wait until all of them complete before starting.

**What happens if I make a mistake while editing a flow?**

You can undo recent changes using the undo function on the canvas. Flows are also versioned
automatically — if you need to go further back, open the revision history to view and restore
earlier versions.

**Can I copy a flow to another TriplyDB instance?**

Copying flows between TriplyDB instances is not yet fully supported. This is on the roadmap.

**Can I connect Flows to data sources inside my organisation's private network?**

Yes. Flows supports connecting to private infrastructure through
[connectors](../Concepts/index.md#connector).

## Variables and credentials

**How do I pass different input files or dataset names without editing the flow each time?**

Define a [parameterized variable](../Concepts/index.md#parameterized-variables) for the value that
changes, reference it in the relevant task configuration fields, and set the variable value per
run or per schedule. This keeps the flow definition stable while the inputs vary.

**Can other users in my organisation trigger a flow that uses sensitive credentials?**

Yes. Store credentials as [masked variables](../Concepts/index.md#masked-variables). Users with
execution rights can trigger flows that use them without seeing the underlying value, and the
value is not exposed in logs or error messages.


## Running and monitoring flows

**How do I trigger a flow without opening the canvas?**

You can trigger a flow via HTTP call. The endpoint and authentication details are documented in
the flow's settings. This allows flows to be triggered from external systems or scripts.

**How do I know if a flow has failed?**

The Flows overview page shows a traffic-light status for each flow, where red indicates a failed
run. The flow owner also receives an email notification when a run fails. Detailed error messages
are available in the run log panel on the canvas.

**Can I stop a flow that is currently running?**

Yes. Click **Abort** in the run log panel.

**Can I see who triggered each run?**

Yes. The run log records which user triggered each run, together with the start time and final
status.

## Output and access

**Where does the output of my flow go?**

Output tasks write to the TriplyDB datasets you specify in the Store task configuration. These
are ordinary TriplyDB datasets — they can be queried, published, and used as input to other flows
or add-ons.


**Can I show people when the data was last refreshed?**

Yes, if the flow is public — its last run time and status are then visible without giving access
to the flow itself. A flow can also email stakeholders, though only with fixed content. Updating
a dataset's description with the last run date is not supported yet.

**Who can see and trigger my flows?**

Access is controlled per flow. You can set which users or roles within your organisation can view
or trigger each flow.

**Can a flow be transferred to a different account?**

Yes. Flow ownership can be transferred to a different account if needed.

**Chapter navigation:**

[Overview](../Index.md) 

[Getting Started](../Getting-started/index.md) 

[Concepts](../Concepts/index.md) 

[Reference](../Reference/index.md) 

[FAQ](../FAQ/index.md)


