<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet
     <!- - PARKED - ->        link target is held for the Access & security chapter

     ORIGIN: this page is triply-db-getting-started/uploading-data/index.md.
     Everything except the reference tables moves here; the format tables move to
     triplydb/reference/file-formats.md. Redirect required — see the review block. -->

# Upload data

This guide covers getting data into TriplyDB: creating a dataset, then filling it
from another dataset, from a URL, or from files on your computer.

You must be logged in to create a dataset.

<!-- SOURCE: uploading-data/index.md — the whole of this page, restructured into
     task order. Section order, steps and screenshots are unchanged. -->

<!-- The source page carries an unresolved TODO here:
     "See page [logging in](../logging-in/index.md) for more information."
     That page does not exist. Either write it or drop the reference. -->

## Create a dataset

### Open the "Create dataset" dialog

There are two ways in:

1. From the home screen, click the `+` button next to "Your datasets", on the
   right-hand side.
2. From your user screen, click the "Create dataset" button on the right-hand
   side.

![The home screen for a logged-in user, with the plus button beside "Your datasets"](../../assets/home-screen-logged-in.png)

![The user screen for a logged-in user, with the "Create dataset" button](../../assets/user-screen-logged-in.png)

### Fill in the dialog

![The "Create dataset" dialog](../../assets/add-dataset-dialog.png)

1. **Enter a dataset name.** Required. Names may contain letters, numbers and
   hyphens.
2. **Enter a display name.** Optional. Shown in the interface and included in the
   dataset metadata.
3. **Enter a description.** Optional. Shown in the interface and included in the
   metadata. Markdown is supported — see
   [Markdown support](../reference/markdown.md).
4. **Set the access level.** Optional. New datasets are Private by default. See
   [Access and security](../../access-security/index.md).
   <!-- LINK-TODO: points at the chapter index for now. Refine to the specific
        access-levels page once that chapter is written.
        Original link: ../reference/index.md#access-levels -->

The dataset is created and the "Add data" pane opens.

## Add data

You need a dataset before you can add data to it.

### Open the "Add data" pane

Three ways in:

1. From the Graphs page, click "Import a new graph".
2. From the dataset homepage of an empty dataset, click the message shown there.
3. Immediately after creating a dataset, where the pane opens on its own.

![The Graphs page of a dataset](../../assets/graphs-page.png)

![The homepage of a dataset that has no data yet](../../assets/dataset-homepage-no-data.png)

![The "Add data" pane](../../assets/add-data-pane.png)

The pane offers three sources. Each is described below.

### Add data from an existing dataset

Use this to copy graphs out of a dataset already published on the same TriplyDB
instance, provided you have access to it.

Type in the "Add data from an existing dataset" field. A dropdown of matching
datasets appears.

![The dropdown list showing existing datasets](../../assets/add-data-from-an-existing-dataset-field.png)

Click the dataset to open the "Import from dataset" pane, choose which graphs to
import, and click "Import graphs". The graphs are added moments later.

![The "Import from dataset" pane, with graphs to choose from](../../assets/add-data-from-an-existing-dataset-choose-graphs.png)

### Add data from a URL

Use this for data already published online. The URL must be publicly accessible
and must point to a file containing RDF or CSV data.

Enter the URL in the "Add data from a URL" field and click the orange button to
the right. How long the download takes depends on the size of the data and the
speed of the remote server.

![The "Add data from URL" field](../../assets/add-data-from-a-url-field.png)

Only [supported data formats](../reference/file-formats.md) are added.

### Add data from files

Use this for files on your own computer, in either of two ways:

1. Click the cloud icon to open a file finder, and select one or more files.
2. Drag and drop files from your computer onto the cloud icon.

![The file finder dialog opened from the cloud icon](../../assets/add-data-from-files-dialog.png)

A list of the files appears. Add or remove files until the upload job is
complete, then click "Import from files". How long this takes depends on the size
of the data.

![The list of uploaded files in the "Add data from files" pane](../../assets/add-data-from-files-job.png)

Only [supported data formats](../reference/file-formats.md) are added. Up to
1,000 separate files can be uploaded at once; beyond that, or for large files,
compress them into an archive first.

## When data is rejected

TriplyDB accepts only valid RDF. Malformed data is refused with an error message
identifying the part of the file at fault. Correct the file and upload it again.

![An error message indicating syntactically malformed RDF data](../../assets/upload-error.png)

This is deliberate. Many triple stores accept incorrect RDF, which is convenient
while loading and produces errors later, once standards-compliant tools start
using the data.

## Assets: binary data

Not everything is RDF. Images, video and other binary files can be stored in
TriplyDB as **assets** and integrated into the knowledge graph.

<!-- NEW: nothing beyond the two sentences above exists in the source. This
     section needs writing: how to upload an asset, where assets appear in the
     interface, how to reference one from a triple, and any size limits.
     It is the thinnest part of the original page. -->

## Related

- [Supported file formats](../Reference/file-formats.md) — what TriplyDB accepts,
  and how CSV, TSV and XML are converted
- [Publish data](publish-data.md) — making a dataset available to others
  <!-- LINK-TODO: page not written yet -->
- [Export data](export-data.md) — getting data back out
  <!-- LINK-TODO: page not written yet -->
- [Linked data](../../academy/linked-data.md) — what triples and graphs are


- **The "Assets" section needs writing.** The original is two sentences and
  explains nothing about how to upload or use one.
- **An unresolved TODO was carried over**: the original points at a "logging in"
  page that does not exist.
- **A commented-out paragraph was dropped**, not migrated. It concerned public
  datasets being indexed by search engines; `publish-data.md` already makes that
  point under "Make a dataset public", so carrying it over would have duplicated.
