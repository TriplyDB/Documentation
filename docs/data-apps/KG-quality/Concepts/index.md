# TriplyDB knowledge graph quality 
## Key Concepts

**Assessment**
A single run of KG Quality against a SPARQL endpoint using a selected quality test. Each assessment produces one report.

**Completeness**
A quality dimension that checks whether the data that should be present is actually there — for example, whether all expected properties or values exist.

**Conciseness**
A quality dimension that checks whether the graph is free of duplication and redundancy — for example, duplicate classes, properties, or instances.

**Consistency**
A quality dimension that checks whether the graph avoids contradicting itself or its schema — for example, properties used with mixed datatypes.

**Dimension**
One of the five quality categories that KG Quality uses to organize its tests: Semantic Accuracy, Completeness, Consistency, Conciseness, and Clarity and Understandability. Each test belongs to one dimension.

**Embeddings**
A technique for representing text (such as a label or term name) as a numeric vector, so that semantic similarity between two strings can be measured mathematically. Used by tests T001–T005.

**KG_Quality_App**
The name of the pre-configured flow in TriplyDB that exposes the KG Quality tool. Access it via **Flows** in your TriplyDB account.

**LLM (Large Language Model)**
An AI model used by certain tests (T011, T012) to assess aspects of the graph that cannot be checked by SPARQL queries or embeddings alone — such as whether a subclass relationship is semantically valid or whether a class definition is well-formed.

**Quality report**
The structured output produced by a KG Quality assessment. Available as an HTML file and a Markdown file, saved to a TriplyDB dataset. Contains one section per test result, listing flagged items and explanations.

**Quality test**
A single check that KG Quality can run against a graph. Each test targets one quality dimension, uses a specific technique (SPARQL, embeddings, or LLM), and produces a table of flagged items. See Section 5 for the full catalog.

**Semantic accuracy**
A quality dimension that checks whether values, labels, and relationships correctly reflect reality — for example, incorrect synonyms or invalid subclass relationships.

**SHACL**
A W3C standard for defining and enforcing constraints on RDF graphs. KG Quality complements SHACL: SHACL enforces the rules you can state explicitly up front, while KG Quality surfaces softer quality problems that are harder to express as formal constraints.

**Similarity score**
A numeric value (typically 0–1) produced by embedding-based tests, indicating how semantically similar two terms or labels are. Higher scores indicate greater similarity. Tests use a threshold to decide which pairs to flag.

**SPARQL endpoint**
A URL that accepts SPARQL queries and returns results over HTTP(S). KG Quality connects to any standard SPARQL endpoint — including graphs hosted in TriplyDB.

**Understandability**
See *Clarity and understandability*.

Continue to
- [Getting started](./getting-started/index.md)
- [How to](./how-to/index.md)
- [Reference](./reference/index.md)
- [FAQ](./faq/index.md)
- [Overview](./index.md)
