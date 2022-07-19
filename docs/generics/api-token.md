---
title: "API Token"
path: "/docs/api-token"
---

Applications (see [TriplyDB.js](triplydb-js)) and pipelines (see [RATT](ratt)) must often have special access rights to interact with TriplyDB instances.  For example, some datasets may not be public and are only accessible through an API Token.  Pipelines must often add new data to an existing dataset in TriplyDB, which requires write access.

Reading non-public data and writing any kind of data requires a TriplyDB API Token.  The token ensures that only accounts that are specifically authorized to access certains datasets are able to access and/or modify those datasets.

The following steps must be performed in order to configure an API Token:

1. Log into the TriplyDB instance where you want to publish the results of your pipeline to.

   You may either have an account at a dedicated TriplyDB instance within your organization, or you may create a free account at [TriplyDB.com](https://triplydb.com).

2. Go to your user settings page.  This page is reached by clicking on the user menu in the top-right corner and choosing “User settings”.

3. Go to the “API tokens” tab.

4. Click on “Create token”.

5. Enter a name that describes the purpose of the token.

   The name of the application or pipeline that uses the API Token is often a good name for the token.

6. Choose the permission level that is sufficient for what you want to do with the token:

   - Management access: if your application must be able to create one or more organizations within the TriplyDB instance.

   - Write access: if your application must change (meta)data in the TriplyDB instance.

   - Read access: if your application must access private data in the TriplyDB instance.  (For access to public data you do not need an API token.)

7. Click the “Create” button to create your token.  The token (a long sequence of characters) will now appear in a dialog.

8. Copy the token.  For security reasons, the token will only be shown to you this one time.

9. [Create an environment variable](environment-variable) whose name is `TRIPLYDB_TOKEN` and whose value is the token copied in step 8.

You can test whether the environment variable has been configured correctly by running the following command in a terminal on Linux:
```sh
echo $TRIPLYDB_TOKEN
```

or on Windows with PowerShell:
```powershell
$env:TRIPLYDB_TOKEN
```
