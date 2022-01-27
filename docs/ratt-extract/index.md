---
title: "RATT"
path: "/docs/ratt-extract"
---

**RATT can only be used in combination with [TriplyDB](https://triply.cc/triplydb). Contact [info@triply.cc](mailto:info@triply.cc) for more information, or to check if you are allowed to use it.**

RATT is a [TypeScript package](https://www.npmjs.com/package/@triply/ratt) that is developed by [Triply](https://triply.cc/).  RATT makes it possible to develop and maintain production-grade linked data pipelines. It is used in combination with one of the [TriplyDB subscriptions](https://triply.cc/subscriptions) to create large-scale knowledge graphs.

## RATT Connectors

RATT Connectors are modules that allow various backend systems to be connected to a RATT pipeline.

RATT Connectors generate RATT Records.  The RATT Records are used to configure the rest of the pipeline.  This decouples pipeline configuration from source system structure.  This is one of the essential features of RATT that set it apart from most other pipeline systems.


### Use Assets for static source data {#assets}

*Assets* are a feature of TriplyDB that allows storage of arbitrary files, including source data files.

Source data is often made available in static files.  For example, a pipeline may make use of a [Microsoft Excel](#excel) file and a collection of ESRI ShapeFiles.  Or a pipeline may use a relational database in addition to a set of CSV text files that store information that is not in the relational dataset.

If your pipeline needs to connect to static data files, it is a best practice to upload such files as TriplyDB Assets.  This has the following benefits:

<dl>
  <dt>Shareable</dt>
  <dd>TriplyDB Assets can be added to any TriplyDB Dataset.  This means that collaborators that have access to a dataset will also have access to the static data files that are needed to create the linked data in that dataset.</dd>
  <dt>Secure</dt>
  <dd>TriplyDB Assets are accessible under the same access levels as the TriplyDB Dataset to which they belong.  This means that you can share static data files in a secure way with your collaborators.</dd>
  <dt>Versioned</dt>
  <dd>TriplyDB Assets are versioned.  If a new version of the same static file becomes available, this file can be uploaded to the same TriplyDB Asset.  If there are problems with the new data files then your collaborators can always roll back to an earlier version of the source data.</dd>
  <dt>Transparent</dt>
  <dd>All collaborators have access to the same TriplyDB Assets.  This makes it transparent which static data files are needed, and which versions are available.  This is much more transparent than having to share (versions of) files over email or by other indirect means.</dd>
  <dt>Backed-up</dt>
  <dd>TriplyDB instances that are maintained by Triply are also backed up regularly.  This includes the static data files that are uploaded as TriplyDB Assets.  This is much more secure than storing static data files on a local laptop that can break, or where files can get lost otherwise.</dd>
</dl>


### Microsoft Excel (XLSX) files {#excel}

Microsoft Excel (file name extension `.xlsx`) is a popular file format for storing tabular source data.

RATT has a dedicated connector for Excel files.  After such files [are uploaded as TriplyDB Assets](#assets), RATT can connect to them as follows:

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
  mw.fromXlsx(Ratt.Source.triplyDb.asset(account, dataset, {name: 'my-table.xlsx'}))
)
```


### Comma Separated Values (CSV) files {#csv}

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

This is specifically an issue when tabular data contains numeric information.  Such numeric information will only be available as strings.  These strings must be explicitly transformed to numbers in RATT (see the [`change` function](#change)).

More advanced tabular formats like [Microsoft Excel](#excel) *are* able to store the types of values.

<!-- TODO
### ShapeFile (ESRI ArcGIS) {#shapefile}
-->

### JSON sources {#json}

JSON (JavaScript Object Notation) is a popular open standard for interchanging tree-shaped data.

The following example uses a JSON source that is stored as a [TriplyDB asset](#asset):

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
  mw.fromJson(Ratt.Source.triplyDb.asset(account, dataset, {name: 'my-data.json'})),
)
```

The following example uses an in-line specified JSON source:

```ts
app.use(
  mw.fromJson([{ a: "a", b: "b", c: "c" }]),
)
```

<!-- TODO
### PostgreSQL
-->

### SPARQL queries {#sparql-query}

RATT is able to use existing SPARQL queries as data sources.  This can be used to tap into existing RDF sources for transformation and/or enrichment.

This section assumes a SPARQL query has been saved inside TriplyDB.  See the [SPARQL endpoints](#sparql-endpoint) section on how to use SPARQL endpoints without such saved queries.  Notice that using saved queries is significantly better than querying endpoints, especially in production systems.

RATT is able to load RDF data from a SPARQL `construct` query.  Such queries can be used to transform data from one graph structure to another.  For example, this can be used to transform DCAT metadata records into Schema.org metadata records.

The following one-liner runs an existing saved `construct` query in TriplyDB:

```ts
mw.loadRdf(Ratt.Source.TriplyDb.query('my-account', 'my-query')),
```

Similar to the other RATT Connectors, the above snippet automatically performs multiple requests in the background, if needed, to retrieve the full result set.  This is not supported by bare SPARQL endpoints which lack a standardized form of pagination.  See the page on [SPARQL Pagination](pagination) for more information on how this works.

The above example is identical for public and non-public TriplyDB Saved Queries.  This makes it easy to start out with private or internal queries, and move them to public once the project matures.  This is not supported by raw SPARQL endpoints.


<h5>Specifying a result graph</h5>

It is often useful to store the results of `construct` queries in a specific graph.  For example, when internal data is enriched with external sources, it is often useful to store the external enrichments in a separate graph.  Another example is the use of a query that applies RDF(S) and/or OWL reasoning.  In such cases the results of the reasoner may be stored in a specific graph.

The following example stores the results of the specified `construct` query in a special ‘enrichment’ graph:

```typescript
const graph = Ratt.prefixer('https://example.com/id/graph/')
const myQuery = Ratt.Source.TriplyDb.query('my-account',
                                           'my-dataset',
                                           {toGraph: graph('enrichment')},
mw.loadRdf(myQuery)
```

The value of the `toGraph` option can be any IRI that is specified inside RATT.  In the above example the `graph` prefix is used together with the `enrichment` local name to produce the absolute IRI `https://example.com/id/graph/enrichment`.


<h4>Using a specific query version</h4>

In production systems, applications must be able to choose whether they want to use the latest version of a query (acceptance mode), or whether they want to use a specific recent version (production mode), or whether they want to use a specific older version (legacy mode).

This is supported by TriplyDB Saved Queries.  A specific version can be used by specifying the `version` option in RATT.  For example, the following snippet always uses the first version of the specified query:

```typescript
const myQuery = Ratt.Source.TriplyDb.query('my-account',
                                           'my-dataset',
                                           {toGraph: graph.results,
                                            version: 1})
mw.loadRdf(myQuery)
```

Not specifying the `version` option automatically uses the <b>latest version</b>. There is no standardized support for query versioning with raw SPARQL endpoints.

#### Specifying API variables {#api-variable-static}

In production systems, applications often request different information based on a limited set of input variables.  This is supported by TriplyDB Saved Queries, for which API variables can be configured.  The API variables ensure that the query string is parameterized correctly, maintaining the RDF syntax and semantics.

The following example binds the `?country` variable inside the query string to literal `'Holland'`.  This allows the results for Holland to be returned.

```typescript
const myQuery = Ratt.Source.TriplyDb.query('my-account',
                                           'my-dataset',
                                           {toGraph: graph.results,
                                            variables: {country: 'Holland'},
                                            version: 1})
mw.loadRdf(myQuery)
```

There is no standardized support for specifying API variables with raw SPARQL endpoints.

#### Specifying dynamic API variables {#api-variable-dynamic}

In [the previous section](#api-variable-static) the value `'Holland'` for the API variable `country` was known at the time of writing the RATT pipeline.  But what do we do if the requested country is not known at the time of writing the RATT pipeline, but depends on data that is read/transformed during the execution of the RATT pipeline?

In such cases we can use the following custom middleware to run the SPARQL query:

```ts
app.use(
  async (context, next) => {
    const api_variables = {
      country: context.getString('COUNTRY')
    }
    const myQuery = await account.getQuery('my-query')
    for await (const statement of myQuery.results(api_variables).statements()) {
      statement.graph = graph('enrichment')
      context.store.addQuad(statement)
    }
    return next()
  }),
)
```

In the above example, different countries are specified by data values that are read dynamically from the `COUNTRY` key.  This key can be a column in a table, or an element in XML, or some other dynamic data location, depending on the RATT source that is used.

The following line is used to configure the graph where the results from the queries are stored:

```typescript
statement.graph = graph('enrichment')
```


### SPARQL endpoints {#sparql-endpoint}

The [previous section](#sparql-query) explained how RATT pipelines can be connected to TriplyDB Saved Queries. It is also possible to connect RATT to raw SPARQL endpoints, including non-TriplyDB endpoints. Unfortunately, raw SPARQL endpoints do not offer the same production-grade features as TriplyDB Saved Queries. For example, there is no standardized way to retrieve larger result sets.

The following code snippet issues a raw SPARQL query against a public SPARQL endpoint:

```typescript
const myQuery = Ratt.Source.url(
  'https://dbpedia.org/sparql',
  {
    request: {
      headers: {
        accept: 'text/csv',
        'content-type': 'application/query-string',
      },
      body: 'select * { ?s ?p ?o. } limit 1',
      method: post,
    },
  }
),
```

Since we specified CSV as the result set format (Media Type `text/csv`), the above SPARQL query can be accessed as any other CSV source in RATT:

```typescript
app.use(
  mw.fromCsv(myQuery),
)
```


### Extensible Markup Language (XML) files {#xml}

Extensible Markup Language (file name extension `.xml`) is similar to HTML, but where you can define your own tags to use. This is why it is a very useful format to store, search and share your data.

RATT has a dedicated connector for XML files.  After such files [are uploaded as TriplyDB Assets](#assets), RATT can connect to them as follows:

```ts
const account = 'my-account'
const dataset = 'my-dataset'
app.use(
 mw.fromXml(Ratt.Source.triplyDb.asset(account, dataset, {name: 'my-data.xml'}),{ selectors: ['first-element'] })
)
```

selectors is an array of string-arrays indicating which XML paths should be stored as a record.
 *  Example: if you have an XML of the format:
 ```html
<root>
    <a>
   ....
    </a>
</root>
```

 by using the array  [ 'root', 'a' ] as selectors, you would add as a record the elements which are nested inside `<a>` tag . **Note** that you must specify the full path in the selector from the root up to the node you want as a record.

This function transforms XML to JSON.
### Specify multiple source files

The RATT connectors for source files allow an arbitrary number of files to be specified.

The following example code connects two [CSV files](#csv) to a RATT pipeline:

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


### Iterate over all Assets

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

#### File compression for plain text files {#compression}

It is a best practice to compress static data files if they are plain text files.  Compression should be applied prior to uploading such files as [TriplyDB Assets](#assets).

The following command shows how a local CSV file can be compressed using GNU Zip (`.gz`):

```sh
gzip my-table.csv
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

Because the `foaf` and `ex` objects have been declared at the start of the pipeline, the rest of the pipeline can use autocompletion for IRIs terms.  This works by typing the namespace alias and a dot (for example: `foaf.`) and pressing `Ctrl + SPC` (control and space at the same time).  In [properly configured text editors](editor) this will bring up a list of autocomplete results.

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
