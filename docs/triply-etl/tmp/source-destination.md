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
