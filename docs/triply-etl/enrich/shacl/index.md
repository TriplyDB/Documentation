---
title: "4. Enrich: SHACL Rules"
path: "/docs/triply-etl/enrich/shacl"
---

SHACL Rules are part of the SHACL Advanced standard.  They can be applied to linked data in the internal store.  SHACL Rules can add new linked data based on linked data that is already present in the store, thereby enriching its contents.

## How to write SHACL Rules?

SHACL Rules offer two types of rules: `Triple rules` and `SPARQL rules`.

To better illustrate the concept, let's consider a scenario where we have data on vehicles, including the triple that specifies their top speed. Now, imagine we want to add additional information to our dataset, specifically identifying cars with a top speed greater than 100 as "fast cars." The most straightforward approach to accomplish this is by utilizing triple rules.

In the following examples, in the SHACL file we define a class and node shape named `ex:Vehicle`, representing vehicles within our dataset. The node shape already includes the property `ex:topSpeed` in the internal store. However, if a vehicle's top speed exceeds 100 (as indicated by `sh:minExclusive 100`), we aim to enhance it by adding an extra property, `ex:isFast`, with the value of "true" represented as a boolean. As mentioned above, we can do this by either using `Triple rules` or `SPARQL rules`

### Using `Triple rules`:

```code 

ex:Vehicle
    a rdfs:Class, sh:NodeShape ;
    rdfs:label "Vehicle" ;
    sh:property [
        sh:path ex:topSpeed ;
        sh:datatype xsd:integer ;
        sh:minCount 1 ;
        sh:name "topSpeed" ;
    ] ;
    sh:rule [
        a sh:TripleRule ;
        sh:subject sh:this ;
        sh:predicate ex:isFast ;
        sh:object "true"^^xsd:boolean ;
        sh:condition ex:Vehicle ;
        sh:condition [
            sh:property [
                sh:path ex:topSpeed ;
                sh:minExclusive 100 ;
            ] ;
        ] ;
    ] .
```
To understand what's happening, let's break down each property within the rule:

- `a sh:TripleRule`: Here we specify the type of our rule, either `TripleRule` or `SPARQLRule`. In this case, the type is `TripleRule`, since we are using Triple pattern.
- `sh:subject sh:this` specifies that the subject of the generated triple is the current node being validated(`ex:Vehicle`).
- `sh:predicate ex:isFast` specifies that the predicate of the generated triple is `ex:isFast`.
- `sh:object "true"^^xsd:boolean` specifies that the object of the generated triple is the boolean value true.
- `sh:condition ex:Vehicle` specifies that the rule only applies to nodes that are instances of the `ex:Vehicle` class.
- `sh:condition [...]` specifies an additional condition that must be met in order for the rule to apply. In this case, the condition is that the `ex:topSpeed` property must have a value that is greater than 100 (`sh:minExclusive 100`).

### Using `SPARQL Rules`:

```code
ex:Vehicle
    a rdfs:Class, sh:NodeShape ;
    rdfs:label "Vehicle" ;
    sh:property [
        sh:path ex:topSpeed ;
        sh:datatype xsd:integer ;
        sh:minCount 1 ;
        sh:name "topSpeed" ;
    ] ;
    sh:rule [
        a sh:SPARQLRule ;
        sh:message "Mark vehicle as fast if top speed is greater than 100" ;
        sh:prefixes [
            sh:prefix "ex" ;
            sh:namespace "http://example.com/vehicles#" ;
        ] ;
        sh:select """
            PREFIX ex: <http://example.com/vehicles#>
            CONSTRUCT {
                ?vehicle ex:isFast true .
            }
            WHERE {
                ?vehicle a ex:Vehicle ;
                         ex:topSpeed ?topSpeed .
                FILTER (?topSpeed > 100)
            }
        """ ;
    ] .
```

To understand what's happening, let's break down each property within the rule:

- `a sh:SPARQLRule`: Here we specify the type of our rule, either `TripleRule` or `SPARQLRule`. In this case, the type is `SPARQLRule`, since we are using SPARQL pattern.
- `sh:message`: This provides a descriptive message or explanation associated with the rule. In this case, it states that vehicles will be marked as "fast" if their top speed exceeds 100.
- `sh:prefixes`: This allows you to define prefixes and namespaces used in the SPARQL query for convenience and readability. In this example, we define a prefix "ex" associated with the namespace "http://example.com/vehicles#" to simplify referencing resources within the query.
- `sh:select`: This contains the actual SPARQL query used for evaluating the rule. It uses the `CONSTRUCT` keyword to specify the desired triples to be constructed. The query pattern checks for vehicles (`?vehicle`) that are instances of the `ex:Vehicle` class and have a `ex:topSpeed` property. The `FILTER` condition ensures that only vehicles with a top speed greater than 100 are considered. The resulting triples will mark these vehicles with the additional property `ex:isFast` having the value of true.
## How to call and use SHACL Rules in your ETL?

To incorporate and use SHACL Rules in your ETL process, follow these steps:

1. Include the library `@triplyetl/etl/shacl` in your ETL project.
2. Call the `executeRules()` function.

By including the mentioned library and invoking the `executeRules()` function, you can effectively invoke and apply SHACL Rules within your ETL workflow.