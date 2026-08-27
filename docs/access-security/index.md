[TOC]

<!-- SOURCE: this index is new. It exists because four subjects were parked here during the
     restructure and needed one home. Its child pages are recycled material — see each page.

     Thirteen pages across triplydb/ and data-apps/ already link to this file, so it must
     stay at access-security/index.md. Image paths from this folder are ../assets/. -->

# Access and security

Who can see your content, what they are allowed to do with it, and how applications authenticate.
This section gathers material that applies across all of TriplyDB rather than to one product.

Three different mechanisms are easy to confuse, so it is worth separating them before you start:

| Question | Mechanism | Applies to |
| :---- | :---- | :---- |
| Who can *see* this? | [Access levels](access-levels.md) | Datasets, queries, stories, groups |
| What may a member *do*? | [Roles and permissions](roles-and-permissions.md) | Members of a group |
| How does my script log in? | [API tokens](api-tokens.md) | Applications and pipelines |
| Who can get an account at all? | [Accounts and authentication](accounts-and-authentication.md) | The whole instance, administrators only |

Access levels control visibility. Roles control actions. The two are independent: a role never
makes content visible that its access level hides, and an access level never grants a member
permission to change something.

## In this section

- **[Access levels](access-levels.md)** — Private, Internal and Public; what each means for
  personal and group content; how levels interact when a public query reads a private dataset;
  and the private-to-internal-to-public workflow.
- **[Roles and permissions](roles-and-permissions.md)** — the `owner` and `member` system roles,
  custom roles built from individual permissions, and how roles are assigned.
- **[API tokens](api-tokens.md)** — creating a token, choosing its permissions, and the rule that
  a token can never exceed what you can already do yourself.
- **[Accounts and authentication](accounts-and-authentication.md)** — for administrators:
  sign-up restrictions, permitted email domains, and creating user accounts.

## Elsewhere

| Subject | Where |
| :---- | :---- |
| Making a single dataset public | [Publish data](../triplydb/How-to/publish-data.md) |
| Instance-wide administrator settings | [Administrator settings](../triplydb/How-to/admin-settings.md) |
| Group membership programmatically | [TriplyDB.js `Group`](../triplydb-js/group/index.md) |
| Authenticating HTTP requests | [Triply API](../triply-api/index.md) |

