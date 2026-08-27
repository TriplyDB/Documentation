[TOC]

<!-- SOURCE: triply-db-getting-started/data-stories/index.md — sections "Creating a data
     story" and "Adding elements" (both sub-sections), rewritten as numbered steps.
     Three of the five images from that page are used here; the other two go to how-to/.
     Image paths assume this file sits three levels deep, at data-apps/stories/getting-started/. -->

# Getting Started

By the end of this page you have a data story containing a paragraph of text and a live query
result, and you know how to switch between editing it and seeing what your readers will see.

To create a story you need a TriplyDB account. To add a query element you also need at least one
[saved query](../../saved-queries/overview/index.md) — either your own or one shared with you.

## Step 1 — Open the stories tab

Go to the **stories** tab in TriplyDB. If you have made stories before, they are listed here. If
this is your first, the page is empty apart from the create button.

## Step 2 — Create the story

Click **Create story**. A form opens.

![The form for adding a new story](../../../assets/Create-datastory-UI-2.png)

Fill in the title and set the access level. Click **Create story**.

Access level is worth a moment's thought now rather than later: it decides who can open the story
at all, and a story left private cannot be shared or embedded.

You are taken to the new story, ready to customise.

## Step 3 — Find your way around

In the top-right corner is a menu button holding everything you can do to the story as a whole —
settings, banner, copy, transfer, embed, print and delete. See
[the story menu](../reference/index.md#the-story-menu) for what each one does.

In the bottom-right corner is a button with a notepad on it. This toggles between the **edit
view**, where you build the story, and the **reader view**, which is how your readers will see
the page.

![The stories interface, in edit view](../../../assets/My-first-story-UI.png)

## Step 4 — Add a query element

Click **+ Add new element**. A form opens where you choose what kind of element to add: a
paragraph of text, an existing SPARQL query, or a new one.

Choose an existing query. Search for it by name in the query search bar and select it. Optionally
select the version of the query, and set a caption. Click **Create story element**.

![The form for adding a new query element](../../../assets/Add-new-story-element-query-UI.png)

The query result now appears in your story. It is live — it re-runs whenever the story is opened.

## Step 5 — Add a paragraph

Click **+ Add new element** again and choose a paragraph this time.

Paragraph text is Markdown, rendered as HTML, and you can preview it before saving. Images are
supported, as are code blocks with syntax highlighting for the common linked data and programming
languages.

## Step 6 — Check the reader view

Use the notepad button in the bottom-right corner to switch to reader view. This is what someone
opening your story will see — without the editing controls, and with the query results freshly
run.

## What you now have

A story with two elements, one of them live. This is the whole pattern: add elements, order them,
write around the results.

From here:

- [Share or embed your story](../how-to/share-and-embed.md) — including the access level change
  that has to happen first.
- [How-to guides](../how-to/index.md) — banner, copying, transferring, printing, deleting.
- [Concepts](../concepts/index.md) — how stories, elements and saved queries relate.

