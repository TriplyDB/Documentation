[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->  text recycled from an existing page or deck, origin given
     <!- - NEW: x - ->     written for this page, with the reason
     <!- - LINK-TODO - ->  link points at a current path that will move in the restructure

     RESCUED PAGE. This is tutorial/building-a-restful-api.md, which exists in the
     repository but is not in mkdocs.yml, so it has a live URL that nothing links
     to. Content is substantially unchanged; edits are house style, three fixed
     typos, one filled gap, and the Academy footer. A redirect is required — see
     the review block. -->

# Tutorial: building a RESTful API

Applications want a REST API: a path, some query parameters, and JSON back. Your
data is a graph. This tutorial connects the two using nothing but saved SPARQL
queries and a JSON-LD frame — no service layer, no code.

The example throughout is an API path for occupations, built on the CompetentNL
data published by UWV.

It assumes [SPARQL: the basics](../sparql.md),
[construct queries](../sparql-construct-and-federation.md) and
[JSON-LD framing](json-ld-framing.md).

The design has two queries. The **iterator** decides *which* things the API
returns. The **generator** decides *what* is returned about each of them.

<!-- NEW: the two-sentence summary of the design. The source introduces the
     iterator and the generator separately and never states the division of
     labour, which is the idea the whole tutorial rests on. -->

## Part 1: Write the iterator

<!-- SOURCE: tutorial/building-a-restful-api.md — the whole of the iterator section. -->

The iterator is a SPARQL `select` query returning a sequence of bindings that
matches the query parameters the API path supports.

Our path returns occupations and supports one query parameter: the name of the
occupation, as the variable `?name`.

### With no query parameter

Start with the bindings you return when no parameter is given. Two things belong
here: a graph clause scoping to the instance data graph, which is recommended,
and the class that corresponds to the API path.

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>

select $this {
  $this a cnluwv:Occupation.
}
```

### Parameters that map onto required properties

For each query parameter, work out whether the property it maps onto is required
or optional.

Here, `?name` maps onto `skosxl:prefLabel`, which every occupation has. For a
required property, add a basic graph pattern:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>

select $this {
  $this
    a cnluwv:Occupation;
    skosxl:prefLabel/skosxl:literalForm $name.
}
```

### Parameters that map onto optional properties

An optional property needs more care, because a missing value must not remove the
result. Use this three-line template:

```sparql
bind(?ApiVar as ?ApiVar1)
optional { $this PROPERTY_PATH ?ApiVar2. }
filter(!bound(?ApiVar1) || ?ApiVar1 = ?ApiVar2)
```

Line by line:

1. The `bind` binds `?ApiVar1` only when the API variable was supplied as a query
   parameter.
2. The `optional` matches the property when it is present.
3. The `filter` lets the result through if either the parameter was not set, or
   it was set to the value found for this binding of `$this`.

Placed in context:

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

## Part 2: Write the generator

<!-- SOURCE: tutorial/building-a-restful-api.md — the whole of the generator section. -->

The generator is a `construct` query that returns one record per binding of
`$this` from the iterator. A graph has no notion of a record, so you have to say
which data belongs in one and which does not.

Start with the basic shape:

```sparql
construct {
  $this ?p1 ?o1.
} where {
  $this ?p1 ?o1.
}
```

### Connect the iterator to the generator

A `select` query can be embedded in another query as a subselect. That is how the
bindings for `$this` reach the generator:

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
        skosxl:prefLabel/skosxl:literalForm ?name.
    }
  }
  $this ?p1 ?o1.
}
```

Supply a value for `?name` and you get the triples describing that occupation.

### Reach one level deeper

The query above returns only triples directly describing `$this`. Some
information sits further away — SKOS-XL labels, for instance, put the actual text
two hops out.

To include it, add more triple patterns. Because only some properties need
following, enclose the deeper hop in an `optional`, together with a whitelist of
properties to follow or a blacklist of properties to skip:

```sparql
prefix cnluwv: <https://linkeddata.uwv.nl/ns/competentnl_uwv#>
prefix skosxl: <http://www.w3.org/2008/05/skos-xl#>

