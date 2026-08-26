# TriplyDB Editor 

## Key Concepts

### Class

A class is a category of resources in a data model — for example, `skos:Concept` or `skos:ConceptScheme`. In the Editor, classes determine which form is shown when you create or edit an instance. The available classes are defined by the SHACL node shapes in the dataset's shapes graph.

### Concept (SKOS)

A concept is an individual entry in a SKOS concept scheme — for example, a term in a controlled vocabulary or a node in a taxonomy. In the Editor's SKOS view, concepts are displayed in a hierarchical tree. Each concept is an instance of `skos:Concept`.

### Concept scheme (SKOS)

A concept scheme is a collection of SKOS concepts organized in a hierarchy. It is an instance of `skos:ConceptScheme`. The Editor's SKOS view lets you select one or more concept schemes and browse or edit the concepts they contain.

### Deprecated term

A class, property, or SKOS concept that has been marked as deprecated using `owl:deprecated true`. Deprecated terms are displayed with strikethrough styling in the Editor. They remain fully viewable and editable — the marking is informational only. When a deprecated resource is opened, a warning is shown in the instance detail panel.

### IRI (Internationalized Resource Identifier)

A globally unique identifier for a resource in a linked dataset, similar to a URL. Every instance in TriplyDB has an IRI. When you create a new instance in the Editor, an IRI is generated automatically. You can change the generated IRI before saving, but IRIs must be unique within the dataset.

### Instance

A single resource of a particular class — for example, one specific concept in a concept scheme. In the Editor, you create, view, edit, copy, and delete instances using forms.

### Modification history

A record of all changes made to an instance through the Editor. For each change, the history records who made the change and when. You can view the full history by selecting the backward-clock symbol in the instance detail panel.

### Node shape (SHACL)

A SHACL node shape defines the properties that instances of a class must or may have, and the constraints on those properties (for example, cardinality or value type). The Editor uses node shapes to generate forms. A class that does not yet have a node shape can be edited in the data model view, which adds a node shape automatically.

### Property

An attribute of an instance — for example, `skos:prefLabel` (preferred label) or `skos:broader` (broader concept). In Editor forms, each property appears as one or more input fields. Mandatory properties are marked with an asterisk (*).

### SHACL shapes graph

A graph within a TriplyDB dataset that contains SHACL shapes describing the structure of the data. The Editor reads the shapes graph to know which classes exist, which properties belong to each class, and which properties are mandatory. Without a shapes graph, the Editor cannot generate forms.

### SKOS (Simple Knowledge Organization System)

A W3C standard for representing controlled vocabularies, taxonomies, and thesauri as linked data. SKOS defines classes such as `skos:ConceptScheme` and `skos:Concept`, and properties such as `skos:prefLabel`, `skos:broader`, and `skos:narrowMatch`. The Editor has a dedicated SKOS view with a concept tree and multi-scheme navigation.

### View

A configured perspective on the data in the Editor. A view determines which classes and concept schemes are shown, and how the data is presented. For example, the SKOS view shows a concept tree; other views may present data differently. A single dataset can have multiple views. You switch between views using the **view** button in the top-left corner of the Editor pane.