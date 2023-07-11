---
title: "TriplyETL: Command-Line Interface (CLI)"
path: "/docs/triply-etl/cli"
---

TriplyETL allows you to manually perform various tasks in a terminal application (a Command-Line Interface or CLI).

- [Installing dependencies](#dependencies) must be repeated when dependencies were changed.
- [Transpiling to JavaScript](#transpile) must be repeated when one or more TypeScript files are changed.
- [TriplyETL Runner](#runner) allows you to manually run local TriplyETL projects in your terminal.
- [TriplyETL Tools](#tools) explains how you can perform common ETL tasks.



### Installing dependencies {#dependencies}

When you work on an existing TriplyETL project, you sometimes pull in changes made by your team members. Such changes are typically obtained by running the following Git command:

```sh
git pull
```

This command prints a list of files that were changed by your team members. If this list includes changes to the file `package.json`, this means that one or more dependencies were changed. In order to effectuate these changes in your local copy of the TriplyETL project, you must run the following command:

```sh
npm i
```



### Transpiling to JavaScript {#transpile}

When you make changes to one or more TypeScript files, the corresponding JavaScript files will have become outdated. If you now use the [TriplyETL Runner](#runner), it will use one or more outdated JavaScript files, and will not take into account your most recent changes to the TypeScript files.

In order to keep your JavaScript files up-to-date relative to your TypeScript files, you must run the following command after making changes to TypeScript files:

```sh
npm run build
```

If you edit your TypeScript files repeatedly, having to run this extra command may get tedious. In such cases, you can run the following command to automatically perform the transpile step in the background:

```sh
npm run dev
```

Notice that this prevents you from using the terminal application for new commands. It is typical to open a new terminal application window, and run the `npx etl` command from there.



# TriplyETL Runner {#runner}

The TriplyETL Runner allows you to run a local TriplyETL project in your terminal application.

We assume that you have a local TriplyETL project in which you can successfully run the `npx etl` command. Follow the [Getting Started instructions for TriplyETL Runner](/docs/triply-etl/getting-started#runner) if this is not yet the case.

Run the following command to run the ETL pipeline:

```sh
npx etl
```

This command implicitly uses the file `lib/main.js`, which is the transpiled JavaScript file that corresponds to the TypeScript file `src/main.ts`. The following command has the same behavior, but makes explicit which file is used:

```sh
npx etl lib/main.js
```

Some TriplyETL projects have multiple top-level scripts. In such cases, it is possible to run each of these scripts individually as follows:

```sh
npx etl lib/some-script.js
```

## Output summary

TriplyETL Runner will start processing data. Depending on the size of the data source, the Runner may take more or less time to finish. When the Runner finishes successfully, it will print the following summary:

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

TriplyETL Tools is a collection of small tools that can be used to run isolated tasks from your terminal application. TriplyETL Tools can be used when you are inside a TriplyETL project.

If you do not have an ETL project yet, use the [TriplyETL Generator](/docs/triply-etl/getting-started#generator) first to create one.

The following command prints an overview of the supported tools:

```sh
npx tools
```

The following tools are supported:

| Tool | Description |
| --- | --- |
| [`compare`](#tool-compare) | Compare the contents of two RDF files |
| [`create-token`](#tool-create-token) | Create a new TriplyDB API Token |
| [`print-token`](#tool-print-token) | Print the currently set TriplyDB API Token, if any |
| [`validate`](#tool-validate) | Validate a data file against a SHACL shapes file |

<!--
| [`report`](#tool-report) | Generate a report file that describes the content of the currently configured TriplyDB instance, if any |
| [`delete-datasets`](#tool-delete-datasets) | Bulk deleting of Datasets |
| [`delete-graphs`](#tool-delete-graphs) | Bulk deleting of Graphs |
| [`delete-queries`](#tool-delete-queries) | Bulk deleting of Queries |
| [`download`](#tool-download) | Downloads information from the TriplyDB instance from your token |
-->

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
