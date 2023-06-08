---
title: "TriplyETL: Command-Line Interface (CLI)"
path: "/docs/triply-etl/cli"
---

TriplyETL includes the following tools that can be used from a command-line:

- [**TriplyETL Generator**](#generator) is used to create a new ETL pipeline.
- [**TriplyETL Runner**](#runner) is used to run an existing ETL pipeline.
- [**TriplyETL Tools**](#tools) is used to perform common, isolated tasks.
- [Upgrading TriplyETL repositories](#upgrade) explains how you can keep your ETL repository up-to-date.

## TriplyETL Generator {#generator}

The TriplyETL Generator allows you to create a new ETL.

### Prerequisites

In order to use the TriplyETL Generator, you must have the following things:
- A TriplyETL License Key.
- A user account on a TriplyDB server.

Contact <mailto:info@triply.cc> for more information.

### Installation

Perform the following steps to install the TriplyETL Generator on your computer:

1. Go to <https://nodejs.org> and install Node.js version 18.

### Using the Generator

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

   See the documentation for the [TriplyETL Runner](#runner) for more information.

<!--
### Advanced options

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
-->

### Upgrading TriplyETL Generator

Before creating a new TriplyETL repository, ensure that you are using the latest version of the TriplyETL Generator:

```
npm update -g triply-etl-generator
```

## TriplyETL Runner {#runner}

TriplyETL Runner allows you to run an existing ETL.

If you do not have an ETL yet, use the [TriplyETL Generator](#generator) first to create one.

The TriplyETL Runner is invoked with the following command:

```
npx etl
```

### Limit the number of records

When developing a pipeline, it is almost never necessary to process all records from the source data. Instead, it is common to run the ETL for a small number of example record, which results in quick feedback.  The `--head` flag indicates the maximum number of records that is processed by the runner:

```sh
npx etl lib/main.js --head 1
npx etl lib/main.js --head 10
```

The above commands run the ETL for the first record (if one is available) and for the first 10 records (if these are available).

### Specify a range of records

When developing a pipeline over a large source data collection, it is often standard practice to use the first 10 or 100 records most of the time.

The benefit of this approach is that the feedback loop between making changes and receiving feedback is short.  A downside of this approach is that the ETL may be overly optimized towards these first few records.  For example, if a value is missing in the first 1.000 records, then transformations that are necessary for when the value is present will not be developed initially.  An alternative is to run the entire ETL, but that takes a long time.

To avoid the downsides of using `--head`, TriplyETL also supports the `--from-record-id` flag.  This flag specifies the number of records that are skipped.  This allows us to specify an arbitrary consecutive range of records.  For example, the following processes the 1.001-st until and including the 1.010-th record:

```sh
npx etl lib/main.js --from-record-id 1000 --head 10
```

### Process a specific record

When the `--head` flag is set to 1, the `--from-record-id` flag specifies the index of a single specific record that is processed.  This is useful when a record is known to be problematic, for instance during debugging.

The following command runs TriplyETL for the 27th record:

```sh
npx etl lib/main.js --from-record-id 26 --head 1
```

### Set a timeout {#timeout}

For large ETL pipelines, it is sometimes useful to specify a maximum duration for which the TriplyETL Runner is allowed to run. In such cases, the `--timeout` flag can be used.

The `--timeout` option accepts human-readable duration strings, such as '1h 30m 5s', '1hr', '1 hour', or '3hrs'.

When the indicated timeout is reached before the pipeline finishes, the TriplyETL Runner will gracefully terminate the ETL by acting as if there are no more incoming records. As a result, the Runner will upload all linked data (graphs) that was produced up to that point, and it will write a performance log.

For TriplyETLs that run in a CI/CD environment, the timeout must be set lower than the CI/CD timeout, in order for the Runner to be able to perform the termination step.

### Verbose mode

When TriplyETL is run normally, the following information is displayed:

- The number of added triples.
- The runtime of the script.
- An error message, if any occurred.

It is possible to also show the following additional information by specifying the `--verbose` flag:

- In case of an error, the first 20 values from the last processed record.
- In case of an error, the full stack trace.

The following example shows how the `--verbose` flag can be used:

```sh
npx etl lib/main.js --verbose
```

#### Secure verbose mode

Verbose mode may perform a reset of your current terminal session.  If this happens you lose visible access to the commands that were run prior to the last TriplyETL invocation.

This destructive behavior of verbose mode can be disabled by setting the following environment variable:

```sh
export CI=true
```

This fixes the reset issue, but also makes the output less colorful.

## TriplyETL Tools {#tools}

TriplyETL Tools is a collection of small tools that can be used to run isolated tasks from the command-line.

The following command prints an overview of the supported tools:

```
npx tools
```

The following tools are supported:

| Tool | Description |
| --- | --- |
| [compare](#tool-compare) | Checks if 2 graphs are isomorphic |
| [create-token](#tool-create-token) | Create a new Token |
| [delete-datasets](#tool-delete-datasets) | Bulk deleting of Datasets |
| [delete-graphs](#tool-delete-graphs) | Bulk deleting of Graphs |
| [delete-queries](#tool-delete-queries) | Bulk deleting of Queries |
| [download](#tool-download) | Downloads information from the TriplyDB instance from your token |
| [print-token](#tool-print-token) | Prints your current TriplyDb token |
| [report](#tool-report) | Generate a MarkDown report from the TriplyDB instance from your token |
| [validate](#tool-validate) | Validate instance data against a SHACL shape |

## Upgrading TriplyETL repositories {#upgrade}

Triply regularly releases new versions of TriplyETL. You can look up the TriplyETL version that you are currently using, by running the following command:

```
npm list @triplyetl/etl
```

You can look at the [TriplyETL Changelog](/docs/triply-etl/changelog) to observe the latest available TriplyETL version, and the differences between the latest version and your current version. Specifically observe items that are marked "[Changed]" since these may require a rewrite of your configuration.

You can update to the latest version of TriplyETL by running the following command in your TriplyETL repository:

```
npm upgrade triplyetl
```

### Developer dependencies

TriplyETL repositories include a couple of developer dependencies that make it easier to write and maintain ETLs. These dependencies are not part of the TriplyETL dependency, and must be updated independently.

The following command gives an overview of all the possible updates to the developer dependencies:

```
npm outdated
```

Based on the output of the previous command, a maintainer of the repository can choose to upgrade one or more developer dependencies by running the following command:

```
npm upgrade {package-name}
```
