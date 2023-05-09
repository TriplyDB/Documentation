---
title: "TriplyETL: Getting started"
path: "/docs/triply-etl/getting-started"
---

## Prerequisites

In order to use TriplyETL, you must have the following things:
- A [Node.js](https://nodejs.org) installation
- A TriplyETL License Key.
- A user account on a TriplyDB instance.

Contact <mailto:info@triply.cc> for more information.

## Installation

Use the TriplyETL Generator to create a new TriplyETL project on your computer:

1. Go to <https://nodejs.org> and install Node.js 18.

2. Open a command line and install NPX:

```sh
npm install -g npx
```

3. Run the TriplyETL Generator:

```sh
npx triply-etl-generator
```

4. Answer the following questions for your project:

      a. Project name

      b. Target folder

      c. Dataset name

      d. TriplyDB URL

      e. TriplyDB email

      f. TriplyDB password

    Here is an example of a possible run:

    ```sh
    npx triply-etl-generator
    ? project name my-etl
    ? target folder my-etl
    ? name of the Dataset my-etl
    ? Do you want to create a new TriplyDB access token? Yes
    ? What is the URL of your TriplyDB instance? triplydb.com
    ? What is your email address on your TriplyDB instance? wouter@triply.cc
    ? What is your password on your TriplyDB instance? [hidden]
    🏁 Your project triplyetl is ready for use in /home/wouter/tmp/triplyetl.
    To run your first ETL follow these steps:
    cd /path/to/my-etl
    npx etl
    ```

5. Go to the target folder:

   ```sh
   cd /path/to/my-etl
   ```

6. Run the ETL:

   ```sh
   npx etl
   ```


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
- `--triplydb-token` An exsiting TriplyDB API Token.

In this tutorial you learn how to use the generic record representation that is used by TriplyETL.

This section gets you up and running with TriplyETL by setting up increasingly more complex pipelines.  These pipelines will use TriplyETL to connect data sources to an integrated linked data knowledge that is published in a TriplyDB instance.  Some of the documented steps are generic for setting up a modern TypeScript project, while others are specific for using TriplyETL.



## Connect a data source

This section extends the pipeline from [the previous section](#publish-to-triplydb) by connecting a data source.  TriplyETL can connect to database systems and web APIs, but to keep things simple we will use the following tabular input data from a local file:

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
   import { Etl, declarePrefix, fromCsv, iri, literal, rdfs,
            Source, toRdf, triple } from '@triplyetl/etl/generic'
   import { rdfs } from '@triplyetl/etl/vocab'

   export default async function (): Promise<Etl> {
     const etl = new Etl({
       prefixes: {
         ex: declarePrefix('https://example.com/'),
       },
     })
     etl.use(
       // Connects the tabular source data to the pipeline.
       // Every row in the table is processed as a TriplyETL record.
       fromCsv(Source.file('example.csv')),
       // Create a linked data statement that is based on the
			 // source data.
       triple(iri(etl.prefix.ex, 'ID'), rdfs.label, 'NAME'),
       toRdf(Destination.file('example.ttl'))
     )
     return etl
   }
   ```

         // Create a universally unique identifier (IRI) based
         // on the value in the 'ID' column and the declared
				 // 'person' prefix.

         // Create a string literal based on the value in the
				 // 'NAME' column.

3. Transpile the code with `./node_modules/.bin/tsc`

4. Run the pipeline with `yarn ratt main.js`

The TriplyETL script will give you a link to the uploaded dataset.  This dataset contains the following graph content:

![](connect-a-data-source.png)



## Important terms before starting to work with TriplyETL

### Middlewares

The most common occurrence in ETL are the middlewares. Middlewares are essentially reusable pieces of code that execute a certain long and/or complex piece of functionality. An middleware is a piece of code that transforms a record and can be invoked with app.use().

Example of middleware function:

```ts
loadRdf(Ratt.Source.TriplyDb.query('my-account', 'my-query')),
```

### What is a record?

TriplyETL doesn't have infinite memory and not all data can be loaded at once. So instead of loading data all at once, first one part of data is processed and written to the file, and then the second one, third one, and so on. These parts are called records. Each record goes through all middlewares before a new record is started.

### What is the store?

As mentioned above, when ETL is running we go through data record by record. Together with the input data we also have output data. Before being written to the final destination (triplyDB or file), output data has to be kept somewhere and that's what store  is for. The store is for temporarily storing linked data. Every record has its own store.
toRdf reads from the store.

```ts
app.use(toRdf(Ratt.Destination.file('example.ttl')));

```

### What is the context(ctx)?

In TriplyETL, the context is an object that represents the current record. The context gives us access to the triple store, the in memory storage of our triples. It also contains utility functions that will be used to modify and transform our source data into linked data. Some examples of ctx:

```ts
ctx.getString("address")
ctx.getIri(...)
ctx.getArray(...)
ctx.store.addQuad(...)
ctx.store.getQuad(...)
//etc.
```



## A JSON data source

The following code snippet uses the [`fromJson`](#fromJson) connector with two inline example records:

```ts
import { fromJson, logRecord, Ratt as Etl } from '@triplydb/ratt'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([
      { id: '123', name: 'John' },
      { id: '456', name: 'Jane' },
    ]),
    logRecord(),
  )
  return etl
}
```

Function `logRecord()` prints the current record to standard output.  When this pipeline is run, the two records are printed as follows:

```json
{
  "id": "123",
  "name": "John",
  "$recordId": 1,
  "$environment": "Development"
}
{
  "id": "456",
  "name": "Jane",
  "$recordId": 2,
  "$environment": "Development"
}
```

Notice that TriplyETL adds two keys to both records: `$recordId` and `$environment` (see [Special Key](#special-keys)).



## An XML data source

Now suppose that we change the source system.  We no longer use in-line JSON, but will instead use an XML file.  The contents of the XML file are as follows:

```xml
<?xml version="1.0"?>
<persons>
  <person>
    <id>123</id>
    <name>John</name>
  </person>
  <person>
    <id>456</id>
    <name>Jane</name>
  </person>
