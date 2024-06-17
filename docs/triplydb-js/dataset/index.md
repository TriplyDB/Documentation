[TOC]

# Dataset

The `Dataset` class represents a TriplyDB dataset.


## Dataset.addPrefixes(prefixes: object)

Adds IRI prefix declarations to the dataset.

The `prefixes` argument is a dictionary object whose keys are aliases and whose values are IRI prefixes.

### Examples

The following snippet adds prefix declarations for aliases `id` and `def` to the Iris dataset:

```ts
const organization = await triply.getOrganization('Triply')
const dataset = await organization.getDataset(iris)
await dataset.addPrefixes({
  def: 'https://triplydb.com/Triply/iris/def/',
  id: 'https://triplydb.com/Triply/iris/id/',
})
```


## Dataset.ensureService(name: string, metadata?: object)

Ensures the existence of a service with the given `name` and with the specified `metadata` if given.

Calling this method ensures that the necessary changes (if any) are made in the connected-to TriplyDB server that result in an end state in which a service with the given `name` and `metadata` exists.

This method is useful in practice, because it removes the burden on the programmer to have to write custom code for checking for the existence of a service, and conditionally create a new service or make metadata changes to an existing service.

The changes made as a result of calling this method depend on the current state of the connected-to TriplyDB server:

- If this dataset does not yet have a service with the given `name`, then the behavior is identical to calling [`Dataset.addService(name: string, metadata?: object)`](#datasetaddservicename-string-metadata-object) with the same arguments.
- If this dataset already has a service with the given `name`, but with different `metadata` specified for it, then the behavior is identical to calling [`Account.getDataset(name: string)`](../account/index.md#accountgetdatasetname-string) and [`Dataset.update(metadata: object)`](#datasetupdatemetadata-object).
- If this dataset already has a service with the given `name` and with the same `metadata`, then this method returns that service.

### Required

<dl>
  <dt><code>name</code></dt>
  <dd>Accepts a string value which is the name of the service to ensure.</dd>
</dl>

### Optional: metadata

```ts
serviceMetadata = {
  type:  'elasticsearch' | 'virtuoso' | 'jena' ;
  config?: {
    reasoner?: 'OWL' | 'RDFS' | 'None';
  };
};
```

<dl>
  <dt><code>type</code></dt>
  <dd>Accepts a string value of one of the following: <code>'virtuoso'</code>, <code>'elasticsearch'</code>, <code>'jena'</code>.</dd>

  <dt><code>config</code></dt>
  <dd>
    <p>Config is an optional property. It accepts an object with a <code>reasoner</code> property.</p>
    <dl>
      <dt><code>reasoner</code></dt>
      <dd>The reasoner property accepts a string value of either <code>'OWL'</code>, <code>'RDFS'</code>, or <code>'None'</code>.</dd>
    </dl>
  </dd>
</dl>

**Note:**

- If no options are specified the default service is of type: `virtuoso`.
- Note that the `config.reasoner` will only accept a value when `type` is: `'jena'`

**Examples**
Example 1: Ensure a `service` with no arguments. If not found it's type defaults to `virtuoso`.

```ts
await someDataset.ensureService('someServiceName')
```

Example 2: Ensure a `service` of type `jena`.

```ts
await someDataset.ensureService('someServiceName', { type: 'jena' })
```


## Dataset.addService(name: string, metadata?: object)

Creates a new service for this dataset.

### Arguments

### Required

<dl>
  <dt><code>name</code></dt>
  <dd>The URL-friendly name of the service. The name must only contain alphanumeric characters and hyphens (`[A-Za-z0-9\-]`).</dd>
</dl>

### Optional

The service type is specified with the `type` parameter. If no type is given, a default of <code>'virtuoso'</code> is used. It supports the following values:

<dl>
  <dt><code>'virtuoso'</code></dt>
  <dd>Starts a SPARQL service. A SPARQL 1.1 compliant service is very scalable and performance, but without advanced reasoning capabilities.</dd>
  <dt><code>'jena'</code></dt>
  <dd>Starts a SPARQL JENA service. A SPARQL 1.1 compliant service that is less scalable and less performant, but allows reasoning (RDFS or OWL) to be enabled.</dd>
  <dt><code>'elasticSearch'</code></dt>
  <dd>Starts an <a href='https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html'>Elasticsearch</a> service. A text search engine that can be used to power a search bar or similar textual search API.</dd>
</dl>

The `name` argument can be used to distinguish between different endpoints over the same dataset that are used for different tasks.

### Examples

The following snippet starts two SPARQL endpoints over a specific dataset. One endpoint will be used in the acceptance environment while the other endpoint will be used in the production system.

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const acceptance = await dataset.addService('acceptance')
const production = await dataset.addService('production', {
  type: 'elasticsearch',
})
const reasoning = await dataset.addService('reasoning', {
  type: 'jena',
  config: { reasoner: 'OWL' },
})
```

### See also

See class [Service](../service/index.md#service) for an overview of the methods that can be used with service objects.


## Dataset.clear(...resourceType: string)

Removes one or more resource types from the current dataset.

### Arguments

The resources are specified by the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) `resourceType`, which supports the following values :

<dl>
  <dt><code>'assets'</code></dt>
  <dd>Removes all assets in the dataset.</dd>
  <dt><code>'graphs'</code></dt>
  <dd>Removes all graphs in the dataset.</dd>
  <dt><code>'services'</code></dt>
  <dd>Removes all services in the dataset.</dd>
</dl>

### Examples

The following example code removes all graphs and services for a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.clear('graphs', 'services')
```


## Dataset.copy(account: string, dataset: string)

Creates a copy of the current dataset.

The owner (user or organization) of the copy is specified with parameter `account`. The name of the copy is specified with parameter `dataset`.

This operation does not overwrite existing datasets: if the copied-to dataset already exists, a new dataset with suffix `-1` will be created.

### Examples

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
console.log(await dataset.copy('account name', 'copy dataset name'))
```


## Dataset.delete()

Deletes the dataset.

This includes deleting the dataset metadata, all of its graphs, all of its services, and all of its assets.

### Examples

The following snippet deletes a specific dataset that is part of the account associated with the current API token:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.delete()
```

### See also

Sometimes it is more useful to only delete the graphs that belong to a dataset, but leave the dataset metadata, services, and assets in place. The following methods can be used for this purpose:

- [Dataset.deleteGraph(graphName: string)](#datasetdeletegraphname-string)
- [Dataset.removeAllGraphs()](#datasetremoveallgraphs)


## Dataset.deleteGraph(name: string)

Deletes the graph with the given `name` from this dataset.

Graph names are IRIs.

### Examples

The following snippet deletes a specific graph from a specified dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.deleteGraph('https://example.org/some-graph')
```


## Dataset.describe(iri: string|NamedNode)

Each dataset is a collection of triples that describe objects in linked data. Each object is defined with an IRI, an identifier for that object. An object often has incoming and outgoing connections.
The `Dataset.describe()` call can retrieve the incoming and outgoing triples per object. The function returns for a given `iri` a list of quads where the `iri` is either in the subject or the object position.

### Examples

The following snippet returns all triples that have `https://example.org/id/some-instance` in the subject or the object position:

```ts
const user = await triply.getUser()
const dataset = await account.getDataset('my-dataset')
console.log(await dataset.describe('https://example.org/id/some-instance'))
```


## Dataset.getAsset(name: string, version?: number)

Returns the asset with the given `name` for this dataset.

Optionally allows the version number (`version`) of the asset to be specified. If the version number is absent, the latest version of the assert with the given `name` is returned.

### Examples

The following snippet returns the original version of an image of a dog from the animals dataset:

```ts
const user = await triply.getUser()
const dataset = user.getDataset('my-dataset')
const asset = await dataset.getAsset('file.png', 1)
```


## Dataset.getAssets()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the assets that belong to this dataset.

Assets are binary files that are stored together with data graphs. Common examples include documents, images and videos.

### Examples

- The following snippet prints the assets for a specific dataset:

```ts
const user = await triply.getUser()
const dataset = user.getDataset('my-dataset')
for await (const asset of dataset.getAssets()) {
  console.log(asset)
}
```

- The following snippet prints the list of assets for a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
console.log(await dataset.getAssets().toArray())
```


## Dataset.getGraph(name: string)

Each dataset with data consists out of one or more named graphs. All graphs together are thus the collection of triples of the dataset. Often the graph is used to denote a part of the dataset. For example the data model of the dataset or the metadata of the dataset. Instead of searching over the complete dataset where you want to scope it to a certain graph you can use the `getGraph()` function to specify the graph.

`Dataset.getGraph(name: string)` returns the graph with the given `name` that belongs to this dataset. The `name` is the string representation of the graph IRI.

The `Dataset.getGraph` returns a graph object.

### Examples

The following snippet returns the graph about cats from the dataset about animals:

```ts
const user = await triply.getUser()
const dataset = await user.getDataset('animals')
const graph = dataset.getGraph('https://example.com/cats')
```


## Dataset.getGraphs()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over graphs that belong to this dataset.

### Examples

The following snippet retrieves the graphs for a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
console.log(await dataset.getGraphs().toArray())
```


## Dataset.getInfo()

Returns information about this dataset.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

### Examples

The following snippet prints the information from the specified dataset of the current user:

```ts
const user = await triply.getUser()
const dataset = await user.getDataset('my-dataset')
console.log(await dataset.getInfo())
```


## Dataset.getPrefixes()

Returns the prefixes that are defined for this dataset.

This contains prefix declarations that are generic and configured for this TriplyDB server, and prefix declarations that are defined for this specific dataset.

### Examples

The following snippet prints the prefix declarations that hold for `my-dataset`:

```ts
const user = await triply.getUser()
const dataset = user.getDataset('my-dataset')
for await (const prefix of dataset.getPrefixes()) {
  console.log(prefix)
}
```


## Dataset.getService(name: string)

Returns the service with the given `name` for this dataset.

### Examples

The following snippet retrieves the acceptance service for the product catalog of an imaginary company:

```ts
const organization = triply.getOrganization('some-company')
const dataset = organization.getDataset('product-catalog')
const service = dataset.getService('acceptance')
```


## Dataset.getServices()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over TriplyDB services under a dataset.

See class [Service](../service/index.md#service) for an overview of the methods for service objects.

### Examples

- The following snippet emits the services that are enabled for a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
for await (const service of dataset.getServices()) {
  console.log(service)
}
```

If you do not want to iterate over the services with an async iterator, but instead want to get an array of services use the `.toArray()` call instead:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
console.log(await dataset.getServices().toArray())
```


## Dataset.getStatements({subject?: string, predicate?: string, object?: string, graph?: string})

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) with statements (quadruples) that fit the specified pattern.

### Arguments

- `subject`, if specified, is the subject term that should be matched.
- `predicate`, if specified, is the predicate term that should be matched.
- `object`, if specified, is the object term that should be matched.
- `graph`, if specified, is the graph name that should be matched.

### Example

- The following prints all statements in the dataset:

```ts
const user = triply.getUser()
const dataset = await user.getDataset('my-dataset')
for await (const statement of dataset.getStatements()) {
  console.log(statement)
}
```

The following prints the description of the Amsterdam resource in the DBpedia dataset:

```ts
const association = triply.getOrganization('DBpedia-association')
const dbpedia = association.getDataset('dbpedia')
for await (const statement of dbpedia.getStatements({subject: 'http://dbpedia.org/resource/Amsterdam'})) {
  console.log(statement)
}
```

### Get the data locally

Most of the time you do not need to download the entire dataset locally as TriplyDB supports a variety of methods to use linked data directly. But if you want to use the entire graph locally that is possible with `TriplyDB.js`. There are three methods to retrieve linked data from TriplyDB. `graphsToFile()`, `graphsToStore()` and `graphsToStream()`.


## Dataset.graphsToFile(destinationPath: string, arguments?: object)

The first method downloads the linked data graphs directly and writes the data to the location of the `destinationPath`. The extension on the `destinationPath` defines the linked data type that is downloaded. The extensions that are supported are: `nt`, `nq`, `trig`, `ttl`, `jsonld`, `json`. If no extension is set or the extension is not recognized the function will throw an error.

### Optional

The optional properties accepted as arguments for <code>graphsToFile</code>

<dl>
  <dt>Compressed</dt>
  <dd>Argument <code>compressed</code> optionally is a boolean defining if a graph is compressed with GNU zip (gzip) compression algorithm and will end with a `.gz` extension. </dd>
  <dt>Graph</dt>
  <dd>Argument <code>Graph</code> optionally is an specific graph that you want to write to file. These graph is an instance of a 'Graph' class</dd>
</dl>

### Examples

The following example downloads the dataset to file:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
await dataset.graphsToFile('my-filename.ttl', {compressed: true})
```


## Dataset.graphsToStore(graph?: Graph)

The second method is to download the file into a `N3.store`. The [n3 library](https://rdf.js.org/N3.js/docs/N3Store.html) is one of the most complete libraries for handling linked data in memory. The N3.js library is an implementation of the RDF.js low-level specification that lets you handle RDF in JavaScript easily, with an asynchronous, streaming approach.

To reduce the overhead of downloading your data to file and then insert it in the N3 Store. TriplyDB.js has a `graphsToStore()` where a N3 store is returned as a result of the `graphsToStore()` function.

### Optional

The optional argument for <code>graphsToStore</code> is <code>Graph</code>. With <code>Graph</code> you can optionally define a specific graph that you want to write to file. These graph is an instance of a 'Graph' class.

### Examples

The following example downloads the dataset as `N3.store`:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const store = await dataset.graphsToStore()
```


## Dataset.graphsToStream(type: 'compressed' | 'rdf-js', arguments?: object)

The final method to download linked data to a local source is the `graphsToStream` this function returns a stream of quads that can directly be iterated over. The Stream is either of the type `compressed` which returns a gzipped stream of linked data, or type `rdf-js` which returns a stream of quads parsed according to the [`rdf-js` standard](https://rdf.js.org/stream-spec/#stream-interface).

### Optional

The following arguments can be defined in the optional arguments object.

<dl>
  <dt>Extension</dt>
  <dd>Argument <code>Extension</code> optionally defines the linked data type that is streamed. The extensions that are supported are: `nt`, `nq`, `trig`, `ttl`, `jsonld`, `json`. </dd>
  <dt>Graph</dt>
  <dd>Argument <code>Graph</code> optionally is an specific graph that you want to write to file. This graph is an instance of a 'Graph' class</dd>
</dl>

### Examples

The following example streams through the dataset as rdf-js quad objects and prints the quad to the screen. Notice that the `stream` is an async iterator.

**Example 1**

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const stream = await dataset.graphsToStream('rdf-js', {extension: '.nq'})
for await(const quad of stream){
  console.log(quad)
}
```

The following example streams through the dataset as chunks of ttl. and prints the buffer to the screen.

**Example 2**

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const stream = await dataset.graphsToStream('compressed', {extension: '.ttl'})
for await(const quad of stream.pipe(zlib.createGunzip())){
  console.log((quad as Buffer).toString())
}
```


## Dataset.importFromDataset(fromDataset: Dataset, arguments?: object)

Imports one or more named graphs from a different dataset into this dataset.

Data reuse is an important principle in linked data. This functionality makes it very easy to pull in vocabularies and datasets from other places.

Changes in the `fromDataset` dataset are not automatically reflected in this dataset. If you want to synchronize with changes made in the imported-from dataset, the graphs must be explicitly imported. This protects this dataset against unanticipated changes in the imported-from dataset, while still being able to stay in sync with the imported-from dataset if this is explicitly requested.

### Required

- Argument `fromDataset` is the dataset object from which one or more graphs are imported over to this dataset.

### Optional

The optional properties accepted as arguments for <code>importFromDataset</code>

<dl>
  <dt>graphMap</dt>
  <dd>Argument `<code>graphMap</code>` optionally is an object with keys and values that implements a mapping from existing graph names (keys) to newly created graph names (values). Each key must be an existing graph name in the `from` dataset. Each value must be the corresponding graph name in this dataset. If this argument is not specified, then graph names in the `from` dataset are identical to graph names in this dataset. Note that either graphNames or graphMap can be given as optional argument and not both.</dd>
  <dt>graphNames</dt>
  <dd>Argument `<code>graphNames</code>` optionally is an array of graph names. These names can be one of three types: 'string', instances of a 'Graph' class, or instances of 'NamedNodes'. Note that either graphNames or graphMap can be given as optional argument and not both.</dd>
  <dt>overwrite</dt>
  <dd>Accepts a Boolean value. An optional property that determines whether existing graph names in this dataset are allowed to be silently overwritten. If this argument is not specified, then `false` is used as the default value.</dd>
</dl>

### Examples

The following snippet creates a new dataset (`newDataset`) and imports one graph from an existing dataset (`existingDataset`). Notice that the graph can be renamed as part of the import.

**Example 1**
Imports the complete `'existingDataset'` dataset to the `'newDataset'`.

```ts
const account = await triply.getAccount()
const existingDataset = await account.getDataset('existingDataset')
const newDataset = await account.addDataset('newDataset')
await newDataset.importFromDataset(existingDataset)
```

**Example 2**
Imports `'anotherDataset'` dataset to a `'newDataset'` Where a graph from the existing dataset is renamed to the a graphname in the new dataset. Only the graphs from the graphMap are imported.

```ts
const account = await triply.getAccount()
const anotherDataset = await account.getDataset('anotherDataset')
const newDataset = await account.addDataset('newDataset')
await newDataset.importFromDataset(anotherDataset, { graphMap:
  { 'https://example.org/existingDataset/graph':  'https://example.org/newDataset/graph'}
})
```

**Example 3**
Import `'oneMoreDataset'` dataset to the `'newDataset'` Where a graph specific graph from the existing dataset is added to the new dataset. If the graph name already occurs in the `'newDataset'` it will get overwritten.

```ts
const account = await triply.getAccount()
const oneMoreDataset = await account.getDataset('oneMoreDataset')
const newDataset = await account.addDataset('newDataset')
await newDataset.importFromDataset(oneMoreDataset, {
  graphNames: ['https://example.org/existingDataset/graph'],
  overwrite: true,
})
```


## Dataset.importFromFiles(files: list(string || File), defaultsConfig?: object)

### Required

Imports one or more files into this dataset.

The files must contain RDF data.

**Optional: defaultsConfig: object**

<dl>
  <dt><code>defaultGraphName</code></dt>
  <dd>Accepts a <code>string</code> value that is set as the default graph name for each imported file</dd>
  <dt><code>baseIRI</code></dt>
  <dd>Accepts a <code>string</code> value that is set as the default baseIRI for each imported file</dd>
  <dt><code>overwriteAll</code></dt>
  <dd>Accepts a <code>boolean</code> value that overwrites previously added graph names or baseIRIs (regardless of whether they came from a URL or a file)</dd>
  <dt>mergeGraphs</dt>
  <dd>Accepts a Boolean value. An optional property that determines whether existing graph in this dataset are merged with the imported graphs. If this argument is not specified, then `false` is used as the default value.</dd>
</dl>

### Supported files

The files must contain RDF data and must be encoded in one of the following standardized RDF serialization formats: N-Quads, N-Triples, TriG, Turtle.

### Examples

Example 1

```ts
const account = await triply.getAccount('Triply')
const dataset = await account.getDataset(iris)
await dataset.importFromFiles('test.nt')
await dataset.importFromFiles(['file.nq', 'file.tar.gz'])
```

Example 2

```ts
const account = await triply.getAccount('Triply')
const dataset = await account.getDataset(iris)
await dataset.importFromFiles('test.nt')
await dataset.importFromFiles(['file.nq', 'file.tar.gz'], {
  defaultGraphName: 'https://triplydb.com/Triply/example/graph/default',
  overwriteAll: true,
})
```


## Dataset.importFromStore(store: n3.Store, defaultsConfig?: object)

One of the most complete libraries for handling linked data in memory is the [n3 library](https://rdf.js.org/N3.js/docs/N3Store.html). The N3.js library is an implementation of the RDF.js low-level specification that lets you handle RDF in JavaScript easily, with an asynchronous, streaming approach.

To reduce the overhead of converting your data from the N3 Store to a file and uploading to TriplyDB. TriplyDB.js has a `importFromStore()` where a N3 store is given as first argument and uploaded directly to triplyDB.

### Examples

```ts
const store = new Store()
store.addQuad(DataFactory.namedNode('https://triplydb.com/id/me'),DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),DataFactory.literal('me'),DataFactory.namedNode('https://triplydb.com/Triply/example/graph/default'))

const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getUser()
const dataset = (await user.getDatasets().toArray())[0]
dataset.importFromStore(store)
```


## Dataset.importFromUrls(urls: list(string), defaultsConfig?: object)

### Required

Imports one or more URLs into this dataset.

The URLs must provide access to RDF data.

**Optional: defaultsConfig: object**

<dl>
  <dt><code>defaultGraphName</code></dt>
  <dd>Accepts a <code>string</code> value that is set as the default graph name for each imported URL</dd>
  <dt><code>baseIRI</code></dt>
  <dd>Accepts a <code>string</code> value that is set as the default baseIRI for each imported URL</dd>
  <dt><code>overwriteAll</code></dt>
  <dd>Accepts a <code>boolean</code> value that overwrites previously added graph names or baseIRIs (regardless of whether they came from a URL or a file)</dd>
</dl>

### Examples

```ts
dataset1.importFromUrls(['url1', 'url2', 'url3'])
```


## Dataset.removeAllGraphs()

Removes all graphs from this dataset.

### Examples

The following snippet removed all graphs from a specific dataset:

```ts
const user = await triply.getUser()
const dataset = await user.getDataset('my-dataset')
await dataset.removeAllGraphs()
```


## Dataset.removePrefixes(prefixes: string[])

Removes IRI prefixes from this dataset.

The `prefixes` argument is a string array, containing the prefix labels to be removed.

### Examples

The following snippet removes the `def` and `id` prefixes from the specified dataset.

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.removePrefixes(['def', 'id'])
```


## Dataset.renameGraph(from: string, to: string)

Renames a graph of this dataset, where `from` is the current graph name and `to` is the new graph name. The string arguments for `from` and `to` must be valid IRIs.

### Examples

The following snippet renames a specific graph of a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.renameGraph(
  'https://example.org/old-graph',
  'https://example.org/new-graph'
)
```


## Dataset.update(metadata: object)

Updates the metadata for this dataset.

### Arguments

The `metadata` argument takes a dictionary object with the following optional keys:

**Required:**

<dl>
  <dt><code>accessLevel</code> </dt>
  <dd>
    <p>The access level of the dataset. The following values are supported:</p>
    <dl>
      <dt><code>'private'</code></dt>
      <dd>The dataset can only be accessed by the <a href='#account'><code>Account</code></a> object for which it is created.</dd>
      <dt><code>'internal'</code></dt>
      <dd>The dataset can only be accessed by people who are logged into the TriplyDB server.
      <dt><code>'public'</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
  </dd>
</dl>

**Optional:**

<dl>
  <dt><code>description</code> </dt>
  <dd>The description of the dataset. This description can make use of Markdown.</dd>

  <dt><code>displayName</code> </dt>
  <dd>The human-readable name of the dataset. This name may contain spaces and other characters that are not allowed in the URL-friendly name.</dd>

  <dt><code>license</code> </dt>
  <dd>
    The license of the dataset. The following license strings are currently supported:
    <ul>
      <li><code>'CC-BY-SA'</code></li>
      <li><code>'CC0 1.0'</code></li>
      <li><code>'GFDL'</code></li>
      <li><code>'ODC-By'</code></li>
      <li><code>'ODC-ODbL'</code></li>
      <li><code>'PDDL'</code></li>
    </ul>
  </dd>
</dl>

### Example

The following snippet updates the dataset's access level, description, display name and license:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
dataset.update({
  accessLevel: 'private',
  description: 'desc',
  displayName: 'disp',
  license: 'PDDL',
})
```


## Dataset.uploadAsset( filePath: string, opts?: {mode?: "throw-if-exists"| "replace-if-exists"| "append-version", name?: string})

Uploads a file that does not contain RDF data as an asset. You can specify the name on the asset and what to do if the asset already exists (throws an error by default).

### User cases

There are several use cases for assets:

- Source data that will be used as input files to an ETL process.

- Documentation files that describe the dataset.

- Media files (audio/image/video) that are described in the RDF graph.

### Examples

The following snippet uploads a source CSV data file and a PDF documentation file:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
await dataset.uploadAsset('my-source-data', {name: 'source.csv.gz'})
await dataset.uploadAsset('my-documentation', {name: 'documentation.pdf'})
await dataset.uploadAsset('my-documentation', {mode:"append-version", name: 'documentation.pdf'})

```
