# TriplyDB knowledge graph quality

## Available quality tests

### T001 — Duplicate classes

**Dimension:** Conciseness
**Technique:** Semantic similarity based on embeddings

Detects classes whose names and labels are semantically similar enough to suggest they model the same or a nearly identical concept. Duplicate or highly similar classes reduce clarity, fragment knowledge, and make querying and maintenance harder.

**Output:** One row per flagged pair: `class_a`, `label_a`, `class_b`, `label_b`, `similarity`.

---

### T002 — Duplicate properties

**Dimension:** Conciseness
**Technique:** Semantic similarity based on embeddings

Detects properties whose names and labels are semantically similar enough to suggest they model the same or a nearly identical relationship. Duplicate properties make data harder to query and integrate, and increase the risk of inconsistent modeling.

**Output:** One row per flagged pair: `property_a`, `label_a`, `property_b`, `label_b`, `similarity`.

---

### T003 — Duplicate instances

**Dimension:** Conciseness
**Technique:** Semantic similarity based on embeddings
**Additional input:** `classes_list` — the classes whose instances should be compared.

Finds instances whose names and labels are highly similar within the given classes, flagging likely duplicate entities. Duplicate instances fragment information, distort counts and analytics, and reduce trust in the graph.

**Output:** One row per flagged pair: `class`, `instance_a`, `label_a`, `instance_b`, `label_b`, `similarity`.

---

### T004 — Highly dissimilar synonyms

**Dimension:** Semantic Accuracy
**Technique:** Semantic similarity based on embeddings
**Additional input:** `classes_list` — the classes whose instance labels should be evaluated.

Finds instance labels that are declared as synonyms but whose semantic similarity is low, suggesting the synonym assignment is incorrect. Incorrect synonyms reduce search precision, introduce ambiguity, and can lead to wrong matches in downstream applications.

**Output:** One row per flagged pair: `instance`, `label_a`, `label_b`, `similarity_score`.

---

### T005 — Truncated or expanded synonyms

**Dimension:** Semantic Accuracy
**Technique:** Syntactic (token-based) comparison
**Additional input:** `classes_list` — the classes whose instance labels should be evaluated.

Finds instance label pairs where one label is a truncated, partial, or expanded form of the other (e.g. "Engineer" vs "Data Engineer") rather than a true synonym. Incorrect synonyms create ambiguity and may lead to wrong matches in downstream applications.

**Output:** One row per flagged pair: `instance`, `label_a`, `label_b`.

---

### T006 — Mixed datatype property values

**Dimension:** Consistency
**Technique:** SPARQL query

Detects datatype properties used with values of more than one datatype across the dataset. Mixed datatypes make querying, validation, and integration difficult, and may lead to incorrect results or runtime errors.

**Output:** One row per offending property: `property`, `datatypes`, `count_per_datatype`.

---

### T007 — Invalid or meaningless literal values

**Dimension:** Semantic Accuracy
**Technique:** SPARQL query

Detects datatype property values that appear invalid or non-informative, such as stray symbols, whitespace, or placeholder strings. Invalid values reduce data reliability and negatively affect analytics, search, and integration.

**Output:** One row per suspect value: `subject`, `property`, `value`, `reason`.

---

### T008 — Non-dereferenceable URIs

**Dimension:** Accessibility

Identifies class or property URIs that cannot be dereferenced over HTTP(S). Non-dereferenceable URIs break Linked Data principles and hinder interoperability.

**Output:** One row per non-dereferenceable URI: `uri`, `term_kind`, `http_status_or_error`.

---

### T009 — Classes without definitions

**Dimension:** Understandability
**Technique:** SPARQL query

Finds classes that lack a human-readable definition (e.g. `skos:definition`, `rdfs:comment`, `dcterms:description`). Without clear definitions, users may interpret classes inconsistently, leading to incorrect modeling and reduced interoperability.

**Output:** One row per undefined class: `class`, `label`.

---

### T010 — Properties without definitions

**Dimension:** Understandability
**Technique:** SPARQL query

Finds properties that lack a human-readable definition (e.g. `skos:definition`, `rdfs:comment`, `dcterms:description`). Without clear definitions, users may interpret properties inconsistently, leading to incorrect modeling and reduced interoperability.

**Output:** One row per undefined property: `property`, `label`.

---

### T011 — Invalid subclass relationships

**Dimension:** Semantic Accuracy
**Technique:** LLM

Uses an LLM to flag declared subclass relationships that appear semantically incorrect — for example, where the subclass is not a true subtype of the superclass, or where not every instance of the subclass is necessarily an instance of the superclass. Incorrect subclass relationships distort the ontology hierarchy, cause wrong inferences, and can negatively affect validation, search, and data integration.

**Output:** One row per flagged relationship: `subclass`, `superclass`, `verdict`, `explanation`.

*Note: Runtime and cost are governed by model provider rate limits and pricing rather than graph size.*

---

### T012 — Low-quality class definitions

**Dimension:** Understandability
**Technique:** LLM

For each class that carries a definition, gathers its definition text (from `skos:definition`, `rdfs:comment`, and `skos:example`) and uses an LLM to assess it against five criteria: non-circularity, abstract-vs-concrete clarity, instance description with examples, membership criteria, and identity criteria. A weak definition gives a false sense of documentation while still leaving a class's meaning open to interpretation. This test complements T009, which only checks whether a definition is present.

**Output:** One row per evaluated class: `class`, `definition`, and an `evaluation` object with scores for `non_circularity`, `abstract_vs_concrete`, `instance_description`, `membership_criteria`, and `identity_criteria` — each with a `severity`, an `analysis`, and a `suggestion`.

*Note: Runtime and cost are governed by model provider rate limits and pricing rather than graph size.*

**Next:** [Concepts](../Concepts/index.md) 
**Back:**[Back to overview](../index.md)
