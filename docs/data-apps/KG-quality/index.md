# TriplyDB Knowledge graph quality

## Overview

KG Quality is a TriplyDB add-on that runs a set of automated quality tests against a knowledge
graph and produces a report of the issues it finds. You point it at a SPARQL endpoint, choose one
of twelve available tests, and KG Quality checks the graph for that specific kind of problem —
from duplicate classes to poorly written definitions — and writes the results to an HTML and
Markdown report.

KG Quality is for knowledge engineers and data stewards responsible for the ongoing quality of a
knowledge graph or ontology, especially once it has grown too large to review by hand. It is
particularly useful after a bulk import, an extraction pass (such as with KG Builder), or before
publishing a graph for others to rely on.

**The problem it solves:** SHACL constraints are good at enforcing rules you can state explicitly
up front — a property must be present, a value must have a certain type. Many real quality
problems aren't like that. Two classes that mean the same thing but were named differently.
A subclass relationship that looks plausible but isn't actually correct. A definition that's
present but too circular to be useful. These are "soft" problems: real, but hard to express as a
formal constraint, and slow to find by reading through a large graph term by term. KG Quality
automates that first pass, checking the graph across five quality dimensions — Semantic Accuracy,
Completeness, Consistency, Conciseness, and Clarity and Understandability — using SPARQL queries,
embedding-based similarity, and, for the most nuanced checks, an LLM. The output is a report a
knowledge engineer can work through, not an automatic fix.

**Quality targets and confidentiality**: KG Quality is a diagnostic tool — every finding is a
flag to review, not a guaranteed error. It works against any SPARQL endpoint that is reachable
over HTTP(S), not only datasets hosted in TriplyDB.

KG Quality runs as a Flow within your TriplyDB instance, alongside tools like KG Builder and the
Editor, and complements SHACL validation rather than replacing it — SHACL enforces the rules you
can state explicitly, KG Quality surfaces the ones that are harder to express as formal
constraints. To get started, continue to Getting Started.

- [Getting started](../Getting-started/index.md)
- [Concepts](../Concepts/index.md)
- [How to](../How-to/index.md)
- [Reference](../Reference/index.md)
- [FAQ](../FAQ/index.md)

<!--
configure APIs
reference:
access levels
markdown support
-->