[TOC]

<!-- SOURCE: triply-db-getting-started/data-stories/index.md — the menu list under "Editing a
     data story", turned into a table, plus the element types from "Adding elements".
     The TriplyDB.js row points at triplydb-js/story/index.md, which is out of scope for this
     restructure and stays where it is. -->

# Reference

Look-up material for data stories. For procedures, see the
[how-to guides](../how-to/index.md).

## The story menu

Reached from the menu button in the top-right corner of a story.

| Option | What it does |
| :---- | :---- |
| Story settings | Change the title and the access level |
| Change banner | Choose the image shown at the top of the story. Wide images work best |
| Copy | Copy the story to a different user or group |
| Transfer | Move the story to a different user or group |
| Embed | HTML for embedding the story in a web page using an iFrame |
| Print | Print dialog and options |
| Delete | Delete the story |

## Element types

| Type | Contains | Notes |
| :---- | :---- | :---- |
| Paragraph | Markdown text | Rendered as HTML, previewable. Supports images and syntax-highlighted code blocks |
| Existing query | A reference to a saved query | Optional version selector and caption |
| New query | A query created from within the story | Not documented — see the review block |

## Markdown in paragraphs

Paragraph text is Markdown compliant and rendered as HTML. Syntax highlighting is available for
the common linked data and programming languages. For which Markdown TriplyDB supports and where
else it applies, see [Markdown support](../../../triplydb/Reference/markdown.md).

## Elsewhere

| Subject | Where |
| :---- | :---- |
| Creating, deleting and reading stories programmatically | [TriplyDB.js `Story`](../../../triplydb-js/story/index.md) |
| The saved queries a story's elements point at | [Saved queries](../../saved-queries/overview/index.md) |
| Access levels | [Access and security](../../../access-security/index.md) |

