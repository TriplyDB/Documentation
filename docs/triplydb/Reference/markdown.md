[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: split out of triply-db-getting-started/reference/index.md, the
     "Markdown support" section and all of its subsections. The remainder of that
     source page goes to reference/introspection.md (Introspection) and to
     _parked/access-security/ (Access levels, Roles).
     The old anchor #markdown-support is linked from uploading-data — see the
     review block. -->

# Markdown support

Several fields in TriplyDB accept Markdown rather than plain text:

- Dataset description
- Account description
- Saved query description
- Data story elements
- Site welcome message

<!-- SOURCE: reference/index.md#markdown-support — the whole of this page, tables
     and examples unchanged. -->

This page lists the Markdown that is supported.

## Headings

A hash character (`#`) at the start of a line marks a heading. More hashes mean a
deeper level.

```markdown
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

## Text styling

| Style | Syntax | Output |
| --- | --- | --- |
| Bold | `**bold**` | **bold** |
| Italic | `_italic_` | _italic_ |
| Strikethrough | `~~strikethrough~~` | ~~strikethrough~~ |

## Hyperlinks

| Style | Syntax | Output |
| --- | --- | --- |
| Raw URL | `<https://triply.cc>` | <https://triply.cc> |
| Labelled URL | `[label](https://triply.cc)` | [label](https://triply.cc) |

URLs may be relative, which lets you refer to other datasets, saved queries and
so on by path rather than by full address.

## Code

### In-line code

Single backticks mark code inside a sentence:

```md
Use `code` inside a sentence.
```

### Code blocks

Three consecutive backticks open and close a block:

<pre>
```sparql
select * {
  graph ?g {
    ?s ?p ?o.
  }
}
```
</pre>

which renders as:

```sparql
select * {
  graph ?g {
    ?s ?p ?o.
  }
}
```

### Code languages

The opening backticks may be followed by a language name, which turns on syntax
highlighting. The most commonly used here:

| Language | Syntax |
| --- | --- |
| SPARQL | `sparql` |
| Turtle | `ttl` |
| TypeScript | `typescript` |
| R | `r` |
| Python | `python` |

Also supported: Bash (`bash`), C (`c`), C++ (`cpp`), C# (`csharp`), Extended
Backus-Naur Form (`ebnf`), Go (`go`), Haskell (`haskell`), Java (`java`),
JavaScript (`javascript`), LaTeX (`latex`), Makefile (`makefile`), Markdown
(`markdown`), Objective-C (`objectivec`), Pascal (`pascal`), Perl (`perl`),
PowerShell (`powershell`), Prolog (`prolog`), regular expressions (`regex`), Ruby
(`ruby`), Scala (`scala`), SQL (`sql`), YAML (`yaml`).

## Related

- [Publish data](../How-to/publish-data.md) — where dataset descriptions are set
- [Upload data](../How-to/upload-data.md) — where a description is first entered

