[TOC]

# Changelog

The current version of TriplyETL is **3.0.17**

You can use this changelog to perform a safe update from an older version of TriplyETL to a newer one. See the documentation for [Upgrading TriplyETL repositories](./maintenance.md#update-the-triplyetl-dependency) for the advised approach, and how the changelog factors into that.



## TriplyETL 3.0.15 through 3.0.17

Release date: 2023-12-07 through 2023-12-13

### [Enhanced] Skolem IRI prefix use

TriplyETL now emits an error when a Skolem IRI prefix is used with [addHashedIri()](../transform/ratt.md#function-addhashediri).

### [Enhanced] RDF compression before upload

It is now possible to enable compression of RDF data before being uploaded to TriplyDB. See the [toRdf()](../publish/index.md) function for more information.



## TriplyETL 3.0.14

Release date: 2023-12-04

- *FEATURE*
  - build in hack to overrule the standard environments, see [issue #342](https://git.triply.cc/triplyetl/etl/-/issues/342)
  - [RML transformations](../transform/rml.md) can now be applied to the TriplyETL Record.

- *FIX*
  - fixed error in URL/Request in `fromOai`
- *CHANGE*
  - Updates most (but not all) packages to their latest version, including new vocabularies.

## v.3.0.9

Release date: 2023-11-29

### [Added] CLI flag to skip version check

Introduced the cli flag `--skip-version-check` because some users can not use remote connections because of security policies.

## v.3.0.7

Release date: 2023-11-??

- *FEATURE*
  - `toJson()` middleware now uses path selectors just as `fromXml()`, but also JPath expressions. See [issue #353](https://git.triply.cc/triplyetl/etl/-/issues/323).
  - `fromOai()` now accepts a [`Request` object](https://developer.mozilla.org/en-US/docs/Web/API/Request) as the value for the `url` option, allowing more fine graded use of the HTTP request (including authentication information).
  - `validate()` now deskolimizes (see the [RDF standard on this topic](https://www.w3.org/TR/rdf11-concepts/#h3_section-skolemization)) skolem iri's to blanknodes before validation. This behaviour can be skipped by setting the `skipDesklomize` flag to `true`. This will speed up the validation process.
  - `fromOai()` now accepts an optional parameter `stylesheet`. The argument must be an object with 1 required key `source`pointing to the source of the stylesheet and 1 optional argument `yieldsRdf`. When provided the XSL Stylesheet `source` is processed using the OAI response. It is important that the resulting transformed XML document is still a full OAI response after transformation! An example on how to do this can be found in `src/__tests__/resources/xslt/oai-ListRecords.xslt`. When the optional; `yieldsRdf` flag is set to `true`, the result of the transformation is treated as valid RDF XML and added to the Triply Store. The records will still be available as unit of streaming using the original OAI response. An example on how such a stylesheet could look like can be found in `src/__tests__/resources/xslt/oai-ListRecords-yieldsRdf.xslt`.
  - `fromOai()` now accepts an optional parameter `metadataYieldsRdf`. If this flag is true, the `<metadata>` envelop of the OAI response is expected to contain valid RDF. This can be combined with the new `stylesheet` parameter. You can not use `metadataYieldsRdf` when the applied stylesheet uses the `yieldsRdf` flag since we can not guarantee that the resulting XML still is a valid OAI-PMH response.
  - A full explanation of these new features for `fromOai()` can be found in [the merge request](https://git.triply.cc/triplyetl/etl/-/merge_requests/243).
- *FiX*
  - Fixes issue when sentinel keys use for `ifElse()` and `switch()` middlewares where printed in the logfile when errors occured.
## v.3.0.6
- releasedate: 2023-11-14
- *FIX*
  - Fixes issues with upstream packages that had breaking changes.
## v.3.0.5
- releasedate: 2023-11-09
- *Fix*
  - Progress bar now always termintes to 100%, in some rare situations the bars stopped at 99% or 101%.
  - Bumps all NPM packages to their latest versions.
## v.3.0.4
- releasedate: 2023-11-07
- *FEATURE*
  - It is now possible to use metadata when creating datasets. If a new dataset is created then the metadata is always used, for existing datasets you can choose to ignore, merge or replace existing metadata. This feature is to prevent ETL's accidentally overwriting metadata might have changed in the UI/Dashboard of their TriplyDB instance. Example code is available in the [Merge Request](https://git.triply.cc/triply/etl/-/merge_requests/237), but here is a short version: `toTriplyDb({dataset})`, where dataset is an object like this: `{name: 'my-name', displayName: 'My dataset', description: 'My Dataset is the best.', accessLevel: 'public', license: 'CC BY-NC', exampleResources: ['https://ex.com/1']}`.
  The following options are available for this new feature in the `opts.existingMetadata` parameter:
    - `ignore`: no metadata will be changed even if no metadata is present for this dataset (this is the default value)
    - `merge`: only properties that have no value will be overwritten bij the provided metadata
    - `replace`: all existing metadata will be replaced, even if the provided metadata contains empty keys
_ *CHANGE*
  - The cli flag `--skip-error-trace` is now removed in favour of a reversed logic flag `--create-error-trace`. This means error traces are never created unless requested by a auser. Skipping error traces gives extra performance and users hwo need it can still create it during debugging.
- *FIX*
  - Number of synchronized services was not reported correctly, see [issue #334](https://git.triply.cc/triply/etl/-/issues/334)
  - A regression was introduced when solving [issue #218](https://git.triply.cc/triply/etl/-/issues/218) as reported in [issue #331](https://git.triply.cc/triply/etl/-/issues/334). This regression caused certain `HEAD` request to fail. Those `HEAD` are only used to implement cachng, it is not needed to fail on errors on such a request.
  - Multiple tweaks where made to improve the speed of ETL's. A detailed overviews can be found is i[issue #285](https://git.triply.cc/triply/etl/-/issues/285).
  - A package we depend on introduced a breaking change causing a function not to be there anymore. This was reported in [issue #336](https://git.triply.cc/triply/etl/-/issues/336).
## v.3.0.3
- releasedate: 2023-11-01
- *CHANGE*
  - The code to submit datasets to the [NDE Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl) has been moved to TriplyDB-JS. The way to publish a dataset now is to add an option to the `toTriplyDb()` middleware: `{submitToNDEDatasetRegister: true}`. <br>**Example:** `toTriplyDb({dataset: 'nde', opts: {submitToNDEDatasetRegister: true}})`
  - Bumps all packages to their latest versions.

## TriplyETL 3.0.2

Release date: 2023-10-23

### [Added] Static statement assertion

```ts
export default async function(): Promise<Etl> {
  const etl = new Etl({base: Iri('https://example.com/')})
  await etl.staticAssertions)
  etl.use(
    fromJson([{name: 'John Doe'}]),
    triple(iri)
  )
  return etl
}
```

You can now assert so called "static triples": triples that are not related to the source extractors but should only be asserted once per ETL. This closes issue #216, a usage example is available in the merge request.

FIX

There was an error in the ifElse middleware that caused ETL's to not use the falback else in certain situations.

## TriplyETL 3.0.1

Release date: 2023-10-19

### [Enhanced] Source string validation

The `addLiteral()` function can now validate string data that occurs in the Record. Such validation can be used in addition to validation in the Internal Store (graph comparison and SHACL validation). Look at the documentation of [`addLiteral()`](../assert/ratt/terms.md) for more information.

### [Enhanced] Synchronize specific services

When publishing linked data to TriplyDB, it is now possible to synchronize one specific service. This is specifically useful in case an Acceptance and a Production service are used, and only the former should be synchronized. See the documentation for publishing to [remote data destinations](../publish/index.md#remote-data-destinations) for more information.

### [Fixed] Bug fixes

The following bugs have been fixed:

- The progress bar would sometimes go over 100%.
- the error report file (`etl.err`) would sometimes contain sentinel keys like `$sentinel-${MD5-HASH}`. These sentinel keys are used for internal bookkeeping in TriplyETL, and are no longer part of the Record.
- The RML `map()` function could not be imported.
- Some XSLT transformations failed on Windows, because of incorrect redirecting of error messages.



## TriplyETL 3.0.0

Release date: 2023-10-12

### [Added] Support for RML

Support was added for the RDF Mapping Language (RML). This is an ETL configuration language that has gained traction in the linked data community over the last couple of years. See the following documentation pages for more information:

- [RML Sources](../sources/rml.md)
- [RML Transformations](../transform/rml.md)
- [RML Assertions](../assert/rml.md)

### [Added] Support for XSLT

Support was added for the Extensible Stylesheet Language Transformations (XSLT) configuration language. This can be used in the following two functions:

1. The [fromXml()](../extract/xml.md) extractor function, for XML sources that transformed to regular XML.
2. The [loadRdf()](../extract/rdf.md) function, for XML sources that are transformed into RDF/XML.

In both cases, this functionality is used by configuring the `stylesheet` parameter with an XSLT Stylesheet (e.g. using `Source.file()`).

Example code that uses `fromXml()`:

```ts
fromXml(Source.file(XMLFile), {
        selectors: "rdf:RDF.sdo:Person",
        stylesheet: Source.file(XSLTStylesheet),
      }),
```

Example code that uses `loadRdf()`:

```ts
loadRdf(Source.file(XMLFile), {
        contentType: "application/rdf+xml",
        stylesheet: Source.file(XSLTStylesheet),
      }),
```

### [Added] Support for the `SPARQL Select` and `SPARQL Ask` queries
The extractors [fromCsv()](../extract/csv.md), [fromJson()](../extract/json.md), [fromTsv()](../extract/tsv.md) and [fromXml()](../extract/xml.md) now support [SPARQL Select](../sources/triplydb-queries.md#sparql-select-queries) queries.
The extractors [fromJson()](../extract/json.md) and [fromXml()](../extract/xml.md) also support [SPARQL Ask](../sources/triplydb-queries.md#sparql-ask-queries) queries.

The example below hows how to use a SPARQL ask query in the `fromJson()` extractor:

```ts
fromJson(Source.TriplyDb.query('account', 'query-name', { triplyDb: { url: 'https://api.triplydb.com' } }))
```

### [Enhanced] Simplified usage of 'nestedPairs()'

The [nestedPairs()](../assert/ratt/statements.md#function-nestedpairs) middleware can be used without providing the subject node that connects the pairs to the object/predicate. This will automatically create a Skolem IRI for the subject:

```ts
nestedPairs(S, P, [a, sdo.Person])
```

For example:

```ts
fromJson([{ id: '1', height: 15 }]),
addSkolemIri({
  prefix: prefix.skolem,
  key: '_height',
}),
nestedPairs(iri(prefix.product, 'id'), sdo.height,
  [qudt.unit, unit.CentiM],
  [rdf.value, 'height'],
),
```

Will result in the following linked data assertions:

```ts
product:1
  sdo:height
    [ qudt:unit unit:CentiM;
      rdf:value 15 ].
```

### [Changed] Automatic prefix handling in TriplyDB using [toRdf()](../publish/index.md#local-data-destinations)

Manually specified and standard prefixes are automatically added to TriplyDB when [toRdf()](../publish/index.md#local-data-destinations) is used. The middleware `uploadPrefixes()` is removed.


### [Changed] New approach to prefix handling in TriplyETL

Prefixes are no longer defined as function that concatenates a value to an Iri. The Iri is a new type of Object in TriplyETL, that has a `concat()` method which allows you to add a value to the first part of an Iri. For example:

```ts
const baseIri = Iri('https://example.com/')
const prefixId = baseIri.concat('id/')
const johnDoe = prefixId.concat('john-doe')
```

### [Changed] New package `@triplyetl/vocabularies`

The vocabularies and languages are no longer part of `@triplyetl/etl` package. A new module has been released: `@triplyetl/vocabularies`:

Individual vocabularies like `rdf` and `schema.org` can be imported in the following way:

```ts
import { a, rdf, sdo } from '@triplyetl/vocabularies'
```

To import all vocabularies, use:

```ts
import * as vocab from "@triplyetl/vocabularies"
```

Some vocabularies are too large to include, but they can still be used like this:

```ts
import { aat } from '@triplyetl/etl/vocab'
const moustache = aat.concat('300379271')
```

or

```ts
import { aat } from '@triplyetl/etl/vocab'
addIri({prefix: aat, content: str('300379271'), key: 'moustache'})
```

**To use the RATT `lang` tools**:

Import `languages`:

```ts
import { languages } from '@triplyetl/vocabularies'
```
Import `languages` and `region`:

```ts
import { region, language } from '@triplyetl/vocabularies'

const nl_BE = language.nl.addRegion(region.BE)
```

### [Changed] RDF serialization parsing with 'loadRdf()'

The [loadRdf()](../extract/rdf.md) function is able to parse known RDF serializations (`Turtle`, `TriG`, `N-Triples`, `N-Quads`) provided as a string without specifying mimetype.

```ts
const data = Source.string('...')
loadRdf(data)
```

### [Changed] Extended log and terminal output for ETL debugging
The output of the logfile and terminal output is changed. It contains more information to help users debugging ETL's. The format of time representation is now `H:i:s.u` where:

   -  **H**: 24-hour format of an hour with leading zeros	(00 through 23)
   - **i**: Minutes with leading zeros	(00 to 59)
   - **s**: Seconds with leading zeros (00 through 59)
   - **u**: Microseconds (example: 654321)

### [Changed] [toRdf()](../publish/index.md#local-data-destinations) for account-based token access
The [toRdf()](../publish/index.md#local-data-destinations) middleware now accepts `"me"` as account name based on the token.
Below are some examples of this being used.

```ts
toTriplyDb({account: "me", dataset: "myDataset"})
```
```ts
loadRdf(Source.TriplyDb.rdf("me", datasetName))
```
```ts
Destination.TriplyDb.rdf("me", datasetName)
```



### [Changed] Relocation middleware: `resetStore()` and `randomKey()`
The `resetStore()` middleware is now moved from `ratt` to the `generic` namespace . The `randomKey()` middleware moved from `generic` to `ratt`.

### [Changed] Record selection with `--offset` and `--limit`
 You can now use `--offset` and `--limit` instead of `--from-record-id` and `--head`, e.g. `LIMIT=1 OFFSET=8 npx etl`. The old arguments can still be used for backwards compatibility.

### [Changed] Removal `mapQuads()` middleware
The middleware `mapQuads()` is removed.

### [Changed] Warning for old Node.JS versions
If the users Node.JS version is older that the recommended version (currently \>=18.0.0) a warning is shown.

### [Changed] SHACL Validation Engine
A SHACL Validation Engine improved performance.

### [Changed] Trace for large records
A new flag now bypasses generating the trace for very large records: `---skip-error-trace`. Thus, no trace file is created.

### [Changed] Transition to in-memory engine Speedy
[Comunica](https://comunica.dev) is no longer part of TriplyETL, the in-memory engine is now Triply's Speedy.

### [Changed] Developer notes

Developer notes:
 - Switched from `yarn` to `npm`.
 - Removes some unused packages and types.
 - Most @ts-ignore / @ts-expect-error derictives have been removed and fixed.


### Bug fixes

This release includes the following bug fixes:

- Report which file contains errors when multiple files are used in [fromCsv()](../extract/csv.md), [fromTsv()](../extract/tsv.md) and [fromXml()](../extract/xml.md)  middleware.

- When a WKT point is created with the `addPoint()` function, and the CRS parameter is not specified, the CRS <http://www.opengis.net/def/crs/OGC/1.3/CRS84> is used.

- We can use an API Token from the `.env` file and a TriplyDB instance URL in the function call (e.g. `loadRdf(Source.TriplyDb.rdf('test',{triplyDb:{url:'https://api.triplydb.com'}}))`). An error is thrown if the decoded token information conflicts with the provided arguments.

- Communicate non-success HTTP status codes.

- Adds better metadata in ETL logs:

 - TriplyETL version
 - Node.js version
 - DTAP mode
 - Start date/time
 - End date/time

- Disable support for multiple [Extractors](../extract/index.md).

- Fixes out-of-memory issue when using SHACL validation.



## TriplyETL 2.0.7 through 2.0.19

Release dates: 2023-06-17 through 2023-09-29

### Bug fixes

The following bugs have been fixed:

- Processing an Excel sheet with [fromXml()](../extract/xml.md) would sometimes consume too much memory.
- Several installation issues on Windows have been resolved.
- The `async-saxophone` library for XML processing was adjusted to support the current LTS version of Node.js (v18).



## TriplyETL 2.0.6

Release date: 2023-06-07

### [Added] Support for the PREMIS vocabulary

Support was added for the PREMIS 3.0.0 vocabulary. This vocabulary is published by the Library of Congress and can be used to publish metadata about the preservation of digital objects. See the [PREMIS documentation](https://id.loc.gov/ontologies/premis-3-0-0.html) for more information.

The vocabulary can be imported from the 'vocab' module:

```ts
import { premis } from '@triplyetl/etl/vocab'
```

See the documentation on [external vocabulary declarations](./declarations.md#external-vocabularies) for more information.

### [Added] New debug function logMemory()

A new debug function [logMemory()](./debug.md#function-logmemory) is added. This function prints an overview of the current memory usage of TriplyETL. This allows users to detect fluctuations in memory consumption inside their pipelines.

### [Added] Support for the 'ListIdentifiers' verb in the OAI-PMH extractor

The `fromOai()` extractor already supported the `ListRecords` verb. This release adds support for the [ListIdentifiers](../extract/oai-pmh.md#verb-listidentifiers) verb as well. This new verb allows users to stream through the headers of all records in an OAI-PMH collection, without requiring the full record (i.e. body) to be retrieved.



## TriplyETL 2.0.5

Release date: 2023-05-25

### [Changed] New default engine for SPARQL Construct

The default engine for evaluating SPARQL Construct queries (function [construct()](../enrich/sparql.md#construct)) has changed from Comunica to Speedy. Speedy is a new SPARQL engine that is developed by Triply. Comunica is an open source engine that is developed by the open source community. Since SPARQL is a standardized query language, this change should not cause a difference in behavior for your ETL pipelines.

In the unexpected case where an ETL pipeline *is* negatively affected by this change, the old situation can be restored by explicitly configuring the Comunica engine:

```ts
import { construct } from '@triplyetl/etl/sparql'

construct(Source.TriplyDb.query('my-query'), { sparqlEngine: 'comunica' }),
```

The benefit of switching to the Speedy engine is that this engine is expected to be faster for most queries. Overall, this change will therefore result in speed improvements for your TriplyETL pipelines.

### [Added] New CLI tool for comparing graphs

The new CLI tool [compare](./cli.md#compare) allows graph comparison to be performed from the command-line. This uses the same algorithm that is used by the [compareGraphs()](../validate/graph-comparison.md) validation function.

### Bug fixes

This release includes the following bug fixes:

- [fromXlsx()](../extract/xlsx.md) did not remove trailing whitespace in cell values.
- When a SHACL result was printed, an incorrect message about a faulty SHACL model was shown.
- Some RDF processors did not handle empty RDF inputs correctly.



## TriplyETL 2.0.4

Release date: 2023-05-11


### [Enhanced] Better output for graph comparison

Before this release, when two graphs were not isomorph and their difference consisted of a mapping from blank nodes onto blank nodes exclusively, an empty difference message was communicated.

From this release onwards, the difference message is non-empty, and specifically indicates the difference between the non-isomorphic graphs in terms of the mismatching blank nodes.

Look at [this example](../validate/graph-comparison.md#graph-comparison-failure) from the graph comparison documentation, which emits such a difference message.



## TriplyETL 2.0.3

Release date: 2023-05-10

### Bug fixes

This release includes the following bug fixes:

- Error location information is not shown in TriplyETL Runner.

- Issue when a URL data source (`Source.url()`) includes an HTTP body.



## TriplyETL 2.0.2

Release date: 2023-05-09

### Bug fixes

This release fixes bugs related to the recent switch from CommonJS to ESM:

- Dynamic import bug on Windows.

- Error reporting issues due to ESM imports.



## TriplyETL 2.0.1

Release date: 2023-05-03

### [Added] Timeout flag for TriplyETL Runner

The TriplyETL Runner is the CLI tool that is used to run ETL pipelines. Starting with this version, you can specify a `--timeout` flag when using the TriplyETL Runner.

When the indicated timeout is reached before the pipeline finishes, the TriplyETL Runner will gracefully terminate the ETL by acting as if there are no more incoming records.

See the [TriplyETL Runner documentation page](./cli.md#set-a-timeout) for more information.



## TriplyETL 2.0.0

Release date: 2023-05-01


### [Changed] Modules infrastructure moves from CommonJS to ESM

Before this release, TriplyETL used CommonJS modules to modularize its functionality into different components. Starting in this release, ECMAScript Modules (ESM) are used to modularize TriplyETL functionality into different modules.

ESM is a more modern approach for modularizing ECMAScript (JavaScript, TypeScript, and Node.js) code. While CommonJS imports are evaluated at runtime, ESM imports are evaluated at compile time. TriplyETL users benefit from this change, since error messages related to module imports will be detected much earlier in the development process.

All documentation examples were update to use ESM syntax for module imports, for example:

```ts
import { logRecord } from '@triplyetl/etl/debug'
```

### [Changed] Debug functions move to a new module

Before this release, debug functions like `logRecord()` and `startTrace()` were part of the RATT module. Since debug functions can be used in combination with any ETL configuration approach, they were moved to a new module.

The debug functions are imported from their new module in the following way:

```ts
import { logRecord, traceEnd, traceStart } from '@triplyetl/etl/debug'
```

### [Enhanced] Better error messages when things go wrong

This release introduces a new approach for communicating errors back to the user. When TriplyETL functionality detects an error condition, a unified 'trace middleware' is now used to retrieve information from the environment in which the error occurred. This information is then printed to the error output stream for communication with the user.

### Bug fixes

The following bug fixes are included in this release:

- Incorrect behavior of the [_switch() control function](./control-structures.md#switch-between-different-cases-_switch).

- The [fromOai() extractor](../extract/oai-pmh.md) now communicates clearer when the accessed OAI-PMH endpoint encounters any issues.

- When a key with a NULL value was accessed, the name of that key is now included in the error message. This makes it easier for users to find the NULL value in their source data.



## TriplyETL 1.0.x

TriplyETL 1.0.0 was released on 2023-03-20.
