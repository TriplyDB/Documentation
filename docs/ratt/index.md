---
title: "RATT"
path: "/docs/ratt"
---

**RATT is distributed under the TriplyDB license.  Contact [info@triply.cc](mailto:info@triply.cc) for more information.**

RATT is a [TypeScript package](https://www.npmjs.com/package/@triply/ratt) that is developed by Triply.  RATT makes it possible to develop and maintain production-grade linked data pipelines.  It is used in combination with a TriplyDB license and instance to create large-scale knowledge graphs.

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
- A basic familiarity with linked data and the TriplyDB product.

 

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
  // lines 1-2 load the RATT library
 import { Ratt } from '@triply/ratt' 
 import mw from '@triply/ratt/lib/middlewares'

 export default async function (): Promise<Ratt> {
 // Line 4 creates the main function that will run the pipeline.
   const app = new Ratt({
// Lines 5-7 specifies the RATT configuration for this pipeline.  Because this is a simple pipeline we only need to specify a standard graph name.  Because we will not store the graph name in this pipeline, we can specify an empty standard graph name.
     defaultGraph: ''
   })
   app.use(
     mw.addQuad(
// Lines 8-14 specify the steps that are performed in the pipeline.  These steps are performed in sequence.
// Lines 9-12 create one linked data statement (“The class of all classes is itself a class.”).
// Line 13 writes the statement to a local file.

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
- Lines 5-7 specifies the RATT configuration for this pipeline.  Because this is a simple pipeline we only need to specify a standard graph name.  Because we will not store the graph name in this pipeline, we can specify an empty standard graph name.
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

1. Following the steps on [this page](../generics/api-token) to create and configure a TriplyDB API Token with write permissions.

   Write permissions are needed in order to publish data from a RATT pipeline.

2. Once the API Token is configured, open file `main.ts` in a text editor and add the following content:

```ts
// Line 1 also imports `CliContext` from the RATT library.
 import { CliContext, Ratt } from '@triply/ratt'
 import mw from '@triply/ratt/lib/middlewares'

 export default async function (cliContext: CliContext): Promise<Ratt> {
// Line 4 includes argument `cliContext: CliContext` and line 6 includes `cliContext`, so that the API Token can be read from the Command-Line Interface (CLI).
     const app = new Ratt({
       cliContext,
       defaultGraph: '',
     })
     app.use(
       mw.addQuad(
         app.prefix.rdfs('Class'),
         app.prefix.rdf('type'),
         app.prefix.rdfs('Class')),
 // Line 14 publishes the data that is generated in a TriplyDB dataset called `'example'`.  This dataset is added to the account that is associated with the configured API Token.
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
// lines 8-10 declare an IRI prefix.  Such prefixes are common in RATT pipelines, because this makes it easier to work with lengthy IRIs
       person: Ratt.prefixer('https://example.com/id/person/'),
    },
   })
   app.use(
     mw.fromCsv(Ratt.Source.file('example.csv')),
// line 13 connects the tabular source data to the pipleline.  Every row in the table will be processed as a RATT record.
     mw.addQuad(
// lines 14-17 create a one linked data statement that is based on the source data.
// Line 15 creates an universally unique identifier (IRI) based on the value in the `'ID'` column and the declared `person` prefix.
// Line 17 creates a string literal based on the value in the `'NAME'` column.
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



## RATT Connectors

RATT Connectors are modules that allow various backend systems to be connected to a RATT pipeline.

RATT Connectors generate RATT Records.  The RATT Records are used to configure the rest of the pipeline.  This decouples pipeline configuration from source system structure.  This is one of the essential features of RATT that set it apart from most other pipeline systems.


<h3 id='assets'>Static source data</h3>

Source data is often available in static files.  For example, a pipeline may make use of a Microsoft Excel file and a collection of ESRI ShapeFiles.  Or a pipeline may use a relational database in addition to a set of CSV text files that store information that is not in the relational dataset.

If your pipeline needs to connect to static data files, it is a best practice to upload such files as TriplyDB Assets.  This has the following benefits:

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


<h3 id='xlsx'>Microsoft Excel (XLSX) files</h3>

Microsoft Excel (file name extension `.xlsx`) is a popular file format for storing tabular source data.

RATT has a dedicated connector for Excel files.  After such files [are uploaded as TriplyDB Assets](#assets), RATT can connect to them as follows:

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
  mw.fromXlsx(Ratt.Source.triplyDb.asset(account, dataset, {name: 'my-table.xlsx'}))
)
```


<h3 id='csv'>Comma Separated Values (CSV) files</h3>

Comma Separated Values (file name extension `.csv`) is a popular file format for storing tabular source data.

RATT has a dedicated connector for CSV files.  After your CSV files are [compressed](#compression) and [uploaded as TriplyDB Assets](#assets), RATT can connect to them as follows:

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
  mw.fromCsv(Ratt.Source.triplyDb.asset(account, dataset, {name: 'my-table.csv.gz'}))
)
```

This connector also handles CSV variants that use a cell separator that is not comma (`,`).  This includes Tab Separated Values (TSV), where the separate is semi-colon (`;`).

#### Standards-compliance

RATT supports the official CSV standard: [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180).  Unfortunately, there are some ‘CSV’ files that do not follow the RFC 4180 standard.  Strictly speaking these files are not CSV files, although they may look similar to CSV files in some parts.

If your files do not follow the official CSV standard, then RATT may or may not be able to process your tabular data files correctly.  In general, it is a good idea to correct tabular data files that deviate from the CSV standard.  Such files are likely to cause issues in other data processing tools too.

#### Known limitations of CSV/TSV

While CSV/TSV files are often used in practice, they come with significant limitations.

Specifically, CSV/TSV does not allow the type of values to be specified.  All values have type `'string'`.

This is specifically an issue when tabular data contains numeric information.  Such numeric information will only be available as strings.  These strings must be explicitly transformed to number in RATT (see the [`change` function](#change)).

More advanced tabular formats like [Microsoft Excel](#xlsx) *are* able to store the types of values.


### ShapeFile (ESRI ArcGIS)

TODO


### JSON

TODO


### XML

TODO


### PostgreSQL

TODO


### Specify multiple source files

The RATT connectors for source files allow an arbitrary number of files to be specified.

The following example code connects two [CSV files](#csv)s to a RATT pipeline:

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
  mw.fromCsv([
    Ratt.Source.TriplyDb.asset(account, dataset, {name: 'my-table-1.csv.gz'}),
    Ratt.Source.TriplyDb.asset(account, dataset, {name: 'my-table-2.csv.gz'}),
  ]),
)
```

This also works with sources that are specified in the [RATT context](#context):

```ts
const account = 'my-account'
const dataset = 'my-dataset'
const app = new Ratt({
  defaultGraph: '',
  sources: {
    table1: Ratt.Source.TriplyDb.asset(account, dataset, {name: 'my-table-1.csv.gz'}),
    table2: Ratt.Source.TriplyDb.asset(account, dataset, {name: 'my-table-2.csv.gz'}),
  }
})
app.use(
  mw.fromCsv([
    app.sources.table1,
    app.sources.table2,
  ]),
)
```


### Iterate over *all* Assets

While it is possible to explicitly specify one or more source file that are uploaded as [TriplyDB Assets](#assets), RATT also allows *all* Assets to be used in an easy way:

```ts
const app = new Ratt({
  sources: {
    one: Ratt.Source.TriplyDb.asset(dataset),
    two: Ratt.Source.TriplyDb.asset(account, dataset),
  }
})
```

Source `one` provides an iterator over all Assets in the `dataset` that is published under the user account associated with the current API Token.

Source `two` provides an iterator over all Assets in the `dataset` that is published under the specified `account`.

<h4 id='compression'>File compression for plain text files</h4>

It is a best practice to compress static data files if they are plain text files.  Compression should be applied prior to uploading such files as [TriplyDB Assets](#assets).

The following command shows how a local CSV file can be compressed using GNU Zip (`.gz`):

```sh
$ gzip my-table.csv
```

Running this command will replace file `my-table.csv` with file `my-table.csv.gz`.


### Using local files

Some people like to work with local files.  This is generally a bad idea, because your work cannot be shared with others.  Still, if you understand the implications of using local files, you can connect them to your RATT pipeline.

The following example connects a local CSV file:

```ts
app.use(
  mw.fromCsv(Ratt.Source.file('my-table.csv.gz')),
)
```


### Files from publicly accessible URLs

Some people like to work with publicly accessible URLs on the Internet.  This is generally a bad idea, because this cannot be used for data that is not known to have a public license.  Because a lot of data has no clear license, this approach can almost never be used legitimately.  Also, Internet resources may not always be available, making them risky to depend on in a pipeline.  Internet resources may change their contents, which may affect the pipeline.

Still, if you understand the implications of using publicly accessible URLs, you can connect them to your RATT pipeline.

The following example connects an imaginary remote CSV file that is published at a made up public URL to RATT:

```ts
app.use(
  mw.fromCsv(Ratt.Source.url('https://example.com/my-table.csv.gz')),
)
```



## Working with IRIs

Linked data uses IRIs for uniquely identifying data items.  This means that IRIs are often mentioned inside RATT pipelines.  Because IRIs can be long and complex, it is a best practice to declare short aliases that can be used to abbreviate IRIs.

It is a best practice to declare such prefixes together and at the top of the TypeScript file that implements the RATT pipeline:

- When all prefix declarations appear together, it is less likely that the same prefix is accidentally declared twice.
- When all prefix declarations appear at the top of the file, this avoids situations in which a prefix cannot be used because it has not yet been declared.


### Declaring IRI prefixes in RATT

RATT has a special function that creates prefixes.  It works as follows:

```ts
const ALIAS = Ratt.prefixer(IRI_PREFIX)
```

This allows a potentially complex and long `IRI_PREFIX` to be used through a short and simple object called `ALIAS`.

To distinguish objects that denote prefix declarations from objects that denote other things, it is common to place prefix declarations into an object called `prefix`:

```ts
const prefix = {
  ex: Ratt.prefixer('https://example.com/'),
}
```

After this prefix has been declared, `prefix.ex` can be used instead of the longer IRI `'https://example.com/'`.  In linked data an alias (in this example: `ex`) denotes a namespace: a collection of IRI terms that have the same IRI prefix.

It is common to place IRI terms that belong to the same namespace in an object that is named after the corresponding prefix alias.

For example, the following 3 IRI terms belong to the `ex` namespace:

```ts
const ex = {
  john: prefix.ex('john'),
  knows: prefix.ex('knows'),
  mary: prefix.ex('mary'),
}
```

Later in the RATT pipeline, these terms can be used to create statements:

```ts
app.use(
  // “John knows Mary.”
  mw.addQuad(ex.john, ex.knows, ex.mary),
)
```

Notice that this is significantly shorter than specifying the full IRIs:

```ts
app.use(
  // “John knowns Mary.”
  mw.addQuad(
    mw.toIri('https://example.com/john'),
    mw.toIri('https://example.com/knows'),
    mw.toIri('https://example.com/mary')),
)
```


### External prefixes

In linked data it is common to reuse existing vocabularies and datasets.  Such external vocabularies and datasets use their own IRIs, so it is a good idea to declare prefixes for them whenever they are used in RATT.

The following example adds a prefix declaration for the [Friend of a Friend](https://triplydb.com/none/foaf) (FOAF) and [Resource Description Framework](https://triplydb.com/w3c/rdf) vocabularies to the `prefix` object:

```ts
const prefix = {
  ex: Ratt.prefixer('https://example.com/'),
  foaf: Ratt.prefixer('http://xmlns.com/foaf/0.1/'),
  rdf: Ratt.prefixer('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
}
```

Once these prefixes have been declared, they can be used to create terms within these namespaces:

```ts
const foaf = {
  Agent: prefix.foaf('Agent'),
  Person: prefix.foaf('Person'),
}

const rdf = {
  type: prefix.rdf('type'),
}
const a = rdf.type
```

These declared terms can be used later in the RATT pipeline to create statements:

```ts
app.use(
  // “John is a person.”
  mw.addQuad(ex.john, a, foaf.Person),
  // “Mary is a person.”
  mw.addQuad(ex.mary, a, foaf.Person),
)
```

Because the `foaf` and `ex` objects have been declared at the start of the pipeline, the rest of the pipeline can use autocompletion for IRIs terms.  This works by typing the namespace alias and a dot (for example: `foaf.`) and pressing `Ctrl + SPC` (control and space at the same time).  In [properly configured text editors](../generics/editor) this will bring up a list of autocomplete results.

Notice that the RATT notation for statements is purposefully close to the widely used Turtle/TriG syntax.

```trig
prefix ex: <https://example.com/>
prefix foaf: <http://xmlns.com/foaf/0.1/>

// “John is a person.”
ex:john a foaf:Person.
// “Mary is a person.”
ex:mary a foaf:Person.
```

This makes it easy to read and maintain statement declarations in RATT.


### Custom abbreviations

It is possible, but not common, to introduce special abbreviations for linked data terms.  In the previous section we saw an example of this:

```ts
const a = rdf.type
```

The custom abbreviation `a` is also available in the popular Turtle/TriG syntax for RDF, so it is recognizable to people familiar with linked data.  In Turtle/TriG syntax this abbreviation is only allowed to be used in the predicate position.  This restriction is not enforced in RATT: the programmer has to enforce this restriction themselves.

It is possible to create additional abbreviations as needed:

```ts
const is_a = rdfs.subClassOf
```

The `rdfs.subClassOf` relation implements the subsumption relation.  This relation is commonly denoted as the `is_a` relation [in many other modeling languages](https://en.wikipedia.org/wiki/Is-a).  (The abbreviation `is_a` is not supported by any of the linked data standards.)

The following example uses the introduced custom abbreviation for subsumption:

```ts
app.use(
  // "A person is an agent."
  mw.addQuad(foaf.Person, is_a, foaf.Agent)
)
```



## Transforming values

Source data does not always have the correct form for direct use in RDF triples.  For example:

- Values may need to be mapped onto a prepared list of IRIs or literals (e.g. from country names to country-denoting IRIs).
- Values may need to be translated into standards-compliant formats (e.g., from country name to ISO 3166 country codes).
- Multiple values may need to be combined into one value (e.g., street name and house number may be concatenated into an address).
- A simple value with a separator may need to be split into multiple values (e.g., from `'apple, orange'` to `'apple'` and `'orange'`).
- Values may need to be cleaned because they are dirty in the source (e.g., from `'001 '` to `1`).

When we transform values in a RATT record, we must think about the following two factors:

1. Does the transformation use the value (a) in the same entry, (b) from one other entry, or (c) from multiple other entries?
2. Do we store the result of the transformation (a) in a new entry, or (b) in an existing entry?

When we plot these two factors onto a table, we get the following overview of the RATT transformation functions:

<figure>
  <table>
    <thead>
      <tr><th></th><th>Create a new entry</th><th>Change an existing entry</th></tr>
    </thead>
    <tbody>
      <tr><th>From the same entry</th><td>impossible</td><td><a href="#change"><code>change</code></a></td></tr>
      <tr><th>From another entry</th><td><a href="#copy"><code>copy</code></a></td><td><a href="#replace"><code>replace</code></a></td></tr>
      <tr><th>From the context</th><td><a href="#add"><code>add</code></a></td><td>Write a custom Middleware</td></tr>
    </tbody>
  </table>
  <figcaption>Table - Overview of the RATT Transformation Functions.</figcaption>
</figure>

The following sections explain how these 4 transformation functions work.



<h3 id="change">Change an existing entry in-place (<code>change</code>)</h3>

The `change` function allows the value of an existing entry to be modified in-place.  This is typically done to clean a value or to map string values into IRIs.

#### Function signature

This function has the following signature:

```ts
app.use(
  mw.change({
    key: 'KEY_NAME',
    type: 'VALUE_TYPE',
    change: value => FUNCTION_BODY}),
)
```

The function can be configured in the following ways:
- `ENTRY_NAME` must be the name of an entry in the RATT record.
- `VALUE_TYPE` must be one of the following type-denoting strings:
  - `'array'` an array whose elements have type `any`.
  - `'boolean'` a Boolean value (`true` or `false`).
  - `'iri'` a universal identifier / IRI term.
  - `'literal'` an RDF literal term.
  - `'number'` a natural number or floating-point number.
  - `'string'` a sequence of characters.
  - `'unknown'` an unknown type.
- `FUNCTION_BODY` a function body that returns the new value.

#### Error conditions

This function emits an error if the specified key (`KEY_NAME`) does not exist in the RATT record.  Use [`copy`](#copy) if you want to create a new entry based on an existing one.

#### Use cases

This section provides common use cases where the `change` function is applied.  These use cases also serve as example for how the `change` function can be used in general to fit your needs.

##### Add padding

Sometimes a target value must have a specific length.  If the source value does not have that length, it may be padded with leading characters to fit the target length.

A concrete linked data example is years before the year 1000.  Such years are often represented by fewer digits, but the [XML Schema Datatypes standard](https://www.w3.org/TR/xmlschema11-2/#rf-lexicalMappings-datetime) requires that all years are represented with at least 4 digits.

Suppose we have the following table of input data:

| Artifact | Year |
| -------- | ---- |
| 00000001 |  612 |
| 00000002 | 1702 |

We can ensure that all years will have at least 4 digits by calling the following function:

```ts
mw.change({
  key: 'Year',
  type: 'string',
  change: value => value.padStart(4, '0'),
}),
```

After applying the function, the RATT record looks as follows:

| Artifact | Year |
| -------- | ---- |
| 00000001 | 0612 |
| 00000002 | 1702 |


##### Cast numeric data

Some source data formats are unable to represent numeric data.  A common example of this is [CSV/TSV](#csv), where every cell in a table is represented as a string.

If a source data format that cannot represent numeric data is used, it is often useful to cast such strings to numbers in RATT using the `change` function.

For example, assume the following input table using strings to encode the number of inhabitants for each country:

| Country     | Inhabitants   |
| ----------- | ------------- |
| France      | ''            |
| Germany     | '83190556'    |
| Italy       | 'empty'       |
| Netherlands | '17650200'    |

We can cast values with the `'Inhabitants'` key to a number in the following way:

```ts
mw.change({
  key: 'Inhabitants',
  type: 'unknown',
  change: value => +(value as number)}),
```

Notice that the type must be set to `'unknown'` because a string is not allowed to be cast to a number in TypeScript (because not every string *can* be cast to a number).

After the `change` has been applied, the RATT record looks like this:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | 0           |
| Germany     | 83190556    |
| Italy       | null        |
| Netherlands | 17650200    |

Notice that strings that encode a number are correctly transformed, and non-empty strings that do not encode a number are transformed to `null`.  Most of the time, this is exactly the behavior that you want in a linked data pipeline.  When [creating statements](#create-statements) later, no statement will be created for entries that have value `null`.  See the [section on working with null values](#null-values) for more information.

Also notice that the empty string is cast to the number zero.  Most of the time, this is *not* what you want.  If you want to prevent this transformation from happening, and you almost certainly do, you must [proces this data conditionally](#process-data-conditionally).


<h5 id="translation-table">Change values using a known translation table</h5>

We sometimes want to translate a finite set of known values in the source data to corresponding linked data terms.

###### When to use?

This approach is used when:

- The set of values is small.
- The set of values is known ahead of time.
- The appearance of a new value is considered an error in the source data.
- The corresponding linked data terms are known ahead of time.

###### Translation table

Because the translation from source values to linked data terms is known ahead of time, a translation table can be constructed.

We use the following example, where English names of countries are translated to linked data IRIs:

| Source value | Linked data term |
| ------------ | ---------------- |
| Belgium      | `country.be`     |
| France       | `country.fr`     |
| Germany      | `country.de`     |
| Netherlands  | `country.nl`     |
| Austria      | `country.at`     |

###### Implementation

The translation table can be implemented with a `switch`-statement.  Every `case`-statement corresponds with one translation.  The `default`-statement ensures that (future) unanticipated source values will be noticed.

```ts
mw.change({
  key: 'Source value',
  type: 'string',
  change: value => {
    switch(value) {
    case 'Belgium':     return country.be
    case 'France':      return country.fr
    case 'Germany':     return country.de
    case 'Netherlands': return country.nl
    case 'Austria':     return country.at
    default: throw Error(`Unexpected country name ${value}.`)}}}),
```


##### Split values

Sometimes a value in the source data contains a concatenation of multiple smaller values.

###### Source format considerations

In tabular source data the concatenation of multiple values is not uncommon.  Depending on how you look at it, such concatenations may be considered a data quality issue.  Tree-shaped source formats often do allow multiple values to be stored natively, for example JSON and XML.  If your tabular source data often contains multiple values in one cell, consider changing the source format to more reliably represent the encoded information.

###### When to use?

This approach is used when:

- The source data contains singular values that encode multiple values.
- The source data cannot be easily changed to a format that stores these multiple values natively (see above).
- The values are reliably separated with a known separator string.

###### Implementation

The following implementation uses the `change` function to split values:

```ts
app.use(
  mw.change({
    key: 'KEY_NAME',
    change: values =>
      values.split('SEPARATOR')
        .map(value => value.trim())
        .filter(value => value)}),
)
```

The following values must be added for a concrete application:
- `KEY_NAME` must be the name of a key in the RATT record.
- `SEPARATOR` must be the string that separates the multiple values (e.g., `,` or `;` are commonly used for this).

Notice the following details about this implementation:
- The `map` function is called immediately after splitting, to ensure that surrounding whitespace is removed from the newly split values.
- The `filter` function is called to remove empty strings from the results.  Such empty values are almost never stored in linked data.

Notice that the functional style of programming allows us to perform multiple tasks concisely using maps and filters.

###### Example

Assuming the following source data:

| Parent | Child           |
| ------ | --------------- |
| Mary   | 'Kate, John ,,' |
| John   | 'Mary,,,      ' |

We use the following RATT code:

```ts
app.use(
  mw.change({
    key: 'Child',
    change: values =>
      values.split(',')
        .map(value => value.trim())
        .filter(value => value)}),
)
```

This results in the following RATT record:

| Parent | Child           |
| ------ | --------------- |
| Mary   | ['Kate','John'] |
| John   | ['Mary']        |



#### Changing variants

A *variant* is a value that does not always have the same type.  Variants appear in dirty source data, where a value is sometimes given in one way and sometimes in another way.

If variants are very common then it may be a good idea to look for better source data.  But if that is not feasible, the `change` value can be used to change such variants into uniform values.

Notice that this use case only works for values that have a known set of potential types.  If the source data contains values whose types can vary arbitrarily, then there is no point in using the data.  This means that the source data inherently has no structure, and that traditional transformations cannot be applied.

##### When to use?

This use case can be applied if the following conditions are met:

- The type of a value differs between records.
- The different types that the value can have are known ahead of time.
- The different types that the value can have can be determined unambiguously.

##### Implementation

In such cases we must set the `type` to `'unknown'`.  This allows us to cast the value to a variant.  A variant is represented with the pipe character `|` in TypeScript:

```ts
app.use(
  mw.change({
    key: 'KEY',
    type: 'unknown',
    change: value => {
      const tmp = value as TYPE_1 | ... | TYPE_N
      if (typeof tmp === TYPE_1) {
        FUNCTION_BODY_1
      ...
      } else if (typeof tmp === TYPE_N) {
        FUNCTION_BODY_N
      }}}),
)
```

Notice that a temporary object (`tmp`) is used to store the variant that is the result of casting the current `value`.

For each of the types (`TYPE_1` through `TYPE_N`) in the variant there is a dedicated function body (`FUNCTION_BODY_1` through `FUNCTION_BODY_N`).  There are *N* `if`-clauses that check for the type of the current `value`.

##### Example

In the following example the `name` of a person is sometimes given as a plain string and sometimes as an object with a `fistName` and a `lastName` key:

Record 1:
- name: 'John Doe'

Record 2:
- name:
  - firstName: 'Jane'
  - lastName: 'Doe'

The following function transforms this variant to a uniform string type:

```ts
app.use(
  mw.change({
    key: 'name',
    type: 'unknown',
    change: value => {
      const tmp = value as {firstName: string, lastName: string} | string
      if (typeof tmp === 'string') {
        return tmp
      } else {
        return tmp.firstName+' '+tmp.lastName
      }}}),
)
```

This results in a uniform (i.e., non-variant) RATT record:

| name       |
| ---------- |
| 'John Doe' |
| 'Jane Doe' |



<h3 id='copy'>Copy an existing entry over to a new entry (<code>copy</code>)</h3>

Copying is the act of creating a new thing that is based on a specific existing thing.

#### Function signature

The `copy` function has the following signature:

```ts
app.use(
  mw.copy({
    fromKey: 'FROM_KEY',
    type: 'FROM_TYPE',
    toKey: 'TO_KEY',
    change: value => FUNCTION_BODY}),
)
```

This function copies the value from ‘foo’ to ‘bar’.  The `type` key ensures that the value in ‘foo’ is cast to the specified type prior to being copied.

The optional `change` key allows the cast value to be transformed prior to storing it in ‘bar’.  Leaving the `change` key out results in a direct copy in which the value is not modified.

This function emits an error if `fromKey` and `toKey` are the same.  If you want to change a value in-place you should use [`change`](#change) instead.

This function emits an error if `toKey` already exists.  If you want to replace the value in an existing entry then you should use [`replace`](#replace) instead.

The `change` function only takes the `value` argument and does not take the `context` argument.  If you need the `context` argument then they must use [`add`](#add) instead.



<h3 id='replace'>Replace an existing entry based on one other entry (<code>replace</code>)</h3>

#### Function signature

The `replace` function has the following signature:

```ts
app.use(
  mw.replace({
    fromKey: 'FROM_KEY',
    type: 'FROM_TYPE',
    toKey: 'TO_KEY',
    change?: value => FUNCTION_BODY}),
)
```

- `FROM_KEY` is the name of the entry whose value is going to be used to replace the old value with.
- `FROM_TYPE` is the name of the type that the value in `FROM_KEY` is cast to prior to calling the `change` function on it.
- `TO_KEY` is the name of the entry whose value is going to be replaced.
- The `change` key optionally specifies a function that takes the cast `value` of `FROM_KEY` and that returns the value that will be stored in `TO_KEY`.  If the `change` function is not specified, it is identical to `value => value`.

##### Error conditions

This function emits an error under the following conditions:
- If `FROM_KEY` does not exist in the current RATT record.
- If `TO_KEY` does not exist in the current RATT record.
- If `FROM_KEY` and `TO_KEY` are the same.  Use [`change`](#chage) if you want to change a value in-place.



<h3 id='add'>Add a new entry based one more than one other entries (<code>add</code>)</h3>

Sometimes a new entry must be added to the RATT record.  If this entry is based on exactly one existing entry then function [`copy`](#copy) is used.  But if the newly added entry depends on more than one entry, then function `add` must be used.

Notice that it is bad practice to use `add` to add a new entry that is based on exactly one existing entry.  In such cases, the use of `copy` is better because it does not require access to the full RATT context.

#### Function signature

The `add` function has the following signature:

```ts
app.use(
  mw.add({
    key: 'NEW_KEY',
    value: context => FUNCTION_BODY}),
)
```

The function can be configured in the following ways:
- `NEW_KEY` must be the name of a new entry in the RATT record.
- `FUNCTION_BODY` the body of a function, taking the RATT context as its input parameter (`context)` and ending with a `return` statement returning the newly added value.

#### Error conditions

This function emits an error if `NEW_KEY` already exists in the current RATT record.

#### Use cases

A common use case for `add` is to create a new column that combines values from two or more entries.

For example, a RATT Record may contain a column for the first name and a column for the last name of persons:

| First name | Last name |
| ---------- | --------- |
| John       | Doe       |
| Jane       | Doe       |

The following example code uses `add` to concatenate these two value into a new value called `Full name`:

```ts
app.use(
  mw.add({
    key: 'Full name',
    value: context =>
      context.asString('First name') +
      ' ' +
      context.asString('Last name')}),
)
```

After this `add` transformation, the RATT Record looks as follows:

| First name | Last name | Full name |
| ---------- | --------- | --------- |
| John       | Doe       | John Doe  |
| Jane       | Doe       | Jane Doe  |


### Record-wide transformations

So far this section has described value-level transformations.  This subsection decribes transformations that are applied to the RATT Record level.  These transformations can also be applied at the value level, but would be repetitive to apply multiple times.

#### Remove trailing whitespace

Whitespace at the beginning or end of value is almost never useful.  At the same time, such superfluous whitespace often appears in several parts of the source data.  Since it would be inefficient to remove trailing whitespace on a per-key basis, it is better to remove it for all keys at once.

The following example code removes training whitespace from all values in the current RATT Record:

```ts
app.use(
  mw.trimStrings(),
)
```



<h2 id='create-statements'>Create statements</h2>

After source data is connected and transformed, the RATT Record is ready to be transformed to linked data.  Linked data statements are assertions or factual statements that consist of 3 terms (triple) or 4 terms (quadruples).

Statements are created with the `mw.addQuad` function.  Calls to this function are part of the pipeline, and must appear inside the scope of `app.use`.


<h3 id="static-assertions">Create static statements</h2>

Static linked data statements are statements that only make use of constant terms (see [working with IRIs](#working-with-iris)).  Constant terms are introduced at the beginning of a RATT pipeline, typically prior to the occurrence of the first `app.use` scope.

The following static statements make use of the constant terms introduced in the section on [working with IRIs](#working-with-iris).

```ts
app.use(
  // “John is a person.”
  mw.addQuad(ex.john, a, foaf.Person),
  // “Mary is a person.”
  mw.addQuad(ex.mary, a, foaf.Person),
)
```


<h3 id="dynamic-assertions">Create dynamic statements</h3>

Dynamic statements are statements that are based on some aspect of the source data.

We use the following RATT Record as an example:

| Country     | Inhabitants |
| ----------- | ----------- |
| France      | null        |
| Germany     | 83190556    |
| Netherlands | 17650200    |

We start with creating the prefix and term declarations (see the section on [working with IRIs](#working-with-iris) for more information):

```ts
const prefix_base = Ratt.prefixer('https://triplydb.com/Triply/example/')
const prefix = {
  def: Ratt.prefixer(prefix_base('def/')),
  id: Ratt.prefixer(prefix_base('id/')),
  xsd: Ratt.prefixer('http://www.w3.org/2001/XMLSchema#'),
}

const def = {
  Country: prefix.def('Country'),
  name: prefix.def('inhabitants'),
}

const xsd = {
  positiveInteger: prefix.xsd('positiveInteger'),
  string: prefix.xsd('string'),
}
```

With these prefix and term constants in place, a dynamic statement is created as follows:

```ts
app.use(
  mw.addQuad(
    mw.toIri('Country', {prefix: prefix.id}),
    def.inhabitants,
    mw.toLiteral('Inhabitants', {datatype: xsd.decimal})),
)
```

Notice the following details:
- `mw.toIri` is used to create a dynamic IRI term.
- Arguments `Country` and `Inhabitants` allow values for these keys to be used from processed RATT Records.
- The IRI prefix for the subject term is specified with constant `prefix.id`.
- `mw.toLiteral` is used to create a dynamic literal term.
- For literals a datatype IRI can be specified.  If no datatype IRI is specified then the default IRI is `xsd.string`.



## Record IDs

If your RATT Records do not contain a unique ID then you can use the `recordId` entry that RATT adds automatically.  These `recordId` values are unique for every record processed in the same pipeline, but they are not an entry into the RATT Record by default.

Record IDs are consistently assigned across runs of the same pipeline.  They generate the same output as long as the input does not change.

The following example code shows how the record ID can be added to each RATT Record:

```ts
app.use(
  mw.add({
    key: 'ID',
    value: context => app.prefix.observation(context.recordId.toString()) }),
  mw.addQuad(mw.toIri(key_id, {prefix: prefix.id}), a, def.Country),
)
```



<h2 id='process-data-conditionally'>Process data conditionally</h2>

Source data often contains optional values.  These are values that appear in some, but not all records.

Source data often contains 'special' values to denote the absence of a value.  Common examples are values such as `'NULL'` or the empty string (`''`) or 'clear' outliers such as `9999` for a missing year.  We call such values ‘null values’.

The `mw.when` function supports the creation of triples under certain conditions.  The first argument that this function takes establishes whether or not a certain condition is met.  After that, one or more additional statement arguments appear that will only be called if the condition is satisfied.  The generic structure of `mw.when` is as follows:

```ts
app.use(
  mw.when(
    '{condition}',
    '{statement-1}',
    '{statement-2}',
    '{statement-3}',
    ...,
  )
)
```

Notice that it is often useful to specify multiple statements under the same condition:

1. The first statement transforms an optional value, and the second statement uses the transformed optional value to make a triple assertion.
2. The first statement asserts one triple based on the optional value, and the second statement asserts a second triple based on the same optional value.


<h3 id='null-values'>Null values</h3>

If a key contains a null value in some records, then we need to specifically identify the criteria under which a triple must be added.

```ts
app.use(
  // The source data uses '9999' to denote an unknown creation year.
  mw.when(
    context => context.getNumber('CREATED') != 9999),
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      dct.created,
      mw.toLiteral('CREATED', {datatype: xsd.gYear}))),
)
```

Notice that the conditional function inside the `mw.when` function takes the current RATT context as its single argument and returns a Boolean.


### Missing values

If a value is sometimes completely missing from a source data record, then the following construct can be used to only add a triple in case the value is present:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  mw.when(
    context => context.isNotEmpty('ZIPCODE'),
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      def.zipcode,
      mw.toLiteral('ZIPCODE')),
    ...,
  ),
)
```

Because missing values are very common in source data, RATT introduces special support for when the value for a specific key is missing.  Instead of having to write `context => context.isNotEmpty('foo')` one can simply write the key name instead.  The above example is equivalent to the following:

```ts
app.use(
  // The source data does not always include a value for 'zipcode'.
  mw.when(
    'ZIPCODE',
    mw.addQuad(
      mw.toIri('ID', {prefix: prefix.id}),
      def.zipcode,
      mw.toLiteral('ZIPCODE')),
    ...,
  ),
)
```


### The empty string

Because source data often uses the empty string to signify NULL values, this particular string is treated in a special way by RATT.

```ts
app.use(
  mw.when(
    key.zipcode,
    // Skipped for the empty string.
    ...),
)
```

Notice that it is almost never useful to store the empty string in linked data.  So the treatment of the empty string as a NULL value is the correct default behavior.



## Validating RDF output

RATT is able to automatically validate the RDF that is generated in the pipeline against a SHACL information model.

```ts
app.use(
  // Create all linked data statements.
  …
  // Now that all the data is created, validate it using a model.
  mw.validateShacl(app.sources.model)
)
```


### Validation report

Validation creates a report that is asserted in linked data.  This report can be stored as a named graph in the created linked dataset.

The following example code stores the validation report in a dedicated named graph:

```ts
const prefix = {
  graph: 'https://triplydb.com/Triply/example/graph/',
}

const graph = {
  report: prefix.graph('report'),
}

app.use(
  // Create all linked data statements.
  …
  // Now that all the data is created, validate it using a model.
  mw.validateShacl(
    app.sources.model,
    {report: {destination: app.sources.dataset,
              graph: graph.report}}),
)
```


### Termination conditions

The `validateShacl` function can optionally be given the `terminateOn` option.  This option determines when validation halts.  It can take the following values:

<dl>
  <dt><code>false</code></dt>
  <dd>Do not halt; run the validation for the full dataset.</dd>
  <dt><code>'Violation'</code></dt>
  <dd>Halt validation when the first SHACL Violation is encountered.</dd>
  <dt><code>'Warning'</code></dt>
  <dd>Halt validation when the first SHACL Violation or SHACL Warning is encountered.</dd>
  <dt><code>'Info'</code></dt>
  <dd>Halt validation when the first SHACL Violation or SHACL Warning or SHACL Informational message is encountered.</dd>
</dl>

The following example code lets validation run for the full dataset, regardless of how many violations, warnings, and/or information messages are encountered:

```ts
app.use(
  // Create all linked data statements.
  …
  // Now that all the data is created, validate it using a model.
  mw.validateShacl(app.sources.model, {terminateOn: false}
)
```



## Debugging RATT pipelines

When developing a RATT pipeline, you must often inspect the data that flows through the pipeline.  Inspecting the data flow allows you to find problems quickly and ensures that data is handled correctly by your RATT script.


### Printing the current RATT Record

One of the most useful tools for inspecting your pipeline is the `logRecord` function.  It prints the current RATT record to standard output (e.g. your terminal).

At any moment in the RATT pipeline, the current RATT record can be printed to the terminal with the following command:

```ts
app.use(
  mw.logRecord(),
)
```

For [the Iris dataset](https://triplydb.com/Triply/iris) this emits the following output:

```json
{
  'sepal.length': '5.9',
  'sepal.width': '3',
  'petal.length': '5.1',
  'petal.width': '1.8',
  'variety': 'Virginica'
}
```

Notice that the printed record includes both the keys and the values.


#### Use multiple `logRecord` statements

In addition to inspecting the RATT Record once, it is common practice to place two or more `logRecord` statements at different positions in a RATT script.  This allows you to inspect how data changes throughout the pipeline process.


#### Log specific keys

Sometimes a RATT Record can be long and you may only be interested in a small number of keys.  In such cases the interesting keys can be specified in the call to `logRecord`:

```ts
app.use(
  mw.logRecord({key: key.variety}),
)
```


### Limit the number of records

When developing a pipeline, it is often not needed to process all records from the input data source all the time.

In order to keep the feedback loop small, one can make use of the `--head` flag when running RATT:

```sh
yarn ratt ./lib/main.js --head 1
yarn ratt ./lib/main.js --head 10
```

The above commands process only the first record and the first 10 records, respectively.

#### Specify a range of records

When developing a pipeline over a large source data collection, it is often standard practice to use the first 10 or 100 records most of the time.

The benefit of this approach is that the feedback loop between making changes and receiving feedback is short.  A downside of this approach is that the ETL may be overly optimized towards these first few records.  For example, if a value is missing in the first 1.000 records, then transformations that are necessary for when the value is present will not be developed initially.  An alternative is to run the entire ETL, but that takes a long time.

To avoid the downsides of using `--head`, RATT also supports the `--fromRecordId` flag.  This flag specifies the number of records that are skipped.  This allows us to specify an arbitrary consecutive range of records.  For example, the following processes the 1.001-st until and including the 1.010-th record:

```sh
yarn ratt ./lib/main.js --fromRecordId 1000 --head 10
```

#### Process a specific record

When the `--head` flag is set to 1, the `--fromRecordId` flag specifies the index of a single specific record that is processed.  This is useful when a record is known to be problematic, for instance during debugging.

The following command runs RATT for the 27th record:

```sh
yarn ratt ./lib/main.js --fromRecordId 26 --head 1
```


### Verbose mode

When RATT is run normally, the following information is displayed:

<!-- <https://issues.triply.cc/issues/5600>
- The number of SHACL Violations, Warnings and Informational messages encountered.
-->
- The number of added triples.
- The runtime of the script.
- An error message, if any occurred.

It is possible to also show the following additional information by specifying the `--verbose` flag:

- In case of an error, the first 20 values from the last processed RATT record.
- In case of an error, the full stack trace.

The following example shows how the `--verbose` flag can be used:

```sh
yarn ratt ./lib/main.js --verbose
```

#### Secure verbose mode

<!-- <https://issues.triply.cc/issues/5603> -->
Verbose mode may perform a reset of your current terminal session.  If this happens you lose visible access to the commands that were run prior to the last RATT invocation.

This destructive behavior of verbose mode can be disabled by adding the following [environment variable](../generics/environment-variable):

```sh
export CI=true
```

This fixes the reset issue, but also makes the output less colorful.



## Configuring the RATT Context

The RATT Context is specified when the `Ratt` object is instantiated.  This often appears towards the start of a pipeline script.  The RATT Context allows the following things to be specified:

- The data sources that can be used in the ETL.
- The data destinations where linked data is published to.
- The named graph in which `addQuad` calls with no graph argument add their data.
- The prefix IRI for blank node-replacing well-known IRIs.


### Configuring the standard graph

When we call `mw.addQuad` with 3 arguments, a triple is created and placed in a named graph that is chosen by RATT.  You can change the name of this default graph by specifying it in the RATT context.  Notice that graph names must be IRIs:

```ts
const app = new Ratt({
  defaultGraph: 'https://triplydb.com/Triply/example/graph/default,
})
```

### Configuring the well-known IRI prefix

TriplyDB performs Skolemization, an approach in which blank nodes are systematically replaced by well-known IRIs.  TriplyDB chooses a well-known IRI prefix for you,

```ts
const app = new Ratt({
  wellKnownIriPrefix: 'https://triplydb.com/Triply/example/.well-known/genid/',
})
```


### Configuring data sources

It is possible to specify the data source in the RATT context.  This is especially useful when you have many sources in one script.

```ts
const account = 'Triply'
const dataset = 'example'

const prefix = {
  graph: Ratt.prefixer('https://triplydb.com/'+account+'/'+dataset+'/graph'),
}https://issues.triply.cc/issues/5603
const graph = {
  model: prefix.graph('model'),
}

const app = new Ratt({
  sources: {
    instances: Ratt.Source.TriplyDb.asset(account, dataset, {name: 'data.csv.gz'}),
    model: Ratt.Source.TriplyDb.rdf(account, dataset, {graph: graph.model}),
  },
})
```


### Configuring data destinations

Destinations are online locations in TriplyDB where the output of your pipeline will be published.

If no `accountName` is given, pipeline output is uploaded under the user account tied to the currently used API Token.

```ts
Ratt.Destination.TriplyDb.rdf(datasetName)
Ratt.Destination.TriplyDb.rdf(accountName, datasetName)
Ratt.Destination.TriplyDb.rdf(accountName, datasetName, {overwrite: true})
```

The following options can be specified to configure the destination behavior:

<dl>
  <dt><code>overwrite</code></dt>
  <dd>Whether the graphs that are being uploaded by RATT should replace any existing graphs with the same name in the dataset. Graphs appearing in the dataset with a different name than those uploaded by RATT are kept. The default value is <code>false</code>.</dd>
  <dt><code>defaultGraph</code></dt>
  <dd>The standard graph name that will be used for storing the triples that originate from the RATT pipeline.  This overrides the required <code>defaultGraph</code> configuration in the RATT context.  (See the section on <a href='#configuring-the-standard-graph'>configuring the standard graph</a> for more information.)</dd>
  <dt><code>synchronizeServices</code></dt>
  <dd>Whether active services should be automatically synchronized once new data is uploaded.  The default value is <code>false</code>.</dd>
  <dt><code>triplyDb</code></dt>
  <dd>A configuration object describing a TriplyDB instance that is different from the one associated with the current API Token.  (See the section on <a href="#configuring-multiple-triplydb-instances">configuring multiple TriplyDB instance</a> for more information.)</dd>
  <dt><code>truncateGraphs</code></dt>
  <dd>Whether to delete all graphs in the dataset before uploading any graphs from RATT. Notice that this will also remove graphs that will not be re-uploaded by RATT. The default value is <code>false</code>.</dd>
</dl>


#### Local data destinations

RATT supports publishing RDF output into a local file.  This is not often used, because files lack many of the features that TriplyDB destinations support, such as:

- The ability to browse the data.
- The ability to query the data.
- The ability to configure metadata.
- The ability to configure prefix declarations.

Still, there may be cases in which a local file destination is useful, for example when you do not have an active Internet connection:

```ts
Ratt.Destination.file("my-file.trig"),
```


### Configuring multiple TriplyDB instances

It is possible to use multiple TriplyDB instances in one RATT pipeline.

The following example illustrates how the data model is used from the production instance of TriplyDB.

```ts
const account = 'Triply'
const dataset = 'example'
const app = new Ratt({
  sources: {
    data_model:
      Ratt.Source.TriplyDb.rdf(
        account,
        dataset,
        {triplyDb: {token: process.env['PRODUCTION_INSTANCE_TOKEN'],
                    url: 'https://api.production.example.com'}}),
    instance_data:
      Ratt.Source.TriplyDb.rdf(
        account,
        dataset,
        {triplyDb: {token: process.env['ACCEPTANCE_INSTANCE_TOKEN'],
                    url: 'https://api.acceptance.example.com'}}),
  },
})
```



## Setting up acceptance/production runs

When working on a pipeline it is best to at least run it in the following two modes:

<dl>
  <dt>Acceptance mode</dt>
  <dd>Upload the result of the pipeline to the user account for which the API Token was created.</dd>
  <dt>Production mode</dt>
  <dd>Upload the result of the pipeline to the organization where the production version of the data is published.</dd>
</dl>

Having multiple modes ensures that the production version of a dataset is not accidentally overwritten during development.

```ts
const app = new Ratt({
  sources: {
    instances: Ratt.Source.TriplyDb.assets(account, dataset, {name: 'data.csv.gz'}),
    model: Ratt.Source.TriplyDb.rdf(account, dataset, {graph: graph.model}),
  },
  destinations: {
    remote:
      process.env['TARGET']=='Production'
      ? Ratt.Destination.TriplyDb.rdf(account, dataset, {overwrite: true}),
      : Ratt.Destination.TriplyDb.rdf(account+'-'+dataset, {overwrite: true}),
  },
})
app.use(
  mw.fromCsv([
    app.sources.instances,
    app.sources.model
  ]),
  mw.toRdf(app.destinations.remote),
)
```

If you want to run the pipeline in production mode, add the following [environment variable](../generics/environment-variable):

```sh
export TARGET=Production
```



## Upgrading RATT

New versions of RATT are released regularly.  Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs.  At the same time, updating to a new version may require changes to your pipeline.  The following sections describe how an upgrade can be performed reliably.

### Check for a new version

You can check for updated by running the following command in your project directory:

```sh
yarn upgrade-interactive
```

This will display the list of packages for which updates are available.  If RATT appears in this list, notice the old and new version numbers.  These numbers are used in the next section to assess the impact of upgrading.

### Assess the impact of upgrading

RATT uses the [Semantic Versioning](https://semver.org) approach for structuring version numbers: `{major}.{minor}.{patch}`  The impact of upgrading to a new RATT version can be assessed as follows:

  - If only the `{patch}` number has increased, then an upgrade is not expected to affect existing functionality.  The new release only contains bug fixes and/or small changes to functionality that does not break existing pipelines.

  - If the `{minor}` number has increased, but the `{major}` number is the same, then an upgrade may require small changes to an existing pipeline.  A minor upgrade will never remove existing functionality, but it may change details of how existing functionality works (e.g. the settings for an existing function may have undergone minor changes).

    Minor releases are likely to include significant *new* functionality that may benefit an existing pipeline.  Check the [release changelog](#todo) to see which new features are available.

  - If the `{major}` number has increased, an upgrade is likely to require changes to existing pipelines.  Major releases often remove outdated functionalities or bring significant changes to the behavior of existing functionalities.

    Make sure to always check the [release changelog](#todo) when upgrading to a new major version.  And make sure to test your pipeline after performing a major upgrade.

### Perform the upgrade

After having assessed the impact of upgrading, an upgrade can be effectuated by running the following command again:

```sh
yarn upgrade-interactive
```

Select the RATT option, if it appears in the list of available updates, by using the up and down arrows.  Select the RATT update by pressing `SPC` (spacebar) and press `RET` (return/enter) to perform the upgrade.

After the upgrade is applied, the `yarn.lock` file is automatically changed.  These automatic changes must be part of the next Git commit that is made.

Run the following command to build your pipeline with the new RATT version:

```sh
yarn build
```

Make any fixes/changes to the pipeline that are necessary and make a commit that indicates that the RATT version was upgraded.

## Appendix 1: Commonly used prefix declarations

```ts
const prefix = {
  dbo: Ratt.prefixer('http://dbpedia.org/ontology/'),
  dbr: Ratt.prefixer('http://dbpedia.org/resource/'),
  geo: Ratt.prefixer('http://www.opengis.net/ont/geosparql#'),
  owl: Ratt.prefixer('http://www.w3.org/2002/07/owl#'),
  pnv: Ratt.prefixer('https://w3id.org/pnv#'),
  qb: Ratt.prefixer('http://purl.org/linked-data/cube#'),
  rdf: Ratt.prefixer('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  rdfs: Ratt.prefixer('http://www.w3.org/2000/01/rdf-schema#'),
  sdo: Ratt.prefixer('https://schema.org/'),
  sh: Ratt.prefixer('http://www.w3.org/ns/shacl#'),
  topic: Ratt.prefixer('https://triplydb.com/Triply/topics/id/'),
  xsd: Ratt.prefixer('http://www.w3.org/2001/XMLSchema#'),
}
```



## Appendix 2: Commonly used vocabularies

### GeoSPARQL

```ts
const geo = {
  asWKT: prefix.geo('asWKT'),
  sfContains: prefix.geo('sfContains'),
  wktLiteral: prefix.geo('wktLiteral'),
}
```

### Web Ontology Language (OWL)

```ts
const owl = {
  Class: prefix.owl('Class'),
  DatatypeProperty: prefix.owl('DatatypeProperty'),
  ObjectProperty: prefix.owl('ObjectProperty'),
  sameAs: prefix.owl('sameAs'),
}
```

### Person Name Vocabulary (PNV)

```ts
const pnv = {
  infix: prefix.pnv('infix'),
}
```

### Resource Description Framework (RDF)

The core IRI terms that are part of the RDF 1.1 standard.

```ts
const rdf = {
  List: prefix.rdf('List'),
  nil: prefix.rdf('nil'),
  type: prefix.rdf('type'),
}
```

Notice that the popular Turtle and TriG syntaxes allow the letter `a` to be used to denote the IRI term `rdf:type`, but only when that term is used in the predicate position.

A notation that is similar to this can be used in RATT by adding the following declaration:

```ts
const a = rdf.type
```

But notice that it is not possible to exclude the use of `a` in the subject, object, or even graph position.  If this declaration is used in RATT then it is up to the developer to enforce its exclusive use in the predicate position.

### RDF Schema (RDFS)

```ts
const rdfs = {
  Class: prefix.rdfs('Class'),
  label: prefix.rdfs('label'),
  subClassOf: prefix.rdfs('subClassOf'),
}
```

### Schema.org

```ts
const sdo = {
  Female: prefix.sdo('Female'),
  Male: prefix.sdo('Male'),
  Person: prefix.sdo('Person'),
  Place: prefix.sdo('Place'),
  address: prefix.sdo('address'),
  birthPlace: prefix.sdo('birthPlace'),
  children: prefix.sdo('children'),
  containedInPlace: prefix.sdo('containedInPlace'),
  deathDate: prefix.sdo('deathDate'),
  deathPlace: prefix.sdo('deathPlace'),
  description: prefix.sdo('description'),
  familyName: prefix.sdo('familyName'),
  gender: prefix.sdo('gender'),
  givenName: prefix.sdo('givenName'),
  hasOccupation: prefix.sdo('hasOccupation'),
  homeLocation: prefix.sdo('homeLocation'),
  identifier: prefix.sdo('identifier'),
  name: prefix.sdo('name'),
  parent: prefix.sdo('parent'),
  relatedTo: prefix.sdo('relatedTo'),
  spouse: prefix.sdo('spouse'),
  url: prefix.sdo('url'),
}
```

### XML Schema Datatypes (XSD)

```ts
const xsd = {
  anyURI: prefix.xsd('anyURI'),
  boolean: prefix.xsd('boolean'),
  date: prefix.xsd('date'),
  dateTime: prefix.xsd('dateTime'),
  decimal: prefix.xsd('decimal'),
  duration: prefix.xsd('duration'),
  nonNegativeInteger: prefix.xsd('nonNegativeInteger'),
  string: prefix.xsd('string'),
}
```
