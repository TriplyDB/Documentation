<!-- ============================================================
     SKELETON — NOT PUBLISHABLE AS IT STANDS.

     This page has no source. It exists because three pages in the current
     documentation give three different lists of service types, and they cannot
     all be right. Rather than pick one, every mention elsewhere now says "e.g."
     and points here, so this page becomes the single authoritative list.

     Filling it in needs a developer. The questions are marked TO CONFIRM below.
     Everything not marked is either evidence quoted from the existing docs or
     structure waiting for content.

     Pages that now link here:
       - triplydb/how-to/manage-services.md, "Create a service"
       - triplydb/how-to/manage-services.md, the Type column
     ============================================================ -->

# Service types

A service makes a dataset queryable in a particular way. This page lists the
service types TriplyDB supports, what each is for, and how to choose between
them.

<!-- TO CONFIRM 1: the complete list of service types currently supported.
     The three lists in the existing documentation are:
       - publishing-data, "Create service" screenshot:
           SPARQL, Jena SPARQL, Elasticsearch
       - admin-settings-pages, Type column of the services table:
           Virtuoso, Jena, Blazegraph, Prolog, Elasticsearch
       - viewing-data, SPARQL IDE section:
           Sparql, Jena
     Note these mix two vocabularies: what the user picks in the interface
     ("SPARQL", "Jena SPARQL") versus the underlying engine ("Virtuoso", "Jena",
     "Blazegraph", "Prolog"). Deciding which vocabulary this page uses is the
     first question — and the answer should probably be "both, in two columns". -->

## The types

<!-- Fill one row per service type. -->

| Service type | Query language | Best for | Notes |
| --- | --- | --- | --- |
| | | | |

<!-- TO CONFIRM 2: for each type, which query language or interface it exposes.
     TO CONFIRM 3: for each type, what it is suited to. The only guidance in the
     current documentation is from publishing-data:
       "Sparql — large amounts of instance data with a small data model"
       "Jena — smaller amounts of data with a richer data model"
     Is that still accurate, and is there equivalent guidance for the others?
     TO CONFIRM 4: which types are available on triplydb.com versus only on
     on-premise or specially configured instances. The phrase "TriplyDB instances
     can be configured with different types of services" implies this varies, but
     nothing says how. -->

## Choosing a service type

<!-- TO CONFIRM 5: the decision an ordinary user actually faces. Most people will
     see a short list in the "Create service" dialog and want one sentence telling
     them which to pick. That sentence is the most valuable thing on this page. -->

## Speedy

<!-- TO CONFIRM 6: how Speedy relates to the list above. It is described in the
     reference page as "TriplyDB's default SPARQL Engine", and introspection
     functions only work when the service is set to Speedy — but Speedy does not
     appear in any of the three service type lists. Is Speedy a service type, the
     engine behind the "SPARQL" type, or something else? This currently reads as a
     contradiction between two pages. -->

See [Introspection](introspection.md), which requires Speedy.

## Related

- [Manage services](../How-to/manage-services.md) — creating and maintaining
  services
- [View data](../How-to/view-data.md) — the query interfaces services enable
- [SPARQL: the basics](../../academy/sparql.md) — what a SPARQL service is for

