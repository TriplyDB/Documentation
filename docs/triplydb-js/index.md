---
title: "TriplyDB-js"
path: "/docs/triplydb-js"
---

TriplyDB-js is the programming library that makes it easy to interact with
TriplyDB instances.  TriplyDB-js allows you to automate most operations that
can be performed through the TriplyDB GUI.  TriplyDB-js is implemented in
TypeScript/JavaScript.

This document is a work in progress. Please contact
[support@triply.cc](mailto:support@triply.cc) for more information.

## Getting started

This section gets you up and running with the TriplyDB-js by setting up a
simple script. The script will use TriplyDB-js in order to interact with a
specific TriplyDB instance.

### Installation

The following steps are needed in order to install TriplyDB-js:

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
   variables (ensure there aren't any spaces around the `=`):

   ```sh
   export TRIPLY_API_TOKEN=<your-token>
   ```

   You can also add this line to your `.profile` file, to add the
   environment variables to every future terminal session.

### Setting up a TriplyDB-js project

The following steps are needed in order to set-up a TypeScript project that uses
the TriplyDB-js library:

1. Create a directory for your project:

   ```sh
   mkdir my_project
   cd my_project
   ```

2. Inside your newly created directory, run the following command to
initialize the package configuration.  You will be asked several
questions to set up a professional [yarn project](https://classic.yarnpkg.com/en/docs/creating-a-project/) (e.g., software license).
(Add flag `-y` for a simplified setup, using default answers to these
questions.) 

   ```sh
   yarn init
   ```

3. Add the TypeScript and TriplyDB-js dependencies:

   ```sh
   yarn add typescript @triply/triplydb
   ```

4. The following command will initialize the project configuration and create a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file:

   ```sh
   ./node_modules/.bin/tsc --init
   ```

### Create your first script

Once you have performed the installation and project setup, perform the
following steps in order to create and run your first script that uses the
TriplyDB-js library:

1. Create a file called `index.ts` using for example the following command: 

```
cat > index.ts
```

2. Add the following contents to `index.ts`:

   ```typescript
   // Import the TriplyDB-js.
   import Client from "@triply/triplydb";

   // Configure the TriplyDB-js.
   const client = Client.get({
     token: process.env.TRIPLY_API_TOKEN,
   });

   // Perform TriplyDB-js requests within an async context.
   async function run() {
     // Our first TriplyDB-js request: obtain information of the
     // current user.
     console.log(await client.getAccount());
   }
   run().catch(e => {
     console.error(e);
     process.exit(1);
   });
   ```

3. Compile the TypeScript file into a corresponding JavaScript file by writing in the terminal:

   ```bash
   ./node_modules/.bin/tsc
   ```

4. Run the JavaScript file by writing in the terminal:

   ```sh
   node index.js
   ```

This should print the information of the current user to the terminal.
The current user is determined by the API token that was set in the
`TRIPLY_API_TOKEN` environment variable.

### Using the Atom text editor (recommended)

The Atom text editor provides advanced support for programming in TypeScript,
which makes it easier to use TriplyDB-js by showing typing feedback in the
editor and offering autocomplete suggestions:

1. Install the [Atom](https://atom.io) text editor.

2. In order to let Atom use the correct TypeScript version, make the following
changes in the `tsconfig.json` file:

   ```json
   "target": "es2020",
   "lib": ["es2020"],
   ```

3. From within the Atom preferences page, install the
[`atom-typescript`](https://atom.io/packages/atom-typescript) package. You can use ```Crtl + ,``` to go to your settings, and then navigate to “Install”. 

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
following basic script structure that can be put in typescript files in your project:

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

The following subsections document the various TriplyDB-js
functions.

### Client

Instances of `Client` are specific client connections with a TriplyDB user. They are declared via:

```typescript
import Client from "@triply/triplydb";
const client = Client.get({
  token: process.env.TRIPLY_API_TOKEN
});
```

#### Client.getInfo()

Returns information about the TriplyDB instance that is associated with the
current API token.

The following example returns an object describing the used TriplyDB instance:

```typescript
console.log(await client.getInfo());
```

#### Client.getAccount(accountName: string)

Returns details about the account with the given `accountName`.

The following example refers to an account called `acme`:

```typescript
console.log(await client.getAccount("acme"));
```

See section [`Account`](#account) for an overview of the methods that
can be used with account objects.

#### Client.getAccounts()

Returns details about all the accounts on the TriplyDB instance.

The following example returns all accounts:

```typescript
console.log(await client.getAccounts());
```

See section [`Account`](#account) for an overview of the methods that
can be used with account objects.

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
client.getAccount();
```

#### Account.asOrganization()

Ensures that the account is an organization. If it's not, the following error is raised: "This is a user. Cannot fetch this as an organization."

Best used as the following:
```typescript
console.log((await client.getAccount("acme")).asOrganization());
```

#### Account.asUser()

Ensures that the account is a user. If it's not, the following error is raised: "This is an organization. Cannot fetch this as a user."

Best used as the following:
```typescript
console.log((await client.getAccount()).asUser());
```

#### Account.getInfo()

Returns an overview of the account in the form of a JSON object.

The following example code prints an overview of the account that is
associated with the used API token:

```typescript
console.log(await (await client.getAccount()).getInfo());
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

### Organization

The `Organization` class denotes a TriplyDB organization.

An `Organization` class is obtained via:
```typescript
console.log(await client.getOrganization("organization's name in triplyDB"));
```

#### Organization.addDataset(name: string, metadata: object)

Adds a new dataset to the `Organization`.

This only works if the used API token gives write access to the `Organization`.

Argument _`name`_ is the internal name of the dataset.  This name can only contain alphanumeric characters and hyphens.

Argument `metadata` is an optional JSON object that specifies the dataset metadata.  It
has the following keys, all of which are optional:

<dl>
  <dt><code>accessLevel</code></dt>
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
  <dt><code>description</code></dt>
  <dd>The description of the dataset.  This description can make use of Markdown (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>displayName</code></dt>
  <dd>The human-readable name of the dataset.  This name may contain spaces and other non-alphanumeric characters.</dd>
  <dt><code>license</code></dt>
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
  <dt><code>prefixes</code></dt>
  <dd>IRI prefixes to be applied to the dataset. This is an object with the prefixes as keys, and the IRI's as values.</dd>
</dl>

The following code example creates a new dataset (called `dogs`) under the
`acme` organization, with private access, a description, a display name, a license and one prefix:

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.addDataset("dogs", { description: "puppies", displayName: "Doggos", license: "PDDL", prefixes: { dc: "http://purl.org/dc/elements/1.1/" } }));
```

#### Organization.getDataset(name: string)

Returns the dataset with the given `name` that is published by the given
`Organization`.

This function returns an object of type [`Dataset`](#dataset).  See that section
for an overview of the methods that can be called on dataset objects.

The following example prints a specific dataset object:

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.getDataset("dogs"));
```

#### Organization.getDatasets()

Returns the list of datasets for the `Organization`.  This only
includes datasets that are accessible under the used API token.

The following example prints the list of datasets that belong to the
organization named `acme`:

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.getDatasets().toArray());
```
or alternatively iterate directly over the results

```typescript
const organization = await client.getOrganization("acme");
for await (const dataset of organization.getDatasets()) {
  console.log(dataset)
}
```
#### Organization.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the given `Organization`.  The
order reflects the order in which they appear on the organization page in the Triply GUI.

The following example prints the list of pinned items for the organization
named `acme`:

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.getPinnedItems());
```

#### Organization.addMember(user: User | string, role: Role)

Adds a member to the given `Organization`, with role of either member or owner.

The `user` argument can be a user object, or the account name of the user which should be 
added to the organization.

The `role` argument can be either `"member"` or `"owner"`. `"member"` will be chosen by default, if
no argument is given.

The following example adds user with name "Bugs" to the organization "acme", as a member.

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.addMember("Bugs"));
```

#### Organization.removeMember(user: User | string)

Removes a member from the given `Organization`, if they are a part of it.

The `user` argument can be a user object, or the account name of the user which should be 
remove from the organization.

If the user isn't a part of the organization, an error is thrown.

The following example removes the user with name "Bugs" from the organization "acme".

```typescript
const organization = await client.getOrganization("acme");
await organization.removeMember("Bugs");
```

#### Organization.delete()

Deletes the organization.

```typescript
const organization = await client.getOrganization("acme");
console.log(await organization.delete());
```


### User

The [`User`](#user) class represents a TriplyDB user. It is accessed via:

```typescript
console.log(await client.getUser("user name"));
```

Users cannot be created or deleted through the TriplyDB-js library.  See the
[Triply Console documentation](/docs/triply-db-getting-started) for how to
create and delete users through the web-based GUI.

#### User.addDataset(name: string, metadata: object)

Adds a new dataset for the given `User`.

This only works if the used API token gives write access to the user
account.

Argument _`name`_ is the internal name of the dataset. This name can only contain alphanumeric characters and hyphens.

Argument _`metadata`_ is an optional JSON object that specifies the dataset's metadata. It
has the following keys, all of which are optional:

<dl>
  <dt><code>accessLevel</code></dt>
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
  <dt><code>description</code></dt>
  <dd>The description of the dataset.  This description can make use of Markdown layout (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>displayName</code></dt>
  <dd>The human-readable name of the dataset.  This name may contain spaces and other non-alphanumeric characters.</dd>
  <dt><code>license</code></dt>
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
  <dt><code>prefixes</code></dt>
  <dd>IRI prefixes to be applied to the dataset. This is an object with the prefixes as keys, and the IRI's as values.</dd>
</dl>

The following code example creates a new dataset (called `cats`) for the user
with name `john-doe`, with private access, a description, display name, a license and one prefix:

```typescript
const user = await client.getUser("john-doe");
console.log(await(user.addDataset({ accessLevel: "private", description: "cats > dogs", displayName: "Cats", license: "PDDL", prefixes: { dc: "http://purl.org/dc/elements/1.1/" } })));
```

#### User.createOrganization(accountName: string, info: object)

Creates a new organization for which `User` will be the owner. This only works if the used API token includes write access for the
`User`.

The _`accountName`_ argument is the internal name of the organization. This name can only contain alphanumeric characters and hyphens.

The optional _`info`_ argument is a JSON object that specifies the organization metadata.
It has the following keys:

<dl>
  <dt><code>description</code></dt>
  <dd>The description of the organization.  This description can make use of Markdown layout (see the <a href="/docs/triply-db-getting-started/#markdown-support">Markdown reference</a>) for details.</dd>
  <dt><code>email</code></dt>
  <dd>The email address at which the organization can be reached.</dd>
  <dt><code>name</code></dt>
  <dd>The human-readable name of the organization.  This name may contain spaces and other non-alphanumeric characters.</dd>
</dl>

The following example creates an organization with name `acme` for which the
user with name `john-doe` will be the owner.  Notice that in addition to the required internal name (`"acme"`), an optional display name (`name: "Acme Corporation"`) is specified as well.

```typescript
const user = await client.getUser("john-doe");
console.log(await user.createOrganization("acme", { name: "Acme Corporation" }));
```

#### User.getDataset(name: string)

Returns the dataset with the given `name` that is published by the given `User`.

This function returns an object of type [`Dataset`](#dataset).  See that section
for an overview of the methods that can be called on those dataset objects.

The following example prints a specific dataset object:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.getDataset("cats"));
```

#### User.getDatasets()

Returns the list of datasets for this `User`.  This only includes
datasets that are accessible under the API token.

The following example prints the list of datasets that belong to the user named
`john-doe`:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.getDatasets().toArray());
```

Alternatively you can directly iterate over the request

```typescript
const user = await client.getUser("john-doe");
for await (const dataset of user.getDatasets()) {
  console.log(dataset)
}
```

#### User.getOrganizations()

Returns the list of organizations for which the `User` is a member.

The order in the list reflects the order in which the organizations appear on
the user page in the Triply GUI.

The following example prints the list of organizationo for which the user named
`john-doe` is a member:

```typescript
const user = await client.getuser("john-doe");
console.log(await user.getOrganizations());
```

#### User.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the given `User`.

The order in the list reflects the order in which they appear on the user page in the Triply GUI.

The following example prints the list of pinned items for the user named `john-doe`:

```typescript
const user = await client.getUser("john-doe");
console.log(await user.getPinnedItems());
```

### Dataset

The [`Dataset`](#dataset) class represents a TriplyDB dataset.

#### Dataset.addPrefixes(prefixes: object)

Adds IRI prefixes to the dataset. 

The _`prefixes`_ argument is an object, with prefixes as keys, and their corresponding IRI's as values.

The following example code applies the `dc` and `foaf` prefixes to the specified dataset.

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.addPrefixes({
  dc:   "http://purl.org/dc/elements/1.1/",
  foaf: "http://xmlns.com/foaf/0.1/"
});
```

#### Dataset.removePrefixes(prefixes: string[])

Removes IRI prefixes from the dataset. 

The `prefixes` argument is a string array, containing the prefix labels to be removed. 

The following example code removes the `dc` and `foaf` prefixes from the specified dataset.

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.removePrefixes(["dc", "foaf"]);
```

#### Dataset.addService(type: string, name: string)

Creates a new service for this dataset.

The service type is specified with the `type` parameter, which
supports the following values:

  - `"sparql"` :: Starts a SPARQL service.
  - `"sparql-jena"` :: Starts a SPARQL JENA service.
  - `"elasticsearch"` :: Starts an Elastic Search service.

The `name` argument can be used to distinguish between different
endpoints over the same dataset that are used for different tasks.

See section [`Service`](#service) for an overview of the methods that
can be used with service objects.

The following example code starts two SPARQL endpoints over a specific
dataset. One endpoint will be used in the acceptance environment
while the other endpoint will be used in the production system.

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
const acceptance = await dataset.addService("sparql", "acceptance");
const production = await dataset.addService("sparql", "production");
```

#### Dataset.getAssets()

Returns an array with objects that represent the assets that belong to
this dataset.

The following example code retrieves the assets for a specific
dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getAssets());
```

#### Dataset.getPrefixes()

Returns the prefixes that are defined for the dataset.

Example:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getPrefixes());
```

#### Dataset.copy(account: string, dataset: string)

Creates a copy of the current dataset.  The owner (user or
organization) of the copy is specified with parameter `account`.  The
name of the copy is specified with parameter `dataset`.

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.copy("account name", "copy dataset name"));
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
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.delete();
```

#### Dataset.deleteGraph(name: string)

Deletes a specific graph that belongs to this dataset.

The following example code deletes a specific graph from a specific
dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.deleteGraph("https://example.org/some-graph");
```

#### Dataset.getServices()

Returns an array of objects that represent TriplyDB services.

The following example code emits the services that are enabled for a
specific dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getServices());
```

#### Dataset.getGraphs()

Returns an array with objects that represent the graphs that belong to
this dataset.

The following example code retrieves the graphs for a specific
dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getGraphs());
```

