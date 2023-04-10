---
title: "TriplyETL: Debug"
path: "/docs/triply-etl/debug"
---

This page documents how you can debug your ETL pipeline.

## Debugging pipelines

When developing a TriplyETL pipeline, you must often inspect the data that flows through the pipeline.  Inspecting the data flow allows you to find problems quickly and ensures that data is handled correctly by your TriplyETL configuration.


### Printing the current Record

One of the most useful tools for inspecting your pipeline is the `logRecord` function.  It prints the current Record to standard output (e.g. your terminal).

At any moment in a TriplyETL pipeline, the current Record can be printed to the terminal with the following command:

```ts
app.use(
  logRecord(),
)
```

For [the Iris dataset](https://triplydb.com/Triply/iris) this emits the following output:

```js
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

In addition to inspecting the Record once, it is common practice to place two or more `logRecord` statements at different positions in a TriplyETL configuration.  This allows you to inspect how data changes throughout the pipeline process.

```ts
logRecord(),
// One or more transformations that change the record.
logRecord(),
```

#### Log specific keys

Sometimes a Record can be long and you may only be interested in a small number of keys.  In such cases the interesting keys can be specified in the call to `logRecord()`:

```ts
logRecord({ key: 'variety' }),
```
### Trace changes in a record

Sometimes you are interested to find one specific record based on a certain value of a key and/or to see the changes in this record made by specific middlewares. For these purposes, `trace` middleware can be used.

Below, there is an example of how this middleware can be used:

```ts
fromJson([
  { a: 1, b: 1 }, // first dummy record
  { a: 2, b: 2 }, // second dummy record
]),
change({key:'a', type:'number', change: (val) => val +100}), // change the 'a' key
traceStart(),
change({key:'b', type:'number', change: (val) => val +100}), // change the 'b' key
traceEnd(),
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
 > yarn etl lib/{script-name} --trace .trace-1650542307095
```

In your terminal the line with <span style="color:red">"b": 1</span> will be red colored, showing the previous state of this key-value and the line with <span style="color:green">"b": 101</span> will be green colored, showing the new state.

Also you can rerun the  trace information for this specific record by running:

```sh
yarn etl lib/{script-name} --trace .trace-1650542307095
```

### Limit the number of records

When developing a pipeline, it is often not needed to process all records from the input data source all the time.

In order to keep the feedback loop small, one can make use of the `--head` flag when running TriplyETL:

```sh
yarn etl lib/main.js --head 1
yarn etl lib/main.js --head 10
```

The above commands process only the first record and the first 10 records, respectively.

#### Specify a range of records

When developing a pipeline over a large source data collection, it is often standard practice to use the first 10 or 100 records most of the time.

The benefit of this approach is that the feedback loop between making changes and receiving feedback is short.  A downside of this approach is that the ETL may be overly optimized towards these first few records.  For example, if a value is missing in the first 1.000 records, then transformations that are necessary for when the value is present will not be developed initially.  An alternative is to run the entire ETL, but that takes a long time.

To avoid the downsides of using `--head`, TriplyETL also supports the `--from-record-id` flag.  This flag specifies the number of records that are skipped.  This allows us to specify an arbitrary consecutive range of records.  For example, the following processes the 1.001-st until and including the 1.010-th record:

```sh
yarn etl lib/main.js --from-record-id 1000 --head 10
```

#### Process a specific record

When the `--head` flag is set to 1, the `--from-record-id` flag specifies the index of a single specific record that is processed.  This is useful when a record is known to be problematic, for instance during debugging.

The following command runs TriplyETL for the 27th record:

```sh
yarn etl lib/main.js --from-record-id 26 --head 1
```


### Verbose mode

When TriplyETL is run normally, the following information is displayed:

- The number of added triples.
- The runtime of the script.
- An error message, if any occurred.

It is possible to also show the following additional information by specifying the `--verbose` flag:

- In case of an error, the first 20 values from the last processed record.
- In case of an error, the full stack trace.

The following example shows how the `--verbose` flag can be used:

```sh
yarn etl lib/main.js --verbose
```

#### Secure verbose mode

Verbose mode may perform a reset of your current terminal session.  If this happens you lose visible access to the commands that were run prior to the last TriplyETL invocation.

This destructive behavior of verbose mode can be disabled by setting the following environment variable:

```sh
export CI=true
```

This fixes the reset issue, but also makes the output less colorful.
