[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->  text recycled from an existing page or deck, origin given
     <!- - NEW: x - ->     written for this page, with the reason
     <!- - LINK-TODO - ->  link points at a current path that will move in the restructure
-->

# SPARQL: aggregation

So far every query has returned one row per match. Aggregation collapses many
rows into one: how many, how much, the largest, the whole list as a single value.

This is the chapter where SPARQL surprises people. The grouping rules are
implicit by default, and when they misfire the query still runs and still returns
a table, just not the one you meant. This chapter spends most of its length on
that.

This chapter assumes [SPARQL: the basics](sparql.md) and
[graph patterns](sparql-graph-patterns.md).

## What aggregation does

<!-- SOURCE: Triply Academy course deck "Querying Knowledge Graphs" — definition of
     aggregation and the multilingual-names example. -->

An aggregation is a function applied to a **group** of values. The groups are
formed by taking every unique combination of values for a chosen set of
variables.

An example makes this concrete. In the Pokémon dataset, each Pokémon has a name
in several languages, so a plain query returns several rows per Pokémon:

| `?pokemon` | `?name` |
| --- | --- |
| `id:abomasnow` | `"ABOMASNOW"@it-it` |
| `id:abomasnow` | `"BLIZZAROI"@fr-fr` |
| `id:abomasnow` | `"ユキノオー"@ja-ja` |
| `id:abra` | `"ABRA"@en-us` |
| `id:abra` | `"ケーシィ"@ja-ja` |

Group by `?pokemon` and the set of names for each Pokémon becomes one group. You
can then count them, list them, or take the longest.

## Counting, explicitly

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon (count(?name) as ?numberOfNames)
where {
  ?pokemon vocab:name ?name.
}
group by ?pokemon
limit 25
```

Two things changed. The projection now contains an expression, which needs the
`as ?variable` form to give the column a name. And `group by` states the grouping
criterion.

Besides `count`, the standard functions are `sum`, `avg`, `min`, `max`,
`sample` (any one value from the group), and `group_concat`.

<!-- NEW: the list of the other functions. The deck demonstrates count and
     group_concat only; naming the full set costs one line and saves a search. -->

## Grouping that you did not ask for

<!-- SOURCE: course deck — implicit grouping, and the sequence showing it going wrong. -->

Here is the part to slow down for. **If a query contains an aggregation function
and no `group by`, SPARQL groups anyway.** It groups by every variable that is
(1) visible in the projection and (2) not an argument to an aggregation function.

Leave out `group by ?pokemon` from the query above and you get the same result,
because `?pokemon` is visible and is not inside `count()`. That is convenient,
and it is also the trap: add one more variable to the projection and the grouping
silently changes underneath you.

```sparql
select ?pokemon ?colour (count(?name) as ?numberOfNames)
where {
  ?pokemon
    vocab:name ?name;
    vocab:colour ?colour.
}
```

This no longer counts names per Pokémon. It counts names per *combination* of
Pokémon and colour. With one colour per Pokémon the numbers happen to match; with
two, they quietly halve.

The rule to remember: **the projection determines the grouping.** Adding a column
is never cosmetic in an aggregating query.

<!-- NEW: the closing rule and the two-colour illustration. The deck shows that
     implicit grouping can go wrong but leaves the reader to infer the rule. -->

## Hiding a grouping variable

<!-- SOURCE: course deck — "grouping variable hiding", and the subselect requirement. -->

Grouping variables have to appear in the projection. So what do you do when you
need to group by something you do not want as a column?

You cannot simply drop it. You need a **subselect**: an inner query that does the
grouping, wrapped by an outer query that projects only what you want.

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?numberOfNames
where {
  {
    select ?pokemon (count(?name) as ?numberOfNames)
    where {
      ?pokemon vocab:name ?name.
    }
    group by ?pokemon
  }
}
```

The inner query groups by `?pokemon`; the outer query returns only the counts.
Subselects are the standard answer whenever grouping and projection want
different things.

## Aggregating an aggregate

<!-- SOURCE: course deck — nested aggregate ("first count, then take the maximum"). -->

<!-- TODO — EXAMPLE NEEDED
     This section describes the technique but shows no query. Add a working
     nested-aggregate query against the academy/pokemon dataset: count names per
     Pokémon in a subselect, then take max() of that count in the outer query.
     Verify it runs before publishing. Together with the section below, this is
     the hardest material on the page and it is the one place where prose alone
     is not enough. -->

"Which Pokémon has the most names?" needs two aggregations in sequence: first
count per Pokémon, then take the maximum of those counts. Since an aggregation
function cannot take another aggregation as its argument, this is a subselect
again — the inner query counts, the outer query takes the maximum.

## Returning the evidence

<!-- SOURCE: course deck — "aggregate evidence". -->

<!-- TODO — EXAMPLE NEEDED
     This section describes the technique but shows no query. Add a working query
     against the academy/pokemon dataset: compute max(?weight) in a subselect,
     then match in the outer query for the Pokémon whose weight equals it, so the
     result carries both the number and the resource. Verify it runs before
     publishing. -->

`max(?weight)` gives you a number, not the thing that weighs it. This is a
recurring frustration: you want the heaviest Pokémon, and SPARQL hands you the
weight.

The pattern is the same subselect shape. Compute the maximum in an inner query,
then match in the outer query for the resource whose value equals it. The result
carries both the number and the evidence for it.

## Building one string from many rows

<!-- SOURCE: course deck — group_concat with a separator. -->

`group_concat` turns a group of values into a single string, with a separator you
choose:

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon (group_concat(?name; separator=', ') as ?names)
where {
  ?pokemon vocab:name ?name.
}
group by ?pokemon
limit 25
```

This is how you get one readable row per resource instead of five near-identical
ones — useful for exports and for anything a human will read.

## Filtering on the result of an aggregation

<!-- NEW: this whole section. The course deck does not cover `having`, but "only show
     groups above a threshold" is one of the most common follow-up questions, and
     the natural guess — using `filter` — does not work. -->

`filter` runs before grouping, so it cannot test a count. `having` is the version
that runs after:

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>

select ?pokemon (count(?name) as ?numberOfNames)
where {
  ?pokemon vocab:name ?name.
}
group by ?pokemon
having (count(?name) > 5)
```

If you find yourself wondering why a filter on an aggregated column is ignored,
this is why.

## Where this appears in Triply products

- **TriplyDB's Insights page** is aggregation made visual: the class frequency
  view counts how often each class and property occurs in a graph.
  <!-- LINK-TODO: repoint to triplydb/how-to/view-data.md -->
  See [Viewing data](../triply-db-getting-started/viewing-data/index.md#insights).
- **Data stories** commonly use aggregating queries to drive charts.
  <!-- LINK-TODO: repoint to triplydb/how-to/data-stories.md -->
  See [Data stories](../triply-db-getting-started/data-stories/index.md).

## Continue in the Academy

- [Construct, ask, describe and federation](sparql-construct-and-federation.md) —
  the other three query forms
- [Querying real-world data](sparql-real-world-data.md) — hierarchies, geodata and
  statistics
- [Graph patterns](sparql-graph-patterns.md) — back one chapter
- [SPARQL: the basics](sparql.md) — back to the start of the track
- [Glossary](glossary.md) — every term on this page, in one place

[← Back to the Triply Academy](index.md)
