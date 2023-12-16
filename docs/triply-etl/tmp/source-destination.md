[TOC]
# Source destination
## An easier way to configure graph names and prefixes

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