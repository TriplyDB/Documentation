---
title: "TriplyETL: Command-Line Interface (CLI)"
path: "/docs/triply-etl/cli"
---

The TriplyETL Command-Line Interface (CLI) allows you to generate, run, and update your ETL pipelines. The TriplyETL CLI works the same on all major platforms: Windows, macOS, and Linux.

This page has the following sections:

- [TriplyETL Generator](#generator) explains how you can generate new ETL pipelines.
- [TriplyETL Runner](#runner) explains how you can run existing ETL pipelines.
- [TriplyETL Tools](#tools) explains how you can perform common ETL tasks.
- [Update TriplyETL repositories](#update) explains how you can keep your ETL repository up-to-date.



# TriplyETL Generator {#generator}

The TriplyETL Generator allows you to generate new ETL pipelines.

## Prerequisites

In order to use the TriplyETL Generator, you must have:
- A TriplyETL License Key. Contact [info@triply.cc](mailto:info@triply.cc) to obtain a License Key for your organization.
- A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

## Install TriplyETL Generator

Perform the following steps to install the TriplyETL Generator on your computer:

1. Go to <https://nodejs.org> and install Node.js version 18. (Or use a [Node Version Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install multiple versions of Node.js in an isolated way.)

## Use TriplyETL Generator

Perform the following steps to use the TriplyETL Generator:

1. Run the following command:

   ```sh
   npx triply-etl-generator
   ```

   This command automatically ensures that you are using the latest version.

2. When asked, enter the following information:

      a. TriplyETL License Key

      b. Project name

      c. Target folder

      d. Dataset name

      e. TriplyDB API Token

      f. TriplyDB URL

      g. TriplyDB email

      h. TriplyDB password

    Here is an example of a possible run:

    ```sh
    ? TriplyETL License Key: [hidden]
    ? Project name: my-etl
    ? Target folder: my-etl
    ? Dataset name: my-etl
    ? Create a new TriplyDB API Token? Yes
    ? Your TriplyDB URL: triplydb.com
    ? Your TriplyDB email: my-account@my-organization.com
    ? Your TriplyDB password: [hidden]
    🏁 Your project my-etl is ready for use in my-etl.
    ```

3. Go to the target folder that you have specified:

   ```sh
   cd my-etl
   ```

4. You can now use the [TriplyETL Runner](#runner) to run the ETL:

   ```sh
   npx etl
   ```

<!--
### Advanced options

The TriplyETL Generator has the following advanced options:

- `--dtap` Use a DTAP (Development, Test, Acceptance, Production) configuration for your TriplyETL project.
- `--help` Displays a help message.
- `--skip-git` Do not create a Git repository as part of creating the TriplyETL project.
- `--version` Displays the version number of the TriplyETL Generator.
-->

## Update TriplyETL Generator

When you run the TriplyETL Generator, it always checks to see whether a newer version is available. If this is the case, it shows you the NPM command that you can run to update.



# TriplyETL Runner {#runner}

The TriplyETL Runner is a CLI application that allows you to run an existing ETL pipeline.

If you do not have an ETL repository yet, use the [TriplyETL Generator](#generator) first to generate one.

Go to the directory where an existing ETL repository was generated or cloned. Run the following command to run the ETL pipeline:

```
npx etl
```

## Output summary

TriplyETL Runner will start processing data. When the ETL pipeline ends successfully, a summary will be printed:

```
 ┌──────────────────────────────────────────────────────────────┐
 │ Etl:                #Error    0 | #Warning    0 | #Info    0 │
 │ #Statements         2                                        │
 │ #Records            2                                        │
 │ Started at          2023-06-18 10:05:20                      │
 │ Runtime             0 sec                                    │
 └──────────────────────────────────────────────────────────────┘
```

This summary includes the following information:
- **"#Error"** shows the number of errors encountered. With default settings, this number is at most 1, since the Runner will immediately stop after an error occurs.
- **"#Warning"** shows the number of warnings encountered. With default settings, this includes warnings emitted by the [SHACL Validator](/docs/triply-etl/validate/shacl).
- **"#Info"** shows the number of informational messages. With default settings, this includes informational messages emitted by the [SHACL Validator](/docs/triply-etl/validate/shacl).
- **"#Statements"** shows the number of triples or quads that was generated. This number is equal to or higher than the number of statements that is uploaded to the triple store. The reason for this is that TriplyETL processes records in parallel. If the same statement is generated for two records, the number of statements with be incremented by 2, but only 1 unique statement will be uploaded to the triple store.
- **"#Records"** shows the number of records that was processed.
- **"Started at"** shows the date and time at which the Runner started.
- **"Runtime"** shows the wall time duration of the run.

## Limit the number of records

When developing a pipeline, it is almost never necessary to process all records from the source data. Instead, it is common to run the ETL for a small number of example record, which results in quick feedback.  The `--head` flag indicates the maximum number of records that is processed by the Runner:

```sh
npx etl --head 1
npx etl --head 10
```

These commands run the ETL for the first record (if one is available) and for the first 10 records (if these are available).

## Specify a range of records

When developing a pipeline over a large source data collection, it is often standard practice to use the first 10 or 100 records most of the time.

The benefit of this approach is that the feedback loop between making changes and receiving feedback is short.  A downside of this approach is that the ETL may be overly optimized towards these first few records.  For example, if a value is missing in the first 1.000 records, then transformations that are necessary for when the value is present will not be developed initially.  An alternative is to run the entire ETL, but that takes a long time.

To avoid the downsides of using `--head`, TriplyETL also supports the `--from-record-id` flag.  This flag specifies the number of records that are skipped.  This allows us to specify an arbitrary consecutive range of records.  For example, the following processes the 1.001-st until and including the 1.010-th record:

```sh
npx etl --from-record-id 1000 --head 10
```

## Process a specific record

When the `--head` flag is set to 1, the `--from-record-id` flag specifies the index of a single specific record that is processed.  This is useful when a record is known to be problematic, for instance during debugging.

The following command runs TriplyETL for the 27th record:

```sh
npx etl --from-record-id 26 --head 1
```

## Set a timeout {#timeout}

For large ETL pipelines, it is sometimes useful to specify a maximum duration for which the TriplyETL Runner is allowed to run. In such cases, the `--timeout` flag can be used.

The `--timeout` option accepts human-readable duration strings, such as '1h 30m 5s', '1hr', '1 hour', or '3hrs'.

When the indicated timeout is reached before the pipeline finishes, the TriplyETL Runner will gracefully terminate the ETL by acting as if there are no more incoming records. As a result, the Runner will upload all linked data (graphs) that was produced up to that point, and it will write a performance log.

For TriplyETLs that run in a CI/CD environment, the timeout must be set lower than the CI/CD timeout, in order for the Runner to be able to perform the termination step.

## Verbose mode

When TriplyETL is run normally, the following information is displayed:

- The number of added triples.
- The runtime of the script.
- An error message, if any occurred.

It is possible to also show the following additional information by specifying the `--verbose` flag:

- In case of an error, the first 20 values from the last processed record.
- In case of an error, the full stack trace.

The following example shows how the `--verbose` flag can be used:

```sh
npx etl --verbose
```

### Secure verbose mode

Verbose mode may perform a reset of your current terminal session.  If this happens you lose visible access to the commands that were run prior to the last TriplyETL invocation.

This destructive behavior of verbose mode can be disabled by setting the following environment variable:

```sh
export CI=true
```

This fixes the reset issue, but also makes the output less colorful.



# TriplyETL Tools {#tools}

TriplyETL Tools is a collection of small tools that can be used to run isolated tasks from the command-line. TriplyETL Tools can be used when you are in a TriplyETL repository. If you 

If you do not have an ETL repository yet, use the [TriplyETL Generator](#generator) first to generate one.

The following command prints an overview of the supported tools:

```sh
npx tools
```

The following tools are supported:

| Tool | Description |
| --- | --- |
| [`compare`](#tool-compare) | Compare the contents of two RDF files |
| [`create-token`](#tool-create-token) | Create a new TriplyDB API Token |
<!--
| [`delete-datasets`](#tool-delete-datasets) | Bulk deleting of Datasets |
| [`delete-graphs`](#tool-delete-graphs) | Bulk deleting of Graphs |
| [`delete-queries`](#tool-delete-queries) | Bulk deleting of Queries |
| [`download`](#tool-download) | Downloads information from the TriplyDB instance from your token |
-->
| [`print-token`](#tool-print-token) | Print the currently set TriplyDB API Token, if any |
<!--
| [`report`](#tool-report) | Generate a report file that describes the content of the currently configured TriplyDB instance, if any |
-->
| [`validate`](#tool-validate) | Validate a data file against a SHACL shapes file |

For each tool, the following command prints more information on how to use it:

```sh
npx tools {name} --help
```

## Compare {#tool-compare}

The compare tool checks whether two RDF files encode the same linked data:
- If the two files contain the same data, the command succeeds and does not print any output.
- If the two files do not contain the same data, the command exits with an error code, and the difference between the two files is printed.

The compare tools is invoked over the two RDF files `one.ttl` and `two.ttl` as follows:

```sh
npx tools compare one.ttl two.ttl
```

This tool can be used to compare two RDF files that contain multiple graphs, for example:

```sh
npx tools compare one.trig two.trig
```

This tool uses the graph isomorphism property as defined in the RDF 1.1 standard: [link](https://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#graph-isomorphism)

## Create TriplyDB API Token {#tool-create-token}

This tool creates a new TriplyDB API Token from the command-line. This command can be used as follows:

```sh
npx tools create-token
```

The command will ask a couple of questions in order to create the TriplyDB API Token:
- The hostname of the TriplyDB instance
- The name of the token
- Your TriplyDB account e-mail
- Your TriplyDB account password

The command exists in case a TriplyDB API Token is already configured.

<!--
## Delete dataset {#tool-delete-datasets}

TODO

## Delete graphs {#tool-delete-graphs}

TODO

## Delete queries {#tool-delete-queries}

TODO

## Download {#tool-download}

TODO
-->

## Print TriplyDB API Token {#tool-print-token}

This tool prints the currently configured TriplyDB API Token, if any. This command can be used as follows:

```sh
npx tools print-token
```

This command is useful when there are issues with configuring a TriplyDB API Token.

<!--
## Report {#tool-report}

TODO
-->

## Validate {#tool-validate}

This tool validates the content of one data file against the SHACL shapes in another file. The resulting SHACL validation report is printed to standard output.

The command can be used as follows:

```sh
$ npx tools validate -d data.trig -s model.trig 
```

See [this section](/docs/triply-etl/validate/shacl#report) to learn more about the SHACL validation report.



# Update TriplyETL repositories {#update}

New versions of TriplyETL are released regularly. Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs. At the same time, updating to a new version may require changes to your pipeline.

It is important to determine an approach for updating your TriplyETL repositories that fits your project and organization. The following sections describe how you can make such a determination.

## Check the current version

You can look up which version of TriplyETL you are currently using, by running the following command:

```sh
npm list @triplyetl/etl
```

## Check for new versions

You can run the following command to see whether TriplyETL and/or the developer dependencies can be updated:

```sh
npm outdated
```

TriplyETL repositories also include several developer dependencies, that make it easier to write and maintain ETLs. These developer dependencies must be updated independently, and may show up in the output of the `npm outdated` command.

## Assess the impact of updating

TriplyETL uses the Semantic Versioning approach: `{major}.{minor}.{patch}`  The impact of updating to a new TriplyETL version can therefore be assessed as follows:

  - If only the `{patch}` number has increased, then an upgrade is not expected to affect existing functionality.  The new release only contains bug fixes and/or small changes to functionality that does not break existing pipelines.

  - If the `{minor}` number has increased, but the `{major}` number is the same, then an upgrade may require small changes to an existing pipeline.  A minor upgrade will never remove existing functionality, but it may change details of how existing functionality works (e.g. the settings for an existing function may have undergone minor changes).

    Minor releases are likely to include significant *new* functionality that may benefit an existing pipeline.

  - If the `{major}` number has increased, an upgrade is likely to require changes to existing pipelines.  Major releases often remove outdated functionalities or bring significant changes to the behavior of existing functionalities.

Look at the [TriplyETL Changelog](/docs/triply-etl/changelog) to see what changes you will need to make in order to perform the update in your project and organization. Specifically observe items that are marked "[Changed]" since these may require adjustments to your configuration.

## Perform the update

Based on the outcome of the previous step, a maintainer of the repository can choose to update a specific dependency, or all dependencies at once:

```sh
npm update {package-name}
npm update
```
