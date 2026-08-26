[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->  text recycled from an existing page, path given
     <!- - NEW: x - ->     written for this page, with the reason
     <!- - LINK-TODO - ->  link points at a current path that will move in the restructure
-->

# Linked data

Linked data is a way of publishing information so that systems that have never
been connected before can read it and combine it. Instead of tables with fixed
columns, linked data records every fact as a small, self-contained statement.
This page explains what those statements look like, how they are named, and why
you would choose this over a conventional database.

<!-- NEW: one-paragraph scope statement. The six-chapter template opens every page
     by saying what the reader will get; the Academy should not be an exception. -->

## Every fact is a triple

<!-- SOURCE: triply-etl/assert/index.md — definition of triple, quad, and the four term positions -->

A **triple** is the smallest possible statement about the world. It has three
parts: a **subject**, a **predicate**, and an **object**.

- *Pikachu* — *knows* — *Mew*
- *Pikachu* — *weight* — *60*

The subject is what the statement is about. The predicate is the property being
stated. The object is the value. Nothing else is needed, and nothing else is
allowed.

A **quad** adds a fourth part: the **graph** the statement belongs to. Graphs let
you keep track of where a statement came from, so you can update or remove one
source without touching the rest.

Written in Turtle, one of the standard text formats for linked data, the two
statements above look like this:

```turtle
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix id:   <https://triplydb.com/academy/pokemon/id/pokemon/>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

id:pikachu
  foaf:knows id:mew;
  vocab:weight 60.
```

<!-- SOURCE: Triply Academy teaching material (presentations.triply.cc, Kadaster knowledge
     transfer deck) — same prefixes and the same Pokémon example Triply already teaches with.
     Kept deliberately, so the Academy text matches the training sessions. -->

Because every fact stands on its own, adding a new kind of fact means adding a
new predicate. It does not mean changing a schema.

## Three kinds of term

<!-- SOURCE: triply-etl/assert/ratt/terms.md (IRIs and literals), triply-etl/generic/skolem-iris.md (blank nodes) -->

Each position in a triple holds a term, and there are three kinds.

**IRIs** identify things. An IRI (Internationalized Resource Identifier) is a web
address that names a resource: a product, a person, a concept, a relationship.
Subjects are IRIs. Predicates are always IRIs. Objects can be IRIs. Because IRIs
are globally unique, two organisations that use the same IRI are provably talking
about the same thing.

**Literals** hold values: text, numbers, dates. A literal carries a **datatype**
that says how to read it — `xsd:integer`, `xsd:date`, `xsd:string`. A text
literal can instead carry a **language tag**, so `"ピカチュウ"@ja` and
`"Pikachu"@en` are two labels for one resource rather than two conflicting
values. Literals only ever appear in the object position.

**Blank nodes** stand for something that exists but has no name yet — an address
that is only meaningful as part of a person's record, for example. Blank nodes
are convenient while modelling, but they cannot be linked to from outside the
dataset. Give anything you expect others to refer to a real IRI.

## Namespaces and prefixes

<!-- SOURCE: triply-etl/generic/declarations.md — the four benefits of declarations,
     condensed. The ETL page explains this as a TypeScript feature; here it is
     explained as a property of linked data itself. -->

Full IRIs are long. In practice you declare a **namespace** once and abbreviate
it with a **prefix**, so
`<http://xmlns.com/foaf/0.1/knows>` becomes `foaf:knows`. This is shorthand only:
the two are the same IRI.

Prefixes matter more than they look. They make data readable, they keep
namespace changes to a single line, and they are what turns a wall of IRIs into
something a domain expert can review.

<!-- NEW: last sentence. The ETL page lists readability, modularity, maintenance and
     editor support as benefits for developers; the reviewability point is the one
     that matters for the Academy audience. Check whether you agree. -->

## Graphs group statements

<!-- SOURCE: triply-db-getting-started/viewing-data/index.md — the linked data Table
     and its fourth column -->

A dataset is a collection of triples. Within a dataset, **named graphs** group
statements that belong together — one graph per source file, per import run, or
per data model. In TriplyDB you can see this directly: the linked data table
shows the subject, predicate and object of every triple, and a fourth column for
the graph it belongs to.

![The linked data table in TriplyDB, showing subject, predicate, object and graph columns](../assets/linked-data-table.png)

The same data can also be read one resource at a time. The linked data browser
shows a single node with its properties, and you follow a property to move to the
next node.

![The linked data browser in TriplyDB](../assets/ld-browser.png)

<!-- NEW: image candidate. docs/assets/MonaLisaGraph.png exists in the repository but is
     not referenced by any page. If it shows a triple graph, it belongs here as the
     opening illustration. Please look at it — I cannot, the assets are Git LFS pointers. -->

## Why not a relational database?

<!-- SOURCE: June 2026 documentation prototype, "Linked data & RDF" page — four-bullet
     comparison, kept close to the original wording. -->

A relational database is built around a fixed schema. It performs well when you
know what your data looks like and that shape rarely changes. Linked data is the
better fit when:

- **The structure keeps changing.** A new kind of fact needs a new predicate, not
  a migration.
- **The data comes from several sources.** Datasets from different organisations
  merge by loading them into the same store and querying across them.
- **The data is uneven.** Not every instance needs the same properties. That is
  awkward in a relational model and normal in linked data.
- **Other systems need to read it.** A system that has never talked to yours can
  consume your data, because the standards and the identifiers are public.

<!-- SOURCE: presentations.triply.cc/triplydb — FAIR principles and the identifier argument -->

This is also the reason linked data is the usual answer to the **FAIR**
principles for research and government data. Two of the four FAIR requirements —
that data carry globally unique, persistent identifiers, and that they use shared
vocabularies — are properties linked data has by construction rather than by
policy.

<!-- NEW: the FAIR paragraph. It comes up in almost every Dutch public-sector
     conversation and there is currently nowhere in the docs that answers it.
     Remove if you would rather keep the Academy free of policy framing. -->

The cost is real too. You have to decide on IRIs before you publish, agree on
vocabularies with the people you exchange data with, and accept that a triple
store is not the right place for high-volume transactional writes.

<!-- NEW: the cost paragraph. Nothing in the current documentation states a downside,
     which makes the material read as a sales page. Two sentences of honesty here
     buy credibility for everything else in the Academy. -->

## Where this appears in Triply products

- **TriplyDB** stores your data as triples and shows them in the linked data
  table and the linked data browser.
  <!-- LINK-TODO: repoint to triplydb/how-to/view-data.md once the restructure lands -->
  See [Viewing data](../triply-db-getting-started/viewing-data/index.md).
- **TriplyETL** turns source files into triples in its Assert step.
  See [Assert](../triply-etl/assert/index.md).
- **SPARQL** queries these triples by matching patterns against them.
  See [SPARQL](sparql.md).
- Terms used on this page are defined in the [Glossary](glossary.md).

<!-- NEW: standard Academy footer. Same three-part shape on every Academy page:
     product links, then sibling topics, then the way home. -->

## Continue in the Academy

- [Knowledge graphs](knowledge-graph.md) — what happens when connected data grows
  past a single dataset
- [OWL and ontologies](owl-ontologies.md) — agreeing on what your terms mean
- [SPARQL](sparql.md) — asking questions of the triples you have just met
- [Glossary](glossary.md) — every term on this page, in one place

[← Back to the Triply Academy](index.md)
