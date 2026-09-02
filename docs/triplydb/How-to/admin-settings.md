[TOC]

<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet
     <!- - PARKED - ->        section held for the Access & security chapter

     ORIGIN: triply-db-getting-started/admin-settings-pages/index.md, minus four
     sections that go elsewhere:
       - Services page          -> triplydb/how-to/manage-services.md (done)
       - Setting Authentication -> _parked/access-security/
       - Roles page             -> _parked/access-security/
       - Account overview page  -> _parked/access-security/
     The source page still holds the only copy of those three sections — see the
     review block. Redirect at cutover. -->

# Administrator settings

Administrator tasks are performed from the admin settings pages, reached through
the user menu in the top-right corner. You need administrator privileges to open
them.

<!-- SOURCE: admin-settings-pages/index.md — Overview page, Settings page,
     Datasets page and Redirects page, with their subsections. -->

This guide covers the instance overview, the instance-wide settings, the datasets
table and redirects. Two further admin areas are documented separately:

- Services are in [Manage services](manage-services.md).
- Authentication, roles and user accounts are in
  [Access and security](../../access-security/index.md).
  <!-- PARKED: those three sections stay in the source page until the Access &
       security chapter is built. Link points at the chapter index for now. -->

## Overview page

The overview page opens first and gives the instance's important statistics,
including how close it is to any configured limits.

Where no limit is set, a statistic appears as a plain counter. Where a limit is
set, it appears as a gauge whose colour shows the distance to that limit: green
is comfortable, orange is close, red is over.

### General overview

Shows the software versions the instance is running. An instance has two parts —
the **console**, which is the web interface, and the **API**, which sits between
the console and the data. They are separate Docker images, so each has its own
version number and build date. The section also gives the moment the images were
started and last updated.

### Accounts overview

How many groups and users the instance has, as counters or gauges depending on
whether limits are set.

### Data overview

Five figures: the number of datasets, the number of graphs, the number of
statements across all graphs, and then the number of *unique* graphs and *unique*
statements.

The distinction matters. Copying a graph from one dataset to another does not
change the data, so the unique figures are the more honest measure of how much
data the instance actually holds.

### Services overview

The total number of services and the total number of statements across them,
followed by a pair of counters for each service type.

<!-- The source labels this section "The data overview shows..." — copied from the
     section above it. Corrected here. -->

## Settings page

The settings page is where an administrator makes instance-wide changes.

Each of the settings below is reached the same way: open **Admin settings** from
the user menu, then the **Settings** tab. The sections that follow describe only
what to do once you are there.

<!-- NEW: the paragraph above. The source repeats the same two-step navigation
     instruction at the head of all six subsections, once each. Stating it once
     removes about 150 words of repetition without losing anything. -->

### Site logos and banner

Under "Site logos" and "Site banner":

- The **logo** must be SVG, and is preferably square. It is displayed at 30×30 px.
- The **banner** can be any format, though WEBP is preferred. Its resolution
  should be between 1920×500 and 4000×500, and it is displayed 500 px high. An
  image narrower than the browser window is stretched.
- Neither file may exceed 5 MB.

### Site metadata

Navigate to "Site metadata".

![The site metadata settings](../../assets/metadata-settings.png)

Four fields: **name**, which appears in the browser tab; **welcome text**, which
appears on the instance homepage; and **tagline** and **description**, which serve
metadata purposes such as findability and website previews.

### Contact email

Navigate to "Contact Email" and set the address for the instance.

### Example datasets

Example datasets appear on the front page of the instance, to give visitors
something to look at and interact with. Open datasets are the usual choice.
Internal and private datasets can be listed too, but only appear to visitors who
have the right of access.

Navigate to "Example datasets", where you can:

- **Reorder** them by dragging the three horizontal lines in front of a dataset
  name.
- **Add** one by typing in the search field below the list and selecting a
  dataset.
- **Remove** one with the `x` to the right of its name.

### Starter dataset

The starter dataset is a beginner-friendly dataset offered to users who have not
yet created one of their own. It appears on their account page with the option to
import a copy, and disappears once they have a dataset.

Navigate to "Starter dataset" and search for the dataset you want to use.

**The starter dataset must be public.** If it is not, new users will see nothing
and will have to create a dataset themselves.

### Site-wide prefixes

A site-wide prefix is defined once and applies across every dataset on the
instance whose IRIs match it.

Navigate to "Site-wide prefixes", where you can:

- **Edit** an existing prefix — the label in the first field, the IRI in the
  second — then press `UPDATE PREFIXES`.
- **Add** one by filling the empty label and IRI fields at the bottom of the list,
  then pressing `UPDATE PREFIXES`.
- **Remove** one with the `x` to the right of its name.

