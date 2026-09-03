[TOC]

<!-- SOURCES:
     1. Drive, "Triply PM - Flows Documentation - markdown", Section 2 "Getting Started" —
        reused near-verbatim. Internal anchors repointed to the concepts chapter; the TriplyDB
        Getting Started link was an absolute triply.cc URL and is now relative.
     2. Drive, "Triply PM Flows - MVP, requirements..." — the "Triply sales" slide confirms
        Flows can be switched on and off per customer, which settles the open question about
        the prerequisite in Step 1. -->

# Getting Started

By the end of this page you will have created a working flow that ingests a data file,
transforms it with a SPARQL CONSTRUCT query, and stores the result in a TriplyDB dataset.

To use Flows, you need an active TriplyDB account with access to an organisation that has Flows
enabled. Flows is switched on per organisation, so if you cannot see it, it has not been enabled
for yours yet — contact your TriplyDB administrator or Triply support. If you have no TriplyDB
account at all, see the
[TriplyDB Getting Started guide](../../../triplydb/getting-started/index.md).

Some task types are visible only to administrators, so the catalogue you see may be smaller than
the one a colleague sees.

## Step 1 — Open Flows

1. Log in to your TriplyDB environment.
2. Navigate to your organisation using the organisation switcher at the top of the screen.
3. Click **Flows** in the left-hand navigation panel.

The Flows overview page opens. It lists all existing flows in your organisation, together with
their current status.

## Step 2 — Create a new flow

1. Click **New flow** in the top-right corner.
2. Enter a name for your flow. Use a name that reflects what the flow does — for example,
   `products-csv-to-rdf`.
3. Click **Create**.

The visual canvas opens. The canvas is empty. The task catalogue is available in the panel on the
left.

## Step 3 — Add an Ingest task

1. In the task catalogue, find the **Load from URL** task. You can use the search bar at the top
   of the catalogue to locate it quickly.
2. Drag the task onto the canvas.
3. Click the task card to open its configuration panel on the right.
4. Enter the URL of your source file in the **URL** field.
5. Click **Save**.

The task card updates to show no configuration errors.

## Step 4 — Add a Transform task

1. In the task catalogue, find the **SPARQL CONSTRUCT** task.
2. Drag it onto the canvas, below the Ingest task.
3. Draw a connection from the Ingest task to the Transform task: click the bottom edge of the
   Ingest card and drag to the top edge of the Transform card. An arrow appears between the two
   tasks.
4. Click the Transform task card to open its configuration panel.
5. Paste your SPARQL CONSTRUCT query into the **Query** field.
6. Click **Save**.

The canvas now shows two connected tasks.

## Step 5 — Add a Store task

1. In the task catalogue, find the **Store to TriplyDB dataset** task.
2. Drag it onto the canvas, below the Transform task.
3. Connect the Transform task to the Store task in the same way as Step 4.
4. Click the Store task card to open its configuration panel.
5. In the **Dataset name** field, enter the name of the output dataset you want to write to. If
   the dataset does not exist yet, Flows will create it.
6. Click **Save**.

Your canvas now shows a three-task pipeline: Ingest → Transform → Store.

## Step 6 — Run the flow

1. Click **Run now** in the top-right corner of the canvas.

The run log panel opens on the right. Each task shows its status in real time:

- **Grey** — waiting to start
- **Spinning** — currently running
- **Green** — completed successfully
- **Red** — failed

2. Wait for all three tasks to turn green.
3. When the run is complete, navigate to the output dataset by clicking the dataset name in the
   Store task's log entry.

The dataset now contains the triples produced by your CONSTRUCT query.

## What you now have

You have created a flow with three connected tasks, run it manually, and verified that the output
reached your TriplyDB dataset. This is the core pattern all flows follow — add tasks, connect
them, configure them, run.

From here you can:

- **Add variables** to make the flow reusable across environments or datasets — see
  [parameterized variables](../concepts/index.md#parameterized-variables).
- **Store credentials securely** using masked variables, so other team members can trigger the
  flow without seeing sensitive values — see [masked variables](../concepts/index.md#masked-variables).
- **Add a SHACL validation step** between Transform and Store to catch data quality issues before
  they reach your production dataset — see
  [SHACL validation](../concepts/index.md#shacl-validation).
- **Set a schedule** so the flow runs automatically at a fixed interval — open the **Schedule**
  tab on the flow canvas. Schedules can carry their own variable values.
- **Validate before production** by changing a dataset's access level from within the flow, so
  data only becomes visible once it has passed its checks.
- **Monitor all flows** in your organisation from the Flows overview page — see
  [the management overview](../concepts/index.md#the-management-overview).

**Chapter navigation:**

[Overview](../Index.md) 

[Getting Started](../Getting-started/index.md) 

[Concepts](../Concepts/index.md) 

[Reference](../Reference/index.md) 

[FAQ](../FAQ/index.md)


