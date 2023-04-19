---
title: "JSON-LD Framing and IIIF"
path: "/blog/2023-02-json-ld-framing-and-iiif"
date: "2023-03-20T11:15:00"
author: akonrad
---
We are excited to announce that it is now possible to create a working IIIF Presentation Manifest with TriplyDB that works in any IIIF Viewer. This is possible with the recently introduced JSON-LD frames, which can be used on a saved SPARQL query.

## What is IIIF?
The International Image Interoperability Framework (IIIF) represents universal standards for describing and transmitting images over the internet. Multiple APIs, including one for image retrieval and one for image display, are specified by the framework. Institutions that offer IIIF endpoints for their content can make it available to anybody with a IIIF-compatible viewer.
If you wish to learn more about IIIF and how it works, you can check out [the official IIIF website](https://iiif.io/).

### IIIF Presentation API

The IIIF presentation API's function is to describe a digital object, which may contain hundreds of images, so that the user and viewer software can successfully navigate the object (the manifest resource), the sequence in which individual surfaces or views are presented (the sequence resource), and the object as a whole (canvas resources). Each canvas may have images and/or other content resources associated with it (content resources) to allow the view to be rendered. To allow this, each canvas may be connected with images and/or other content resources. An object may also be divided into multiple parts. These resource types, along with their properties, make up the IIIF Presentation API.

## What are JSON-LD Frames?

JSON-LD frames are a deterministic translation from a graph, which has an unordered set of triples where no node is "first" or "special", into a tree, which has ordered branches and exactly one "root" node. In other words, JSON-LD framing allows one to force a specific tree layout to a JSON-LD document. This makes it possible to translate SPARQL queries to REST-APIs.
More about what JSON-LD Frames are and how to use it can be found in our [documentation](https://triply.cc/docs/jsonld-frames).

## How we created a working Presentation API using TriplyDB

The Presentation API defines how digital objects appear in viewers by connecting basic metadata and structure to them. It does this via the Manifest - a JSON file containing all the elements of a IIIF object with basic metadata and structural information.

In order to be able to display the image in a IIIF viewer, we had to use an open dataset. In this example we used the well known [Iris dataset](https://triplydb.com/Triply/iris/), which is also available on TriplyDB.

We managed to create a valid Manifest file by writing a construct query, where we added all the required IIIF [resource types](https://iiif.io/api/presentation/3.0/#2-resource-type-overview), according to the data model, which is displayed in the image below. Note that not all of the resource types displayed in the model are required to create a working minimal example for IIIF Presentation API. What is and isn't required can be seen on the official IIIF page [here](https://triplydb.com/imgs/avatars/d/6006f097506cf2034cfe4c46.png?v=25).
THIS IS A DEV TEST !!!!!!!!
<figure><img src="presentation-api-data-model.png" style="height: 400px;"><figcaption>Data model for a IIIF Presentation API</figcaption></figure>
<figure>
  <div style="height: 400px;">
    ![Walkway among trees](presentation-api-data-model.png)
  </div>
</figure>

### The SPARQL query explained

To make it easier to understand, here is a more detailed description of our query. [Here](https://triplydb.com/Triply/-/queries/iris-iiif-manifest/56) you can see it in full and try it for yourself.

#### First part of the query - prefixes
At the top of the query, as usual in all SPARQL queries, we defined the prefixes used throughout the query. Some of them are connected to the used vocabularies and others are IIIF specific. The prefix **mf** represents the resulting API. The prefixes are used so the query itself is more readable as we don't have to use the long IRIs.

<figure><img src="prefixes.png" height="350" width="700"><figcaption>Defined prefixes</figcaption></figure>

#### Second part of the query - construct
This is the part where all the required IIIF resource types have their types assigned and are attached to our API.

It's where we can link external resources, such as a homepage and provider, and add a description. We can add a copyright statement with "requiredStatement". You can see that some of the resources, such as Canvas, Collection and Annotation from the model appear in the query.

<figure><img src="construct1.png" height="500" width="700"><figcaption>The 'construct' part of the query</figcaption></figure>

In this part we can also add our own information, like a more detailed description or links.

<figure><img src="construct2.png" height="300" width="700"><figcaption>Continuation of the 'construct' part of the query</figcaption></figure>

#### Third part - where
Here is where we connect our resources to our main subject (?iris). We can connect them as a triple, with a suitable predicate or bind it with a required string to a resource part.
<figure><img src="where.png" height="200" width="700"><figcaption>The 'where' part of the query</figcaption></figure>

Below the query, in the JSON-LD Frame editor, we added a Frame for the manifest. In this example, it was a very simple one, with elements for "@context" and "@type".

<figure><img src="ld-frame.png" height="50%" width="50%"><figcaption>JSON-LD Frame</figcaption></figure>

With a saved query using the right frame, we got a working API through Triply SPARQL API, which we used in a IIIF Viewer [Mirador](https://mirador-dev.netlify.app/__tests__/integration/mirador/) and got a working image ready to be observed!

<figure><img src="mirador-iris.png" height="300" width="600"><figcaption>IIIF Viewer with an image displayed through Triply API</figcaption></figure>

You can see the final result at [this link](https://projectmirador.org/embed/?iiif-content=https://api.triplydb.com/queries/Triply/iris-iiif-manifest/run).
