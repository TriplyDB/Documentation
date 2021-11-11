---
title: "RATT"
path: "/docs/ratt-getting-started"
---

**RATT is distributed under the TriplyDB license.  Contact [info@triply.cc](mailto:info@triply.cc) for more information.**

RATT is a [TypeScript package](https://www.npmjs.com/package/@triply/ratt) that is developed by [Triply](https://triply.cc).  RATT makes it possible to develop and maintain production-grade linked data pipelines.  It is used in combination with a [TriplyDB license and instance](https://triply.cc/subscriptions) to create large-scale knowledge graphs.

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
   // Load the RATT library and the RATT Middlewared (mw).
   import {Ratt} from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   // The main function that will run the pipeline.
   export default async function (): Promise<Ratt> {
     // The RATT configuration for this pipeline.
     // Because this is a simple pipeline we only need to specify a
     // standard graph name.  Because we will not store the graph
     // name in this pipeline, we can specify an empty standard
     // graph name.
     const app = new Ratt({
       defaultGraph: ''
     })
     // The steps that are performed in the pipeline are specified
     // in 'app.use'.  These steps are performed in sequence.
     app.use(
       // Create one linked data statement:
       // “The class of all classes is itself a class.”
       mw.addQuad(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       // Writes the linked data statements to a local file.
       mw.toRdf(Ratt.Destination.file('example.ttl')))
     return app
   }
   ```

7. Transpile the TypeScript file (`main.ts`) into a JavaScript file (`main.js`):

   ```sh
   ./node_modules/.bin/tsc
   ```

8. Run the JavaScript file (`main.js`) as a RATT pipeline:

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
   // Also import `CliContext` from the RATT library.
   import {CliContext, Ratt} from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   // Includes argument `cliContext: CliContext` for reading the
   // API Token environment variable as well as Command-Line
   // Interface (CLI) options.
   export default async function (cliContext: CliContext): Promise<Ratt> {
     const app = new Ratt({
       // Includes `cliContext` in the RATT content to process CLI
       // options.
       cliContext,
       defaultGraph: '',
     })
     app.use(
       mw.addQuad(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
       // Publishes the linked data data statements to a TriplyDB
       // dataset called 'example'.  This dataset is added to the
       // account that is associated with the configured API Token.
       mw.toRdf(Ratt.Destination.TriplyDb.rdf('example')))
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
   import {CliContext, Ratt} from '@triply/ratt'
   import mw from '@triply/ratt/lib/middlewares'

   export default async function (cliContext: CliContext): Promise<Ratt> {
     const app = new Ratt({
       cliContext,
       defaultGraph: '',
       // Declare an IRI prefix.
       prefixes: {
         person: Ratt.prefixer('https://example.com/id/person/'),
       },
     })
     app.use(
       // Connects the tabular source data to the pipeline.
       // Every row in the table is processed as a RATT record.
       mw.fromCsv(Ratt.Source.file('example.csv')),
       // Create a linked data statement that is based on the
			 // source data.
       mw.addQuad(
         // Create a universally unique identifier (IRI) based
         // on the value in the 'ID' column and the declared
				 // 'person' prefix.
         mw.toIri('ID', {prefix: app.prefix.person}),
         app.prefix.rdfs('label'),
         // Create a string literal based on the value in the
				 // 'NAME' column.
         mw.toLiteral('NAME')),
       mw.toRdf(Ratt.Destination.file('example.ttl')))
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
