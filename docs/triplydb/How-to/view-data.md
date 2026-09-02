[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet
     <!- - MOVE-CANDIDATE - -> content that may belong to another chapter later

     ORIGIN: this page is triply-db-getting-started/viewing-data/index.md.
     Two changes of destination: the GraphQL section becomes a pointer, with the
     detail in triplydb/reference/graphql.md; the query transfer and copy sections
     are marked as candidates for the Saved queries app but kept here for now.
     Redirect required — see the review block. -->

# View data

TriplyDB offers several ways to explore a dataset: browsing it one resource at a
time, reading it as triples, querying it with SPARQL or GraphQL, searching it as
text, or looking at its overall shape.

This guide covers each of them.

<!-- SOURCE: viewing-data/index.md — the whole of this page. Section order and all
     screenshots are unchanged. -->

## Linked data browser

The linked data browser traverses a dataset one node at a time. Each node is
described by its properties, and any property can be followed to the next node.

![The linked data browser in TriplyDB](../../assets/ld-browser.png)

### Properties the browser recognises

Some properties make the browser do more than list values. Use them in your data
and the browser will render types, labels, maps, images, audio and video.

<!-- NEW: this summary table. The source explains the seven groups one after
     another in prose; a table lets someone modelling their data check the whole
     list at a glance and then read only the part they need. The prose below is
     unchanged. -->

| To get | Use |
| --- | --- |
| A type shown for the resource | `rdf:type` |
| A readable title | `rdfs:label`, `skos:prefLabel` |
| A description | `sdo:description`, `rdfs:comment` |
| A map | `geo:asWKT`, `geo:hasGeometry`, `geo:location` |
| An image | `foaf:depiction`, `foaf:thumbnail`, `foaf:img`, `sdo:image`, `sdo:contentUrl`, class `sdo:ImageObject` |
| An audio player | `sdo:audio`, `sdo:contentUrl`, class `sdo:AudioObject` |
| A video player | `sdo:video`, `sdo:contentUrl`, class `sdo:VideoObject` |

#### Types

`rdf:type` states the class of a resource. It tells the browser what kind of
thing it is looking at, so it can present it appropriately.

In [this example](https://triplydb.com/Triply/iris/browser?resource=http%3A%2F%2Fdbpedia.org%2Fresource%2FIris_setosa),
`rdf:type` shows that Iris setosa is a type of flowering plant.

![rdf:type shown in the linked data browser](../../assets/type.png)

#### Labels

Labels give a resource a concise, human-readable name. Either property works:

- `rdfs:label`
- `skos:prefLabel`

In [this example](https://triplydb.com/academy/pokemon/browser?resource=https%3A%2F%2Ftriplydb.com%2Facademy%2Fpokemon%2Fid%2Fpokemon%2Fpikachu),
`rdfs:label` puts "Pikachu" above the corresponding image.

![rdfs:label shown in the linked data browser](../../assets/label.png)

#### Descriptions

Descriptions add context about a resource — its purpose, content or significance:

- `sdo:description`
- `rdfs:comment`

In [this example](https://triplydb.com/Triply/iris/browser?resource=http%3A%2F%2Fdbpedia.org%2Fresource%2FIris_setosa),
`rdfs:comment` supplies further information about Iris setosa.

![rdfs:comment shown in the linked data browser](../../assets/description.png)

#### Geo

Three properties carry geographic information:

- `geo:asWKT` specifies a geometry in Well-Known Text, which the browser draws on
  a map.
- `geo:hasGeometry` links a geographic feature to its geometry.
- `geo:location` gives a location directly as coordinates.

In [this example](https://triplydb.com/osm/osm/browser?resource=https%3A%2F%2Fdata.osm.pldn.nl%2Fway%2F34997507),
`geo:hasGeometry` produces a map showing the Instituut voor Beeld en Geluid.

![geo:hasGeometry shown in the linked data browser](../../assets/geo.png)

See [querying real-world data](../../academy/sparql-real-world-data.md#geometries)
for the GeoSPARQL model behind these properties.

#### Images

Several properties associate an image with a resource:

- class `sdo:ImageObject`
- `foaf:depiction`
- `foaf:thumbnail`
- `foaf:img`
- `sdo:image`
- `sdo:contentUrl`

In [this example](https://triplydb.com/academy/pokemon/browser?resource=https%3A%2F%2Ftriplydb.com%2Facademy%2Fpokemon%2Fid%2Fpokemon%2Fpikachu),
`foaf:depiction` displays a picture of Pikachu.

![foaf:depiction shown in the linked data browser](../../assets/image.png)

#### Audio

Audio works the same way:

- class `sdo:AudioObject`
- `sdo:audio`
- `sdo:contentUrl`

In [this example](https://nightly.triplydb.com/Triply/efteling/browser?resource=https%3A%2F%2Fnightly.triplydb.com%2Fefteling%2FCarnavalFestival),
`sdo:audio` plays audio of the Carnival Festival.

![sdo:audio shown in the linked data browser](../../assets/audio.png)

#### Video

And video:

- class `sdo:VideoObject`
- `sdo:video`
- `sdo:contentUrl`

Supported video formats are `.mp4`, `.webm` and `.ogg`.

In [this example](https://test.triply.cc/Philippe/ld-patterns/browser?resource=https%3A%2F%2Ftest.triply.cc%2FPhilippe%2Fld-patterns%2Fid%2Fvideo%2Fkleine-piep_0.0),
`sdo:contentUrl` plays video of the Kleine Piep.

![sdo:contentUrl shown in the linked data browser](../../assets/video.png)

## Linked data table

The linked data table shows a dataset at the triple level. The first three
columns are the subject, predicate and object; the fourth is the graph the triple
belongs to.

![The linked data table in TriplyDB](../../assets/linked-data-table.png)

Fill in any of the four text fields to run a simple filter.

Terms can also be dragged between columns, which gives you a rough form of graph
navigation: drag an object term into the subject column to see the triples where
that term is the subject.

## SPARQL IDE

When a dataset has a running SPARQL service, you can query it from the SPARQL
IDE — an extended version of the open-source Yasgui query editor.

<!-- LINK-TODO: the source links Yasgui to ../../yasgui/index.md, which does not
     exist in the repository — the link is broken on the live site today. Removed
     rather than carried over. Decide which URL it should point at, if any. -->

New to SPARQL? Start with [SPARQL: the basics](../../academy/sparql.md).

### Save a query

Click the save icon in the top-right corner of the editor to turn the query into
a saved query, which gets a persistent URL, metadata and version history.
<!-- LINK-TODO: repoint to data-apps/saved-queries/ once that chapter exists. -->

### Share a query

Click the share icon in the top-right corner of the editor. The dialog offers the
query in three forms:

1. **A URL-encoded query.** A long URL containing the endpoint, the query and the
   visualisation settings. Complex queries produce very long URLs, and some
   applications cut URLs off at a maximum length — often 1,024 characters.
2. **A short URL** that redirects to the URL-encoded one.
3. **A cURL command**, for testing the request from a terminal.

Saved queries avoid the length limitation entirely and are the better option for
anything you intend to keep.

### Transfer or copy a query

A saved query can be transferred to another account or group, or copied rather
than moved. Both work in either direction between accounts and groups.
<!-- LINK-TODO: repoint to data-apps/saved-queries/ once that chapter exists.
     The full procedure and its five screenshots were extracted to
     _staging/data-apps/saved-queries/transfer-and-copy.md on 26 Aug. -->

## Elasticsearch

When a dataset has a running Elasticsearch service, you can search the whole
dataset as text. It behaves like a search engine: it returns any node containing
your search term, in any of its properties.

Custom queries can be written with the Elasticsearch
[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

## GraphQL

Some TriplyDB instances also support querying with
[GraphQL](https://graphql.org/). The schema is generated from the SHACL shapes in
your dataset.

See [GraphQL](../reference/graphql.md) for the schema, queries, filtering and
pagination.
<!-- LINK-TODO: reference/graphql.md not written yet; it merges this section with
     the orphaned generics/Graphql.md. -->

## Insights

The Insights page gives a short overview of the data at hand, in two views.

### Class frequency

The class frequency diagram shows how often classes and properties occur in a
graph. Choose the graph from the drop-down at the top. The diagram shows the ten
most frequent classes; hover over a bar for the exact count and the full IRI, and
click a bar to expand it into the ten most frequent predicates of that class.

### Class hierarchy

The class hierarchy diagram is built from the `rdfs:subClassOf` relations between
the classes in the dataset, and comes in three forms:

- Bubbles
- Treemap
- Sunburst

All three are interactive. Hovering shows information about the layer under the
pointer; clicking zooms in. Zooming out differs per visualisation:

| Visualisation | To zoom out |
| --- | --- |
| Bubbles | Click outside the bubble |
| Treemap | Use the breadcrumb trail above the visualisation |
| Sunburst | Click the innermost circle |

<!-- NEW: the three zoom-out instructions were a bullet list in the source; a
     table makes them scannable. Wording unchanged. -->

#### When the class hierarchy appears

- A class appears only if it has instances, connected to the class by `rdf:type`.
- The hierarchy cannot be shown at all if it contains a cycle — that is, if some
  class is, indirectly, its own subclass.

## Related

- [Supported file formats](../reference/file-formats.md) — what you can load
- [GraphQL](../reference/graphql.md) — the other query language
  <!-- LINK-TODO: page not written yet -->
- [SPARQL: the basics](../../academy/sparql.md) — writing the queries this page runs
- [Linked data](../../academy/linked-data.md) — what the table and browser show

