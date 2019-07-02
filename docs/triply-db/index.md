---
title: "Triply-DB"
path: "/docs/triply-db"
---
This document describes the TriplyDB product. This document is a
work-in-process. Contact
[support@triply.cc](mailto:support@triply.cc) for more information.

## Introduction

## Uploading Data

This section explains how to create a Linked Dataset in TriplyDB.
This includes setting the access level, uploading RDF data, setting
metadata, and starting services.

### Creating a new dataset

1. Log into a TriplyDB instance.

2. Click the plus button on the dataset pane that appears on the
   right-hand side of the screen (see screenshot).

3. This brings up the dialog for creating a new dataset. You must
   enter a dataset name that consists of alphanumeric characters
   (`A-Za-z0-9`) and hyphens (`-`).

4. Optionally enter a dataset description. This can be either test
   or Markdown. You can also change the access level of the
   dataset, which is set to “Private” by default.

![The “Add dataset” dialog](add-dataset-dialog.png) The “Add dataset” dialog.

### Creating Data

#### Best Practices

#### Using assets

### Adding data

Once the dataset is created, the “Add data” view is displayed (see
screenshot). In this view data can be added in three ways: file
upload, URL upload, and data import. The following screenshot shows
the “Add data” view, with the three approaches displayed on top of one
another.

![The “Add data” view](add-data.png) The “Add data” view.

#### Adding data by file upload

In this view RDF files can be uploaded, either by
clicking on the cloud icon and selecting files through the “Open file”
dialog, or by dragging-and-dropping files onto the cloud icon. The
following RDF serialization formats are supported:

- N-Quads 1.1, file name extension `nq`.
- N-Triples 1.1, file name extension `nt`.
- RDF/XML 1.1, file name extension `rdf`.
- TriG, file name extension `trig`.
- Turtle 1.1, file name extension `ttl`.

One or more files can be uploaded. It is also possible to upload
compressed files and archives. When the number of files exceeds
1.000, it is better to upload one archive file that contains them all.
This allows an arbitrary number of files to be uploaded.

##### Adding malformed data

TriplyDB only allows valid data to be added. If data is malformed,
TriplyDB will show an error message that indicates which part of the
data is malformed (see screenshot). If such malformed data is
encountered, the RDF file must first be corrected and uploaded again.

![Screenshot of an error message indicating syntactically malformed RDF data](upload-error.png) Screenshot of an error message indicating syntactically malformed RDF data.

#### Adding data by URL upload

The second option for adding data is to include it from an online URL
location. This is done by entering the URL inside the “Add data from
a URL” text field.

#### Adding data by import

The third option for adding data is to import from datasets that are
published in the same TriplyDB instance. This is done with the “Add
data from an existing dataset” dropdown list (see screenshot).

## Publishing Data

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

By default, datasets in TriplyDB can be queried through the [[Triply
Client]] as well as through the Linked Data Fragments API.

In order to allow additional query paradigms, specific services can be
started from the “Create service” page. This page is accessed by
clicking on the “Services” icon in the left-hand sidebar (see
screenshot).

TriplyDB instances can be configured with different types of services.
The below screenshot shows the “Create service” page for a TriplyDB
instance that allows SPARQL, Jena SPARQL, and ElasticSearch services
to be created.

![The “Create service” page](create-service.png) The “Create service” page. Notice that three different types of services can be created.

It is possible to create multiple services for one dataset.

#### Existing services

Existing services are displayed on service widgets (see screenshot).
From these widgets, services can be created, deleted, stopped, and
restarted.

If data is added to and/or remove from the dataset later. The service
can also be synchronized by pressing the synchronization button that
appears on the service widget.

![An example of a service widget](service-widget.png) An example of a service widget.

## Viewing Table

### LinkedData Browser

### Tabular browser

## Text search

### Text search GUI

### Text search API

The text search API returns a list of Linked Data entities based on a
supplied text string. The text string is matched against the text in
literals and IRIs that appear in the Linked Data description of the
returned entities.

The text search API is only available for a dataset after an
ElasticSearch service has been created for that dataset.

#### URI path

Text search requests are sent to the following URI path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/search
```

#### Reply format

The reply format is a JSON object. Search results are returned in the
JSON array that is stored under key sequence `"hits"/"hits"`. The
order in which search results appear in the array is meaningful:
better matches appear earlier.

Every search result is represented by a JSON object. The name of the
Linked Data entity is specified under key sequence `"_id"`.
Properties of the Linked Data entity are stored as IRI keys. The
values of these properties appear in a JSON array in order to allow
more than one object term per predicate term (as is often the case in
Linked Data).

The following code snippet shows part of the reply for the below
example request. The reply includes two results for search string
“mew”, returning the Pokémon Mew (higher ranked result) and Mewtwo
(lower ranked result).

```json
{
  "hits": {
    "hits": [
      {
        "_id": "https://triply.cc/academy/pokemon/id/pokemon/mew",
        "http://open vocab org/terms/canonicalUri": [ "http://pokedex.dataincubator.org/pokemon/151" ],
        "https://triply cc/academy/pokemon/def/baseAttack": [ 100 ],
        "https://triply cc/academy/pokemon/def/name": [ "MEW", "MEW", "MEW", "MEW", "MEW", "ミュウ" ],
        …
      },
      {
        "_id": "https://triply.cc/academy/pokemon/id/pokemon/mewtwo",
        "http://open vocab org/terms/canonicalUri": [ "http://pokedex.dataincubator.org/pokemon/150" ],
        "https://triply cc/academy/pokemon/def/baseAttack": [ 110 ],
        "https://triply cc/academy/pokemon/def/name": [ "MEWTU", "MEWTWO", "MEWTWO", "MEWTWO", "MEWTWO", "ミュウツー" ],
        …
      }
    ]
  },
  …
}
```

#### Example

```bash
curl 'https://api.demo.triply.cc/datasets/academy/pokemon/services/text/search?query=mew'
```

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

| *Icon* | *Account type* |
|--------|----------------|
|        | organization   |
|        | user           |
