[TOC]

# Service

Service objects describe specific functionalities that can be created over datasets in TriplyDB.

Service objects are obtained through the the following methods:

- [`Dataset.addService`](../dataset#datasetaddservicename-string-metadata-object)
- [`Dataset.getServices`](../dataset#datasetgetservices)

A service always has one of the following statuses:

<dl>
  <dt>Removing</dt>
  <dd>The service is being removed.</dd>

  <dt>Running</dt>
  <dd>The service is running normally.</dd>

  <dt>Starting</dt>
  <dd>The service is starting up.</dd>

  <dt>Stopped</dt>
  <dd>The services was stopped in the past. It cannot be used at the moment, but it can be enable again if needed.</dd>

  <dt>Stopping</dt>
  <dd>The service is currently being stopped.</dd>
</dl>


## Service.delete()

Permanently deletes this service.

### Examples

```ts
const user = await triply.getAccount('my-account')
const dataset = await user.getDataset('my-dataset')
const service = await dataset.addService('my-service')
await service.delete()
```


## Service.getInfo()

Returns information about this service.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

### Examples

- The following snippet prints information about the newly created service (named `my-service`):

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const service = await dataset.addService('my-service')
console.log(await service.getInfo())
```

## Service.isUpToDate()

Returns whether this service is synchronized with the dataset contents.

### Synchronization

Because services must be explicitly synchronized in TriplyDB, it is possible to have services that expose an older version of the dataset and services that expose a newer version of the dataset running next to one another. There are two very common use cases for this:

- The production version of an application or website runs on an older service. The data does not change, so the application keeps working. The acceptance version of the same application or website runs on a newer service. Once the acceptance version is finished, it becomes the production version and a new service for the new acceptance version is created, etc.

- An old service is used by legacy software. New users are using the newer endpoint over the current version of the data, but a limited number of older users want to use the legacy version.

### Examples

The following code checks whether a specific service is synchronized:

```ts
const account = await triply.getAccount()
const dataset = await account.getDataset('my-dataset')
const service = await dataset.ensureService('my-service', {type: 'sparql'})
console.log(await service.isUpToDate())
```


## Service.update()

Synchronizes the service. Synchronization means that the data that is used in the service is made consistent with the data that is present in the graphs of the dataset.

When one or more graphs are added or deleted, existing services keep exposing the old state of the data. The changes in the data are only exposed in the services after synchronization is performed.

### Examples

When there are multiple services, it is common to synchronize them all *in sequence*. This ensures that there are always one or more services available. This allows applications to use such services as their backend without any downtime during data changes.

The following code synchronizes all services of a dataset in sequence:

```ts
for (const service of await dataset.getServices()) {
  service.update()
}
```

Although less common, it is also possible to synchronize all services of a dataset *in parallel*. This is typically not used in production systems, where data changes must not result in any downtime. Still, parallel synchronization can be useful in development and/or acceptance environments.

The following code synchronizes all services of a dataset in parallel:

```ts
await Promise.all(dataset.getServices().map(service => service.update()))
```


## Service.waitUntilRunning()

A service can be stopped or updated. The use of asynchronous code means that when a start command is given it takes a while before the service is ready for use. To make sure a service is available for querying you can user the function `waitUntilRunning()` to make sure that the script will wait until the service is ready for use.

### Example

An example of a service being updated and afterwards a query needs to be executed:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getAccount()
const dataset = await user.getDataset('some-dataset')
const service = await dataset.getService('some-service')
// starting a service but does not wait until it is started
await service.start()
// Function that checks if a service is available
await service.waitUntilRunning()
```

## Setting up index templates for ElasticSearch service
TriplyDB allows you to configure a custom mapping for Elasticsearch services in TriplyDB using index templates.
#### Index templates
Index templates make it possible to create indices with user defined configuration, which an index can then pull from. A template will be defined with a name pattern and some configuration in it. If the name of the index matches the template’s naming pattern, the new index will be created with the configuration defined in the template.
Official documentation from ElasticSearch on how to use Index templates can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html). 

Index templates on TriplyDB can be configured through either [TriplyDB API](../../triply-api/#index-templates) or `TriplyDB-JS`. 

When creating a new service for the dataset, we add the config object to the metadata:
```
Dataset.addService("SERVICE_NAME", {
  type: "elasticSearch",
  config: {
    indexTemplates: [
      {
        "index_patterns": "index",
        "name": "TEMPLATE_NAME",
       ...
      }
    ]
  }
})
```
`index_patterns` and `name` are obligatory fields to include in the body of index template.
It's important that every index template has the field `index_patterns` equal `index`!

Below is an example of creating an index template in TriplyDB-JS:
```
import App from '@triply/triplydb/App.js'
import dotenv from 'dotenv'
dotenv.config()

const app = App.get({ token: process.env.TRIPLYDB_TOKEN })
const account = await app.getAccount('ACCOUNT')
const dataset = await account.getDataset('DATASET')

await dataset.addService('SERVICE_NAME',
        {
            "type": "elasticSearch",
            "config": {
                "indexTemplates": [
                    {
                        "name": "TEMPLATE_NAME",
                        "index_patterns": "index"
                    }

                ]
            }
        }
    )
```

### Component templates
Component templates are building blocks for constructing index templates that specify index mappings, settings, and aliases.
You can find the official documentation on their use in ElasticSearch [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-component-template.html).
They can be configured through either [TriplyDB API](../../triply-api/#component-templates) or `TriplyDB-JS`.


When creating a new service for the dataset, we add the config object to the metadata:
```
Dataset.addService("SERVICE_NAME", {
  type: "elasticSearch",
  config: {
    componentTemplates: [
            {
                "name": "TEMPLATE_NAME",
                "template": {
                    "mappings": {
                        "properties": {
                            ...
                        }
                    }
                }
             ...
            }
        ]
  }
})
```
`name` and `template` are obligatory fields to include in the body of component template.
Component template can only be created together with an index template. In this case Index template needs to contain the field `composed_of` with the name of the component template.

Below is an example of creating a component template for the property `https://schema.org/dateCreated` to be of type `date`.

```
import App from '@triply/triplydb/App.js'
import dotenv from 'dotenv'
dotenv.config()

const app = App.get({ token: process.env.TRIPLYDB_TOKEN })
const account = await app.getAccount('ACCOUNT')
const dataset = await account.getDataset('DATASET')

await dataset.addService('SERVICE_NAME',
        {
            "type": "elasticSearch",
            "config": {
                "indexTemplates": [
                    {
                        "name": "TEMPLATE_NAME",
                        "index_patterns": "index",
                        "composed_of": ["COMPONENT_TEMPLATE_NAME"],
                    }

                ],
                "componentTemplates": [
                    {
                        "name": "COMPONENT_TEMPLATE_NAME",
                        "template": {
                            "mappings": {
                                "properties": {
                                    "https://schema org/dateCreated": {
                                        "type": "date"
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        }
    )
```
