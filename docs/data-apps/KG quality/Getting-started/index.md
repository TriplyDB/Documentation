# TriplyDB knowledge graph quality 
## Getting Started

> To use this add-on, you need an active TriplyDB instance. If you don't have one yet, see the [TriplyDB Getting Started guide](#).

By the end of this section you will have run a quality test against a SPARQL endpoint and downloaded the resulting report.

**Step 1.** Log in to your TriplyDB instance and navigate to your account.

**Step 2.** Select **Flows** in the top navigation, then open **KG_Quality_App**.

**Step 3.** Click **Run** in the top-right corner. An input form appears.

**Step 4.** Fill in all fields — every field is required:

| Field | What to enter |
|---|---|
| **SPARQL Endpoint** | The full URL of the SPARQL endpoint where your ontology or linked data is stored. Make sure the endpoint is accessible. |
| **Quality test to run** | Select one test from the list. See Section 5 — Available Quality Tests for a description of each test. |
| **Quality report account** | Your TriplyDB account name where the report will be stored. |
| **Quality report dataset** | The name of an existing dataset in that account where the report will be saved. The dataset must already exist. |
| **Quality report name** | A name for this report. If a report with the same name already exists in the same dataset and account, it will be overwritten. |

**Step 5.** Click **Run**. The app starts executing. Depending on the test selected and the size of your data, this can take from a few minutes to several hours.

**Step 6.** When the run completes successfully, a green tick appears in the status box.

**Step 7.** Go to the dataset you specified and open the **Assets** page. The report is available in two formats: HTML and Markdown. Download and open either format to review the results.

You now have your first KG Quality report. For guidance on what to do with specific findings, see our FAQ. For a full description of all available tests, see Available Quality Tests in the How to section.


- [Overview](./index.md)
- [Concepts](./concepts/index.md)
- [How to](./how-to/index.md)
- [Reference](./reference/index.md)
- [FAQ](./faq/index.md)