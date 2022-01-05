---
title: "Triply API"
path: "/docs/triply-api"
---

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
lengthy sequence of characters). See [Creating an API token](#Creating-an-API-token) for
information on how to create an API token.

## Exporting linked data

Every TriplyDB API path that returns Linked Data provides a number of serializations to choose from. We support the following serializations:

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

Triply API requests are always directed towards a specific URI path.
URI paths will often have the following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/
```

Upper-case letter words must be replaced by the following values:

- `INSTANCE` :: The host name of the TriplyDB instance that you want
  to use.
- `ACCOUNT` :: The name of a specific user or a specific
  organization.
- `DATASET` :: The name of a specific dataset.

Here is an example of a URI path that points to the Triply API for
the Pokémon dataset:

```none
https://api.triplydb.com/datasets/academy/pokemon/
```

### Triple Pattern Fragments (TPF)

Triple Pattern Fragments (TPF) is a community standard that allows
individual Linked Datasets to be queried for Triply Patterns (TP), a
subset of the more complex SPARQL query language. The Triply API
implements [Triple Pattern
Fragments](http://www.hydra-cg.com/spec/latest/triple-pattern-fragments/)
version 2019-01-18 and [Linked Data
Fragments](http://www.hydra-cg.com/spec/latest/linked-data-fragments/)
version 2016-06-05.

The Triple Pattern Fragments (TPF) API is available for all datasets
in Triply and does not require running a dedicated service.


#### URI path

TPF requests are sent to the following URI path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/fragments
```

#### Reply format

Since TPF replies distinguish between data and metadata that are
stored in different graphs, it is recommended to request the TriG
content type with the following HTTP request header:

```none
Accept: application/trig
```

#### Query parameters

Triple Pattern Fragments (TPF) uses the following query parameters in
order to retrieve only those triples that adhere to a specified Triple
Pattern:

| _Key_       | _Value_                       | _Purpose_                                                                          |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `subject`   | A URL-encoded IRI.            | Only return triples where the given IRI appears in the subject position.           |
| `predicate` | A URL-encoded IRI.            | Only return triples where the given IRI appears in the predicate position.         |
| `object`    | A URL-encoded IRI or literal. | Only return triples where the given IRI or literal appears in the object position. |

#### Example request

```bash
curl -G \
       'https://api.triplydb.com/datasets/academy/pokemon/fragments' \
       --data-urlencode 'predicate=http://www.w3.org/2000/01/rdf-schema#label' \
       -H 'Accept: application/trig'
```

### Exporting data


To export the linked data of a dataset, use the following path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/download
```


#### Query parameters

By default, an export includes all linked data graphs. Use a query argument to specify a particular graph.

| _Key_       | _Value_                       | _Purpose_                                                                          |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `graph`   | A URL-encoded IRI.            | Only download the export of the given graph IRI.           |

#### Example request

```bash
curl 'https://api.triplydb.com/datasets/academy/pokemon/download' \
       -H 'Accept: application/trig' > export.trig.gz
```

## Services

Some API requests require the availability of a specific service over
the dataset. These requests are directed towards a URI path of the
following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/
```

Upper-case letter words must be replaced by the following values:

- `SERVICE` :: The name of a specific service that has been started
  for the corresponding dataset.

- See the previous section for [Datasets](#Datasets) to learn the meaning of
  `INSTANCE`, `ACCOUNT`, and `DATASET`.

Here is an example of a URI path that points to a SPARQL endpoint
over the Pokémon dataset:

```none
https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
```

### SPARQL

There are two service types in TriplyDB that expose the SPARQL 1.1 Query Language: "Sparql" and "Jena".  The former works well for large quantities of instance data with a relatively small data model; the latter works well for smaller quantities of data with a richer data model.

SPARQL services expose a generic endpoint URI at the following location (where `ACCOUNT`, `DATASET` and `SERVICE` are user-chosen names):

```none
https://api.triplydb.com/datasets/ACCOUNT/DATASET/services/SERVICE/sparql
```

Everybody who has access to the dataset also has access to its services, including its SPARQL services:
- For *Public* datasets, everybody on the Internet or Intranet can issue queries.
- For *Internal* datasets, only users that are logged into the triple store can issue queries.
- For *Private* datasets, only users that are logged into the triple store and are members of `ACCOUNT` can issue queries.

Notice that for professional use it is easier and better to use [saved queries](#saved-queries).  Saved queries have peristent URIs, descriptive metadata, versioning, and support for reliable large-scale pagination.  Still, if you do not have a saved query at your disposal and want to perform a custom SPARQL request against an accessible endpoint, you can still do so.  TriplyDB implements the SPARQL 1.1 Query Protocol standard for this purpose.

#### Sending a SPARQL Query request

According to the SPARQL 1.1 Protocol, queries can be send in the 3 different ways that are displayed in <a href='#table-http-sparql-query'>Table 1</a>.  For small query strings it is possible to send an HTTP GET request (row 1 in <a href='#table-http-sparql-query'>Table 1</a>).  A benefit of this approach is that all information is stored in one URI.  For public data, copy/pasting this URI in a web browser runs the query.  For larger query strings it is required to send an HTTP POST request (rows 2 and 3 in <a href='#table-http-sparql-query'>Table 1</a>).  The reason for this is that longer query strings result in longer URIs when following the HTTP GET approach.  Some applications do not support longer URIs, or they even silently truncate them resulting in an error down the line.  The direct POST approach (row 3 in <a href='#table-http-sparql-query'>Table 1</a>) is the best of these 3 variants, since it most clearly communicates that it is senting a SPARQL query request (see the `Content-Type` column).

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

#### SPAQL Query result formats

SPARQL services are able to return results in different formats.  The user can specify the preferred format by specifying the corresponding Media Type in the HTTP `Accept` header.  TriplyDB supported the following Media Types.  Notice that the chosen result format must be supported for your query form.

| Result format | Media Type                        | Query forms         |
| ------------- | --------------------------------- | ------------------- |
| CSV           | `text/csv`                        | SELECT              |
| JSON          | `application/json`                | ASK, SELECT         |
| JSON-LD       | `application/ld+json`             | CONSTRUCT, DESCRIBE |
| N-Quads       | `application/n-quads`             | CONSTRUCT, DESCRIBE |
| N-Triples     | `application/n-triples`           | CONSTRUCT, DESCRIBE |
| RDF/XML       | `application/rdf+xml`             | CONSTRUCT, DESCRIBE |
| SPARQL JSON   | `application/sparql-results+json` | ASK, SELECT         |
| SPARQL XML    | `application/saprql-results+xml`  | ASK, SELECT         |
| TriG          | `application/trig`                | CONSTRUCT, DESCRIBE |
| TSV           | `text/tab-separated-values`       | SELECT              |
| Turtle        | `text/turtle`                     | CONSTRUCT, DESCRIBE |

#### Examples of SPARQL Query requests

This section contains examples of SPARQL HTTP requests.  The requests run either of the following two SPARQL queries against a public SPARQL endpoint that contains data about Pokemon:

```sparql
select * { ?s ?p ?o. } limit 1
```

```sparql
construct where { ?s ?p ?o. } limit 1
```

The examples made use of the popular command-line tool [cURL](https://curl.se).  These examples should also work in any other HTTP client tool or library.

#### GET request

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

#### URL-encoded POST request

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

#### Direct POST request

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

```none
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

### Elastic

The text search API returns a list of Linked Data entities based on a
supplied text string. The text string is matched against the text in
literals and IRIs that appear in the Linked Data description of the
returned entities.

The text search API is only available for a dataset after an
ElasticSearch service has been created for that dataset.

Two types of searches can be performed: a simple search, and a custom
search. Simple searches require one search term for a fuzzy match. Custom
searches accept a JSON object conforming to [the elasticsearch query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

#### URI path

Text search requests are sent to the following URI path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/search
```

#### Reply format

The reply format is a JSON object. Search results are returned in the
JSON array that is stored under key sequence `"hits"/"hits"`. The
order in which search results appear in the array is meaningful:
better matches appear earlier.

Every search result is represented by a JSON object. The name of the
Linked Data entity is specified under key sequence `"_id"`.
Properties of the Linked Data entity are stored as IRI keys. The
values of these properties appear in a JSON array in order to allow
more than one object term per predicate term (as is often the case in
Linked Data).

The following code snippet shows part of the reply for the below
example request. The reply includes two results for search string
“mew”, returning the Pokémon Mew (higher ranked result) and Mewtwo
(lower ranked result).

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

#### Examples

##### Simple search
Perform a search for the string *mew*:
```bash
curl 'https://api.triplydb.com/datasets/academy/pokemon/services/search/search?query=mew'
```

##### Custom search
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
```bash
curl -X POST 'https://api.triplydb.com/datasets/academy/pokemon/services/search/search' \
     -d '{"query":{"simple_query_string":{"query":"pikachu"}}}' \
     -H 'content-type: application/json'
```
