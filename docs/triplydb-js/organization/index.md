# Organization

Instances of class `Organization` denote organizations in TriplyDB.

### Obtaining instances

Organizations are obtained with method [`App.getOrganization(name: string)`](#appgetorganizationname-string):

```ts
const organization = await triply.getOrganization('Triply')
```

Alternatively, organizations are obtained by first obtaining an account ([`App.getAccount(name?: string)`](#appgetaccountname-string)) and then casting it to an organization ([`Account.asOrganization()`](#accountasorganization)):

```ts
const account = await triply.getAccount('Triply')
const organization = account.asOrganization()
```

### Inheritance

`Organization` is a subclass of [`Account`](#account), from which it inherits most of its methods.


## Organization.addDataset(name: string, metadata?: object)

Adds a new TriplyDB dataset with the given `name` to the current organization.

Inherited from [`Account.addDataset(name: string, metadata?: object)`](#accountadddatasetname-string-metadata-object).


## Organization.addMember(user: User, role?: Role)

Adds a member to the given `Organization`, with the given `role` of either member or owner.

### Arguments

- The `user` argument has to be a user object of the user which should be added to the organization.

- The `role` argument can be either `'member'` or `'owner'`. If this argument is not specified, then `'member'` is used as the default.

<dl>
  <dt><code>'member'</code></dt>
  <dd>A regular member that is allowed to read and write the datasets that are published under the organization.</dd>

  <dt><code>'owner'</code></dt>
  <dd>An owner of the organization. Owners have all the rights of regular users, plus the ability to add/remove users to/from the organization, the ability to change the roles of existing users, and the ability to delete the organization.</dd>
</dl>

### Examples

The following snippet adds user John Doe to the Triply organization as a regular member.

```ts
const organization = await triply.getOrganization('Triply')
const johnDoe = await app.getUser('john-doe')
await organization.addMember(johnDoe)
```


## Organization.removeMember(user: User)

Removes a member from the given `Organization`.


## Organization.addQuery(name: string, metadata: object)

Adds a new TriplyDB query to the current organization.

Inherited from [`Account.addQuery(name: string, metadata: object)`](#accountaddqueryname-string-metadata-object).


## Organization.ensureStory(name: string, metadata: object)

Ensures the existence of a story with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureStory(name: string, metadata: object)`](#accountensurestoryname-string-metadata-object).


## Organization.addStory(name: string, metadata?: object)

Adds a new TriplyDB story with the given `name` to the current organization.

Inherited from [`Account.addStory(name: string, metadata?: object)`](#accountaddstoryname-string-metadata-object).


## Organization.delete()

Deletes this account. This also deletes all datasets, stories and queries that belong to this organization.

### Examples

The following code example deletes the specified organization:

```ts
const organization = await triply.getOrganization('Neo4j')
await organization.delete()
```


## Organization.ensureDataset(name: string, metadata?: object)

Ensures the existence of a dataset with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureDataset(name: string, metadata?: object)`](#accountensuredatasetname-string-metadata-object).


## Organization.getDataset(name: string)

Returns the dataset with the given `name` that is published by this organization.

Inherited from [`Account.getDataset(name: string)`](#accountgetdatasetname-string).


## Organization.getDatasets()

Returns an [async iterator](#what-is-an-async-iterator) over the accessible datasets that belong to this organization.

Inherited from [`Account.getDatasets()`](#accountgetdatasets).


## Organization.getMembers()

Returns the list of memberships for the given organization.

### Return type

A membership contains the following components:

<dl>
  <dt><code>role</code></dt>
  <dd>The role of the membership (<code>OrgRole</code>): either <code>'owner'</code> for owners of the organization, or <code>'member'</code> for regular members. The difference between owners and regular members is that owners can perform user management for the organization (add/remove/change memberships).</dd>

  <dt><code>user</code></dt>
  <dd>An instance of class <a href='#user'><code>User</code></a>.</dd>

  <dt><code>createdAt</code></dt>
  <dd>A date/time string.</dd>

  <dt>updatedAt</dt>
  <dd>A date/time string.</dd>
</dl>

### Examples

```ts
const org = await triply.getOrganization('acme')
for (const membership of await org.getMembers()) {
  console.log(user)
}
```

### See also

Memberships of organization are TriplyDB [users](#user).


## Organization.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the current organization.

Inherited from [`Account.getPinnedItems()`](#accountgetpinneditems).


## Organization.removeMember(user: User)

Removes the specified `user` from this organization.

### Arguments

The `user` argument has to be a [`User`](#user) object of a user.

### Existence considerations

The user must be a current member of the organization for this method to succeed. If the user is not a current member of the organization, an error is thrown.

### Examples

- The following snippet removes John Doe from the Triply organization, using a string argument:

```ts
const organization = await triply.getOrganization('Triply')
const johnDoe = await app.getUser('john-doe')
await organization.removeMember(johnDoe)
```

- The following snippet removes John Doe from the Triply organization, using a [`User`](#user) object:

```ts
const organization = await triply.getOrganization('Triply')
const user = await triply.getUser('john-doe')
await organization.removeMember(user)
```


## Organization.setAvatar(file: string)

Sets a new image that characterized this organization.

Inherited from [`Account.setAvatar(file: string)`](#accountsetavatarfile-string).


## Organization.update(metadata: object)

Updates the metadata for this account.

Inherited from [`Account.update(metadata: object)`](#accountupdatemetadata-object).