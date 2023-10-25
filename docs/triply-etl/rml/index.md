[TOC]

# RDF Mapping Language (RML)


RML (RDF Mapping Language) is a language and framework used for transforming structured data from various sources into RDF (Resource Description Framework) format. It defines mapping rules that specify how to convert non-RDF data into RDF triples.

## Key Concepts

- Logical Source: Defines the source of the data to be transformed. It includes information about the data format (csv, xml, json, etc.), location, and access methods. Logical sources can represent various types of data sources, such as files, databases, or web services.

- Triples Map: A triples map is a core concept in RML and represents the mapping rules for converting data from a logical source into RDF triples. It defines how data should be transformed and specifies the subject, predicate, and object of the generated triples.

	- Subject Map: The subject map is a part of a triples map and defines how the subjects of the generated RDF triples are constructed. It specifies the subject's term type, which can be a blank node, an IRI, or a literal, and often includes a class definition for the generated resources.

	- Predicate Object Map: A predicate object map is used within a triples map to define how to map a specific predicate and its object. It specifies the predicate and the mapping rules for the object.


## Example

### Input Data (JSON)


```json
{
  "name": "Hello World",
  "description": "It worked!"
}
```

### RML Mapping File (mapping.ttl)

```turtle

@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix rml: <http://semweb.mmlab.be/ns/rml#> .
@prefix myprefix: <http://myprefix.org/> .
@prefix ql: <http://semweb.mmlab.be/ns/ql#> .
@base <http://sti2.at/> . #the base for the classes

<#LOGICALSOURCE>
  rml:source "./static/input.json";
  rml:referenceFormulation ql:JSONPath;
  rml:iterator "$".

<#Mapping>
  rml:logicalSource <#LOGICALSOURCE>;

  rr:subjectMap [
    rr:termType rr:BlankNode;
    rr:class myprefix:TestMapping;
  ];

  rr:predicateObjectMap [
    rr:predicate myprefix:hasName;
    rr:objectMap [ rml:reference "name" ];
  ];

  rr:predicateObjectMap [
    rr:predicate myprefix:says;
    rr:objectMap [ rml:reference "description" ];
  ].
```

### Expected RDF Output

```turtle

<http://sti2.at/resource1> a <http://myprefix.org/TestMapping>;
    <http://myprefix.org/hasName> "Hello World";
    <http://myprefix.org/says> "It worked!".
```

## Usage in TriplyETL

You can use RML in TriplyETL with the following code:

```
const etl = new Etl();
etl.use(map(Source.file("static/mapping.ttl")))
```

Where mapping.ttl file should be replaced with your specific file with RML mapping rules.