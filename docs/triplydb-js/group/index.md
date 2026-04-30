[TOC]

# Group

Instances of class `Group` denote groups in TriplyDB. Groups were previously called *organizations* — for backwards compatibility, every `Organization`-named import and method (e.g. the `Organization` class, `App.getOrganization`, `Account.asOrganization`, `User.createOrganization`, `User.getOrganizations`, `User.ensureOrganization`) is still available as a deprecated alias of the corresponding `Group` method, so existing TriplyDB.js code continues to work without changes.

### Obtaining instances

Groups are obtained with method [`App.getGroup(name: string)`](../app/index.md#appgetgroupname-string):

```ts
const group = await triply.getGroup('Triply')
```

Alternatively, groups are obtained by first obtaining an account ([`App.getAccount(name?: string)`](../app/index.md#appgetaccountname-string)) and then casting it to a group ([`Account.asGroup()`](../account/index.md#accountasgroup)):

```ts
const account = await triply.getAccount('Triply')
const group = account.asGroup()
```

### Inheritance

`Group` is a subclass of [`Account`](../account/index.md#account), from which it inherits most of its methods.


<a id="organizationadddatasetname-string-metadata-object"></a>
## Group.addDataset(name: string, metadata?: object)

Adds a new TriplyDB dataset with the given `name` to the current group.

Inherited from [`Account.addDataset(name: string, metadata?: object)`](../account/index.md#accountadddatasetname-string-metadata-object).


<a id="organizationaddmemberuser-user-role-role"></a>
## Group.addMember(user: User, role?: Role)

Adds a member to the given `Group`, with the given `role`.

### Arguments

- The `user` argument has to be a user object of the user which should be added to the group.

- The `role` argument specifies the role to assign to the new member. If this argument is not specified, then `'member'` is used as the default. The following system roles are always available:

<dl>
  <dt><code>'member'</code> (default)</dt>
  <dd>Can manage resources (datasets, queries, stories) but cannot manage group members or delete the group.</dd>

  <dt><code>'owner'</code></dt>
  <dd>Full access to all account resources and settings, including the ability to add/remove users to/from the group, the ability to change the roles of existing users, and the ability to delete the group.</dd>
</dl>

In addition to the system roles, administrators can configure custom roles with specific permissions. Any custom role name that has been configured on the TriplyDB instance can be passed as the `role` argument. See the [Roles](../../triply-db-getting-started/admin-settings-pages/index.md#roles-page) documentation for more information.

### Examples

The following snippet adds user John Doe to the Triply group as a regular member.

```ts
const group = await triply.getGroup('Triply')
const johnDoe = await app.getUser('john-doe')
await group.addMember(johnDoe)
```


<a id="organizationaddqueryname-string-metadata-object"></a>
## Group.addQuery(name: string, metadata: object)

Adds a new TriplyDB query to the current group.

Inherited from [`Account.addQuery(name: string, metadata: object)`](../account/index.md#accountaddqueryname-string-metadata-object).


<a id="organizationensurestoryname-string-metadata-object"></a>
## Group.ensureStory(name: string, metadata: object)

Ensures the existence of a story with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureStory(name: string, metadata: object)`](../account/index.md#accountensurestoryname-string-metadata-object).


<a id="organizationaddstoryname-string-metadata-object"></a>
## Group.addStory(name: string, metadata?: object)

Adds a new TriplyDB story with the given `name` to the current group.

Inherited from [`Account.addStory(name: string, metadata?: object)`](../account/index.md#accountaddstoryname-string-metadata-object).


<a id="organizationdelete"></a>
## Group.delete()

Deletes this account. This also deletes all datasets, stories and queries that belong to this group.

### Examples

The following code example deletes the specified group:

```ts
const group = await triply.getGroup('Neo4j')
await group.delete()
```


<a id="organizationensuredatasetname-string-metadata-object"></a>
## Group.ensureDataset(name: string, metadata?: object)

Ensures the existence of a dataset with the given `name` and with the specified `metadata`.

Inherited from [`Account.ensureDataset(name: string, metadata?: object)`](../account/index.md#accountensuredatasetname-string-metadata-object).


<a id="organizationgetdatasetname-string"></a>
## Group.getDataset(name: string)

Returns the dataset with the given `name` that is published by this group.

Inherited from [`Account.getDataset(name: string)`](../account/index.md#accountgetdatasetname-string).


<a id="organizationgetdatasets"></a>
## Group.getDatasets()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the accessible datasets that belong to this group.

Inherited from [`Account.getDatasets()`](../account/index.md#accountgetdatasets).


<a id="organizationgetmembers"></a>
## Group.getMembers()

Returns the list of memberships for the given group.

### Return type

A membership contains the following components:

<dl>
  <dt><code>role</code></dt>
  <dd>The role of the membership. This is one of the system roles (<code>'owner'</code> or <code>'member'</code>) or a custom role name configured by an administrator. See the <a href='../../triply-db-getting-started/admin-settings-pages/index.md#roles-page'>Roles</a> documentation for more information.</dd>

  <dt><code>user</code></dt>
  <dd>An instance of class <a href='#user'><code>User</code></a>.</dd>

  <dt><code>createdAt</code></dt>
  <dd>A date/time string.</dd>

  <dt>updatedAt</dt>
  <dd>A date/time string.</dd>
</dl>

### Examples

```ts
const group = await triply.getGroup('acme')
for (const membership of await group.getMembers()) {
  console.log(user)
}
```

### See also

Memberships of a group are TriplyDB [users](../user/index.md#user).


<a id="organizationgetpinneditems"></a>
## Group.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the current group.

Inherited from [`Account.getPinnedItems()`](../account/index.md#accountgetpinneditems).


<a id="organizationremovememberuser-user"></a>
<a id="organizationremovememberuser-user_1"></a>
## Group.removeMember(user: User)

Removes the specified `user` from this group.

### Arguments

The `user` argument has to be a [`User`](../user/index.md#user) object of a user.

### Existence considerations

The user must be a current member of the group for this method to succeed. If the user is not a current member of the group, an error is thrown.

### Examples

- The following snippet removes John Doe from the Triply group, using a string argument:

```ts
const group = await triply.getGroup('Triply')
const johnDoe = await app.getUser('john-doe')
await group.removeMember(johnDoe)
```

- The following snippet removes John Doe from the Triply group, using a [`User`](../user/index.md#user) object:

```ts
const group = await triply.getGroup('Triply')
const user = await triply.getUser('john-doe')
await group.removeMember(user)
```


<a id="organizationsetavatarfile-string"></a>
## Group.setAvatar(file: string)

Sets a new image that characterizes this group.

Inherited from [`Account.setAvatar(file: string)`](../account/index.md#accountsetavatarfile-string).


<a id="organizationupdatemetadata-object"></a>
## Group.update(metadata: object)

Updates the metadata for this account.

Inherited from [`Account.update(metadata: object)`](../account/index.md#accountupdatemetadata-object).
