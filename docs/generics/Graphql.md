---
title: "GraphQL endpoint"
path: "/docs/graphql"
---

[TOC]

# Graphql endpoint
TriplyDB exposes a GraphQL endpoint. This endpoint uses information from user-provided SHACL shapes for the schema creation.

The goal of this documentation is to inform users about Triply's implementation of the GraphQL endpoint. For more generic information about GraphQL, you can visit [graphql.org](https://graphql.org/) or other resources. In order to understand this documentation, you have to be familiar with the SHACL language.

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
- Properties that have `sh:minCount 1` and `sh:maxCount 1`

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
The id field is of type ID, which represents the IRI of each object. This ID is unique.
For example:
```turtle
book:Odyssey a sdo:Book;
           dc:title "Odyssey".
```
The id field of this resource would be `https://example.org/book/Odyssey`.
You can read more information on the `ID` scalar in [graphql.org](https://graphql.org/learn/schema/#scalar-types). Also, the use of the `id` field is mentioned later in the section [Object Global Identification](#global-object-identification).

#### Naming
In order to name the GraphQL types in correspondence to shapes, we follow the below conventions:
- For object types, we use the `sh:targetClass` of the node shape.
- For object type fields, we use the `sh:path` of the property shape.

More specifically, the name comes from the part of the IRI after the last `#` or otherwise the last `/`, converted from kebab-case to camelCase. 

Notice that if the selected name is illegal or causes a name collision, we'll return an error informing the user about the problem and ignore this type or field. 

 ##### Renaming
 Shape designers are able use their custom names by using a special property: `<https://triplydb.com/Triply/GraphQL/def/graphqlName>`.
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
           triply:graphqlName "name" // Renaming the object type field
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


The only idiomatic case is the literal with a language tag and `rdf:langString` as a datatype. This literal is represented as ` { value: "example-string", language: "en" }` and the corresponding scalar is `RdfsLangString` . This means that in order to filter using a value of this scalar type, you have to execute the query below:

```graphql
{
  PersonConnection(filter: {name: {eq: {value: "Odysseus", language: "en"}}}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```
##### Language filtering
Additionally, there is support for filtering results based on the language tag.
An example is:
- Linked data:
```turtle
person:Odysseus a sdo:Person;
              sdo:name "Odysseus"@en;
              sdo:name "Οδυσσεύς"@gr.


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
            "id": "https://example.org/person/Odysseus",
            "name": [
              {
                "value": "Οδυσσεύς",
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
Our implementation supports using the HTTP Accept-Language syntax, for filtering based on a language-tag.
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
            "id": "https://example.org/person/Odysseus",
            "name": [
              {
                "value": "Οδυσσεύς",
                "language": "gr"
              },
              {
                "value": "Odysseus",
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

If the writer of the shapes includes the `sh:uniqueLang` constraint, then the result returned will be a single value, instead of an array.
Thus, the example becomes:
- Linked data:
```turtle
person:Odysseus a sdo:Person;
              sdo:name "Odysseus"@en;
              sdo:name "Οδυσσεύς"@gr.


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
            "id": "https://example.org/person/Odysseus",
            "name": {
              "value": "Οδυσσεύς",
              "language": "gr"
            }
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