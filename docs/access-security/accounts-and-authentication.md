[TOC]

<!-- SOURCE: triply-db-getting-started/admin-settings-pages/index.md — the "Setting
     Authentication" subsection of the Settings page, and the account-creation parts of the
     "Account overview page" section.

     The bulk of the Account overview section is a column-by-column description of the admin
     accounts table. That is administrator-settings material rather than security material and
     is deliberately NOT moved here — see the review block. The <dl> lists in the source were
     converted to prose and tables. -->

# Accounts and authentication

Administrator material: who can create an account on a TriplyDB instance, and how accounts are
created and managed. Everyday users need [access levels](access-levels.md) or
[API tokens](api-tokens.md) instead.

## Restricting who can sign up

Part of an administrator's job is making sure only the right people can sign up. Authentication
settings block sign-ups that should not be allowed.

1. Open **Admin settings** from the user menu in the top-right corner, then the **Settings** tab.
2. Go to **Authentication**.

There you can choose whether people may register with a password, or only with a Google or GitHub
account.

When password sign-up is enabled, you can also set the permitted sign-up domains. Only people
whose email address matches one of those domains can register. Wildcards are allowed and domains
are comma separated:

```
mydomain.com,*.mydomain.com
```

## Account types

| **Icon** | **Account type** |
| ---- | ---- |
| ![](../assets/organization.png) | group |
| ![](../assets/user.png) | user |

## Create a user

Only administrators can create users.

1. Open **Admin settings**, then the **Accounts** tab. This lists all users and groups on the
   instance.
2. Click **Add user**.
3. Fill in the user name and email address. The user name must consist of alphanumeric characters
   (`A-Za-z`) and hyphens (`-`).
4. Click **Add user**.

This sends an account creation email containing a link that lets the new user log in.

Two options change that default:

- **Temporary account.** Accounts do not expire by default. Set a date in the **Account
  expiration date** field to create one that does.
- **Preset password.** By default the user sets their own password after following the link in
  the account creation email. If you enter a password in the **Password** field, they must use
  that password to log in the first time.

## Account states

An account carries three states an administrator can see and change from the accounts table:

- **Verified** — the user has clicked the link in their verification email, or an administrator
  has verified them in the account settings. Only users need verification.
- **Disabled** — set by the user in their own settings, or by an administrator in the account
  settings.
- **Legal consent** — accepted by the user when creating the account or later in user settings.
  Only users need to accept it.

Accounts also carry an instance-level role: `light`, `regular` or `administrator`.

