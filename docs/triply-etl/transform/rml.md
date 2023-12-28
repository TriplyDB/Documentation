[TOC]

# RML Transformations

The RDF Mapping Language (RML) is an ETL configuration language for linked data. RML mappings are applied to the TriplyETL Record.



## Configuration components

RML mappings contain the following configuration components:

- **Logical Source**: Defines the source of the data to be transformed. It includes information about the data format (csv, xml, json, etc.), location, and access methods. Logical sources can represent various types of data sources, such as files, databases, or web services.

- **Triples Map**: The mapping rules that are used to convert data from a Logical Source to linked data. It defines how data should be transformed and specifies the subject, predicate and object terms of the generated statements.

	- **Subject Map**: The part of the Triples Map that defines how the subjects of the generated linked data statements must be constructed. It specifies the subject's term type, which can be blank node, IRI or literal. It often includes the class of which the subject term is an instance.

	- **Predicate Object Map**: The part of the Triples Map that defines how the predicate and objects are mapped.



## A simple example

The following full TriplyETL script applies the RML mappings specified in `map.trig` to the in-line specified source data record:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Etl, fromJson, Source } from '@triplyetl/etl/generic'
import { map } from '@triplyetl/etl/rml'

export default async function (): Promise<Etl> {
  const etl = new Etl()
  etl.use(
    fromJson([{ name: 'John' }]),
    map(Source.file('map.trig')),
    logQuads(),
  )
  return etl
}
```

The contents of file `map.trig` specify how the data will be mapped:

```turtle
prefix ql: <http://semweb.mmlab.be/ns/ql#>
prefix rml: <http://semweb.mmlab.be/ns/rml#>
prefix rr: <http://www.w3.org/ns/r2rml#>
prefix sdo: <https://schema.org/>

[] rml:logicalSource
     [ rml:source '$Record.json';
       rml:referenceFormulation ql:JSONPath;
       rml:iterator '$' ];
   rr:subjectMap
     [ rr:termType rr:BlankNode;
       rr:class sdo:Person ];
   rr:predicateObjectMap
     [ rr:predicate sdo:firstName;
       rr:objectMap [ rml:reference 'name' ] ].
```

The Logical Source component specifies that the TriplyETL Record should be used:

```turtle
[] rml:logicalSource
     [ rml:source '$Record.json';
       rml:referenceFormulation ql:JSONPath;
       rml:iterator '$' ];
```

The Subject Map specifies that the subject term is a blank node that is an instance of class `sdo:Person`:

```turtle
[] rr:subjectMap
     [ rr:termType rr:BlankNode;
       rr:class sdo:Person ];
```

The Predicate Object Map specifies that the value of key 'name' should be used together with the property `sdo:firstName`:

```turtle
[] rr:predicateObjectMap
     [ rr:predicate sdo:firstName;
       rr:objectMap [ rml:reference 'name' ] ].
```

Running the TriplyETL script results in the following linked data:

```turtle
<https://triplydb.com/.well-known/genid/1703545835347b1_b0>
  a sdo:Person;
  sdo:firstName 'John'.
```



<!--
## Using a file source

### Input Data (JSON)

```json
{
  "name": "Hello World",
  "description": "It worked!"
}
```

### RML Mapping File (mapping.ttl)

```turtle
base <http://sti2.at/>
prefix rr: <http://www.w3.org/ns/r2rml#>
prefix rml: <http://semweb.mmlab.be/ns/rml#>
prefix myprefix: <http://myprefix.org/>
prefix ql: <http://semweb.mmlab.be/ns/ql#>

<#LOGICALSOURCE>
  rml:source "./static/input.json";
  rml:referenceFormulation ql:JSONPath;
  rml:iterator "$".

<#Mapping>
  rml:logicalSource <#LOGICALSOURCE>;
  rr:subjectMap
    [ rr:termType rr:BlankNode;
      rr:class myprefix:TestMapping ];
  rr:predicateObjectMap
    [ rr:predicate myprefix:hasName;
      rr:objectMap [ rml:reference "name" ] ];
  rr:predicateObjectMap
    [ rr:predicate myprefix:says;
      rr:objectMap [ rml:reference "description" ] ].
```

### Expected RDF Output

```turtle
<http://sti2.at/resource1>
  a <http://myprefix.org/TestMapping>;
  <http://myprefix.org/hasName> 'Hello World';
  <http://myprefix.org/says> 'It worked!'.
```

## Usage in TriplyETL

You can use RML in TriplyETL with the following code:

```ts
import { map } from

const etl = new Etl();
etl.use(
  map(Source.file("static/mapping.ttl")),
)
```

Where mapping.ttl file should be replaced with your specific file with RML mapping rules.

Keep in mind that if you wish to view the ETL's output, you can achieve this by including functions like logQuads() and toRdf(), as demonstrated in the following code:

```ts
import { logQuads } from '@triplyetl/etl/debug'
import { Destination, Etl, Source, toRdf } from '@triplyetl/etl/generic'
import { map } from '@triplyetl/etl/rml'

export default async function (): Promise<Etl> {
  // Create an extract-transform-load (ETL) process.
  const etl = new Etl()
  etl.use(
    map(Source.file("static/mapping.ttl")),
    logQuads(),
    toRdf(Destination.file('my-file.ttl'))
  )
  return etl
}
```
-->
