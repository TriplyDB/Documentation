## Configuring the Context <!-- {#context} -->

The TriplyETL Context is specified when the `Etl` object is instantiated.  This often appears towards the start of a pipeline script.  The TriplyETL Context allows the following things to be specified:

- The data sources that can be used in the ETL.
- The data destinations where linked data is published to.
- The named graph in which `triple` calls with no graph argument add their data.
- The prefix IRI for blank node-replacing well-known IRIs.


### Configuring the standard graph

When we call `triple` with 3 arguments, a triple is created and placed in a named graph that is chosen by TriplyETL.  You can change the name of this default graph by specifying it in the TriplyETL context.  Notice that graph names must be IRIs:

```ts
const etl = new Etl()
```

### Configuring the well-known IRI prefix

TriplyDB performs Skolemization, an approach in which blank nodes are systematically replaced by well-known IRIs.  TriplyDB chooses a well-known IRI prefix for you,

```ts
const etl = new Etl({
  wellKnownIriPrefix: 'https://triplydb.com/Triply/example/.well-known/genid/',
})
```
