---
title: "RATT"
path: "/docs/ratt"
---

**RATT can only be used in combination with [TriplyDB](https://triply.cc/triplydb). Contact [info@triply.cc](mailto:info@triply.cc) to receive your token to access the RATT package.**

RATT is a TypeScript package that is developed by [Triply](https://triply.cc/).  RATT makes it possible to develop and maintain production-grade linked data pipelines. It is used in combination with one of the [TriplyDB subscriptions](https://triply.cc/subscriptions) to create large-scale knowledge graphs.

RATT is written and used in TypeScript, a type-safe language that transpiles to JavaScript.  It has the following properties that set it apart from other linked data pipeline approaches:

<dl>
  <dt>Backend-agnostic</dt>
  <dd>RATT has connectors for a large number of source systems.  The pipeline code makes use of a unified RATT record.  This ensures that configuration is independent of the source system structure.  Changing the source system often only requires the use of a new RATT connector that generates identical RATT records.</dd>
  <dt>Extensible</dt>
  <dd>Since RATT is implemented in TypeScript, it has access to all TypeScript and JavaScript libraries.</dd>
  <dt>Scalable</dt>
  <dd>Transformations and operations in RATT are purposefully designed to be easy to distribute over an arbitrary number of parallel processes.  This means that RATT pipelines can be scaled up to an arbitrary number of processing nodes to achieve a pipeline with high throughput.</dd>
  <dt>Standards-compliant</dt>
  <dd>RATT implements a large set of linked data standards that allow its configuration to be largely based on standardized formats and languages.  Examples of supported standards are SPARQL Query (construct and select), SPARQL Update, JSON-LD, SHACL Core, SHACL Advanced.</dd>
</dl>

This documentation assumes that the reader has the following prior knowledge:

- A basic understanding of TypeScript/JavaScript.
- A basic familiarity with linked data and the [TriplyDB product](https://triply.cc/triplydb).



## Getting started

This section gets you up and running with RATT by setting up increasingly more complex pipelines.  These pipelines will use RATT to connect data sources to an integrated linked data knowledge that is published in a TriplyDB instance.  Some of the documented steps are generic for setting up a modern TypeScript project, while others are specific for using RATT.


### Setting up a minimal pipeline

In this section we set up a RATT pipeline that creates one single triple.  This pipeline is purposefully minimal, which allows us to focus on the installation and configuration steps.
Note that the steps below are meant to be followed on Linux environment. If you use Windows, you have to install Nodejs and Yarn  by following the official documentation steps. After these steps, you shouldn't have any issues; RATT is running under every operating system.

1. Install [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) on your system.  See [common steps to install Node.js and Yarn](common-steps-to-install) for more information.

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

4. Create a `.npmrc` file in the newly created directory, that contains the following lines. Make sure to replace `<token>` with the token you received from Triply.
    ```sh
    @triplydb:registry=https://git.triply.cc/api/v4/packages/npm/
    //git.triply.cc/api/v4/packages/npm/:_authToken=glpat-S_WoMjTXHiqLPxiwCits
    //git.triply.cc/api/v4/projects/:_authToken=glpat-S_WoMjTXHiqLPxiwCits
    ```

5. Add TypeScript and RATT as dependencies to your pipeline:

   ```sh
   yarn add typescript @triplydb/ratt
   ```

6. Initialize a default TypeScript project:

   ```sh
   ./node_modules/.bin/tsc --init
   ```

   This creates a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.  You can optionally edit this file to tweak how TypeScript code is transpiled into JavaScript code.

7. Create a file called `main.ts` in a text editor, and copy/paste the following code into that file:

   ```ts
   // Load the RATT library and the RATT Middlewared (mw).
   import {Ratt} from '@triplydb/ratt'
   import {toRdf, triple} from '@triplydb/ratt/lib/middlewares'

   // The main function that will run the pipeline.
   export default async function (): Promise<Ratt> {
     const app = new Ratt()
     // The steps that are performed in the pipeline are specified
     // in 'app.use'.  These steps are performed in sequence.
     app.use(
       // Create one linked data statement:
       // “The class of all classes is itself a class.”
       triple(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       // Writes the linked data statements to a local file.
       mw.toRdf(Ratt.Destination.file('example.ttl')))
     return app
   }
   ```

8. Transpile the TypeScript file (`main.ts`) into a JavaScript file (`main.js`):

   ```sh
   ./node_modules/.bin/tsc
   ```

9. Run the JavaScript file (`main.js`) as a RATT pipeline:

   ```sh
   yarn ratt main.js
   ```

   This should create a file called `example.ttl` that contains the one created statement.  Contact [support@triply.cc](mailto:support@triply.cc) if this does not work on your system.

In the next section we extend this minimal pipeline by uploading the results to a TriplyDB instance.


### Publish to TriplyDB

In the [previous section](#setting-up-a-minimal-pipeline) we set up a minimal pipeline in RATT.  In this section we extend the pipeline to publish the results in a TriplyDB instance.

1. [Configure a TriplyDB API Token](api-token) with write permissions.

   Write permissions are needed in order to publish data from a RATT pipeline.

2. Once the API Token is configured, open file `main.ts` in a text editor and add the following content:

   ```ts
   import {Ratt} from '@triplydb/ratt'
   import {toRdf, triple} from '@triplydb/ratt/lib/middlewares'

   export default async function (): Promise<Ratt> {
     const app = new Ratt()
     app.use(
       triple(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       // Publishes the linked data data statements to a TriplyDB
       // dataset called 'example'.  This dataset is added to the
       // account that is associated with the configured API Token.
       toRdf(Ratt.Destination.TriplyDb.rdf('example')))
     return app
   }
   ```

3. Transpile the code with `./node_modules/.bin/tsc`

4. Run the pipeline with `yarn ratt main.js`


### Connect a data source

This section extends the pipeline from [the previous section](#publish-to-triplydb) by connecting a data source.  RATT can connect to database systems and web APIs, but to keep things simple we will use the following tabular input data from a local file:

| ID    | NAME  |
| ----- | ----- |
| 00001 | Anna  |
| 00002 | Bob   |
| 00003 | Carol |

We then perform the following steps to build a pipelines that processes this data source:

1. Create a text file called `example.csv` in a text editor, and copy/paste the following source data into that file:

   ```csv
   ID,NAME
   00001,Anna
   00002,Bob
   00003,Carol
   ```

2. Open text file `main.ts` and add the following content:

   ```ts
   import {Ratt} from '@triplydb/ratt'
   import {fromCsv, triple, iri, rdfs, literal, toRdf} from '@triplydb/ratt/lib/middlewares'

   export default async function (): Promise<Ratt> {
     const app = new Ratt({
       // Declare an IRI prefix.
       prefixes: {
         person: Ratt.prefixer('https://example.com/id/person/'),
       },
     })
     app.use(
       // Connects the tabular source data to the pipeline.
       // Every row in the table is processed as a RATT record.
       fromCsv(Ratt.Source.file('example.csv')),
       // Create a linked data statement that is based on the
			 // source data.
       triple(
         // Create a universally unique identifier (IRI) based
         // on the value in the 'ID' column and the declared
				 // 'person' prefix.
         iri(app.prefix.person, 'ID'),
         app.prefix.rdfs('label'),
         // Create a string literal based on the value in the
				 // 'NAME' column.
         literal('NAME')),
       toRdf(Ratt.Destination.file('example.ttl')))
     return app
   }
   ```

3. Transpile the code with `./node_modules/.bin/tsc`

4. Run the pipeline with `yarn ratt main.js`

The RATT script will give you a link to the uploaded dataset.  This dataset contains the following graph content:

![](connect-a-data-source.png)

<!--
```turtle
prefix person: <https://example.com/id/person/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

person:00001 rdfs:label 'Anna'.
person:00002 rdfs:label 'Bob'.
person:00003 rdfs:label 'Carol'.
```
-->


### Important terms before starting to work with RATT

#### Middlewares

The most common occurrence in ETL are the middlewares. Middlewares are essentially reusable pieces of code that execute a certain long and/or complex piece of functionality. An middleware is a piece of code that transforms a record and can be invoked with app.use().

The middlewares can be recognized in this document by the prefix `mw.` that is before each middleware function. For example:

```ts
loadRdf(Ratt.Source.TriplyDb.query('my-account', 'my-query')),
```

#### What is a record?

RATT doesn't have infinite memory and not all data can be loaded at once. So instead of loading data all at once, first one part of data is processed and written to the file, and then the second one, third one, and so on. These parts are called records. Each record goes through all middlewares before a new record is started.

#### What is the store?

As mentioned above, when ETL is running we go through data record by record. Together with the input data we also have output data. Before being written to the final destination (triplyDB or file), output data has to be kept somewhere and that's what store  is for. The store is for temporarily storing linked data. Every record has its own store. 
toRdf reads from the store. 

```ts
app.use(toRdf(Ratt.Destination.file('example.ttl')));
```

#### What is the context(ctx)?

In RATT, the context is an object that represents the current record. The context gives us access to the triple store, the in memory storage of our triples. It also contains utility functions that will be used to modify and transform our source data into linked data. Some examples of ctx:

```ts
ctx.getString("address")
ctx.getIri(...)
ctx.getArray(...)
ctx.store.addQuad(...)
ctx.store.getQuad(...)
//etc.
```