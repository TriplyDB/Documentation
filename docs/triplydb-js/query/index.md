[TOC]

# Query

A Saved Query is a versioned SPARQL query with its own URL. Using this URL,
users are able to view any version of the query and its results. It can also be
used to run the query and retrieve the results from a browser or a program,
removing the hassle of figuring out how to run a SPARQL query.

Saved queries come with a RESTful API that can be configured with the use a SPARQL API variables.


## Query.delete()

Permanently deletes this query and all of its versions.


## Query.getInfo()

The returned dictionary object includes the following keys:

<dl>
  <dt><code>accessLevel</code></dt>
  <dd>
    <p>The access level of the query. The following values are possible:</p>
    <dl>
      <dt><code>'private'</code> (default)</dt>
      <dd>The dataset can only be accessed by organization members.</dd>
      <dt><code>'internal'</code></dt>
      <dd>The dataset can only be accessed by users that are logged into the TriplyDB server.
      <dt><code>'public'</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
  </dd>

  <dt><code>autoselectService</code></dt>
  <dd>Whether the SPARQL service is automatically chosen (<code>true</code>), or whether a specific SPARQL service is configured (<code>false</code>).</dd>

  <dt><code>createdAt</code></dt>
  <dd>The date/time at which the query was created.</dd>

  <dt><code>dataset</code></dt>
  <dd>A dictionary object representing the dataset against which the query is evaluated.</dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the query. This typically explains what the query does in natural language.</dd>

  <dt><code>displayName</code></dt>
  <dd>The human-readable name of the query. This name may include spaces and other characters that are not allowed in the URL-friendly name.</dd>

  <dt><code>name</code></dt>
  <dd>The URL-friendly name of the query that is used in URL paths. This name can only include ASCII letters and hyphens.</dd>

  <dt><code>numberOfVersions</code></dt>
  <dd>The number of currently stored versions of this query.</dd>

  <dt><code>owner</code></dt>
  <dd>A dictionary object representing the account (organization or user) to which the query belongs.</dd>

  <dt>🚧<code>link</code></dt>
  <dd>Stores part of the URL to run the query. Please use <a href='#querygetrunlink'><code>Query.getRunLink()</code> </a> to obtain the full URL to run the query.</dd>

  <dt><code>service</code></dt>
  <dd>The location of the SPARQL endpoint that is used to run the query.</dd>

  <dt><code>updatedAt</code></dt>
  <dd>The date/time at which the query was last modified.</dd>
</dl>


## Query.getString(apiVariables?: object)

Returns the query string of the current version of this query.

Optionally, arguments can be specified for the API variables to this query.

### Examples

The following code stores the SPARQL query string for the `query` object:

```ts
const queryString = await query.getString()
```


## Query.addVersion(metadata: object)

Adds a new version to the query used. It requires similar options to that of <code>`Query.addQuery`</code>.

### Arguments

At least one of the following arguments is required to create a new version. Any argument not given will be copied from the previous version of that query.

<dl>
  <dt><code>queryString: string</code> </dt>
  <dd>the SPARQL compliant query as a string value</dd>

  <dt><code>output: string</code></dt>
  <dd>The visualization plugin that is used to display the result set. If none is set it defaults to <code>'table'</code>. Other options may include: <code>'response'</code>, <code>'geo'</code>, <code>'gallery'</code>, <code>'markup'</code>, etc. Output will take priority over ldFrame</dd>

  <dt><code> ldFrame: object</code></dt>
  <dd>JSON LD frame object used to transform plain JSON LD into a framed JSON. Will be used only if an output is not provided.</dd>

  <dt><code>variables: Variable[]</code></dt>
  <dd>
    <p>A list of objects with the following keys:</p>
    <dl>
      <dt>IRI variable</dt>
      <dd>An object of the form `Variable`
      (see  <a href="../account/index.md#accountaddqueryname-string-metadata-object">Account.addQuery()</a>)
      </dd>
  </dd>
</dl>

