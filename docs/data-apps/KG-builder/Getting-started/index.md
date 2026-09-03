# TriplyDB Knowledge graph builder 

## Getting Started

> To use this add-on, you need an active TriplyDB account with the KG Builder flow enabled. If you don't have one yet, see the [TriplyDB Getting Started guide](#).

By the end of this section you will have run KG Builder against a text document and verified that the extracted ontology appears in the TriplyDB Data Model Editor.

**Step 1.** Log in to your TriplyDB account. From your profile page, click the **Flows** tab in the top navigation. You will see the `KG_builder` flow listed there.

*Figure 1: Flows overview page showing the KG_builder flow.*

**Step 2.** Click on **KG_builder** to open it. You will land on the Flow builder view, which shows the pipeline steps on a canvas on the right and the variables panel on the left.


*Figure 2: Flow builder showing the KG Builder task, the Variables tab, and the configured output dataset destination.*

The flow also shows the output TriplyDB dataset destination on the canvas. The node beneath the KG Builder task shows the target dataset and graph where the extracted ontology will be written — for example, `/graphs/schema`. You can configure this by clicking that node in the flow builder before running.

*Figure 3: The Output dataset dialog — fill in all fields before clicking Update.*

**Step 3.** Click the **RUN** button in the top-right corner of the flow builder. A **Run flow** dialog appears, prompting you to fill in the input variables for this run.

*Figure 4: The Run flow dialog with input variables — fill in required fields before clicking Run.*

Before the extraction begins, the system displays an **estimated execution time and cost** based on your inputs. Review this estimate before confirming. You can also set a **maximum cost ceiling** to prevent the run from exceeding a budget you define.

Fill in the fields as follows:

| Field | Required | What to enter |
|---|---|---|
| **Input document(s)** | Yes | One or more text documents to extract from. Accepted formats: `.txt`, `.rtf`, `.doc`. Upload the file(s) to TriplyDB Assets first, then provide the Asset path(s) here. |
| **Existing ontologies** | No | One or more existing ontologies you consider relevant to the domain. Providing these helps the LLM align its extraction with terminology and structures you already use. |
| **Additional context / instructions** | No | Free-text instructions for the extraction — for example, competency questions the ontology should answer, modelling preferences (e.g. "prefer OWL classes over SKOS concepts"), or scope constraints. |
| **Output dataset** | Yes | The TriplyDB dataset in which the extracted ontology should be stored. |
| **Maximum cost ceiling** | No | A limit above which the run will not proceed. If the estimated cost exceeds this value, the run is cancelled before any LLM calls are made. |
| **Prefix alias** | Yes | A short, lowercase abbreviation used as the namespace prefix for the generated URIs — for example: `wtp`. |
| **Prefix namespace** | No | The base namespace URI for the generated entities and properties. If left blank, the default `https://example.org/def/` is used. |
| **Shapes namespace** | No | The namespace URI for the generated SHACL shapes. If left blank, the default `https://example.org/shapes/` is used. |

When all required fields are filled and you have reviewed the cost estimate, click **RUN**.

**Step 4.** After clicking Run, you are taken to the run detail view. The run starts in a **Pending** state and transitions to **Running** as the pipeline processes.

*Figure 5: The run detail view showing the Pending and Running states.*

**Step 5.** Wait for the run to complete. Completion time depends on the size and complexity of the input documents. When the run succeeds, the status changes to **Done**.

*Figure 6: The run detail view showing the Done state.*

**Step 6.** Navigate to the TriplyDB dataset you specified as the output destination. Open the **Data Model Editor** tab to view and edit the extracted ontology — classes, properties, and constraints are presented in a structured editing interface.

*Figure 7: The TriplyDB Data Model Editor showing the extracted ontology.*

You now have a draft ontology extracted from your source text. For guidance on improving results, understanding the output, and integrating with other Triply tools, see the section How-to.

**Next:** [Concepts](../Concepts/index.md) 
**Back:**[Back to overview](../index.md)

<!--
configure APIs
reference:
access levels
markdown support
-->