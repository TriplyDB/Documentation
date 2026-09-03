
<!-- SOURCES: no how-to prose exists yet. The guides below are groupings of material that
     already sits in two places:
     1. data-apps/Editor/FAQ/Index.md — several answers are step-by-step procedures rather
        than questions, and belong here once these guides are written.
     2. triply-db-getting-started/editing-data/index.md — the original page, whose procedural
        sections were absorbed into Getting Started and the FAQ but not into a how-to chapter.

     Where to draw each guide from, when writing it:
       Work with instances .......... FAQ answers on creating, IRI reuse, copying; and
                                      Getting Started Step 5 for the editing form itself.
                                      Deleting has no source anywhere — see the review block.
       Find and navigate ............ FAQ answers on the > symbol and Search in hierarchy;
                                      Getting Started Step 4.
       Multiple concept schemes ..... FAQ answer on chaining schemes; Getting Started Step 3.
       SHACL shapes ................. FAQ answers on unshaped ontologies and the class picker;
                                      Concepts, Node shape.
       Between views ................ FAQ answers on drag-and-drop to Browser and Triples.

     The screenshots linked below were used on the old page and are currently unused in
     docs/assets/. Image path from this folder is ../../../assets/.

     Links use the capitalised folder names as they currently stand in the repository
     (Concepts, FAQ, Getting-started, How-to, Reference). If the Editor folders are
     normalised to lowercase, these need updating with them. -->
# TriplyDB Editor

# How to guides
For the shortest path through the Editor, start with
[Getting Started](../Getting-started/index.md) instead. For definitions of the terms used here,
see [Concepts](../Concepts/index.md).

## Working with data

### Work with instances

Creating an instance and picking its class, letting the Editor generate an IRI or setting your
own, copying an existing instance when you need a similar one, editing its properties, and
deleting an instance you no longer want.

![The class picker when creating a new instance, with the generated IRI](../../../assets/editor-new-instance.png)

### Find and navigate your data

Searching for an instance by label from the search box, browsing the concept tree, expanding and
collapsing concepts, and searching within the hierarchy once a scheme is open.

![The concept hierarchy shown as a tree, with expandable concepts](../../../assets/editor-concept-tree.png)

### Work with multiple concept schemes

Selecting a concept scheme, chaining schemes that are linked by `skos:narrowMatch` and
`skos:broadMatch`, and reading the colour coding that tells you which scheme a concept comes
from.

![Two chained concept schemes, each shown in a different colour](../../../assets/editor-chained-concept-schemes.png)

## Working with the data model

### Add SHACL shapes to an unshaped ontology

Finding classes that are defined in your ontology but have no SHACL node shape yet, editing one
so that a shape is created for it in the background, and using the class picker to pre-fill the
label, description and parent class from the ontology.

## Working alongside other TriplyDB views

### Move between the Editor and other views

Dragging an instance hyperlink onto Browser or Triples to see the same resource there, and
dragging a hyperlink from another view onto Editor to open that instance directly.

![The instance detail panel showing the IRI, class and last modification](../../../assets/editor-instance-details.png)

---

**Chapter navigation:**

[Overview](../index.md) 

[Getting Started](../Getting-started/index.md) 

[Concepts](../Concepts/index.md) 

[Reference](../Reference/index.md) 

[FAQ](../FAQ/index.md)


