---
title: "OpenAPI Specifications"
path: "/blog/2023-04-openAPI-specifications"
date: "2023-04-07T11:15:00"
author: minajanicijevic
---


# Unleashing the Power of OpenAPI Specifications: TriplyDB's Step Forward in RESTful API Development


We are excited to announce that TriplyDB has taken a major leap forward by incorporating OpenAPI specifications into its arsenal of features! With this latest enhancement, TriplyDB now allows users to expose their saved queries using the OpenAPI specification, effectively transforming TriplyDB into a self-documenting REST API.

TriplyDB has always provided the ability to save queries, allowing users to store and reuse their frequently used queries. These saved queries were already mapped to paths in the REST API, making it convenient for users to access them programmatically. However, TriplyDB has now gone a step further by enhancing the existing API query paths to return OpenAPI specifications in YAML format when requested by the users.

So, what exactly are OpenAPI specifications? In simple terms, they are a standardized way of describing RESTful APIs. They provide a language- and framework-agnostic format for describing the endpoints, request and response formats, authentication mechanisms, and other important details of an API. OpenAPI specifications are typically written in YAML or JSON format, which makes them easy to read and understand by both humans and machines. In addition, they provide standardized ways of describing APIs, serve as documentation and allow interoperability and communication between different APIs.

Now let's look at the example of how OpenAPI specifications can be used in TriplyDB:

Let's consider “Triply” organization in TriplyDB that contains several datasets, stories, and queries (See figure 1). 

![Figure 1](TriplyDB.png)

The queries from this organization can be exposed using the OpenAPI specification. To retrieve the specification, you would need to make an HTTP request for that specific organization (For “Triply” organization, request would be: https://api.triplydb.com/queries/{name of organization}), specifying the accept header to indicate that you want the YAML format that encodes the OpenAPI specification (See figure 2 on how to do this). Once you have the specification, you can store it into a file for further use.

![Figure 2](terminal.png)


To interact with the OpenAPI specification, tools such as [Postman](https://www.postman.com/) can be used. The YAML file can be imported using Postman's import feature, and then "OpenAPI 3.0 with a Postman collection" (as shown in figure 3), which is the latest version of the standard, can be selected before clicking on "Import".

![Figure 3](howToIMportAPI.png)

 This will provide you with an overview of all the SPARQL queries in TriplyDB in Postman, and you can run them as REST API endpoints. You can send HTTP requests using Postman by clicking "Send," and you will receive back the results of the SPARQL query. Additionally, you can modify the request using Postman or other similar tools. For example, you can change the pages, the size, add headers, or add authentication (if it's not public data). This allows you to easily interact with the REST API using the OpenAPI specification and make changes to the requests as needed (see Figure 4).

![Figure 4](Postman.png)

The incorporation of OpenAPI specifications into TriplyDB is a big step towards making TriplyDB a more powerful and user-friendly platform for building RESTful APIs. We are excited about the possibilities that this enhancement brings and look forward to seeing how our users leverage the power of OpenAPI specifications in TriplyDB!

