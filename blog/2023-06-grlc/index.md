---
title: "GRLC query metadata support in TriplyDB"
#path: "/blog/2023-06-grlc"
date: "2023-06-14T12:00:00"
---

Linked data is a great paradigm for storing metadata. But SPARQL, the primary linked data query language, has always lacked a standardized way to store query metadata. To fill this missing feature, the GRLC metadata format was developed in the CLARIAH project. As a commercial partner of CLARIAH, Triply has added support for the GRLC format to its TriplyDB product. In this blog post you learn what the GRLC format is, what you can do with it, and how it is supported by TriplyDB.

## What is GRLC?

GRLC is a format that allows you to store metadata inside SPARQL queries.

By storing metadata in a predictable way, GRLC annotations can be interpreted by applications.

One specific application for the GRLC format is the creation of a RESTful API based on a directory of GRLC-annotated SPARQL queries in a Github repository. But the GRLC format can be used by other applications as well. See the [GRLC website](http://grlc.io/) for more information about the format.

## A concrete example

We can illustrate why GRLC is useful with a simple example. Suppose somebody gives us the following SPARQL query:

```sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>
construct where { ?pokemon vocab:type ?type. }
limit 200
```

This is a syntactically valid query, but we do not know anything about how it should be used. For example, we do not know against which dataset we should run this query. We also lack the context in which this query was originally written, so we may not understand its purpose.

In TriplyDB, the author of a query can specify the specific dataset and SPARQL endpoint against which the query should be run. In addition, the author of the query can add a human-readable description that explains the intention behind the query. The following screenshot shows how metadata is edited and stored in TriplyDB. See the [TriplyDB  documentation](/docs/triply-db-getting-started#query-metadata) for more information.

![Metadata fields for a Saved Query in TriplyDB](saved-query-metadata.png)

When the query from this screenshot is accessed through the TriplyDB API, the following query string is obtained:

```sparql
#+ description: This query shows a small subgraph of Pokémon that center around their type. This makes it easy to see clusters of Pokémon with the same type.
#+ endpoint: https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
prefix vocab: <https://triplydb.com/academy/pokemon/vocab/>
construct where { ?pokemon vocab:type ?type. }
limit 200
```

Notice that this gives a lot more information to the user:
- It tells us where we can send this query to in order to retrieve the result (GRLC annotation `endpoint`).
- It tells us what the intention behind the query is: it intends to show Pokémon clustered per type (GRLC annotation `description`).

By adding more GRLC annotations, query metadata can be provided to aid other applications. This makes SPARQL queries more useful.

## How was GRLC created?

GRLC was developed in the [CLARIAH project](https://www.clariah.nl). The CLARIAH project builds a national infrastructure for the Digital Humanities in The Netherlands. It makes extensive use of linked data, and GRLC is an example of one of the many linked data innovation that were established in CLARIAH. GRLC was developed by researcher Albert Meroño-Peñuela (now at King's College London).

As a commercial partner of the CLARIAH project, Triply supports the GRLC format in its TriplyDB product. A growing number of other linked data products and projects are supporting GRLC as well. Because GRLC annotations are represented in a format that is compatible with the open SPARQL standard, GRLC solutions are vendor-independent and can be used across a growing number of products and components.

## Retrieving the GRLC format

To retrieve the GRLC metadata from a Saved Query in TriplyDB, you need to send an HTTP GET request to the TriplyDB API. The request should specify the desired response format as `text/plain` to receive the query string with GRLC annotations.

Here is an example that retrieves the GRLC format for the Pokémon query that we used above:

```sh
curl -vL -H 'Accept: text/plain' 'https://api.triplydb.com/queries/JD/pokemonNetwork'
```

See the [TriplyDB API documentation](/docs/triply-api#grlc) for more information.

## Using GRLC metadata in applications

Now that you know how to retrieve query metadata in the GRLC format, you can use it in your linked data applications. Here are some ways in which GRLC is used today:

1. **Storing Queries**: You can store your GRLC-formatted queries in text files. You can put these files under version control to track changes. The metadata annotations within the queries provide valuable context and documentation, making it easier to understand and review the queries as they evolve over time.

2. **Use in linked data clients**: You can use your GRLC-formatted queries in linked data clients that support this format. These clients can use the metadata annotations to provide additional functionalities. For example, the endpoint annotation can be used to dynamically execute the query against the intended endpoint, retrieve the data, and process it further.

3. **API development**: If you are building a RESTful API over SPARQL queries, you can store your GRLC-formatted queries in a Github repository. By parsing the GRLC annotations in Github, GRLC tools are able to automatically generate API documentation for your dataset.

See the [GRLC website](http://grlc.io/) for more information about these use cases.
