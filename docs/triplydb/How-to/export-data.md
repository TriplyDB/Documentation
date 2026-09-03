[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: this page is triply-db-getting-started/exporting-data/index.md.
     Moves whole. The "Extract" section is retained but reduced — see the review
     block. Redirect required. -->

# Export data

Data can be exported from TriplyDB a whole dataset at a time, or one graph at a
time. Exports are compressed, and arrive in a serialisation that preserves the
graph each triple belongs to.

<!-- SOURCE: exporting-data/index.md — the whole of this page. -->

## Datasets and graphs

TriplyDB holds data in two containers. A **dataset** contains one or more
**graphs**, and every triple belongs to exactly one graph.

The screenshot below shows the Pokémon dataset with two graphs: "data", holding
28,588 triples, and "vocab", holding 185. Together they account for the dataset's
28,773.

![Exporting a dataset](../../assets/export-dataset.png)

See [Concepts](../concepts/index.md) for what datasets and graphs are.
<!-- LINK-TODO: concepts not written yet. -->

## Export a dataset

Click the downward arrow. The dataset downloads as a single file named after the
dataset — in this example `pokemon.trig`, compressed as `.gz`.

The serialisation is TriG, because TriG records which graph each triple belongs
to. A format without that ability would lose the division between "data" and
"vocab" on the way out.

<!-- NEW: the second sentence. The source states that TriG "is the standard format
     to store triples that are appended to graphs" without saying what that buys
     you, which is the reason the choice matters. -->

The same thing can be done from the Graphs page: choose **Graphs**, then
**Export all graphs**.

![Exporting all graphs at once](../../assets/export-all-graphs.png)

## Export a single graph

Choose **Graphs**, then the arrow beside the graph you want.

![Exporting one graph](../../assets/export-one-graph.png)

The file is named after the graph rather than the dataset, and is compressed the
same way. Graph names make for long filenames — the example above downloads as
`https___triplydb_com_academy_pokemon_graphs_data.trig.gz`.

## Unpack the file

Exports arrive compressed with gzip, whichever route you took. Open the `.gz`
file with your operating system's archive tool and extract the `.trig` file
inside it.

![Extracting the compressed file](../../assets/extract.png)

## Related

- [Upload data](upload-data.md) — the reverse trip
- [Supported file formats](../Reference/file-formats.md) — what TriG and the other
  serialisations are
- [Linked data](../../academy/linked-data.md) — why the graph column matters

