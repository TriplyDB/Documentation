---
title: "Triply-DB"
path: "/docs/triply-db-getting-started"
---

This document describes the TriplyDB product. This document is a
work-in-process. Contact
[support@triply.cc](mailto:support@triply.cc) for more information.

## Introduction

TriplyDB is our high-performance Linked Data hosting and publishing product. TriplyDB allows you to easily upload datasets and expose them through multiple APIs (including SPARQL, RESTful, and text search). [Read More](/products/graph)

## Uploading Data

This section explains how to create a Linked Dataset in TriplyDB.

### Creating a new dataset

1. Log into a TriplyDB instance.

2. Click the plus button on the dataset pane that appears on the
   right-hand side of the screen (see screenshot).

3. This brings up the dialog for creating a new dataset. You must
   enter a dataset name that consists of alphanumeric characters
   (`A-Za-z0-9`) and hyphens (`-`).

4. Optionally enter a dataset description. This can be either text
   or Markdown. You can also change the access level of the
   dataset, which is set to “Private” by default.

![The “Add dataset” dialog](add-dataset-dialog.png)

### Adding data

Once the dataset is created, the “Add data” view is displayed (see
screenshot). In this view data can be added in three ways: file
upload, URL upload, and data import. The following screenshot shows
the “Add data” view, with the three approaches displayed on top of one
another.

![The “Add data” view](add-data.png)

#### Adding data by file upload

In this view RDF files can be uploaded, either by
clicking on the cloud icon and selecting files through the “Open file”
dialog, or by dragging-and-dropping files onto the cloud icon. The
following RDF serialization formats are supported:

| Serialization Format | Extensions     |
| -------------------- | -------------- |
| N-Quads 1.1          | `.nq`          |
| N-Triples 1.1        | `.nt`          |
| RDF/XML 1.1          | `.rdf`         |
| TriG                 | `.trig`        |
| Turtle 1.1           | `.ttl`         |
| N3                   | `.n3`          |
| OWL                  | `.owx`, `.owl` |

One or more files can be uploaded. It is also possible to upload
compressed files and archives. When the number of files exceeds
1.000, it is better to upload one archive file that contains them all.
This allows an arbitrary number of files to be uploaded. The following archive/compression formats are supported:

| archive/compression | Extensions    |
| ------------------- | ------------- |
| gzip                | `.gz`         |
| bzip2               | `.bz2`        |
| tar                 | `.xz` , `tar` |
| ZIP                 | `.zip`        |

##### Adding malformed data

TriplyDB only allows valid data to be added. If data is malformed,
TriplyDB will show an error message that indicates which part of the
data is malformed (see screenshot). If such malformed data is
encountered, the RDF file must first be corrected and uploaded again.

![Screenshot of an error message indicating syntactically malformed RDF data](upload-error.png)

#### Adding data by URL upload

The second option for adding data is to include it from an online URL
location. This is done by entering the URL inside the “Add data from
a URL” text field.

#### Adding data by import

The third option for adding data is to import from datasets that are
published in the same TriplyDB instance. This is done with the “Add
data from an existing dataset” dropdown list (see screenshot).

### Best Practices

### Using Assets

By adding assets to your datasets you are able expose data like images

## Publishing Data

TriplyDB allows you to publish your data.

### Entering metadata

Adding metadata to your datasets is important. This makes it easier
to find your dataset later and also allows search engines and social
media applications to understand your dataset.

Metadata is entered from the dataset settings page, which is accessed
by clicking on the “Dataset settings” (cog icon) option from the
left-hand sidebar (see screenshot).

![“Dataset settings” page](cog-wheel.png) The dataset homepage looks empty without metadata. Notice the cog wheel icon, which provides access to the “Dataset settings” page.

The dataset settings page allows the following metadata to be entered:

- The dataset description. This can consist of text with (optional) Markdown formatting.
- The avatar (image) of the dataset.
- The access level of the dataset.
- The topics of the dataset.
- The example resources for the dataset.
- The license of the dataset.

![The dataset settings page](dataset-settings-page.png) The dataset settings page allows valious forms of dataset metadata to be added.

The same dataset looks nicer once metadata has been entered:

![The dataset home page](dataset-homepage-with-metadata.png) The dataset home page after metadata has been entered.

Search engines and social media applications can recognize the
metadata that is entered for datasets in TriplyDB. The following
screenshot shows the widget created by the Slack chat application upon
entering a link to the dataset. Notice that the chay application
understands metadata properties like title, description, and image.