</persons>
```

Let us change the TriplyETL script to use the XML source connector:

```ts
import { fromXml, logRecord, Ratt as Etl } from '@triplydb/ratt'
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromXml(Etl.Source.file('example.xml')),
    logRecord(),
  )
  return etl
}
```

This new script logs the following two records:

```json
{
  "id": "123",
  "name": "John",
  "$recordId": 1,
  "$environment": "Development"
}
{
  "id": "456",
  "name": "Jane",
  "$recordId": 2,
  "$environment": "Development"
}
```

Notice that the two records that are logged from an XML source are completely identical to the two records that were previously logged from a JSON source.  This is an essential property of TriplyETL: it treats data from any source system in the same way, using the same intermediary record format.  This makes it easy to write pipelines that process data from a large number of different data sources.  This also makes replacing a data source in one format with a data source in another format a relatively cheap operation.  More often than not, only the source connector needs to be changed, and all transformations and assertions remain as they were.





The following tutorials will get you up-to-speed with the core TriplyETL features:

- [**Install**](/docs/triply-etl/tutorials/install) walks you through the steps necessary to install TriplyETL on your computer.
- [**Getting Started**](/docs/triply-etl/getting-started)
- [**Automation**](/docs/triply-etl/tutorials/automation)


## Online or offline development

You can configure your TriplyETL pipeline online, using the Visual Studio Code editor from a web browser.  Or you can clone the repository locally to use an editor of your own liking.

If you develop and run a TriplyETL locally, you need to install Node.js 16 or later.

## The main loop

The following code snippet shows the main TriplyETL loop.  Every TriplyETL pipeline consists of such a loop.

```ts
import { Etl } from '@triplyetl/etl/generic'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    // Etc
  )
  return etl
}
```

By adding the following five components, you configure the pipeline to create a linked data knowledge graph for your organization:

1. **Declarations** declare IRI prefixes, graph names, and vocabularies that are used in the pipeline configuration.
2. **Source Connectors** connect to the systems that add source data to your knowledge graph.
3. **Transformations** clean, modify, and enrich the source data.
4. **Assertions** generate the linked data that goes into the knowledge graph.
5. **Validation** ensures that the linked data that is added to the knowledge graph follows your data model.
6. **Publication** makes the linked data knowledge graph available in a triple store.

These six components occur in specific places inside the TripleETL main loop, as indicated by the comments in the following code snippet:

```ts
import { Etl } from '@triplyetl/etl/generic'

// 1. Declarations are made before the main loop.
export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    // 2. Source Connectors appear at the top.
    // 3. Transformations appear in the middle.
    // 4. Assertions appear in the middle.
    // 5. Validation occurs directly before publication.
    // 6. Publication appears at the bottom.
  )
  return etl
}
```
