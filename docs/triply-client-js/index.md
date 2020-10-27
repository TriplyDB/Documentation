---
title: "Triply Client"
path: "/docs/triply-client-js"
---

Triply Client is the programming library that makes it easy to interact with
TriplyDB instances.  Triply Client allows you to automate most operations that
can be performed through the TriplyDB GUI.  Triply Client is implemented in
TypeScript/JavaScript.

This document is a work in progress. Please contact
[support@triply.cc](mailto:support@triply.cc) for more information.

## Getting started

This section gets you up and running with the Triply Client by setting up a
simple script. The script will use Triply Client in order to interact with a
specific TriplyDB instance.

### Installation

The following steps are needed in order to install Triply Client:

1. Install [Node.js](https://nodejs.org) and
   [Yarn](https://yarnpkg.com).

   Example for installation on recent Ubuntu versions:

   ```sh
   sudo apt install nodejs yarn # Debian-based, e.g., Ubuntu.
   sudo dnf install nodejs yarn # Red Hat-based, e.g., Fedora.
   ```

2. Create an API token through the TriplyDB GUI. See [this video](https://youtu.be/ACfOY2a_VVM) for instructions on how to do it.

In short, to create an API token, go to user settings in TriplyDB, then click on
“API tokens”, where you'll be able to create a token.

3. In your current terminal session, export the following environment
   variables (ensure there aren't any spaces after =):

   ```sh
   export TRIPLY_API_TOKEN=<your-token>
   ```

   You can also add these lines to your `.profile` file in order to add these
   environment variables to every future terminal session.

### Setting up a Triply Client project

The following steps are needed in order to setup a TypeScript project that uses
the Triply Client library:

1. Create a directory for your project:

   ```sh
   mkdir my_project
   cd my_project
   ```

2. Inside your newly created directory, run the following command to
initialize the package configuration.  You will be asked several
questions to set up a professional project (e.g., software license).
(Add flag `-y` for a simplified setup, using default answers to these
questions.)

   ```sh
   yarn init
   ```

3. Add the TypeScript and Triply Client dependencies:

   ```sh
   yarn add typescript @triply/triplydb
   ```

4. Run the following command to initialize the project configuration:

   ```sh
   ./node_modules/.bin/tsc --init
   ```

### Create your first script

Once you have performed the installation and project setup, perform the
following steps in order to create and run your first script that uses the
Triply Client library:

1. Create a file called `index.ts` and add the following contents:

   ```typescript
   // Import the Triply Client.
   import Client from "@triply/triplydb";

   // Configure the Triply Client.
   const client = Client.get({
     token: process.env.TRIPLY_API_TOKEN,
   });

   // Perform Triply Client requests within an async context.
   async function run() {
     // Our first Triply Client request: obtain information of the
     // current user.
     console.log(await client.getAccount());
   }
   run().catch(e => {
     console.error(e);
     process.exit(1);
   });
   ```

2. Compile the TypeScript file into a corresponding JavaScript file by writing in the terminal:

   ```bash
   ./node_modules/.bin/tsc
   ```

3. Run the JavaScript file by writing in the terminal:

   ```sh
   node index.js
   ```

This should print the information of the current user to the terminal.
The current user is determined by the API token that was set in the
`TRIPLY_API_TOKEN` environment variable.

### Using the Atom text editor (recommended)

The Atom text editor provides advanced support for programming in TypeScript,
which makes it easier to use Triply Client by showing typing feedback in the
editor and offering autocomplete suggestions:

1. Install the [Atom](https://atom.io) text editor.

2. In order to let Atom use the correct TypeScript version, make the following
changes in the `tsconfig.json` file:

   ```json
   "target": "es2020",
   "lib": ["es2020"],
   ```

3. From within the Atom preferences page, install the
[`atom-typescript`](https://atom.io/packages/atom-typescript) package.

If you wish to run your scripts within Atom, you may install the package Script.

4. Start Atom over your script directory by running the following command from
your `my_project` directory:

   ```sh
   atom .
   ```

## Reference

This section documents all methods that are currently available in Triply
Client. Methods are grouped together for each object type to which they apply.

### Code examples

Every function in this reference section comes with at least one code
example. These code examples can be run by inserting them into the
following basic script structure:

```typescript
import Client from "@triply/triplydb";
const client = Client.get({
  token: process.env.TRIPLY_API_TOKEN
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

### Client

Instances of `Client` are specific client connections with a TriplyDB user. They are declared via:

```typescript
import Client from "@triply/triplydb";
const client = Client.get({
  token: process.env.TRIPLY_API_TOKEN
});
```

#### Client.getApiInfo()

Returns information about the TriplyDB instance that is associated with the
current API token.

The following example returns an object describing the used TriplyDB instance:

```typescript
console.log(await client.getApiInfo());
```

#### Client.getAccount(accountName: string)

Returns details about the account with the given `accountName`.

The following example refers to an account called `acme`:

```typescript
console.log(await client.getAccount("acme"));
```

See section [`Account`](#account) for an overview of the methods that
can be used with account objects.

#### Client.getDataset(accountName: string, datasetName: string)

Returns the dataset with name `datasetName` that is published by the account
with name `accountName`.

The following example returns the dataset called `cats` published by the user
called `john-doe`:

```typescript
console.log(client.getDataset("john-doe", "cats"));
```

This function is a shorthand for a combination of the [`Client.getAccount(name:
string)`](#clientgetaccountname-string) and the [`Account.getDataset(name:
string)`](#accountgetdatasetname-string) call.  Therefore, the following example
returns the same result as the above one:

```typescript
console.log(client.getUser("john-doe").getDataset("cats"));
```

#### Client.getOrganization(name: string)

Returns the organization with the given `name`.

The following example returns the organization called `acme`:

```typescript
console.log(await client.getOrganization("acme"));
```

See section [`Organization`](#organization) for an overview of the
methods that can be used with organization objects.

#### Client.getUser()

Returns the user associated with the current API token.

The following example code returns the user associated with the
current API token:

```typescript
console.log(await client.getUser());
```

See section [`User`](#user) for an overview of the methods that can be
used with user objects.

#### Client.getUser(userName: string)

Returns the user with the given `userName`.

The following example returns the user with name `john-doe`:

```typescript
console.log(await client.getAccount("john-doe"));
```

See section [`User`](#user) for an overview of the methods that can be used with
user objects.

### Account

The `Account` class denotes a TriplyDB account.  Accounts can be either organizations ([`Organization`](#organization)) or users ([`User`](#user)). 

The `Account` class refers to: 
```typescript
client.getAccount()
```

#### Account.asOrg()

If the account is an organization, returns information about the account. Otherwise,results in the error: "This is a user. Cannot fetch this as an organization."

Best used as the following:
```typescript
  console.log(
  (await client.getAccount()).asOrg());
```

#### Account.asUser()

If the account is a user, returns information about the account. Otherwise,results in the error: "This is an organization. Cannot fetch this as a user."

Best used as the following:
```typescript
  console.log(
  (await client.getAccount()).asUser());
```

#### Account.exists()

If the account exists, returns true. Otherwise, returns false.

Best used as the following:
```typescript
  console.log(
  await (await client.getAccount()).exists());
```

#### Account.getInfo()

Returns an overview of the account in the form of a JSON object.

The following example code prints an overview of account that is
associated with the used API token:

```typescript
console.log(
await (await client.getAccount()).getInfo());
```

Example output for running the above code:

```json
{
  "avatarUrl": "https://www.gravatar.com/avatar/9bc28997dd1074e405e1c66196d5e117?d=mm",
  "accountName": "wouter",
  "uid": "5aafcb9639b170025c5e4b99",
  "name": "Wouter Beek",
  "type": "user",
  "createdAt": "Mon Mar 19 2018 14:39:18 GMT+0000 (Coordinated Universal Time)",
  "siteAdmin": true,
  "superAdmin": true,
  "email": "wouter@triply.cc",
  "updatedAt": "Tue Nov 27 2018 09:29:38 GMT+0000 (Coordinated Universal Time)",
  "authMethod": "password",
  "disabled": false,
  "verified": true
}
```

#### Account.getName()

Returns the name of the account.

The following example code prints the name of the account associated
with the current API token:

```typescript
console.log(
    await (await client.getAccount()).getName());
```

### Organization

The `Organization` class denotes a TriplyDB organization.

An 'Organization' class is obtained via:
```typescript
console.log(await client.getOrganization("organization's name in triplyDB"));
```

#### Organization.addDataset(metadata: object)

Adds a new dataset to the `Organization`.

This only works if the used API token gives write access to the
`Organization`.

Argument `metadata` is a JSON object that specifies the dataset metadata.  It
has the following keys:

<dl>
  <dt><code>accessLevel</code> (required)</dt>
  <dd>
    <p>The access level of the dataset. The following values are supported:</p>
    <dl>
      <dt><code>"private"</code></dt>
      <dd>The dataset can only be accessed by organization members.</dd>
      <dt><code>"internal"</code></dt>
      <dd>The dataset can only be accessed by users that are logged into the TriplyDB instance.
      <dt><code>"public"</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
    <p>When no access level is specified, the most conservative access level (<code>private</code>) is used.</p>
  </dd>
  <dt><code>description</code> (optional)</dt>
  <dd>The description of the dataset.  This description can make use of Markdown (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>displayName</code> (optional)</dt>
  <dd>The human-readable name of the dataset.  This name may contain spaces and other non-alphanumeric characters.</dd>
  <dt><code>license</code> (optional)</dt>
  <dd>
    <p>The license of the dataset.  The following license strings are currently supported:</p>
    <ul>
      <li><code>"CC-BY-SA"</code></li>
      <li><code>"CC0 1.0"</code></li>
      <li><code>"GFDL"</code></li>
      <li><code>"ODC-By"</code></li>
      <li><code>"ODC-ODbL"</code></li>
      <li><code>"PDDL"</code></li>
    </ul>
    <p>If no license is provided, the license is given value <code>"None"</code>.</p>
  </dd>
  <dt><code>name</code> (required)</dt>
  <dd>The internal name of the dataset.  This name can only contain alphanumeric characters and hyphens.</dd>
</dl>

The following code example creates a new dataset (called `dogs`) under the
`acme` organization, with private access, a description, a display name, and a license:

```typescript
const organization = client.getOrganization("acme");
console.log((await organization).addDataset({accessLevel: "private", description:"puppies", displayName:"Doggos", license:"PDDL", name:"dogs"}));
```

#### Organization.exists()

Returns whether the organization still exists.

The following example code prints `true` in case the account (still) exists, and
prints `false` otherwise:

```typescript
const organization = await client.getOrganization("acme");
console.log(await (organization).exists());
```

#### Organization.getDataset(name: string)

Returns the dataset with the given `name` that is published by the given
`Organization`.

This function returns an object of type [`Dataset`](#dataset).  See that section
for an overview of the methods that can be called on dataset objects.

The following example prints a specific dataset object:

```typescript
const organization = client.getOrganization("acme");
console.log((await organization).getDataset("dogs"));
```

#### Organization.getDatasets()

Returns the list of datasets for the `Organization`.  This only
includes datasets that are accessible under the used API token.

The following example prints the list of datasets that belong to the
organization named `acme`:

```typescript
  const organization = await client.getOrganization("acme");
console.log(await organization.getDatasets());
```

#### Organization.getPinnedDatasets()

Returns the list of datasets that are pinned for the given `Organization`.  The
order reflects the order in which the datasets appear on the organization
page in the Triply GUI.

The following example prints the list of pinned datasets for the organization
named `acme`:

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.getPinnedDatasets());
```

#### Organization.addMembers()

Adds members for the given `Organization`, with role of either member or owner.

The following example adds user of name "Bugs" to the organization "acme", wi

```typescript
const organization = await client.getOrganization("acme");
console.log(organization.addMembers({user:"bugs", role:"member"}));
```

#### Organization.delete()

Deletes the organization.

```typescript
const organization = await client.getOrganization("acme");
console.log(organization.delete());
```


### User

The [`User`](#user) class represents a TriplyDB user. It is accessed via:

```typescript
client.getUser("user name");
```

Users cannot be created or deleted through the Triply Client library.  See the
[Triply Console documentation](/docs/triply-db-getting-started) for how to
create and delete users through the web-based GUI.

#### User.addDataset(metadata: object)

Adds a new dataset for the given `User`.

This only works if the used API token gives write access to the user
account.

Argument `metadata` is a JSON object that specifies the dataset metadata.  It
has the following keys:

<dl>
  <dt><code>accessLevel</code> (optional)</dt>
  <dd>
    <p>The access level of the dataset. The following values are supported:</p>
    <dl>
      <dt><code>"private"</code></dt>
      <dd>The dataset can only be accessed by the <a href="#user"><code>User</code></a> for whom this dataset is created.</dd>
      <dt><code>"internal"</code></dt>
      <dd>The dataset can only be accessed by users that are logged into the TriplyDB instance.
      <dt><code>"public"</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
    <p>When no access level is specified, the most conservative access level (<code>private</code>) is used.</p>
  </dd>
  <dt><code>description</code> (optional)</dt>
  <dd>The description of the dataset.  This description can make use of Markdown layout (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>displayName</code> (optional)</dt>
  <dd>The human-readable name of the dataset.  This name may contain spaces and other non-alphanumeric characters.</dd>
  <dt><code>license</code> (optional)</dt>
  <dd>
    <p>The license of the dataset. The following license strings are currently supported:</p>
    <ul>
      <li><code>"CC-BY-SA"</code></li>
      <li><code>"CC0 1.0"</code></li>
      <li><code>"GFDL"</code></li>
      <li><code>"ODC-By"</code></li>
      <li><code>"ODC-ODbL"</code></li>
      <li><code>"PDDL"</code></li>
    </ul>
    <p>If no license is provided, the license is given value <code>"None"</code>.</p>
  </dd>
  <dt><code>name</code> (required)</dt>
  <dd>The internal name of the dataset.  This name can only contain alphanumeric characters and hyphens.</dd>
</dl>

The following code example creates a new dataset (called `cats`) for the user
with name `john-doe`, with private access, a description, display name, and a license:

```typescript
const user = await client.getUser("john-doe");
  console.log(await(user.addDataset({accessLevel: "private", description:"cats > dogs", displayName: "Cats", license:"PDDL", name: "cats"})));

```

#### User.createOrganization(metadata: object)

Creates a new organization for which `User` will be the owner.

This only works if the used API token includes write access for the
`User`.

Argument `metadata` is a JSON object that specifies the organization metadata.
It has the following keys:

<dl>
  <dt><code>accountName</code> (required)</dt>
  <dd>The internal name of the organization.  This name can only contain alphanumeric characters and hyphens.</dd>
  <dt><code>description</code> (optional)</dt>
  <dd>The description of the organization.  This description can make use of Markdown layout (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>email</code></dt>
  <dd>The email address at which the organization can be reached.</dd>
  <dt><code>name</code> (optional)</dt>
  <dd>The human-readable name of the organization.  This name may contain spaces and other non-alphanumeric characters.</dd>
</dl>

The following example creates an organization with name `acme` for which the
user with name `john-doe` will be the owner.  Notice that in addition to the required internal name (`"accountName": "acme"`), an optional display name (`"name": "Acme Corporation"`) is specified as well.

```typescript
const user = await client.getUser("john-doe");
console.log(user.createOrganization({"accountName": "acme",
                                    "name": "Acme Corporation"}));
```

#### User.exists()

Returns whether the `User` still exists.

While it is not possible to delete users with Triply Client, they can be deleted
― possibly by somebody else ― through the Triply Console.

The following example code prints `true` in case the account (still) exists, and
prints `false` otherwise:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.exists());
```

#### User.getDataset(name: string)

Returns the dataset with the given `name` that is published by the given `User`.

This function returns an object of type [`Dataset`](#dataset).  See that section
for an overview of the methods that can be called on those dataset objects.

The following example prints a specific dataset object:

```typescript
const user = await client.getUser("john-doe");
console.log(user.getDataset("cats"));
```

#### User.getDatasets()

Returns the list of datasets for this `User`.  This only includes
datasets that are accessible under the API token.

The following example prints the list of datasets that belong to the user named
`john-doe`:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.getDatasets());
```

#### User.getOrganizations()

Returns the list of organizations for which the `User` is a member.

The order in the list reflects the order in which the organizations appear on
the user page in the Triply GUI.

The following example prints the list of organization for the user named
`john-doe` is a member:

```typescript
const user = await client.getuser("john-doe");
console.log(await user.getOrganizations());
```

#### User.getPinnedDatasets()

Returns the list of datasets that are pinned for the given `User`.

The order in the list reflects the order in which the datasets appear on the
user page in the Triply GUI.

The following example prints the list of pinned datasets for the user named
`john-doe`:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.getPinnedDatasets());
```

### Dataset

The [`Dataset`](#dataset) class represents a TriplyDB dataset.

#### Dataset.addService(type: string, name: string)

Creates a new service for this dataset.

The service type is specified with the `type` parameter, which
supports the following values:

  - `"sparql"` :: Starts a SPARQL service.

The `name` argument can be used to distinguish between different
endpoints over the same dataset that are used for different tasks.

See section [`Service`](#service) for an overview of the methods that
can be used with service objects.

The following example code starts two SPARQL endpoints over a specific
dataset. One endpoint will be used in the acceptance environment
while the other endpoint will be used in the production system.

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset name");
const acceptance = dataset.addService("sparql", "acceptance");
const production = dataset.addService("sparql", "production");
```

#### Dataset.getAssets()

Returns an array with objects that represent the assets that belong to
this dataset.

The following example code retrieves the assets for a specific
dataset:

```typescript
  console.log(await (await client
      .getAccount())
      .getDataset("dataset name")
      .getAssets());
```

#### Dataset.getPrefixes()

Returns the prefixes that are defined for the dataset.

Example:

```typescript
  console.log(await (await client
      .getAccount())
      .getDataset("dataset name")
      .getPrefixes());
```

#### Dataset.copy(account: string, dataset: string)

Creates a copy of the current dataset.  The owner (user or
organization) of the copy is specified with parameter `account`.  The
name of the copy is specified with parameter `dataset`.

```typescript
  console.log(await (await client
      .getAccount())
      .getDataset("original dataset name")
      .copy("account name","copy dataset name"));
```

This operation does not overwrite existing datasets: if the copied-to
dataset already exists, a new dataset with suffix `-1` will be
created.

#### Dataset.delete()

Deletes the dataset. This includes deleting the dataset metadata, all
of its graphs, and all of its assets.

Use the following functions in order to delete graphs while retaining
dataset metadata and assets:

- [Dataset.deleteGraph(graphName: string)](#datasetdeletegraphname-string)
- [Dataset.removeAllGraphs()](#datasetremoveallgraphs)

The following example code deletes a specific dataset that is part of
the account associated with the current API token:

```typescript
  (await client
    .getAccount())
    .getDataset("some-dataset")
    .delete();
```

#### Dataset.deleteGraph(name: string)

Deletes a specific graph that belongs to this dataset.

The following example code deletes a specific graph from a specific
dataset:

```typescript
 (await client
  .getAccount())
  .getDataset("some-dataset")
  .deleteGraph("https://example.org/some-graph");
```

#### Dataset.exists()

Returns whether the dataset still exists.

Datasets can still be considered to exist when the [Dataset.delete()](#datasetdelete)
function is called, when the
[Dataset.rename(string)](#datasetrenamename-string) function is
called, or when somebody deletes the dataset from the [Triply
Console](/docs/triply-db-getting-started).

The following example code prints `true` in case the dataset still
exists, and prints `false` otherwise:

```typescript
console.log(
await (await client
    .getAccount())
    .getDataset("some-dataset")
    .exists());
```

#### Dataset.getServices()

Returns an array of objects that represent TriplyDB services.

The following example code emits the services that are enabled for a
specific dataset:

```typescript
console.log(
await (await client
    .getAccount())
    .getDataset("some-dataset")
    .getServices());
```

#### Dataset.getGraphs()

Returns an array with objects that represent the graphs that belong to
this dataset.

The following example code retrieves the graphs for a specific
dataset:

```typescript
console.log(
await (await client
    .getAccount())
    .getDataset("some-dataset")
    .getGraphs());
```

#### Dataset.importFromDataset(from: Dataset, graphs: mapping)

`graphs:mapping` is a JSON object taking existing graph names (graphs) in the
`from` dataset, and mapping them into a new named graph in the Dateset into which they are imported.

The following code example creates a new dataset “d2” and imports one
graph from the existing dataset “d1”. Notice that the graph can be
renamed as part of the import.

```typescript
  const dataset1 = (await client
    .getAccount())
    .getDataset("some-dataset");
  const dataset2 = await (await client
    .getAccount())
    .addDataset({accessLevel: "private",
                 name: "other-dataset"});
  await dataset1
    .importFromDataset(dataset2,
            {"https://example.org/dataset2/graph":
             "https://example.org/dataset1/graph"});
```
Note that you can also import from URLs with:

```typescript
dataset1.importFromUrls(urls:"url")
```
and you can also import from files with:
(The files must contain RDF data and must be encoded in one of the
following standardized RDF serialization formats: N-Quads, N-Triples,
TriG, Turtle.)

```typescript
dataset1.FromFiles(files:"direction to file")
```

#### Dataset.info()

Returns an overview of the dataset in the form of a JSON object.

Example:

```typescript
  console.log(
    await (await client
      .getAccount())
      .getDataset("dataset")
      .getInfo());
```

#### Dataset.query()

Retrieves the query object for this dataset.

See section [Query](#query) for an overview of the methods that can be
used with query objects.

The following code example retrieves the query object of a specific
dataset:

```typescript
  const query = (await client
    .getAccount("some-account"))
    .getDataset("some-dataset")
    .query();
```

#### Dataset.removeAllGraphs()

Removes all graphs from this dataset.

The following code example removed all graphs from a specific dataset:

```typescript
  await (await client
    .getAccount("some-account"))
    .getDataset("some-dataset")
    .removeAllGraphs();
```

#### Dataset.renameGraph(from: string, to: string)

Renames a graph of this dataset, where `from` is the current graph
name and `to` is the new graph name.  The string arguments for `from`
and `to` must be valid IRIs.

The following example code renames a specific graph of a specific
dataset:

```typescript
  const dataset = (await client
    .getAccount())
    .getDataset("some-dataset");
  await dataset.renameGraph(
    "https://example.org/old-graph",
    "https://example.org/new-graph"
  );
```

#### Dataset.update(metadata: object)

Updates the `metadata` for a specific dataset.

The following keys are supported:

<dl>
  <dt><code>accessLevel</code> (required)</dt>
  <dd>
    The access level of the dataset. The following values are supported:
    <dl>
      <dt><code>"private"</code></dt>
      <dd>The dataset can only be accessed by the <a href="#account"><code>Account</code></a> object for which it is created.</dd>
      <dt><code>"internal"</code></dt>
      <dd>The dataset can only be accessed by people who are logged into the TriplyDB instance (denoted by the value of environment variable <code>TRIPLY_API_URL</code>).
      <dt><code>"public"</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
  </dd>
  <dt><code>description</code> (optional)</dt>
  <dd>The description of the dataset.  This description can make use of Markdown layout (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>displayName</code> (optional)</dt>
  <dd>The human-readable name of the dataset.  This name may contain spaces and other non-alphanumeric characters.</dd>
  <dd></dd>
  <dt><code>license</code> (optional)</dt>
  <dd>
    The license of the dataset. The following license strings are currently supported:
    <ul>
      <li><code>"CC-BY-SA"</code></li>
      <li><code>"CC0 1.0"</code></li>
      <li><code>"GFDL"</code></li>
      <li><code>"ODC-By"</code></li>
      <li><code>"ODC-ODbL"</code></li>
      <li><code>"PDDL"</code></li>
    </ul>
  </dd>
  <dt><code>name</code> (required)</dt>
  <dd>The internal name of the dataset.  This name is restricted to alphanumeric characters and hyphens.</dd>
  <dd></dd>
</dl>

Example: updating the dataset's access level, description, display name, license, and name.

```typescript
  const dataset = (await client
    .getAccount())
    .getDataset("original dataset name");
dataset.update({accessLevel:"private",description:"desc", displayName:"disp", license:"PDDL", name:"updated name"})

```

#### Dataset.uploadAsset(assetName: string, filePath: string)

Uploads a file that does not contain RDF data as an asset.

Assets can be source data files prior to running an ETL process,
documentation files describing the dataset, or media files
(audio/image/video) that are referenced by the RDF graph.

The following example code uploads a PDF file documenting the
corresponding dataset:

```typescript
  (await client
    .getAccount())
    .getDataset("some-dataset")
    .uploadAsset(
      "source.csv.gz", // Upload source data,
      "documentation.pdf" // and documentation.
    );
```

### Query

The query object allows Quad Queries to be performed.  Quad Queries
allow statements to be matched by setting a combination of a subject,
predicate, object, and/or graph term.

Quad Queries are an extension of the Triple Pattern queries that are
defined in the [SPARQL 1.1
Query](https://www.w3.org/TR/sparql11-query/#QSynTriples)
specification.

The following example code retrieves (at most) 100 triples that have
term `rdfs:subClassOf` in the predicate position:

```typescript
  (await client
    .getAccount())
    .getDataset("some-dataset")
    .query()
    .subject("sub")
    .predicate("http://www.w3.org/2000/01/rdf-schema#subClassOf")
    .object("obj")
    .limit(100) // Sets the maximum number of results obtained
    .exec(); // executes the query
```


#### Query.object(name: string)

Sets the object term for this query.  If the object term is set, then
only triples with that object term are returned by the query.

#### Query.predicate(iri: string)

Sets the predicate term for this query.  If the predicate term is set,
then only triples with that predicate term are returned by the query.

#### Query.subject(iri: string)

Sets the subject term for this query.  If the subject term is set,
then only triples with that subject term are returned by the query.

#### Query.count()

Returns the number of results for the current query. Example:
```typescript
  (await client
    .getAccount())
    .getDataset("some-dataset")
    .query()
    .count();
```

#### Query.graph(graph iri: string)

Sets the graph term for this query.  If the graph term is set, then
only triples in that graph are returned by the query. Example:

```typescript
  (await client
    .getAccount())
    .getDataset("some-dataset")
    .query()
    .graph("graph iri")
    .exec();
```

### Service

Service objects describe specific functionalities that can be started,
stopped, and restarted over datasets in TriplyDB.

Service objects are obtained through the
[`Dataset.addService`](datasetaddserviceservicetype-string-name-string)
and [`Dataset.getServices`](#datasetgetservices) functions.

The following code example starts a specific service:

```typescript
  (await (await client
    .getAccount("some-account"))
    .getDataset("some-dataset")
    .addService("sparql", "new-service"));
```

The following service statuses are defined:

- removing
- running
- starting
- stopped
- stopping

#### Service.getInfo()

Returns an overview of the service in the form of a JSON object.

The following example code prints information about the newly created
service (named `new-service`):

```typescript
  const service = await (await client
    .getAccount("some-account"))
    .getDataset("some-dataset")
    .addService("sparql", "new-service");
  console.log(service.getInfo());
```

Another way to get information about existing services:
```typescript
  console.log(await (await client
    .getAccount())
    .getDataset("dataset")
    .getServices()
  );
```


#### Service.isUpToDate()

Returns whether this service is synchronized with the dataset
contents.

Because services must be explicitly synchonized in TriplyDB, it is
possible to have services that expose an older version of the dataset
and services that expose a newer version of the dataset running next
to one another. There are two very common use cases for this:

- The production version of an application or website runs on an
  older service. The data does not change, so the application keeps
  working. The acceptance version of the same application or
  website runs on a newer service. Once the acceptance version is
  finished, it becomes the production version and a new services for
  the new acceptance version is created, etc.

- An old service is used by legacy software. New users are using
  the newer endpoint over the current version of the data, but a
  limited number of older users wants to use the legacy version.

The following example code checks whether a specific service is
synchonized:

```typescript
  const service = await (await client
    .getAccount("some-account"))
    .getDataset("some-dataset")
    .addService("sparql", "new-service");
  console.log(service.isUpToDate());
```

## FAQ

This section includes answers to frequently asked questions. Please
contact [info@triply.cc](mailto:info@triply.cc) if you have a question
that does not appear in this list.

### How to perform a SPARQL query?

The SPARQL 1.1 Protocol standard specifies a native HTTP API for
perfoming SPARQL requests. Such requests can be performed with
regular HTTP libraries. Here we give an example using such an HTTP
library:

```typescript
import * as SuperAgent from "superagent";
const reply = await SuperAgent.post("URL-OF-SOME-SPARQL-ENDPOINT")
  .set("Accept", "application/sparql-results+json")
  .set("Authorization", "Bearer " + process.env.TRIPLY_API_TOKEN)
  .buffer(true)
  .send({query: "select * { ?s ?p ?o } limit 1"});
```

### What to do when the following error appears?

#### Error: Unauthorized

This error appears whenever an operation is performed for which the
user denoted by the current API token is not authorized.

One common appearance of this error is when the environment variable
`TRIPLY_API_TOKEN` is not set to an API token.

The current value of the environment variable can be tested by running
the following command:

```sh
echo $TRIPLY_API_TOKEN
```
