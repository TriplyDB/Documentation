# App

Instances of the `App` class are specific application connections that are set-up with a TriplyDB server.

Connections to TriplyDB servers can be created with and without setting an API token. When no API token is set, the connection can be used to perform read-only operations over public data. When an API token is set, the connection can be used to perform read/write operations over public/private data the API token grants access to.

The following snippet creates an instance of the `App` object that establishes read-only access to the TriplyDB server at <https://triplydb.com>:

```ts
import App from '@triply/triplydb'
const triply = App.get({ url: 'https://api.triplydb.com' })
```

Notice that the URL must point to the API of the TriplyDB server that the `App` object connects to. The API URL is typically created by adding the `api.` subdomain in front of the server's host name. For example, since [1] is the web-based GUI for the TriplyDB server, then [2] is the corresponding API for that instance.

```
[1] https://triplydb.com
[2] https://api.triplydb.com
```

When an API token is specified, the operations that can be performed through the `App` object are determined by:

1. The access level of the token: either “Read access”, “Write acces”, or “Management access”.
2. The credentials of the user account for which the API token is created. When a user is a member of an organization, she has access to all its datasets, stories, and queries; a user always has access to her own datasets, stores and queries.

The following token access levels are available:

1\. “Read access” allows:

   - Read operations over data with access level “Public”.

   - Read operations over data with access level “Internal”.

   - Read operations over data with access level “Private” that belongs to the user who created the token.

   - Read operations over data with access level “Private” that belongs to organizations to which the user who created the token is a member.

2\. “Write acces” allows:

   - All operations allows by “Read acces”.

   - Write operations over data that has access setting “Internal”.

   - Write operations over data 

3\. “Management access” allows the following operations to be performed: creating organizations, adding/removing members to/from organizations.

The following creates a `App` object with an API token that is made available through an environment variable (see section [Setting up a secure read/write project](/triplydb-js#setting-up-a-readwrite-project)):

```ts
import App from '@triply/triplydb'
const triply = App.get({ token: process.env.TOKEN })
```

It is typical for one TriplyDB.js script to have exactly one `App` object.


## App.getAccount(name?: string)

Returns the TriplyDB account with the given `name`.

If `name` is omitted, the TriplyDB account that is associated with the current API token is returned.

### Examples

- The following snippet returns the account called `'Triply'`.

```ts
const account = await triply.getAccount('Triply')
```

- The following snippet returns the current account. This is the account for which the currently configured API token was created.

```ts
const account = await triply.getAccount()
```

### See also

This method returns an account object. See class [Account](/triplydb-js/account#account) for an overview of the methods that can be called on such objects.

Class [Account](/triplydb-js/account#account) has two specializations: class [Organization](/triplydb-js/organization#organization) and class [User](/triplydb-js/user/#user). In line with these class specializations, there are also two method specializations:

- Method [`App.getOrganization(name: string)`](#appgetorganizationname-string) returns an organization object.

- Method [`App.getUser(name?: string)`](#appgetusername-string) returns a user object.


## App.getAccounts()

Returns an [async iterator](/triplydb-js/faq#what-is-an-async-iterator) over all accounts in the TriplyDB server.

### Example

- The following snippet prints the display names for all accounts in the TriplyDB server at <https://triplydb.com>:

```ts
const triply = App.get({ url: 'https://api.triplydb.com' })
for await (const account of triply.getAccounts()) {
  console.log((await account.getInfo()).name)
}
```

- The following snippet returns an array that contains all account objects:

```ts
console.log(await triply.getAccounts().toArray())
```

See class [Account](/triplydb-js/account#account) for an overview of the methods that can be used with account objects.


## App.getInfo()

Returns information about the TriplyDB server that the [`App`](#app) is connected to.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

### Examples

- The following snippet prints the contact email for the TriplyDB server:

```ts
console.log((await triply.getInfo()).contactEmail)
```

- The following snippet returns an object describing the used TriplyDB server:

```ts
console.log(await triply.getInfo())
```


## App.getOrganization(name: string)

Returns the TriplyDB organization with the given `name`.

This method is similar to [`App.getAccount(name?: string)`](#appgetaccountname-string), but differs in the following ways:

- This method only works for accounts that represent TriplyDB organizations.

- This method returns an organization object. Class [Organization](/triplydb-js/organization#organization) is a specialization of class [Account](/triplydb-js/account#account).

### Examples

The following snippet returns the organization called `'Triply'`:

```ts
const organization = await triply.getOrganization('Triply')
```

See class [Organization](/triplydb-js/organization#organization) for an overview of the methods that can be used with organization objects.

### Alternatives

This method is a shorthand for calling the following two methods:

- Call method [`App.getAccount(name?: string)`](#appgetaccountname-string) to retrieve an account object.

- Then call method [`Account.asOrganization()`](/triplydb-js/account#accountasorganization) to cast the account object into an organization object.

The following snippet returns the same result as the previous example, but uses two methods instead of one:

```ts
const account = await triply.getAccount('Triply')
const organization = account.asOrganization()
```

### See also

This method returns an organization object. See class [Organization](/triplydb-js/organization#organization) for an overview of the methods that can be called on such objects.


## App.getUser(name?: string)

Returns the TriplyDB user with the given `name`.

If `name` is omitted, the TriplyDB user that is associated with the current API token is returned. This only works if an API token is configured for the current [`App`](#app) object.

### Examples

The following snippet returns the user with name `'somebody'`:

```ts
const user = await triply.getUser('somebody')
```

The following snippet returns the user for whom the API token was created. This only works if an API token was configured when the [`App`](#app) object was created:

```ts
const me = await triply.getUser()
```

### Alternatives

This method is a shorthand for the following two methods:

1. Call method [`App.getAccount()`](#appgetaccountname-string) to retrieve an account object.

2. Then call method [`Account.asUser()`](/triplydb-js/account#accountasuser) to cast the account object into a user object.

The following snippet returns the same result as the previous examples, but uses two methods instead of one:

```ts
const account = await triply.getAccount('somebody')
const user = account.asUser()
```

### See also

This method returns a user object. See class [User](/triplydb-js/user#user) for an overview of the methods that can be called on such objects.


## App.isCompatibleWith(minimumVersion: string)

Succeeds if and only if the currently connected to TriplyDB server has a version that is identical to or higher than the given minimum version.

### Arguments

- Argument `minimumVersion` must be a string that uses Semantic Versioning. For example `'1.2.3'`.

### See also

To inspect the current version of the connected-to TriplyDB server, use [`App.getInfo()`](#appgetinfo).