* You can see how many versions exist on a query accessing [`Query.getInfo().numOfVersions`](#querygetinfo)
* You can use a specified version of a query accessing [`Query.useVersion(x: number)`](#queryuseversionversion-numberlatest)


## Query.getRunLink()

Returns the URL link to run the query.
It currently does not support the use of variables.


## Query.results(apiVariables?: object, options?: object)

`Query.results()` function will automatically return all the results from a saved query. You can retrieve both results from a `select` or `ask` query and a `construct` or `describe` query. The results are returned as an `async iterator`.

If there are more than 10 000 query results, they could be retrieved using [pagination with TriplyDB.js](../../triply-db-getting-started/saved-queries/index.md#pagination-with-triplydbjs).

### Examples

Get the results of a query by setting a `results` variable. More specifically, for construct queries you use the `statements()` call:

```ts
const triply = App.get({token: process.env.TOKEN})
const account = await triply.getAccount('account-name')
const query = await account.getQuery('name-of-some-query')

// For select queries you use the `statements()` call:
const results = query.results().statements()
// For select queries you use the `bindings()` call:
const results = query.results().bindings()
```

Additionally, saved queries can have 'API variables' that allow you to specify variables that are used in the query. Thus, if you have query parameters, pass their values as the first argument to `results` as follows:

```ts
const triply = App.get({token: process.env.TOKEN})
const account = await triply.getAccount('account-name')
const query = await account.getQuery('name-of-some-query')
// For SPARQL construct queries.
const results = query.results({
 someVariable: 'value of someVariable',
 anotherVariable: 'value of anotherVariable'
}).statements()
// For SPARQL select queries.
const results = query.results({
 someVariable: 'value of someVariable',
 anotherVariable: 'value of anotherVariable'
}).bindings()
```


## Query.update(metadata: object)

Updates the metadata for the saved query. This does not result in a new query version. It requires similar options to that of <code>`Query.addQuery`</code>.

### Arguments

At least one of the following arguments is required to update the metadata. Any argument given will be copied from the previous version of that query.

<dl>
  <dt><code>accessLevel</code></dt>
  <dd>
    <p>The access level of the query. The following values are possible:</p>
    <dl>
      <dt><code>'private'</code> (default)</dt>
      <dd>The dataset can only be accessed by organization members.</dd>
      <dt><code>'internal'</code></dt>
      <dd>The dataset can only be accessed by users that are logged into the TriplyDB server.
      <dt><code>'public'</code></dt>
      <dd>The dataset can be accessed by everybody.</dd>
    </dl>
  </dd>

  <dt><code>autoselectService</code><dt>
  <dd>Whether the SPARQL service is automatically chosen (<code>true</code>), or whether a specific SPARQL service is configured (<code>false</code>).</dd>

  <dt><code>dataset</code></dt>
  <dd>A dictionary object representing the dataset against which the query is evaluated.</dd>

  <dt><code>description</code></dt>
  <dd>The human-readable description of the query. This typically explains what the query does in natural language.</dd>

  <dt><code>displayName</code></dt>
  <dd>The human-readable name of the query. This name may include spaces and other characters that are not allowed in the URL-friendly name.</dd>

  <dt><code>name</code></dt>
  <dd>The URL-friendly name of the query that is used in URL paths. This name can only include ASCII letters and hyphens.</dd>

  <dt><code>preferredService</code></dt>
  <dd>If the <code>autoselectService</code> is not selected the user can set the preferred service.</dd>
</dl>


## Query.useVersion(version: number|'latest')

A saved query is saved with a version number. Each time the query or the visualization changes the version number is incremented with one. When you want to retrieve a saved query with a particular version you need the `useVersion` function. The function returns the query object corresponding to that version of the query. If you want to use the latest version of the query you need to set the version argument to `'latest'`.

### Example

```ts
const user = await triply.getAccount('my-account')
const query = await user.getQuery('my-query')
const query_1 = await query.useVersion(1)
```

## Query.copy(queryName?: string, account?:object, metadataToReplace?: object)

Copies a query using either the same name or a new name (if <code>queryName</code> is provided) to the current account or a new account (if <code>accountName</code> is provided) with the same metadata or overwritten metadata (if <code>metadataToReplace</code> is provided)

### Arguments

<dl>
  <dt><code>queryName</code></dt>
  <dd>
    <p>An optional parameter. The new URL-friendly name given to the duplicated query that is used in URL paths. This name can only include ASCII letters and hyphens. Defaults to the original query name.</p>
  </dd>

   <dt><code>account</code></dt>
  <dd>
    <p>An optional parameter.Expected to be either an User or an Organization object if provided. The new account to which the query will be copied to. Defaults to the current account</p>
  </dd>

  <dt><code>metadataToReplace</code><dt>
  <dd>
    <p>An optional metadata object with optionl properties that can be provided to override any of the existing metadata of the duplicated query if required</p>
    <dl>
      <dt><code>accessLevel</code></dt>
      <dd>
        <p>The access level of the query. The following values are possible:</p>
        <dl>
          <dt><code>'private'</code> (default)</dt>
          <dd>The dataset can only be accessed by organization members.</dd>
          <dt><code>'internal'</code></dt>
          <dd>The dataset can only be accessed by users that are logged into the TriplyDB server.
          <dt><code>'public'</code></dt>
          <dd>The dataset can be accessed by everybody.</dd>
        </dl>
      </dd>
      <dt><code>queryString: string</code></dt>
      <dd>the SPARQL compliant query as a string value</dd>
      <dt><code>output: string</code></dt>
      <dd>The visualization plugin that is used to display the result set. If none is set it defaults to <code>'table'</code>. Other options may include: <code>'response'</code>, <code>'geo'</code>, <code>'gallery'</code>, <code>'markup'</code>, etc</dd>
      <dt><code>dataset: object</code></dt>
      <dd>A dictionary object representing the dataset against which the query is evaluated.</dd>
      <dt><code>description: string</code></dt>
      <dd>The human-readable description of the query. This typically explains what the query does in natural language.</dd>
      <dt><code>displayName: string</code></dt>
      <dd>The human-readable name of the query. This name may include spaces and other characters that are not allowed in the URL-friendly name.</dd>
      <dt><code>variables: Variable[]</code></dt>
      <dd>
        <p>A list of objects with the following keys:</p>
        <dl>
          <dt>IRI variable</dt>
          <dd>An object of the form `Variable`
          (see  <a href="../account/index.md#accountaddqueryname-string-metadata-object">Account.addQuery()</a>)
          </dd>
      </dd>
      <dt><code>serviceType: string</code>("speedy" | "virtuoso" | "jena" | "blazegraph" | "prolog")</dt>
      <dd>The SPARQL service type the duplicated query needs to be configured to</dd>
    </dl>
  </dd>
</dl>

### Example

```ts
const user = await triply.getAccount('my-account')
const query = await user.getQuery('my-query')
const query_1 = await query.useVersion(1)
const orgAccount = await triply.getAccount('org-account');

// Within the same account under a new name
const duplicatedQuery_1 = await query.copy('newDuplicateQuery')
// To a new account with some metadata overwritten using the same query name
const duplicatedQuery_2 = await query.copy(undefined, orgAccount , {
  description: 'newDescription',
  displayName: 'newDisplayName'
})
```
