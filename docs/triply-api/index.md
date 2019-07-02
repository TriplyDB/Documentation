---
title: "Triply-API"
path: "/docs/triply-api"
---

## Datasets

Triply API requests are always directed towards a specific URI path.
URI paths will often have the following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATATSET/
```

Upper-case letter words must be replaced by the following values:

- `INSTANCE` :: The host name of the TriplyDB instance that you want
  to use.
- `ACCOUNT` :: The name of a specific user or a specific
  organization.
- `DATASET` :: The name of a specific dataset.

Here is an example of an URI path that points to the Triply API for
the Pokémon dataset:

```none
https://api.demo.triply.cc/datasets/academy/pokemon/
```

### Triple Pattern Fragments (TPF)

Triple Pattern Fragments (TPF) is a community standard that allows
individual Linked Datasets to be queries for Triply Patterns (TP), a
subset of the more complex SPARQL query language.  The Triply API
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

| *Key*       | *Value*                       | *Purpose*                                                                          |
|-------------+-------------------------------+------------------------------------------------------------------------------------|
| `subject`   | A URL-encoded IRI.            | Only return triples where the given IRI appears in the subject position.           |
| `predicate` | A URL-encoded IRI.            | Only return triples where the given IRI appears in the predicate position.         |
| `object`    | A URL-encoded IRI or literal. | Only return triples where the given IRI or literal appears in the object position. |

#### Example request

```bash
curl -G \
       'https://api.demo.triply.cc/datasets/academy/pokemon/fragments' \
       --data-urlencode 'predicate=http://www.w3.org/2000/01/rdf-schema#label' \
       -H 'Accept: application/trig'
```

## Services

Some API requests require the availability of a specific service over
the dataset. These requests are directed towards an URI path of the
following form:

```none
https://api.INSTANCE/datasets/ACCOUNT/DATASET/services/SERVICE/
```

Upper-case letter words must be replaced by the following values:

- `SERVICE` :: The name of a specific service that has been started
  for the corresponding dataset.

- See the previous section for [Datasets](#Datasets) to learn the meaning of
  `INSTANCE`, `ACCOUNT`, and `DATASET`.

Here is an example of an URI path that points to an SPARQL endpoint
over the Pokémon dataset:

```none
https://api.demo.triply.cc/datasets/academy/pokemon/services/pokemon/sparql
```

### Sparql

### Jena

### Elastic

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
