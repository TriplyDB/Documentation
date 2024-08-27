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

## Authentication

When a dataset is published publicly, most of the read operation on
that dataset can be performed without authentication.

Write operations and read operations on datasets that are published
internally or privately require authentication.

### Creating an API token

Authentication is implemented through API tokens. An API token can be
created within the TriplyDB UI in the following way:

1. Log into your TriplyDB instance.
2. Click on the user menu in the top-right corner and click on “User settings”.
3. Go to the “API tokens” tab.
4. Click the “Create token” button, enter a description for the
   token (e.g., “test-token”) and select the appropriate access
   rights.
5. Click on “Create” and copy the created API token (a lengthy
   string of characters). This string is only shown once, upon
   creation, and must not be shared with others. (Other users
   can create their own token in the here described way.)

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

You can create a new dataset via the Triply API. You need to [use the API Token](#using-the-api-token) and send an HTTP POST request with data specifying: `name`, `accessLevel` and `displayName`.


The  example of the URI:
```sh
curl -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -X POST https://api.INSTANCE/datasets/ACCOUNT/ -d '{"name": "NAME", "accessLevel": "ACCESS_LEVEL", "displayName": "DISPLAY_NAME"}'

```
Upper-case letter words in json after `-d` must be replaced by the following values:

- `NAME` :: The name of the dataset in the url.
- `ACCESS_LEVEL` ::  *public*, *private* or *internal*. For more information visit [Access levels in TriplyDB](../triply-db-getting-started/reference/index.md#access-levels).
- `DISPLAY_NAME` :: The display name of the dataset.


### Upload linked data

You can upload linked data via the Triply API. You need to [use the API Token](#using-the-api-token) and send an HTTP POST request with data specifying the local file path.
The list of supported file extensions can be checked in [Adding data: File upload](../triply-db-getting-started/uploading-data/index.md#adding-data-file-upload) documentation.

The example of such a request:
```sh
curl -H 'Authorization: Bearer TOKEN' -X POST https://api.INSTANCE/datasets/ACCOUNT/DATASET/jobs  -F file=@FILENAME
```
Upper-case letter words must be replaced by the following values:

- `TOKEN` :: Your TriplyDB token.
- `INSTANCE` :: The domain of your instance
- `ACCOUNT` :: Your account name
- `DATASET` :: The dataset name
- `FILENAME` :: The path to the file you want to upload

A request looks like this:
```sh
curl -H 'Authorization: Bearer xxxxxx' -X POST https://api.triplydb.com/datasets/my-account-name/my-dataset-name/jobs  -F file=@./myfile.trig
```

**Limitations**: We only support this API route for uploads less than 5MB. To upload more data, use:

1. [TriplyDB-JS](../triplydb-js/index.md): See the `importFrom*` methods under [the `Dataset` class](../triplydb-js/dataset/index.md).
2. [TriplyDB Command-line Interface](../triply-cli/index.md)

### Upload assets

You can upload assets via the Triply API. You need to [use the API Token](#using-the-api-token) and send an HTTP POST request with data specifying the local file path.

To add a new asset:
```sh
curl -H "Authorization: Bearer TOKEN" -X POST https://api.INSTANCE/datasets/ACCOUNT/DATASET/assets -F file=@FILENAME
```

To add a version to an existing asset:
```sh
curl -H "Authorization: Bearer TOKEN" -X POST https://api.INSTANCE/datasets/ACCOUNT/DATASET/assets/IDENTIFIER -F file=@FILENAME
```

Upper-case letter words must be replaced by the following values:

- `TOKEN` :: Your TriplyDB token.
- `INSTANCE` :: The domain of your instance
- `ACCOUNT` :: Your account name
- `DATASET` :: The dataset name
- `IDENTIFIER` :: The asset identifier where you'd like to add a new version to. 
- `FILENAME` :: The path to the file you want to upload

This request returns a JSON object, that includes (among other things) an `identifier` key, which can be used as a persistent identifier for this asset.

A request to add a new asset looks like this:
```sh
curl -H 'Authorization: Bearer xxxxxx' -X POST https://api.triplydb.com/datasets/my-account-name/my-dataset-name/assets -F file=@./myfile.txt
```

A request to add a version to an existing asset looks like this:
```sh
curl -H 'Authorization: Bearer xxxxxx' -X POST https://api.triplydb.com/datasets/my-account-name/my-dataset-name/assets/yyyyy -F file=@./myfile.txt
```


**Limitations**: We only support this API route for uploads less than 5MB. To upload more data, use:

1. [TriplyDB-JS](../triplydb-js/index.md): See the `uploadAsset` methods under [the `Dataset` class](../triplydb-js/dataset/index.md).
2. [TriplyDB Command-line Interface](../triply-cli/index.md)

## Accounts

Information about TriplyDB accounts (organizations and users) can be retrieved from the following API path:

```none
https://api.INSTANCE/accounts
```

Upper-case letter words must be replaced by the following values:

- `INSTANCE` :: The host name of the TriplyDB instance that you want to use.

Here is an example of a URI path that points to the Triply API for the Triply organization account:

```none
https://api.triplydb.com/accounts/Triply
```



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
- `endpoint_in_url` configures whether the URL of the SPARQL endpoint should be specified through the API. In TriplyDB, this configuration is by default set to `false`. (Users of the REST API typically expect domain parameters such as `countryName` or `maximumAge`, but they do not necessarily expect technical parameters like an endpoint URL.)



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

### Create a service

You can create a service for a dataset via TriplyDB API. You need to [use the API Token](#using-the-api-token) and send an HTTP POST request with data specifying: `"type"` and `"name"`.

The  example of the URI:

```sh
curl -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -X POST https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/ -d '{"type": "TYPE", "name": "NAME"}'
```

Upper-case letter words in json after `-d` must be replaced by the following values:

- `TYPE` :: [SPARQL](#sparql) (`virtuoso` or `jena`) or [Elasticsearch](#elasticsearch)

- `NAME` :: The name of the service

### Synchronize a service

You can synchronize existing service for a dataset via TriplyDB API. You need to [use the API Token](#using-the-api-token) and send an HTTP POST request with data:

```json
{"sync": "true"}
```

The  example of the URI:

```sh
curl -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -X POST https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE -d '{"sync": "true"}'
```


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

SPARQL services are able to return results in different formats. The user can specify the preferred format by specifying the corresponding Media Type in the HTTP `Accept` header. TriplyDB supports the Media Types in the following table. Notice that the chosen result format must be supported for your query form. Alternatively, it is possible (but not preferred) to specify the requested format as an URI path suffix; see the [GET request](#get-request) section for an example.

| Result format | Media Type                        | Query forms         | Suffix    |
| ------------- | --------------------------------- | ------------------- | --------- |
| CSV           | `text/csv`                        | SELECT              | `.csv`    |
| JSON          | `application/json`                | ASK, SELECT         | `.json`   |
| JSON-LD       | `application/ld+json`             | CONSTRUCT, DESCRIBE | `.jsonld` |
| N-Quads       | `application/n-quads`             | CONSTRUCT, DESCRIBE | `.nq`     |
| N-Triples     | `application/n-triples`           | CONSTRUCT, DESCRIBE | `.nt`     |
| RDF/XML       | `application/rdf+xml`             | CONSTRUCT, DESCRIBE |           |
| SPARQL JSON   | `application/sparql-results+json` | ASK, SELECT         | `.srj`    |
| SPARQL XML    | `application/sparql-results+xml`  | ASK, SELECT         | `.srx`    |
| TriG          | `application/trig`                | CONSTRUCT, DESCRIBE | `.trig`   |
| TSV           | `text/tab-separated-values`       | SELECT              | `.tsv`    |
| Turtle        | `text/turtle`                     | CONSTRUCT, DESCRIBE | `.ttl`    |

### Examples of SPARQL Query requests

This section contains examples of SPARQL HTTP requests. The requests run either of the following two SPARQL queries against a public SPARQL endpoint that contains data about Pokemon:

```sparql
select * { ?s ?p ?o. } limit 1
```

```sparql
construct where { ?s ?p ?o. } limit 1
```

The examples made use of the popular command-line tool [cURL](https://curl.se). These examples should also work in any other HTTP client tool or library.

### GET request

```sh
curl https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql?query=select%20%2A%20%7B%20%3Fs%20%3Fp%20%3Fo.%20%7D%20limit%201
```

Result:

```json
[
  {
    "s": "https://triplydb.com/academy/pokemon/vocab/",
    "p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "o": "http://www.w3.org/2002/07/owl#Ontology"
  }
]
```

The following request is identical to the previous one, but adds the ".srj" suffix to the URI path (see `/sparql.srj`). All suffixes from the table in Section [SPARQL Query result formats](#sparql-query-result-formats) are supported.

```sh
curl https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql.srj?query=select%20%2A%20%7B%20%3Fs%20%3Fp%20%3Fo.%20%7D%20limit%201
```

This returns the official SPARQL Result Set JSON (SRJ) format. Notice that this official format is more verbose than the standard JSON format:

```json
{
  "head": {
    "link": [],
    "vars": [
      "s",
      "p",
      "o"
    ]
  },
  "results": {
    "bindings": [
      {
        "s": {
          "type": "uri",
          "value": "https://triplydb.com/academy/pokemon/"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://rdfs.org/ns/void#Dataset"
        }
      }
    ]
  }
}
```



### URL-encoded POST request

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data query=select%20%2A%20%7B%20%3Fs%20%3Fp%20%3Fo.%20%7D%20limit%201
```

Result:

```json
[
  {
    "s": "https://triplydb.com/academy/pokemon/vocab/",
    "p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "o": "http://www.w3.org/2002/07/owl#Ontology"
  }
]
```

### Direct POST request

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Content-Type: application/sparql-query' \
  -d 'select * { ?s ?p ?o } limit 1'
```

Result:

```json
[
  {
    "s": "https://triplydb.com/academy/pokemon/vocab/",
    "p": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "o": "http://www.w3.org/2002/07/owl#Ontology"
  }
]
```

#### SPARQL JSON

Like the previous example, but with an `Accept` header that specifies Media Type `application/sparql-results+json`:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/sparql-results+json' \
  -H 'Content-Type: application/sparql-query' \
  -d 'select * { ?s ?p ?o } limit 1'
```

Result:

```json
{
  "head": {
    "vars": ["s", "p", "o"]
  },
  "results": {
    "bindings": [
      {
        "s": {
          "type": "uri",
          "value": "https://triplydb.com/academy/pokemon/vocab/"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#Ontology"
        }
      }
    ]
  }
}
```

#### SPARQL XML

Like the previous example, but with Media Type `application/sparql-results+xml` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/sparql-results+xml' \
  -H 'Content-Type: application/sparql-query' \
  -d 'select * { ?s ?p ?o } limit 1'
```

Result:

```xml
<sparql xmlns="http://www.w3.org/2005/sparql-results#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.w3.org/2001/sw/DataAccess/rf1/result2.xsd">
  <head>
    <variable name="s"/>
    <variable name="p"/>
    <variable name="o"/>
  </head>
  <results distinct="false" ordered="true">
    <result>
      <binding name="s">
        <uri>https://triplydb.com/academy/pokemon/vocab/</uri>
      </binding>
      <binding name="p">
        <uri>http://www.w3.org/1999/02/22-rdf-syntax-ns#type</uri>
      </binding>
      <binding name="o">
        <uri>http://www.w3.org/2002/07/owl#Ontology</uri>
      </binding>
    </result>
  </results>
</sparql>
```

#### SPARQL tab-separated values

Like the previous examples, but with Media Type `text/tab-separated-values` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: text/tab-separated-values' \
  -H 'Content-Type: application/sparql-query' \
  -d 'select * { ?s ?p ?o } limit 1'
```

```none
"s"	"p"	"o"
"https://triplydb.com/academy/pokemon/vocab/"	"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"	"http://www.w3.org/2002/07/owl#Ontology"
```

#### SPARQL comma-separated values

Like the previous examples, but with Media Type `text/csv` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: text/csv' \
  -H 'Content-Type: application/sparql-query' \
  -d 'select * { ?s ?p ?o } limit 1'
```

Result:

```csv
"s","p","o"
"https://triplydb.com/academy/pokemon/vocab/","http://www.w3.org/1999/02/22-rdf-syntax-ns#type","http://www.w3.org/2002/07/owl#Ontology"
```

#### JSON-LD

Like the previous examples, but with a SPARQL construct query and Media Type `application/ld+json` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/ld+json' \
  -H 'Content-Type: application/sparql-query' \
  -d 'construct where { ?s ?p ?o } limit 1'
```

Result:

```json
{ "@graph": [
    { "@id": "https://triplydb.com/academy/pokemon/vocab/",
      "@type": "http://www.w3.org/2002/07/owl#Ontology" }
] }
```

#### N-Quads

Like the previous examples, but with Media Type `application/n-quads` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/n-quads' \
  -H 'Content-Type: application/sparql-query' \
  -d 'construct where { ?s ?p ?o } limit 1'
```

Result:
<!-- TODO -->
```json
{ "@graph": [
    { "@id": "https://triplydb.com/academy/pokemon/vocab/",
      "@type": "http://www.w3.org/2002/07/owl#Ontology" }
] }
```

#### N-Triples

Like the previous examples, but with Media Type `application/n-triples` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/n-triples' \
  -H 'Content-Type: application/sparql-query' \
  -d 'construct where { ?s ?p ?o } limit 1'
```

Result:

```turtle
<https://triplydb.com/academy/pokemon/vocab/>	<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>	<http://www.w3.org/2002/07/owl#Ontology> .
```

#### TriG

Like the previous examples, but with Media Type `application/trig` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: application/trig' \
  -H 'Content-Type: application/sparql-query' \
  -d 'construct where { ?s ?p ?o } limit 1'
```

Result:

```turtle
@prefix rdf:	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl:	<http://www.w3.org/2002/07/owl#> .
<https://triplydb.com/academy/pokemon/vocab/>	rdf:type	owl:Ontology .
```

#### Turtle

Like the previous examples, but with Media Type `text/turtle` in the `Accept` header:

```sh
curl -X POST https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql \
  -H 'Accept: text/turtle' \
  -H 'Content-Type: application/sparql-query' \
  -d 'construct where { ?s ?p ?o } limit 1'
```

Result:

```turtle
@prefix rdf:	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl:	<http://www.w3.org/2002/07/owl#> .
<https://triplydb.com/academy/pokemon/vocab/>	rdf:type	owl:Ontology .
```

## GraphQL
This endpoint can be used for GraphQL queries. It uses information from user-provided SHACL shapes for the schema creation.

### Schema
#### Object types
A basic element of the schema is object types, which represents the type of the objects that you can query.

```graphql
type Book {
  id:ID!
  title:[XsdString]!
}
```
This object type corresponds to the shape below:

```turtle
shp:Book a sh:NodeShape;
         sh:targetClass sdo:Book;
         sh:property [ 
           sh:path dc:title;
           sh:datatype xsd:string.]
```
#### Fields
Fields in object types, such as `title`, represent properties of nodes. By default, fields return arrays of values. The only exception is when the property has `sh:maxCount: 1`, then the field returns a single value. 
Thus, for the shape:
```turtle
shp:Book a sh:NodeShape;
         sh:targetClass sdo:Book;
         sh:property [ 
           sh:path dc:title;
           sh:maxCount "1"^^xsd:integer;
           sh:datatype xsd:string.]
```

The object type will be:
```graphql
type Book {
  id:ID!
  title:XsdString
}
```
Additionally, following the [best practices](https://graphql.org/learn/best-practices/#nullability), fields can give null results, except for:

- IDs, which represents the IRI of the resource.
- Lists, but not their elements
- Properties that have sh:minCount 1 and sh:maxCount 1

Thus, for this shape:
```turtle
shp:Book a sh:NodeShape;
         sh:targetClass sdo:Book;
         sh:property [ 
           sh:path dc:title;
           sh:maxCount "1"^^xsd:integer;
           sh:minCount "1"^^xsd:integer;
           sh:datatype xsd:string.]
```
The corresponding object type is:
```graphql
type Book {
  id:ID!
  title:XsdString!
}
```


If the property shape includes an `sh:datatype`, the field returns values of GraphQL scalar type (see example above). On the other hand, if the property shape has an `sh:class` pointing to a class that:
- is the `sh:targetClass` of a node shape, the field returns values of the corresponding object type.
- is not mentioned as a `sh:targetClass` in a node shape, then the type of the returned values is `ExternalIri`.

Therefore, the shapes :
```turtle
shp:Book a sh:NodeShape;
         sh:targetClass sdo:Book;
         sh:property [ 
           sh:path sdo:author;
           sh:class sdo:Person.];
         sh:property [ 
           sh:path sdo:audio;
           sh:class sdo:AudioObject.].


shp:Person a sh:NodeShape;
         sh:targetClass sdo:Person;
         sh:property [ 
           sh:path sdo:name;
           sh:datatype xsd:string.].
```
correspond to the below graphql types:
```graphql
type Book {
  id:ID!
  author:[Person]!
  audio:[ExternalIri]!
}

type Person {
  id:ID!
  name:[XsdString]!
}
```
#### IDs 
IDs represent the IRI of each object. This ID is unique.
You can read more information on the `ID` scalar in [graphql.org](https://graphql.org/learn/schema/#scalar-types). Also, the use of the `id` field is mentioned later in the section [Object Global Identification](#global-object-identification).

#### Naming
In order to name the GraphQL types in correspondence to shapes, we follow the below conventions:
- For object types, we use the `sh:targetClass` of the node shape.
- For object type fields, we use the `sh:path` of the property shape.

More specifically, the name comes from the part of the IRI after the last `#` or otherwise the last `/`, converted from kebab-case to camelCase. 

Notice that if the selected name is illegal or causes a name collision, we'll return an error informing the user about the problem and ignore this type or field. 

 ##### Renaming
 Shape designers are able use their custom names by using a special property: `<https://triplydb.com/Triply/sparql/graphqlName>`.
 More specifically, the designer has to add a triple with :
 - for object types, the class IRI 
 - for fields, the IRI of the property shape

as a subject, the above-mentioned predicate and a string literal with the custom name as object.

 If we wanted to rename using the first example of the section, we would do:
```turtle
shp:Book a sh:NodeShape;
         sh:targetClass sdo:Book;
         sh:property [ 
           sh:path dc:title;
           sh:graphqlName "name" // Renaming the object type field
           sh:datatype xsd:string.]
sdo:Book triply:graphqlName "PieceOfArt". // Renaming the object type
```
Then the corresponding object type would be:
```graphql
type PieceOfArt {
  id:ID!
  name:[XsdString]!
}
```
### Queries
The user can query for objects using their unique ID. Also, they can query for objects of a specific type along with fields, and get nested information. Last, the user can get information by filtering results. Let's see some important concepts.


#### Global Object identification
For reasons such as caching, the user should be able to query an object by their unique ID. This is possible using global object identification, using the `node(id:ID)` query. 
An example:

```graphql
{
  node(id: "https://example.org/book/Odyssey") {
    id
  }
}
```

For more information on global object identification, see [graphql specification](https://graphql.org/learn/global-object-identification/). 

#### Pagination
A simple query would be:
 ```graphql
{
  BookConnection {
    edges {
      node {
        id
        title
      }
    }
  }
}
 ```
The results would include the IRIs of books together with their titles and would be paginated.

In order to paginate through a large number of results, our GraphQL implementation supports **cursor-based pagination using connections**. For more information, please visit the Relay project's [cursor-based connection pagination specification](https://relay.dev/graphql/connections.htm).

#### Filtering
When you query for objects, you might want to get back objects based on specific values in certain fields. You can do this by filtering.
#### Simple cases
For example, you can query for people with a specific id:
```graphql
{
  PersonConnection(filter: {id: "https://example.org/person/Homer"}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```
Another query would be to search for a person with a specific name:
```graphql
{
  PersonConnection(filter: {name: {eq: "Homer"}}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

Notice that in the second example, there is a new field for filtering called `eq`. When we want to filter on a field with returns a scalar, meaning that its value is represented by a literal in linked data, we have to use comparison operators: `eq`,`in` for equality, and `notEq` and `notIn` for inequality. The operators `in` and`notIn` are refering to lists.

On the other hand, when we are filtering based on IDs - or in linked data terms, based on the IRI - , as in the first example, we don't use comparison operators.

##### Language filtering
The only idiomatic case is the literal with a language tag and `rdf:langString` as a datatype. This literal is represented as ` { value: "example-string", language: "en" }` and the corresponding scalar is `RdfsLangString` . This means that in order to filter using a value of this scalar type, you have to execute the query below:

```graphql
{
  PersonConnection(filter: {name: {eq: {value: "Ulysses", language: "en"}}}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

Also, there is support for filtering results based on the language tag.
An example is:
- Linked data:
```turtle
person:Ulysses a sdo:Person;
              sdo:name "Ulysses"@"en";
              sdo:name "Oδυσσέυς"@"gr".


shp:Person a sh:NodeShape;
         sh:targetClass sdo:Person;
         sh:property [ 
           sh:path sdo:name;
           sh:datatype rdf:langString.].
```
- GraphQL query:
```graphql
{
  PersonConnection {
    edges {
      node {
        id
        name(language:"gr")
      }
    }
  }
}
```
- Results:
```graphql
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Ulysses",
            "name": [
              {
                "value": "Oδυσσέυς",
                "language": "gr"
              }
            ]
          }
        }
      ]
    }
  }
}
```
We support using the HTTP Accept-Language syntax, for filtering based on a language-tag.
For example,
- GraphQL query:
```graphql
{
  PersonConnection {
    edges {
      node {
        id
        name(language:"gr, en;q=.5")
      }
    }
  }
}
```
- Results:
```graphql
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Ulysses",
            "name": [
              {
                "value": "Oδυσσέυς",
                "language": "gr"
              },
              {
                "value": "Ulysses",
                "language": "en"
              },
            ]
          }
        }
      ]
    }
  }
}
```

If the writer of the shapes include the `sh:uniqueLang` constraint, then the result returned is a single value, instead of an array.
Thus, the example becomes:
- Linked data:
```turtle
person:Ulysses a sdo:Person;
              sdo:name "Ulysses"@"en";
              sdo:name "Oδυσσέυς"@"gr".


shp:Person a sh:NodeShape;
         sh:targetClass sdo:Person;
         sh:property [ 
           sh:path sdo:name;
           sh:uniqueLang true; 
           sh:datatype rdf:langString.].
```
- GraphQL query:
```graphql
{
  PersonConnection {
    edges {
      node {
        id
        name(language:"gr, en;q=.5")
      }
    }
  }
}
```
- Results:
```graphql
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Ulysses",
            "name": [
              {
                "value": "Oδυσσέυς",
                "language": "gr"
              }
            ]
          }
        }
      ]
    }
  }
}
```
#### Advanced filtering

Furthermore, there is possibility for nested filtering:

```graphql
{
  BookConnection(
    filter: {author: {name: {eq: "Homer"}}}
  ) {
    edges {
      node {
        id
      }
    }
  }
}
```
and for combination of filters:
```graphql
{
  BookConnection(
    filter: {author: {name: {eq: "Homer"}}, name: {eq: "Odyssey"}}
  ) {
    edges {
      node {
        id
      }
    }
  }
}
```
Note: The combination of filters is executed in an **'and'** logic.
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


### Examples

#### Simple search

Perform a search for the string *mew*:

```sh
curl 'https://api.triplydb.com/datasets/academy/pokemon/services/search/search?query=mew'
```

#### Custom search

Perform a search using the custom query:

```json
{
  "query": {
    "simple_query_string": {
      "query": "pikachu"
    }
  }
}
```

This request is issued in the following way with the cURL command-line tool:

```sh
curl -X POST 'https://api.triplydb.com/datasets/academy/pokemon/services/search/search' \
     -d '{"query":{"simple_query_string":{"query":"pikachu"}}}' \
     -H 'content-type: application/json'
```

#### Count API

Elasticsearch allows the number of results to be determined without having to actually retrieve all these results. This is done with the "Count API". This API comes in handy when the number of results is shown in applications such as faceted search interfaces.

The following two requests return the number of results for the search strings "Iris" and "Setosa". Notice that "Iris" occurs more often (184 times) than "Setosa" (52 times):

```sh
curl 'https://api.triplydb.com/datasets/Triply/iris/services/iris-es/_count'
     -H 'Content-Type: application/json'
     --data-raw $'{"query": { "simple_query_string": { "query": "Iris" } } }'
{"count":184,"_shards":{"total":1,"successful":1,"skipped":0,"failed":0}}
```

and:

```sh
curl 'https://api.triplydb.com/datasets/Triply/iris/services/iris-es/_count'
     -H 'Content-Type: application/json'
     --data-raw $'{"query": { "simple_query_string": { "query": "Setosa" } } }'
{"count":52,"_shards":{"total":1,"successful":1,"skipped":0,"failed":0}}
```



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
