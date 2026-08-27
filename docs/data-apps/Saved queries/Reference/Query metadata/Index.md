[TOC]

<!-- SOURCE: two places, combined.
     1. triply-db-getting-started/saved-queries/index.md — "Query metadata", including
        saved-query-metadata.png.
     2. triply-api/index.md — "Query metadata (GRLC)", for the annotation keys and the
        text/plain retrieval. The API page keeps its own copy; this is the user-facing
        half. See the note below — one of the two should eventually link to the other. -->

# Query metadata

Every saved query has a metadata section.

## Fields

| Field | Set by | Notes |
|---|---|---|
| Title | You | Free text |
| Description | You | Free text |
| Access level | You | Decides who can open the URL and who needs a token |
| Version | System | The version currently shown |
| Dataset | System | Links to the dataset homepage |
| Service | System | Links to the services page containing that service |

![Metadata fields for a saved query in TriplyDB](../../../assets/saved-query-metadata.png)

## GRLC annotations

Additional metadata can be written inside the query string using the GRLC annotation format.
Annotations start with a hash and a plus sign (`#+`), which makes them SPARQL comments — the
annotated query is still a valid query. See the
[GRLC project](https://github.com/CLARIAH/grlc) for the format.

For example, this annotation tells an application to repeat the query every hour:

```sparql
#+ frequency: hourly
```

Annotations documented for TriplyDB:

| Annotation | Meaning |
|---|---|
| `description` | Human-readable description of what the query is for, what it returns, or the process it is used in |
| `endpoint` | The URL of the SPARQL endpoint queries are sent to |
| `endpoint_in_url` | Whether the endpoint URL can be set through the API. Default `false` in TriplyDB |

Retrieving annotations is described under [Saved query API](api.md).

