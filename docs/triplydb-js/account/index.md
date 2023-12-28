[TOC]

# Account

Instances of the `Account` class denote TriplyDB accounts. Accounts can be either organizations ([`Organization`](../organization/index.md#organization)) or users ([`User`](../user/index.md#user)).

Account objects are obtained by calling the following method:

- [`App.getAccount(name?: string)`](../app/index.md#appgetaccountname-string)


## Account.addDataset(name: string, metadata?: object)

Adds a new TriplyDB dataset with the given `name` to the current account.

The optional `metadata` argument is used to specify the metadata for the dataset.

### Access restrictions

Creating a new dataset only succeeds if an API token is configured that provides write access to the current account.

The default access level for a newly created dataset is `private`. If you want to publish a dataset with a different access level, you must specify the `accessLevel` key in the `metadata` argument.

### Arguments

The `name` argument specifies the URL-friendly name of the new dataset. The name must only contain alphanumeric characters and hyphens (`[A-Za-z0-9\-]`).

The full URL of the newly created dataset has the following structure:

```
https://{host}/{account}/{dataset}
```

The `metadata` argument optionally specifies the access level and other important metadata:

<dl>
  <dt><code>accessLevel</code></dt>
  <dd>
    <p>The access level of the dataset. The following values are supported:</p>
    <dl>
      <dt><code>'private'</code> (default)</dt>
      <dd>The dataset can only be accessed by organization members.</dd>
      <dt><code>'internal'</code> </dt>
      <dd>The dataset can only be accessed by users that are logged into the TriplyDB server.</dd>
      <dt><code>'public'</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
    <p>When no access level is specified, the most restrictive access level (<code>private</code>) is used.</p>
  </dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the dataset. This description can make use of Markdown.</dd>

  <dt><code>displayName</code></dt>
  <dd>The human-readable name of the dataset. This name may contain spaces and other characters that are not allowed in the URL-friendly name.</dd>

  <dt><code>license</code></dt>
  <dd>
    <p>The license of the dataset. The following license strings are currently supported:</p>
    <ul>
      <li><code>'CC-BY-SA'</code></li>
      <li><code>'CC0 1.0'</code></li>
      <li><code>'GFDL'</code></li>
      <li><code>'ODC-By'</code></li>
      <li><code>'ODC-ODbL'</code></li>
      <li><code>'PDDL'</code></li>
      <li><code>'None'</code> (default)</li>
    </ul>
  </dd>

  <dt><code>prefixes</code></dt>
  <dd>The IRI prefix declarations that are configured for the dataset. This is specified as a dictionary object whose keys are aliases and whose values are IRI prefixes.</dd>
</dl>

### Examples

The following snippet creates a new dataset called `'iris'` under the account called `'Triply'`:

- The dataset has private access, because the access level is not specified explicitly.
- The dataset has a description.
- The dataset has a display name.
- The dataset has the PDDL license.

```ts
const account = await triply.getAccount('Triply')
const dataset = await account.addDataset('iris', {
  description: 'A multivariate dataset that quantifies morphologic variation of Iris flowers.',
  displayName: 'Iris',
  license: 'PDDL',
  name: 'iris',
  prefixes: {
    def: 'https://triplydb.com/Triply/iris/def/',
    id: 'https://triplydb.com/Triply/iris/id/',
  },
})
```

### See also

This method returns a dataset object. See the [Dataset](../dataset/index.md#dataset) section for an overview of the methods that can be called on such objects.


## Account.addQuery(name: string, metadata: object)

Adds a new SPARQL query to the account.

### Arguments

**Required:**

<dl>
  <dt><code>name: string</code> </dt>
  <dd>The URL-friendly name of the new query. The name must only contain alphanumeric characters and hyphens (<code>[A-Za-z0-9\-]</code>).</dd>

  <dt><code>queryString: string</code> </dt>
  <dd>The SPARQL query string (e.g., <code>'select * { ?s ?p ?o }'</code>).</dd>

  <dt><code>dataset: Dataset</code> </dt>
  <dd>An instance of class <a href='../dataset/index.md#dataset'><code>Dataset</code></a> that the current API token gives access to.</dd>
or
  <dt><code>service: Service</code> </dt>
  <dd>An instance of class <a href='../service/index.md#service'><code>Service</code></a> that the current API token gives access to and that you want to be associated with this query. The Service given will be used as a preferred service for this query.</code></dd>
</dl>

**Optional:**

The `metadata` argument specifies the required Dataset or Service and access level. Other important metadata can be set optionally:

<dl>
  <dt><code>accessLevel</code> </dt>
  <dd> The access level of the query. If none is set it defaults to <code>'private'</code>. The following values are supported:
    <dl>
      <dt><code>'private'</code></dt>
      <dd>The query can only be accessed by the <a href='#account'><code>Account</code></a> object for which it is created.</dd>
      <dt><code>'internal'</code></dt>
      <dd>The query can only be accessed by people who are logged into the TriplyDB server.</dd>
      <dt><code>'public'</code></dt>
      <dd>The query can be accessed by everybody.</dd>
    </dl>
  </dd>

  <dt><code>description: string</code> </dt>
  <dd>A human-readable description of the query.</dd>

  <dt><code>displayName: string</code></dt>
  <dd>The human-readable name of the query. This name may include spaces and other characters that are not allowed in the URL-friendly <code>name</code>.</dd>

  <dt><code>output: string</code></dt>
  <dd>The visualization plugin that is used to display the result set of the query. If none is set it defaults to <code>'table'</code>.
    <dl>
      <dt><code>'boolean'</code></dt>
      <dd>The <a href='../../yasgui/index.md#table'>boolean</a> view is a special view for ask queries. The value is either 'true' or 'false', and is visualized as  <code>`X`</code>(False) or <code>`V`</code>(True).</dd>
      <dt><code>'gallery'</code></dt>
      <dd>The <a href='../../yasgui/index.md#gallery-triplydb-plugin'>gallery</a> view allows SPARQL results to be displayed in an HTML gallery.</dd>
      <dt><code>'gchart'</code></dt>
      <dd>The <a href='../../yasgui/index.md#chart-triplydb-plugin'>gchart</a> renders geographical, temporal and numerical data in interactive charts such as bar-, line- and pie charts.</dd>
      <dt><code>'geo'</code></dt>
      <dd>The <a href='../../yasgui/index.md#geo-triplydb-plugin'>geo</a> allows SPARQL results that contain GeoSPARQL semantics to be automatically interpreted and displayed on a 2D map.</dd>
      <dt><code>'geoEvents'</code></dt>
      <dd>The <a href='../../yasgui/index.md#geo-events-triplydb-plugin'>geoEvents</a> plugin renders geographical events as a story map.</dd>
      <dt><code>'geo3d'</code></dt>
      <dd>The <a href='../../yasgui/index.md#geo-3d-triplydb-only'>geo3d</a> allows SPARQL results that contain GeoSPARQL semantics to be automatically interpreted and displayed on a 3D globe.</dd>
      <dt><code>'markup'</code></dt>
      <dd>The <a href='../../yasgui/index.md#markup-triplydb-plugin'>markup</a> can be used to render a variety of markup languages. This requires the use of the `?markup` variable to identify which variable to render.</dd>
      <dt><code>'network'</code></dt>
      <dd>The <a href='../../yasgui/index.md#network-triplydb-plugin'>network</a> renders SPARQL Construct results in a graph representation. The maximum amount of results that can be visualized is 1.000 due to performance.</dd>
      <dt><code>'pivot'</code></dt>
      <dd>The <a href='../../yasgui/index.md#pivot-table-triplydb-plugin'>pivot</a> view renders SPARQL results in an interactive pivot table where you are able to aggregate the results by dragging your binding variables to columns or rows.</dd>
      <dt><code>'response'</code></dt>
      <dd>The <a href='../../yasgui/index.md#response'>response</a> view shows the body of the response and offers a easy way to download the result as a file.</dd>
      <dt><code>'table'</code></dt>
      <dd>The <a href='../../yasgui/index.md#table'>table</a> view allows SPARQL results to be displayed in a table. Each
      column in the table corresponds to a variable that belongs to the
      outer projection.</dd>
      <dt><code>'timeline'</code></dt>
      <dd>The <a href='../../yasgui/index.md#timeline-triplydb-plugin'>timeline</a> timeline renders the SPARQL results on a Timeline. </dd>
    </dl>
  </dd>

  <dt><code>variables: Variable[]</code></dt>
  <dd>
    A list of objects with the following keys:
    <dl>
      <dt>IRI variable</dt>
      <dd>An object of the form <code>Variable</code> (see below)</dd>
  </dd>
</dl>

Instances of `Variable` are objects that can have the following keys:

**Required:**

<dl>
  <dt><code>name: string</code> </dt>
  <dd>A SPARQL variable name. The variable name must appear in the query string. The question mark (<code>?</code>) or dollar sign (<code>$</code>) is not included.</dd>

  <dt><code>termType: 'Literal'|'NamedNode'</code> </dt>
  <dd>The kind of variable. This must be either <code>'Literal'</code> for literals or <code>'NamedNode'</code> for IRIs.</dd>
</dl>

**Optional:**

<dl>
  <dt><code>allowedValues: string[]</code></dt>
  <dd>The list of string values that is allowed for this variable.</dd>

  <dt><code>datatype: string</code> (if <code>termType='Literal'</code>)</dt>
  <dd>The datatype IRI for the literal variable.</dd>

  <dt><code>language: string</code> (if <code>termType='Literal'</code>)</dt>
  <dd>The language tag for the literal variable. Setting this implies that the dataset IRI is <code>rdf:langString</code>.</dt>

  <dt><code>defaultValue: string</code></dt>
  <dd>The default string value for the </dd>

  <dt><code>required: boolean</code></dt>
  <dd>Whether a query request must include an explicit value for this variable. The default value is <code>false</code>.</dd>
</dl>

### Example

The following snippet creates a query with the given query string:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getUser()
const myDataset = await user.getDataset('my-dataset')
const query = await user.addQuery('my-query', {
  dataset: myDataset,
  queryString: 'select (count(*) as ?n) { ?s ?p ?o. }',
  output: 'response',
})
```


## Account.addStory(name: string, metadata?: object)

Adds a new data story.

### Required

<dl>
  <dt><code>name: string</code></dt>
  <dd>The URL-friendly name of the data story. The name must only contain alphanumeric characters and hyphens (<code>[A-Za-z0-9\-]</code>).</dd>
</dl>

### Optional

<dl>
  <dt><code>accessLevel</code> </dt>
  <dd>
    <p>The access level of the dataset. If none is given the default of <code>'private'</code> is used. The following values are supported:</p>
    <dl>
      <dt><code>'private'</code></dt>
      <dd>The dataset can only be accessed by the <a href='#account'><code>Account</code></a> object for which it is created.</dd>
      <dt><code>'internal'</code></dt>
      <dd>The dataset can only be accessed by people who are logged into the TriplyDB server.
      <dt><code>'public'</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
  </dd>
  <dt><code>content: StoryElementUpdate[]</code> </dt>
  <dd>A list of story elements. The building blocks of the Story.</dd>
  <dt><code>displayName: string</code> </dt>
  <dd>The human-readable name of the data story. This name may include spaces and other characters that are not allowed in the URL-friendly name.</dd>
</dl>

A story element is an object with the following keys:

<dl>
  <dt>caption: string</dt>
  <dd>The caption is an explanatory text about a specific query.</dd>

  <dt><code>id: string</code></dt>
  <dd>Each Story element gets an Id when it is created. When you want to update a Story element you will need this Id. The Id is only required when updating an element and not needed when adding an object.</dd>

  <dt>paragraph: string</dt>
  <dd>The Markdown content of a story paragraph. Only allowed when the type is set to <code>'paragraph'</code> </dd>

  <dt><code>query: Query</code></dt>
  <dd>An instance of class <a href='../query/index.md#query'><code>Query</code></a>.</dd>

  <dt>queryVersion: number</code>
  <dd>The version that is used of the specified query.</dd>

  <dt><code>type</code></dt>
  <dd>Either <code>'paragraph'</code> or <code>'query'</code>.</dd>
</dl>

### Examples

Example 1 - creates a new story that has access level `'private'`:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getUser()
const newStory = await user.addStory('name-of-story')
```

Example 2 - creates a new story that has access level `'public'`:

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getUser()
const newStory = await user.addStory('name-of-story', {
  accessLevel: 'public',
})
```


## Account.asOrganization()

Casts the TriplyDB account object to its corresponding organization object.

Class [Organization](../organization/index.md#organization) is a specialization of class [Account](#account).

Calling this method on an `Organization` object does nothing.

### Examples

The following snippet retrieves the account named `'Triply'` and casts it to an organization:

```ts
const account = await triply.getAccount('Triply')
const organization = account.asOrganization()
```

### Alternatives

This method is not needed if the organization is directly retrieved with the specialization method [`App.getOrganization(name: string)`](../app/index.md#appgetorganizationname-string).

The following snippet returns the same result as the above example, but in a more direct way:

```ts
const organization = await triply.getOrganization('Triply')
```

### See also

This method returns an organization object. See class [Organization](../organization/index.md#organization) for an overview of the methods that can be called on such objects.


## Account.asUser()

Casts the TriplyDB account object to its corresponding user object.

Class [User](../user/index.md#user) is a specialization of class [Account](#account).

Calling this method on a [User](../user/index.md#user) object does nothing.

### Examples

The following snippet retrieves the account that represents the current user, and casts it to a user object:

```ts
const account = await triply.getAccount()
const user = account.asUser()
```

### Alternatives

This method is not needed if the user is directly retrieved with the specialization method [`App.getUser(name?: string)`](../app/index.md#appgetusername-string).

The following snippet returns the same result as the above example, but in a more direct way:

```ts
const user = await triply.getUser()
```

### See also

This method returns an organization object. See class [Organization](../organization/index.md#organization) for an overview of the methods that can be called on such objects.


## Account.ensureDataset(name: string, metadata?: object)

Ensures the existence of a dataset with the given `name` and with the specified `metadata` if given.

Calling this method ensures that the necessary changes (if any) are made in the connected-to TriplyDB server that result in an end state in which a dataset with the given `name` and `metadata` exists.

This method is useful in practice, because it removes the burden on the programmer to have to write custom code for checking for the existence of a dataset, and conditionally create a new dataset or make metadata changes to an existing dataset.

The changes made as a result of calling this method depend on the current state of the connected-to TriplyDB server:

- If this account does not yet have a dataset with the given `name`, then the behavior is identical to calling [`Account.addDataset(name: string, metadata?: object)`](#accountadddatasetname-string-metadata-object) with the same arguments.
- If this account already has a dataset with the given `name` and with the same `metadata`, then this method makes no changes.

### Example

```ts
const account = await triply.getAccount('Triply')
const myDataset = await account.ensureDataset(`my-dataset`, {
  license: 'PDDL',
})
```

### See also

The meaning of the argument to this method are identical to those of the [`Account.addDataset(name: string, metadata?: object)`](#accountadddatasetname-string-metadata-object) method.


## Account.getDataset(name: string)

Returns the dataset with the given `name` that is published by this account.

### Examples

The following snippet prints the name of the Iris dataset that is published by the Triply account:

```ts
const account = await triply.getAccount('Triply')
const dataset = await triply.getDataset('iris')
console.log((await dataset.getInfo()).name)
```

### See also

This method returns a dataset object. See class [Dataset](../dataset/index.md#dataset) for an overview of the methods that can be called on such objects.


## Account.getDatasets()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the accessible datasets for the current account.

### Access restrictions

The iterator only includes datasets that are accessible for the current connection with a TriplyDB server:

- If no API token is configured, the iterator will include all and only public datasets belonging to this account.

- If an API token is configured, the iterator will include all public and internal datasets belonging to this account, and will include all private datasets belonging to this account if the API token gives read access to the account.

### Examples

- The following snippet prints the names of all accessible dataset under the Triply account:

```ts
const account = await triply.getAccount('Triply')
for await (const dataset of account.getDatasets()) {
  console.log((await dataset.getInfo()).name)
}
```

- The following snippet prints the list of names of all accessible datasets under the Triply account:

```ts
const account = await triply.getAccount('Triply')
console.log(await account.getDatasets().toArray())
```


## Account.getInfo()

Returns information about this account.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

The information object for accounts includes the following keys:

<dl>
  <dt><code>avatarUrl</code></dt>
  <dd>A URL to the account image.</dd>

  <dt><code>accountName</code></dt>
  <dd>The URL-friendly name of the account.</dd>

  <dt><code>name</code></dt>
  <dd>The human-readable display name of the account</dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the account.</dd>

  <dt><code>createdAt</code></dt>
  <dd>The date and time on which the account was created.</dd>

  <dt><code>datasetCount</code></dt>
  <dd>The number of datasets for the account.</dd>

  <dt><code>queryCount</code></dt>
  <dd>The number of queries for the account.</dd>

  <dt><code>storyCount</code></dt>
  <dd>The number of stories for the account</dd>

  <dt><code>pinnedDatasets</code></dt>
  <dd>An array containing the pinned dataset for the account.</dd>

  <dt><code>pinnedItems</code></dt>
  <dd>An array containing the pinned items (datasets, stories and queries) for the account.</dd>

  <dt><code>type</code></dt>
  <dd>The account type: either <code>organization</code> or <code>user</code>.</dd>

  <dt><code>role</code></dt>
  <dd>The role of the account</dd>

  <dt><code>orgs</code></dt>
  <dd>An array of organizations of which the account is a member.</dd>

  <dt><code>Email address</code></dt>
  <dd>The email address of the account.</dd>

  <dt><code>updatedAt</code></dt>
  <dd>The date and time on which the account was last updated.</dd>

  <dt><code>lastActivity</code></dt>
  <dd>The date and time on which the account was last online on TriplyDB.</dd>
</dl>

### Examples

- The following snippet prints the full information object for the account called ‘Triply’:

```ts
const account = await triply.getAccount('Triply')
console.log(await account.getInfo())
```

  The output for this snippet can look as follows:

```json
{
  'accountName': 'Triply',
  'avatarUrl': 'https://www.gravatar.com/avatar/9bc28997dd1074e405e1c66196d5e117?d=mm',
  'createdAt': 'Mon Mar 19 2018 14:39:18 GMT+0000 (Coordinated Universal Time)',
  'datasetCount': 16,
  'name': 'Triply',
  'queryCount': 37,
  'storyCount': 7,
  'type': 'org',
  'updatedAt': 'Tue Nov 27 2018 09:29:38 GMT+0000 (Coordinated Universal Time)'
}
```

- The following snippet prints the name of the account called ‘Triply’:

```ts
const account = await triply.getAccount('Triply')
console.log((await account.getInfo()).name)
```


## Account.getPinnedItems()

Returns the list of datasets, stories and queries that are pinned for the current account.

A pinned item is an item that is displayed in a prominent way on the account web page.

### Order considerations

The order in which the pinned datasets are returned reflects the order in which they appear on the organization homepage (from top-left to bottom-right).

### Examples

The following snippet prints the names of the items that are pinned on the Triply account page:

```ts
const account = await triply.getAccount('Triply')
for await (const item of account.getPinnedItems()) {
  console.log((await item.getInfo()).name)
}
```

### See also

This method returns various types of objects. Each class has different functionalities:

- See class [Dataset](../dataset/index.md#dataset) for an overview of the methods for dataset objects.
- See class [Query](../query/index.md#query) for an overview of the methods for query objects.
- See class [Story](../story/index.md#story) for an overview of the methods for story objects.


## Account.getQuery(name: string)

Returns the TriplyDB query with the given `name`.

### Examples

The following snippet prints the query string for a query called `animal-gallery` that belongs to the account called `Triply`:

```ts
const account = await triply.getAccount('Triply')
const query = await account.getQuery('animal-gallery')
console.log((await query.getInfo()).requestConfig?.payload.query)
```

### See also

See class [Query](../query/index.md#query) for an overview of the methods for query objects.


## Account.getQueries()

Returns an [async iterator](../faq/index.md#what-is-an-async-iterator) over the accessible queries that belong to the account.

### Access restrictions

The iterator only includes datasets that are accessible for the current connection with a TriplyDB server:

- If no API token is configured, the iterator will include all and only public queries belonging to this account.

- If an API token is configured, the iterator will include all public and internal queries that belong to this account, and will include all private queries that belong to this account if the API token gives read access to the account.

### Examples

The following snippet prints the names of the queries that belong to the account called `Triply`:

```ts
const account = await triply.getAccount('Triply')
for await (const query of account.getQueries()) {
  console.log((await query.getInfo()).name)
}
```

### See also

See class [Query](../query/index.md#query) for an overview of the methods for query objects.


## Account.ensureStory(name: string, metadata: object)

Ensures the existence of a story with the given `name` and with the specified `metadata`, if given.

Calling this method ensures that the necessary changes (if any) are made in the connected-to TriplyDB server that result in an end state in which a story with the given `name` and `metadata` exists.

This method is useful in practice, because it removes the burden on the programmer to have to write custom code for checking for the existence of a story, and conditionally create a new story or make metadata changes to an existing story.

The changes made as a result of calling this method depend on the current state of the connected-to TriplyDB server:

- If this account does not yet have a story with the given `name`, then the behavior is identical to calling [`Account.addStory(name: string, metadata?: object)`](#accountaddstoryname-string-metadata-object) with the same arguments.
- If this account already has a story with the given `name` and with the same `metadata`, then this method returns that story.

### Optional

<dl>
  <dt><code>displayName</code></dt>
  <dd>Accepts a string value to be used as the display name for the story.</dd>

  <dt><code>accessLevel</code></dt>
  <dd>Accepts either of the following values: <code>'private'</code> (default), <code>'internal'</code>, <code>'public'</code>.</dd>

  <dt><code>content</code></dt>
  <dd>Accepts a list of StoryElementUpdate objects, defined below.</dd>
</dl>

**Note:**
If no `accessLevel` is specified, the default used is 'private'.

**Examples**

Example 1: To ensure a `Story` only requires a `name` of type string. It's access level will default to private

```ts
await someUser.ensureStory(`someStoryName`)
```

Example 2: Ensure a `Story` setting it's `accessLevel` and `displayName`.

```ts
await someUser.ensureStory(`someStoryName`, {
  accessLevel: 'public',
  displayName: `This is a Story`,
})
```


## Account.addStory(name: string, newStoryOptions?: object)

### Required

Adds and returns the TriplyDB story with the given `name`.

### Optional

The optional new story object that can be passed accepts the following properties:

<dl>
  <dt><code>displayName</code></dt>
  <dd>Accepts a string value to be used as a display name for the story</dd>

  <dt><code>accessLevel</code></dt>
  <dd>Sets the access level for the story. Accepts either of the following: <code>'private'</code> (default), <code>'internal'</code>, <code>'public'</code>.</dd>
</dl>

If **no** `accesslevel` is specified, the default value `private` is used.

**Examples**:

Example 1 - creates a newStory that is 'private'

```ts
const newStory = await someUser.addStory('name-of-story')
```

Example 2 - creates a newStory that is 'public'

```ts
const newStory = await someUser.addStory('name-of-story', {
  accessLevel: 'public',
})
```


## Account.getStory(name: string)

Returns the TriplyDB story with the given `name`.

### Examples

The following snippet prints the paragraphs in the story called `the-iris-dataset` that is published under the account called `Triply`. Stories are sequences of paragraphs and queries. This program prints the paragraphs in the sequence in which they appear in the story.

```ts
const account = await triply.getAccount('Triply')
const story = await account.getStory('the-iris-dataset')
```

### See also

See class [Story](../story/index.md#story) for an overview of the methods for story objects.


## Account.getStories()

Returns an iterator with the TriplyDB stories that belong to the account.

### Examples

The following snippet prints the names of the queries that belong to the Triply account:

```ts
const account = await triply.getAccount('Triply')
for await (const story of account.getStories()) {
  console.log((await story.getInfo()).name)
}
```

### See also

See class [Story](../story/index.md#story) for an overview of the methods for story objects.


## Account.pinItems(items: array[Dataset|Story|Query])

Pins the given datasets, stores, and/or queries to the home page of this account.

The pinned elements can be seen by people who visit the account online. They are also included in the account metadata.

```ts
const triply = App.get({ token: process.env.TOKEN })
const user = await triply.getUser()
const query = await user.getQuery('name-of-query')
const newStory = await user.getStory('name-of-story')
user.pinItems([query,newStory])
```


## Account.setAvatar(file: string)

Sets a new image that characterizes this account.

A circular version of this image is displayed inside the TriplyDB GUI. This image is also published as part of account metadata.

### Examples

The following snippet uploads the local image in file `logo.svg` and set it as the characterizing image for the Triply account:

```ts
const account = await triply.getAccount('Triply')
await account.setAvatar('logo.svg')
```


## Account.update(metadata: object)

Updates the metadata for this account.

To update the metadata profile with information within the metadata itself, we need the following steps:

1. Obtain the relevant piece of information as a variable/const: `getObject()`
2. Update the metadata profile with the obtained information stored in the variable/const: `update()`

**getObject()**
Define a constant (`const`) and assign it to `ctx.store.getObjects()`.
The arguments for the function will be the subject, predicate, and graph. The function retrieves the **object** so the other 3 parts of a quad need to be specified.

**update()**
Update the relevant part of the metadata profile with the corresponding piece of information. `.update({})`

**Example**
If one wants to update the _display name_ of a metadata profile with the object of the following triple within the metadata:
`<https://example.org/example> <https://schema.org/name> 'Example Name'@en`

```ts
async (ctx) => {
  // Fetch displayName
  const displayName = ctx.store
    .getObjects(
      'https://example.org/example',
      'https://schema.org/name',
      graph.metadata
    )
    .find(
      (node) => node.termType === 'Literal' && node.language === 'en'
    )?.value;

  // Specify the environment variable, if necessary
  const _dataset =
    process.env['MODE'] === 'Production'
      ? (await app.triplyDb.getOrganization(organization)).getDataset(dataset)
      : (await app.triplyDb.getUser()).getDataset(organization + '-' + dataset)

  // Update the display name
  if (displayName) await (await _dataset).update({ displayName })
};
```

The metadata object for accounts can include the following keys:

<dl>
  <dt><code>accountName</code></dt>
  <dd>The URL-friendly name of the account.</dd>

  <dt><code>name</code></dt>
  <dd>The human-readable display name of the account</dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the account.</dd>

  <dt><code>pinnedItems</code></dt>
  <dd>An array containing the pinned items (datasets, stories and queries) for the account.</dd>

  <dt><code>Email address</code></dt>
  <dd>The email address of the account.</dd>
</dl>
