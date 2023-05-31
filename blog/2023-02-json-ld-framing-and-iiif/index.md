---
title: "IIIF support in TriplyDB"
path: "/blog/2023-05-json-ld-framing-and-iiif"
date: "2023-05-10T12:00:00"
author: akonrad
---

This blog post explains how you can set up an International Image Interoperability Framework (IIIF) API in TriplyDB. A growing number of TriplyDB customers is using this approach to publish their production-grade IIIF API. This blog post explains in-depth what IIIF is, why you may want to use it, and how you can configure it.

The end result looks [as follows](https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run):
- Your images can be viewed in any standards-conforming IIIF viewer.
- Up-to-date metadata is retrieved from TriplyDB and is shown in the viewer.

<figure>
  <a href="https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run" target="_blank">
    <img src='mirador-iris.png'>
  </a>
  <figcaption>Figure 1 - An external IIIF Viewer (Mirador) accessing a IIIF Manifest in TriplyDB <a href='https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run' target='_blank'>link</a>.</figcaption>
</figure>

## What is IIIF?

The International Image Interoperability Framework (IIIF) is a collection of universal standards for publishing images and their metadata in an open and standardized way. A big benefit of adopting IIIF standards, is that your images and their metadata can now be viewed in a wide number of image viewers. IIIF is widely used in the cultural heritage and academic research domains, where many organizations are experimenting with and/or transitioning towards the IIIF formats.

