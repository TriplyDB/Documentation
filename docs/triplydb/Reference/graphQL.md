<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: a merge of two places —
       - generics/Graphql.md (orphaned: in the repository, absent from mkdocs.yml)
       - viewing-data/index.md, the "GraphQL" section, which is now a pointer here
     Content is substantially unchanged. The YAML front matter of the orphan
     (title, path /docs/graphql) was dropped — see the review block.
     Two redirects required. -->

# GraphQL

Some TriplyDB instances expose a GraphQL endpoint. The schema is not written by
hand: it is generated from the SHACL shapes in your dataset.

This page describes Triply's implementation. For GraphQL itself, see
[graphql.org](https://graphql.org/). It assumes you are familiar with SHACL — if
you are not, start with [SHACL](../../academy/shacl.md).

Throughout this page, **object** means a resource. Where the third element of a
triple is meant, it is called a **triple object**.

<!-- SOURCE: generics/Graphql.md — the whole of that page, plus the three-sentence
     GraphQL section from viewing-data/index.md. -->

## What SHACL produces

<!-- NEW: this summary table. The source explains each mapping in prose across
     five subsections; on a reference page, the whole mapping should be visible
     at once. Everything in it is stated somewhere below. -->

| In your shapes | In the schema |
| --- | --- |
| `sh:targetClass` on a node shape | An object type, named after the class |
| `sh:path` on a property shape | A field, named after the property |
| No cardinality constraint | The field returns an array |
| `sh:maxCount 1` | The field returns a single value |
| `sh:minCount 1` **and** `sh:maxCount 1` | The field is non-null |
| `sh:datatype` | The field returns a GraphQL scalar |
| `sh:class`, pointing at a targeted class | The field returns that object type |
| `sh:class`, pointing at an untargeted class | The field returns `ExternalIri` |
| `sh:uniqueLang` | A language-filtered field returns one value, not an array |
| `triply:graphqlName` | A custom name for the type or field |

## Schema

### Object types

An object type represents a kind of resource you can query.

```graphql
type Book {
  id:ID!
  title:[XsdString]!
}
```

That type comes from this shape:

```turtle
shp:Book
  a sh:NodeShape;
  sh:targetClass sdo:Book;
  sh:property
    [ sh:path dc:title;
      sh:datatype xsd:string ].
```

### Fields

Fields represent properties. By default a field returns an array of values. The
exception is a property with `sh:maxCount 1`, which returns a single value:

```turtle
shp:Book
  a sh:NodeShape;
  sh:targetClass sdo:Book;
  sh:property
    [ sh:path dc:title;
      sh:maxCount 1;
      sh:datatype xsd:string ].
```

```graphql
type Book {
  id:ID!
  title:XsdString
}
```

Following GraphQL's
[nullability best practice](https://graphql.org/learn/best-practices/#nullability),
fields may return null. Three things never do:

- IDs, which hold the IRI of the resource
- Lists — though their elements may be null
- Properties with both `sh:minCount 1` and `sh:maxCount 1`

So this shape:

```turtle
shp:Book
  a sh:NodeShape;
  sh:targetClass sdo:Book;
  sh:property
    [ sh:path dc:title;
      sh:maxCount 1;
      sh:minCount 1;
      sh:datatype xsd:string ].
```

produces a non-null field:

```graphql
type Book {
  id:ID!
  title:XsdString!
}
```

**What a field returns** depends on how the property shape constrains it. With
`sh:datatype`, values come back as a GraphQL scalar, as above. With `sh:class`,
it depends on whether that class is targeted by a node shape:

- If it is, the field returns the corresponding object type.
- If it is not, the field returns `ExternalIri`.

```turtle
shp:Book
  a sh:NodeShape;
  sh:targetClass sdo:Book;
  sh:property
    [ sh:path sdo:author;
      sh:class sdo:Person ];
    [ sh:path sdo:audio;
      sh:class sdo:AudioObject ].

shp:Person
  a sh:NodeShape;
  sh:targetClass sdo:Person;
  sh:property
    [ sh:path sdo:name;
      sh:datatype xsd:string ].
```

`sdo:Person` is targeted by a node shape and `sdo:AudioObject` is not, which is
why the two fields differ:

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

### The id field

`id` is of type `ID` and holds the IRI of the resource, so it is unique. For:

```turtle
book:Odyssey
  a sdo:Book;
  dct:title "Odyssey".
```

the `id` is `https://example.org/book/Odyssey`.

See [scalar types](https://graphql.org/learn/schema/#scalar-types) for the `ID`
scalar, and [global object identification](#global-object-identification) below
for what `id` is used for.

### Naming

Names are derived from the shapes:

- Object types take the `sh:targetClass` of the node shape.
- Fields take the `sh:path` of the property shape.

In both cases the name is the part of the IRI after the last `#`, or failing
that the last `/`, converted from kebab-case to camelCase.

If the resulting name is illegal or collides with another, the type or field is
ignored and an error explains why.

#### Custom names

Shape designers can override those names with the property
`<https://triplydb.com/Triply/GraphQL/def/graphqlName>`. Add a triple whose
subject is the class IRI (for an object type) or the property shape IRI (for a
field), with the custom name as a string literal:

```turtle
shp:Book
  a sh:NodeShape;
  sh:targetClass sdo:Book;
  sh:property
    [ sh:path dc:title;
      triply:graphqlName "name";     # renames the field
      sh:datatype xsd:string ].

sdo:Book
  triply:graphqlName "PieceOfArt".   # renames the object type
```

```graphql
type PieceOfArt {
  id:ID!
  name:[XsdString]!
}
```

## Queries

You can query an object by its unique ID, query all objects of a type together
with their fields, nest one type inside another, and filter results.

### Global object identification

Querying an object by ID — useful for caching, among other things — uses the
`node(id:ID)` query:

```graphql
{
  node(id: "https://example.org/book/Odyssey") {
    id
  }
}
```

See the [global object identification specification](https://graphql.org/learn/global-object-identification/).

### Pagination

A straightforward query looks like this:

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

It returns the IRIs of books with their titles, paginated. Pagination is
cursor-based, using connections, as described in the Relay project's
[cursor connections specification](https://relay.dev/graphql/connections.htm).

### Filtering

Filter to get back only resources whose fields hold particular values.

#### Filtering on an ID

Filtering on an IRI takes the value directly, with no operator:

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

#### Filtering on a scalar

Filtering on a field whose values are literals uses a comparison operator:

| Operator | Matches |
| --- | --- |
| `eq` | Equal to a value |
| `in` | Present in a list |
| `notEq` | Not equal to a value |
| `notIn` | Absent from a list |

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

<!-- NEW: the operators were a sentence in the source; a table suits a reference
     page better. Wording unchanged. -->

One case is different. A literal with a language tag has the datatype
`rdf:langString` and the scalar `RdfsLangString`, and is represented as
`{ value: "example-string", language: "en" }`. Filtering on one therefore takes an
object rather than a string:

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

#### Filtering by language

A field can also be asked for a particular language. Given this data and shape:

```turtle
person:Odysseus
  a sdo:Person;
  sdo:name
    "Odysseus"@en,
    "Οδυσσεύς"@gr.

shp:Person
  a sh:NodeShape;
  sh:targetClass sdo:Person;
  sh:property
    [ sh:path sdo:name;
      sh:datatype rdf:langString ].
```

this query:

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

returns only the Greek name:

```json
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Odysseus",
            "name": [
              { "value": "Οδυσσεύς", "language": "gr" }
            ]
          }
        }
      ]
    }
  }
}
```

The `language` argument accepts HTTP `Accept-Language` syntax, so you can express
a preference order rather than a single choice:

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

```json
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Odysseus",
            "name": [
              { "value": "Οδυσσεύς", "language": "gr" },
              { "value": "Odysseus", "language": "en" }
            ]
          }
        }
      ]
    }
  }
}
```

Add `sh:uniqueLang true` to the property shape and the same query returns a single
value instead of an array:

```turtle
shp:Person
  a sh:NodeShape;
  sh:targetClass sdo:Person;
  sh:property
    [ sh:path sdo:name;
      sh:uniqueLang true;
      sh:datatype rdf:langString ].
```

```json
{
  "data": {
    "PersonConnection": {
      "edges": [
        {
          "node": {
            "id": "https://example.org/person/Odysseus",
            "name": { "value": "Οδυσσεύς", "language": "gr" }
          }
        }
      ]
    }
  }
}
```

#### Nested and combined filters

Filters can reach into a nested type:

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

and several can be combined:

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

Combined filters are evaluated with **and** logic. There is no **or**.

<!-- NEW: "There is no or." The source states the and logic without saying what is
     absent, which is the question a reader has next. Confirm this is accurate. -->

## Related

- [SHACL](../../academy/shacl.md) — the shapes this schema is generated from
- [View data](../How-to/view-data.md) — where GraphQL sits among the query options
- [Triply API](../../triply-api/index.md) — endpoint reference

