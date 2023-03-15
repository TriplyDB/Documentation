---
title: "Triply ETL: Declarations"
path: "/docs/triply-etl/declarations"
---

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
  triple(ex.john, ex.knows, ex.mary),
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
  triple(ex.john, a, foaf.Person),
  // “Mary is a person.”
  triple(ex.mary, a, foaf.Person),
)
```

Because the `foaf` and `ex` objects have been declared at the start of the pipeline, the rest of the pipeline can use autocompletion for IRIs terms.  This works by typing the namespace alias and a dot (for example: `foaf.`) and pressing `Ctrl + SPC` (control and space at the same time).  In modern code editors this will bring up a list of autocomplete results.

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
  triple(foaf.Person, is_a, foaf.Agent)
)
```

## Configuring the RATT Context {#context}

The RATT Context is specified when the `Ratt` object is instantiated.  This often appears towards the start of a pipeline script.  The RATT Context allows the following things to be specified:

- The data sources that can be used in the ETL.
- The data destinations where linked data is published to.
- The named graph in which `triple` calls with no graph argument add their data.
- The prefix IRI for blank node-replacing well-known IRIs.


### Configuring the standard graph

When we call `triple` with 3 arguments, a triple is created and placed in a named graph that is chosen by RATT.  You can change the name of this default graph by specifying it in the RATT context.  Notice that graph names must be IRIs:

```ts
const app = new Ratt()
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

```typescript
export function create_prefixes(
  organization: string = default_organization,
  dataset: string,
  host: string = default_host
) {
  const prefix_base = Ratt.prefixer(`https://${host}/${organization}/${dataset}/`)
  const prefix_bnode = Ratt.prefixer(prefix_base(`.well-known/genid/`))
  const prefix_graph = Ratt.prefixer(prefix_base(`graph/`))
  return {
    bnode: prefix_bnode,
    graph: prefix_graph,
  }
}
```
For example, if `host==='triplydb.com'`, `organization==='exampleOrganization'` and `dataset='pokemon'`, then the prefix for the blank nodes will be `https://triplydb.com/exampleOrganization/pokemon/.well-known/genid/`.

Then, similarly, you can use another function for the graph names:
```ts
export function create_graphs(
  dataset: string,
  organization: string = default_organization,
  host: string = default_host
) {
  const prefix = create_prefixes(dataset, organization, host)
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
}
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
const app = new Ratt()

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
  fromCsv([
    app.sources.instances,
    app.sources.model
  ]),
  toRdf(app.destinations.remote),
)
```

If you want to run the pipeline in production mode, set the following environment variable:

```ts
export TARGET=Production
```

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
  list: prefix.rdf('List'),
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
