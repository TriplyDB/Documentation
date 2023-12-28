[TOC]

# Postgres extractor

PostgreSQL or Postgres is an open-source relational database system. Postgres supports both SQL (relational) and JSON (non-relational) querying. TriplyETL has a dedicated `fromPostgres()` extractor to retrieve data from a Postgres database.



## Basic usage

The Postgres extractor is imported in the following way:

```ts
import { fromPostgres, Source } from '@triplyetl/etl/generic'
```

The following code snippet extracts records form a public database URL:

```sh
fromPostgres(
  'select * from rnc_database',
  { url: 'postgres://reader:NWDMCE5xdipIjRrp@hh-pgsql-public.ebi.ac.uk:5432/pfmegrnargs' }
),
```



## Connector configuration

Alternatively, a Postgres dataset can be accessed via connector configuration.

The following code snippet accesses the same public database, but uses connector configuration to do so:

```ts
fromPostgres(
  'select * from rnc_database',
  {
    host: 'hh-pgsql-public.ebi.ac.uk',
    port: 5432,
    database: 'pfmegrnargs',
    user: 'reader',
    password: 'NWDMCE5xdipIjRrp',
  }
),
```
