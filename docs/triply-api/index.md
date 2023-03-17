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

1. Log into your TriplyDB instance. If your organization does not yet have a TriplyDB server, you can also create a free account at TriplyDB.com.
2. Click on the user menu in the top-right corner and click on “User settings”.
3. Go to the “API tokens” tab.
4. Click the “Create token” button, enter a description for the
   token (e.g., “test-token”) and select the appropriate access
   rights. Notice that "Management access" is often not needed, and "Write access" suffices for most applications and pipelines.
5. Click on “Create” and copy the created API token (a lengthy
   string of characters). For security reasons, this string is only shown once, upon
   creation, and must not be shared with others. (Other users
   can create their own token using the same process.)

Applications (see [TriplyDB.js](https://triply.cc/docs/triplydb-js/)) and pipelines (see [RATT](https://triply.cc/docs/ratt/)) often require access rights to interact with TriplyDB instances. Specifically, reading non-public data and writing any (public or non-public) data requires setting an API token. The token ensures that only users who are specifically authorized for certain datasets can access and/or modify those datasets. It is good practice to create different API tokens for different applications.

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

Every TriplyDB API path that returns linked data provides a number of serializations to choose from. We support the following serializations:

| Serialization                                         | Media type              | File extension |
| ----------------------------------------------------- | ----------------------- | -------------- |
| [TriG](https://www.w3.org/TR/trig/)                   | `application/trig`      | `.trig`        |
| [N-Triples](https://www.w3.org/TR/n-triples/)         | `application/n-triples` | `.nt`          |
| [N-Quads](https://www.w3.org/TR/n-quads/)             | `application/n-quads`   | `.nq`          |
| [Turtle](https://www.w3.org/TR/turtle/)               | `text/turtle`           | `.ttl`         |
| [JSON-LD](https://json-ld.org/spec/latest/json-ld/)*  | `application/ld+json`   | `.jsonld`      |

To request a serialization, use one of the following mechanisms:

1. Add an `Accept` header to the request. E.g. `Accept: application/n-triples`
2. Add the extension to the URL path. E.g. https://api.triplydb.com/datasets/Triply/iris/download.nt

### JSON-LD frames *
 #### What are JSON-LD frames?

Linked data queries most often support two ways of returning results. Either in flat dataformat, for example `.csv`, where each result is a separate line or record. Or as a set of linked data triples. An unordered list, in a data formats such as `.ttl` or `.nq`. The data can be interpreted by linked data tooling but the data does not follow a predefined structure. When a REST-API is queried the data is returned according to a predefined structure. The API already knows beforehand how the data will look like. With JSON-LD frames there now is a way to create predefined REST-APIs.

JSON-LD frames are a deterministic translation from a graph, which has an unordered set of triples where no node is "first" or "special", into a tree, which has ordered branches and exactly one "root" node. In other words, JSON-LD framing allows one to force a specific tree layout to a JSON-LD document. This makes it possible to translate SPARQL queries to REST-APIs.

The TriplyDB API for saved queries has been equipped with a JSON-LD profiler which can apply a JSON-LD profile to a JSON-LD result, transforming the plain JSON-LD to framed JSON. To do this you need two things. A SPARQL construct query and a JSON-LD frame. When you have both of these, you can retrieve plain JSON from a SPARQL query. The revelant cURL command when both the SPARQL query and JSON-LD frame are available is:

```bash
curl -X POST [SAVED-QUERY-URL] \
  -H 'Accept: application/ld+json;profile=http://www.w3.org/ns/json-ld#framed' \
  -H 'Authorization: Bearer [YOUR_TOKEN]' \
  -H 'Content-type: application/json' \
  -d '[YOUR_FRAME]'
```

When sending a curl request, a few things are important. First, the request needs to be a `POST` request. Only a `POST` request can accept a frame as a body. The `Accept` header needs to be set to a specific value. The `Accept` header needs to have both the expected returned content-type and the JSON-LD profile, e.g. `application/ld+json;profile=http://www.w3.org/ns/json-ld#framed`. When querying an internal or private query you need to add an authorization token. Finally, it is important to set the `Content-type`. It refers to the content-type of the input body and needs to be `application/json`, as the frame is of type `application/json`.

#### The SPARQL Query

Let's start with the SPARQL query. A JSON-LD frame query needs a SPARQL `CONSTRUCT` query to create an RDF graph that is self contained and populated with relevant vocabulary and data. The graph in JSON-LD is used as input for the REST API call. The SPARQL `CONSTRUCT` query can be designed with API variables.

Do note that API variables with `OPTIONAL`s can sometimes behave a bit different than regular API variables. This is due to how SPARQL interprets `OPTIONAL`s. If an API variable is used in an `OPTIONAL`, the query will return false positives, as the `OPTIONAL` does not filter out results matching the API-variable.

Also note that the use of `UNION`s can have unexpected effects on the SPARQL query. A union could split up the resultset of the SPARQL query. Meaning that the SPARQL engine first exhausts the top part of the `UNION` and then starts with the second part of the `UNION`. This means that the first part of the resultset can be disconnected from the second part. If the limit is set too small the resultset is separated in two different JSON-LD documents. This could result in missing data in the response.

Finally, please note that it can happen that you set a `pageSize` of `10` but the response contains less than `10` results, while the next page is not empty. This is possible as the resultset of the `WHERE` clause is limited with a limit and not the `CONSTRUCT` clause. This means that two rows of the resulting `WHERE` clause are condensed into a single result in the `CONSTRUCT` clause. Thus the response of the API can differ from the `pageSize`.

The result is a set of triples according to the query. Saving the SPARQL query will resolve in a saved query. The saved query has an API URL that we can now use in our cURL command. The URL most of the time starts with `api` and ends with `run`.

The saved query url of an example query is:

```bash
https://api.triplydb.com/queries/JD/JSON-LD-frame/run
```

You could use API variables with a `?` e.g. `?[queryVariable]=[value]`

#### The Frame

The SPARQL query is not enough to provide the RDF data in a JSON serialization format. It requires additional syntactic conformities that cannot be defined in a SPARQL query. Thus the SPARQL query that was created needs a frame to restructure JSON-LD objects into JSON. The JSON-LD 1.1 standard allows for restructuring JSON-LD objects with a frame to JSON.

A JSON-LD frame consists out of 2 parts. The `@context` of the response, and the structure of the response. The complete specification on JSON-LD frames can be found [online](https://w3c.github.io/json-ld-framing/)

The `@context` is the translation of the linked data to the JSON naming. In the `@context` all the IRIs that occur in the JSON-LD response are documented, with key-value pairs, where the key corresponds to a name the IRI will take in the REST-API response and the value corresponds to the IRI in the JSON-LD response. Most of the time the key-value pairs are one-to-one relations, where one key is mapped to a single string. Sometimes the value is an object. The object contains at least the `@id`, which is the IRI in the JSON-LD response. The object can also contain other modifiers, that change the REST-API response. Examples are, `@type` to define the datatype of the object value, or `@container` to define the container where the value in the REST-API response is stored in. The context can also hold references to vocabularies or prefixes.

The second part of the JSON-LD frame is the structure of the data. The structure defines how the REST-API response will look like. Most of the time the structure starts with `@type` to denote the type that the rootnode should have. Setting the `@type` is the most straightforward way of selecting your rootnode. The structure is built outward from the rootnode. You can define a leafnode in the structure by adding an opening and closing bracket, as shown in the example. To define a nested node you first need to define the key that is a object property in the JSON-LD response that points to another IRI. Then from that IRI the node is created filling in the properties of that node.

```json
{
  "@context": {
    "addresses": "ex:address",
    "Address": "ex:Address",
    "Object": "ex:Object",
    "street": "ex:street",
    "number": {
      "@id": "ex:number",
      "@type": "xsd:integer"
    },
    "labels": {
      "@id": "ex:label",
      "@container": "@set"
    },
    "ex": "https://triply.cc/example/",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "@type": "Object",
  "labels": {},
  "addresses": {
    "street": {},
    "number": {}
  }
}
```

The JSON-LD frame together with the SPARQL query will now result in a REST-API result:

```bash
curl -X POST https://api.triplydb.com/queries/JD/JSON-LD-frame/run \
  -H 'Accept: application/ld+json;profile=http://www.w3.org/ns/json-ld#framed' \
  -H 'Content-type: application/json' \
  -d '{
    "@context": {
      "addresses": "ex:address",
      "Address": "ex:Address",
      "Object": "ex:Object",
      "street": "ex:street",
      "number": {
        "@id": "ex:number",
        "@type": "xsd:integer"
      },
      "labels": {
        "@id": "ex:label",
        "@container": "@set"
      },
      "ex": "https://triply.cc/example/",
      "xsd": "http://www.w3.org/2001/XMLSchema#"
    },
    "@type": "Object",
    "labels": {},
    "addresses": {
      "street": {},
      "number": {}
    }
  }'
```

The JSON-LD frame turns SPARQL results for the query in step 1 into a format that is accepted as plain REST API request.


#### Using SPARQL to create a frame

Another way to create a frame is by using the SPARQL editor in TriplyDB. 

You can access the JSON-LD editor by clicking the three dots next to the SPARQL editor, and then selecting "To JSON-LD frame editor".

![SPARQL editor](json-ld-navigator.png)

Afterwards, the JSON script from above should be added to the JSON-LD Frame editor.

![Ld-Frame box](json-ld-script.png)


Running the script results in the following REST-API result: 

![REST-API result](json-ld-result.png)

This can also be accessed by the generated API Link above the SPARQL editor. 
Copying and pasting the generated link will direct you to a page where you can view the script:

![](json-ld-in-api.png)

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
individual linked datasets to be queried for Triply Patterns (TP), a
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

To export the linked data, use the following path:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/download
```

#### Query parameters

By default, an export includes all linked data graphs. Use a query argument to specify a particular graph.

| _Key_       | _Value_                       | _Purpose_                                                                          |
| ----------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `graph`   | A URL-encoded IRI.            | Only download the export of the given graph IRI.           |

Therefore, to export the linked data of a **graph**, use the following path:
```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/download/?graph=GRAPH
```

To find out which graphs are available, use the following path:
```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/graphs
```
#### Example requests

Export a dataset:
```bash
curl 'https://api.triplydb.com/datasets/academy/pokemon/download' \
       -H 'Accept: application/trig' > exportDataset.trig.gz
```

Export a graph:

First, find out which graphs are available:
```bash
curl 'https://api.triplydb.com/datasets/academy/pokemon/graphs'
```

Then, download one of the graph:
```bash
curl 'curl 'https://api.triplydb.com/datasets/academy/pokemon/download?graph=https://triplydb.com/academy/pokemon/graphs/data' -H 'Accept: application/trig' > exportGraph.trig.gz
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

Notice that for professional use it is easier and better to use [saved queries](https://triply.cc/docs/triply-db-getting-started#saved-queries).  Saved queries have persistent URIs, descriptive metadata, versioning, and support for reliable large-scale pagination ([see how to use pagination with saved query API](https://triply.cc/docs/triply-db-getting-started/#pagination-with-the-saved-query-api)).  Still, if you do not have a saved query at your disposal and want to perform a custom SPARQL request against an accessible endpoint, you can do so.  TriplyDB implements the SPARQL 1.1 Query Protocol standard for this purpose.

#### Sending a SPARQL Query request

According to the SPARQL 1.1 Protocol, queries can be send in the 3 different ways that are displayed in <a href='#table-http-sparql-query'>Table 1</a>.  For small query strings it is possible to send an HTTP GET request (row 1 in <a href='#table-http-sparql-query'>Table 1</a>).  A benefit of this approach is that all information is stored in one URI.  For public data, copy/pasting this URI in a web browser runs the query.  For larger query strings it is required to send an HTTP POST request (rows 2 and 3 in <a href='#table-http-sparql-query'>Table 1</a>).  The reason for this is that longer query strings result in longer URIs when following the HTTP GET approach.  Some applications do not support longer URIs, or they even silently truncate them resulting in an error down the line.  The direct POST approach (row 3 in <a href='#table-http-sparql-query'>Table 1</a>) is the best of these 3 variants, since it most clearly communicates that it is sending a SPARQL query request (see the `Content-Type` column).

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

#### SPARQL Query result formats

SPARQL services are able to return results in different formats.  The user can specify the preferred format by specifying the corresponding Media Type in the HTTP `Accept` header.  TriplyDB supports the following Media Types.  Notice that the chosen result format must be supported for your query form.

| Result format | Media Type                        | Query forms         |
| ------------- | --------------------------------- | ------------------- |
| CSV           | `text/csv`                        | SELECT              |
| JSON          | `application/json`                | ASK, SELECT         |
| JSON-LD       | `application/ld+json`             | CONSTRUCT, DESCRIBE |
| N-Quads       | `application/n-quads`             | CONSTRUCT, DESCRIBE |
| N-Triples     | `application/n-triples`           | CONSTRUCT, DESCRIBE |
| RDF/XML       | `application/rdf+xml`             | CONSTRUCT, DESCRIBE |
| SPARQL JSON   | `application/sparql-results+json` | ASK, SELECT         |
| SPARQL XML    | `application/sparql-results+xml`  | ASK, SELECT         |
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

### Elasticsearch

The text search API returns a list of linked data entities based on a
supplied text string. The text string is matched against the text in
literals and IRIs that appear in the linked data description of the
returned entities.

The text search API is only available for a dataset after an
Elasticsearch service has been created for that dataset.

Two types of searches can be performed: a simple search, and a custom
search. Simple searches require one search term for a fuzzy match. Custom
searches accept a JSON object conforming to [the Elasticsearch query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

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
linked data entity is specified under key sequence `"_id"`.
Properties of the linked data entity are stored as IRI keys. The
values of these properties appear in a JSON array in order to allow
more than one object term per predicate term (as is often the case in
linked data).

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
