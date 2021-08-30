---
title: "Why We Use OWL Every Day At Triply"
path: "/blog/2021-08-why-we-use-owl"
date: "2021-08-30T16:00:00"
author: triply # see `author` section below
---

Reply to "[Why I Don't Use OWL Anymore](https://www.topquadrant.com/owl-blog/)" by Irene Polikoff - In recent years, many linked data experts have reflected on the use of SHACL in relation to the use of OWL. At Triply, we use SHACL and OWL together for almost all projects, and are surprised by the recent push for SHACL as an OWL replacement. Below, we describe why we think that push is misguided.

![Flying owl](flying-owl.jpg)

## Commonalities and differences

The Web Ontology Language (OWL) was standardized in 2004, with significant updates in 2009 (OWL 2). The purpose of OWL is to encode meaning on the web and it is based on a long tradition of formal logic.

SHACL was standardized more recently in 2017. The purpose of SHACL is to encode restrictions that can be automatically enforced over instance data. SHACL takes some ideas from XML Schema, which standardizes automatic enforcement of restrictions over tree-shaped XML data. SHACL provides significant innovations, allowing restrictions to be formulated over graph-shaped RDF data.

OWL and SHACL are both part of the same linked data ecosystem. As such, they have some commonalities, but they also have their differences:

 1. Both OWL and SHACL use graph-shaped RDF data.
 2. Both OWL and SHACL are open standards, which allows them to be used across tools and vendors.
 3. Both OWL and SHACL can be used to encode some aspects of meaning.
 4. OWL operates under the Open World Assumption (OWA), and SHACL under the Closed World Assumption (CWA).
 5. OWL is optimized for global, open systems, and SHACL for local, closed systems.
 6. OWL is descriptive, while SHACL is prescriptive.
 7. OWL can be used for reasoning, and SHACL can be used for validation.

## OWL is optimized to encode semantic agreements

