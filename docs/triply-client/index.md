---
title: "Triply-DB"
path: "/docs/triply-client"
---

# Triply Client

Triply Client is the programming library that makes it easy to
interact with TriplyDB instances.  Triply Client allows you to
automate most operations that can be performed through the TriplyDB
GUI.

This document is a work in progress.  Please contact
[mailto:support@triply.cc](support@triply.cc) for more information.

## Getting started

This section gets you up and running with the Triply Client by setting
up a simple script.  The script will use Triply Client in order to
interact with a specific TriplyDB instance.

### Installation

The following steps are needed in order to install Triply Client:

1. Install [Node.js](https://nodejs.org) and
   [NPM](https://www.npmjs.com).

   Example for installation on recent Ubuntu versions:

   ```bash
   $ sudo apt install nodejs npm # Debian-based, e.g., Ubuntu.
   $ sudo dnf install nodejs npm # Red Hat-based, e.g., Fedora.
   ```

2. Create a Triply API Token through the TriplyDB GUI.

3. In your current terminal session, export the following environment
   variables:

   ```bash
   $ export TRIPLY_API_TOKEN=<some-token>
   $ export TRIPLY_API_URL=<some-url>
   ```

   You can also add these lines to your `.profile` file in order to
   add these environment variables to every future terminal session.

### Setting up a Triply Client project

The following steps are needed in order to setup a TypeScript project
that uses the Triply Client library:

1. Create a directory for your project:

   ```bash
   $ mkdir my_script
   ```

2. Create a file called `package.json` with the following content
   within the `my_script` directory:

   ```json
   {
     "name": "script",
     "version": "1.0.0"
   }
   ```

3. Install the TypeScript and Triply Client dependencies from within
   the `my_script` directory:

   ```bash
   $ npm install typescript @triply/client.js
   ```

### Create your first script

Once you have performed the installation and project setup, perform
the following steps in order to create and run your first script that
uses the Triply Client library:

1. Create a file called `script.ts` and add the following contents:

   ```typescript
   // Import the Triply Client.
   import Client from "@triply/client.js/build/src/App";

   // Configure the Triply Client.
   const client = Client.get({
     token: process.env.TRIPLY_API_TOKEN,
     url: process.env.TRIPLY_API_URL
   });

   // Perform Triply Client requests within an async context.
   async function run() {
     // Our first Triply Client request: obtain information of the
     // current user.
     console.log(await client.getAccount().info());
   }
   run().catch(e => {
     console.error(e);
     process.exit(1);
   });
   ```


2. Compile the TypeScript file into a corresponding JavaScript file:

   ```bash
   $ ./node_modules/.bin/tsc script.ts
   ```

3. Run the JavaScript file:

   ```bash
   $ node script.js
   ```

This should print the information of the current user to the terminal.
The current user is determined by the API Token that was set in the
`TRIPLY_API_TOKEN` environment variable.

### Using the Atom text editor (optional)

The Atom text editor provides advanced support for programming in
TypeScript, which makes it easier to use Triply Client by showing
typing feedback in the editor and offering autocomplete suggestions:

1. Install the [Atom](https://atom.io) text editor.

2. In order to let Atom use the correct TypeScript version, add a file
   called `tsconfig.json` with the following contents to your project
   directory:

   ```json
   {
     "compilerOptions": {
       "lib": [ "es2015" ]
     }
   }
   ```

3. From within the Atom preferences page, install the
   [atom-typescript](https://atom.io/packages/atom-typescript)
   package.

4. Start Atom over your script directory by running the following
   command from your `my_project` directory:

   ```sh
   atom .
   ```

## Reference

This section documents all methods that are currently available in
Triply Client.  Methods are grouped together for each object type to
which they apply.

### Code examples

Every function in this reference section comes with at least one code
example.  These code examples can be run by inserting them into the
following basic script structure:

```typescript
import Client from "@triply/client.js/build/src/App";
const client = Client.get({
  url: process.env.TRIPLY_API_TOKEN,
  token: process.env.TRIPLY_API_URL
});
async function run() {
  // This is where operations that use the Triply API are performed.
  // All code examples that are given in this document must be placed
  // in this location in order to be executed.
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});
```

The following subsections document the various Triply Client
functions.

### `Client`

#### `getAccount()`

Returns the account associated with the current Triply API Token.

##### Example

The following example code returns the account associated with the
current Triply API Token:

```typescript
console.log(await client.getAccount());
```

See section [[Account]] for an overview of the methods that can be used
with account objects.

#### `getAccount(accountName: string)`

Returns the account with the given `accountName`.

##### Example

The following example code returns a specific account called
`some-acount`:

```typescript
console.log(await client.getAccount("some-account"));
```

See section [[Account]] for an overview of the methods that can be used
with account objects.

### `Account`

The `Account` class represents a TriplyDB account.  This can be either
a user or an organization.

Accounts cannot be created or deleted through the Triply Client
library.  See the [[TriplyDB documentation]] for how to create and
delete accounts (users and organizations) through the web-based GUI.

#### `addDataset(settings: object)`

Argument `settings` is a JSON object with the following keys:

  - `accessLevel` :: The access level of the dataset.  The following
    values are supported:

    - `"private"` :: The dataset can only be accessed by the `Account`
      object for which it is created.

    - `"internal"` :: The dataset can only be accessed by people who
      are logged into the TriplyDB instance (denoted by the value of
      environment variable `TRIPLY_API_URL`).

    - `"public"` :: The dataset can be accessed by everybody.

  - `name` (optional) :: The name of the dataset.

  - `description` (optional) :: The description of the dataset.

  - `license` (optional) :: The license of the dataset.  The following
    license strings are currently supported:

    - `"CC-BY-SA"`
    - `"CC0 1.0"`
    - `"GFDL"`
    - `"ODC-By"`
    - `"ODC-ODbL"`
    - `"PDDL"`

##### Example

The following code example creates a new dataset (called
`"some-dataset"`) under a specific pre-existing account:

```typescript
console.log(await client.getAccount("some-account")
                        .addDataset({name: "some-dataset"}));
```

#### `datasets()`

Returns the list of datasets for this account that are accessible to
the user associated with the given Triply Token.

##### Example

The following example code prints the list of datasets that belong to
the specific account called `some-account`:

```typescript
console.log(await client.getAccount("some-account")
                        .datasets());
```

#### `getDataset(datasetName: string)`

Returns the dataset with the given `datasetName`.

This function returns an object of type `Dataset`.  See section
[[Dataset]] for an overview of the methods that can be used with dataset
objects.

##### Example

The following example code prints a specific dataset object:

```typescript
console.log(await client.getAccount("some-account")
                        .getDataset("some-dataset"));
```

#### `info()`

Returns information about the account.

##### Example

The following example code prints information about the account
associated with the current Triply API Token:

```typescript
console.log(await client.getAccount().info());
```

Example output for running the above code:

```json
{
  avatarUrl: "https://www.gravatar.com/avatar/9bc28997dd1074e405e1c66196d5e117?d=mm",
  accountName: "wouter",
  uid: "5aafcb9639b170025c5e4b99",
  name: "Wouter Beek",
  type: "user",
  createdAt: "Mon Mar 19 2018 14:39:18 GMT+0000 (Coordinated Universal Time)",
  siteAdmin: true,
  superAdmin: true,
  email: "wouter@triply.cc",
  updatedAt: "Tue Nov 27 2018 09:29:38 GMT+0000 (Coordinated Universal Time)",
  authMethod: "password",
  disabled: false,
  verified: true
}
```

#### `name()`

Returns the name of the account.

##### Example

The following example code prints the name of the account associated
with the current Triply API Token:

```typescript
console.log(await client.getAccount().name());
```

#### `rename(newName: string)`

Renames the account from its current name to the specified new name
(`newName`).

##### Example

The following example code renames a specific dataset from
`some-account` to `new-name`:

```typescript
console.log(await client.getAccount("some-account")
                        .rename("new-name"));
```

### `Dataset`

The `Dataset` class represents a TriplyDB dataset.

#### `addService(serviceType: oneof("sparql"), name: string)`

Creates a new service for this dataset.

The `serviceType` argument specifies the type of service that is
created.  The following values are supported:

  - `"sparql"` :: Starts a SPARQL service.

The `name` argument can be used to distinguish between different
endpoints over the same dataset that are used for different tasks.

See section [[Service]] for an overview of the methods that can be
used with service objects.

##### Example

The following example code starts two SPARQL endpoints over a specific
dataset.  One endpoint will be used in the acceptance environment
while the other endpoint will be used in the production system.

```typescript
const dataset = await client.getAccount("some-account")
                            .getDataset("some-dataset");
const acceptance = dataset.addService("sparql", "acceptance");
const production = dataset.addService("sparql", "production");
```

#### `assets()`

Returns an array with objects that represent the assets that belong to
this dataset.

##### Example

The following example code retrieves the assets for a specific
dataset:

```typescript
console.log(await client.getAccount("some-account")
                        .getDataset("some-dataset")
                        .assets());
```

#### `delete()`

Deletes the dataset.  This includes deleting the dataset metadata, all
of its graphs, and all of its assets.

Use the following functions in order to delete graphs while retaining
dataset metadata and assets:

  - [[`deleteGraph(graphName: string)`]]
  - [[`Dataset.removeAllGraphs/0`]]

##### Example 1

The following example code deletes a specific dataset that is part of
the account associated with the current Triply API Token:

```typescript
await client.getAccount()
            .getDataset("some-dataset")
            .delete();
```

##### Example 2

The following example code only deletes a specific dataset if it
exists (notice the use of `try` and `catch`):

```typescript
await client.getAccount()
            .getDataset("some-dataset")
            .delete();
```

#### `deleteGraph(graphName: string)`

Deletes a specific graph that belongs to this dataset.

##### Example

The following example code deletes a specific graph from a specific
dataset:

```typescript
await client.getAccount()
            .getDataset("some-dataset")
            .deleteGraph("https://example.org/some-graph");
```

#### `getServices()`

Returns an array of objects that represent TriplyDB services.

##### Example

The following example code emits the services that are enabled for a
specific dataset:

```typescript
console.log(await client.getAccount("some-account")
                        .getDataset("some-dataset")
                        .getServices());
```

#### `graphs()`

Returns an array with objects that represent the graphs that belong to
this dataset.

##### Example

The following example code retrieves the graphs for a specific
dataset:

```typescript
console.log(await client.getAccount("some-account")
                        .getDataset("some-dataset")
                        .graphs());
```

#### `import(fromDataset: Dataset, graphs: mapping)`

`mapping` is a JSON object whose keys are existing graph names in the
`fromDataset` and whose values are new graph names in the
current/target dataset.

##### Example

The following code example creates a new dataset “d2” and imports one
graph from the existing dataset “d1”.  Notice that the graph can be
renamed as part of the import.

```typescript
const dataset1 = await client.getAccount()
                             .getDataset("some-dataset");
const dataset2 = await client.getAccount()
                             .addDataset({accessLevel: "private",
                                          name: "other-dataset"});
await dataset1.import(dataset2,
                      {"https://example.org/dataset2/graph": "https://example.org/dataset1/graph"});
```

#### `importedGraphs()`

Returns an array with objects that represent the imported graphs that
belong to this dataset.

##### Example

The following example code retrieves the imported graphs for a
specific dataset:

```typescript
console.log(await client.getAccount("some-account")
                        .getDataset("some-dataset")
                        .importedGraphs());
```

#### `query()`

Retrieves the query object for this dataset.

See section [[Query]] for an overview of the methods that can be used
with query objects.

##### Example

The following code example retrieves the query object of a specific
dataset:

```typescript
const query = client.getAccount("some-account")
                    .getDataset("some-dataset")
                    .query();
```

#### `removeAllGraphs()`

Removes all graphs from this dataset.

##### Example

The following code example removed all graphs from a specific dataset:

```typescript
await client.getAccount("some-account")
            .getDataset("some-dataset")
            .removeAllGraphs();
```

#### `rename(newName: string)`

Renames the dataset from its current name to the name specified with
`newName`.

##### Example

The following example code renames a specific dataset from
`some-dataset` to `new-name`:

```typescript
await client.getAccount("some-account")
            .getDataset("some-dataset")
            .rename("new-name");
```

#### `renameGraph(fromGraphName: string, toGraphName: string)`

Renames a graph of this dataset.

`fromGraphName` and `toGraphName` must be valid IRIs.

##### Example

The following example code renames a specific graph of a specific
dataset:

```typescript
const dataset = client.getAccount()
                      .getDataset("some-dataset");
await dataset.renameGraph("https://example.org/old-graph",
                          "https://example.org/new-graph");
```

#### `upload(filePaths: string[])`

Adds the given file paths to the current upload job.

The files must contain RDF data and must be encoded in one of the
following standardized RDF serialization formats: N-Quads, N-Triples,
TriG, Turtle.

Use function [[`Dataset.uploadAsset/2`]] in order to upload files that do not
contain RDF data.

Once the required files have been added to the current upload job, the
upload job can be executed with method `getJob().exec()` (see the
following example).

##### Example

The following example code adds four RDF document to the current
upload job of a specific dataset, and then performs the upload
afterwards.

```typescript
const dataset = client.getAccount()
                      .getDataset("some-dataset");
await dataset.upload("file.nq",   // Uploading an N-Quads file,
                     "file.nt",   // and an N-Triples file,
                     "file.trig", // and a TriG file,
                     "file.ttl"); // and a Turtle file.
await dataset.getJob().exec();
```

#### `uploadAsset(assetName: string, filePath: string)`

Uploads a file that does not contain RDF data as an asset.

Assets can be source data files prior to running an ETL process,
documentation files describing the dataset, or media files
(audio/image/video) that are referenced by the RDF graph.

##### Example

The following example code uploads a PDF file documenting the
corresponding dataset:

```typescript
await client.getAccount()
            .getDataset("some-dataset")
            .uploadAsset("source.csv.gz",      // Upload source data,
                         "documentation.pdf"); // and documentation.
```

### `Query`

The query object allows Triple Pattern (TP) queries to be formulated
and executed.  The TP query paradigm is define in the SPARQL 1.1
specification: it allows triples to be matched by setting a
combination of a subject, predicate, and/or object term.  TriplyDB
also allows the graph term to set.

The following example code retrieves (at most) 100 subclass triples
from a specific dataset:

```typescript
await client.getAccount()
            .getDataset("some-dataset")
            .query()
            .predicate("http://www.w3.org/2000/01/rdf-schema#subClassOf")
            .limit(100);
```

### `Service`

Service objects describe specific functionalities that can be started,
stopped, and restarted over datasets in TriplyDB.

Service objects are obtained through the [[`Dataset.addService/2`]]
and [[`Dataset.getServices/0`]] functions.

#### `create()`

Starts this service.

##### Example

The following code example starts a specific service:

```typescript
await client.getAccount("some-account")
            .getDataset("some-dataset")
            .addService("sparql", "new-service")
            .create();
```

#### `getStatus()`

Returns the status of this service.

The following service statuses are defined:

  - removing
  - running
  - starting
  - stopped
  - stopping

##### Example

The following example code prints the status of a specific service:

```typescript
const service = await client.getAccount("some-account")
                            .getDataset("some-dataset")
                            .addService("sparql", "new-service");
console.log(service.getStatus());
```

#### `info()`

Returns information about this service.

##### Example

The following example code prints information about a newly created
service:

```typescript
const service = await client.getAccount("some-account")
                            .getDataset("some-dataset")
                            .addService("sparql", "new-service");
console.log(service.info());
```

#### `isUpToDate()`

Returns whether this service is synchronized with the dataset
contents.

Because services must be explicitly synchonized in TriplyDB, it is
possible to have services that expose an older version of the dataset
and services that expose a newer version of the dataset running next
to one another.  There are two very common use cases for this:

  - The production version of an application or website runs on an
    older service.  The data does not change, so the application keeps
    working.  The acceptance version of the same application or
    website runs on a newer service.  Once the acceptance version is
    finished, it becomes the production version and a new services for
    the new acceptance version is created, etc.

  - An old service is used by legacy software.  New users are using
    the newer endpoint over the current version of the data, but a
    limited number of older users wants to use the legacy version.

##### Example

The following example code checks whether a specific service is
synchonized:

```typescript
const service = await client.getAccount("some-account")
                            .getDataset("some-dataset")
                            .addService("sparql", "new-service");
console.log(service.isUpToDate());
```

#### `restart()`

Restarts this service.

##### Example

The following code example restarts a specific service:

```typescript
await client.getAccount("some-account")
            .getDataset("some-dataset")
            .addService("sparql", "new-service")
            .restart();
```

## FAQ

This section includes answers to frequently asked questions.  Please
contact [info@triply.cc](mailto:info@triply.cc) if you have a question
that does not appear in this list.

### How to perform a SPARQL query?

The SPARQL 1.1 Protocol standard specifies a native HTTP API for
perfoming SPARQL requests.  Such requests can be performed with
regular HTTP libraries.  Here we give an example using such an HTTP
library:

```typescript
import * as SuperAgent from "superagent";
const reply = await SuperAgent.post("URL-OF-SOME-SPARQL-ENDPOINT")
                              .set("Accept", "application/sparql-results+json")
                              .set("Authorization",
                                   "Bearer "+process.env.TRIPLY_API_TOKEN)
                              .buffer(true)
                              .send({"query": "select * { ?s ?p ?o } limit 1"});

```

### What to do when the following error appears?
#### Why must I set environment variable `TRIPLY_API_TOKEN`?

It is common for scripts to be shared with others and/or get published
online using services like Github and Gitlab.  Since the API token is
private, it must never be used in the TypeScript script file directly.

#### Error: Unauthorized

This error appears whenever an operation is performed for which the
user denoted by the current Triply API Token is not authorized.

One common appearance of this error is when the environment variable
`TRIPLY_API_TOKEN` is not set to a Triply API Token.

The current value of the environment variable can be tested by running
the following command:

```sh
echo $TRIPLY_API_TOKEN
```

#### "No domain specified in configuration"

This error indicates that the `TRIPLY_API_URL` environment variable
has not been set.  This variable must be set to a Triply API URL.

The current value of the environment variable can be tested by running
the following command:

```sh
echo $TRIPLY_API_URL
```
