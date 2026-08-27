[TOC]

<!-- SOURCE: triply-db-getting-started/viewing-data/index.md — sections "Transfer a SPARQL
     query" and "Copy a SPARQL query", extracted to
     _staging/data-apps/saved-queries/transfer-and-copy.md on 26 Aug and landed here.

     The staged file guessed at three levels of nesting for its image paths. That guess
     holds: this file sits at data-apps/saved-queries/how-to/, so ../../../assets/ is
     correct and the five image paths are unchanged.

     A pointer remains in triplydb/how-to/view-data.md under "Transfer or copy a query"
     and must now be repointed here. -->

# Transfer or copy a query

A saved query can be transferred to another account or a group, or copied rather than moved. Both
work in either direction between accounts and groups.

The two procedures start in different places: **transfer** is in the settings field, **copy** is
in the three-dot menu. Look in the wrong one and you will not find it.

## Transfer a query

On the query page, open the settings field:

![Where to find the transfer option on a query page](../../../../assets/where-find-transfer.png)

Choose transfer:

![The transfer option](../../../assets/transfer-query.png)

Then choose the destination:

![Choosing the organisation to transfer the query to](../../../../assets/transfer-to-organization.png)

You are redirected to the query's new page.

## Copy a query

Click the three dots in the top-right corner of the query and choose copy:

![The copy option on a query](../../../../assets/copyQuery.png)

Then choose the destination:

![Choosing the group to copy the query to](../../../../assets/selectOrganization.png)

You are redirected to the new query's page.

## What moves and what does not

Transferring moves the query, not the dataset it runs against. A transferred query still points
at its original dataset and service — see [the service binding](../concepts/index.md).

