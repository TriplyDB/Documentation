---
title: "Triply ETL: Extract: Record"
path: "/docs/triply-etl/extract/record"
---

Records in TriplyETL contain several special keys.  These special keys start with a dollar sign character (`$`).  The special keys contain values that are interted during the Extract step.  These special keys can be used in the same way as regular keys in your TriplyETL configuration.  We now discuss these special keys in detail.



## Special key `$recordId`

The special key `$recordId` assigns a unique number to every record that is processed in one single run of a TriplyETL pipeline.

If the source data does not change, multiple runs of the TriplyETL pipeline will always generate the same record IDs.  However, if source data changes, multiple runs of the TriplyETL pipeline may generate different record IDs for the same record.

### Use case: Unique identifiers

The first main use case of the `$recordId` key is to create IRIs that are unique within one single run of a TriplyETL pipeline.

Suppose the following table is our source data:

| First name | Last name |
| ---------- | --------- |
| John       | Doe       |
| Jane       | Doe       |
| John       | Doe       |

We need to create an IRI for every person in this table.  Notice that the table contains no unique properties: there are two different persons with the same first and last name.  This means that we cannot use the keys "First name" and "Last name" in our record in order to create our IRIs.  Luckily, the source connector adds the `$recordId` for us:

```json
{
  "First name": "John",
  "Last name": "Doe",
  "$recordId": 1
}
{
  "First name": "Jane",
  "Last name": "Doe",
  "$recordId": 2
}
{
  "First name": "John",
  "Last name": "Doe",
  "$recordId": 3
}
```

This allows us to make the following assertion:

```ts
pairs(iri(prefix.id, '$recordId'),
  [a, sdo.Person],
  [sdo.givenName, 'First name'],
  [sdo.familyName, 'Last name'],
),
```

Which results in the following linked data:

```turtle
id:1
  a sdo:Person;
  sdo:givenName 'John';
  sdo:familyName 'Doe'.

id:2
  a sdo:Person;
  sdo:givenName 'Jane';
  sdo:familyName 'Doe'.

id:3
  a sdo:Person;
  sdo:givenName 'John';
  sdo:familyName 'Doe'.
```

Notice that the use of the `$recordId` results in a correct single run of the TriplyETL pipeline.  But if the source data changes, the IRIs may change as well.  For example, if the first and second row in the source table are swapped, the IRI that denotes "Jane Doe" will change from `id:2` to `id:1`.

### Use case: Debugging

When you are debugging the configuration of a TriplyETL pipeline, it is sometimes useful to perform a specific actions for a specific record.  Assuming the stream of records is stable during the debugging effort, the `$recordId` key can be used to perform such a debugging action; for example:

```ts
whenEqual('$recordId', 908, logRecord()),
```

Do note that it is generally better to run the TriplyETL for a specific record using the `--from-record-id 908 --head 1` command line flags (see [CLI](/docs/triply-etl/cli)).



## Special key `$environment`

The TriplyETL record contains special key `$environment`.  Its value denotes the DTAP environment that the pipeline is currently running in.  This is one of the followin values: "Development", "Test", "Acceptance", or "Production".

See [the Automation tutorial](/docs/triply-etl/tutorials/automation) for more information.



## Special key `$sheetName`

The special key `$sheetName` only occurs in records that original from data source that use the Microsoft Excel format.  In such records, this special key contains the name of the sheet from which the record originats.

See [the documentation for the Microsoft Excel format](/docs/triply-etl/connect/formats/#sheetName) for more information about this special key.
