# Building a RESTful API

## Write the Iterator

The iterator is a SPARQL Select query that returns a sequence of bindings that adheres to the query parameters supported for the REST API path.

For example, a REST API path for occupations returns bindings for individual occupations, and has the following query parameters:

- The name of the occupation (variable `?name`)

### Configuration in case no query parameter is specified

The first part of the query string returns the sequence of bindings in case no query parameter is specified. It includes the following things:
- Recommended: a graph-clause that scopes to the instance data graph.
- The class that corresponds to the REST API path (example: `cnluwv:Occupation`).

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
select $this {
  $this
    a cnluwv:Occupation.
}
```

### Configuration for query parameters that map onto required properties

For every query parameter, determine whether it is mapped into a property that is required or optional.

In our example, query parameter `?name` maps onto property `skosxl:prefLabel`, which is required for every occupation.

For each required property, add a Basic Graph Pattern:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
select $this {
  $this
    a cnluwv:Occupation;
    skosxl:prefLabel/skosxl:literalForm $name.
}
```

### Configuration for query parameters that map onto optional properties

For every query parameter that maps onto a property that is optional, and the following 3-line template:

```sparql
bind(?ApiVar as ?ApiVar1)
optional { $this PROPERTY_PATH ?ApiVar2. }
filter(!bound(?ApiVar1) || ?ApiVar1 = ?ApiVar2)
```

We explain each line in detail:

1. The Bind clause makes sure that `?ApiVar1` is only bound if the API variable is specified through a query parameter.
2. The Optional clause makes sure that we match the optional property, if it is present.
3. The Filter clause ensures that the query succeeds if either the query parameter was not set, or if the query parameter was set to the value of the current binfing for `$this`.

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
select $this {
  $this
    a cnluwv:Occupation;
    skosxl:prefLabel/skosxl:literalForm $name.
  bind(?ApiVar as ?ApiVar1)
  optional { $this PROPERTY_PATH ?ApiVar2. }
  filter(!bound(?ApiVar1) || ?ApiVar1 = ?ApiVar2)
}
```

### Full example

The following query is an example of an Iterator:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
select $this {
  $this
    a cnluwv:Occupation;
    skosxl:prefLabel/skosxl:literalForm $name
}
```

## Write the Generator

The Generator is a SPARQL Construct query that returns one record for each binding of the `$this` variable in our Iterator. Since we are working with linked data graphs, there is no real notion of a 'record'. This requires us to configure which data items we want to include, and which we want to exclude.

### The basic Construct query

Since our Generator will be a Construct query, we can start out with the following basic query, which return triples from our graph:

```sparql
construct {
  $this ?p1 ?o1.
} where {
  $this ?p1 ?o1.
}
```

We have used the same variable name `$this` as in our Iterator, but this is merely a naming convention. We must do some extra work to connect the bindings from our Iterator to our Generator...

### Integrate the Iterator into the Generator

