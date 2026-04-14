---
title: "API Token"
path: "/docs/api-token"
---

[TOC]

# API Token

Applications (see [TriplyDB.js](../triplydb-js/index.md)) and pipelines (see [TriplyETL](../triply-etl/index.md)) often require access rights to interact with TriplyDB instances. Specifically, reading non-public data and writing any (public or non-public) data requires setting an API token. The token ensures that only users that are specifically authorized for certain datasets are able to access and/or modify those datasets.

The following steps must be performed in order to create an API token:

1. Log into the web GUI of the TriplyDB server where you have an account and for which you want to obtain special access rights in your application or pipeline.

   Many organizations use their own TriplyDB server. If your organization does not yet have a TriplyDB server, you can also create a free account over at [TriplyDB.com](https://triplydb.com).

2. Go to your user settings page. This page is reached by clicking on the user menu in the top-right corner and choosing “User settings”.

3. Go to the “API tokens” tab.

4. Click on “Create token”.

5. Enter a name that describes the purpose of the token. This can be the name of the application or pipeline for which the API token will be used.

   You can use the name to manage the token later. For example, you can remove tokens for applications that are no longer used later on. It is good practice to create different API tokens for different applications.

6. Configure the permissions for the API token. Permissions are individually selectable, allowing you to grant only the specific access your application needs.

   Use the category filters (e.g. Read, Update, Datasets, Organization, Queries, Stories) to find relevant permissions, or use the search field to filter by name. Select the permissions that are sufficient for what you want to do with the API token. It is good practice to select the minimum set of permissions required for your use case.

   Note that a token can never grant more permissions than you already have through the user interface. For example, if you only have read access to a dataset, the token cannot grant write access to that dataset.

7. Click the “Create” button to create your token. The token (a long sequence of characters) will now appear in a dialog.

   For security reasons, the token will only be shown once. You can copy the token over to the application where you want to use it.
