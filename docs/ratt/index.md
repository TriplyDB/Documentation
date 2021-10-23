individual---
title: "RATT"
path: "/docs/ratt"
---

**<span style="color:red">Note: RATT is distributed under the TriplyDB license.  Contact info@triply.cc for more information.</span>**

RATT is a library that is optimized for building production-grade linked data pipelines.  It is used in combination with TriplyDB to create large-scale Knowledge Graphs.

RATT is written and used in TypeScript, a type-safe language that transpiles to JavaScript. RATT is designed as library with which a user can quickly and efficiently transform their source data into linked data, via a set of core principles. These principles are loading the data into a standard record frame, manipulating parts of the record via standard functions, creating linked data, querying linked data from memory, and uploading data to the triple store.

## Getting started

This section gets you up and running with RATT by setting up increasingly more complex pipelines.  These pipelines will use RATT to connect data sources to an integrated linked data knowledge that is published in a TriplyDB instance.  Some of the documented steps are generic for setting up a modern TypeScript project, while others are specific for using RATT.

### Setting up a minimal pipeline

In this section we set up a RATT pipeline that creates one single triple.  This pipeline is purposefully minimal, which allows us to focus on the installation and configuration steps.

1. Install [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com).

   On Linux, installation works as follows:

   ```sh
   sudo apt install nodejs yarn # Ubuntu, Debian
   sudo dnf install nodejs yarn # Red Hat, Fedora
   ```

2. Create a directory for your pipeline:

   ```sh
   mkdir my_pipeline
   cd my_pipeline
   ```

