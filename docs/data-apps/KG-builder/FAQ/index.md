# TriplyDB knowledge graph builder 

## FAQ

### Running KG Builder

**What file formats does KG Builder accept as input?**
KG Builder accepts `.txt`, `.rtf`, and `.doc` files. Upload your file(s) to a TriplyDB dataset as Assets first, then provide the Asset path(s) in the input field. You can provide multiple documents in a single run.

**Can I provide context to improve extraction quality?**
Yes — and this is recommended for domain-specific or complex texts. You can provide: (1) **existing ontologies** relevant to the domain, which help the LLM align its terminology and structure with what you already use; and (2) **additional context or instructions**, such as competency questions the ontology should answer, modelling preferences, or scope constraints. Both inputs are optional.

**What languages can I use?**
Input documents in both Dutch and English are supported.

**How does the cost estimate work?**
Before the LLM pipeline runs, KG Builder calculates an estimate of the expected execution time and cost based on the size and number of input documents. This estimate is shown to you before you confirm the run. You can also set a maximum cost ceiling; if the estimate exceeds your ceiling, the run is cancelled automatically.

**Is my data kept confidential?**
Yes. KG Builder uses a Triply-provided LLM that runs in a confidential environment. Your input documents are not sent to a public LLM and are not used for model training.

**How long does a run take?**
It depends on the size and number of input documents. The pre-run estimate includes an expected execution time. Larger documents with more concepts will take more time.

**Can I use my own LLM instead of the Triply-provided one?**
Not yet. The ability to bring your own LLM is on the roadmap. For now, only the default Triply-provided LLM is available.

**The run failed. What should I check?**
Check the following: (1) the input file format is `.txt`, `.rtf`, or `.doc`; (2) the Asset path is correct and the file is in a dataset you have access to; (3) the output dataset exists in your TriplyDB account; (4) the estimated cost did not exceed your ceiling. If the problem persists, review the run log in the run detail view for error messages.

### Understanding the output

**What does the extracted ontology contain?**
The output consists of **classes**, **properties**, and **simple constraints** (expressed as SHACL shapes), stored as RDF triples in the output dataset graph you specified. The classes and properties reflect the entity types and relationships found in the source text.

**How accurate is the extraction?**
With the default Triply-provided LLM, KG Builder targets **recall ≥ 80%** (most relevant concepts are captured) and **precision ≥ 60%** (most extracted elements are correct). These are targets, not guarantees — results vary with text quality and domain complexity. Review by a knowledge engineer is always recommended before using the output in production.

**Where do I view and edit the extracted ontology?**
Navigate to the output dataset in TriplyDB and open the **Data Model Editor**. This shows the extracted classes, properties, and constraints in a structured editing interface where you can review, correct, and extend the output.

**Can I also query the output with SPARQL?**
Yes. The output is stored as standard RDF in a named graph. Navigate to the output dataset and use the **SPARQL** tab to run queries. The prefix alias you configured is available as a namespace shortcut.

**The extracted ontology looks incomplete or incorrect. How can I improve it?**
Re-run with additional context: provide the **existing ontologies** most relevant to the domain, or add **modelling instructions** that guide the LLM toward the structure you expect. You can also post-process the output directly in the Data Model Editor or via SPARQL UPDATE queries.

**Can I run KG Builder multiple times against the same dataset?**
Yes. Each run writes to the specified output graph. New triples are added to any triples already present. To start fresh, clear or delete the output graph before running.

### Integration with the Triply ecosystem

**How does KG Builder relate to other TriplyDB tools?**
The ontology KG Builder produces is stored as a standard TriplyDB graph. You can immediately open it in the **Data Model Editor** to refine it, validate it with the **KG Quality** add-on, visualise it with the schema viewer, query it with SPARQL, and use it as input for further ETL pipelines in TriplyETL.

**Does KG Builder replace manual knowledge modelling?**
No. KG Builder automates a time-consuming first pass — extracting candidate classes, properties, and constraints — but the result should be reviewed and refined by a knowledge engineer. Think of it as a starting point, not a finished ontology.

**Previous:** [Concepts](../Concepts/index.md) 
**Back:**[Back to overview](../index.md)