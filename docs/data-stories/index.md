---
title: "Data Stories"
path: "/docs/data-stories"
---

Data Stories allows a sequence of SPARQL queries to be published
within an HTML document.

Examples can be found [here](https://stories.triply.cc)

## Getting Started

### Minimal working example

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="{{FIRST-AUTHOR}}, {{SECOND-AUTHOR}}, …" />
    <meta
      name="description"
      content="{{INSTANCE}} Data Stories ― {{STORY-TITLE}}"
    />
    <title>{{INSTANCE}} Data Stories ― {{STORY-TITLE}}</title>
    <link rel="stylesheet" href="{{LINK-TO-STORIES-CSS}}"/>
    <script src="{{LINK-TO-STORIES-JS}}"></script>
  </head>
  <body>
  <script>
  </script>
  </body>
</html>
```

### Best Practices

### Markup language declaration

Data Stories are written in HTML 5. This is declared at the beginning
of the document:

```html
<!DOCTYPE html>
```

### Main natural language declaration

The natural language in which most of the Data Story will be written
is declared in the `lang` attribute of the outer `html` tag:

```html
<html lang="en-us">
  …
</html>
```

Specific (sub)sections of a Data Story that are written in another
main natural language must declare this on the corresponding tag.

### Encoding declaration

Since Data Stories are encoded in UTF-8, this is declared at the
beginning of the `head` content:

```html
<head>
  <meta charset="utf-8" />
  …
</head>
```

Placement at the beginning of the `head` is required, since User
Agents may apply limited lookahead in order to determine the document
encoding. Placing the encoding declaration later in the `head`
content may result in some User Agents not detecting it.

### Metadata

The `author` and `description` meta tags must both be supplied as
children of the `head` tag, and their content must be structured
according to the below template. The `title` tag must have the same
content as the `description` meta tag.

```html
<head>
  …
  <meta name="author" content="{{FIRST-AUTHOR}}, {{SECOND-AUTHOR}}, …" />
  <meta
    name="description"
    content="{{INSTANCE}} Data Stories ― {{STORY-TITLE}}"
  />
  <title>{{INSTANCE}} Data Stories ― {{STORY-TITLE}}</title>
  …
</head>
```

### Navigation bar

Data Stories contain a navigation bar that allows users to return to
the Data Stories overview page.

```html
<body class="withNavbar">
  <nav class="navbar fixed-top ">
    <div class="navbar-content">
      <div class="navbar-icon">
        <a class="navbar-brand" href="/">
          <img
            alt="{{INSTANCE}} Data Stories home"
            src="/assets/imgs/{{INSTANCE}}-logo-square.png"
          />
        </a>
      </div>
      <div class="navbar-title">
        <a class="navbar-brand" href="/">{{INSTANCE}} Data Stories</a>
      </div>
    </div>
  </nav>
  …
</body>
```

### External links

Links that appear in the Data Story and that link to other web pages
must be specified in the following way:

```html
<a href="…" rel="noopener noreferrer" target="_blank">…</a>
```

Every link that contains `target="_blank"` is susceptible to reverse
tabnagging, a serious security vulnerability explained in [this
article](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/)

Attribute `rel="noopener"` is a relatively new feature, available
since Chrome 49 (2016-03-02), Firefox 52 (2017-03-07), and Safari 10.1
(2017-03-27). It is not supported by Microsoft browsers.

In old and/or Microsoft browsers `rel="noreferrer"` can be used to
achieve a similar effect: it prevents the `Referrer` HTTP header from
being sent.

## Components

Data Stories defines the following two HTML elements:

- `<div class="story">` :: The tag that contains zero or more
  `<query>` tags and that implements the Data Story.

- `<query>` :: The tag that implements one query within the Data
  Story.

### Story

The following attributes are defined on a `<div class="story">`
element:

- `data-endpoint` :: The URI of the SPARQL endpoint against which
  all queries in the Data Story are executed.

- `data-output` :: The output format that is used to display SPARQL
  result sets in. The following values are
  supported:

  - `boolean` :: Shows the result of an `ask` query.

  - `error` :: Display the error value.

  - `gallery` :: Shows HTML widgets in card rows.

  - `gchart` :: Shows a UI for selecting numeric properties in order
    to generate various diagrams.

  - `geo` :: Shows GeoSPARQL results on a 2D map.

  - `geo3d` :: Shows GeoSPARQL results on a 3D map.

  - `pivot` :: Shows a UI for selecting numeric properties in order
    to generate various diagrams and pivot tables.

  - `raw` :: The textual content of the HTTP reply body. For
    example, the SPARQL result set serialized in XML, JSON,
    or CSV.

  - `table` :: Shows the results in rows of an HTML table. This is
    the default value.

### Query

The following attributes are defined on the `query` element:

- `data-config-ref="URI"` :: The URI of a saved query in TriplyDB.

- `data-config="URI"` :: A URI that encodes a query together with
  the configuration of a specific view. These URIs can be
  created within the SPARQL IDE.

- `data-endpoint="URI"` :: The URI of the SPARQL endpoint against
  which a particular query is evaluated. When absent, the value
  of this attribute on the `<div class="story">` tag is used.

- `data-query-ref="URI"` :: An absolute or relative URI to a file
  that stores a SPARQL query.

- `data-output="VALUE"` :: The output format that is used to display
  the SPARQL result set. When absent, the value of this
  attribute on the `<div class="story">` tag is used. See the
  documentation of the Story element for the supported values.

- `data-show-query` :: By default, the query editor is hidden. When
  this attribute is present, the query editor is shown.

### Stacked story
