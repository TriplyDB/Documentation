---
title: "TriplyETL: Generator"
path: "/docs/triply-etl/generator"
---

The TriplyETL Generator allows you to set up a new TriplyETL project.

## Prerequisites

In order to use the TriplyETL Generator, you must have the following things:
- A TriplyETL License Key.
- A user account on a TriplyDB server.

Contact <mailto:info@triply.cc> for more information.

## Installation

Perform the following steps to install the TriplyETL Generator on your computer:

1. Go to <https://nodejs.org> and install Node.js version 18.

2. Open a command line and install NPX:

```
npm install -g npx
```

## Using TriplyETL Generator

Perform the following steps for setting up a new TriplyETL project:

1. Run the TriplyETL Generator:

```
npx triply-etl-generator
```

2. Answer the following questions:

      a. Project name

      b. Target folder

      c. Dataset name

      d. TriplyDB URL

      e. TriplyDB email

      f. TriplyDB password

    Here is an example of a possible run:

    ```
    npx triply-etl-generator
    ? Project name: my-etl
    ? Target folder: my-etl
    ? Dataset name: my-etl
    ? Create a new TriplyDB API Token? Yes
    ? Your TriplyDB URL: triplydb.com
    ? Your TriplyDB email: my-account@my-organisation.com
    ? Your TriplyDB password: [hidden]
    🏁 Your project my-etl is ready for use in /path/to/my-etl.
    ```

3. Go to the target folder:

   ```
   cd /path/to/my-etl
   ```

4. Run the ETL:

   ```
   npx etl
   ```


<!--
### Other options

The TriplyETL Generator has the following options:

- `--dtap` Use a DTAP (Development, Test, Acceptance, Production) configuration for your TriplyETL project.
- `--help` Displays a help message.
- `--skip-git` Do not create a Git repository as part of creating the TriplyETL project.
- `--version` Displays the version number of the TriplyETL Generator.

By default, TriplyETL Generator asks you a couple of questions.  You can also specify the same information to the Generator up front, with the following flags:

- `--dataset` The name of the dataset that is created by the TriplyETL project.
- `--name` The name of the TriplyETL project.
- `--target` The folder on your computer where the TriplyETL project will be created.
- `--triplydb-token` An existing TriplyDB API Token.

In this tutorial you learn how to use the generic record representation that is used by TriplyETL.

This section gets you up and running with TriplyETL by setting up increasingly more complex pipelines.  These pipelines will use TriplyETL to connect data sources to an integrated linked data knowledge that is published in a TriplyDB instance.  Some of the documented steps are generic for setting up a modern TypeScript project, while others are specific for using TriplyETL.
--->
