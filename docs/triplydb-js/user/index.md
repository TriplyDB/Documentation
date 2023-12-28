[TOC]

# User

Instances of class `User` denote users in TriplyDB.

### Obtaining instances

Users are obtained with method [`App.getUser(name?: string)`](../app/index.md#appgetusername-string):

```ts
const user = triply.getUser('john-doe')
const user = triply.getUser()
```

Alternatively, users are obtained by first obtaining an account ([`App.getAccount(name?: string)`](../app/index.md#appgetaccountname-string)) and then casting it to a use ([`Account.asUser()`](../account/index.md#accountasuser)):

```ts
const account = await triply.getAccount('john-doe')
const user = account.asUser()
```

### Inheritance

`User` is a subclass of [Account](../account/index.md#account), from which it inherits most of its methods.

### Limitations

Users cannot be created or deleted through the TriplyDB.js library. See the [Triply Console documentation](../../triply-db-getting-started/index.md) for how to create and delete users through the web-based GUI.


## User.addDataset(name: string, metadata?: object)

Adds a new TriplyDB dataset with the given `name` to the current account.

Inherited from [`Account.addDataset(name: string, metadata?: object)`](../account/index.md#accountadddatasetname-string-metadata-object).


## User.addQuery(metadata: object)

Adds a new TriplyDB query to the current user.

Inherited from [`Account.addQuery(name:string, metadata: object)`](../account/index.md#accountaddqueryname-string-metadata-object).


## User.ensureStory(name: string, metadata: object)

Ensures the existence of a story with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureStory(name: string, metadata: object)`](../account/index.md#accountensurestoryname-string-metadata-object).


## User.addStory(name: string, metadata?: object)

Adds a new TriplyDB story with the given `name` to the current user.

Inherited from [`Account.addStory(name: string, metadata?: object)`](../account/index.md#accountaddstoryname-string-metadata-object).


## User.createOrganization(name: string, metadata?: object)

Creates a new organization for which this user will be the owner.

### Access restrictions

This method requires an API token with write access for this user.

### Arguments

- Argument `name` is the URL-friendly name of the new organization. This name can only contain alphanumeric characters and hyphens (`[A-Za-z0-9\-]`).

- The optional `metadata` argument can be used to specify additional metadata. This is a dictionary object with the following optional keys:

<dl>
  <dt><code>description</code></dt>
  <dd>The description of the organization. This description can make use of Markdown.</dd>

  <dt><code>email</code></dt>
  <dd>The email address at which the organization can be reached.</dd>

  <dt><code>name</code></dt>
  <dd>The human-readable name of the organization. This name may contain spaces and other non-alphanumeric characters.</dd>
</dl>

### Examples

The following snippet creates a new organization for which John Doe will be the owner. Notice that both a required URL-friendly name (`'my-organization'`) and an optional display name (`'My Organization'`) are specified.

```ts
const user = await triply.getUser('john-doe')
await user.createOrganization(my-organization, {name: 'My Organization'}))
```


## User.ensureDataset(name: string, metadata?: object)

Ensures the existence of a dataset with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureDataset(name: string, metadata?: object)`](../account/index.md#accountensuredatasetname-string-metadata-object).


## User.getDataset(name: string)

Returns the TriplyDB dataset with the given `name` that is published by this user.

Inherited from [`Account.getDataset(name: string)`](../account/index.md#accountgetdatasetname-string).


## User.getDatasets()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the accessible datasets for the current user.

Inherited from [`Account.getDatasets()`](../account/index.md#accountgetdatasets).


## User.getInfo()

Returns information about this user.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

The information object for users includes the following keys:

<dl>
  <dt><code>avatarUrl</code></dt>
  <dd>A URL to the user image.</dd>

  <dt><code>accountName</code></dt>
  <dd>The URL-friendly name of the user.</dd>

  <dt><code>name</code></dt>
  <dd>The human-readable display name of the user</dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the user.</dd>

  <dt><code>createdAt</code></dt>
  <dd>The date and time on which the user was created.</dd>

  <dt><code>datasetCount</code></dt>
  <dd>The number of datasets for the user.</dd>

  <dt><code>queryCount</code></dt>
  <dd>The number of queries for the user.</dd>

  <dt><code>storyCount</code></dt>
  <dd>The number of stories for the user</dd>

  <dt><code>pinnedItems</code></dt>
  <dd>An array containing the pinned items (datasets, stories and queries) for the user.</dd>

  <dt><code>role</code></dt>
  <dd>The role of the user. Either 'light', 'regular' or 'siteAdmin'.</dd>

  <dt><code>orgs</code></dt>
  <dd>An array of organizations of which the user is a member.</dd>

  <dt><code>Email address</code></dt>
  <dd>The email address of the user.</dd>

  <dt><code>updatedAt</code></dt>
  <dd>The date and time on which the user was last updated.</dd>

  <dt><code>lastActivity</code></dt>
  <dd>The date and time on which the user was last online on TriplyDB.</dd>
</dl>

### Examples

The following snippet prints an overview of account that is associated with the used API token:

```ts
const user = await triply.getUser()
console.log(await user.getInfo())
```


## User.getOrganizations()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the organizations that this user is a member of.

### Order considerations

The order in the list reflects the order in which the organizations appear on the user page in the Triply GUI.

### Examples

The following snippet prints the list of organizations that John Doe is a member of:

```ts
const user = await triply.getUser('john-doe')
for await (const organization of await user.getOrganizations()) {
  console.log((await organization.getInfo()).name)
}
```

### See also

The [async iterator](../faq/index.md#what-is-an-async-iterator) contains organization objects. See the section about the [`Organization`](../organization/index.md#organization) class for methods that can be used on such objects.


## User.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the current user.

Inherited from [`Account.getPinnedItems()`](../account/index.md#accountgetpinneditems).


## User.setAvatar(file: string)

Sets a new image that characterized this user.

Inherited from [`Account.setAvatar(file: string)`](../account/index.md#accountsetavatarfile-string).


## User.update(metadata: object)

Updates the metadata for this user.

Inherited from [`Account.update(metadata: object)`](../account/index.md#accountupdatemetadata-object).
