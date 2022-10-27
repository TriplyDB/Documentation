---
title: "RATT"
path: "/docs/ratt-load"
---

**RATT can only be used in combination with [TriplyDB](https://triply.cc/triplydb). Contact [info@triply.cc](mailto:info@triply.cc) to receive your token to access the RATT package.**

RATT is a TypeScript package that is developed by [Triply](https://triply.cc/).  RATT makes it possible to develop and maintain production-grade linked data pipelines. It is used in combination with one of the [TriplyDB subscriptions](https://triply.cc/subscriptions) to create large-scale knowledge graphs.


## Validating RDF output

RATT is able to automatically validate the RDF that is generated in the pipeline against a SHACL information model.

```ts
app.use(
  // Create all linked data statements.
  …
  // Now that all the data is created, validate it using a model.
  validateShacl(app.sources.model)
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
  validateShacl(
    app.sources.model,
    {report: {destination: app.sources.dataset,
              graph: graph.report}}),
)
```


### Termination conditions

The `validateShacl` function can optionally be given the `terminateOn` option.  This option determines when validation halts.  It can take the following values:

<dl>
  <dt><code>'Never'</code></dt>
  <dd>Do not halt; run the validation for the full dataset.</dd>
  <dt><code>'Violation'</code></dt>
  <dd>Halt validation when the first SHACL Violation is encountered.</dd>
  <dt><code>'Warning'</code></dt>
  <dd>Halt validation when the first SHACL Violation or SHACL Warning is encountered.</dd>
  <dt><code>'Info'</code></dt>
  <dd>Halt validation when the first SHACL Violation or SHACL Warning or SHACL Informational message is encountered.</dd>
  <dt><code>undefined</code></dt>
  <dd>Halt validation when the first SHACL message is encountered.</dd>
</dl>

The following example code lets validation run for the full dataset, regardless of how many violations, warnings, and/or information messages are encountered:

```ts
app.use(
  // Create all linked data statements.
  …
  // Now that all the data is created, validate it using a model.
  validateShacl(app.sources.model, {terminateOn: 'Never'}
)
```

### Log conditions
 The `validateShacl` function can optionally be given the `log` option.  This option determines when and which violations should be printed. The values are the same as in 'terminateOn' option. Note that `log` is about printing on your terminal and not about the violation report.

 ```ts
 app.use(
   // Create all linked data statements.
   …
   // Now that all the data is created, validate it using a model.
   validateShacl(app.sources.model, {log: "Never"}
 )
 ```

## Upload prefixes

After loading the graphs, we can also upload other important elements in Linked data, such as the prefixes. This can be done by combining RATT functionality (```app.after```, ```app.prefix```) with TriplyDbjs functionality (```app.triplyDb.getOrganization```, ```app.triplyDb.getUser()``` etc.).
1. You have to set the prefixes:
```ts
const prefix_def = Ratt.prefixer('http://example.com/def/')
const prefix_id = Ratt.prefixer('http://example.com/id/')
const prefix = {
  def: prefix_def,
  graph: prefix_id,
}
```

2. Then you have to include the prefixes in the RATT app:
```ts
export default async function(): Promise<Ratt> {
const app = new Ratt({
  prefixes: prefix,
  sources: {
  ..
  },

  destinations: {
    ..
  },
})
..
}
```

3. After finishing with the main body of the ETL and closing ```app.use()```, you can use the below snippet to upload the prefixes under a specific organization, inside ```app.after```.
```ts
app.after(
      async () => {
        const dataset0 =await (await app.triplyDb.getOrganization(organization)).getDataset(dataset)
        await dataset0.addPrefixes(mapValues(app.prefix, prefix => prefix('').value))
      })
```
You can upload the prefixes similarly under your account, using the relevant TriplyDbjs function. Also, note that ```mapValues``` is a function of *lodash*. For this reason, you will need to import it in the beginning of your script.

```ts
import { mapValues } from 'lodash'
```

## Uploading graphs

In some cases, it is useful to upload graphs on TriplyDB that are already in a linked data format file. See [copying source data](/docs/ratt-working-with-ratt#direct-copying-of-source-data-to-destination).
