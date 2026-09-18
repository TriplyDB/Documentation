---
title: "Triply API"
path: "/docs/triply-api"
---

[TOC]

# Triply API

Each Triply instance has a fully RESTful API. All functionality, from managing the Triply instance to working with your data, is available through it.

**The reference documentation is the [TriplyDB OpenAPI specification](https://api.triplydb.com/api-docs).** It is generated from the running instance, so it always matches the deployed version, and it covers every endpoint with its parameters, request and response schemas, and a "try it out" button. It also documents [authentication](https://api.triplydb.com/api-docs), pagination through the `Link` header, and content negotiation.

Each instance serves its own: replace `api.triplydb.com` with the host name of the instance you use. The raw specification is at `/openapi.yaml` on the same host.

This page covers the things that are not part of the endpoint reference: how to get a token, what to use instead of the API for large uploads, and where the conceptual guides live.

Contact [support@triply.cc](mailto:support@triply.cc) for more information.

## Authentication

Reading public data needs no authentication. Writing any data, and reading internal or private data, requires an API token, sent as an HTTP header:

```none
Authorization: Bearer TOKEN
```

### Creating an API token

Follow the [API token guide](../generics/api-token.md), which walks through creating a token in the web interface and choosing its permissions.

Treat a token as a credential: never commit one to a Git repository, never share it with anyone who should not have access to your TriplyDB resources, and replace it periodically — especially if you suspect it has been exposed.

## Uploading data

The API accepts a file directly only up to 5 MB. Above that, an upload becomes a multi-step [tus](https://tus.io/protocols/resumable-upload) flow — see the [Jobs endpoints](https://api.triplydb.com/api-docs) — which you rarely want to implement yourself. Use one of these instead, for both linked data and assets:

1. [TriplyDB.js](https://static.triply.cc/triplydb-js/) — the `importFrom*` and `uploadAsset` methods on [the `Dataset` class](https://static.triply.cc/triplydb-js/classes/Dataset.html).
2. [The TriplyDB Command-line Interface](https://static.triply.cc/cli/).

Both handle resuming, retrying and progress reporting for you.

If neither fits — a language other than JavaScript, or a runtime you cannot add a dependency to — [TriplyDBUploads](https://github.com/TriplyDB/TriplyDBUploads) holds reference implementations of the tus flow in Java and Python: creating the upload job, sending the file in 5 MB chunks, starting the job, and polling until it finishes.

### Graph Store Protocol

The one exception to the 5 MB limit is the [SPARQL 1.1 Graph Store HTTP Protocol](https://www.w3.org/TR/sparql11-http-rdf-update/), which TriplyDB implements at `/datasets/ACCOUNT/DATASET/graph-store`. A `PUT` or `POST` there writes a whole graph in a single request, of any size, and the payload is parsed as it arrives — so a file that turns out to be malformed halfway through is refused without ever being stored. See the Graphs endpoints in the [OpenAPI reference](https://api.triplydb.com/api-docs) for the methods, the graph identification parameters and the response codes.

That single request is also the trade-off: it is not resumable, so a dropped connection takes the upload with it, and nothing reports progress while it runs. Reach for it when a program already speaks the protocol, or for a one-off from the shell:

```sh
curl -H "Authorization: Bearer TRIPLYDB_TOKEN" \
  -H "Content-Type: text/turtle" \
  -X PUT "https://api.triplydb.com/datasets/ACCOUNT/DATASET/graph-store?graph=https%3A%2F%2Fexample.org%2Fgraph" \
  --data-binary @data.ttl
```

Prefer TriplyDB.js or the command-line interface for anything large or unattended.

## SPARQL

TriplyDB implements the [SPARQL 1.1 Query Protocol](https://www.w3.org/TR/sparql11-protocol/). See the [SPARQL endpoints](https://api.triplydb.com/api-docs) for the ways a query can be sent and the result formats each endpoint returns.

Everybody who has access to a dataset also has access to its services, including its SPARQL services:

- For *public* datasets, everybody on the Internet or intranet can issue queries.
- For *internal* datasets, only users that are logged in can issue queries.
- For *private* datasets, only logged-in users who are members of the owning account can issue queries.

For professional use, prefer [saved queries](../triply-db-getting-started/saved-queries/index.md) over ad-hoc requests. Saved queries have persistent URLs, descriptive metadata, versioning, and a `run` endpoint that supports [reliable large-scale pagination](../generics/sparql-pagination.md).

## GraphQL

Some TriplyDB instances publish a GraphQL endpoint for every dataset, whose schema is generated from user-provided SHACL shapes. See the [GraphQL implementation guide](../generics/Graphql.md) for how the schema is derived, and for queries, filtering and pagination.

## Elasticsearch

The text search API returns linked data entities matching a text string, matched against the literals and IRIs in each entity's description. It is available for a dataset only once an Elasticsearch service has been created for it.

Two kinds of search are possible. A *simple* search takes a single term and builds a fuzzy query from it. A *custom* search accepts a JSON body conforming to [the Elasticsearch query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html). See the [Search endpoints](https://api.triplydb.com/api-docs) for both.

### Setting up index templates

By default the service indexes every literal with Elasticsearch's own defaults. [Index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html) and [component templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-component-template.html) let you say more than that — for example that a property holds a date, so that it can be sorted or used in a range query.

Templates are passed in `config` when the service is created, and are read only then: changing one means creating the service again. Three constraints are specific to TriplyDB:

- The service builds a single index named `index`, so every index template must have `"index_patterns": "index"`. A template matching anything else is silently unused.
- A component template only takes effect once an index template names it in `composed_of`, so the two are always created together.
- A property's field name is its IRI with every `.` replaced by a space, because Elasticsearch reads a dot in a field name as a path separator. Write mappings that way, and expect hits that way.

The example below maps `https://schema.org/dateCreated` to a date:

```sh
curl -H "Authorization: Bearer TRIPLYDB_TOKEN" -H "Content-Type: application/json" \
  -X POST "https://api.INSTANCE/datasets/ACCOUNT/DATASET/services" \
  -d '{
    "type": "elasticSearch",
    "name": "SERVICE_NAME",
    "config": {
      "indexTemplates": [
        { "name": "my-template", "index_patterns": "index", "composed_of": ["dates"] }
      ],
      "componentTemplates": [
        { "name": "dates",
          "template": { "mappings": { "properties": { "https://schema org/dateCreated": { "type": "date" } } } } }
      ]
    }
  }'
```

The equivalent in TriplyDB.js is [`Dataset.addService`](https://static.triply.cc/triplydb-js/classes/Dataset.html#addservice).

## Related guides

- [API token](../generics/api-token.md) — creating a token and choosing its permissions.
- [SPARQL pagination](../generics/sparql-pagination.md) — retrieving result sets larger than one page.
- [GraphQL](../generics/Graphql.md) — how the schema is generated from SHACL shapes.
- [JSON-LD framing](../generics/JSON-LD-frames.md) — shaping JSON-LD output.
- [Saved queries](../triply-db-getting-started/saved-queries/index.md) — saving, versioning and sharing a query, and using it as a RESTful API.
- [TriplyDB.js](https://static.triply.cc/triplydb-js/) — the JavaScript and TypeScript client.
