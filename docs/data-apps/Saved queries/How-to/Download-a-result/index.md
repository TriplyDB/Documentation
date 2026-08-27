[TOC]

<!-- SOURCE: triply-db-getting-started/saved-queries/index.md — "Downloading a query result",
     unchanged apart from house style. Two images: queryResult.png, queryResult2.png.
     The visualisation/format table has been moved to reference/result-formats.md and is
     linked from here rather than repeated. -->

# Download a query result

The result of a query can be downloaded from the TriplyDB interface.

1. Save the query and open it in TriplyDB, for example
   <https://triplydb.com/DBpedia-association/-/queries/timeline-cars/>.
2. Select the visualisation option matching the format you want. For JSON, select **Response**.
3. Click the download icon, or scroll down and click **Download result**.

![Download the query result via the download icon](../../../../assets/queryResult.png)

![Download the query result via the Download result button](../../../../assets/queryResult2.png)

The file is stored in your `Downloads` folder and named after the query — in this example,
`timeline-cars.json`. It contains the query result as a JSON object, the same object TriplyDB
displays when you select **Response**.

To download in CSV instead, select **Table** and click the download icon. The file is named after
the query with the suffix `.csv`.

Not every visualisation can be downloaded, and the ones that can produce different file formats.
See [Result formats](../reference/result-formats.md) for the full table.

Downloading stops at 10 000 results. For larger result sets, see
[Retrieve more than 10 000 results](paginate-results.md).

