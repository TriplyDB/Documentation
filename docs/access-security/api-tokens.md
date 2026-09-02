[TOC]

<!-- SOURCE: generics/api-token.md, reused near-verbatim. That page was an orphan in the
     old structure — present in the repository, reachable by URL, absent from mkdocs.yml.
     Its YAML front matter (title, path /docs/api-token) was dropped; see the review block.
     Four pages in data-apps/saved-queries/ already link here. Redirect required. -->

# API tokens

Applications built with [TriplyDB.js](../triplydb-js/index.md) and pipelines built with
[TriplyETL](../triply-etl/index.md) often need access rights to interact with a TriplyDB
instance. Reading non-public data, and writing any data at all, requires an API token. The token
ensures that only users specifically authorised for a dataset can read or change it.

## Create a token

1. Log in to the TriplyDB server where you have an account and want the access rights.

   Many organisations run their own TriplyDB server. If yours does not, you can create a free
   account at [TriplyDB.com](https://triplydb.com).

2. Open your user settings page, from the user menu in the top-right corner.
3. Go to the **API tokens** tab.
4. Click **Create token**.
5. Enter a name describing what the token is for — typically the application or pipeline that
   will use it.

   The name is how you manage the token later, so you can revoke tokens for applications you no
   longer run. Create a separate token per application rather than reusing one.

6. Configure the token's permissions. Permissions are individually selectable, so you can grant
   only the access the application needs.

   Use the category filters — Read, Update, Datasets, Organization, Queries, Stories — or the
   search field to find what you need. Select the minimum that will do the job.

7. Click **Create**.

The token, a long sequence of characters, appears in a dialog. **It is shown only once.** Copy it
into the application before closing the dialog.

## What a token can and cannot do

A token can never grant more permissions than you already have through the interface. If you only
have read access to a dataset, a token of yours cannot write to it — no matter which permissions
you select.

This also means a token's reach changes with yours. If your own access is reduced, the token's is
reduced with it.

For how permissions are structured, see [Roles and permissions](roles-and-permissions.md).

