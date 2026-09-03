<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: split out of triply-db-getting-started/uploading-data/index.md,
     sections "Supported data formats", "CSV and TSV format" and "XML format".
     These are lookup tables rather than steps, so they belong in Reference while
     the surrounding procedure stays in triplydb/how-to/upload-data.md.
     The old anchor #supported-data-formats is linked from the changelog with an
     absolute URL — see the review block. -->

# Supported file formats

TriplyDB accepts RDF, CSV, TSV and XML. Files are recognised by their extension,
so a correct file with the wrong extension is not accepted.

<!-- NEW: the second sentence. Not in the source, but the source's own rule
     ("must use one of the supported file name extensions") implies it and it is
     a common upload failure. Confirm the behaviour before publishing. -->

## Data formats

<!-- SOURCE: uploading-data/index.md#supported-data-formats — table unchanged. -->

| Data format | File name extension |
| --- | --- |
| [Comma-Separated Values (CSV)](#csv-and-tsv) | `.csv` |
| [Tab-Separated Values (TSV)](#csv-and-tsv) | `.tsv` |
| [XML](#xml) | `.xml` |
| JSON-LD | `.jsonld`, `.json` |
| N-Quads | `.nq` |
| N-Triples | `.nt` |
| RDF/XML | `.rdf`, `.owl`, `.owx` |
| TriG | `.trig` |
| Turtle | `.ttl`, `.n3` |

## Archive formats

<!-- SOURCE: uploading-data/index.md#supported-data-formats — table unchanged. -->

Up to 1,000 separate files can be uploaded at once. Beyond that, or when the
files are large, compress them into an archive — an archive may contain any
number of files of any size.

| Archive format | File name extension |
| --- | --- |
| gzip | `.gz` |
| bzip2 | `.bz2` |
| tar | `.tar` |
| XZ | `.xz` |
| ZIP | `.zip` |

<!-- The source table gives the tar extension as `tar`, without the leading dot,
     while every other row has one. Corrected to `.tar` here — confirm. -->

## CSV and TSV

<!-- SOURCE: uploading-data/index.md#csv-and-tsv-format — unchanged, including the
     example CSV and the example query. -->

CSV and TSV files are converted to RDF on upload and stored in two
representations at once:

1. **Facade-X** — an expressive model that preserves the full structure of the
   tabular data. Documented in the
   [SPARQL Anything CSV reference](https://sparql-anything.readthedocs.io/stable/formats/CSV/).
2. **Simple** — a direct, row-based model, suitable for tables with a
   straightforward structure.

The simple representation works as follows:

- A table resource links to all rows through `rdfs:member`.
- Each row gets an IRI based on its row number: `.../row/1`, `.../row/2`, and so
  on.
- Column headers become properties in the
  `https://triplydb.com/table/triply/def/` namespace.
- Each property carries an `rdfs:label` with the original column header.
- Cell values are stored as string literals.

Given this CSV:

```csv
product_id,name,category,price,in_stock
P001,Laptop Stand,Office Equipment,49.99,true
P002,Ergonomic Keyboard,Peripherals,89.50,true
```

the simple representation can be queried like this:

```sparql
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
prefix table: <https://triplydb.com/table/triply/def/>

select ?name ?category ?price
where {
  ?table rdfs:member ?row.
  ?row
    table:name ?name;
    table:category ?category;
    table:price ?price.
}
```

Note that cell values arrive as strings, including numbers and booleans. Cast
them in the query, or convert the data properly with TriplyETL if you need typed
literals.

<!-- NEW: the closing paragraph. The source states that cell values are string
     literals and leaves it there; the consequence for querying is what a reader
     needs. Confirm the TriplyETL recommendation is the one you want to give. -->

## XML

<!-- SOURCE: uploading-data/index.md#xml-format — unchanged. -->

XML files are converted to RDF using the Facade-X data model, which preserves the
hierarchical structure of the document and makes it queryable with SPARQL. See
the [SPARQL Anything XML reference](https://sparql-anything.readthedocs.io/stable/formats/XML/)
for the model.

## Related

- [Upload data](../How-to/upload-data.md) — the procedure these formats apply to
- [Linked data](../../academy/linked-data.md) — what the RDF formats above encode


