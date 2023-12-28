[TOC]

# Internal Store

The internal store is the storage location for linked data that is created by one or more of the following steps:

- Step 3 [**Assert**](../assert/index.md) uses data from the [record](./record.md) to make linked data assertions in the [internal store](../generic/internal-store.md).
- Step 4 [**Enrich**](../enrich/index.md) improves and extends linked data in the internal store.
- Step 5 [**Validate**](../validate/index.md) ensures that linked data in the internal store meets the specified quality criteria.

Every record that is extracted from a data source has its own internal store (decoupling). The size of the internal store is typically small (because at the record level). This is done on purpose, to ensure that a large number of records can be processed in parallel, without using many hardware resources.

Once linked data in the internal store is finalized for one record, the following step can be performed:

- Step 6 [**Publish**](../publish/index.md) takes the linked data from the internal store, and publishes it to a destination such as [TriplyDB](../../triply-db-getting-started/index.md).
