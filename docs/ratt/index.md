individual---
title: "RATT"
path: "/docs/ratt"
---

**<span style="color:red">Note: RATT license is included in a TriplyDB license. Contact info@triply.cc for more information</span>**

# Introduction
RATT is a typescript based library that allows transforming data to linked data via Extract-Transform-Load (ETL) pipelines. RATT is a typescript package that works together with TriplyDB software to create an integral data pipeline.

RATT is designed as library with which a user can quickly and efficiently transform their source data into linked data, via a set of core principles. These principles are loading the data into a standard record frame, manipulating parts of the record via standard functions, creating linked data, querying linked data from memory, and uploading data to the triple store.   

 <!-- shortly mention Extract-Transform-Load (ETL) here as well -->

This documentation **assumes prior knowledge** for the following topics:
- Typescript knowledge ([Node.js](https://nodejs.org/)/[yarn](https://yarnpkg.com/)) <!--Maybe add some documentation about most used commands, or links to external documentation. -->
- Limited familiarity with linked data and TriplyDB

# Getting started

The only prerequisites to use RATT are `Node.js` and a package handler such as `npm` or `yarn`.

Assuming that you've already installed the `Node.js`, let's start with creating a directory where we will host our RATT application.

```bash
mkdir my-ETL-project
cd my-ETL-project
```

Let's first initialize a package handler to help us install our package later in the process. Running the `yarn init` command will start an interactive session with which you create a `package.json`. The `package.json` holds a number of things, such as the name and version of your application.

```bash
yarn init
```
Now install Express in the `my-ETL-project` directory and save it in the dependencies list. For example:

```bash
yarn add @triply/ratt
```

# ETL example <!-- Create a short ETL example with core concepts, making it easier for a user to understand what an ETL is. -->

# Core Concepts <!-- Maybe move to a different space in the documentation -->

## Runner
## RATT app
## Middlewares
## Context and Store


# ETL Structure
ETL stands for Extract, Transform, Load. Below we go deeper into these individual concepts one by one.

## Extracting data

RATT uses connectors to tap into data from various sources.  This section explains how different kinds of sources can be connected to RATT.

Pro Tip: It is important to never change a data source manually.  Since manual changes cannot be stored, reproduced or rolled back they are always a bad idea.  Instead, try to perform all modifications in RATT.  That way your changes are stored in the Git history of your RATT repository.  It is also possible to roll back your changes if needed.

### Extract from static files

Source data is often available in static files.  For example one or more Excel files with tabular data.

#### Upload static source data as TriplyDB Assets

If your ETL needs to connect to static data files, it is best practice to first upload these as [TriplyDB Assets](#todo).  This has the following benefits:

1. **Shareable** TriplyDB Assets can be added to any TriplyDB Dataset.  This means that collaborators that have access to a dataset will also have access to the static data files that are needed to create the linked data in that dataset.
2. **Secure** TriplyDB Assets are accessible under the same access levels as the TriplyDB Dataset to which they belong.  This means that you can share static data files in a secure way with your collaborators.
3. **Versioned** TriplyDB Assets are versioned.  If a new version of the same static file becomes available, this file can be uploaded to the same TriplyDB Asset.  If there are problems with the new data files them your collaborators can always roll back to an earlier version of the source data.
4. **Transparent** All collaborators have access to the same TriplyDB Assets.  This makes it transparent which static data files are needed, and which versions are available.  This is much more transparent than having to share (versions of) files over email or by other indirect means.
5. **Backed-up** TriplyDB instances that are maintained by Triply are also backed up regularly.  This includes the static data files that are uploaded as TriplyDB Assets.  This is much more secure than storing static data files on a local laptop that can break, or where files can get lost otherwise.

#### Extract from Microsoft Excel files (XLSX)

Microsoft Excel (file name extension `.xlsx`) is a popular file format for storing static tabular source data.

RATT has a dedicated connector for Excel files.  After your Excel files [are uploaded as TriplyDB Assets](#section-2-1), RATT can connect to them as follows:

```ts
app.use(
  mw.fromXlsx(Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table.xlsx'}))
)
```

#### Extract from Comma Separated Values files (CSV)

Comma Separated Values (file name extension `.csv`) is a popular file format for storing static tabular source data.

RATT has a dedicated connector for Excel files.  After your CSV files are [compressed](#todo) and [uploaded as TriplyDB Assets](#todo), RATT can connect to them as follows:

```ts
app.use(
  mw.fromCsv(Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table.csv.gz'}))
)
```

##### Comma Separated Values (CSV) support

RATT supports the official CSV standard: [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180).  Unfortunately, there are some 'CSV' files our there that do not follow the RFC 4180 standard.  If your 'CSV' file does not follow the official CSV standard, then RATT may or may not process your static data file correctly.

#### Use multiple static files in one data sources

It is also possible to use more than one static file in a data source.

Here is an example where two CSV files are used:

```ts
app.use(
  mw.fromCsv([
    Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table-1.csv.gz'}),
    Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table-2.csv.gz'}),
  ]),
)
```

This also works when static files are specified in the [RATT context]():

```ts
const app = new Ratt({
  sources: {
    table1: Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table-1.csv.gz'}),
    table2: Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table-2.csv.gz'}),
  }
})
app.use(
  mw.fromCsv([app.sources.table1,
              app.sources.table2]),
)
```

#### File compression for plain text files

It is best practice to compress static files that are plain text files. Compression is applied prior to uploading such files are [TriplyDB Assets](#).

The following command shows how a local CSV file can be compressed using GNU Zip (`.gz`):

```sh
$ gzip my-table.csv
```

Running this command will replace file `my-table.csv` with file `my-table.csv.gz`.

#### Using a local file

Some people like to work with local files.  This is generally a bad idea, because your work cannot be shared with others.  Still, if you understand the implications of using local files, you can connect them to your ETL.

The following example connects a local CSV file to an ETL:

```ts
app.use(
  mw.fromCsv(Ratt.Source.file('my-table.csv.gz')),
)
```

#### Use data from publically accessible URLs

Some people like to work with publically accessible URLs on the Internet.  This is generally a bad idea, because this cannot be used for data that is not known to have a public license.  Because a lot of data has no clear license, this approach can almost never be used legitimately.  Still, if you understand the implications of using publicly accessible URLs, you can connect them to your ETL.

The following example connects to a remote CSV file from a public URL from RATT:

```ts
app.use(
  mw.fromCsv(Ratt.Source.url('https://example.com/my-table.csv.gz')),
)
```

## Transforming Data
Source data does not always have the correct form for direct use in RDF triples.  For example:

- A simple value may needs to be split up into multiple values.
- Multiple values may need to be combined into one value.
- Values may need to be mapped onto a prepared list of IRIs or literals.
- Values may need to be translated into standards-compliant formats.
- Values may need to be cleaned because they are dirty in the source.

When we transform values in a RATT record, we must think about the following two factors:

1. Does the transformation use the value in the same entry, from one other entry, or from multiple other entries?
2. Do we store the result of the transformation in a new or in an existing entry.

When we plot these two factors onto a table, we get the following overview of the RATT transformation functions:

|                      | *create a new entry* | *change an existing entry* |
|----------------------|-------------------|-----------------------|
| *based on self*        | impossible                  | `mw.change(value)`  |
| *based on other entry* | `mw.copy(value)`       | `mw.replace(value)`         |
| *based on context*     | `mw.add(context)`      | write a custom Middleware |

This function has the following signature:

### Change an existing entry in-place (`mw.change`)

```ts
app.use(
  mw.change({
    key: 'foo',
    type: 'string',
    change: value => value+'zzz'}),
)
```
## Loading Data