#### Dataset.importFromDataset(from: Dataset, graphs: mapping)

`graphs:mapping` is a JSON object taking existing graph names (graphs) in the
`from` dataset, and mapping them into a new named graph in the Dateset into which they are imported.

The following code example creates a new dataset “d2” and imports one
graph from the existing dataset “d1”. Notice that the graph can be
renamed as part of the import.

```typescript
const dataset1 = await (await client.getAccount()).getDataset("dataset-name");
const dataset2 = await (await client.getAccount()).addDataset({ accessLevel: "private", name: "other-dataset" });
await dataset1.importFromDataset(dataset2, { "https://example.org/dataset2/graph": "https://example.org/dataset1/graph" });
```
Note that you can also import from URLs with:

```typescript
dataset1.importFromUrls("url", "url", "url")
```
and you can also import from files with:
(The files must contain RDF data and must be encoded in one of the
following standardized RDF serialization formats: N-Quads, N-Triples,
TriG, Turtle.)

```typescript
dataset1.importFromFiles("direction to file", "direction to file")
```

#### Dataset.info()

Returns an overview of the dataset in the form of a JSON object.

Example:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getInfo());
```


#### Dataset.removeAllGraphs()

Removes all graphs from this dataset.

The following code example removed all graphs from a specific dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.removeAllGraphs();
```

