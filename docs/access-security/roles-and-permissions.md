[TOC]

<!-- SOURCE: a merge of two places that both documented roles —
       - triply-db-getting-started/reference/index.md, the "Roles" section
       - triply-db-getting-started/admin-settings-pages/index.md, the "Roles page" section
     The two overlapped almost completely; the admin page had the creation procedure, the
     reference page had the framing. Merged here with the procedure kept intact.
     The typo "Create rols" in the source has been corrected to "Create role". -->

# Roles and permissions

TriplyDB uses roles to control what actions group members can perform. Where
[access levels](access-levels.md) control *who can see* content, roles control *what actions*
members may take within a group.

Roles only apply to group members. Personal user accounts are not affected by them.

## System roles

Two built-in roles are always available and cannot be deleted:

| **Role** | **What it allows** |
| :---- | :---- |
| `owner` | Full access to all account resources and settings, including managing members and their roles |
| `member` | Can manage resources — datasets, queries, stories — but cannot manage members or delete the group |

## Custom roles

Administrators can create roles with any subset of permissions, so a group can grant exactly the
access each member needs. A custom role might allow read access to all datasets without the
ability to create new ones, or write access without the ability to manage SPARQL services.

To create one:

1. Open **Admin settings** from the user menu in the top-right corner, then the **Roles** tab.
2. Click **Create role**.
3. Enter a name and description. The name should make the purpose obvious.
4. Select the permissions the role should have. Each permission describes the action it allows.
   Use the category filters and the search field to find specific ones.
5. Click **Create**.

Custom roles can be edited or deleted at any time from the roles page.

## Assigning roles

Roles are assigned in the member settings of each group. Members with sufficient permissions —
owners, for instance — can assign roles to others. To do it programmatically, see
[`Group.addMember()`](../triplydb-js/group/index.md#groupaddmemberuser-user-role-role).

Remember that membership is inherited: a member of a group is also a member of every subgroup
below it, carrying the same role.

## Permissions and API tokens

API token permissions follow the same model. A token is configured with individually selectable
permissions, and can never grant more than you already have through the interface. See
[API tokens](api-tokens.md).

