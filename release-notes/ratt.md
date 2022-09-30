---
title: "RATT"
path: "/release-notes/ratt"
---

## 4.2.2 (2022-09-29)

Improved performance of `fromOai` middleware.

## 4.2.1 (2022-09-27)

Improved accuracy of performance statistics written to the log file. 

## 4.1.2 (2022-09-14)

Improved the performance of the `toRdf` middleware.

## 4.1.0 (2022-09-12)

Ratt is now published on the private gitlab NPM registry under `@triplydb/ratt`. To support an easy migration, Ratt is _also_ still published for the time being on `@triply/ratt`.

To run RATT via the `@triplydb` organization you should:
- Receive a token from Triply
- Set a token in your repository.
  - When using yarn-modern (ie if you have a `.yarnrc.yml` file in your repo), then add the following snippet to the `.yarnrc.yml` file (replace `<token>` with the token you received):
  ```yml
    npmScopes:
      fortawesome:
        npmAuthToken: <token>
        npmRegistryServer: "https://npm.fontawesome.com/"
  ```
  - In all other cases, create or update the `.npmrc` file in your repo. You should add the following lines (replace `<token>` with the token you received):
  ```sh
    @triplydb:registry=https://git.triply.cc/api/v4/packages/npm/
    //git.triply.cc/api/v4/packages/npm/:_authToken=<token>
    //git.triply.cc/api/v4/projects/:_authToken=<token>
  ```

## 4.0.11 (2022-09-07)
- **Breaking** The `cliContext` should not be used anymore. 

Before:
```ts
export default async function (cliContext: CliContext): Promise<Ratt> {
  const app = new Ratt({
    cliContext,
  })
```

After:
```ts
export default async function (): Promise<Ratt> {
  const app = new Ratt()
```

## 4.0.10 (2022-08-30)
- Improve fromOai caching messages

## 4.0.9 (2022-08-12)
- Ignore runtime type when creating a literal

## 4.0.8 (2022-08-11)
- Fixed a potential hash collission in the `hashed()` function of the `iri` middleware.
- Update rico vocab to version 0.2
- Rename createVocabs -> create-vocabs for consistency

## 4.0.7 (2022-08-10)
ADDED rico vocab to ratt


## 4.0.6 (2022-08-09)
- RATT includes a more up-to-date list of prefixes and vocabularies. The script (and corresponding documentation) for automatically creating typescript vocabulary files is included in RATT as well. Examples of vocab and prefix imports are:

```ts
import { sdo, xsd } from '@triplydb/ratt/lib/vocab' 
import prefix from '@triplydb/ratt/lib/vocab/prefix' 
```

## 4.0.1 (2022-08-09)

- The `defaultGraph` option is now optional. If unset, RATT will use `https://triplydb.com/ratt` as default graph. This means you can now instantiate a pipeline as follows:

```ts
const pipeline = new Ratt()
```
- Fixed an issue where interrupted ratt-source downloads caused an invalid cache 
- The `fromPostgres` middleware is fixed (it was broken in the last few versions)

## 4.0.0 (2022-08-05)
- **Breaking**  The RATT API was simplified as follows:
  - Functions names changed:
    - `toIri(...)` => `iri(...)`
    - `toLiteral(...)` => `literal(...)`
    - `addQuad(...)` => `quad(...)` or `triple(...)`
  - The arguments for the IRI and literal functions are now more intuitive:
    - `toIri(key.b, {prefix: prefix.a})` => `iri(prefix.a, key.b)`
    - `toLiteral(key.b, {datatype: xsd.integer})` => `literal(key.b, xsd.integer)`
  - It's now also possible to easily import middlewares individually:
```ts
import mw from "@triplydb/ratt/lib/middlewares" // Import all middlewares. This was already possible
import {triple} from "@triplydb/ratt/lib/middlewares" // Import a single middleware. This is now also possible
```

## 3.4.66 (2022-07-25)
- This version includes a fix where SHACL validation may sometimes cause the ETL to go out-of-memory (OOM)
- The log file improved. We've changed the output slightly, and are now including the time we spend in before and after hooks. 

## 3.4.65 (2022-07-20)
Changed Ratt's prefixer to avoid caching local names. Current issues with RATT going OOM should be fixed with this change. Also, the developer might notice an increase on the runtime, but this is not certain.


## 3.4.62 (2022-07-12)
Implemented a part of ratt-helpers in ratt-core. Now, an etl developer can use:
- `vocab` for vocabulary terms, 
- `prefix` for prefixes,
- `lang` for language tags
- `Shape` for geo shapes


