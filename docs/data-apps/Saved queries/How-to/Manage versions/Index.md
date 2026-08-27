[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — "Creating a new version",
     plus the version-number half of "Sharing a saved query". Text substantially unchanged. -->

# Manage versions

Every save creates a new version. Nothing is overwritten, and older versions stay reachable at
their own URLs.

## Save a new version

1. Open the **Saved Queries** tab of the dataset.
2. Click the query you want to change.
3. Edit the query or the visualisation.
4. Click the save button.

The result is saved as a new version. The previous version is unaffected.

## Point a link at a specific version

A query URL with a version number always resolves to that version:

```uri
https://triplydb.com/DBpedia-association/-/queries/timeline-cars/9
```

Leave the number off and the URL follows the latest version:

```uri
https://triplydb.com/DBpedia-association/-/queries/timeline-cars
```

Use the numbered form wherever the result must stay stable — in an application, in a citation, in
a published data story. Use the unnumbered form where readers should see current work.

