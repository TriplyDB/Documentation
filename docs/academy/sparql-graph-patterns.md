[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->  text recycled from an existing page or deck, origin given
     <!- - NEW: x - ->     written for this page, with the reason
     <!- - LINK-TODO - ->  link points at a current path that will move in the restructure
-->

# SPARQL: graph patterns

A single triple pattern answers very little. Real questions need several patterns
that constrain each other, and the shape they form is called a **graph pattern**.
This chapter covers how patterns combine, how to write them without repeating
yourself, and how to follow a chain of relationships you cannot count in advance.

It assumes [SPARQL: the basics](sparql.md). All examples run against the public
Pokémon dataset introduced there.

## Patterns join on shared variables

<!-- SOURCE: Triply Academy course deck "Querying Knowledge Graphs" — shared variables
     as the connector between triple patterns. -->

A graph pattern holds zero or more triple patterns. Where two of them use the
same variable, the engine keeps only the results that satisfy both. That shared
variable is the join.

```sparql
prefix foaf:  <http://xmlns.com/foaf/0.1/>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon ?image ?cry
where {
  ?pokemon foaf:depiction ?image.
  ?pokemon vocab:cry ?cry.
}
limit 25
```

Because both patterns use `?pokemon`, only Pokémon that have *both* a picture and
a sound come back. Adding a pattern therefore narrows the result — it never
widens it.

<!-- NEW: the last sentence. New users routinely expect the opposite, and it is the
     cause of the "my query returns nothing" support question. -->

## Writing the same subject once

<!-- SOURCE: course deck — group pattern abbreviation table. -->

Repeating `?pokemon` on every line gets tiring. Two punctuation marks remove the
repetition:

| Symbol | Meaning |
| --- | --- |
| `.` | End of a triple pattern |
| `;` | Same subject, next predicate |
| `,` | Same subject and predicate, next object |

The query above, written properly:

```sparql
prefix foaf:  <http://xmlns.com/foaf/0.1/>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon ?image ?cry ?name1 ?name2
where {
  ?pokemon
    foaf:depiction ?image;
    rdfs:label ?name1, ?name2;
    vocab:cry ?cry.
}
limit 25
```

This is the same query as four separate patterns. The abbreviation is syntax
only, and the layout — one predicate per line, indented under its subject — is
worth adopting as a habit.

## Filtering what comes back

<!-- SOURCE: course deck — filter, including the multiple-values and language examples. -->

`filter` discards results that do not meet a condition. It applies to bindings
that the pattern has already produced.

```sparql
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon ?nameJa ?nameEn
where {
  ?pokemon
    vocab:name ?nameJa, ?nameEn.
  filter(lang(?nameJa) = 'ja-ja' && lang(?nameEn) = 'en-us')
}
limit 25
```

Two things are happening. `vocab:name ?nameJa, ?nameEn` matches the name property
twice, so each result pairs two names for one Pokémon. The filter then keeps only
the pairs where the first is Japanese and the second is English. Without it you
would get every combination, including a name paired with itself.

`lang()` returns the language tag of a literal. Other common tests are numeric
comparison (`?weight > 100`), inequality (`?a != ?b`), and `regex()` for text.

## Making a pattern optional

<!-- NEW: this whole section. The course deck does not cover optional, but no
     realistic query survives without it — linked data is uneven by nature, and
     a missing picture should not delete the Pokémon from the results. -->

Everything so far narrows. `optional` does not: it adds bindings when they exist
and leaves them empty when they do not.

```sparql
prefix foaf:  <http://xmlns.com/foaf/0.1/>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

select ?pokemon ?name ?image
where {
  ?pokemon rdfs:label ?name.
  optional { ?pokemon foaf:depiction ?image. }
}
limit 25
```

Every Pokémon with a name is returned. Those without a picture come back with an
empty `?image` cell rather than disappearing.

This matters more in linked data than in a relational database. A table forces
every row to have every column; a graph does not, so absence is normal rather
than exceptional.

## Accepting either of two shapes

<!-- NEW: this section too, for the same reason as optional. Data merged from two
     sources routinely uses two different predicates for one idea, which is
     exactly the situation union exists for. -->

`union` returns results that match either pattern.

```sparql
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix skos: <http://www.w3.org/2004/02/skos/core#>

select ?resource ?label
where {
  { ?resource rdfs:label ?label. }
  union
  { ?resource skos:prefLabel ?label. }
}
limit 25
```

Use it when one idea is expressed two ways — which happens constantly in data
that has been merged from several sources.

## Supplying your own values

<!-- SOURCE: course deck — values, used there to supply multiple bindings. -->

`values` injects a fixed list of bindings into a query, so you can ask about a
specific set of things without writing a filter for each.

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>
prefix id:    <https://triplydb.com/academy/pokemon/id/pokemon/>

select ?pokemon ?weight
where {
  values ?pokemon { id:pikachu id:mew id:flareon }
  ?pokemon vocab:weight ?weight.
}
```

## Property paths: following a chain

<!-- SOURCE: course deck — the property path table and its mapping onto OWL. -->

Sometimes you do not know how many steps away the answer is. A category might sit
two levels up the hierarchy for one concept and five for another. Property paths
express the route instead of the number of steps.

| Path | Meaning |
| --- | --- |
| `P/Q` | Follow `P`, then follow `Q` |
| `P\|Q` | Follow `P` or `Q` |
| `P+` | Follow `P` one or more times |
| `P*` | Follow `P` zero or more times |
| `P?` | Follow `P` zero or one time |
| `^P` | Follow `P` in the opposite direction |

`P/Q` alone removes a lot of clutter. Instead of introducing a variable for an
intermediate node you will never use, write the two steps as one:

```sparql
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon ?typeName
where {
  ?pokemon vocab:type/rdfs:label ?typeName.
}
limit 25
```

The `+` and `*` forms are what make hierarchies queryable at all. `skos:broader+`
walks a taxonomy all the way to its root regardless of depth.

### Property paths and OWL

The path operators line up with the OWL property characteristics you may have
declared in your ontology:

| If a property is | Navigate it with |
| --- | --- |
| `owl:TransitiveProperty` | `P+` |
| `owl:ReflexiveProperty` | `P*` |
| `owl:SymmetricProperty` | `P\|(^P)` |

This is worth knowing even when your triple store does no reasoning: a property
path gives you the traversal without needing inferred triples to exist.

<!-- NEW: the closing sentence. The deck shows the correspondence without saying
     why it is useful. The practical point is that paths substitute for reasoning. -->

See [OWL and ontologies](owl-ontologies.md) for what these characteristics mean.

## Skipping a node you do not need

<!-- SOURCE: course deck — anonymous node notation. -->

Square brackets stand for a resource you must pass through but never refer to
again. Instead of inventing `?somethingIDoNotCareAbout`, write:

```sparql
prefix foaf:  <http://xmlns.com/foaf/0.1/>
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?image ?name
where {
  [ foaf:depiction ?image;
    vocab:name ?name ].
}
limit 25
```

Compact, and it makes clear which parts of the pattern carry meaning.

## Where this appears in Triply products

- **TriplyETL** builds SHACL rules and enrichment steps out of graph patterns.
  See [SPARQL rules](../triply-etl/enrich/shacl/sparql-rules.md).
- **The Editor** navigates SKOS hierarchies, which are property paths underneath.
  <!-- LINK-TODO: repoint to data-apps/editor/ once written -->
  See [Editing data](../triply-db-getting-started/editing-data/index.md).

## Continue in the Academy

- [Aggregation](sparql-aggregation.md) — counting and grouping what these patterns
  return
- [Construct, ask, describe and federation](sparql-construct-and-federation.md) —
  the other three query forms
- [Querying real-world data](sparql-real-world-data.md) — hierarchies, geodata and
  statistics
- [SPARQL: the basics](sparql.md) — back to the start of the track
- [Glossary](glossary.md) — every term on this page, in one place

[← Back to the Triply Academy](index.md)