# Graph

Each dataset with data consists out of one or more named graphs. All graphs together is thus the collection of triples of the dataset. Often the graph is used to denote a part of the dataset. For example the data model of the dataset or the metadata of the dataset. A graph has as advantage that is can partition data while at the same time keep the data in the same dataset. Reducing the overhead of having to move between datasets to traverse a graph.

You can retrieve either retrieve all graphs from a dataset in the form of an async iterator. Or retrieve a specific graph from a dataset.

### Examples

The following snippet retrieves the graph `'https://example.com/my-graph'` for a specific dataset:

```ts
const user = await triply.getUser()
const dataset = await user.getDataset('my-dataset')
const graph = await dataset.getGraph('https://example.com/my-graph')
```

The following snippet retrieves all the graphs for a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const graphs = dataset.getGraphs()
```

The `Graph` is the smallest object that can be individually deleted or modified.


## Graph.delete()

Deletes the graph of this dataset. Any copies of the graph will not be deleted. All services containing this graph will still contain the graph until the service is synced again.

### Examples

The following snippet deletes a specific graph that is part of the account associated with the current API token:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const graph = await dataset.getGraph('https://example.com/my-graph')
await graph.delete()
```


## Graph.getInfo()

Returns information about this graph.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

The following keys and values are returned for `graph.getInfo()`
<dl>
  <dt><code>id</code></dt>
  <dd>A hexadecimal hash of the graph to identify the graph for internal identification.</dd>

  <dt><code>graphName</code></dt>
  <dd>The URL-friendly name of the graphName that is used as identifier and name.</dd>

  <dt><code>numberOfStatements</code></dt>
  <dd>The number of statements in the graph.</dd>

  <dt><code>uploadedAt (Optional)</code></dt>
  <dd>The date/time at which the graph was uploaded to TriplyDB.</dd>

  <dt><code>importedAt (Optional)</code></dt>
  <dd>The date/time at which the query was imported from another dataset.</dd>

  <dt><code>importedFrom (Optional)</code></dt>
  <dd>
    <dl>
      <dt><code>graphName</code></dt>
      <dd>The graphname of the graph from the dataset from which the graph was imported.</dd>
      <dt><code>dataset</code></dt>
      <dd>The dataset from which the graph was imported.</dd>
    </dl>
  </dd>
</dl>

### Examples

The following snippet prints the information from the specified graph of the specified dataset of the current user:

```ts
const user = await triply.getUser()
const dataset = await user.getDataset('my-dataset')
const graph = await dataset.getGraph('https://example.com/my-graph')
console.log(await graph.getInfo())
```


## Graph.rename(name: string)

Renames the graph, the argument `name` is the new graph name. The string argument for `name` must be a valid IRI.

### Examples

The following snippet renames a specific graph of a specific dataset:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const graph = await dataset.getGraph('https://example.com/my-graph')
await dataset.rename('https://example.org/new-graph')
```

## Get the data locally

Most of the time you do not need to download a graph locally as TriplyDB supports a variety of methods to use linked data directly. But if you want to use a graph locally that is possible with `TriplyDB.js`. There are three methods to retrieve linked data from a graph. `toFile()`, `toStore()` and `toStream()`.


## Graph.toFile(destinationPath: string, arguments?: object)

The first method downloads the linked data graphs directly and writes the data to the location of the `destinationPath`. The extension on the `destinationPath` defines the linked data type that is downloaded. The extensions that are supported are: `nt`, `nq`, `trig`, `ttl`, `jsonld`, `json`. If no extension is set or the extension is not recognized the function will throw an error.

### Optional

The optional properties accepted as arguments for <code>toFile</code>

<dl>
  <dt>Compressed</dt>
  <dd>Argument <code>compressed</code> optionally is an boolean defining if a graph is compresssed with GNU zip (gzip) compression algorithm and will end with a `.gz` extension. </dd>
</dl>

### Examples

The following example downloads the graph to file:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const graph = await dataset.getGraph('https://example.com/my-graph')
await graph.toFile('my-filename.ttl', {compressed: true})
```


## Graph.toStore(graph?: Graph)

The second method is to download the file into a `N3.store`. The [n3 library](https://rdf.js.org/N3.js/docs/N3Store.html) is one of the most complete libraries for handling linked data in memory. The N3.js library is an implementation of the RDF.js low-level specification that lets you handle RDF in JavaScript easily, with an asynchronous, streaming approach.

To reduce the overhead of downloading your data to file and then insert it in the N3 Store. TriplyDB.js has a `toStore()` where a N3 store is returned as a result of the the `toStore()` function.

### Examples

The following example downloads the graph as `N3.store`:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const graph = await dataset.getGraph('https://example.com/my-graph')
const store = await graph.toStore()
```


## Graph.toStream(type: 'compressed' | 'rdf-js', arguments?: object)

The final method to download linked data to a local source is the `toStream` this function returns a stream of quads that can directly be iterated over. The Stream is either of the type `compressed` which returns a gzipped stream of linked data, or type `rdf-js` which returns a stream of quads parsed according to the [`rdf-js` standard](https://rdf.js.org/stream-spec/#stream-interface).

### Optional

The following arguments can be defined in the optional arguments object.

<dl>
  <dt>Extension</dt>
  <dd>Argument <code>Extension</code> optionally defines the linked data type that is streamed. The extensions that are supported are: `nt`, `nq`, `trig`, `ttl`, `jsonld`, `json`. </dd>
</dl>

### Examples

The following example streams through the graph as rdf-js quad objects. and prints the quad to the screen. notice that the `stream` is an async iterator.

**Example 1**

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const graph = await dataset.getGraph('https://example.com/my-graph')
const stream = await graph.toStream('rdf-js', {extension: '.nq'})
for await(const quad of stream){
  console.log(quad)
}
```

The following example streams through the graph as chunks of ttl. and prints the buffer to the screen.

**Example 2**

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('pokemon')
const graph = await dataset.getGraph('https://example.com/my-graph')
const stream = await graph.toStream('compressed', {extension: '.ttl'})
for await(const quad of stream.pipe(zlib.createGunzip())){
  console.log((quad as Buffer).toString())
}
```