#### Dataset.renameGraph(from: string, to: string)

Renames a graph of this dataset, where `from` is the current graph
name and `to` is the new graph name.  The string arguments for `from`
and `to` must be valid IRIs.

The following example code renames a specific graph of a specific
dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
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
const dataset = await (await client.getAccount()).getDataset("original dataset name");
await dataset.update({ accessLevel: "private", description: "desc", displayName: "disp", license: "PDDL", name: "updated name"})
```

#### Dataset.uploadAsset(assetName: string, filePath: string)

Uploads a file that does not contain RDF data as an asset.

Assets can be source data files prior to running an ETL process,
documentation files describing the dataset, or media files
(audio/image/video) that are referenced by the RDF graph.

The following example code uploads source CSV data, as well as a PDF file documenting the
corresponding dataset:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.uploadAsset("source-data", "source.csv.gz");
await dataset.uploadAsset("documentation", "documentation.pdf");
```

### Service

Service objects describe specific functionalities that can be started,
stopped, and restarted over datasets in TriplyDB.

Service objects are obtained through the
[`Dataset.addService`](datasetaddserviceservicetype-string-name-string)
and [`Dataset.getServices`](#datasetgetservices) functions.

The following code example starts a specific service:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
await dataset.addService("sparql", "new-service");
```

The following service statuses are defined:

- removing
- running
- starting
- stopped
- stopping

#### Service.delete()

Deletes a service. Example:

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
const service = await dataset.addService("sparql", "new-service");
await service.delete();
```

#### Service.getInfo()

Returns an overview of the service in the form of a JSON object.

The following example code prints information about the newly created
service (named `new-service`):

```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
const service = await dataset.addService("sparql", "new-service");
console.log(await service.getInfo());
```

Another way to get information about existing services:
```typescript
const dataset = await (await client.getAccount()).getDataset("dataset-name");
console.log(await dataset.getServices());
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
const dataset = await (await client.getAccount()).getDataset("dataset-name");
const service = await dataset.addService("sparql", "new-service");
console.log(await service.isUpToDate());
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
the following command in the terminal:

```sh
echo $TRIPLY_API_TOKEN
```

### How do I get the results of a saved query using TriplyDB-js?

To reliably retrieve a large number of results as the output of a ```construct``` or ```select``` query, follow these steps:

1. Import the triplydb library.
   ```typescript
   import Client from '@triply/triplydb';
   ```

2. Set your parameters, regarding the TriplyDB instance and the account in which you have saved the query as well as the name of the query.

	```typescript
	const client = Client.get({url: ".."})
	const account = await client.getAccount("account-name");
	const query = await account.getQuery("name-of-some-query")
	```
	If the query is not public, you should set your API token rather than the URL.
	```typescript

	const client = Client.get({token: process.env['TRIPLY_API_TOKEN']})
	```

  
    
	
	
3. Do not forget that we perform TriplyDB-js requests within an [async context](#create-your-first-script). That is:

	```typescript

	async function run() {
    // your code goes here 
	}
  run()
	```
  
4. Get the results of a query by setting a ```results``` variable.
   More specifically, for construct queries:

	```typescript
	const results = query.results().statements()
	```
	For select queries:
	```typescript
	const results = query.results().bindings()
	```
	Note that for ```construct``` queries, we use ```.statements()```, while for ```select``` queries, we use ```.bindings()```.
 
	Additionally, saved queries can have "API variables" that allow you to specify variables that are used in the query. Thus, if you have query parameters, pass their values as the first argument to `results` as follows:
	```typescript
	// For construct queries
	const results = query.results({someVariable: "value of someVariable", anotherVariable: "value of anotherVariable"}).statements()
	// For select queries:
	const results = query.results({someVariable: "value of someVariable", anotherVariable: "value of anotherVariable"}).bindings()
	```
5. To read the results you have three options:
  1. You can iterate through the results per quad in a ```for``` loop.
   ```typescript
   // Iterating over the results per quad
   for await (const row of results) {
     // execute something
   }
   ```
  2. Save the results to a file. Note that results can be saved in a file using `.toFile` only in the case of `construct` queries.
   ```typescript
   // Saving the results of a construct query to file
   await results.toFile("path/to/some/file")
   ```
  3. Load the results into memory. Note that this is often not necessary and that large amounts of data can cause your program to run out of memory.

   ```typescript
   // Loading results of a construct or select query into memory
   const array = await results.toArray()
   ```