3. Inside your newly created directory, initialize a standard [Yarn project](https://classic.yarnpkg.com/en/docs/creating-a-project/):

   ```sh
   yarn init -y
   ```

   This creates a `package.json` file.  You can optionally edit this file to enter metadata for your project.

4. Add TypeScript and RATT as dependencies to your pipeline:

   ```sh
   yarn add typescript @triply/ratt
   ```

5. Initialize a default TypeScript project:

   ```sh
   ./node_modules/.bin/tsc --init
   ```

   This creates a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.  You can optionally edit this file to tweak how TypeScript code is transpiled into JavaScript code.

6. Create a file called `main.ts` in a text editor, and copy/paste the following code into that file:

   ```ts
   import { Ratt } from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   export default async function (): Promise<Ratt> {
     const app = new Ratt({
       defaultGraph: ''
     })
     app.use(
       mw.addQuad(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       mw.toRdf(Ratt.Destination.file('example.ttl')),
     )
     return app
   }
   ```

   The meaning of this code snippet is as follows:

     - Lines 1-2 load the RATT library.
     - Line 4 creates the main function that will run the pipeline.
     - Lines 5-7 specifies the RATT configuration for this pipeline.  Because this is a simple pipeline we do not need to specify a non-empty default graph name.
     - Lines 8-14 specify the steps that are performed in the pipeline.  These steps are performed in sequence.
       - Lines 9-12 create one linked data statement (“The class of all classes is itself a class.”).
       - Line 13 writes the statement to a local file.

7. Transpile the TypeScript file (`main.ts`) into a JavaScript file (`main.js`):

   ```sh
   ./node_modules/.bin/tsc
   ```

8. Run the JavaScript file (`main.js`) as a RATT pipeline:

   ```sh
   yarn ratt main.js
   ```

   This should create a file called `example.ttl` that contains the one created statement.  Contact <mailto:support@triply.cc> if this does not work on your system.

In the next section we extend this minimal pipeline by uploading the results to a TriplyDB instance.

### Publish to TriplyDB

In the [previous section](#setting-up-a-minimal-pipeline) we set up a minimal pipeline in RATT.  In this section we extend the pipeline to publish the results in a TriplyDB instance.

1. Following the steps on [this page](../generics/api-token) to create and configure a TriplyDB API Token.

2. Once the API Token is configured, open file `main.ts` in a text editor and add the following content:

   ```ts
   import { CliContext, Ratt } from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   export default async function (cliContext: CliContext): Promise<Ratt> {
     const app = new Ratt({
       cliContext,
       defaultGraph: '',
     })
     app.use(
       mw.addQuad(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       mw.toRdf(Ratt.Destination.TriplyDb.rdf('example')),
     )
     return app
   }
   ```

   The code snippet contains the following changes relative to the code from [the previous section](#setting-up-a-minimal-pipeline):

     - Line 1 also imports `CliContext` from the RATT library.
     - Line 4 includes argument `cliContext: CliContext` and line 6 includes `cliContext`, so that the API Token can be read from the Command-Line Interface (CLI).
     - Line 14 publishes the data that is generated in a TriplyDB dataset called `'example'`.  This dataset is added to the account that is associated with the configured API Token.

3. Transpile the code with `./node_modules/.bin/tsc`

4. Run the pipeline with `yarn ratt main.js`

### Connect a data source

This section extends the pipeline from [the previous section](#publish-to-triplydb) by connecting a data source.  RATT can connect to database systems and web APIs, but to keep things simple we will use the following tabular input data from a local file:

| ID    | NAME  |
| ----- | ----- |
| 00001 | Anna  |
| 00002 | Bob   |
| 00003 | Carol |

1. Create a text file called `example.csv` in a text editor, and copy/paste the following source data into that file:

   ```csv
   ID,NAME
   00001,Anna
   00002,Bob
   00003,Carol
   ```

2. Open text file `main.ts` and add the following content:

   ```ts
   import { CliContext, Ratt } from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   export default async function (cliContext: CliContext): Promise<Ratt> {
     const app = new Ratt({
       cliContext,
       defaultGraph: '',
       prefixes: {
         person: Ratt.prefixer('https://example.com/id/person/'),
       },
     })
     app.use(
       mw.fromCsv(Ratt.Source.file('example.csv')),
       mw.addQuad(
         mw.toIri('ID', {prefix: app.prefix.person}),
         app.prefix.rdfs('label'),
         mw.toLiteral('NAME')),
       mw.toRdf(Ratt.Destination.file('example.ttl')),
     )
     return app
   }
   ```

   Notice the following changes:

     - Lines 8-10 declare an IRI prefix.  Such prefixes are common in RATT pipelines, because this makes it easier to work with lengthy IRIs.
     - Line 13 connects the tabular source data to the pipleline.  Every row in the table will be processed as a RATT record.
     - Lines 14-17 create a one linked data statement that is based on the source data.
       - Line 15 creates an universally unique identifier (IRI) based on the value in the `'ID'` column and the declared `person` prefix.
       - Line 17 creates a string literal based on the value in the `'NAME'` column.

3. Transpile the code with `./node_modules/.bin/tsc`

4. Run the pipeline with `yarn ratt main.js`

The RATT script will give you a link to the uploaded dataset.  This dataset contains the graph content as displayed in [Figure 1](#connect-a-data-source).

<figure id='connect-a-data-source'>
  <img src='connect-a-data-source.png' width='450'>
  <figcaption>
    Figure 1 - A visualization of the graph that is created by this example RATT pipeline.
  </figcaption>
</figure>

<!--
```turtle
prefix person: <https://example.com/id/person/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

person:00001 rdfs:label 'Anna'.
person:00002 rdfs:label 'Bob'.
person:00003 rdfs:label 'Carol'.
```
-->

## ETL Structure

ETL stands for Extract, Transform, Load. In the following section we go into more detail for each of the three components. Explaining how each component works, what configurations you can set and how the components can work together to create an ETL.

### Extracting data

RATT uses connectors to tap into data from various sources.  This section explains how different kinds of sources can be connected to RATT.

Pro Tip: It is important to never change a data source manually.  Since manual changes cannot be stored, reproduced or rolled back they are always a bad idea.  Instead, try to perform all modifications in RATT.  That way your changes are stored in the Git history of your RATT repository.  It is also possible to roll back your changes if needed.

#### Static source data

Source data is often available in static files.  For example one or more Excel files with tabular data.

##### Use TriplyDB Assets for static source data

If your ETL needs to connect to static data files, it is best practice to first upload these as [TriplyDB Assets](#todo).  This has the following benefits:

<dl>
  <dt>Shareable</dt>
  <dd>TriplyDB Assets can be added to any TriplyDB Dataset.  This means that collaborators that have access to a dataset will also have access to the static data files that are needed to create the linked data in that dataset.</dd>
  <dt>Secure</dt>
  <dd>TriplyDB Assets are accessible under the same access levels as the TriplyDB Dataset to which they belong.  This means that you can share static data files in a secure way with your collaborators.</dd>
  <dt>Versioned</dt>
  <dd>TriplyDB Assets are versioned.  If a new version of the same static file becomes available, this file can be uploaded to the same TriplyDB Asset.  If there are problems with the new data files them your collaborators can always roll back to an earlier version of the source data.</dd>
  <dt>Transparent</dt>
  <dd>All collaborators have access to the same TriplyDB Assets.  This makes it transparent which static data files are needed, and which versions are available.  This is much more transparent than having to share (versions of) files over email or by other indirect means.</dd>
  <dt>Backed-up</dt>
  <dd>TriplyDB instances that are maintained by Triply are also backed up regularly.  This includes the static data files that are uploaded as TriplyDB Assets.  This is much more secure than storing static data files on a local laptop that can break, or where files can get lost otherwise.</dd>
</dl>

##### Microsoft Excel files (XLSX)

Microsoft Excel (file name extension `.xlsx`) is a popular file format for storing static tabular source data.

RATT has a dedicated connector for Excel files.  After your Excel files [are uploaded as TriplyDB Assets](#section-2-1), RATT can connect to them as follows:

```ts
app.use(
  mw.fromXlsx(Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table.xlsx'}))
)
```

#### Comma Separated Values files (CSV)

Comma Separated Values (file name extension `.csv`) is a popular file format for storing static tabular source data.

RATT has a dedicated connector for Excel files.  After your CSV files are [compressed](#todo) and [uploaded as TriplyDB Assets](#todo), RATT can connect to them as follows:

```ts
app.use(
  mw.fromCsv(Ratt.Source.triplyDb.asset('my-account', 'my-dataset', {name: 'my-table.csv.gz'}))
)
```

##### Standards-compliance

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

#### Data from publicly accessible URLs

Some people like to work with publicly accessible URLs on the Internet.  This is generally a bad idea, because this cannot be used for data that is not known to have a public license.  Because a lot of data has no clear license, this approach can almost never be used legitimately.  Still, if you understand the implications of using publicly accessible URLs, you can connect them to your ETL.

The following example connects to a remote CSV file from a public URL from RATT:

```ts
app.use(
  mw.fromCsv(Ratt.Source.url('https://example.com/my-table.csv.gz')),
)
```

### Transforming Data

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

#### Change an existing entry in-place (`mw.change`)

```ts
app.use(
  mw.change({
    key: 'foo',
    type: 'string',
    change: value => value+'zzz'}),
)
```

### Loading Data

TODO

<!--
## Core Concepts

TODO: Maybe move to a different space in the documentation

Now with the ETL structure explained we can dive a bit more into detail how the structure of the ETL is used and or what for example a RATT Runner is.

### RATT app


### Runner


### Middlewares

The most common occurrence in your ETL are the middlewares. Middlewares are essentially reusable pieces of code that executes a certain long and/or complex piece of functionality. An middleware is a piece of code that transforms a record and can be invoked with app.use().

You can recognize all the middleware in this document by the prefix `mw.` that is before each middleware function.

### Context and Store
-->
