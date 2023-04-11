## Transforming RDF data

If you have RDF data that does not need to be transformed, see [copying source data](https://triply.cc/docs/ratt-working-with-ratt#direct-copying-of-source-data-to-destination).
If you have RDF data that _does_ need to be transformed, you can use the following pattern. This example renames the graph.

```ts
const etl = new Etl({ defaultGraph: graph.model })
etl.use(
  loadRdf(Etl.Source.file(`data/shapes.trig`)),
  mapQuads(
    (quad, ctx) => ctx.store.quad(
      quad.subject,
      quad.predicate,
      quad.object,
      iri(prefix.graph, 'new-graph')
    )
  ),
  toRdf(Etl.Destination.TriplyDb.rdf('my-dataset', remoteOptions))
)
```

Similarly, you can change all the subject, predicates or objects in your data.

Also, you can choose to transform triples of a specific subject, predicate, object or graph name. in this case, you should use:

```ts
mapQuads(
  (quad, ctx) => ctx.store.quad(
    quad.subject,
    app.prefix.example('new-predicate'),
    quad.object,
    quad.graph
  ),
  {predicate: app.prefix.example("old-predicate")}
)
```
