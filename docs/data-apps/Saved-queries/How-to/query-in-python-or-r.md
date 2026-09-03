[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — "Using a saved query in
     Python or R notebooks", unchanged apart from house style. The two internal links
     (API token, SPARQL pagination) are repointed. -->

# Use a query in Python or R

Because a saved query is a RESTful API, its results can be pulled straight into a Python script,
an R script or a Jupyter notebook. TriplyDB generates the connector code for you.

1. Open the saved query.
2. Click the `</>` button on the right side of the screen. The code snippet screen opens.
3. Select the language you want, Python or R.
4. Copy the snippet, either with the **copy to clipboard** button or by selecting it and pressing
   `ctrl-c`.
5. Paste the code where you want to use the data.

The data is stored in the `data` variable, in JSON format.

## Non-public queries

When the query is private or internal, add an authorisation header to the GET request. Without
it, the request returns an incorrect response. See
[Access and security](../../../access-security/index.md) for creating an API token.

<!-- LINK-TODO: currently triply-api/#creating-an-api-token, parked with access-security/. -->

## More than 10 000 results

The generated snippet fetches one result set. To retrieve a complete set larger than 10 000, see
[Retrieve more than 10 000 results](paginate-results.md).

