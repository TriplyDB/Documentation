---
title: "API Token"
path: "/docs/api-token"
---

[TOC]

Applications (see [TriplyDB.js](/triplydb-js)) and pipelines (see [TriplyETL](/triply-etl)) often require access rights to interact with TriplyDB instances. Specifically, reading non-public data and writing any (public or non-public) data requires setting an API token. The token ensures that only users that are specifically authorized for certain datasets are able to access and/or modify those datasets.

The following steps must be performed in order to create an API token:

1. Log into the web GUI of the TriplyDB server where you have an account and for which you want to obtain special access rights in your application or pipeline.

   Many organizations use their own TriplyDB server. If your organization does not yet have a TriplyDB server, you can also create a free account over at [TriplyDB.com](https://triplydb.com).

2. Go to your user settings page. This page is reached by clicking on the user menu in the top-right corner and choosing “User settings”.

3. Go to the “API tokens” tab.

4. Click on “Create token”.

5. Enter a name that describes the purpose of the token. This can be the name of the application or pipeline for which the API token will be used.

   You can use the name to manage the token later. For example, you can remove tokens for applications that are no longer used later on. It is good practice to create different API tokens for different applications.

6. Choose the permission level that is sufficient for what you want to do with the API token. Notice that “Management access” is often not needed. “Read access” is sufficient for read-only applications. “Write access” is sufficient for most pipelines and applications that require write access.

   - Management access: if your application must create or change organization accounts in the TriplyDB server.

   - Write access: if your application must write (meta)data in the TriplyDB server.

   - Read access: if your application must read public and/or private data from the TriplyDB server.

7. Click the “Create” button to create your token. The token (a long sequence of characters) will now appear in a dialog.

   For security reasons, the token will only be shown once. You can copy the token over to the application where you want to use it.