In this blog post, we work out the benefit of using OWL, with our customer the Dutch Land Registry and Mapping Agency ([Kadaster](https://kadaster.nl)) as an example. Kadaster wants to store and publish data in line with international standards. Kadaster uses the [GeoSPARQL vocabulary](https://triplydb.com/ogc/geo), which is published by the [Open Geospatial Consortium](https://www.ogc.org) (OGC). This vocabulary includes the following standardized property to express that an object ('feature' in geo parlance) has a geometry (using the OWL Manchester Syntax):

```turtle
ObjectProperty: hasGeometry
	  Domain: Feature
	  Range: Geometry
```

The property `hasGeometry` can be used by anybody in the world to express that objects have geometries. When a data publisher uses this property, they express the intent to follow the official OGC definition. This intent is recognized by data consumers who are aware of the current standards and best practices in the geospatial domain. Notice that the correct application of this property is based on an *agreement* between three parties: the standardization body (OGC), the data publisher (Kadaster), and the data consumer.

The encoding and exchange of such semantic agreements is a crucial feature that OWL brings to the world of modeling. It has been argued that such semantic agreements could be encoded in SHACL instead of in OWL. We believe that due to its underlying Open World Assumption, its descriptive nature and also its reasoning capabilities, OWL is the language of choice to formalize standardized, global ontologies.

This is how users benefit from semantic agreements:

 - As a data publisher, Kadaster can use the semantic agreement to make its intentions clear. It lets its data consumers know that it publishes geospatial information according to the OGC vocabulary. This ensures that the data will be used correctly and avoids all kinds of potential misunderstandings. For example, the `hasGeometry` property does not express a boolean property (to indicate whether a geometry is known or not), it does not express a numeric property (to indicate how many geometries are known), but it must be used to express the particular Geometry of the object. All these potential misunderstandings are avoided by the semantic agreement of the standardized OWL Domain and Range expressions in the standardized OGC GeoSPARQL vocabulary.
 - As an application developer, I can use the semantic agreement to build an application that correctly interprets geodata. If my application loads data that uses the GeoSPARQL vocabulary, then the semantic agreement determines how I can correctly display that data on a map.
 - As a data scientist, I can query multiple datasets in a uniform way. According to the semantic agreement, if I observe `hasGeometry` then I know how to query that data in SPARQL, and I know how to load that data into specialized geospatial applications like QGIS or ArcGIS.

We saw a concrete example of how OWL can be used to encode semantic agreement between different parties. Many organizations publish geospatial data, but there is no need for each of them to reinvent the wheel. The OGC standards cover the vast majority of cases, and are often superior to how data is modeled in local database systems.

This example touches only on a small use case from the geospatial domain, but such semantic agreements exist for many other data domains as well: [SNOMED CT](https://confluence.ihtsdotools.org/display/DOCOWL/SNOMED+CT+OWL+Guide) is a semantic agreement for medical information, [Data Cube](https://www.w3.org/TR/vocab-data-cube) is a semantic agreement for observational/statistical information, [PROV](https://www.w3.org/TR/prov-overview) for workflow and process information, and [OWL Time](https://www.w3.org/TR/owl-time) for temporal information. If I need to model medical, temporal or statistical data, I do not need to make up my own representations. Instead, I can enter into the semantic agreements that OWL offers me: I can reuse the work of large communities of data modelers.

Notice that no matter whether they are formalized in OWL or SHACL, the use of external vocabularies can be a big time-saver in many projects. Organizations do not need to figure out how to model space, time, metadata, statistics, process information, etc. These domains have been standardized by professional organizations over a long period of time. Many standards are well documented, actively maintained, and have a responsive community to ask questions to.

## SHACL is optimized to encode enforced restrictions

Many local data systems assume that all relevant information is currently available. This assumption is called the Closed World Assumption (CWA). Under this assumption, most local data systems can perform some form of data validation. Because all relevant facts are assumed to be available, it is possible to validate whether data is correctly typed, follows cardinality restrictions, etc.

Returning to our previous example, the Land Registry and Mapping Agency wants to ensure that the data it publishes follows the OGC standard correctly. The Agency can enforce this requirement with the following SHACL definition:

```turtle
[] a sh:PropertyShape;
  sh:class geo:Geometry;
  sh:path geo:hasGeometry.
[] a sh:PropertyShape;
  sh:class geo:Feature;
  sh:path [ sh:inversePath geo:hasGeometry ].
```

SHACL encoding works great when data is generated locally by the data publisher: before data is shared internally and/or is published online, the Agency can ensure that all objects that have a geometry are properly identified as features. The data can be shared or published together with its SHACL encoding. A consumer can then validate the data based on this published SHACL encoding, or check additional, local constraints, typically often on parts of the data.

## Limitations of the Closed World Assumption

A data consumer may encounter the following instance data:

```turtle
Individual: someObject
  Types: nen3610:GeoObject
  Facts: geo:hasGeometry someGeometry
```

This piece of instance data uses the OGC `hasGeometry` property, but it is invalid according to the previous SHACL definition. Under the CWA, SHACL treats the instance data in isolation. Taken as a closed system, it can indeed not be proven that `someObject` is an OGC feature or that `someGeometry` is an OGC geometry. But if we interpret the instance data in a broader, universal context, we can prove these things. The Dutch national standard [NEN 3610](https://docs.geostandaarden.nl/nen3610/nldp/) specifies that geo objects that follow that standard are also OGC features.

What we see is that while the Closed World Assumption works great for most local data systems, it does not work at all outside of such closed systems.

## Modern knowledge graphs require the Open World Assumption

Achieving semantic agreement between two people or within organizations can sometimes be quite difficult. Achieving semantic agreement globally, between large organizations and between large numbers of people, is even more difficult. At the same time, data is published in different places around the world and reaching business goals often requires combining data from multiple sources.

Today's information systems are no longer closed systems used by one isolated group of individuals. What we see is the rise of the organization-wide knowledge graph. Such a knowledge graph exposes information resources from many different parts of an organization, and often includes resources from outside that organization as well. New information resources are added and removed all the time, and existing resources are themselves updated constantly to add/remove information to/from the organization-wide graph. In such more complex data systems the Closed World Assumption is too strong. There is not one overarching schema to which all data can be assumed to always conform, thus SHACL is the wrong tool for this situation.

In order to support such heterogeneous knowledge graphs, OWL makes a different assumption than most other data paradigms. It does not assume that all sources are always complete, available and up-to-date. In complex systems, data completeness is desirable, but not the only design requirement. Other requirements are performance, availability, data freshness, etc. In a complex data system, it is not realistic that all data resources are forced to be in sync with one another. Treating a complex information system as a closed world effectively amounts to one organization-wide data representation and -synchronization scheduler. Such centralized data controls have been tried in the past, but they have almost always failed.

OWL gives up the assumption that one data system has complete knowledge. This assumption is called the Open World Assumption (OWA). Under the OWA, it is always possible that there is new knowledge or more up-to-date knowledge that is not (yet) known to one central authority.

Let us look again at the instance data example, but now from the perspective of OWL:

```turtle
Individual: someObject
  Types: nen3610:GeoObject
  Facts: geo:hasGeometry someGeometry
```

According to the semantic agreement between the OGC standardization body, to the publisher of the instance data, and to us readers of this blog article, the above piece of instance data describes an OGC feature `someObject` and an OGC geometry `someGeometry`.

Notice that OWL does not tell us whether the instance data is correct or incorrect. It also does not tell us whether we should trust or distrust the publisher of the instance data. OWL does tell us that *if* we choose to trust the data publisher and *if* we agree to engage in a semantic agreement with that publisher and the OGC, *then* we should be able to interpret the instance data under the conditions specified in that agreement.

## Conclusion

The core of linked data is not about reasoning or set theory or making things complex (although it can do all of those things). At its core, linked data is a collection of standards that allow the creation of large knowledge graphs. Some standards, such as SHACL, allow data to be automatically validated before being published or consumed. Other standards, such as OWL, allow data to be (re)used and (re)combined under semantic agreements.

The combination of linked data standards is not only possible in theory, but also works in practice. At Triply we use both SHACL and OWL every day to build modern data systems. We use SHACL to ensure that knowledge graph components are published correctly. And we use OWL to meaningfully combine these components into one overarching knowledge graph.
