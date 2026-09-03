# TriplyDB Editor

## FAQ

### Opening and access

**I don't see "Editor" in the left-hand navigation. Why?**
The Editor feature must be enabled for your TriplyDB instance by an administrator. If you do not see it, contact your TriplyDB administrator.

**Can I use the Editor on any dataset?**
You can use the Editor on any dataset that has a SHACL shapes graph and for which the Editor feature has been enabled. Datasets without a shapes graph will not have forms available, though you can start adding shapes via the data model view (see below).

### Creating instances

**How do I create a new instance?**

![The Editor entry in the left-hand navigation panel](../../../assets/editor-create-2026.png)

Select the **create** button in the top-right corner of the Editor pane. Choose the class for the new instance from the picker. The Editor generates an IRI automatically; you can change it if needed. Fill in the required properties and save.

**Can I reuse the IRI of an existing instance?**
No. The **create** dialog blocks the use of an IRI that already exists in the dataset, to prevent overwriting existing data.

**Can I base a new instance on an existing one?**
Yes. Open the existing instance, then select the **copy** button. A new instance is created with the same property values. You can then edit the copy as needed.

### Editing instances

**What do the asterisks (*) in forms mean?**
An asterisk marks a mandatory property. You cannot save an instance until all mandatory properties have a value.

**Can a property have more than one value?**
Yes, for properties that allow multiple values. Select the **+** symbol next to the property to add another value.

**How do I remove a property value?**
Select the **waste basket** symbol next to the value you want to remove.

**Can I see who last changed an instance?**

![The Editor entry in the left-hand navigation panel](../../../assets/editor-history.png)

Yes. The instance detail panel shows **Modified by** and **Modified** for the most recent change. To see the full history, select the backward-clock symbol.

**How do I delete an instance?**
Open the instance and select the **delete** button. You are asked to confirm before the instance is actually deleted.

### SKOS-specific questions

**How do I work with more than one concept scheme at the same time?**
In the SKOS view, after selecting a concept scheme, press in the space behind its name in the **concept scheme(s)** field and select an additional scheme. Each scheme in the chain is shown in a different colour. This is useful for concept schemes that are linked via `skos:narrowMatch` or `skos:broadMatch`.

**How do I search within the concept hierarchy?**
Use the **Search in hierarchy** input field that appears below the concept tree once a concept scheme has been selected.

**What does the > symbol mean in the concept tree?**
A **>** symbol before a concept name means that concept has child concepts. Select **>** to expand the concept. A dot (•) before a name means the concept has no children.

### Data model and SHACL

**What if my ontology does not have SHACL shapes yet?**
Classes that are defined in the ontology but do not yet have SHACL node shapes are shown in the data model tree alongside shaped classes. When you select one and start editing, the Editor adds a SHACL node shape for that class automatically.

**I want to create a class that already exists in my ontology. Can I do that?**
When you use the **create** button to add a new class, the picker suggests ontology classes that do not yet have a shape. If you choose one, the label, description, and parent class are pre-filled from the ontology.

### Deprecated terms

**What does strikethrough styling mean in the Editor?**
Strikethrough styling indicates that the resource is deprecated — it has been marked with `owl:deprecated true`. The resource is still fully viewable and editable; the marking is informational only.

**Can I still edit a deprecated resource?**
Yes. Deprecated resources remain fully editable in the Editor. A warning is displayed in the instance detail panel when a deprecated resource is open, but no editing functionality is blocked.

### Integration with other TriplyDB features

**Can I use the Editor together with other TriplyDB views like Browser or Triples?**
Yes. In the instance detail panel, the IRI of an instance is shown as a hyperlink. You can drag and drop this hyperlink onto the **Browser** or **Triples** entry in the left-hand navigation to open the same resource in that view.

**Can I open a specific instance in the Editor directly, without navigating through the tree?**
Yes. Instance hyperlinks from other TriplyDB views (such as Browser) can be dragged and dropped onto the **Editor** entry in the left-hand navigation. The Editor opens and shows that instance directly.

**Chapter navigation:**

[Overview](../index.md) 

[Getting Started](../Getting-started/index.md) 

[Concepts](../Concepts/index.md) 

[Reference](../Reference/index.md) 

[FAQ](../FAQ/index.md)