See [Linked data](../../academy/linked-data.md#namespaces-and-prefixes) for what a
prefix is.

## Accounts page

The accounts page governs every account on the instance: a paginated table with
filters, sorting and a wildcard search field on the right. It sorts by creation
date, newest first.

| Column | Shows |
| --- | --- |
| Name | The account name, linking to the account. Sortable and filterable |
| Type | Group or User. Filterable, or All |
| Display name | The unrestricted name, not used as a URL. Sortable and filterable |
| Email | The account's email address. Sortable and filterable |
| Created at | How long ago it was created; hover for the exact moment |
| Updated at | How long ago its metadata last changed, such as display name or password |
| Last activity | How long ago the account was last active |
| Role | light, regular or administrator. Filterable, or All |
| Verified | Whether the user has confirmed their account. Users only |
| Disabled | Whether the account has been disabled |
| Legal consent | Whether the user has accepted the legal terms. Users only |

One action is available per row: the cogwheel button opens that account's
settings directly.

For creating users, sign-up restrictions and what the account states mean, see
[Accounts and authentication](../../access-security/accounts-and-authentication.md).


## Datasets page

The datasets page governs every dataset on the instance: a paginated table with
filters, sorting and a wildcard search field on the right. It sorts by creation
date, newest first.

<!-- The source calls this "The account page governs all the datasets of an
     instance", which is the wrong noun. Corrected here. -->

| Column | Shows |
| --- | --- |
| Name | The dataset name, linking to the dataset. Sortable and filterable |
| Access level | Public, Internal or Private |
| Display name | The unrestricted name, not used as a URL. Sortable and filterable |
| Owner | The dataset's owner, linked |
| Graph count | Graphs in the dataset. Filtered with a slider |
| Statement count | Statements across all its graphs. Filtered with a slider |
| Service count | Services on the dataset. Filtered with a slider |
| Asset count | Assets in the dataset. Filtered with a slider |
| Created at | How long ago it was created; hover for the exact moment |
| Updated at | How long ago its metadata or data last changed |
| Last graph edit | How long ago a graph was uploaded, removed or renamed |

One action is available per row: the cogwheel button opens that dataset's
settings directly.

## Services page

The services page governs every service on the instance: a paginated table with
filters, sorting and a wildcard search field on the right. Services in an error
state are sorted to the top, so problems are visible without searching for them.

| Column | Shows |
| --- | --- |
| Name | The service name, linking to the service. Sortable and filterable |
| Type | Virtuoso, Jena, Blazegraph, Prolog or Elasticsearch. Filterable, or All |
| Status | Starting, Running, Stopped, Updating or Error. Filterable, or All |
| Statements | Statements loaded in the service. Filtered with a slider |
| Loaded graphs | Graphs loaded in the service |
| Dataset | The dataset the service belongs to, linked. Filterable |
| Owner | The dataset's owner, linked. Filterable |
| Created | How long ago it was created; hover for the exact moment |
| Last queried | How long ago it was last queried; hover for the exact moment |
| Auto stops | How long until the service auto-stops. Some services free up memory when they go unqueried; the timer resets on every use |
| Version | The service's version. Services are not updated automatically, because updating can cause downtime |

Five actions are available per row:

| Action | Where |
| --- | --- |
| Update | An orange arrow appears below a service when a newer version exists |
| Additional information | The `i` button — graphs in the dataset, and the raw service metadata |
| Inspect the logs | The text button |
| Synchronize | Brings the service back in step with its dataset when the two have diverged |
| Remove | Deletes the service |

Doing these one at a time is slow. The tickbox on the left of the table selects
every service matching the current search, or all of them when no search is
active, so you can remove or update them in one go.

For services on a single dataset, see
[Manage services](manage-services.md).

## Redirects page

IRIs are meant to be visited — you follow one and find information about the
thing it names. Sometimes the data is not where the IRI points. The IRI might be
`https://example.org/resource/Amsterdam` while the data lives in
`https://api.triplydb.com/MyAccount/myCities`.

Redirects bridge that gap, sending a visitor from the IRI to wherever the data
actually is.

### Set up dereferencing

To dereference `https://example.org/resource/Amsterdam` into the dataset
`https://api.triplydb.com/MyAccount/myCities`:

1. **Point the external web server at the redirect API.** Configure
   `https://example.org` so that everything under `/resource` is redirected to
   `https://api.triplydb.com/redirect/$requestUri`. A request for
   `https://example.org/resource/Amsterdam` then arrives at
   `https://api.triplydb.com/redirect/https://example.org/resource/Amsterdam`.

2. **Add a rule on the redirects page.** Press `ADD RULE`, choose a prefix rule
   matching `https://example.org/resource/City/`, give it the dataset to redirect
   to, and press `CREATE RULE`.

Rules are evaluated top to bottom — highest priority first — and the first match
wins.

Two kinds of rule are supported:

| Rule type | Triggers when |
| --- | --- |
| Prefix | The start of a resource matches the given string |
| Regex | A resource matches a regular expression |

## Related

- [Manage services](manage-services.md) — the instance-wide services page
- [Access and security](../../access-security/index.md) — authentication, roles and
  user accounts
- [Publish data](publish-data.md) — the per-dataset settings an administrator can
  reach from the datasets table
