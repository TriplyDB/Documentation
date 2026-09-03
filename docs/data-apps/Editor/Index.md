# TriplyDB Editor

## Overview

The Editor is a data add-on for TriplyDB. It provides a form-based user interface for creating, updating, and deleting instances of classes that are defined in a SHACL shapes graph. Because the forms are generated from the shapes graph, they always reflect the structure of your data model — mandatory properties are marked, optional properties can be added, and dropdown lists are offered wherever the data allows it.

The Editor is suitable for any knowledge organization system or controlled vocabulary that is modelled in RDF. It has built-in support for SKOS concept schemes, including a hierarchical tree view and multi-scheme navigation. It also works with any other vocabulary or ontology for which SHACL shapes have been defined, for example, DCAT data catalogues or custom domain models.

The Editor is intended for knowledge managers, data stewards, and domain experts who are responsible for maintaining the content of a linked dataset. No knowledge of SPARQL or RDF syntax is required to use the Editor. Familiarity with the data model being edited (for example, understanding what a SKOS concept scheme is and how concepts relate to each other) is helpful.

The Editor lives inside TriplyDB and operates on an existing dataset. All changes made in the Editor are written back to the dataset immediately. The Editor sits alongside other TriplyDB capabilities such as Browser, Triples, and SPARQL, and instance hyperlinks can be passed between these views by drag-and-drop.

To start using the Editor, you need an active TriplyDB dataset. If you do not have one yet, see the [TriplyDB Getting Started guide](https://docs.triply.cc/triply-db-getting-started/).

This helps you navigate the documentation:
- [Getting started](./Getting-started/index.md)
- [Concepts](./Concepts/index.md)
- [How to](./How-to/index.md)
- [Reference](./Reference/index.md)
- [FAQ](./FAQ/Index.md)

<!--
configure APIs
reference:
access levels
markdown support
-->