We were based on the work of the customer team in [ratt-helpers](https://git.triply.cc/etl/ratt-helpers/-/tree/main).

#### More details

Instead of having to create the set of the prefixes for common vocabularies 
and passing it to prefix argument of a new ratt app, you can instead use directly the object `prefix`, such as `prefix.crm`. Also, you can use explicitly terms from common vocabularies, such as `vocab.exampleVocab.term` or `exampleVocabulary.term`.

Examples:

Instead of `prefix.foaf('Person')`, you can use `vocab.foaf.Person` or `foaf.Person` .
		   
```typescript
mw.addQuad(
   mw.toIri('key', {prefix:prefix.exampleVocabulary}),
   rdf.type,
   foaf.Person // or vocab.foaf.Person
)
```
Notice that if `exampleVocabulary` is a commonly used external vocabulary then you will be able to use it without declaring it yourself as it should be a part of Ratt by now.
		  
Additionally, for language tags, instead of `mw.toLiteral('key', { language: 'en' })`, you can use `mw.toLiteral('key', { language: lang.en })` .
          
		  	  
```typescript
mw.addQuad(
   mw.toIri('firstKey', {prefix:prefix.example}),
   rdfs.label,
   mw.toLiteral('secondKey', { language: lang.en }) 
)
```

### Important note!
We included a number of vocabularies based on the experience of the customer team. If the customer team thinks that one or more vocabularies should be included in Ratt, they have to let us know.




## 3.4.61 (2022-06-29)
Fix  CLI error messages regarding fromRecordId.

## 3.4.58 (2022-06-15)
- Support writing log files to specific dir via the `--log-dir` CLI argument. This enables easier integration in CIs, as we can make the directory an artifact that is downloadable.
- **Breaking** Use consistent naming of log files. `.ratt-error.log` is now renamed to `ratt.err`. `.trace-...` is now renamed to `ratt.trace-...`. As a consequence, make sure to add this to your `.gitignore` file:
```
ratt.err
ratt.trace*
```
- We now print the progress of an ETL in the CI as well
- The RATT log and error file contain information about the file we just ran. We now also print this information just before running the ETL. Useful in cases where a CI runs multiple ETLs after each other.


## 3.4.57 (2022-06-15)
- Improvements for running RATT in different (browser / NodeJS) environments. This fixes a bug where the log file was not written.

## 3.4.55 (2022-06-10)
- Improve `.fromHashOf()` by not creating a hash when an object is deeply empty.

## 3.4.54 (2022-06-07)
- Make `.fromHashOf()` more flexible, allowing arrays and complicated objects to be used for creating hashes.

## 3.4.53 (2022-06-06)
- Support `CDATA` blocks in `mw.fromXml`

## 3.4.50 (2022-05-31)
- Improved performance of `mw.toIri`: encoded only the illegal characters that might occur in input data.


## 3.4.47 (2022-05-30)
- Added a variable (`rattCompletedSuccessfully`) to the callback of the `after` hook. Use this in cases when `{ always: true }` is set to distinguish success from an error.
- Fixed a bug where partial results were being written to a destination when an error occured, if that destination was used in an `after` hook which should always fire. This is the case for SHACL validation, and it's result destination.

## 3.4.46 (2022-05-20)
- Fixed a bug which sometimes occurred while updating a service.

## 3.4.45 (2022-05-18)
- Make RATT available to run in the browser again
- Upped TriplyDB-js

## 3.4.44 (2022-05-18)
- Fix fix hanging promise in `fromOai` retry mechanism

## 3.4.43 (2022-05-18)
- Fix hanging promise in `fromOai` retry mechanism

## 3.4.42 (2022-05-17)

- For shapes not using SPARQL targets, the validation validation runtime performance has improved by 80%. 

## 3.4.37 (2022-04-28)
- **Breaking** Destinations are always written to first before any `after()` hooks are run. Previously, the ordering was not well defined, and was usually interleaved.
- **Breaking** `after()` hooks are run in the order that they are defined. Previously, `after()` hooks with the flag `always` were run before ones without this flag.

## 3.4.36 (2022-04-28)
- Added resolutions version for `parse-link-header` because of a vulnerability in an earlier version.

## 3.4.35 (2022-04-28)
- Fix `fromOai` DX issue when killing an ETL while the cache is being cleared

## 3.4.34 (2022-04-26)
- Remove unused dependency.

## 3.4.32 (2022-04-19)

We now log middleware performance. Each time a Ratt app is ran a log file is created that outputs the total and average runtimes for each middleware.
This should help with identifying poor performing middlewares, both expected and unexpected. 

Breaking change: `ratt.log` should be added to the `.gitignore` of previous ETLs

## 3.4.31 (2022-04-15)
- Improved behaviour of `mw.debug.traceStart()` and `mw.debug.traceEnd()`: the `after()` hooks are not executed when tracing middlewares
- Improved `mw.fromOai()` middleware: each record now contains metadata about whether it came from a cached result, or whether it's a 'new' record

## 3.4.26 (2022-04-05)

Improved behaviour for parsing geo shape files. The results are not manually post-processed anymore

### 3.4.26 (2022-04-05)

Add caching to `mw.fromOai`. Use it like so:

```ts
app.use(
  mw.fromOai({
    since: twoWeeksAgo,
    url: "https://somethingsomething.redacted/webapioai/oai.ashx",
    set: "artthesaur",
    // Use the cache even though this specific API cannot guarantee correctness
    cacheOverride: "use cache", 
    maxCacheAgeDays: 30 // Clear the cache every 30 days
  })
);
```

**Breaking** Removed the `behaveLikeFromXml` option of `mw.fromOai` in favour of always behaving like `mw.fromXml` without the ability of option out of that behaviour.


### 3.4.25 (2022-04-04)
- Delete error messages tests for TriplyDB-JS. 

### 3.4.24 (2022-03-31)
- Small changes on the previous test snippet.

### 3.4.23 (2022-03-30)
- Upgraded TriplyDB-JS. In Ratt-test.ts, added test script for some error messages in TriplyDB-JS .

### 3.4.22 (2022-03-17)
- Status code shows up in the TriplyDB-JS error message.

### 3.4.21 (2022-03-14)

- forEach middleware correctly increments context recordId.

### 3.4.16 (2022-02-17)

- Upgraded TriplyDB-JS & improved expected behaviour for `Context.getNumber()`.

### 3.4.15 (2022-02-14)
 
- Upgraded TriplyDB-JS. The interface for adding prefixes improved, i.e. you can now do:

```ts
// Take all RATT prefixes and store them in this dataset
dataset.addPrefixes(app.prefix)
```

### 3.4.14 (2022-02-10)

- Support for logging what requests are sent by `fromOai`. Use `--verbose --verbose` to see all the urls that are fetched, and use `--verbose --verbose --verbose` to also see the plain text response that is returned.


### 3.4.11 (2022-02-08)

**Breaking changes**

- `getX` functions (eg. `getString`, `getNumber`, etc) replace `asX` functions.
    
  eg.

    ```ts
    if (ctx.asString('@lang') === 'nl-NL') { 
      // ...do something 
    }
    ```
    changes to
    ```ts
    if (ctx.getString('@lang') === 'nl-NL') { 
      // ...do something 
    }
    ```

- `ctx.get(key)` has been renamed to `ctx.getAny(key)`

- Removed `getNonEmptyString`. The `getString` function can be used instead.

  eg. `ctx.getString(key)` will throw if the value found at key is 'empty'

- `getArray` has a new function signature that accepts a type `getArray(key, type)`.
   The type argument accepts any of the following as a string:
   
   `string`, `number`, `boolean`, `literal`, `iri`, `blankNode`, `unknown`, `any` 

  Using the previous function signature:
  
  `ctx.getArray<any>("someKey")` 
  
  Using the new function signature: 
  
  `ctx.getArray("someKey", "any")`

  Example use case:

  Some json data:

  ```json
  { "a": ["true", "false", "12345", { termType: "Literal", value: "isIri aka NamedNode" }] }
  ```
  Using the new function signature:

  ```ts
  ctx.getArray("a", "literal") // Returns an array of literals: 
  
  // [
  //   Literal { id: '"true"' },
  //   Literal { id: '"false"' },
  //   Literal { id: '"12345"' },
  //   { termType: 'Literal', value: 'something useful' }
  // ]
  ```
  
- `getArray` type can also accept nested types.

  Example use case for a array of nested arrays: 
  
  `ctx.getArray(key, {array: "string"}) // will return, if possible, a nested array of strings.)`

  Some json example of a arrays nested in an array:

  ```json
  {
    "a" : [
            ["hello", 122],
            [true, "wOrld"],
            [{ termType: "Literal", value: false }, "world"]
          ]
  }
  ```

  Using the new function signature:

  ```ts
  ctx.getArray("a", {array: "string"}) // Returns  [ [ 'hello', '122' ], [ 'true', 'wOrld' ], [ 'false', 'world' ] ]
  ```

**Other Changes** 

- `getX` functions will now also **try to coerce** the `unknown` value to type `X`.

  eg. `getString(key)` will try and coerce all values found to type string

  Where some json object is:
  
  ```json
  { "a": 12345, "b": true, "c": false, "d": 1.25, "e": "98765", "f": "hello" };
  ```
  ```ts
  ctx.getString("a") // returns "12345" as a string
  ctx.getString("b") // returns "true"  as a string
  ctx.getString("d") // returns "1.25"  as a string, etc
  ```
- Improved error description for when a value cannot be coerced.

  Example: Using `getNumber` for a **blankNode** will result in an error:

  Some json data:

  ```json
  { "a": { "termType": "BlankNode", "value": "blank" }}
  ```
  ```ts
  ctx.getNumber("a")

  Throws an informative error:
  `Could not coerce '[object, object]' of type 'blanknode' from key 'a' to the desired type 'number'`
  ```

- Added `getUnknown`. It has the same behaviour as `getAny` but returns `unknown` type.

The types can be coerced as follows:

| |string       |number                |boolean               |array |literal                   |IRI   | blank
|-------|-------------|----------------------|----------------------|------|--------------------------|------|------|
| **getString** |return       |coerce          |coerce          |throw |coerce                      |throw  | throw |
| **getNumber** |attempt coercion         |return                |attempt coercion          |throw |coerce with correct datatype|throw | throw |
| **getBoolean** |attempt coercion         |attempt coercion                   |return                |throw |coerce with correct datatype|throw | throw |
| **getArray**  |throw        |throw                 |throw                 |return|throw                     |throw | throw |
| **getLiteral** |return .value|attempt coercion on .value|attempt coercion on .value|throw |return                    |throw  | throw |
| **getIri**    |return .value|throw                 |throw                 |throw |throw                      |return| throw |
| **getBlankNode**    |return .value|throw                 |throw                 |throw |throw                      |throw| return |



### 3.4.9 (2022-02-07)
- **breaking** add support for passing `"never"` to the `log` and `terminateOn` options of `mw.validateShacl`, instead of `false`.
- **breaking** copy syntax has changed from `app.source.someSource.copy(app, app.destination.someDestination)` to `app.copySource(app.source.someSource, app.destination.someDestination)`
- **breaking** drop support for the following syntax: `Ratt.Destination.rdf.TriplyDb((app) => { ... })`. Instead use a dynamic destination:
- support dynamic destinations, e.g.:

```ts
const app = new Ratt({
  defaultGraph: "http://example.org",
  sources: { someSource: Ratt.Source.file("source.trig") },
  destinations: {
    someStaticDestination: Ratt.Destination.file("static.ttl"),
    someDynamicDestination: (ctx) => Ratt.Destination.file(ctx.getString("destination"))
  },
})

// Copying to a static destination (still) works
app.copySource(app.sources.someSource, app.destinations.someStaticDestination)

// Copying to a dynamic destination is impossible and therefore results in a
// compile error
// @ts-expect-error
app.copySource(app.sources.someSource, app.destinations.someDymanicDestination)

```

### 3.4.8 (2022-02-07)
- add missing `addQuads` to middlewares

### 3.4.7 (2022-02-07)
- **Breaking** `mw.logRecord` and `mw.logQuery` are now accessible via `mw.debug.logRecord` and `mw.debug.logQuery`
- There are two new middlewares: `mw.debug.traceStart()` and `mw.debug.traceEnd()`. These middlewares serve two purposes:
  - To show what changed in the record and store.
  - To allow you to replay the middlewares involved (between start and end) for just 1 record.

An example on how to use the middleware:

```ts
const app = new Ratt({ cliContext, defaultGraph: "" });
app.use(
  mw.fromJson([
    { a: 1, b: 1 }, // first dummy record
    { a: 2, b: 2 }, // second dummy record
  ]),
    mw.change({key:'a', type:'number', change: (val) => val +100}), // change the 'a' key
    mw.debug.traceStart(),
    mw.change({key:'b', type:'number', change: (val) => val +100}), // change the 'b' key
    mw.debug.traceEnd()
)
```
Ratt will now show a diff indicating that the value for `b` changed. Ratt will also present you with a command you can use for re-running just that one change middleware, for just 1 record.

### 3.4.6 (2022-02-02)
- Add `fromTSV` middleware

### 3.4.4 (2022-02-01)
- Validating SHACL now works with IRIs in lists (see [this](https://issues.triply.cc/issues/6223) issue for context)

### 3.4.2 (2022-01-25)
- `arraysLikeFromXml` has been renamed to `behaveLikeFromXml`.
- Always make text a separate node in `fromOai`, if `behaveLikeFromXml` is `true`.

### 3.4.1 (2022-01-24)
- Name text nodes `$text` instead of `#text` in `fromOai`

### 3.4.0 (2022-01-24)
- Drop support for passing in xml parsing options to `fromOai`
- Support the `arraysLikeFromXml` option instead. Set it to `true` if you want the output format of `fromOai` to match the format of `fromXml`.
- Continuation of TriplyDB-JS upgrade

### 3.3.0 (2022-01-18)
- Upgrade TriplyDB-JS dependency to version `4.0.0`
- Upgrade other dependencies

### 3.2.8 (2022-01-12)
- Support passing in xml parsing options to fromOai
- Make `mw.toIri.fromHashOf` stable across keys

### 3.2.7 (2021-12-24)

Fix annoying last-minute mistake in `mw.fromOai`.

### 3.2.6 (2021-12-24)

Add `mw.fromOai`. Examples:

```ts
// RKD
mw.fromOai({
  url: "https://somethingsomething.redacted/webapioai/oai.ashx",
  set: "artthesaur",
})

// MARC
mw.fromOai({
  url: "http://api.socialhistoryservices.org/solr/all/oai",
  metadataPrefix: "marcxml",
})
```

### 3.2.5 (2021-12-17)

- Add `Ratt.Source.string` for using an inline string as a source.
- Fix some hashing bugs. This makes `toIri.fromHashOf` stricter: it will now throw an error when trying to hash something that isn't a string.*
- Fix error when multiple classes were supplied to `sh:class`.

*: hashing something that isn't a string has never been supported, but we were not throwing an error.

### 3.2.4 (2021-12-10)

Improvement:

 - When running RATT in the CI, and when printing the error, ensure we print the whole record object instead of the truncated one


### 3.2.3 (2021-12-10)

Fix:

 - (`mw.copy`): would sometimes complain that `key` existed in the record even if `ctx.isEmpty(key)`

### 3.2.2 (2021-12-03)

Fix:

 - (`mw.forEach`): `$parent` key pointed to the previous item in the array, for items after the first. Only the first item correctly pointed to its parent.

### 3.2.1 (2021-09-28)

- Added `mw.sparqlUpdate` middleware. Usage: directly modify the internal store using SPARQL update query.

```ts
    const app = new Ratt({
      defaultGraph: "https://default/",
      prefixes: { ex: Ratt.prefixer("http://example.org/") },

      sources: {
        remoteQuery: Ratt.Source.TriplyDb.query("triply", "ratt-update-test", {
          triplyDb: { url: "https://api.nightly.triplydb.com" },
        }),
        localQuery: Ratt.Source.file("./src/middlewares/store/__tests__/resources/updateQuery.ru")
    });
mw.sparqlUpdate("INSERT DATA { <a:a> <b:b <c:c> }")
mw.sparqlUpdate(app.sources.remoteQuery)
mw.sparqlUpdate(app.sources.localQuery)
```

### 3.2.0 (2021-09-13)

- **Breaking** Renamed `fromRdf` -> `loadRdf`, as it is not a starting middleware.
- **Breaking** For all transformation middlewares the `type` argument is now required
- **Breaking** Removed `mw.remove` (not used)
- **Breaking** Removed `mw.set`
  - Use `mw.change` to update an entry
  - Use `mw.replace` to overwrite an entry using a value from another entry
  - Use `mw.copy` to add a new entry based on the value of another entry
  - Use `mw.add` to add a new entry based on the values of multiple other entries or external values
- **Breaking** `mw.copy` is more strict.
  - You can no longer use the middleware with `fromKey` equal to `toKey`. Use `mw.change` instead
  - You can no longer access the current key or the context from the change method. Use the `value` argument instead, and otherwise use `mw.replace`
- Added `mw.replace` middleware. Usage: Replace an entry using a value from a different entry (with a possible transformation).

```ts
mw.replace({
  fromKey: "foo",
  type: "number",
  toKey: "bar",
  change?: (value) => value + "zzz"
})
```

- Added `mw.add` middleware. Usage: Create a new entry in the record from multiple entries or external content

```ts
mw.add({
  key: "fullName",
  value: (context) => context.asString("firstName") + " " + context.asString("lastName")
})
```

Transformations made should now follow the following table:

| | *create a new entry* | *change an existing entry* |
| ---------------------- | ------------------- |  ------------------------ |
| *based on self*        | **impossible**                  | `mw.change(value)`  |
| *based on other entry* | `mw.copy(value)`       | `mw.replace(value)`         |
| *based on context*     | `mw.add(context)`      | write a custom Middleware |

### 3.1.88 (2021-09-03)
Support

```ts
const prefix = Ratt.prefixer("https://triplydb.com/Triply/example/")
const graph = Ratt.prefixer(prefix("graph/"))
const app = new Ratt({
  destinations: {
    model: Ratt.Source.TriplyDb.rdf("Triply", "example", {graphs: [graph("model")] }),
  },
})
```

and

```ts
mw.sparqlConstruct((ctx) => ctx.getString("query"))
```

### 3.1.86 (2021-09-02)
- Fix `--fromRecordId` and how it interacts with `--head`


### 3.1.84 (2021-08-25)

- Added support for [SPARQL targets](https://www.w3.org/TR/shacl-af/#SPARQLTarget) in the SHACL validation step, with some caveats:

  - The custom target must be an instance of `sh:SPARQLTarget`.
  - Prefixes are not supported using the `sh:prefixes` property. All SPARQL target queries must be self-containing.
  - [SPARQL target types](https://www.w3.org/TR/shacl-af/#SPARQLTargetType) are not supported.

### 3.1.83 (2021-08-17)

- Added `mw.logQuery` middleware to print queries as string to the CLI.

```ts
const app = new Ratt({
    defaultGraph: "https://default.com/",
    cliContext,
    sources: {
      query: Ratt.Source.TriplyDb.query("triply", "Data-analysis-type", {
        variables: { FlowerType: "Iris setosa" },
        triplyDb: { url: "https://api.triplydb.com" },
      }),
    },
  });

  app.use(mw.logQuery(app.sources.query));
```



### 3.1.80 (2021-07-23)

- Support using a TriplyDB saved SELECT query as source. Just use the `TriplyDb.query` source in the `fromJson` middleware!
- Added `toList` middleware. See the snippets below on how to create a RDF list using RATT

```ts
const app = new Ratt({
  defaultGraph: "https://default.com/",
  prefixes: { basket: Ratt.prefixer("https://www.triply.cc/fruitbasket/") },
});
app.use(mw.fromJson([{ id: "basket", contains: ["Banana", "Blueberry", "Strawberry"] }]));
app.use(
  mw.addQuad(
    mw.toIri("id", { prefix: app.prefix.basket }),
    app.prefix.basket("contains"),
    mw.toList(mw.toLiteral.forEach("contains"), { prefix: app.prefix.basket })
  )
);
```

```ts
const app = new Ratt({
  defaultGraph: "https://default.com/",
  prefixes: { basket: Ratt.prefixer("https://www.triply.cc/fruitbasket/") },
});
app.use(
  mw.addQuad(
    app.prefix.basket("basket"),
    app.prefix.basket("contains"),
    mw.toList([app.prefix.basket("Banana"), app.prefix.basket("Blueberry"), literal("Strawberry")])
  )
);
```


### 3.1.76 (2021-07-12)
- Added the ability to synchronize services from RATT, displayed in the snipped below. Existing ETL's won't be affected by this change, as it's opt-in. Stopped or removed services won't be updated. Services that are in an error state will cause the RATT script to terminate. If a service is starting or updating, RATT will wait for it to be running before updating it.
```ts
const app = new Ratt({
  defaultGraph: 'https://somegraph/',
  destinations: {
    somedataset: Ratt.Destination.TriplyDb.rdf("somedataset", { synchronizeServices: true })
  }
```

### 3.1.70 (2021-06-28)
- Improved SHACL messages:
  - Custom error message for the following shape constraints: `sh:class`, `sh:xone` and `sh:languageIn`
  - Prefixes are used for terser messages. These must be defined in the RATT app (they do not get loaded from source files.)
  - **Breaking**: Stricter requirements for shapes. If you encounter any new errors that you don't believe should be there, please mention this in the #RATT channel.


### 3.1.67 (2021-06-21)
- Support passing `defaultGraph` key to `Ratt.Destination.TriplyDb.rdf`. This `defaultGraph` setting will take precedence over the `defaultGraph` setting of the RATT app.
Example:

```ts
const app = new Ratt({
  defaultGraph: 'https://somegraph/',
  destinations: {
    somedataset: Ratt.Destination.TriplyDb.rdf("somedataset", { defaultGraph: 'https://someothergraph/' })
  }
})
```
### 3.1.66 (2021-06-17)
- Add support for using the results of a saved query as a source
- Support for specifying variables of a saved query
- **Breaking**: the `Ratt.Source.query` source should now be used directly, instead of specifying `.string`. It will automatically determine whether to use the results of the query, or the query string. For example:

#### New Situation
```ts
const app = new Ratt({
  defaultGraph: "https://default.com/",
  sources: {
    query: Ratt.Source.TriplyDb.query("triply", "ratt-query-string-test", {
      variables: { sub: "whatever" },
      triplyDb: { url: "https://api.nightly.triplydb.com" },
    }),
  },
});
```

#### Old Situation
```ts
const app = new Ratt({
  defaultGraph: "https://default.com/",
  sources: {
    query: Ratt.Source.TriplyDb.query.string("triply", "ratt-query-string-test"),
  },
});
```


### 3.1.57 (2021-05-19)
- Resolve construct query memory issues (https://issues.triply.cc/issues/5233)

### 3.1.52 (2021-05-06)
- **Breaking**: `mw.change` and `mw.copy` now throw an error when referencing record keys that do not exist
- The `mw.forEach` middleware now stores a reference to the root record ('$root')


### 3.1.50 (2021-05-05)

- Always render the last record in verbose mode. If the record is too large, we only render a slice.

### 3.1.46 (2021-05-04)

- When running RATT in verbose mode (`--verbose`), we now log the middlewares that were skipped. Examples of skipped middlewares:

```ts
app.useWhen(
  (ctx) => false,
  mw.addQuad(mw.toIri("person"), app.prefix.rdf('type'), app.prefix.foaf('Person'))
);

app.use(
  mw.addQuad(mw.toIri("this-key-does-not-exist"), app.prefix.rdf('type'), app.prefix.foaf('Person'))
);

app.use(
  mw.sparqlConstruct(app.sources.queryThatReturnsNoResults)
)
```

### 3.1.45 (2021-04-30)

- Better error context: when a RATT middleware fails, you will now see (with the `--verbose` flag turned on) the `app.use()` snippet that triggered this middleware.
**Note:** This rendered snippet works best if your `tsconfig.json` file contains `sourcemaps:true`. See [here](https://git.triply.cc/triply/boilerplates/-/blob/e70b70eabb09eb99e0464c935ee39634c4efcae4/etl/tsconfig.json#L6) for an example
- You can now conditionally run middlewares using an `mw.when()` middleware. Up until now this was only possible with `app.useWhen`, which only supports conditionally running middlewares at a top level. But this implementation did not suffice for cases where you'd have a deeper middleware hierarchy. For example:

```ts
app.useWhen(
  (ctx)=> ctx.record.type ==='article',
  mw.addQuad(mw.toIri('articleIri'), app.prefix.schema('articleName'), mw.toLiteral('articleName')),
  mw.when(
    (ctx) => ctx.isNotEmpty(ctx.record.author),
    mw.set({key: 'authorIri', value:(ctx) => ctx.asIri('author', {prefix: app.prefix.schema})}),
    mw.addQuad(mw.toIri('articleIri'), app.prefix.schema('author'), mw.toIri('authorIri')),
    mw.addQuad(mw.toIri('authorIri'), app.prefix.schema('name'), mw.toLiteral('author.name')),
  )
)
```
- A typical usecase when using `when` is checking whether a key exists. To cover this usecase, we also support passing a string (instead of a function). The middleware will then check whether that key is set in the record
- Process individual an array of sub-records easily using `mw.forEach`. Take the following record:

```ts
{
  article: 'someNiceArticle',
  articleIri: 'https://article.org/someNiceArticle'
  authors: [
    {
      iri: 'https://laurensrietveld.nl',
      name: 'Laurens Rietveld',
    },
    {
      iri: 'https://martinvanharmelen.nl',
      name: 'Martin van Harmelen',
    }
  ]
}
```
An easy way to get the author information is now to run the following ratt snippet:

```ts
app.use(
  mw.forEach("authors",
    mw.addQuad(mw.toIri('$parent.articleIri'), app.prefix.schema('author'), mw.toIri('iri')),
    mw.addQuad(mw.toIri('iri'), app.prefix.foaf('name'), mw.toLiteral('name'))
  )
)
```

### 3.1.37 (2021-04-23)

Middlewares that read a value from the record (`mw.change`, `mw.remove` and `mw.copy`) now come with improved typings.
In the previous situation, the value was always unknown and you had to perform a cast, e.g. `as string` to manipulate it as a string. Now, you can do this casting automatically by adding a `type` argument to these middlewares. This will make sure the typescript types are ok, and it'll throw an error if the type does not match the record value.

Before:
```
app.use(mw.change({
  key: 'somekey',
  change: (val) => (val as string).trim()
}))
```

After:
```
app.use(mw.change({
  key: 'somekey',
  type: 'string',
  change: (val) => val.trim()
}))
```

### 3.1.32 (2021-04-12)
Remove blank-node syntax from `toIri`. Instead, use `toIri.fromHashOf`:

```ts
const someIri = mw.toIri.fromHashOf(['key1', 'key2'], {prefix: 'https://somethingsomething/'});
app.use(mw.addQuad(pref("a"), pref("b"), someIri));
app.use(mw.addQuad(someIri, pref("c"), pref("d")));
app.use(mw.addQuad(someIri, pref("e"), pref("f")));
```

### 3.1.23 (2021-03-19)
Substitute blank nodes by [well-known IRIs](https://www.w3.org/2011/rdf-wg/wiki/Skolemisation).


- You can specify the prefix for skolemized blank nodes using the `wellKnownIriPrefix` option of RATT. Note that (1) you are responsible for including `.well-known` in this prefix and (2) the prefix should end with a `/`, .e.g: `https://triplydb.com/.well-known/genid/`.
- **Breaking**: `mw.toBnode` has been removed. Use `mw.toIri` instead: the interface and functionality of `mw.toBnode` has been merged with that of `mw.toIri`.
- **Breaking**: `ctx.store.createBlankNode` will raise an error. Use `ctx.store.blankNodeIri` instead.
- **Breaking**: The default graph is now accessible via `app.defaultGraph`. The old method for accessing this value (`app.getGraph()`) is removed

### 3.1.22 (2021-03-15)
- The RATT CLI supports passing an `--account` as argument (or `$TRIPLYDB_ACCOUNT` env variable). Previously, specifying an account in a source or destination was mandatory. Now, you can leave out the account name. If you do not specify an account in a source or destination, it will first check the value of `--account` and the `$TRIPLYDB_ACCOUNT` environment variable. Only when both of them are not set, will RATT default to using the account that owns the token.
- **Breaking**: The `Source.TriplyDb.asset` interface changed. Instead of writing
```ts
Source.TriplyDb.asset('<accountname>', '<datasetname>', '<assetname>')
```
you'll have to write
```ts
Source.TriplyDb.asset('<accountname>', '<datasetname>', {name: '<assetname>'})
```

### 3.1.12 (2021-03-10)
- `mw.sparqlConstruct` now supports using any `Ratt.Source` as query
- support using the query string of a saved query as source

```ts
const app = new Ratt({
  defaultGraph: "https://default.com/",
  sources: {
    // TriplyDb.query.string has the same interface as TriplyDb.rdf
    query: Ratt.Source.TriplyDb.query.string("some-query-name"),
  },
});

// Just a source
app.use(mw.sparqlConstruct(app.sources.query))

// Just a string
app.use(mw.sparqlConstruct("CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"))

// Any combination of the above:
app.use(mw.sparqlConstruct([
  app.sources.query,
  "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }",
  app.sources.query,
]))
```

### 3.1.11 (2021-03-09)

*Breaking* `validateSHACL` now supports specifying the graph to which the report should be written. The new options interface is:

```ts
interface SHACLOptions {
  /**
   * The graphs to validate
   * @default everything
   */
  graphs?: Array<string | NamedNode>;
  /**
   * Minimum severity of violations to show on the command-line.
   * `false` turns of all command-line messages.
   * @default "Info"
   */
  log?: Severity | false;
  /**
   * Minimum severity of violations that should terminate RATT.
   * @default "Violation"
   */
  terminateOn?: Severity | false;
  report?: {
    destination?: DestinationGetter;
    /**
     * Store the report in this graph.
     * @default The Ratt default graph
     */
    graph?: NamedNode | string;
  };
}
```

Also fixed:

- better error when using a non-existent file as source
- `incorrect header check` error when uploading to an old version of TriplyDB

### 3.1.10 (2021-03-03)

*Breaking* The `allowEmptyString` option for `mw.toLiteral` is now removed. The default behaviour is now as follows:
- `mw.toLiteral` and `mw.toIri` will now skip execution when a record key is referenced that doesn't exist. For example, the following `addQuad` statement will be skipped completely:

```
app.use(mw.addQuad(mw.toIri('this-key-does-not-exist'), app.prefix.rdf('type'), app.prefix.rdf('Class')))
```

Consequences of this change:
1) In many cases you can rewrite `app.usewhen` into `app.use`: A common pattern is using `app.useWhen` to make sure `addQuad` is only executed when a key exists. This is now taken care of automatically.
2) You can remove all mentions of the `allowEmptyString` option

### 3.1.9 (2021-03-02)

Support copying a source directly to a destination. Syntax:

```ts
app.use(...) // Possibly some middlewares here

await app.sources.someSource.copy(app, app.destinations.someDestination);

app.use(...) // Possibly some more middlewares here
```

### 3.1.6 (2021-03-01)
Support array of queries as first argument to `fromPostgres`.

### 3.1.2 (2021-02-24)
- The `Ratt.source.TriplyDb.Rdf` interface changed slightly. The account name is not required anymore, i.e. you dont have to write `""` as account name

### 3.1.0 (2021-02-23)
Changes:

- *BREAKING* `ctx.output` is renamed to `ctx.store`
- *BREAKING* `mw.fromRdf` will not write to the record. Instead, it will add quads to `ctx.store`. A consequence of this change is that you will need to specify what graphs to use in subsequent middlewares like `toRdf` and `validate` (see below)
- *BREAKING* When a TriplyDB dataset is referenced in a destination, it will now create this dataset when it does not exist yet. In previous versions, we would throw an error instead.
- Because of the above, the `mw.toRdf` middleware now supports the `includeGrahs` and `excludeGraphs` options. Use this to specify what part of the store you would to to persist.
- The SHACL validation middleware supports passing a graphs array to specify which graphs to apply the validation to.
- In the Ratt CLI were are printing the number of quads written. The number of quads written was not fully correct up until now, as it was tracking the number of quads written to the in-memory store. It was not tracking the quads written to a destination. This value should be more precise now.
- The SHACL middleware now supports Ratt destinations for validation reports.
- Ratt now prints more information, such as:
  - Whether a dataset was created in the process (including a link to that dataset)
  - Which dataset uploads finished (again, including a link to these datasets)



Bug fixes:
- We were only writing the SHACL report to file if there was also a violation that was logged to the command line. Now the report file will always be created if there is something to report.
- `Ratt.destination.Triply.rdf()` was not always written to. This is now fixed

### 3.0.38 (2021-02-18)
Add `fromPostgres` middleware.

TLDR:
```ts
// set the password in `.ratt-private`: `POSTGRES_PASSWORD=password`
app.use(mw.fromPostgres("QUERY HERE", { url: "postgresql://username@host:port/database" }));
```

The following ways of configuring the middleware can be used (in any combination):

#### 1. postgres connection url
```ts
app.use(mw.fromPostgres("QUERY HERE", { url: "postgresql://postgres:example@localhost:5432/demo" }));
```
Where the general format of the url is `postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`.

#### 2. directly passing the options
```ts
app.use(mw.fromPostgres("QUERY HERE", {
  user: 'postgres',
  password: 'example',
  host: 'localhost',
  port: 5432,
  database: 'demo',
}));
```
See [the documentation of the postgres package](https://github.com/porsager/postgres#connection-options-postgresurl-options) for a list of all supported options.

#### 3. environment variables
Add the following to `.ratt-private` and fill out the necessary fields (no spaces around the `=`):

```bash
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE=
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
```

e.g.:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=demo
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=example
```

Note that, for safety reasons, `.ratt-private` is not under version control. This means that you'll have to share the login credentials separately with anyone who you want to allow to run the ETL.

### 3.0.36 (2021-02-15)

- Allow multiple files in `Ratt.source.file`.
- Construct queries work without using `graph ?g { ... }`

### 3.0.31 (2021-02-03)

- The RATT CLI now prints more information (the statements in question) when there is a shacl violation

### 3.0.25 (2021-02-02)

- *BREAKING* the `fromRdf` middleware now writes the RDF content to the record. These files are often not intended to be part of the output, hence it's only annoying when storing this in the `ctx.store` object (now named `ctx.output`).
- *BREAKING* The `ctx.store` property is renamed to `ctx.output`. This better conveys that these results are written to some other place, and avoids ambiguity when adding a `store` object to a record using eg `fromRdf`


### 3.0.21 (2021-02-02)

The prefixes ratt configuration option became stricter. This enables us to more easily re-use ratt configurations, and split one etl across multiple files.

Before:
```ts
const app = new Ratt({
  prefixes: {
    "a" : "https://example.org/"
    }
  }
)
```
After:
```ts
const app = new Ratt({
  prefixes: {
    "a" : Ratt.prefixer("https://example.org/")
    }
  }
)
```
