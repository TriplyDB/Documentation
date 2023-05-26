# Retrieving Saved Queries in GRLC Format

The GRLC format provides query strings with metadata annotations, making it useful for applications that work with Linked Data. By retrieving saved queries in the GRLC format, you can leverage this standardized format in your applications, such as storing SPARQL queries in GitHub or integrating with other Linked Data tools.

## Step 1: Sending the API request

To retrieve a saved query in the GRLC format, you need to send an HTTP GET request to the TriplyDB API. The request should specify the desired response format as text/plain to receive the query string with GRLC annotations.

Here's an example cURL command for sending the API request applied to pokemon dataset:

```code 
curl -vL -H 'Accept: text/plain' 'https://api.triplydb.com/queries/JD/pokemonNetwork'
```
## Step 2: Understanding the Response

Once you send the API request, the TriplyDB API will respond with the saved query in the GRLC format. The response will include the query string annotated with GRLC metadata, providing additional information about the query.

Here's an example response:

```code
#+ endpoint_in_url: false
#+ description: This query shows a small subgraph from the Pokemon dataset.
#+ endpoint: https://api.triplydb.com/datasets/academy/pokemon/services/pokemon/sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX graph: <https://triplydb.com/academy/pokemon/graphs/data>
CONSTRUCT { ?sub ?pred ?obj. }
WHERE { GRAPH <https://triplydb.com/academy/pokemon/graphs/data> { ?sub ?pred ?obj. } }
LIMIT 100 
```

In the response, you'll find metadata annotations in the form of comments (#+). These annotations provide information such as the endpoint URL, a description of the query, and any defined prefixes.

## Step 3: Using the GRLC Format in Applications

Now that you have the query in the GRLC format, you can use it in your applications that work with Linked Data. Here are some ways you can make use of this format:

1. **Storing Queries**: Save the retrieved GRLC-formatted query in a text file or version control system like GitHub. By storing GRLC-formatted queries in GitHub, you can version control your queries, track changes, and collaborate with others. The metadata annotations within the queries provide valuable context and documentation, making it easier to understand and review the queries' evolution over time.

2. **Integration with Linked Data Tools**: You can use the GRLC-formatted query as input for Linked Data tools and libraries that support this format. These tools can use the metadata annotations to enhance query execution or provide additional functionalities. For example, the Linked Data tool may use the endpoint annotation to determine the SPARQL endpoint where the query should be executed. It can then dynamically execute the query against that endpoint, retrieve the movie data, and process it further.

3. **API Development**: If you're building an API that exposes Linked Data resources, you can use the GRLC format to define the API endpoints and query patterns. By parsing the GRLC annotations, you can generate API documentation and streamline data retrieval for your API users.