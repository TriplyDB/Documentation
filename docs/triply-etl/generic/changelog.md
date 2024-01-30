[TOC]

# Changelog

The current version of TriplyETL is **3.1.0**

You can use this changelog to perform a safe update from an older version of TriplyETL to a newer one. See the documentation for [Upgrading TriplyETL repositories](./maintenance.md#update-the-triplyetl-dependency) for the advised approach, and how the changelog factors into that.

## TriplyETL 4.0.0

Release date: 2024-01-29

### [Changed] IRI-related middlewares no longer use skolem URLs

The following middlewares: `addHashedIri()`, `addIri()`, `addRandomIri()`, would no longer allow users to create URLs that have pathnames start with "/.well-known/genid/", since they would be consideres skolemised URLs.

### [Changed] `fromShapeFile()` is now called `fromShapefile()`

The format is called ESRI Shapefile, hence our extractor function's name had to be changed from `fromShapeFile()` to `fromShapefile()`.

### [Removed] Function `addRandomIri()` 

Since function `addRandomIri()` does not add anything beyond `addSkolemIri()`, the function has been removed from the TriplyETL library. Random IRIs should be skolem IRIs that can be readily replaced by blank nodes. 

### [Added] New variables added to ETL

New flag has been introduced when constructing an ETL: 

```ts
  /**
   * Timeout ETL after set duration in milliseconds
   */
  timeout: number;

  /**
   * If set to TRUE, the ETL will do a hard exit, preventing uploads to TDB on timeouts
   */
  exitOnTimeout: boolean;
```

which can be set as following:

```ts
 const etl = new Etl({timeout: 1000, exitOnTimeout: true})
```
This will cause a hard exit when a timeout occurs and nothing will be executed after this timeout.

## TriplyETL 3.1.0 && 3.1.1

Release date: 2024-01-15 && 2024-01-17

## [Deprecated] Deprecated `fromShapeFile()` for `fromShapefile()`

## [Deprecated] Deprecated `addRandomIri()` function. 

Function `addRandomIri()` does not add anything beyond `addSkolemIri()`. Random IRIs should be skolem IRIs that can be readily replaced by blank nodes.

## [Enhanced] Improved SHACL report.

When a SHACL shape is used to validate data does by itself not conform to the SHACL-SHACL shape, the report of that non-conforming shape is now printed.

## [Enhanced] Improved `objects()` function

The `objects()` middleware now requires a minimum of 2 objects, deviating from its previous behavior, which was limited to functionality similar to the `triple()` function.

## [Enhanced] RML middleware

RML `map()` middleware now allows a string Source and a string primitive as input.

## [Enhanced] Static vocabularies

With the latest update, TriplyETL vocabularies are now represented as `Vocabulary` objects, replacing the previous usage of objects with the type `IRI`. This change may necessitate adjustments to existing ETLs that utilize static vocabularies, such as `aat`. In this case, the vocabulary would need to be updated to `aat.toIri()` to ensure compatibility with the correct type.

## [Enhanced] NPM packages

All NPM packages are up to date with their latest version.

## [Fixed] Base IRI when using `loadRdf()`

There were some inconsistency between the expected base IRI. For example, the following snippet:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, loadRdf, Source } from '@triplyetl/etl/generic'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    loadRdf(Source.string('<s><p><o>.')),
    logQuads(),
  )
  return etl
}
```

would result in:

```ttl
<https://triplydb.com/graph/default> {
<https://triplydb.com/graph/s> <https://triplydb.com/graph/p> <https://triplydb.com/graph/o>
}
```

rather than:

```ttl
<https://triplydb.com/graph/default> {
<https://triplydb.com/s> <https://triplydb.com/p> <https://triplydb.com/o>
}
```

This issue has been fixed.

### [Fixed] String encoding for IRIs

It is now possible to check whether a value of a key used to create an IRI contains valid characters. 
A previous warning incorrectly flagged a space (' ') as an invalid character in the IRI, but that has been taken care of that. Now, when you run the script, you won't encounter the misleading warning, providing a more accurate and hassle-free execution. 

In this case, [1] is resulting in [2] instead of invalid [3]:

```
[1] a b
[2] http://ex.com/a%20b
[3] http://ex.com/ a b
```
 
As well as [4] being encoded as [5]:

```
[4] a&b
[5] a&amp;b
```

Or [6] can be legitimately encoded in CSV using [7]:
```
[6] a,b
[7] "a,b"
```

### [Fixed] New datatype added to `addPoint()` middleware

Datatype `wktLiteral` has been added to the `addPoint()` middleware.




## TriplyETL 3.0.20

Release date: 2024-01-04

###  [Enhanced] Improved `copySource()` function

Function etl.copySource() accepts the same destination format as toTriplyDB(), so that the same destination does not need to be specified twice.

###  [Enhanced] Prefix uploading

Prefixes are no longer uploaded by default, only explicit prefixes that are defined when constructing an ETL with `new Etl({ prefixes })`.



## TriplyETL 3.0.15 through 3.0.18

Release date: 2023-12-07 through 2023-12-28


### [Enhanced] RDF compression before upload

It is now possible to enable compression of RDF data before being uploaded to TriplyDB. See the [toRdf()](../publish/index.md) function for more information.


### [Enhanced] Skolem IRI prefix use

TriplyETL now emits an error when a Skolem IRI prefix is used with [addHashedIri()](../transform/ratt.md#addhashediri).


### Bug fixes

This release provides bug fixes to XSLT support (see [XSLT Transformations](../transform/xslt.md) and [XSLT Assertions](../assert/xslt.md)).



## TriplyETL 3.0.14

Release date: 2023-12-04


### [Added] Support for RML

This release introduces support for the RML transformation and assertion language. RML is an ETL configuration language that has gained traction in the linked data community over the last couple of years. See the following pages for more information:

- [RML Transformations](../transform/rml.md)
- [RML Assertions](../assert/rml.md)


### [Build] Environments beyond the DTAP defaults

It is now possible to extend the standard environments offered by TriplyETL.


### Bug fixes

This release fixes a URL/request-related error in the [fromOai](../extract/oai-pmh.md) extractor.



## TriplyETL 3.0.7 through 3.0.9

Release date: 2023-11-29


### [Added] CLI flag to skip version check

Introduced the cli flag `--skip-version-check` because some users can not use remote connections because of security policies.


### [Added] Support for JPath expressions

`toJson()` middleware now uses path selectors just as `fromXml()`, but also JPath expressions.


### [Added] Authentication for the OAI-PMH extractor

`fromOai()` now accepts a [`Request` object](https://developer.mozilla.org/en-US/docs/Web/API/Request) as the value for the `url` option, allowing more fine graded use of the HTTP request (including authentication information).


### [Added] XSLT support for the OAI-PMH extractor

`fromOai()` now accepts an optional parameter `stylesheet`. The argument must be an object with 1 required key `source` pointing to the source of the stylesheet and 1 optional argument `yieldsRdf`. When provided the XSL Stylesheet `source` is processed using the OAI response. The result of the transformation must still be a valid OAI response.


### Bug fixes

Fixes issue where keys that are used for internal administration were shown in logged records, after using the `ifElse()` and `switch()` control structures.



## TriplyETL 3.0.6

Release date: 2023-11-14


### Bug fixes

This release fixes issues with upstream packages that contained breaking changes.



## TriplyETL 3.0.5

Release date: 2023-11-09


### Bug fixes

The progress bar would sometimes terminate at 99% or 101%, instead of the expected 100%.



## TriplyETL 3.0.4

Release date: 2023-11-07


### [Added] Dataset metadata specification

It is now possible to use metadata when creating datasets. If a new dataset is created then the metadata is always used, for existing datasets you can choose to ignore, merge or replace existing metadata. This feature is to prevent ETLs accidentally overwriting metadata might have changed in the UI/Dashboard of their TriplyDB instance.

The following options are available for this new feature in the `opts.existingMetadata` parameter:

- `ignore`: no metadata will be changed even if no metadata is present for this dataset (this is the default value)
- `merge`: only properties that have no value will be overwritten bij the provided metadata
- `replace`: all existing metadata will be replaced, even if the provided metadata contains empty keys


### [CLI] Reverse logic for creating error traces

Before this release, running an ETL would always create an error trace file. It was possible to disable this behavior with CLI flag `--skip-error-trace`. Starting in this release, the error trace file is no longer created by default, and a newly added CLI flag `--create-error-trace` must now be specified in order ot create the error trace file.


### Bug fixes

The following bugs were fixed:

- The number of synchronized services was not always reported correctly in CLI output.
- A package we depend on introduced a breaking change causing a function not to be there anymore.



## TriplyETL 3.0.3

Release date: 2023-11-01


## [Changed] Support for the NDE Dataset Register

The code to submit datasets to the [NDE Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl) has been moved to TriplyDB-JS. The way to publish a dataset now is to add an option to the `toTriplyDb()` function: `{ submitToNDEDatasetRegister: true }`.

Example:

```ts
toTriplyDb({dataset: 'nde', opts: {submitToNDEDatasetRegister: true}})
```



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

You can now assert so called "static triples": triples that are not related to the source extractors but should only be asserted once per ETL.


### Bug fixes

There was an error in the [ifElse()](./control-structures.md#specify-multiple-conditions-ifelse) control structure, that caused ETLs to not use the fallback 'else' block in some situations.



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
- Some XSLT transformations failed on Windows, because of incorrect redirecting of error messages.



## TriplyETL 3.0.0

Release date: 2023-10-12


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

The [nestedPairs()](../assert/ratt/statements.md#nestedpairs) middleware can be used without providing the subject node that connects the pairs to the object/predicate. This will automatically create a Skolem IRI for the subject:

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


### [Changed] Automatic prefix handling in TriplyDB using 'toRdf()'

Manually specified and standard prefixes are automatically added to TriplyDB when [toRdf()](../publish/index.md#local-data-destinations) is used. The middleware `uploadPrefixes()` is removed.


### [Changed] New approach to prefix handling in TriplyETL

Prefixes are no longer defined as function that concatenates a value to an Iri. The Iri is a new type of Object in TriplyETL, that has a `concat()` method which allows you to add a value to the first part of an Iri. For example:

```ts
const baseIri = Iri('https://example.com/')
const prefixId = baseIri.concat('id/')
const johnDoe = prefixId.concat('john-doe')
```


### [Changed] New package '@triplyetl/vocabularies'

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
import { aat } from '@triplyetl/vocabularies'
const moustache = aat.concat('300379271')
```