The two main components of a IIIF deployment are the Image API, which serves the images, and the Presentation API, which serves metadata. This blog post specifically addresses the Presentation API, and does not cover the Image API. Take a look at [the official IIIF website](https://iiif.io/) for more information.

## How can I implement the IIIF Presentation API?

There are several software implementations of the IIIF Presentation API available today. However, these implementations are somewhat complex to configure, do not always support the latest version of the IIIF standard (i.e. version 3), do not always fix bugs on a short notice, and do not meet the code quality criteria for use in a production-grade system.

For these reasons, TriplyDB users have explored a new approach for setting up a IIIF Presentation API: one that relies exclusively on TriplyDB, and that only uses open standards. This new approach is explained in this blog post. It relies on the following open standards:

- SPARQL Construct
- JSON-LD Frames

## What is the IIIF Presentation API?

The IIIF Presentation API exposes metadata about a collection of objects, e.g. a collection of flowers (the "Collection" in Figure 2). Within this collection, individual objects are described in a manifest (the "Manifest" in Figure 2). This description includes metadata, such as attribution information. One object may be depicted by multiple images and in different ways. There different views are represented in one or more canvases (the "Canvas" in Figure 2). The canvas contains metadata about one specific view, e.g. height and width, format, and the actual image content (the "Content" in Figure 2).

<figure style="width: 400px;">
  <img src="presentation-api-data-model.png" style="width:400px;">
  <figcaption>Figure 2 - Data model of the IIIF Presentation API.</figcaption>
</figure>

Notice that the data model of the IIIF Presentation API is somewhat complex (Figure 2). However, many parts of the standard are optional, and are specifically present to describe inherently complex situations. For example, an object can be divided into multiple part, each with its own views ("Range" in Figure 2). In this blog post we only cover the required parts.

## What is a IIIF manifest?

The core description of an object is the Manifest. This is exposes as a JSON structure that containing the elements of a IIIF object with basic metadata and structural information.

For demonstration purposes, we use the open [Iris dataset](https://triplydb.com/Triply/iris/). Notice that the same approach also works for private datasets.

We managed to create a valid Manifest file by writing a construct query, where we added all the required IIIF [resource types](https://iiif.io/api/presentation/3.0/#2-resource-type-overview), according to the data model in Figure 2. Notice that we skip some of the optional resource types in Figure 2, to create a minimal working example.

## Configuration 1/2: SPARQL Construct

The SPARQL Construct query is the largest configuration component. You can see the full query [over here](https://triplydb.com/Triply/-/queries/iris-iiif-manifest/61). We will go through this query piece-by-piece, and explain how it works.

At the beginning of the query, we declare the namespaces that are used in the rest of the query. IIIF relies on numerous community standards, including Dublin Core and Web Annotation Ontology. The declaration for "mf" refers to our own IIIF Presentation API. This allows us to refer to the API itself (self-description).

```sparql
prefix as: <http://www.w3.org/ns/activitystreams#>
prefix dbo: <http://dbpedia.org/ontology/>
prefix dcm: <http://purl.org/dc/dcmitype/>
prefix dct: <http://purl.org/dc/terms/>
prefix exif: <http://www.w3.org/2003/12/exif/ns#>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix iiif_prezi: <http://iiif.io/api/presentation/3#>
prefix mf: <https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run#>
prefix oa: <http://www.w3.org/ns/oa#>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix sdo: <https://schema.org/>
```

The 'construct'-clause declares the structures that are mandated by the IIIF Presentation API. We first construct the Manifest itself. This includes a label (`rdfs:label`), thumbnail (`iiif_prezi:thumbnail`), and other metadata. Some metadata items require additional specifications; you can see these in [the online version](https://triplydb.com/Triply/-/queries/iris-iiif-manifest/61) of the query. How much metadata you include here depends on your use case; linked data allows you to freely change or extend the metadata that you expose.

```sparql
construct {
  mf: a iiif_prezi:Manifest;
    rdfs:label "Fisher's Iris data set"@en;
    iiif_prezi:thumbnail <https://triplydb.com/imgs/avatars/d/6006f097506cf2034cfe4c46.png?v=25>;
    iiif_prezi:requiredStatement mf:requiredStatement;
    iiif_prezi:metadataEntries mf:description;
    foaf:homepage <https://triplydb.com/Triply/iris/>;
    rdfs:seeAlso <https://en.wikipedia.org/wiki/Iris_flower_data_set>;
    sdo:provider <https://triply.cc/about/>;
    as:items ?canvas.

  mf:description
    rdfs:label "Description"@en;
    rdf:value "Fisher's Iris data set is a multivariate data set used and made famous by the British statistician and biologist Ronald Fisher in his 1936 paper 'The use of multiple measurements in taxonomic problems' as an example of linear discriminant analysis."@en.

  mf:requiredStatement
    rdfs:label "Attribution"@en;
    rdf:value "Iris flower dataset in linked data provided by <a href=https://triply.cc>Triply</a>"@en.
```

The manifest links (with `as:items`) to the next structure that must be constructed in the SPARQL query: the canvas. Notice that the canvas specifies the dimensions (`exif:height` and `exif:width`) of the image.

```sparql
  ?canvas a iiif_prezi:Canvas;
    rdfs:label ?title;
    exif:height 1000;
    exif:width 1000;
    as:items ?page.

  ?page a as:OrderedCollectionPage;
    as:items ?image.

  ?image a oa:Annotation;
    iiif_prezi:motivation "painting";
    oa:hasBody ?body;
    iiif_prezi:target ?target.

  ?body a dcm:StillImage;
    dct:format "image/jpeg".
}
```

After the 'construct'-clause we write the 'where'-clause. This clause retrieves information from TriplyDB that will be used to instantiate the structure in the 'construct'-clause. In our case we want to expose every flower in our dataset (`dbo:FloweringPlan`). We also construct identifiers for each of the representational structures in the manifest (e.g. `?canvas`).

```sparql
where {
  ?iris a dbo:FloweringPlant;
    rdfs:label ?title;
    foaf:depiction ?imageString;
    rdfs:comment ?description.
  bind(iri(concat(str(?iris), "#sequence")) as ?sequence)
  bind(iri(concat(str(?iris), "#canvas")) as ?canvas)
  bind(concat(str(?iris), "#canvas") as ?target)
  bind(iri(concat(str(?iris), "#page")) as ?page)
  bind(iri(concat(str(?iris), "#image")) as ?image)
  bind(iri(?imageString) as ?body)
}
```

### Configuration 2/2: JSON-LD Frame configuration

When you visit the SPARQL Construct query [online](https://triplydb.com/Triply/-/queries/iris-iiif-manifest/61), you see the SPARQL Query Editor, the JSON-LD Frame Editor, and the REST API result all on one page (Figure 3). These tools make it easy to configure REST APIs, including the IIIF Presentation API.

<figure>
  <a href="https://triplydb.com/Triply/-/queries/iris-iiif-manifest/61" target="_blank">
    <img src="saved-query.png">
  </a>
  <figcaption>Figure 3 - Screenshot of a Saved Query in TriplyDB. The SPARQL Query Editor is shown at the top, the JSON-LD Frame Editor is shown in the middle, and the REST API result is displayed at the bottom.</figcaption>
</figure>

JSON-LD Frames is an international standard that allows us to create JSON structures from linked data. Which structure we create, and how we create it from our linked dataset, is configured in a frame. For our current example, the frame looks as follows:

```json
{
  "@context": "https://triplydb.com/Triply/iris/assets/63f7e799edba2c573cf17998",
  "@type": "Manifest"
}
```

The value for `@context` refers to a small JSON-LD file that Triply created for version 3 of the IIIF Presentation API. The official IIIF website publishes a similar file for version 2, but not (yet) for the latests version.

The value for `@type` indicates which item should be at the root of the JSON object that is exposed through our API. In linked data, information is not stored in specific order. There is no 'first' or 'root' item. But the IIIF standards mandate that we return the manifest in a JSON format; and there the order of the items is crucial. Luckily, JSON-LD Frames allows us to force a specific order, thereby translating the outcomes of SPARQL Construct queries to REST API responses.

For more information, see the TriplyDB documentation about JSON-LD Frames support: [link](https://triply.cc/docs/jsonld-frames).

## Conclusion

We were able to configure a IIIF Presentation API. We did not use custom/external software, but exclusively relied on standard features of TriplyDB. Our configuration was entirely done in two open standards: SPARQL Construct and JSON-LD Frames.

Every standards-compliant IIIF viewer can now access our endpoint and display our images and metadata. You can try this out by going to [Mirador](https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run).

<figure>
  <a href="https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run" target="_blank">
    <img src="mirador-iris.png">
  </a>
</figure>
