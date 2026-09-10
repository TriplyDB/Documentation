---
title: 'TriplyDB.js'
path: '/docs/triplydb-js'
---

# TriplyDB.js

**TriplyDB.js** is the official JavaScript and TypeScript client for [TriplyDB](../triply-db-getting-started/index.md). It automates what you would otherwise do by hand in the TriplyDB web interface: creating datasets and loading data into them, managing services, running saved queries, and reading data back.

## Reference documentation

The API reference is **generated from the source code**, so it always matches the released package:

- **[TriplyDB.js API reference](https://static.triply.cc/triplydb-js/)** — every class, method and type, each with examples.
- **[Changelog](https://static.triply.cc/triplydb-js/documents/CHANGELOG.html)** — breaking changes, additions and fixes per release, with the replacement for anything that was removed.

The reference's landing page covers installation and a first script. The pages below cover the things that are not part of the API surface itself.

## Installation

```sh
npm install @triply/triplydb
```

TriplyDB.js requires Node.js 20 or newer. Reading non-public data, and writing any data, requires an [API token](../generics/api-token.md).

## Where to look

| I want to… | Go to |
| --- | --- |
| Connect, and make a first call | [Reference — getting started](https://static.triply.cc/triplydb-js/) |
| Create a dataset, upload data, manage graphs | [`Dataset`](https://static.triply.cc/triplydb-js/classes/Dataset.html) |
| Run a SPARQL query or update directly | [`Dataset.sparqlQuery`](https://static.triply.cc/triplydb-js/classes/Dataset.html#sparqlquery), [`Dataset.sparqlUpdate`](https://static.triply.cc/triplydb-js/classes/Dataset.html#sparqlupdate) |
| Start, synchronise or configure a service | [`Service`](https://static.triply.cc/triplydb-js/classes/Service.html) |
| Run a saved query and read its results | [`Query`](https://static.triply.cc/triplydb-js/classes/Query.html) |
| Work with accounts, users and groups | [`User`](https://static.triply.cc/triplydb-js/classes/User.html), [`Group`](https://static.triply.cc/triplydb-js/classes/Group.html) |
| Retrieve more than one page of query results | [SPARQL pagination](../generics/sparql-pagination.md) |
| Understand async iterators, and other common questions | [FAQ](faq/index.md) |

Please contact [support@triply.cc](mailto:support@triply.cc) for questions and suggestions.