or

```ts
import { aat } from '@triplyetl/vocabularies'
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

   - **H**: 24-hour format of an hour with leading zeros	(00 through 23)
   - **i**: Minutes with leading zeros	(00 to 59)
   - **s**: Seconds with leading zeros (00 through 59)
   - **u**: Microseconds (example: 654321)


### [Changed] 'toRdf()' for account-based token access

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


### [Changed] Relocation middleware: 'resetStore()' and 'randomKey()'

The `resetStore()` middleware is now moved from `ratt` to the `generic` namespace . The `randomKey()` middleware moved from `generic` to `ratt`.


### [Changed] Record selection with '--offset' and '--limit'

 You can now use `--offset` and `--limit` instead of `--from-record-id` and `--head`, e.g. `LIMIT=1 OFFSET=8 npx etl`. The old arguments can still be used for backwards compatibility.


### [Changed] Removal of 'mapQuads()'

The `mapQuads()` function was removed.


### [Changed] Warning for old Node.JS versions

If the users Node.JS version is older that the recommended version (currently \>=18.0.0) a warning is shown.


### [Changed] SHACL Validation Engine

A SHACL Validation Engine improved performance.


### [Changed] Trace for large records

A new flag now bypasses generating the trace for very large records: `---skip-error-trace`. Thus, no trace file is created.


### [Changed] Transition to in-memory engine Speedy

[Comunica](https://comunica.dev) is no longer part of TriplyETL, the in-memory engine is now Triply's Speedy.


### [Enhanced] Improvements to ETL logs

The logging format was improved by including the following information:

- the TriplyETL version
- the Node.js version
- the [DTAP](./maintenance.md#dtap-configuration) mode
- the start date and time
- the end date and time


### [Enhanced] Prevent using multiple extractors

TriplyETL only supports one [extractor](../extract/index.md) per ETL configuration object. In the past, it was possible to use multiple extractors, which would result in faulty behavior during ETL runs. Starting in this release, TriplyETL will emit an error when multiple extractors are used.


### [Enhanced] Better error reporting for CSV, TSV, and XML sources.

In previous releases, the extractor functions [fromCsv()](../extract/csv.md), [fromTsv()](../extract/tsv.md), and [fromXml()](../extract/xml.md) would not emit the file name in case an error occurred. This was specifically problematic when a large number of data source files were used. Starting in this release, the file name is included in error message.


## [Enhanced] Default CRS for 'wkt.addPoint()'

In previous releases, the Coordinate Reference System (CRS) was a required attribute for transformation function [wkt.addPoint()](../transform/ratt.md#wkt-addpoint). Starting in this release, the CRS argument has become optional. When not specified, the default CRS <http://www.opengis.net/def/crs/OGC/1.3/CRS84> is used.


### [Enhanced] Handle conflicting TriplyDB instance specifications

In previous releases, it was possible to introduce an ambiguity in specify the TriplyDB instance to publish data to. This was possible by (1) specifying a TriplyDB API Token in the environment (e.g. though an `.env` file), and (2) by configuring the `triplyDb` option in the [loadRdf()](../extract/rdf.md) function. Starting in this release, TriplyETL will emit an error if the TriplyDB instance in the API Token differs from the TriplyDB instance configured in the `triplyDb` option.


### [Enhanced] More information for failing HTTP calls

In previous releases, when a failing HTTP call resulted in an error message, only the body of that HTTP call would be included in the error message. Starting in this release, the HTTP status code of the failing HTTP call is included in the error message as well.


### Bug fixes

This release fixes several out-of-memory bugs in the [SHACL validation function](../validate/index.md).



## TriplyETL 2.0.7 through 2.0.19

Release dates: 2023-06-17 through 2023-09-29

### Bug fixes

The following bugs were fixed:

- Processing an Excel sheet with [fromXml()](../extract/xml.md) would sometimes consume too much memory.
- Several installation issues on Windows have been resolved.
- The `async-saxophone` library for XML processing was adjusted to support the current LTS version of Node.js (v18).



## TriplyETL 2.0.6

Release date: 2023-06-07


### [Added] Support for the PREMIS vocabulary

Support was added for the PREMIS 3.0.0 vocabulary. This vocabulary is published by the Library of Congress and can be used to publish metadata about the preservation of digital objects. See the [PREMIS documentation](https://id.loc.gov/ontologies/premis-3-0-0.html) for more information.

The vocabulary can be imported from the 'vocab' module:

```ts
import { premis } from '@triplyetl/vocabularies'
```

See the documentation on [external vocabulary declarations](./declarations.md#external-vocabularies) for more information.


### [Added] New debug function logMemory()

A new debug function [logMemory()](./debug.md#logmemory) is added. This function prints an overview of the current memory usage of TriplyETL. This allows users to detect fluctuations in memory consumption inside their pipelines.


### [Added] Support for the 'ListIdentifiers' verb in the OAI-PMH extractor

The [fromOai()](../extract/oai-pmh.md) extractor already supported the `ListRecords` verb. This release adds support for the [ListIdentifiers](../extract/oai-pmh.md#verb-listidentifiers) verb as well. This new verb allows users to stream through the headers of all records in an OAI-PMH collection, without requiring the full record (i.e. body) to be retrieved.



## TriplyETL 2.0.5

Release date: 2023-05-25


### [Changed] New default engine for SPARQL Construct

The default engine for evaluating SPARQL Construct queries (function [construct()](../enrich/sparql/construct.md)) has changed from Comunica to Speedy. Speedy is a new SPARQL engine that is developed by Triply. Comunica is an open source engine that is developed by the open source community. Since SPARQL is a standardized query language, this change should not cause a difference in behavior for your ETL pipelines.

In the unexpected case where an ETL pipeline *is* negatively affected by this change, the old situation can be restored by explicitly configuring the Comunica engine:

```ts
import { construct } from '@triplyetl/etl/sparql'

construct(Source.TriplyDb.query('my-query'), { sparqlEngine: 'comunica' }),
```

The benefit of switching to the Speedy engine is that this engine is expected to be faster for most queries. Overall, this change will therefore result in speed improvements for your TriplyETL pipelines.


### [Added] New CLI tool for comparing graphs

The new CLI tool [compare](./cli.md#compare) allows graph comparison to be performed from the command-line. This uses the same algorithm that is used by the [compareGraphs()](../validate/graph-comparison.md) validation function.


### Bug fixes

This release fixes the following bugs:

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
