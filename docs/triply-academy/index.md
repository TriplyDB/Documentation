[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->  text recycled from an existing page or deck, origin given
     <!- - NEW: x - ->     written for this page, with the reason
     <!- - LINK-TODO - ->  link points at a current path that will move in the restructure

     This is the Academy home page. Every Academy page ends with a link back here. -->

# Triply Academy

The Academy explains the ideas the Triply products are built on: linked data,
knowledge graphs, ontologies, and the standards for querying and validating them.

It is deliberately product-neutral. You do not need any of it to use a Triply
product, and none of it tells you what to click (the product documentation does
that). Read the Academy when you want to understand *why* things work the way they
do, or when a term in the product documentation turns out to have more behind it
than a definition.

Everything here uses open datasets you can query yourself.

## Where to start

<!-- NEW: the three paths. There is no source for these; they exist because a
     twelve-page section with no entry point sends people to whichever title looks
     most familiar, which is rarely the right one. -->

**New to linked data.** Read [Linked data](linked-data.md), then
[Knowledge graphs](knowledge-graph.md). Between them they cover what the data
looks like and why anyone builds this way. About half an hour.

**You need to query something.** Go straight to
[SPARQL: the basics](sparql.md) and work through the track. The first chapter is
enough to write useful queries; the rest is there when you hit its limits.

**You are designing a model.** Read [OWL and ontologies](owl-ontologies.md) and
[SHACL](shacl.md) together (they are two halves of one subject) and add
[SKOS](skos.md) if your domain is terminology rather than logic.

## The subjects

| Page | Covers |
| --- | --- |
| [Linked data](linked-data.md) | Triples, IRIs, literals, graphs, and why not a relational database |
| [Knowledge graphs](knowledge-graph.md) | What a knowledge graph is, how it compares, and how one gets built |
| [OWL and ontologies](owl-ontologies.md) | Classes, properties, inference, and which vocabularies to reuse |
| [SHACL](shacl.md) | Stating what your data must look like, and checking that it does |
| [SKOS](skos.md) | Concept schemes, labels and hierarchies, for terminology rather than logic |
| [Glossary](glossary.md) | Every term used across the documentation, defined once |

## The SPARQL track

Five chapters for the beginner SPARQL programmer. Each stands on its own, but they build your knowledge gradually.

| Chapter | Covers |
| --- | --- |
| [1. The basics](sparql.md) | Query anatomy, triple patterns, abbreviations, modifiers |
| [2. Graph patterns](sparql-graph-patterns.md) | Combining patterns, filters, property paths |
| [3. Aggregation](sparql-aggregation.md) | Counting, grouping, and the grouping rules that surprise people |
| [4. Construct, ask, describe and federation](sparql-construct-and-federation.md) | The other three query forms, and querying across endpoints |
| [5. Querying real-world data](sparql-real-world-data.md) | Hierarchies, geodata and statistics |

## Tutorials

Longer, worked examples that end with something running.

- [JSON-LD framing](tutorials/json-ld-framing.md) — turn query results into
  predictable, tree-shaped JSON
- [Building a RESTful API](tutorials/restful-api.md) — a REST API built entirely
  from saved queries

[All tutorials](tutorials/index.md)

## Datasets to practise on

<!-- SOURCE: the academy account on TriplyDB, and the example endpoints used      throughout the existing documentation and the Triply Academy course decks. we can add more examples !! -->

The Triply Academy account on TriplyDB publishes open datasets used for teaching.
The **Pokémon** dataset is the one every SPARQL example in these pages queries —
small enough to hold in your head, varied enough to demonstrate language tags,
images, audio, hierarchies and numbers:

```none
https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
```

<!-- NEW: the case for using Pokémon. It reads as an odd choice to a new reader, and the reason it is a good teaching dataset is worth one sentence. -->

## Classroom material

<!-- NEW: this section is a placeholder pending a decision — see the review block. -->

Much of what is written here started life as taught material. Triply's linked data
courses have been given at universities and to client teams for years, and the
Academy pages recycle those explanations deliberately, so what you read here and
what you would hear in a session are the same thing.

## How this fits with the product documentation

The division is simple and worth stating, because it decides where anything new
belongs:

- The **Academy** explains concepts. It is product-neutral, and it uses Triply
  datasets as examples rather than as instructions.
- The **product documentation** explains the products. What to click, which
  setting does what, which formats are supported.

Every Academy page ends with a short list of where its subject appears in the
Triply products, so you can cross over at the point where the concept becomes a
button.

