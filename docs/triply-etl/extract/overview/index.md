---
title: "TriplyETL: Extract: Overview"
path: "/docs/triply-etl/extract/overview"
---

The Extract step is the first step in any TriplyETL pipeline.  It extracts data records from one or more data sources.

## Data sources

Data sources are a combination of a data format and a source type.  Examples of data formats are 'Microsoft Excel' or 'JSON'.  Examples of source types are 'file' or 'URL'.  Notice that you can make many combinations by combining format and type.  For example, you can use a local JSON file or you download JSON from a URL.

- [Data Formats](/docs/triply-etl/extract/formats) gives an overview of the data formats that are supported by TriplyETL.
- [Source Types](/docs/triply-etl/extract/types) given an overview of the source types that are supported by TriplyETL

## Record

The Extract step results in a stream of records.  The basic structure of every record in TriplyETL is the same.  It does not matter which data format or which source type is used.

- [Record](/docs/triply-etl/extract/record) documents the basic structure of every record in TriplyETL.
<!--
- [Special Keys](/docs/triply-etl/extract/special-keys) documents the special keys that are added to the records to make data processing more convenient.
-->

## Next steps

Once a stream of records is generated, the following documentation explains how the data in these records can be used:

- [Transformations](transformations) are applied to the record to change its contents.
- [Assertions](assertions) use data from the record to generate linked data in the Internal Store.
