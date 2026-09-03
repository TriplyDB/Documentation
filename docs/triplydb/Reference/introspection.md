<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: split out of triply-db-getting-started/reference/index.md, the
     "Introspection" section. Content unchanged apart from house style; the two
     absolute docs.triply.cc links in the example have been made relative. -->

# Introspection

Introspection functions return data about the environment a query is running in —
which instance, which dataset, which user. They take no arguments.

They are useful whenever a query has to adapt to its context rather than being
written for one dataset or one person.

<!-- NEW: the second sentence. The source explains what introspection is without
     saying when you would reach for it. -->

<!-- SOURCE: reference/index.md#introspection — definition, the function table and
     the worked example, all unchanged. -->

Introspection is supported by Speedy, TriplyDB's default SPARQL engine. The
service of a saved query must therefore be set to **Speedy** for these functions
to work.

All introspection functions live in the namespace
`https://triplydb.com/Triply/function/`, abbreviated below as `tf:`:

```sparql
prefix tf: <https://triplydb.com/Triply/function/>
```

## The functions

| Function | Returns | Description |
| --- | --- | --- |
| `tf:instance_url()` | `xsd:anyURI` | The URL of the TriplyDB instance |
| `tf:authenticated_user_url()` | `xsd:anyURI` | The URL of the user running the query |
| `tf:authenticated_user_name()` | `xsd:string` | The name of the user running the query |
| `tf:queried_dataset_url()` | `xsd:anyURI` | The URL of the dataset being queried |
| `tf:queried_dataset_name()` | `xsd:string` | The name of the dataset being queried |
| `tf:queried_dataset_owner_url()` | `xsd:anyURI` | The URL of the owner of that dataset |
| `tf:queried_dataset_owner_name()` | `xsd:string` | The name of the owner of that dataset |

## Example: a personalised overview

One use is building data stories that adapt to whoever is reading them. This
query matches the current user's URL against provenance data recorded by the
Editor, producing a personal overview of that user's Editor operations:

```sparql
prefix tf:     <https://triplydb.com/Triply/function/>
prefix editor: <https://triplydb.com/Triply/TriplyDB-instance-editor-vocabulary/>

select ?action ?time
where {
  bind(iri(tf:authenticated_user_url()) as ?userIri)
  ?event
    editor:actor ?userIri;
    editor:action ?action;
    editor:time ?time.
}
```

Note the `iri()` around the function call. The function returns a URI-typed
literal, and it has to be turned into an IRI before it can match a term in the
data.

<!-- NEW: the closing note. The source shows iri() in the example without
     explaining it, and it is the step that is easy to leave out. Confirm the
     explanation is accurate. -->

## Related

- [SPARQL: the basics](../../academy/sparql.md) — `bind` and the rest of the
  syntax used above
- [View data](../How-to/view-data.md) — running a query in the SPARQL IDE

