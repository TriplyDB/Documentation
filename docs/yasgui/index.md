---
title: "Yasgui"
path: "/docs/yasgui"
redirect_from:
  - "/docs/yasr"
  - "/docs/yasqe"
  - "/docs/sparql-editor"
---

This section explains the use of SPARQL via Yasgui. Yasgui provides
various advanced features for creating, sharing, and visualizing
SPARQL queries and their results.

## SPARQL Editor {#sparql-editor}

The Yasgui SPARQL editor is a query editor that offers syntax highlighting, syntax validation, autocompletion, a variety of different SPARQL result visualizations, with a plugin architecture that [enables customization](/docs/yasgui-api).

By default, the query editor provides autcomplete suggestions via the [LOV](https://lov.linkeddata.es/dataset/lov/) API.
Website maintainers can add their own autocompletion logic as well. For example, the Yasgui integration in [TriplyDB](https://triplydb.com) uses the TriplyDB API to more accurately provide suggestions based on the underlying data.

Sharing queries now involves less than having to copy/past complete SPARQL queries. Instead, you can share your query (and the corresponding visualization settings) using a simple URL.

### Supported key combinations

The following table enumerates the key combinations that are supported
by the SPARQL Editor.

| **Key combination** | **Behavior**                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `Alt + Left`        | Move the cursor to the beginning of the current line.                                             |
| `Alt + Right`       | Move the cursor to the end of the current line.                                                   |
| `Alt + U`           | Redo the last change within the current selection.                                                |
| `Ctrl + Backspace`  | Delete to the beginning of the group before the cursor.                                           |
| `Ctrl + Delete`     | Delete to the beginning of the group after the cursor.                                            |
| `Ctrl + End`        | Move the cursor to the end of the query.                                                          |
| `Ctrl + Home`       | Move the cursor to the start of the query.                                                        |
| `Ctrl + Left`       | Move the cursor to the left of the group before the cursor.                                       |
| `Ctrl + Right`      | Move the cursor to the right of the group the cursor.                                             |
| `Ctrl + [`          | Decrements the indentation for the current line or the lines involved in the current selection.   |
| `Ctrl + ]`          | Increments the indentation for the current line or the lines involved in the current selection.   |
| `Ctrl + /`          | Toggles on/off the commenting of the current line or the lines involved in the current selection. |
| `Ctrl + A`          | Select the whole query.                                                                           |
| `Ctrl + D`          | Deletes the current line or all lines involved in the current selection.                          |
| `Ctrl + U`          | Undo the last change within the current selection.                                                |
| `Ctrl + Y`          | Redo the last undone edit action.                                                                 |
| `Ctrl + Z`          | Undo the last edit action.                                                                        |
| `Ctrl + Shift + F`  | Auto-formats the whole query or the lines involved in the current selection.                      |
| `Shift + Tab`       | Auto-indents the current line or the lines involved in the current selection.                     |
| `Tab`               | Indents the current line or the lines involved in the current selection.                          |

### Templates

SPARQL has standardized capabilities for constructing complex strings
and literals. This allows human-readable label and HTML widgets to be
generated from within SPARQL. Unfortunately, the syntax for
constructing such labels and widgets is a bit cumbersome.

#### SPARQL-concat

For example, the following SPARQL query returns HTML widgets that can
be displayed in a web browser (see [SPARQL Gallery](#gallery)). It uses the
`concat` function which allows an arbitrary number of string arguments
to be concatenated into one string. Notice that this requires
extensive quoting for each argument (e.g., `'<h3>'`), as well as
conversions from literals to strings (e.g., `str(?typeName)`).
Finally, in order to return an HTML literal we need to first bind the
concatenated string to some variable `?lex`, and then apply the
`strdt` function in order to construct a literal with datatype IRI
`rdf:HTML`. You can [try this query
online](https://triplydb.com/academy/pokemon/queries/sparql-html).

```sparql
prefix def: <https://triplydb.com/academy/pokemon/def/>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select * {
  ?pokemon
    def:cry ?cry;
    def:type/rdfs:label ?typeName;
    foaf:depiction ?image;
    rdfs:label ?name.
  bind(concat('<h3>',str(?typeName),' 》 ',str(?name),'</h3>',
              '<img src="',str(?image),'">',
              '<audio controls src="',str(?cry),'"></audio>') as ?lex)
  bind(strdt(?lex,rdf:HTML) as ?widget)
}
limit 25
```

#### Handlebars

The SPARQL Editor in TriplyDB supports SPARQL Templates, which makes
it easier to write human-readable labels and HTML widgets. SPARQL
Templates are strings in which occurrences of `{{x}}` will be replaced
with the to-string converted results of bindings to SPARQL variable
`?x`.

The following example query produces the same result set as the above
one, but allows the entire HTML string to be written at once as a
SPARQL Template. Notice that this removes the need for concatenating
(`concat/n`), explicit to-string conversion (`str/1`), and also allows
the HTML literal to be constructed more easily (no `strdt/2` needed).
You can [try this query
online](https://triplydb.com/academy/pokemon/queries/sparql-templating/2).

```sparql
prefix def: <https://triplydb.com/academy/pokemon/def/>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select * {
  ?pokemon
    def:cry ?cry;
    def:type/rdfs:label ?typeName;
    foaf:depiction ?image;
    rdfs:label ?name.
  bind('''
<h3>{{typeName}} 》 {{name}}</h3>
<img src="{{image}}">
<audio controls src="{{cry}}"></audio>'''^^rdf:HTML as ?widget)
}
limit 25
```

SPARQL Templates can be combined with the [SPARQL Gallery](#gallery) feature in
order to generate galleries of HTML widgets.

## Visualizations {#visualizations}

The Yasgui visualization library (also called Yasr) offers various ways to explore your data with different visualizations. A number of visualizations are MIT licensed, where others (the 'pro' plugins) are restricted in license.

### Table {#table}

This view allows SPARQL results to be displayed in a table. Each
column in the table corresponds to a variable that belongs to the
outer projection. Each row in the table corresponds to one query
result. Each cell contains an RDF term or `NULL`.

#### Features

In addition to displaying the SPARQL result set, the SPARQL Table has
the following features:

|                   |                                                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Abbreviations** | The SPARQL Table uses the prefix declarations in the SPARQL query in order to abbreviate IRIs that appear in table cells.                                                                                                                                                                                                                                     |
| **Filter**        | By entering a search string into the “Filter query results” field, the table will only display result rows in which the entered search string appears.                                                                                                                                                                                                        |
| **Indices**       | The first column in the table indicates the index of each row in the SPARQL result set.                                                                                                                                                                                                                                                                       |
| **Pagination**    | By default the Table displays at most 50 rows. This maximum value can be changed to 10, 100, 1.000, or “All”.                                                                                                                                                                                                                                                 |
| **Sorting**       | A sort widget appears to the right of each header label. By pressing on the upward pointing arrow of he sort widget, rows will be sorted based on the lexicographic order of the values within the corresponding column. By pressing the downward pointing arrow of the sort widget, rows will be inversely sorted according to the same lexicographic order. |

#### Table Example

The following SPARQL query (or [see here](https://triplydb.com/academy/pokemon/queries/table-example/)) returns a table of Pokémon dragons (column
`pokemon`) and their happiness (column `happiness`). Notice that the
prefix for `pokemon` is not used in the query, but is used in order to
abbreviate the IRI syntax in the `pokemon` column. By clicking on the
sort widget next to the `happiness` header, the results can be
(inversely) sorted based on the happiness values.

```sparql
PREFIX pokemon: <https://triplydb.com/academy/pokemon/id/pokemon/>
PREFIX type: <https://triplydb.com/academy/pokemon/id/type/>a
PREFIX vocab: <https://triplydb.com/academy/pokemon/vocab/>
select ?pokemon ?happiness {
  ?pokemon
    vocab:type type:dragon;
    vocab:happiness ?happiness.
}```

![SPARQL Table view over the above query](sparql-table-example.png)

### Response {#response}

This view shows the body of the response and offers a easy way to download the result as a file.

### Gallery (pro) {#gallery}

This view allows SPARQL results to be displayed in an HTML gallery.
Each individual result corresponds to one HTML widget. Widgets are
displayed in rows and columns to make up a widget gallery.

#### Variables

The gallery will render an item based on variables in the following table:

| **Variable name**     | **Purpose**                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `?widget`             | The text or HTML content.                                             |
| `?widgetLabel`        | Title of the widget. Also used as the alternative text for the image  |
| `?widgetLabelLink`    | A url which converts the title into a link, depends on `?widgetLabel` |
| `?widgetImage`        | A url of an image to display                                          |
| `?widgetImageCaption` | A text description of the image, depends on `?widgetImage`            |
| `?widgetDescription`  | A text description                                                    |

#### Format

The widget will display the variables in the following order:

```markdown
- ?widgetLabel or ?widgetLabelLink
- ?widgetImage
  - ?widgetImageCaption
- ?widgetDescription
- ?widget
```

#### Styling

The `?widget` display is restricted in height. This might not always be desired. In such cases the following style tweaks can help to make them the right size:

```sparql
bind('''<div style="max-height:unset; width:275px;">
  # The HTML that composes the widget goes here.
</div>'''^^rdf:HTML as ?widget)
```

#### Gallery Example

The following SPARQL query binds an HTML string consisting of a header
(`h3`), an image (`img`), and an audio element (`audio`) to the
`?widget` variable. This results in a gallery with 25 widgets, each
displaying a Pokémon. (This SPARQL query also uses [[SPARQL
Templates]] in order to simplify its syntax.) This query can be [run
online](https://triplydb.com/academy/pokemon/queries/gallery).

![SPARQL Gallery view of a Pokémon query that uses SPARQL Templating](pokemon-gallery.png)

```sparql
prefix def: <https://triplydb.com/academy/pokemon/def/>
prefix foaf: <http://xmlns.com/foaf/0.1/>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select * {
  ?pokemon a def:Pokemon;
    def:baseAttack ?attack;
    def:baseDefense ?defense;
    def:baseExp ?experience;
    def:baseHP ?health;
    def:baseSpeed ?speed;
    def:cry ?cry;
    def:femaleRatio ?female;
    def:happiness ?happiness;
    def:maleRatio ?male;
    def:name ?name;
    foaf:depiction ?image;
    rdfs:label ?label.
  filter(langmatches(lang(?name),'ja'))
  bind('''
<h2>{{name}} ({{label}})</h2>
<img src="{{image}}">
<audio controls src="{{cry}}"></audio>
<ul>
  <li>Experience: {{experience}}</li>
  <li>Attack: {{attack}}</li>
  <li>Defense: {{defense}}</li>
  <li>Experience: {{experience}}</li>
  <li>Health: {{health}}</li>
  <li>Female ratio: {{female}}</li>
  <li>Happiness: {{happiness}}</li>
  <li>Male ratio: {{male}}</li>
  <li>Speed: {{speed}}</li>
</ul>'''^^rdf:HTML as ?widget)
}
order by desc(?experience)
limit 20
```

### Chart (pro) {#charts}

The chart plugin renders geographical, temporal and numerical data in interactive charts such as bar-, line- and pie charts.

The chart also plugin includes a treemap representation, that is suitable for displaying hierarchies. To use the treemap plugin, you must use the following projection variables in your SPARQL query (in this order):

| `?node`                   | `?parent`                                                                                                          | `?size`                                                                                   | `?color`                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| The label of a tree node. | Either the label of the node that is the parent of `?node`, or the value `UNDEF` in case `?node` is the root node. | (optional) :: For leaf nodes, a positive integer indicating the relative size of `?node`. | (optional) :: For leaf nodes, a double indicating the relative color of `?node`. |

Once the TreeMap is drawn it is possible to navigate the tree with the
mouse: left clicking on a node will drill down into the corresponding
subtree; right clicking on a node will move up to the subtree of its
parent node.
The chart configuration enables tweaking the treemap properties such as the number of displayed hierarchy levels.

### 2D Map (pro) {#geo}

This view allows SPARQL results that contain GeoSPARQL semantics to be
automatically interpreted and displayed on a 2D map.

#### Variables {#geo-variables}

This view recognizes the following SPARQL variable names:

| **Variable name** | **Purpose**                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `?x`              | An arbitrary variable name that is bound to literals with datatype IRI `geo:wktLiteral`, and whose name is the prefix of the other variable names in this table. |
| `?xColor`         | The color of the shape bound to `?x`.                                                                                                                            |
| `?xLabel`         | The text or HTML content of popups that appear when clicking the shape bound to `?x`.                                                                            |
| `?xTooltip`       | Text content that will appear when the shape of bound to `?x` is hovered                                                                                         |

##### Color values

Variable `?xColor` must include a value of the following types:

- [CSS color names](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
- [RGB color codes](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
- [HSL color codes](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
- **Gradients**: Strings of the form `{{PALETTE}},{{VALUE}}`, where `{{VALUE}}` is a floating-point number between 0.0 and 1.0 and `{{PALETTE}}` is the name of a color palette. We support color schemes from the [Colormap](https://www.npmjs.com/package/colormap) and [Color Brewer](http://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3) libraries

### 3D Map (pro) {#geo-3d}

This view allows SPARQL results that contain GeoSPARQL semantics to be
automatically interpreted and displayed on a 3D globe. It supports both 3D and 2.5D visualizations, depending on whether the GeoSPARQL data is stored in native 3D or in 2D

#### Variables {#geo-3d-variables}

This view recognizes the following SPARQL variable names:

| **Variable name** | **Purpose**                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `?x`              | An arbitrary variable name that is bound to 2D or 3D literals with datatype IRI `geo:wktLiteral`, and whose name is the prefix of the other variable names in this table. |
| `?xColor`         | The color of the shape bound to `?x`.                                                                                                                                     |
| `?xHeight`        | The height in meters of the 2.5D shape that is based on the 2D shape that is bound to `?x`. This variable is not needed if data is stored in native 3D.                   |
| `?xLabel`         | The textual or HTML content of the popups that appears when the shape that is bound to `?x` is clicked.                                                                   |
| `?xOffset`        | The height in meters at which the 2.5D shape that is based on the 2D shape that is bound to `?x` starts. This variable is not needed if data is stored in native 3D.      |

### Pivot Table (pro) {#pivot}

This view renders SPARQL results in an interactive pivot table where you are able to aggregate the results by dragging your binding variables to columns or rows.

### Timeline View (pro) {#timeline}

The SPARQL timeline renders the SPARQL results on a Timeline ([example](https://triplydb.com/wikimedia/dbpedia/queries/timeline-cars))
To get started with this visualization you need at least a result containing a `?eventStart` or `?eventDate` with either a `?eventDescription`, `?eventLabel` or a `?eventMedia`. (Combinations are also possible)
The following parameters can be used, Parameters in _Italic_ are experimental:

| **Variable name**        | **Purpose**                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `?eventStart`            | A date when an event started                                                                                                                |
| `?eventEnd`              | A date when an event Stopped                                                                                                                |
| `?eventDate`             | A date when an event happened                                                                                                               |
| `?eventDescription`      | Text/HTML about the event                                                                                                                   |
| `?eventLabel`            | Text/HTML title                                                                                                                             |
| `?eventMedia`            | Link to most forms of media see [documentation](https://timeline.knightlab.com/docs/media-types.html) for which type of links are supported |
| _`?eventType`_           | Groups events                                                                                                                               |
| _`?eventColor`_          | Colors event                                                                                                                                |
| _`?eventBackground`_     | Background of the event when selected                                                                                                       |
| _`?eventMediaCaption`_   | Caption of the Media                                                                                                                        |
| _`?eventMediaCredit`_    | The credit of the Media                                                                                                                     |
| _`?eventMediaThumbnail`_ | The thumbnail of Media                                                                                                                      |
| _`?eventMediaAlt`_       | The Alt text of the Media                                                                                                                   |
| _`?eventMediaTitle`_     | The Title of the Media                                                                                                                      |
| _`?eventMediaLink`_      | The URL the image should link to                                                                                                            |
