# TriplyDB Editor

## Getting Started

By the end of this section you will have opened the Editor, selected a view, found an existing instance, and made a change to it.

> **Prerequisite:** To use the Editor, you need an active TriplyDB dataset that has a SHACL shapes graph and for which the Editor feature has been enabled. If your dataset does not yet have a shapes graph, see [Concepts](../Concepts/index.md) section.

### Step 1 — Open the Editor

![The Editor entry in the left-hand navigation panel](../../../assets/editor-open-2026.png)

Open the dataset you want to work with in TriplyDB. In the left-hand navigation panel, select **Editor**. The Editor pane opens.

If you do not see **Editor** in the left-hand navigation, the feature has not been enabled for this TriplyDB instance. Contact your TriplyDB administrator.

### Step 2 — Choose a view

![The Editor entry in the left-hand navigation panel](../../../assets/editor-view-skos-2026.png)

In the top-left corner of the Editor pane, select the **view** button. A dropdown list shows all views that have been configured for this dataset. Select the view you want to work with. For datasets that contain a SKOS vocabulary, select the **SKOS** view.

If only one view is configured, the view button is still present but only one option is available.

### Step 3 — Select a concept scheme (SKOS view only)

![The Editor entry in the left-hand navigation panel](../../../assets/editor-select-concept-scheme.png)
If you are working in the SKOS view, select a concept scheme from the **concept scheme(s)** input field. You can pick from the dropdown list or start typing to filter by name. Once a concept scheme is selected, the concept hierarchy appears in the left panel of the Editor pane.

To work with multiple chained concept schemes, press in the space behind the name of the selected scheme and select an additional scheme. Each scheme in the chain is shown in a different colour.

### Step 4 — Find an instance

![The Editor entry in the left-hand navigation panel](../../../assets/editor-find.png)

Use the search box next to the **create** button to find an existing instance by label. Start typing to see a dropdown list of matching resources. Matching characters are shown in bold. Select an instance to open its details in the right panel.

Alternatively, if you are in the SKOS view and have selected a concept scheme, browse the concept tree on the left. Select a concept to open its details on the right.

### Step 5 — Edit the instance

In the instance detail panel on the right, select the **edit** button. The instance opens in a form. Make your changes:

- To add a property, select the **+** symbol next to that property.
- To remove a property value, select the **waste basket** symbol next to that value.
- For properties that support multiple values, you can add more than one entry.
- For properties with a controlled set of values, an input field shows a dropdown list. A small downward-facing triangle on the right of the field indicates that a dropdown is available. You can also start typing to filter the list.

Mandatory properties are marked with an asterisk (*). You cannot save the instance until all mandatory properties have a value.
![The Editor entry in the left-hand navigation panel](../../../assets/editor-form.png)

### Step 6 — Save your changes

After making your changes, save the instance. The change is written to the dataset immediately and recorded in the instance's modification history.

You now have a working knowledge of the core editing flow. See Q&A for guidance on less common tasks, and Concepts for definitions of terms used throughout the Editor.