construct {
  $this ?p1 ?o1.
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

The whitelist uses `in`. A blacklist is the same construction with `not in`.

Choose deliberately here. Every extra hop makes the response larger and the query
slower, and "everything within two hops" is rarely the same as "what the
application needs".

<!-- NEW: the closing paragraph. The source explains how to reach deeper without
     mentioning that it is a trade-off. -->

## Part 3: Return clean JSON

<!-- SOURCE: tutorial/building-a-restful-api.md — the JSON-LD frame section, step by
     step. -->

The generator already behaves like an API path: set parameters, receive matching
data. By default it returns RDF serialisations such as JSON-LD, which contains
everything you need and looks messy.

A JSON-LD frame fixes the shape. Build it up one step at a time — it is worth
keeping the query open in another tab and applying each step yourself to watch the
output change.

Start empty:

```json
{}
```

### Set the type

Each object should describe one occupation. `@type` with the class IRI does that,
and the JSON immediately starts forming around the occupation node:

```json
{
  "@type": "https://linkeddata.uwv.nl/ns/competentnl_uwv#Occupation"
}
```

### Add a context

The objects are still full of long IRIs and JSON-LD syntax. The `@context` cleans
that up, and is usually identical across every object an API returns.

Three keys to start: `@base` for the namespace of the instances, `@version` for
the JSON-LD version, and `@vocab` for the main vocabulary. With `@vocab` set, the
type shortens to `Occupation`:

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

### Declare prefixes, then rename the keys

Prefix declarations shorten keys and values. Going further, you can map keys onto
completely different names — including names in Dutch — and rename the awkward
`@id` and `@type` while you are there:

```json
{
  "@context": {
    "@base": "https://linkeddata.uwv.nl/id/",
    "@version": 1.1,
    "@vocab": "https://linkeddata.uwv.nl/ns/competentnl_uwv#",
    "altLabel": "skosxl:altLabel",
    "broadMatch": "skos:broadMatch",
    "cnl": "https://linkeddata.uwv.nl/ns/competentnl_uwv#",
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

Every key is now a plain word. Only `@context` itself cannot be renamed.

### Hide datatypes and language tags

A typed value still arrives with its machinery showing:

```json
"created": {
  "type": "xsd:dateTime",
  "@value": "2024-12-09T00:00:00"
}
```

Declare the datatype in the context and the value collapses to a plain string:

```json
"created": { "@id": "dct:created", "@type": "xsd:dateTime" }
```

Language tags work the same way:

```json
"literalForm": { "@id": "skosxl:literalForm", "@language": "nl" }
```

### Scoped contexts

A context entry can carry its own nested context, which applies only inside that
property. Use it when a term needs different treatment depending on where it
appears — here, `literalForm` is declared Dutch only when it occurs inside an
`altLabel`:

<!-- NEW: the paragraph above. The source has this section as a bare code block with
     no explanation at all. Please check that the description matches the intent. -->

```json
{
  "@context": {
    "altLabel": {
      "@id": "skosxl:altLabel",
      "@context": {
        "literalForm": {
          "@id": "skosxl:literalForm",
          "@language": "nl"
        }
      }
    }
  }
}
```

## Part 4: Use the API

<!-- SOURCE: tutorial/building-a-restful-api.md — the OpenAPI section. -->

With the queries saved, the API is available through an OpenAPI specification:

1. Create an API token in TriplyDB.
   <!-- LINK-TODO: repoint to access-security/api-tokens.md once the orphan page moves -->
   See [API token](../../generics/api-token.md).
2. Configure that token as an HTTP bearer token in your HTTP client.
3. Set the `Accept` header to `text/vnd.yaml`, the format of an OpenAPI
   specification.
4. Request `https://${host}/queries/${account}/`, using your Triply host and the
   account the queries are saved under.

That returns an OpenAPI specification describing every query under the account.
For one specific version, request
`https://${host}/queries/${account}/${query}/${version}`.

Load the YAML into your HTTP client, keep the token configured, and every saved
query is now a REST path you can call.

## What you now have

A REST API backed entirely by saved SPARQL queries: parameters that behave like
query parameters, JSON that looks hand-designed, and an OpenAPI specification that
any client can import. Changing what the API returns is editing a query, not
deploying code.

## Continue in the Academy

- [JSON-LD framing](json-ld-framing.md) — the framing step on its own
- [Graph patterns](../sparql-graph-patterns.md) — `optional`, `filter` and property
  paths, all used above
- [SKOS](../skos.md) — the vocabulary model behind the example data
- [All tutorials](index.md)
- [Glossary](../glossary.md) — every term on this page, in one place

[← Back to the Triply Academy](../index.md)

---

## ⚠ Needs input before publishing

- **This is a rescued page.** `tutorial/building-a-restful-api.md` is in the
  repository but not in `mkdocs.yml`. Moving it **requires a redirect**: add
  `'tutorial/building-a-restful-api.md': 'academy/tutorials/restful-api.md'`
  to `redirect_maps`.
- **Three fixes made to the original.** A typo ("binfing" → "binding"); a missing
  verb ("and the following 3-line template" → "add the following…"); and a broken
  placeholder in the OpenAPI URL (`$[account}` → `${account}`).
- **Variable notation normalised.** The source mixes `?this` and `$this`, sometimes
  within one query. They are identical in SPARQL, so this changes nothing, but the
  page now uses `$this` throughout.
- **The optional-parameter template is never resolved.** `?ApiVar` and
  `PROPERTY_PATH` stay as placeholders, and the worked example only covers the
  required-property case. A reader with an optional parameter has to invent the
  rest. Worth completing with a real second parameter — this is the largest gap in
  the tutorial.
- **The scoped-contexts section had no text at all** in the original, only a code
  block. I have written a description of what it does; please confirm it matches
  the intent.
- **The example query is under a personal account**:
  `uwv.triplydb.com/wouter/-/queries/jsonld`. Same concern as the framing tutorial
  — worth republishing under an official account before this is linked from the
  Academy.
- **Confirm the UWV example may be used publicly**, and that the CompetentNL
  namespaces are current.
- **Two additions are marked in the source**: the iterator/generator division of
  labour in the introduction, and the caution about extra hops.
- **Add to `mkdocs.yml`** under a Tutorials group:
  `- Building a RESTful API: academy/tutorials/restful-api.md`