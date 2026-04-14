---
title: "Triply API"
path: "/docs/triply-api"
---

[TOC]

# Triply API

Each Triply instance has a fully RESTful API. All functionality, from managing
the Triply instance to working with your data, is done through the API. This
document describes the general setup of the API, contact
[support@triply.cc](mailto:support@triply.cc) for more information.

For a complete, interactive API reference with all endpoints, request/response schemas, and try-it-out functionality, see the **[TriplyDB OpenAPI documentation](https://api.triplydb.com/api-docs)**. This page provides guides, conceptual explanations, and documentation for features not covered by the OpenAPI specification.

## Authentication

When a dataset is published publicly, most of the read operation on
that dataset can be performed without authentication.

Write operations and read operations on datasets that are published
internally or privately require authentication.

### Creating an API token

Authentication is implemented through API tokens. Follow the steps in the [API Token guide](../generics/api-token.md) to create a new API token in the TriplyDB UI.

### Using the API token

API tokens are used by specifying them in an HTTP request header as
follows:

```none
Authorization: Bearer TOKEN
```

In the above, `TOKEN` should be replaced by your personal API token (a
lengthy sequence of characters). See [Creating an API token](#creating-an-api-token) for
information on how to create an API token.

### Important Security Considerations

- **Do Not Commit Your Token to a Git Repository**: Under no circumstances should you commit your TriplyDB token to a Git repository. This practice is not allowed according to our ISO standards.

- **Do Not Share Your Token: Avoid sharing your TriplyDB token with anyone who should not have access to your TriplyDB resources**. Tokens should be treated as sensitive information and shared only with trusted parties.

- **Change Tokens Regularly**: To enhance security, consider regularly generating a new token to replace the existing one especially if you suspect any compromise.

## Exporting linked data

Every TriplyDB API path that returns linked data provides a number of serializations to choose from. We support the following serializations:

| Serialization                                       | Media type              | File extension |
| --------------------------------------------------- | ----------------------- | -------------- |
| [TriG](https://www.w3.org/TR/trig/)                 | `application/trig`      | `.trig`        |
| [N-Triples](https://www.w3.org/TR/n-triples/)       | `application/n-triples` | `.nt`          |
| [N-Quads](https://www.w3.org/TR/n-quads/)           | `application/n-quads`   | `.nq`          |
| [Turtle](https://www.w3.org/TR/turtle/)             | `text/turtle`           | `.ttl`         |
| [JSON-LD](https://json-ld.org/spec/latest/json-ld/) | `application/ld+json`   | `.jsonld`      |

To request a serialization, use one of the following mechanisms:

1. Add an `Accept` header to the request. E.g. `Accept: application/n-triples`
2. Add the extension to the URL path. E.g. https://api.triplydb.com/datasets/Triply/iris/download.nt



## Datasets

Triply API requests are always directed towards a specific URI path. URI paths will often have the following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/
```

Upper-case letter words must be replaced by the following values:

- `INSTANCE` :: The host name of the TriplyDB instance that you want to use.
- `ACCOUNT` :: The name of a specific user or a specific organization.
- `DATASET` :: The name of a specific dataset.

Here is an example of a URI path that points to the Triply API for the Pokémon dataset:

```none
https://api.triplydb.com/datasets/academy/pokemon/
```

### Create a dataset

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Datasets) for creating and managing datasets via the API.

### Upload linked data

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Jobs) for uploading linked data. Note: the simple upload API route only supports uploads less than 5MB. To upload more data, use:

1. [TriplyDB-JS](../triplydb-js/index.md): See the `importFrom*` methods under [the `Dataset` class](../triplydb-js/dataset/index.md).
2. [TriplyDB Command-line Interface](../triply-cli/index.md)

### Upload assets

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Assets) for uploading and managing assets. Note: the simple upload API route only supports uploads less than 5MB. To upload more data, use:

1. [TriplyDB-JS](../triplydb-js/index.md): See the `uploadAsset` methods under [the `Dataset` class](../triplydb-js/dataset/index.md).
2. [TriplyDB Command-line Interface](../triply-cli/index.md)

## Accounts

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Accounts) for account management endpoints.



## Queries

TriplyDB allows users to save SPARQL queries. The metadata for all saved query can be accessed as follows:

```none
https://api.triplydb.com/queries
```

By adding an account name (for example: 'Triply'), metadata for all saved queries for that account can be accessed as follows:

```none
https://api.triplydb.com/queries/Triply
```

By adding an account name and a query name (for example: 'Triply/flower-length'), metadata for one specific saved query can be accessed as follows:

```none
https://api.triplydb.com/queries/Triply/flower-length
```

### Query metadata (GRLC)

You can retrieve a text-based version of each query, by requesting the `text/plain` content type:

```sh
curl -vL -H 'Accept: text/plain' 'https://api.triplydb.com/queries/JD/pokemonNetwork'
```

This returns the query string, together with metadata annotations. These metadata annotations use the [GRLC format](https://github.com/CLARIAH/grlc). For example:


```sparql
#+ description: This query shows a small subgraph from the Pokemon dataset.
#+ endpoint: https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
#+ endpoint_in_url: false
construct where { ?s ?p ?o. }
limit 100
```

Notice that the GRLC annotations are encoded in SPARQL comments, i.e. lines that start with the hash character (`#`). This makes the result immediately usable as a SPARQL query.

The above example includes the following GRLC annotations:

- `description` gives a human-readable description of the meaning of the query. This typically includes an explanation of the purpose or goal for which this query is used, the content returned, or the process or task in which this query is used.
- `endpoint` The URL of the SPARQL endpoint where queries are sent to.
- `endpoint_in_url` configures whether the URL of the SPARQL endpoint should be specified through the API. In TriplyDB, this configuration is by default set to `false`. (Users of the RESTful API typically expect domain parameters such as `countryName` or `maximumAge`, but they do not necessarily expect technical parameters like an endpoint URL.)



## LD Browser API

Triply APIs provide a convenient way to access data used by [LD Browser](../triply-db-getting-started/viewing-data/index.md#linked-data-browser), which offers a comprehensive overview of a specific IRI. By using Triply API for a specific IRI, you can retrieve the associated 'document' in the `.nt` format that describes the IRI.

To make an API request for a specific instance, you can use the following URI path:

```iri
https://api.triplydb.com/datasets/ACCOUNT/DATASET/describe.nt?resource=RESOURCE
```

To illustrate this, let's take the example of the DBpedia dataset and the [specific instance of 'Mona Lisa'](https://triplydb.com/DBpedia-association/dbpedia/browser?resource=http%3A%2F%2Fdbpedia.org%2Fresource%2FMona_Lisa). If you use this URI path:

```iri
https://api.triplydb.com/datasets/DBpedia-association/dbpedia/describe.nt?resource=http%3A%2F%2Fdbpedia.org%2Fresource%2FMona_Lisa
```

In your browser, the `.nt` document describing the 'Mona Lisa' instance will be automatically downloaded. You can then upload this file to a dataset and [visualize it in a graph](../yasgui/index.md#network-triplydb-plugin). Figure 1 illustrates the retrieved graph for the ‘Mona Lisa’ instance.

![Figure 1](../assets/MonaLisaGraph.png)

The requested resource will be displayed in the center of the graph, forming an 'ego graph'. It will include all direct properties, as well as some indirect properties that are also pulled in by LD Browser. The labels for all classes and properties will be included for easy human-readable display.

In addition, this API also supports traversing blank node-replacing well-known IRIs (CBD style), and limits the number of objects per subject/property to manage the description size. This corresponds to the "Show more" button in the LD Browser GUI, ensuring a manageable and user-friendly experience.



## Triple Pattern Fragments (TPF)

Triple Pattern Fragments (TPF) is a community standard that allows individual linked datasets to be queried for Triple Patterns (TP), a subset of the more complex SPARQL query language. The Triply API implements [Triple Pattern Fragments](http://www.hydra-cg.com/spec/latest/triple-pattern-fragments/) version 2019-01-18 and [Linked Data Fragments](http://www.hydra-cg.com/spec/latest/linked-data-fragments/) version 2016-06-05.

The Triple Pattern Fragments (TPF) API is available for all datasets in Triply and does not require running a dedicated service.


### URI path

TPF requests are sent to the following URI path:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/fragments
```


### Reply format

Since TPF replies distinguish between data and metadata that are stored in different graphs, it is recommended to request the TriG content type with the following HTTP request header:

```http
Accept: application/trig
```

#### Query parameters

Triple Pattern Fragments (TPF) uses the following query parameters in order to retrieve only those triples that adhere to a specified Triple Pattern:

| _Key_       | _Value_                       | _Purpose_                                                                          |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `subject`   | A URL-encoded IRI.           | Only return triples where the given IRI appears in the subject position.          |
| `predicate` | A URL-encoded IRI.           | Only return triples where the given IRI appears in the predicate position.        |
| `object`    | A URL-encoded IRI or literal. | Only return triples where the given IRI or literal appears in the object position. |

#### Example request

```sh
curl -G \
       'https://api.triplydb.com/datasets/academy/pokemon/fragments' \
       --data-urlencode 'predicate=http://www.w3.org/2000/01/rdf-schema#label' \
       -H 'Accept: application/trig'
```


### Exporting data

To export the linked data, use the following path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/download
```

#### Query parameters

By default, an export includes all linked data graphs. Use a query argument to specify a particular graph.

| _Key_       | _Value_                       | _Purpose_                                                                          |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `graph`   | A URL-encoded IRI.           | Only download the export of the given graph IRI.          |

Therefore, to export the linked data of a **graph**, use the following path:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/download/?graph=GRAPH
```

To find out which graphs are available, use the following path:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/graphs
```

#### Example requests

Export a dataset:

```sh
curl 'https://api.triplydb.com/datasets/academy/pokemon/download' \
       -H 'Accept: application/trig' > exportDataset.trig.gz
```

Export a graph:

First, find out which graphs are available:

```sh
curl 'https://api.triplydb.com/datasets/academy/pokemon/graphs'
```

Then, download one of the graph:

```sh
curl 'curl 'https://api.triplydb.com/datasets/academy/pokemon/download?graph=https://triplydb.com/academy/pokemon/graphs/data' -H 'Accept: application/trig' > exportGraph.trig.gz
```



## Services

Some API requests require the availability of a specific service over the dataset. These requests are directed towards a URI path of the following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/
```

Upper-case letter words must be replaced by the following values:

- `SERVICE` :: The name of a specific service that has been started for the corresponding dataset.

- See the previous section for [Datasets](#datasets) to learn the meaning of `INSTANCE`, `ACCOUNT`, and `DATASET`.

Here is an example of a URI path that points to a SPARQL endpoint over the Pokémon dataset:

```none
https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/
```

See the following sections for more information on how to query the endpoints provided by services:

- [SPARQL](#sparql)

- [Elasticsearch](#elasticsearch)

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Services) for creating, synchronizing, and managing services.


## SPARQL

There are two service types in TriplyDB that expose the SPARQL 1.1 Query Language: "Sparql" and "Jena". The former works well for large quantities of instance data with a relatively small data model; the latter works well for smaller quantities of data with a richer data model.

SPARQL services expose a generic endpoint URI at the following location (where `ACCOUNT`, `DATASET` and `SERVICE` are user-chosen names):

```none
https://api.triplydb.com/datasets/ACCOUNT/DATASET/services/SERVICE/sparql
```

Everybody who has access to the dataset also has access to its services, including its SPARQL services:
- For *Public* datasets, everybody on the Internet or Intranet can issue queries.
- For *Internal* datasets, only users that are logged into the triple store can issue queries.
- For *Private* datasets, only users that are logged into the triple store and are members of `ACCOUNT` can issue queries.

Notice that for professional use it is easier and better to use [saved queries](../triply-db-getting-started/saved-queries/index.md#saved-queries). Saved queries have persistent URIs, descriptive metadata, versioning, and support for reliable large-scale pagination ([see how to use pagination with saved query API](../triply-db-getting-started/saved-queries/index.md#pagination-with-the-saved-query-api)). Still, if you do not have a saved query at your disposal and want to perform a custom SPARQL request against an accessible endpoint, you can do so. TriplyDB implements the SPARQL 1.1 Query Protocol standard for this purpose.

### Sending a SPARQL Query request

According to the SPARQL 1.1 Protocol, queries can be send in the 3 different ways that are displayed in [Table 1](#table-http-sparql-query). For small query strings it is possible to send an HTTP GET request (row 1 in [Table 1](#table-http-sparql-query)). A benefit of this approach is that all information is stored in one URI. For public data, copy/pasting this URI in a web browser runs the query. For larger query strings it is required to send an HTTP POST request (rows 2 and 3 in [Table 1](#table-http-sparql-query)). The reason for this is that longer query strings result in longer URIs when following the HTTP GET approach. Some applications do not support longer URIs, or they even silently truncate them resulting in an error down the line. The direct POST approach (row 3 in [Table 1](#table-http-sparql-query)) is the best of these 3 variants, since it most clearly communicates that it is sending a SPARQL query request (see the `Content-Type` column).

<figure id='table-http-sparql-query'>
  <table>
    <thead>
      <tr>
        <th></th>
        <th>HTTP Method</th>
        <th>Query String Parameters</th>
        <th>Request <code>Content-Type</code></th>
        <th>Request Message Body</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>query via GET</th>
        <td>GET</td>
        <td><code>query</code> (exactly 1)<br><code>default-graph-uri</code> (0 or more)<br><code>named-graph-uri</code> (0 or more)</td>
        <td>none</td>
        <td>none</td>
      </tr>
      <tr>
        <th>query via URL-encoded POST</th>
        <td>POST</td>
        <td>none</td>
        <td><code>application/x-www-form-urlencoded</code></td>
        <td>URL-encoded, ampersand-separated query parameters.<br><code>query</code> (exactly 1)<br><code>default-graph-uri</code> (0 or more)<br><code>named-graph-uri</code> (0 or more)</td>
      </tr>
      <tr>
        <th>query via POST directly</th>
        <td>POST</td>
        <td><code>default-graph-uri</code> (0 or more)<br><code>named-graph-uri</code> (0 or more)</td>
        <td><code>application/sparql-query</code></td>
        <td>Unencoded SPARQL query string</td>
      </tr>
    </tbody>
  </table>
  <figcaption>Table 1 - Overview of the three different ways in which SPARQL queries can be issues over HTTP.</figcaption>
</figure>

### SPARQL Query result formats

SPARQL services are able to return results in different formats. The user can specify the preferred format by specifying the corresponding Media Type in the HTTP `Accept` header. TriplyDB supports the Media Types in the following table. Notice that the chosen result format must be supported for your query form. Alternatively, it is possible to specify the requested format as a URI path suffix (e.g., `/sparql.csv`).

| Result format | Media Type                        | Query forms         | Suffix    |
| ------------- | --------------------------------- | ------------------- | --------- |
| CSV           | `text/csv`                        | Select              | `.csv`    |
| JSON          | `application/json`                | Ask, Select         | `.json`   |
| JSON-LD       | `application/ld+json`             | Construct, Describe | `.jsonld` |
| N-Quads       | `application/n-quads`             | Construct, Describe | `.nq`     |
| N-Triples     | `application/n-triples`           | Construct, Describe | `.nt`     |
| SPARQL JSON   | `application/sparql-results+json` | Ask, Select         | `.srj`    |
| SPARQL XML    | `application/sparql-results+xml`  | Ask, Select         | `.srx`    |
| TriG          | `application/trig`                | Construct, Describe | `.trig`   |
| TSV           | `text/tab-separated-values`       | Select              | `.tsv`    |
| Turtle        | `text/turtle`                     | Construct, Describe | `.ttl`    |

For interactive examples of SPARQL requests and responses in all supported formats, see the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/SPARQL).

For professional use, consider using [saved queries](../triply-db-getting-started/saved-queries/index.md), which support [pagination](../generics/sparql-pagination.md) for large result sets.

## GraphQL

Some TriplyDB instances publish a GraphQL endpoint for every dataset. This endpoint uses information from user-provided SHACL shapes to generate the GraphQL schema.

See the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/GraphQL) for endpoint reference, and the [GraphQL implementation guide](../generics/Graphql.md) for details on schema generation from SHACL shapes, queries, filtering, and pagination.


## Elasticsearch

The text search API returns a list of linked data entities based on a supplied text string. The text string is matched against the text in literals and IRIs that appear in the linked data description of the returned entities.

The text search API is only available for a dataset after an Elasticsearch service has been created for that dataset.

Two types of searches can be performed: a simple search, and a custom search. Simple searches require one search term for a fuzzy match. Custom searches accept a JSON object conforming to [the Elasticsearch query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

### URI path

Text search requests are sent to the following URI path:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/search
```

### Reply format

The reply format is a JSON object. Search results are returned in the JSON array that is stored under key sequence `"hits"/"hits"`. The order in which search results appear in the array is meaningful: better matches appear earlier.

Every search result is represented by a JSON object. The name of the linked data entity is specified under key sequence `"_id"`. Properties of the linked data entity are stored as IRI keys. The values of these properties appear in a JSON array in order to allow more than one object term per predicate term (as is often the case in linked data).

The following code snippet shows part of the reply for the below example request. The reply includes two results for search string “mew”, returning the Pokémon Mew (higher ranked result) and Mewtwo (lower ranked result).

```json
{
  "hits": {
    "hits": [
      {
        "_id": "https://triply.cc/academy/pokemon/id/pokemon/mew",
        "http://open vocab org/terms/canonicalUri": [ "http://pokedex.dataincubator.org/pokemon/151" ],
        "https://triply cc/academy/pokemon/def/baseAttack": [ 100 ],
        "https://triply cc/academy/pokemon/def/name": [ "MEW", "MEW", "MEW", "MEW", "MEW", "ミュウ" ],
        …
      },
      {
        "_id": "https://triply.cc/academy/pokemon/id/pokemon/mewtwo",
        "http://open vocab org/terms/canonicalUri": [ "http://pokedex.dataincubator.org/pokemon/150" ],
        "https://triply cc/academy/pokemon/def/baseAttack": [ 110 ],
        "https://triply cc/academy/pokemon/def/name": [ "MEWTU", "MEWTWO", "MEWTWO", "MEWTWO", "MEWTWO", "ミュウツー" ],
        …
      }
    ]
  },
  …
}
```


For interactive examples of search, query DSL, and count API requests, see the [OpenAPI documentation](https://api.triplydb.com/api-docs#tag/Search).


## Setting up index templates for ElasticSearch

TriplyDB allows you to configure a custom mapping for Elasticsearch services in TriplyDB using index templates.


### Index templates

Index templates make it possible to create indices with user defined configuration, which an index can then pull from. A template will be defined with a name pattern and some configuration in it. If the name of the index matches the template’s naming pattern, the new index will be created with the configuration defined in the template. Official documentation from ElasticSearch on how to use Index templates can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html).

Index templates on TriplyDB can be configured through either `TriplyDB API` or [TriplyDB-JS](../triplydb-js/service/index.md#index-templates).

Index template can be created by making a POST request to the following URL:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/
```

with this body:

```json
{
  "type": "elasticSearch",
  "name": "SERVICE_NAME",
  "config": {
    "indexTemplates": [
      {
        "index_patterns": "index",
        "name": "TEMPLATE_NAME",
       ...
      }
    ]
  }
}
```

`index_patterns` and `name` are obligatory fields to include in the body of index template.
It's important that every index template has the field `"index_patterns"` equal `"index"`!

Below is the example of the post request:

```sh
curl  -H "Authorization: Bearer TRIPLYDB_TOKEN"  -H "Content-Type: application/json" -d '{"type":"elasticSearch","name":"SERVICE_NAME","config":{"indexTemplates":[{"index_patterns":"index", "name": "TEMPLATE_NAME"}]}}' -X POST "https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/"
```


### Component templates

Component templates are building blocks for constructing index templates that specify index mappings, settings, and aliases. You can find the official documentation on their use in ElasticSearch [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-component-template.html). They can be configured through either `TriplyDB API` or [TriplyDB-JS](../triplydb-js/index.md#component-templates).

A component template can be created by making a POST request to the following URL:

```iri
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/
```

with this body:

```json
{
  "type": "elasticSearch",
  "name": "SERVICE_NAME",
  "config": {
    "componentTemplates": [
      {
        "name": "TEMPLATE_NAME",
        "template": {
          "mappings": {
            "properties": {
              ...
            }
          }
        }
       ...
      }
    ]
  }
}
```

`name` and `template` are obligatory fields to include in the body of component template.

Component template can only be created together with an index template. In this case Index template needs to contain the field `composed_of` with the name of the component template.

Below is an example of a POST request to create a component template for the property `https://schema.org/dateCreated` to be of type `date`.

```sh
curl  -H "Authorization: Bearer TRIPLYDB_TOKEN"  -H "Content-Type: application/json" -d '{"type":"elasticSearch","name":"SERVICE_NAME","config":{"indexTemplates":[{"index_patterns":"index", "name": "INDEX_TEMPLATE_NAME","composed_of":["COMPONENT_TEMPLATE_NAME"]}], "componentTemplates":[{"name":"COMPONENT_TEMPLATE_NAME","template":{"mappings":{"properties":{"https://schema org/dateCreated":{"type":"date"}}}}}]}}' -X POST "https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/"
```
