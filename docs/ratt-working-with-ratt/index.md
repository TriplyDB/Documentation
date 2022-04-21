---
title: "RATT"
path: "/docs/ratt-working-with-ratt"
---

**RATT can only be used in combination with [TriplyDB](https://triply.cc/triplydb). Contact [info@triply.cc](mailto:info@triply.cc) for more information, or to check if you are allowed to use it.**

RATT is a [TypeScript package](https://www.npmjs.com/package/@triply/ratt) that is developed by [Triply](https://triply.cc/).  RATT makes it possible to develop and maintain production-grade linked data pipelines. It is used in combination with one of the [TriplyDB subscriptions](https://triply.cc/subscriptions) to create large-scale knowledge graphs.


## Debugging RATT pipelines

When developing a RATT pipeline, you must often inspect the data that flows through the pipeline.  Inspecting the data flow allows you to find problems quickly and ensures that data is handled correctly by your RATT script.


### Printing the current RATT Record

One of the most useful tools for inspecting your pipeline is the `logRecord` function.  It prints the current RATT record to standard output (e.g. your terminal).

At any moment in the RATT pipeline, the current RATT record can be printed to the terminal with the following command:

```ts
app.use(
  mw.debug.logRecord(),
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

```ts
app.use(
  mw.debug.logRecord(),
  mw.change({ … }), # Some change to the RATT record.
  mw.debug.logRecord(),
)
```

#### Log specific keys

Sometimes a RATT Record can be long and you may only be interested in a small number of keys.  In such cases the interesting keys can be specified in the call to `logRecord`:

```ts
app.use(
  mw.debug.logRecord({key: key.variety}),
)
```
### Trace changes in a record

Sometimes you are interested to find one specific record based on a certain value of a key and/or to see the changes in this record made by specific middlewares. For these purposes, `trace` middleware can be used.

Below, there is an example of how this middleware can be used:
```sh
app.use(
  mw.fromJson([
    { a: 1, b: 1 }, // first dummy record
    { a: 2, b: 2 }, // second dummy record
  ]),
    mw.change({key:'a', type:'number', change: (val) => val +100}), // change the 'a' key
    mw.debug.traceStart(),
    mw.change({key:'b', type:'number', change: (val) => val +100}), // change the 'b' key
    mw.debug.traceEnd()
)
```

The result would be:

```sh
┌─────────────────────────────────────┐
│      Record trace information       │
│ {                                   │
│   "a": 101,                         │
│   "b": 1                            │
│   "b": 101                          │
│ }                                   │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Quads trace information (unchanged) │
│ empty                               │
│                                     │
└─────────────────────────────────────┘


 To rerun the traced middlewares for this record use the following command:
 > yarn ratt ./lib/{script-name} --trace .trace-1650542307095


```

In your terminal the line with <span style="color:red">"b": 1</span> will be red colored, showing the previous state of this key-value and the line with <span style="color:green">"b": 101</span> will be green colored, showing the new state.

Also you can rerun the  trace information for this specific record by running:
```yarn ratt ./lib/{script-name} --trace .trace-1650542307095```

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

This destructive behavior of verbose mode can be disabled by adding the following [environment variable](environment-variable):

```sh
export CI=true
```

This fixes the reset issue, but also makes the output less colorful.



## Configuring the RATT Context {#context}

The RATT Context is specified when the `Ratt` object is instantiated.  This often appears towards the start of a pipeline script.  The RATT Context allows the following things to be specified:

- The data sources that can be used in the ETL.
- The data destinations where linked data is published to.
- The named graph in which `addQuad` calls with no graph argument add their data.
- The prefix IRI for blank node-replacing well-known IRIs.


### Configuring the standard graph

When we call `mw.addQuad` with 3 arguments, a triple is created and placed in a named graph that is chosen by RATT.  You can change the name of this default graph by specifying it in the RATT context.  Notice that graph names must be IRIs:

```ts
const app = new Ratt({
  defaultGraph: 'https://triplydb.com/Triply/example/graph/default',
})
```

### Configuring the well-known IRI prefix

TriplyDB performs Skolemization, an approach in which blank nodes are systematically replaced by well-known IRIs.  TriplyDB chooses a well-known IRI prefix for you,

```ts
const app = new Ratt({
  wellKnownIriPrefix: 'https://triplydb.com/Triply/example/.well-known/genid/',
})
```

##### An easier way to configure graph names and prefixes

Instead of setting the graph name and the prefixes for every ETL, you can use functions for their generation:

```sh
export function create_prefixes(
  organization: string = default_organization,
  dataset: string,
  host: string = default_host
) {
  let prefix_base = Ratt.prefixer(`https://${host}/${organization}/${dataset}/`)
  let prefix_bnode = Ratt.prefixer(prefix_base(`.well-known/genid/`))
  let prefix_graph = Ratt.prefixer(prefix_base(`graph/`))
  )
  return {
    bnode: prefix_bnode,
    graph: prefix_graph,
  }
}
```
For example, if `host==='triplydb.com'`, `organization==='exampleOrganization'` and `dataset='pokemon'`, then the prefix for the blank nodes will be `https://triplydb.com/exampleOrganization/pokemon/.well-known/genid/`.

Then, similarly, you can use another function for the graph names:
```sh
export function create_graphs(
  dataset: string,
  organization: string = default_organization,
  host: string = default_host
) {
  let prefix = create_prefixes(dataset, organization, host)
  return {
    default: prefix.graph('default'),
    metadata: prefix.graph('metadata'),
    instances: prefix.graph('instances'),
    instances_report: prefix.graph('instances/report'),
    shapes: prefix.graph('shapes'),
  }
}

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
#### Remote data destinations
Destinations are usually online locations in TriplyDB where the output of your pipeline will be published.

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
#### Static and Dynamic destinations
Destinations can be defined as static objects meaning that you can define destination beforehand. But it might be the case that you want to have multiple destinations for different records. In this case, you would need a dynamic destination, which should change based on certain information inside your source data.

You can set static and dynamic destinations, like below:
```ts
const app = new Ratt({
  defaultGraph: "https://triplydb.com/Triply/example/graph/default",
  sources: { someSource: Ratt.Source.file("source.trig") },
  destinations: {
    someStaticDestination: Ratt.Destination.file("static.ttl"),
    someDynamicDestination: (ctx) => Ratt.Destination.file(ctx.getString("destination"))
  },
})
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

### Direct copying of source data to destination

RATT supports copying sources directly to destination locations. This function is useful when you already have linked data that is used as a source, but is also needed at the destination. An example would be the information model. This would be available as a source, and with the copy function it can be uploaded to TriplyDB via RATT.

The following example shows the `copy` function:


```ts
  app.copySource(Ratt.Source.file(`${source_location}`), Ratt.Destination.TriplyDb.rdf(`${destination_name}`))
```

The function destination expects that source data is linked data. Copying a source that is not linked data can result in errors.

## Using TriplyDB.js in RATT

All operations that can be performed in a TriplyDB instance can be automated with classes and methods in the [TriplyDB.js](triplydb-js) library.  This library is also used by RATT in the background to implement many of the RATT functionalities.

Sometimes it is useful to use classes and methods in TriplyDB.js directly.  This is done in the following way:

```ts
// Create the RATT context.
const app = new Ratt({
  defaultGraph: ''
})

// Use the RATT context to access the TriplyDB.js connection.
console.log((await app.triplyDb.getInfo()).name)
```

The above example prints the name of the TriplyDB instance.  But any other [TriplyDB.js](triplydb-js) operations can be performed.  For example, the user of the current API Token can change their avatar image in TriplyDB:


```ts
const user = await app.triplyDb.getUser()
await user.setAvatar('my-avatar.png')
```

<!--
app.before(async () => {
  BODY
}
-->
<!--
app.after(async () => {
  BODY
}
-->



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

If you want to run the pipeline in production mode, add the following [environment variable](environment-variable):

```sh
export TARGET=Production
```



## Upgrading RATT

New versions of RATT are released regularly.  Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs.  At the same time, updating to a new version may require changes to your pipeline.  The following sections describe how an upgrade can be performed reliably.

### Check the current version
You can check the current version of RATT using the following command:
```sh
yarn list --pattern ratt
```

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

    Minor releases are likely to include significant *new* functionality that may benefit an existing pipeline.
<!-- <https://issues.triply.cc/issues/5881>
    Check the [release changelog](#todo) to see which new features are available.
-->

  - If the `{major}` number has increased, an upgrade is likely to require changes to existing pipelines.  Major releases often remove outdated functionalities or bring significant changes to the behavior of existing functionalities.

<!-- <https://issues.triply.cc/issues/5881>
    Make sure to always check the [release changelog](#todo) when upgrading to a new major version.  And make sure to test your pipeline after performing a major upgrade.
-->

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



## Commonly used prefix declarations

The following code snippet can be copy/pasted to introduce prefix declarations for commonly used external vocabularies and datasets:

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



## Commonly used vocabularies

The following code snippets can be copy/pasted to introduce terms for commonly used external vocabularies.

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
  'List': prefix.rdf('List'),
  first: prefix.rdf('first'),
  langString: prefix.rdf('langString'),
  nil: prefix.rdf('nil'),
  rest: prefix.rdf('rest'),
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

### SHACL

```ts
const sh = {
  'IRI': prefix.sh('IRI'),
  'Literal': prefix.sh('Literal'),
  'NodeShape': prefix.sh('NodeShape'),
  'PropertyShape': prefix.sh('PropertyShape'),
  class: prefix.sh('class'),
  closed: prefix.sh('closed'),
  datatype: prefix.sh('datatype'),
  ignoredProperties: prefix.sh('ignoredProperties'),
  languageIn: prefix.sh('languageIn'),
  maxCount: prefix.sh('maxCount'),
  minCount: prefix.sh('minCount'),
  minLength: prefix.sh('minLength'),
  name: prefix.sh('name'),
  nodeKind: prefix.sh('nodeKind'),
  path: prefix.sh('path'),
  property: prefix.sh('property'),
  targetClass: prefix.sh('targetClass'),
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
  integer: prefix.xsd('integer'),
  nonNegativeInteger: prefix.xsd('nonNegativeInteger'),
  string: prefix.xsd('string'),
}
```