In SPARQL, we can integrate any Select query into what is called a Sub-Select clause. This allows us to connect the binding for `$this` that come out of our [Iterator](#write-the-iterator), to [the basic template in our Generator](#the-basic-construct-query):

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
construct {
  $this ?p1 ?o1.
} where {
  {
    select $this {
      $this
        a cnluwv:Occupation;
        skosxl:prefLabel/skosxl:literalForm ?name
    }
  }
  $this ?p1 ?o1.
}
```

If we specify a query parameter for `?name`, we get back the triples that describe the occupation with that name (Basic Triple Pattern `$this ?p1 ?o1`).

### Extend the Generator with nested information

In [the previous section](#integrate-the-iterator-into-the-generator), we only returned the triples that directly describe the bindings for `$this`. However, some relevant information may appear in triples that are further removed from `$this`. For example, SKOS-XL labels use an extra level of nesting, where the actual label content appears 2-hops away from `$this`.

If we want to include such nested information into our Generate, we must specify this with additional Basic Triple Patterns. Since only some properties use nesting, we must typically enclose deeper hops inside an Optional clause, together with either a whitelist of properties we want to follow, or a blacklist of properties we do not want to follow.

In the following example, we use a whitelist to include properties whose textual content is found one nesting level deeper:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
construct {
  ?this ?p1 ?o1.
  ?o1 ?p2 ?o2.
} where {
  {
    select $this {
      $this
        a cnluwv:Occupation;
        skosxl:prefLabel/skosxl:literalForm $name.
    }
  }
  $this ?p1 ?o1.
  optional {
    ?o1 ?p2 ?o2.
    filter(?p1 in (cnluwv:hasContentStatus,
                   cnluwv:hasDetailedDescription,
                   skosxl:altLabel,
                   skosxl:prefLabel))
  }
}
```

Notice that the whitelist is implemented with operator `in`; blacklists are similarly implemented with operator `not in`.

### Full example

The following query is an example of a working Generator query:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>
construct {
  ?this ?p1 ?o1.
  ?o1 ?p2 ?o2.
} where {
  {
    select $this {
      $this
        a cnluwv:Occupation;
        skosxl:prefLabel/skosxl:literalForm $name.
    }
  }
  $this ?p1 ?o1.
  optional {
    ?o1 ?p2 ?o2.
    filter(?p1 in (cnluwv:hasContentStatus,
                   cnluwv:hasDetailedDescription,
                   skosxl:altLabel,
                   skosxl:prefLabel)) }
}
```

## Returning JSON

From a content perspective, our Generator query functions like a REST API path: we can set zero or more query parameters, and we receive the information that conforms to our configuration. By default, the Generator returns various RDF serializations, such as JSON-LD. While the JSON body contains all the relevant information, the syntactic structure of the body looks quite messy.

### Adding a JSON-LD Frame

In order to better structure the syntax of the returned JSON body, we make use of a JSON-LD Frame. We start out with the empty frame, and will build this out in subsequent steps:

```json
{}
```

You can try this out by going to the following query: [link](https://uwv.triplydb.com/wouter/-/queries/jsonld)
In fact, it is best to keep this query open in a separate window or tab, and apply each of the following steps yourself, to see the live effects of changing the JSON-LD Frame configuration.

### Configure the type

We want the JSON objects to describe information of a specific type.

In our example, each object should describe an occupation.

We can configure this in the JSON-LD Frame by using the `"@type"` key, together with the IRI of the occupation class:

```json
{
  "@type": "https://linkeddata.uwv.nl/ns/competentnl_uwv#Occupation"
}
```

We now see that the JSON data starts to form around the occupation node.

### Configure the context

The JSON object that describes an occupation contains a lot of confusing syntax and lengthy IRIs. The JSON-LD standard allows us to clean this up through a piece of configuration called the Context. The context is typically the same for all objects that are returned by an API.

The context is itself a JSON object, that is specified under the `"@context"` key. We start by including the following sub-keys:

- '`"@base"` configures the IRI namespace of the instances.
- `"@version"` indicates which JSON-LD version we use.
- `"@vocab"` configures the IRI namespace of the main vocabulary that is used.

We can now abbreviate the configuration for `"@type"` to `"Occupation"`. This will make use of the occupation class within the IRI namespace that is specified under `"@vocab"`:

```json
{
  "@context": {
    "@base": "https://linkeddata.uwv.nl/id/",
    "@version": 1.1,
    "@vocab": "https://linkeddata.uwv.nl/ns/competentnl_uwv#"
  },
  "@type": "Occupation"
}
```

### Add IRI prefix declarations

We can add IRI prefix declarations to the Context. This results in shorted keys and values in the JSON objects:

```json
{
  "@context": {
    "cnl": "https://linkeddata.uwv.nl/ns/competentnl_uwv#",
    "dct": "http://purl.org/dc/terms/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "skosxl": "http://www.w3.org/2008/05/skos-xl#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    ...
  }
}
```

### Configure key names

While [adding IRI prefix declarations](#add-iri-prefix-declarations) makes many keys and values shorter, we can go one step further and use completely different key names that map onto IRIs. This allows us to add keys in a different language (e.g. in Dutch), or it allows us to get rid of the IRI alias that was still included after adding IRI prefix declarations.

Furthermore, we can introduce our own names for the somewhat awkward looking keys `"@id"` and `"@type"`.

The following Context results in keys that consist in simple names, devoid of any (abbreviated or full) IRIs, and devoid of strange @-signs (except for the Context key, which cannot be renamed):

```json
{
  "@context": {
    "@base": "https://linkeddata.uwv.nl/id/",
    "@version": 1.1,
    "@vocab": "https://linkeddata.uwv.nl/ns/competentnl_uwv#",
    "altLabel": "skosxl:altLabel",
    "cnl": "https://linkeddata.uwv.nl/ns/competentnl_uwv#",
    "broadMatch": "skos:broadMatch",
    "created": "dct:created",
    "dct": "http://purl.org/dc/terms/",
    "id": "@id",
    "inScheme": "skos:inScheme",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "relatedMatch": "skos:relatedMatch",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "skosxl": "http://www.w3.org/2008/05/skos-xl#",
    "type": "@type",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "type": "Occupation"
}
```

### Configure datatypes

We still have too much syntactic clutter for values with a datatype. For example, this is how a created date is shown:

```json
{
  "@context": {
    ...
  },
  ...,
  "created": {
    "type": "xsd:dateTime",
    "@value": "2024-12-09T00:00:00"
  },
  ...
}
```

Again, we can use the Context to hide unnecessary details from the JSON object. The following entry specifies that the datatype of 'created' values is XML Schema Datatypes (XSD) date/time:

```json
{
  "@context": {
    ...,
    "created": { "@id": "dct:created", "@type": "xsd:dateTime" },
    ...
  }
}
```

### Configure languages

We still have too much syntactic clutter for values with a language tag. For example, this is how a literal form is shown:

```json
{
  "@context": {
    ...
  },
  ...,
  "literalForm": {
    "@language": "nl",
    "@value": "medewerker archief"
  },
  ...
}
```

Again, we can use the Context to hide unnecessary details from the JSON object. The following entry specifies that the language of 'literalForm' values is Dutch ('nl'):

```json
{
  "@context": {
    ...,
    "literalForm": { "@id": "skosxl:literalForm", "@language": "nl" },
    ...
  }
}
```

### Scoped contexts

```json
{
  "@context": {
    ...,
    "altLabel": {
      "@id": "skosxl:altLabel",
      "@context": {
        "literalForm": {
          "@id": "skosxl:literalForm",
          "@language": "nl"
        }
      }
    },
    ...
  },
  ...
}
```

## Using the RESTful API

Once a couple of SPARQL queries have been specified, it is possible to use the REST API through an OpenAPI Specification.

This is done by the following these steps:

1. Create an API Token in the Triply GUI.
2. Go to an HTTPS program, and configure the API Token as an HTTPS Bearer Token.
3. Specify the standard Accept header for YAML, the format used by the OpenAPI Specification: `text/vnd.yaml`
4. Perform an HTTPS request against URL `https://${host}/queries/$[account}/`, where you enter the host name of your Triply environment and the name of the account under which the queries are stored.

This downloads the OpenAPI Specification that contains metadata about all queries under the specified account.

If you want to retrieve the metadata for one specific query version, change the URL in item 4 to `https://${host}/queries/$[account}/${query}/${version}`

Load the OpenAPI Specification YAML file into an HTTPS program. With the same API Token configured, you can now easily submit queries to the various REST paths.
