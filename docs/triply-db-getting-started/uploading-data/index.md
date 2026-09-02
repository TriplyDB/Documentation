[TOC]

# Uploading Data

This section explains how to create a linked dataset in TriplyDB.

## Creating a new dataset

You must be logged in before you can create a new dataset.

<!-- TODO: See page [logging in](../logging-in/index.md) for more information. -->

### Opening the “Create dataset” dialog

You can create a new dataset in either of the following two ways:

1. From the home screen (see [Figure 1a](#fig-home-screen-logged-in)), click on the `+` button next to "Your datasets", on the right-hand side of the screen.

2. From the user screen (see [Figure 1b](#fig-user-screen-logged-in)), click on the “Create dataset” button on the right-hand side.

<figure id="fig-home-screen-logged-in">
  <img src="../../assets/home-screen-logged-in.png">
  <figcaption>Figure 1a. The home screen for a logged in user.</figcaption>
</figure>

<figure id="fig-user-screen-logged-in">
  <img src="../../assets/user-screen-logged-in.png">
  <figcaption>Figure 1b. The user screen for a logged in user.</figcaption>
</figure>

### Inside the “Create dataset” dialog

This opens the “Create dataset” dialog (see [Figure 2](#fig-add-dataset-dialog)).

<figure id="fig-add-dataset-dialog">
  <img src="../../assets/add-dataset-dialog.png">
  <figcaption>Figure 2. The “Create dataset” dialog</figcaption>
</figure>

In the “Create dataset” dialog, perform the following steps:

1. Required: Enter a dataset name. A dataset name can contain letters, number, and hyphens.

2. Optional: Enter a dataset display name. The display name will be shown in the GUI and will be included in dataset metadata.

3. Optional: Enter a dataset description. This description will be shown in the GUI, and will be included in dataset metadata. The description can be formatted with Markdown. See Section [Markdown](../reference/index.md#markdown-support) for details.

4. Optional: Change the access level of the dataset. The standard access level is “Private”. See Section [Dataset Access Levels](../reference/index.md#access-levels) for more information.

This creates a new dataset, and displays the “Add data” page (see Section [Adding data](#adding-data)).

<!-- move
When datasets are Public (see [Access Levels](../reference/index.md#access-levels)), they automatically expose metadata and are automatically crawled and indexed by popular search engines (see [Metadata](../publishing-data/index.md#entering-metadata)).
-->

## Adding data

You must first have a dataset, before you can add data. See Section [Creating a new dataset](#creating-a-new-dataset) for more information.

### Opening the “Add data” pane

You can open the “Add data” pane in either of the following two ways:

<!-- TODO: (see Section [Graphs page]()) -->
<!-- TODO: (see Section [Dataset page]()) -->

1. From the Graphs page, click on the "Import a new graph" button (see [Figure 3a](#fig-graphs-page)). This opens the "Add data" pane.
2. When a dataset does not have any data yet, a message is displayed on the dataset homepage (see [Figure 3b](#fig-dataset-homepage-no-data)) that can be clicked. This opens the "Add data" pane.
3. After creating a new dataset, the "Add data" pane is automatically opened.

<figure id="fig-graphs-page">
  <img src="../../assets/graphs-page.png">
  <figcaption>Figure 3a. The Graphs page of a dataset.</figcaption>
</figure>

<figure id="fig-dataset-homepage-no-data">
  <img src="../../assets/dataset-homepage-no-data.png">
  <figcaption>Figure 3b. The Graphs page of a dataset.</figcaption>
</figure>

### Inside the “Add data” pane

The “Add data” pane is now displayed (see [Figure 4](#fig-add-data-pane)).

<figure id="fig-add-data-pane">
  <img src="../../assets/add-data-pane.png">
  <figcaption>Figure 4. The “Add data” pane.</figcaption>
</figure>

In the "Add data" pane, choose one of the following approaches for adding data:

<dl>
  <dt>"Add data from an existing dataset"</dt>
  <dd>Search for data from a dataset that you have access to in the TriplyDB system. After you have found a dataset, you can choose which graphs to add. See Section <a href="#add-data-from-an-existing-dataset">Add data from an existing dataset</a> for more details.</dd>
  <dt>"Add data from URL"</dt>
  <dd>Enter a URL to a data file that is published online. The URL must be publicly accessible. The URL must point to a file that contains RDF or CSV data. See Section <a href="#add-data-from-url">Add data from a URL</a> for more details.</dd>
  <dt>"Add data from files"</dt>
  <dd>Click the cloud icon to open a file explorer window, in which you can select one or more files from your computer. Alternatively, drag-and-drop the local files from your computer onto the cloud icon with the upward pointing arrow. Files must contain RDF or CSV data. See Section <a href="#add-data-from-files">Add data from files</a> for more details.</dd>
</dl>

### Add data from an existing dataset

The first option for adding data is to add it from datasets that are already published in the same TriplyDB instance. This is done with the “Add data from an existing dataset” field. By typing in this field, a dropdown list of existing datasets is shown (see [Figure 5](#fig-add-data-from-an-existing-dataset-field)).

<figure id="fig-add-data-from-an-existing-dataset-field">
  <img src="../../assets/add-data-from-an-existing-dataset-field.png">
  <figcaption>Figure 5. The dropdown list that shows existing datasets.</figcaption>
</figure>

Once the correct dataset appears in the dropdown list, click it to select it. This will open the "Import from dataset" pane (see [Figure 6](#fig-add-data-from-an-existing-dataset-choose-graphs)). You can choose which graphs to import from the existing dataset. Click "Import graphs" to start importing from an existing dataset. Moments later, the graphs are added to your dataset.

<figure id="fig-add-data-from-an-existing-dataset-choose-graphs">
  <img src="../../assets/add-data-from-an-existing-dataset-choose-graphs.png">
  <figcaption>Figure 6. The "Import from dataset" pane.</figcaption>
</figure>

### Add data from URL

The second option for adding data is to add it from an online URL. This is done by entering the URL inside the “Add data from a URL” text field (see [Figure 7](#fig-add-data-from-a-url-field)). After you have entered the URL, click the orange button on the right to start adding data. The data is now being downloaded to your dataset. How long this takes depends on the size of the data and the speed of the remote server where the data is retrieved from.

<figure id="fig-add-data-from-a-url-field">
  <img src="../../assets/add-data-from-a-url-field.png">
  <figcaption>Figure 7. The "Add data from URL" field.</figcaption>
</figure>

Only URLs that contain supported data formats will be added. See Section [Supported data formats](#supported-data-formats) for more information.

### Add data from files

The third option for adding data is to add it from files that are on your computer. This can be done in two ways:

1. Click the cloud icon to open a file finder dialog. Here you can select one or more files from your computer (see [Figure 8](#fig-add-data-from-files-dialog)). The file finder dialog that opens, depends on your Operating System. In [Figure 8](#fig-add-data-from-files-dialog), the Windows file finder dialog is shown.
2. Drag-and-drop one or more files from your computer onto the cloud icon with the upward pointing arrow.

<figure id="fig-add-data-from-files-dialog">
  <img src="../../assets/add-data-from-files-dialog.png">
  <figcaption>Figure 8. The file finder dialog that is opened when adding data from files.</figcaption>
</figure>

After you have added one of more files, a list of uploaded appears (see [Figure 9](#fig-add-data-from-files-job)). You can add or remove more files, until you have the complete upload job configured. Once the list of files is complete, you can click "Import from files" to start adding data from files. How long this takes depends on the size of the data.

<figure id="fig-add-data-from-files-job">
  <img src="../../assets/add-data-from-files-job.png">
  <figcaption>Figure 9. The list of uploaded files in the "Add data from files" pane.</figcaption>
</figure>

Only files that contain supported data formats will be added. See Section [Supported data formats](#supported-data-formats) for more information.

### Supported data formats

Files must contain RDF, CSV, TSV, XML or JSON data, and must use one of the supported file name extensions:

| **Data Format**                                     | **File name extension** |
| --------------------------------------------------- | ----------------------- |
| [Comma-Separated Values (CSV)](#csv-and-tsv-format) | `.csv`                  |
| [Tab-Separated Values (CSV)](#csv-and-tsv-format)   | `.tsv`                  |
| [XML](#xml-format)                                  | `.xml`                  |
| [GPX](#xml-format)                                  | `.gpx`                  |
| [JSON](#json-format)                                | `.json`, `.jsonl`, `.ndjson` |
| JSON-LD                                             | `.jsonld`               |
| N-Quads                                             | `.nq`                   |
| N-Triples                                           | `.nt`                   |
| RDF/XML                                             | `.rdf`, `.rdfs`, `.owl`, `.owx` |
| TriG                                                | `.trig`                 |
| Turtle                                              | `.ttl`, `.n3`           |

It is possible to upload up to 1,000 separate files in this way. When you have a lot of files and/or large files, it is better to compress them into an archive format. This allows an any number of files of any size to be uploaded. The following archive/compression formats are supported:

| **Archive format** | **File name extension** |
| ------------------ | ----------------------- |
| gzip               | `.gz`                   |
| bzip2              | `.bz2`                  |
| tar                | `.tar`, `.tgz`          |
| XZ                 | `.xz`                   |
| ZIP                | `.zip`                  |

### CSV and TSV format

When you upload CSV (Comma-Separated Values) or TSV (Tab-Separated Values) files to TriplyDB, they are automatically converted to RDF and stored in two linked data representations:

1. **Facade-X representation**: An expressive RDF model that preserves the full structure
   of the tabular data. The model is documented in detail [here](https://sparql-anything.readthedocs.io/stable/formats/CSV/).
2. **Simple representation**: A straightforward row-based model for easier querying



**Simple representation:**

The simple representation provides a more opinionated and direct mapping, and is suitable
for tables with a simple structure:

- A table resource is created that links to all rows via `rdfs:member`
- Each row gets a unique IRI based on the row number (e.g., `.../row/1`, `.../row/2`, etc.)
- Column headers become properties in the `https://triplydb.com/table/triply/def/` namespace
- Each property has an `rdfs:label` with the original column header name
- Cell values are stored as string literals

Take for example this CSV file:

```csv
product_id,name,category,price,in_stock
P001,Laptop Stand,Office Equipment,49.99,true
P002,Ergonomic Keyboard,Peripherals,89.50,true
```

This can be queried as such:

```sparql
prefix table: <https://triplydb.com/table/triply/def/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?name ?category ?price where {
  ?table rdfs:member ?row .
  ?row table:name ?name ;
       table:category ?category ;
       table:price ?price .
}
```

### XML format

When you upload XML files to TriplyDB, they are automatically converted to RDF using the Facade-X data model. This preserves the hierarchical structure of the XML document, making it queryable via SPARQL.
See [here](https://sparql-anything.readthedocs.io/stable/formats/XML/) for more details on the Facade-X XML data model.

### JSON format

When you upload JSON files to TriplyDB, they are automatically converted to RDF using the Facade-X
data model, the same model that is used for [XML](#xml-format) and [tabular](#csv-and-tsv-format)
uploads. This preserves the structure of the JSON document, making it queryable via SPARQL. See
[here](https://sparql-anything.readthedocs.io/stable/formats/JSON/) for more details on the Facade-X
JSON data model.

Note that `.json` files are read as plain JSON. Use the `.jsonld` extension for
[JSON-LD](https://www.w3.org/TR/json-ld11/) documents, so that their `@context` is interpreted.

Objects and arrays are both mapped to containers: the members of an object are linked by their key,
the members of an array by their position.

- The document itself is typed `<http://sparql.xyz/facade-x/ns/root>`.
- Object keys become properties in the `https://triplydb.com/json/def/` namespace. Spaces and
  non-ASCII characters in a key are percent-encoded, so the key `with space` becomes
  `https://triplydb.com/json/def/with%20space`.
- Array members are linked by the container membership properties `rdf:_1`, `rdf:_2`, and so on, in
  the order in which they appear.
- Strings become plain literals, booleans become `xsd:boolean` literals, and numbers become
  `xsd:decimal` literals. An exponent is expanded, because it is not part of the lexical space of
  `xsd:decimal`: `1e10` becomes `10000000000`. Digits are never rounded away, so a number that does
  not fit a 64-bit float — `1234567890123456789`, `0.000000000000000001` — keeps its full precision.
- Uploads are information-preserving: a `null` is kept as the IRI
  `https://triplydb.com/json/def/null` rather than dropped, and a key that occurs twice in the same
  object yields both values.

Take for example this JSON file:

```json
{
  "name": "Friends",
  "genres": ["Comedy", "Romance"],
  "cast": [
    { "actor": "Jennifer Aniston", "role": "Rachel" },
    { "actor": "Matt LeBlanc", "role": "Joey" }
  ]
}
```

This can be queried as such:

```sparql
prefix def: <https://triplydb.com/json/def/>
prefix fx: <http://sparql.xyz/facade-x/ns/>

select ?name ?actor ?role where {
  ?show a fx:root ;
        def:name ?name ;
        def:cast ?cast .
  ?cast ?position ?member .
  ?member def:actor ?actor ;
          def:role ?role .
}
```

The position of an array member is part of its predicate, so a variable in that position —
`?position` above — iterates over every member, while `rdf:_1` selects only the first one.

A single file may hold several JSON documents, one after the other; each becomes its own root
resource. This is what the `.jsonl` and `.ndjson` extensions of
[JSON Lines](https://jsonlines.org) are for, but it works for a `.json` file with concatenated
documents as well.

### Adding malformed data

TriplyDB only allows valid RDF data to be added. If data is malformed, TriplyDB will show an error message that indicates which part of the RDF data is malformed (see screenshot). If such malformed data is encountered, the RDF file must first be corrected and uploaded again.

![Screenshot of an error message indicating syntactically malformed RDF data](../../assets/upload-error.png)

TriplyDB follows the linked data standards strictly. Many triple stores allow incorrect RDF data to be added. This may seem convenient during the loading phase, but often results in errors when standards-compliant tools start using the data.

## Assets: binary data

Not all data can be stored as RDF data. For example images and video files use a binary format. Such files can also be stored in TriplyDB and can be integrated into the Knowledge Graph.
