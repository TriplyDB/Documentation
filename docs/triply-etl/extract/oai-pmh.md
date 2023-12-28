[TOC]

# OAI-PMH extractor

In the GLAM (Galleries, Libraries, Archives, Museums) domain, the Open Archives Initiative (OAI), Protocol for Metadata Harvesting (PMH) is a popular protocol and format for publishing data collections. TriplyETL has a dedicated `fromOai()` extractor to tap into these data collections.

The `fromOai()` extractor ensures a continuous stream of data records. Under the hood, the extractor uses resumption tokens to iterate over large collections.



## Basic usage

The OAI-PMH extractor is imported in the following way:

```ts
import { fromOai, Source } from '@triplyetl/etl/generic'
```

An OAI-PMH endpoint can be configured by specifying its URL (parameter `url`). Since one OAI-PMH endpoint typically publishes multiple datasets, it is also common to specify the `set` parameter.

The following code snippet connects to an example dataset that is published in an OAI-PMH endpoint:

```ts
fromOai({
  set: 'some-dataset',
  url: 'https://somewhere.com/webapioai/oai.ashx'
}),
```


## Standards-compliance

TriplyETL supports the official OAI-PMH standard.

The OAI-PMH standard defines 6 'verbs'. These are different sub-APIs that together compose the OAI-PMH API. The `fromOai()` extractor currently supports the following two verbs: [ListIdentifiers](#verb-listidentifiers) and [ListRecords](#verb-listrecords).



## Verb 'ListIdentifiers'

This 'verb' or sub-API streams through the headers of all records. It does not returns the actual (body) content of each record (see [ListRecords](#verb-listrecords)). This verb can be used to look for header properties like set membership, datestamp, and deletion status.

The following code snippet streams through the headers of a public OAI-PMH endpoint:

```ts
fromOai({
  metadataPrefix: 'marcxml',
  set: 'iish.evergreen.biblio',
  url: 'https://api.socialhistoryservices.org/solr/all/oai',
  verb: 'ListIdentifiers'
}),
logRecord(),
```



## Verb 'ListRecords'

This 'verb' or sub-API streams through all records and retrieves them in full. This API is used to harvest records.

The following code snippet streams through the records of a public OAI-PMH endpoint:

```ts
fromOai({
  metadataPrefix: 'marcxml',
  set: 'iish.evergreen.biblio',
  url: 'https://api.socialhistoryservices.org/solr/all/oai',
  verb: 'ListRecords'
}),
logRecord(),
```
