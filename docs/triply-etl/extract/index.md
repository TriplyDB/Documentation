[TOC]

# Extract

The TriplyETL **Extract** step is the first step in any TriplyETL pipeline. It is indicated by the red arrow in the following diagram:

```mermaid
graph LR
  sources -- 1. Extract --> record
  record -- 2. Transform --> record
  record -- 3. Assert --> ld
  ld -- 4. Enrich --> ld
  ld -- 5. Validate --> ld
  ld -- 6. Publish --> destinations

  linkStyle 0 stroke:red,stroke-width:3px;
  destinations[("D. Destinations\n(TriplyDB)")]
  ld[C. Internal Store]
  record[B. Record]
  sources[A. Data Sources]
```

In the Extract step, one or more extractors are used to create a stream of [records](../generic/record.md) from a [data source](../sources/index.md). The basic structure of every record in is the same: it does not matter which extractor or which source is used.

The following extractors are currently supported:

- [CSV](./csv.md) or Comma-Separated Values
- [JSON](./json.md) or JavaScript Object Notation
- [OAI-PMH](./oai-pmh.md) or Open Archives Initiative Protocol for Metadata Harvesting
- [Postgres](./postgres.md) for PostgreSQL Query & Postgres API Options
- [RDF](./rdf.md) for Resource Description Format
- [Shapefile](./shapefile.md) for ESRI Shapefiles
- [TSV](./tsv.md) for Tab-Separated Values
- [XLSX](./xlsx.md) for Microsoft Excel
- [XML](./xml.md) for XML Markup Language



## Next steps

The Extract step results in a stream of [records](../generic/record.md) that can be processed in the following steps:

- Step 2. [**Transform**](../transform/index.md): cleans, combines, and extends data in the[record.
- Step 3. [**Assert**](../assert/index.md): uses data from the record to make linked data assertions in the internal store.
