[TOC]

# XML extractor

XML or Extensible Markup Language (file name extension `.xml`) is a popular open format for tree-shaped source data. TriplyETL has a dedicated `fromXml()` extractor for this data format.



## Basic usage

The XML extractor is imported in the following way:

```ts
import { fromXml, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records from an XML file that is stored as a [TriplyDB Asset](../sources/triplydb-assets.md):

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element' }
),
```

Notice that the `fromXml()` extractor requires a `selectors` option. This specifies the subtrees in the XML that should be treated as individual records. In the above snippet the records are the subtrees that occur between the `<first-element>` opening tag and the `</first-element>` closing tag.



## Path selectors

If a deeper path must be specified, sequential tags in the path must be separated by a dot:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', {name: 'my-data.xml'}),
  { selectors: 'first-element.second-element.third-element' }
),
```

It is common for large XML sources to contain different kinds of records. Different kinds of records often occur under different paths. It is therefore possible to specify multiple paths, all of which will be used for extract records from the XML source.

The following code snippet extracts records for three different paths in the same XML source:

```ts
fromXml(
  Source.TriplyDb.asset('my-dataset', { name: 'my-data.xml' }),
  {
    selectors: [
      'first-element.second-element.third-element',
      'first-element.second-element.alt-element',
      'first-element.second-element.other-element',
    ]
  }
),
```

TriplyETL supports the W3C XML standard.



### Nested keys

Since XML can store tree-shaped data, it can have nested keys and indexed array. See the following subsections of the JSON documentation for how to extract data from such tree structures:

- [Nested keys](#nested-keys)
- [Dealing with dots in keys](#dealing-with-dots-in-keys)
- [Accessing lists by index](#accessing-lists-by-index)
