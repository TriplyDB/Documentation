[TOC]

<!-- SOURCE: triply-db-getting-started/reference/index.md, the whole "Access Levels" section
     including its four subsections. Reused near-verbatim.

     Two HTML <figure> blocks were kept as HTML because they carry ids that other pages
     reference (#fig-access-level-control, #fig-access-level-dependencies). Their src paths
     were changed from ../../assets/ to ../assets/ for this folder's depth. The inline icon
     images in the tables were changed the same way. -->

# Access levels

TriplyDB uses access levels to determine who can access content.

Access levels can be specified for:

- Datasets, including everything at dataset level — metadata, settings, graphs and services
- Queries
- Stories
- Groups

They cannot be specified for users, including their metadata. That content is always publicly
accessible.

## The access level control

The access level control is available on the settings page for datasets, queries and stories, and
on the create dialog for those content types. The standard access level is always **Private**. An
explicit action is needed to set it to Internal or Public.

Groups behave differently: they are Public by default, and their access level is set through the
[API](../triply-api/index.md) or
[TriplyDB.js](../triplydb-js/group/index.md#groupupdatemetadata-object) rather than through this
control. See [Access levels for groups](#access-levels-for-groups).

<figure id="fig-access-level-control">
  <img src="../assets/access-level-control.png">
  <figcaption>Figure 1. The access level control for content in TriplyDB.</figcaption>
</figure>

## What each level means

For content that belongs to a user:

| **Icon** | **Access level** | **Meaning** |
| ---- | ---- | ---- |
| ![](../assets/private.png) | Private | Content is only accessible to you |
| ![](../assets/internal.png) | Internal | Content is accessible to anyone logged into the same TriplyDB environment |
| ![](../assets/public.png) | Public | Content is accessible to anyone on the Internet |

For content that belongs to a group:

| **Icon** | **Access level** | **Meaning** |
| ---- | ---- | ---- |
| ![](../assets/private.png) | Private | Content is only accessible to group members |
| ![](../assets/internal.png) | Internal | Content is accessible to anyone logged into the same TriplyDB environment |
| ![](../assets/public.png) | Public | Content is accessible to anyone on the Internet |

The difference is only in what Private means: for a user, yourself; for a group, its members.

## Access levels for groups

A group has an access level of its own, separate from the content it owns. It determines who can
find the group in the list of accounts and open its page:

| **Icon** | **Access level** | **Meaning** |
| ---- | ---- | ---- |
| ![](../assets/private.png) | Private | The group is only visible to its members |
| ![](../assets/internal.png) | Internal | The group is visible to anyone logged into the same TriplyDB environment |
| ![](../assets/public.png) | Public | The group is visible to anyone on the Internet |

Groups can be nested. Membership is inherited downwards, so a member of a group is also a member
of every subgroup below it, with the same role.

A newly created group is Public by default. A newly created subgroup instead takes the access
level of its parent. Changing a group's access level requires the "Manage group" permission — see
[Roles and permissions](roles-and-permissions.md) — and is done through the API or TriplyDB.js.

A group you are not allowed to see is indistinguishable from one that does not exist: opening its
page gives the same "not found" result. If you are a member of a group nested below it, you do see
its name and avatar — its name is part of your own group's name anyway — but not its members,
content or settings.

Two rules keep a group's access level consistent with its surroundings:

- **A group caps the content it owns.** Datasets, queries and stories owned by a group can never
  be more accessible than the group itself. Making a group stricter therefore fails while it
  still owns content that is more accessible; that content has to change first.
- **A subgroup can never be more accessible than its parent.** Making a parent stricter fails
  while it still has a more accessible subgroup.

## When access levels interact

Access levels for datasets, queries and stories can affect each other. A public query may use a
private dataset. Visitors who are not logged in can then see the query, its metadata and its query
string — but they will never receive query results from the private dataset. Private content stays
private.

A warning is shown when you introduce a dependency on content with a stricter access level, so you
can bring the levels into a consistent state.

<figure id="fig-access-level-dependencies">
  <img src="../assets/access-level-dependencies.png">
  <figcaption>Figure 2. A public query over a private dataset.</figcaption>
</figure>

## A working pattern

Access levels are often used in this sequence:

1. Create a dataset, query or story. It starts as **Private**.
2. As it progresses, set it to **Internal** to get feedback from colleagues.
3. When it is ready, set it to **Public** to publish it to the world.

