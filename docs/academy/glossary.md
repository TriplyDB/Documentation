[TOC]

<!-- SOURCE: no single source. Every entry is drawn from how the term is used in the
     Academy pages it links to, and from the Concepts chapters of TriplyDB, Saved queries,
     Flows, the Editor and Data stories.

     Scope rule: this glossary holds the standards and the linked-data vocabulary, which are
     product-neutral. Terms that only mean something inside a Triply product — dataset,
     service, asset, flow, story, saved query — belong in that product's Concepts chapter,
     not here. Where the same word means both (graph, instance), the general sense is given
     here with a pointer.

     Ten pages link here: three data-app Concepts chapters and seven Academy pages. -->

# Glossary

Terms used across the Academy and the product documentation. Each entry gives the short
answer; the links go to the Academy page that explains the idea properly.

## Data and its shape

**RDF** — Resource Description Framework, the W3C standard for representing data as a graph
of statements rather than as tables. It is a data model, not a file format. See
[Linked data](linked-data.md).

**Triple** — one statement, made of a subject, a predicate and an object: *this thing* has
*this relation* to *that*. The smallest unit of RDF. See
[Every fact is a triple](linked-data.md#every-fact-is-a-triple).

**Statement** — another word for a triple. Used in TriplyDB where a count is involved
("statement count").

**Quad** — a triple plus the graph it belongs to, so four terms instead of three.

**IRI** — Internationalized Resource Identifier, a globally unique name for a thing, shaped
like a URL. IRIs are what make it possible to say something about the same thing across
datasets. See [Three kinds of term](linked-data.md#three-kinds-of-term).

**Literal** — a value rather than a thing: a number, a date, a piece of text. Literals can
only appear as the object of a triple.

**Blank node** — a term that names something without giving it an IRI, used for structure
that has no identity of its own.

**Namespace and prefix** — a namespace is the shared beginning of a set of IRIs; a prefix is
a short alias for it, so `skos:Concept` stands for the full IRI. See
[Namespaces and prefixes](linked-data.md#namespaces-and-prefixes).

**Graph** — a named set of statements. Data is split into graphs so parts of it can be
loaded, replaced or queried independently. See
[Graphs group statements](linked-data.md#graphs-group-statements). In TriplyDB a graph lives
inside a dataset — see [TriplyDB concepts](../triplydb/Concepts/Index.md).

**Named graph** — a graph identified by an IRI, so a query can ask about it specifically.

**Knowledge graph** — a graph that holds both the data and the model describing it, built to
be connected to other data rather than to stand alone. See
[Knowledge graphs](knowledge-graph.md).

**Linked data** — data published as RDF with resolvable IRIs, so following an identifier
leads to more information about the thing it names. See [Linked data](linked-data.md).

**Serialisation** — a file format for writing RDF down. Turtle, TriG, N-Triples, N-Quads,
JSON-LD and RDF/XML all express the same model. See
[Supported file formats](../triplydb/Reference/file-formats.md).

## Querying

**SPARQL** — the W3C query language for RDF. See [SPARQL: the basics](sparql.md).

**Triple pattern** — a triple with variables in one or more positions. Matching patterns
against the data is how SPARQL selects things. See
[Triple patterns and variables](sparql.md#triple-patterns-and-variables).

**SELECT query** — returns a table of values, one row per match.

**CONSTRUCT query** — returns RDF rather than a table, building new triples from what it
matched. Used for transforming data as well as reading it.

**Endpoint** — the address a SPARQL query is sent to.

**Federation** — running one query across more than one endpoint. See
[SPARQL: construct and federation](sparql-construct-and-federation.md).

**GraphQL** — a query language originally from application development. In TriplyDB the
schema is generated from your SHACL shapes. See
[GraphQL](../triplydb/Reference/graphQL.md).

## Models and validation

**Ontology** — a formal description of the kinds of things in a domain and how they relate.
See [OWL and ontologies](owl-ontologies.md).

**Class and instance** — a class is a category, an instance is one member of it. See
[What an ontology is](owl-ontologies.md#what-an-ontology-is).

**Property** — the predicate part of a triple, seen as part of a model: the kind of relation
that may hold between things.

**OWL** — the Web Ontology Language, for stating what is true of a domain so that new facts
can be inferred. See [What OWL adds](owl-ontologies.md#what-owl-adds).

**Inference** — deriving statements that are not written down, from what is. See
[Inference or property paths?](owl-ontologies.md#inference-or-property-paths)

**SHACL** — the Shapes Constraint Language, for stating what data *must* look like and
checking it. Where OWL describes the world, SHACL describes the file. See
[SHACL](shacl.md) and [SHACL and OWL](shacl.md#shacl-and-owl).

**Shape** — one SHACL description: which properties instances of a class must or may have,
and with what values.

**Shapes graph** — the graph holding a dataset's shapes. The Editor generates its forms from
it.

**Violation** — a place where the data does not satisfy a shape, reported by validation. See
[What a violation looks like](shacl.md#what-a-violation-looks-like).

**Validation report** — the result of validating, itself RDF, so it can be queried. See
[The report is data too](shacl.md#the-report-is-data-too).

## Vocabularies

**SKOS** — Simple Knowledge Organization System, for thesauri, taxonomies and controlled
vocabularies. See [SKOS](skos.md).

**Concept** — one entry in a SKOS vocabulary: a term or category, not a class. See
[Concepts, not classes](skos.md#concepts-not-classes).

**Concept scheme** — a collection of SKOS concepts that belong together. See
[Schemes hold concepts](skos.md#schemes-hold-concepts).

**Broader and narrower** — the SKOS relations building a hierarchy of concepts. See
[The direction that trips everyone up](skos.md#the-direction-that-trips-everyone-up).

**Deprecated term** — a class, property or concept marked as no longer to be used, without
being removed. See [Retiring a concept](skos.md#retiring-a-concept).

---

**In the Academy:** [Home](index.md) · [Linked data](linked-data.md) ·
[Knowledge graphs](knowledge-graph.md) · [SPARQL](sparql.md) ·
[OWL and ontologies](owl-ontologies.md) · [SHACL](shacl.md) · [SKOS](skos.md)

