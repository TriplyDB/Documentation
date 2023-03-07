In this blog, we would like to talk about how we made it possible to get a working IIIF Presentation API through TriplyDB, using SPARQL service in combination with JSON-LD Frames.

Triply recently introduced JSON-LD framing that can be used on a saved SPARQL query. With this it is now possible to create a working IIIF Presentation API that can be used in any IIIF Viewer.

## What is IIIF?
The International Image Interoperability Framework (IIIF) represents universal standards for describing and transmitting images over the internet. Two APIs, one for image retrieval and the other for image display, are specified by the framework. Institutions that offer IIIF endpoints for their content can make it available to anybody with a IIIF-compatible viewer.
If you wish to learn more about IIIF and how it works, you can check out [the official IIIF website](https://iiif.io/).

### IIIF Image API
The IIIF Image API describes a web service that returns an image in response to a regular HTTP or HTTPS request. The region, size, rotation, quality, and format of the requested image can all be specified by the URI. It can also request basic technical information of the image. This API was designed to make it easier for cultural heritage organizations to establish digital image repositories where image resources can be reused consistently. It can be used to obtain static images in response to a correctly built URI and might be adopted by any image repository or service.

### IIIF Presentation API

The IIIF presentation API's function is to describe a digital object, which may contain hundreds of images, so that the user and viewer software can successfully navigate the object (the manifest resource), the sequence in which individual surfaces or views are presented (the sequence resource), and the object as a whole (canvas resources). Each canvas may have images and/or other content resources associated with it (content resources) to allow the view to be rendered. To allow this, each canvas may be connected with images and/or other content resources. An object may also be divided into multiple parts. These resource types, along with their properties, make up the IIIF Presentation API.

## What are JSON-LD Frames?

JSON-LD frames are a deterministic translation from a graph, which has an unordered set of triples where no node is "first" or "special", into a tree, which has ordered branches and exactly one "root" node. In other words, JSON-LD framing allows one to force a specific tree layout to a JSON-LD document. This makes it possible to translate SPARQL queries to REST-APIs.
More about what JSON-LD Frames are and how to use it can be found in our [documentation](https://triply.cc/docs/jsonld-frames).

## How we got a working Presentation API using TriplyDB?

The Presentation API defines how digital objects appear in viewers by connecting basic metadata and structure to them. It does this via the Manifest - a JSON file containing all the elements of a IIIF object with basic metadata and structural information.

In order to be able to display the image in a IIIF user, we had to use an open dataset. For this example we used a well known [Iris dataset](https://triplydb.com/Triply/iris/), which is also available through TriplyDB.

We managed to create a valid Manifest file by writing a construct query in which we added all the required IIIF [resource types](https://iiif.io/api/presentation/3.0/#2-resource-type-overview), according to the data model, which is displayed in the image below.

<figure><img src="presentation-api-data-model.png" height=400><figcaption>Data model for a IIIF Presentation API</figcaption></figure>

With JSON-LD Frame editor, we added a Frame for the manifest. In this example, it was a very simple one, with elements for *@context* and *@type*.

For the IIIF objects, we used images added as [assets](https://triplydb.com/Triply/iris/assets) to the Iris dateset in TriplyDB.

With a saved query with the right frame, we got a working API through Triply SPARQL API, which we used in a IIIF Viewer [Mirador](https://mirador-dev.netlify.app/__tests__/integration/mirador/) and got a working image ready to be observed!

<figure><img src="mirador-iris.png" height=300, width=600><figcaption>IIIF Viewer with an image displayed through Triply API</figcaption></figure>

You can find the described SPARQL query with JSON-LD Frame [here](https://triplydb.com/Triply/-/queries/iris-iiif-manifest/56).