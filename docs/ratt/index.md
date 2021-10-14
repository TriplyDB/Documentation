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
Now install `@triply/ratt` in the `my-ETL-project` directory and save it in the dependencies list:

```bash
yarn add @triply/ratt
```

You've now installed the `@triply/ratt` dependency for for your `node.js` project and after you've set up your `tsconfig.json` file >>TODO<< you are ready to build your first ETL.

# Your first ETL <!-- Create a short ETL example with core concepts, making it easier for a user to understand what an ETL is. -->

To help you get started we've created a small ETL script that you can use to kickstart the creation of your own ETL.

Embedded in the code block below is one of the simpelest ETL that can transform data to linked data. This ETL contains the building blocks for your first ETL. The ETL loads a CSV from a file. Create a single triple per row in CSV. The ETL then stores the linked data to a linked data file.

```typescript
import { Ratt, CliContext } from "@triply/ratt";
import mw from "@triply/ratt/lib/middlewares";

export default async function (cliContext: CliContext): Promise<Ratt> {
  const app = new Ratt({
    cliContext,
    defaultGraph: "https://example.org/example",
    sources: { in: Ratt.Source.file("./hello-world.csv") },
    destinations: { out: Ratt.Destination.file("./hello-world.ttl"})},
  });
  app.use(mw.fromCsv(app.sources.in)) // Extract
  app.use(
    mw.addQuad(mw.toIri("id"), app.prefix.rdfs("label"), mw.toLiteral("label"))) // Transform
  )
  app.use(mw.toRdf(app.destinations.out)); // Load
  return app;
}
```

### Running the ETL

We assume that you've followed the steps in how to install RATT. Then we need to create a directory to store the ETL in. Most of the time the directory is called `src`.

Open up your favorite integrated development environment and create a file called `main.ts` in your `src` directory. Copy paste the code snippet from the above ETL in the `main.ts` file to set up the ETL.

Next up, copy paste the table below in a your favorite table structured software program, e.g. Excel, libre office calc and save the file at the location defined in the source, `./hello-world.csv`. Alternatively you can download the file >>TODO<<.   

| id    | label |
| ----- | ----- |
| 00001 | Anna  |
| 00002 | Bob   |
| 00003 | Carol |

Now we that we are all set up we are ready to run the ETL script. But before we can start the ETL we first need to compile the typescript into javascript. To do this you'll need to run execute the following command from the command line interface:

```bash
yarn build
```
Now we can execute the ETL script. To execute the ETL script we are going to make use of a Runner, which will be explained in the chapter >>TODO<<. To run the ETL we execute the following command:

```bash
yarn run ratt ./lib/main.js
```
This executes the function that we've defined in the `main.ts` script. Taking the CSV, streaming through the CSV row by row and transforming each row according to the `addQuad` function in linked data. To finally result in the following linked data:

```turtle
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

<00001> rdfs:label "Anna" .
<00002> rdfs:label "Bob" .
<00003> rdfs:label "Carol" .
```

You've now created an ran your first ETL with RATT. So let's dive into the ETL structure to explain what all of the components are, and how each component works in the ETL.


# ETL Structure
ETL stands for Extract, Transform, Load. In the following section we go into more detail for each of the three components. Explaining how each component works, what configurations you can set and how the components can work together to create an ETL.

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


# Core Concepts <!-- Maybe move to a different space in the documentation -->

Now with the ETL structure explained we can dive a bit more into detail how the structure of the ETL is used and or what for example a RATT Runner is.

## RATT app


## Runner


## Middlewares

The most common occurrence in your ETL are the middlewares. Middlewares are essentially reusable pieces of code that executes a certain long and/or complex piece of functionality. An middleware is a piece of code that transforms a record and can be invoked with app.use().

You can recognize all the middleware in this document by the prefix `mw.` that is before each middleware function.

## Context and Store
