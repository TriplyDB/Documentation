---
title: "Triply Command-line Interface"
path: "/docs/triply-cli"
---

[TOC]

# TriplyDB Command-line Interface (CLI)

The TriplyDB Command-line Interface (CLI) offers a convenient way to upload graphs and assets to a TriplyDB instance programmatically, without the requirement of a NodeJS environment.

The latest version of the CLI for the respective OS can be found here:

- [Linux](https://static.triply.cc/cli/triplydb-linux)
- [Windows](https://static.triply.cc/cli/triplydb.exe)
- [MacOS](https://static.triply.cc/cli/triplydb-macos)

## How to use the CLI

There are currently three use cases supported by the TriplyDB command-line interface:

- [**Importing from files**](#importing-from-file) for loading *graphs* into a TriplyDB dataset.
- [**Uploading assets**](#uploading-assets) for loading *assets* into a TriplyDB dataset.
- [**Running pipelines**](#running-pipelines) facilitates the execution of [SPARQL CONSTRUCT](https://www.w3.org/TR/rdf-sparql-query/#construct) queries for *creating* graphs.

Each of these subcommands needs information about how to connect to TriplyDB. This information is drawn from either *environment variables* or by passing arguments to the command-line interface:

- A TriplyDB token is required; consult the documentation for [API Token](../generics/api-token.md)s for more information.. This is passed via `-t`/`--token` or otherwise taken from the `$TRIPLYDB_TOKEN` variable.
- The account through which to perform the action is set via `-a`/`--account`, taken from the `$TRIPLYDB_ACCOUNT` variable, or inherited from the TriplyDB token.
- The URL of the Triply API is set via `-u`/`--url` or inherited from the TriplyDB token.
- The appropriate proxies are set with `--http-proxy` and `--https-proxy` or taken from `$HTTP_PROXY` or `$HTTPS_PROXY`.

Executing the CLI with the `--help` argument provides further details. Please contact [support@triply.cc](mailto:support@triply.cc) for more information.


### Importing from file

A triple graph can be imported from a file in one of the [supported file formats](../triply-db-getting-started/uploading-data/index.md#supported-data-formats), such as RDF/XML, Turtle, or TriG.

```bash
triplydb import-from-file [OPTION..] <PATH>
```

The following additional options are accepted:

- The dataset on which to perform the action. This is passed via `-d`/`--dataset`, or taken from the `$TRIPLYDB_DATASET` variable.
- The mode, passed via `--mode`, tells the tool how to resolve issues when a graph name already exists. Valid choices are `rename`, `overwrite`, or `merge`. The default is `rename`.

### Uploading assets

[*Assets*](../triply-db-getting-started/uploading-data/index.md#assets-binary-data) are files that can be saved as-is to a TriplyDB dataset.

```bash
triplydb upload-asset [OPTION..] <PATH>
```

The following additional options are accepted:

- The dataset on which to perform the action. This is passed via `-d`/`--dataset`, or drawn from the `$TRIPLYDB_DATASET`. The `--overwrite` option will overwrite the asset if it already exists; the default is to create a new version.


### Running pipelines

Graphs can be constructed in a pipeline, through one or more SPARQL CONSTRUCT queries that are [saved](../triply-db-getting-started/saved-queries) in TriplyDB. This is an alternative to query jobs.

```bash
triplydb run-pipeline [OPTION..] <PATH>
```

The file that specifies a pipeline should be a JSON configuration file that takes the following form:

```json
{ "queries": [
    { "name": "accountName/queryName",
      "priority": 1,
      "variables": {
        "var1": "value1",
        "var2": "value2"
      }
    },
    { "name": "accountName/queryName",
      "version": 2
    }
  ],
  "sourceDataset": "accountName/datasetName",
  "targetDataset": "accountName/datasetName",
  "targetGraphName": "graph:default",
  "version": "0.2"
}
```
