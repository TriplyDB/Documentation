---
title: "JSON-LD frames"
path: "/docs/jsonld-frames"
---

# What are JSON-LD frames

Linked data queries most often support two ways of returning results. Either in flat dataformat, for example `.csv`, where each result is a separate line or record. Or as a set of linked data triples. An unordered list, in a data formats such as `.ttl` or `.nq`. The data can be interpreted by linked data tooling but the data does not follow a predefined structure. When a REST-API is queried the data is returned according to a predefined structure. The API already knows beforehand how the data will look like. With JSON-LD frames there now is a way to create predefined REST-APIs.

JSON-LD frames are a deterministic translation from a graph, which has an unordered set of triples where no node is "first" or special", into a tree, which has ordered branches and exactly one "root" node. In other words, JSON-LD framing allows one to force a specific tree layout to a JSON-LD document. This makes it possible to translate SPARQL queries to REST-APIs.

The TriplyDB API for saved queries has been equipped with a JSON-LD profiler which can apply a JSON-LD profile to a JSON-LD result, transforming the plain JSON-LD to framed JSON. To do this you'll need two things. A SPARQL construct query and a JSON-LD frame. When you have both of these, you can retrieve plain JSON from a SPARQL query. The revelant cURL command when both the SPARQL query and JSON-LD frame are available is:

```bash
curl -X POST [SAVED-QUERY-URL] \
  -H 'Accept: application/ld+json;profile=http://www.w3.org/ns/json-ld#framed' \
  -H 'Authorization: Bearer [YOUR_TOKEN]' \
  -H 'Content-type: application/json' \
  -d '[YOUR_FRAME]'
```

When sending a curl request, a few things are important. First, the request needs to be a `POST` request. Only a `POST` request can accept a frame as a body. The `Accept` header needs to be set to a specific value. The `Accept` header needs to have both expected returned content-type and the JSON-LD profile, e.g. `application/ld+json;profile=http://www.w3.org/ns/json-ld#framed`. When querying an internal or private query you'll need to add an authorization token. Finally, it important to set the `Content-type`. It the content-type of the input body and needs to be `application/json`, as the frame is of type `application/json`.

# The SPARQL Query  

Let's start with the SPARQL query. In contrast of what you expect instead of using a SPARQL `SELECT` query, a JSON-LD frame query needs a SPARQL construct query. A SPARQL `CONSTRUCT` query creates an RDF graph that is self contained and populated with relevant vocabulary and data. The graph in JSON-LD is used as one input for the REST API call. The SPARQL `CONSTRUCT` query can be designed with API variables.

Do note that API variables with can sometimes behave a bit different than regular API variables. This is due how SPARQL interprets `OPTIONAL`s. If a API variable is used in an `OPTIONAL` the query will return false positives, as the `OPTIONAL` does not filter out results matching the API-variable.

Do note that the use of `UNION`s can have unexpected effects on the SPARQL query. A union could split up the resultset of the SPARQL query. Meaning that the SPARQL engine first exhausts the top part of the `UNION` and then starts with the second part of the `UNION`. This means that the first part of the resultset can be disconnected from the second part. If the limit is set too small the resultset is separated in two different JSON-LD documents. This could result in missing data in the response.

Do note that it can happen that you set a `pageSize` of `10` but the response contains less than `10` results, while the next page is not empty. This is possible as the resultset of the `WHERE` clause is limited with a limit and not the `CONSTRUCT` clause. This means that a two rows of the resulting `WHERE` clause are condensed into a single result in the `CONSTRUCT` clause. Thus response of the API can differ from the `pageSize`.  

The result is a set of triples according to the query variably. Saving the SPARQL query will resolve in a saved query. The saved query has an API URL that we can now use in our cURL command. The URL most of the time starts with `api` and ends with `run`.

The saved query url of an example query is:
```bash
https://api.triplydb.com/queries/JD/JSON-LD-frame/run
```
Where you can use API variables with the `?` e.g. `?[queryVariable]=[value]`

# The Frame

Only the SPARQL query is not enough to provide the RDF data in a JSON serialization format. It requires additional syntactic conformities that cannot be provided by a SPARQL query. Thus the SPARQL query that was created needs a frame to restructure JSON-LD objects into JSON. The JSON-LD 1.1 standard allows for restructuring JSON-LD objects with a frame to JSON.

A JSON-LD frame consists out of 2 parts. The `@context` of the response, and the structure of the response. The complete specification on JSON-LD frames can be found [online](https://w3c.github.io/json-ld-framing/)

The `@context` is the translation of the linked data to a the JSON naming. In the `@context` all the IRIs that occur in the JSON-LD response are documented, with key-value pairs, where the key corresponds to a name the IRI will take in the REST-API response and the value corresponds to the IRI in the JSON-LD response. Most of the time the key-value pairs are one-to-one relations, where one key is mapped to a single string. Sometimes the value is an object. The object contains at least the `@id`, which is the IRI in the JSON-LD response. The object can also contain other modifiers, that change the REST-API response. Examples are, `@type` to define the datatype of the object value, or "@container" to define the containerwhere the value in the REST-API response is stored in. The context can also hold references to vocabularies or prefixes.

The second part of the JSON-LD frame is the structure of the data. The structure defines how the REST-API response will look like. Most of the time the structure starts with `@type` to denote the type that the rootnode should have. Setting the `@type` is the most straightforward way of selecting your rootnode. The structure is built outward from the rootnode. You can define a leafnode in the structure by adding a opening and closing bracket, as shown in the example. To define a nested node you first need to define the key that is a object property in the JSON-LD response that points to another IRI. Then from that IRI the node is created filling in the properties of that node.

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

The JSON-LD frame will turn SPARQL results for the query in step 1 into a format that is accepted as plain REST API request.