![A Slack widget](slack-widget.png) Widget created by the Slack chat application upon sharing a link to a dataset in TriplyDB.

### Starting services

By default, datasets in TriplyDB can be queried through the [Triply Client](/docs/triply-client) as well as through the Linked Data Fragments API.

In order to allow additional query paradigms, specific services can be
started from the “Create service” page. This page is accessed by
clicking on the “Services” icon in the left-hand sidebar (see
screenshot).

TriplyDB instances can be configured with different types of services.
The below screenshot shows the “Create service” page for a TriplyDB
instance that allows SPARQL, Jena SPARQL, and ElasticSearch services
to be created.

![The “Create service” page](create-service.png) Notice that three different types of services can be created.

It is possible to create multiple services for one dataset.

#### Existing services

Existing services are displayed on service widgets (see screenshot).
From these widgets, services can be created, deleted, stopped, and
restarted.

If data is added to and/or remove from the dataset later. The service
can also be synchronized by pressing the synchronization button that
appears on the service widget.

![An example of a service widget](service-widget.png)

## Viewing Data

TriplyDB offers several ways to explore your datasets.

### LinkedData Browser

The linked data browser offers to traverse the data by focussing on node at the time and follow the graph to other points
![Image of the linked Data Browser]()

### Tabular browser

The tabular browser show the dataset in a table supported by [Triple Pattern Fragments (TPF)](/docs/triply-api#Triple-Pattern-Fragments-(TPF))

### SPARQL IDE

The SPARQL IDE to show your data on a map, graph a timeline and even more.
[More Information](/docs/sparql-ide)

### Text-Search

Text search allows your data the data to be searched like an search engine.

## Saved Queries

Saving queries allow you to create a link to an query which you are able to update as your data updates without having to recreate links.

### How to save a saved query

There are two ways to create an save query.
_You need to be logged in and have authorization rights on the dataset to use this feature_

1. When working from the [Sparql-IDE](/docs/sparql-ide)
2. Using the Saved Queries tab in a dataset

Creating a saved query with the SPARQL-IDE is done by simple writing a query/visualization that you're happy with and hitting the save button
![The save query button highlighted]()

### Creating a new version

Updating the saved query can be simply done by clicking a query in the Saved Queries tab and editing the query or the visualization. Hit the save button to save it as a new version

### Using a saved query

To use the saved query for example in Data Stories you can use the following link to share the **latest** version of the query

```url
https://triplydb.com/dbpedia/core/queries/Timelined-Cars-BETA
```

To share a specific version use just add a slash and the version nu,ber

```url
https://triplydb.com/dbpedia/core/queries/Timelined-Cars-BETA/6
```

#### Using a saved query in Data Stories

## Admin tasks

Admin tasks are performed within the admin settings page. The
following steps bring up the admin settings page:

1. In order to perform admin tasks, a user with admin credentials
   must be logged into TriplyDB. See [[Logging in]] for how to log into
   TriplyDB.

2. Once an admin is logged in, the admin settings are accessed by
   clicking on the user menu in top-right corner and selecting the
   “Admin settings” menu item.

This brings up the following admin settings page from which admin
tasks can be performed:

![Screenshot of the admin settings page](admin-settings.png) Screenshot of the admin settings page.

### Create a new user

New users can only be created by administrators by performing the
following steps:

1. Log in as an administrator, click on the “Admin settings” link in
   the user menu (top-right corner) and click the “Accounts” tab.
   This brings up an overview of all users and organizations on the
   TriplyDB instance.

2. Click the “Add user” button.

3. Fill in the user name and email address of the prospective user.
   The user name must consist of alphanumeric characters (`A-Za-z`)
   and hyphens (`-`).

4. Click the “Add user” button. This sends an account creation
   email to the prospective user, containing a link that allows them
   to log in.

In addition to the above default procedure, the following two options
are provided for user account creation:

- Temporary account :: By default, user accounts do not expire.
  Sometimes it is useful to create a temporary account by specifying
  a concrete data in the “Account expiration date” widget.

- Preset password :: By default, a user can set her password after
  logging in for the first time by clicking on the link in the
  account creation email. When a password is entered in the
  “Password” field, the user must enter this password in order to
  log in for the first time.

### Account overview

Go to the “Accounts tab” to receive an overview of all accounts on the
TriplyDB instance.

The type of account can be observed based on the following icons:

| _Icon_ | _Account type_ |
| ------ | -------------- |
|        | organization   |
|        | user           |
