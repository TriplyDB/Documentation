[TOC]

# Online files

Online files are files that are publishing on some (public or private) server. TriplyETL supports online files with the `Source.url()` function.



## Basic usage

Online files are declared by using the `Source` object, which is imported in the following way:

```ts
import { Source } from '@triplyetl/etl/generic'
```

The following code snippet uses a public online file. The files is used by the [fromJson()](../extract/json.md) extractor:

```ts
fromJson(Source.url('https://somewhere.com/example.json')),
```



## Authorization

It is possible to access online files that are not publicly available. In such cases, the HTTP Authorization header must be specified.

The following code snippet uses the options object of `Source.url()` to specify the authorization header that is necessary to access the specified online file:

```ts
fromJson(
  Source.url(
    'https://somewhere.com/example.json',
    {
      request: {
        headers: {
          Authorization: `Basic ${username}:${password}`
        }
      }
    }
  )
),
```



## Other HTTP options

TriplyETL uses the [node-fetch library](https://github.com/node-fetch/node-fetch#options) to implement `Source.url()`. This means that all options supported by that library are also supported for online files.

For example, the following code snippet specifies the media type that is requested from an online location. Specifically, it requests the Turtle representation of the Amsterdam resource from DBpedia:

```ts
loadRdf(
  Source.url(
    'https://dbpedia.org/Amsterdam',
    {
      request: {
        headers: {
          Accept: 'text/turtle'
        }
      }
    }
  )
),
```



### Use in production systems

Online files are typically not used in production pipelines, because the availability of many Internet resources is outside of the control of the project team. Internet resources that are not maintained by team members may be subject to content-wise changes, which may affect the production pipeline.

If the project team controls the Internet resources, then risks are smaller. But at that point it is even better to upload the online files as [TriplyDB asset](#triplydb-assets) for additional benefits such as access controls.
