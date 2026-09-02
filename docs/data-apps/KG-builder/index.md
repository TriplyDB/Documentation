# KG Builder

## Introduction

KG Builder is a TriplyDB add-on that extracts a structured ontology from unstructured text. You provide one or more text documents — and optionally existing ontologies or additional modelling instructions — and KG Builder uses a confidential LLM pipeline to extract classes, properties, and simple constraints, storing the result as RDF in a TriplyDB dataset. The extracted ontology is immediately viewable and editable in the TriplyDB Data Model Editor.

KG Builder is for knowledge engineers and data modelers who need to turn textual sources into machine-interpretable ontologies quickly. It is particularly suited to projects where:

- The source text is a document, regulation, or other structured text that can be provided as a `.txt`, `.rtf`, or `.doc` file.
- You have domain knowledge to encode — existing ontologies or modelling preferences you want the extraction to respect.
- The output needs to be stored, refined, and queried as a knowledge graph in TriplyDB.

The problem it solves: manually extracting structured knowledge from textual sources is time-consuming and error-prone. Legal articles, technical specifications, and domain documents use dense, implicit structure that requires expert interpretation to turn into semantically correct RDF. KG Builder automates the first pass — extracting candidate classes, properties, and constraints — so knowledge engineers can focus on review and refinement rather than blank-page modelling.

**Data confidentiality**: your input data is processed using a Triply-provided LLM that operates in a confidential environment. Your data is not sent to a public LLM and is not used for model training.

**Language support**: input documents in both Dutch and English are supported.

**Quality targets**: with the default Triply-provided LLM, the extraction process targets recall ≥ 80% and precision ≥ 60%. This means the extracted ontology is a useful starting point, but review by a knowledge engineer is expected.

KG Builder runs as a Flow within your TriplyDB instance. To get started, continue to Getting Started.

**Chapter navigation:** 
[Getting Started](../Getting-started/index.md) · [Concepts](../Concepts/index.md) ·
[How-to guides](../How-to/index.md) · [Reference](../Reference/index.md) · [FAQ](../FAQ/index.md)

