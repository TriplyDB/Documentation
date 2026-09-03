<!-- PROVENANCE KEY (delete this block before publishing)
     <!- - SOURCE: x - ->     text recycled from an existing page, path given
     <!- - NEW: x - ->        written for this page, with the reason
     <!- - LINK-TODO - ->     link target does not exist yet

     ORIGIN: this page is triply-db-getting-started/publishing-data/index.md
     (titled "Sharing data"), minus the two services sections, which move to
     triplydb/how-to/manage-services.md. Redirect required — see the review block. -->

# Publish data

Publishing a dataset in TriplyDB means two things: deciding who can see it, and
describing it well enough that people and machines can make sense of it once they
find it.

<!-- SOURCE: publishing-data/index.md — the whole of this page except "Starting
     services" and "Existing services". -->

## Make a dataset public

Set the visibility to "Public" in the dataset settings. A public dataset:

1. Can be found and visited by anybody on the web.
2. Is indexed by web search engines, including Google Dataset Search.
3. Exposes any running services to anybody on the web — SPARQL, text search and
   Linked Data Fragments alike.

Point 3 is the one to think about. Publishing the dataset publishes its query
services with it.

<!-- NEW: the closing sentence. The source lists the three consequences flatly;
     the third has different implications from the first two and is worth
     separating. -->

See [Access and security](../../access-security/index.md) for the full set of
access levels.
<!-- LINK-TODO: points at the chapter index for now. Refine to the specific
     access-levels page once that chapter is written.
     Original link: ../reference/index.md#access-levels -->

## The dataset settings page

Open any dataset and choose the last item in the left-hand menu.

![The homepage of a dataset](../../assets/dataset-homepage.png)

The settings page holds:

- [Update dataset profile](#update-the-dataset-profile)
- Prefixes
- Transfer ownership
- [Delete dataset](#delete-a-dataset)
- [Webhooks](#webhooks)

<!-- The source page carries unresolved TODOs against Prefixes, Transfer ownership
     and Delete dataset — listed but documented nowhere on the site. "Delete a
     dataset" is now drafted below and needs verification. Prefixes and Transfer
     ownership still need writing; see the review block. -->

### Update the dataset profile

![The "Update dataset profile" pane](../../assets/update-dataset-profile-pane.png)

This pane configures two things: the dataset access level, and the dataset
metadata described below.

### Dataset metadata

Metadata is worth the few minutes it takes. It makes a dataset findable later,
and it lets search engines and social media applications present it sensibly.

The following can be set:

- Dataset name
- Dataset slug
- Dataset description
- Example resources
- License
- Avatar

Inside the TriplyDB instance, this makes the dataset findable: it will appear as
a search result when someone searches for one of its topics, or types a word that
occurs in its description.

![The homepage of a dataset with metadata configured](../../assets/dataset-homepage-with-metadata.png)

Outside the instance, search engines and chat applications read the same
metadata. Pasting a link to a public dataset into Slack, for example, generates a
widget from the title, description and image. Different applications use
different properties.

![A dataset widget in the Slack chat application](../../assets/slack-widget.png)

### Delete a dataset

<!-- NEW: this entire section. Nothing in the repository documents deleting a
     dataset — it is a bare list item with a TODO. Every factual claim below needs
     checking against the product before this is published; see the review block.
     Written because deletion is irreversible and undocumented, which is the worst
     combination in a settings page. -->

Deleting a dataset is permanent. There is no undo and no recycle bin, and the
graphs, the assets and the running services go with it.

Three things are worth doing first.

1. **Export what you want to keep.** See [Export data](export-data.md). Once the
   dataset is gone, so is the only copy TriplyDB holds.
2. **Check what points at it.** Saved queries and stories built on this dataset
   stop working, as do any datasets elsewhere that imported graphs from it. Those
   references are not removed for you and will fail rather than disappear.
3. **Consider whether the IRIs are public.** If the dataset has been published,
   other people's data may link to its IRIs, and any redirects configured for
   dereferencing will resolve to nothing.

If the dataset merely needs to leave your account rather than cease to exist, use
**Transfer ownership** instead.

To delete, open the dataset settings page and choose **Delete dataset**.

## Webhooks

A webhook notifies another system, or triggers an event elsewhere, whenever
something changes in your dataset.

The webhook page sits under the dataset settings, on the right.

![The webhooks settings page](../../assets/webhook.png)

A webhook needs three things:

- **Payload target** — the URL the message is sent to.
- **Payload format** — the format of the message.
- **Trigger events** — one or more of:
    - **Graph import**, when data is imported from another dataset already stored
      on the instance.
    - **Linked data upload**, when someone uploads data that was not on the
      instance before.
    - **Asset upload**, when an asset is uploaded.

Use the slider beside "Webhook is active" to switch it on or off, then click
**Submit**.

As an example, to trigger a GitLab pipeline whenever an asset is uploaded, select
**Asset upload** as the trigger event and use a payload target of this shape, as
described in the [GitLab documentation](https://docs.gitlab.com/ee/ci/triggers/):

```none
https://gitlab.example.com/api/v4/projects/<project_id>/trigger/pipeline?token=<token>&ref=<ref_name>
```

Once a webhook is active, every call it makes is listed in its trigger history.

![The trigger history of an active webhook](../../assets/webhook_trigger_history.png)

## Related

- [Manage services](manage-services.md) — the query services that publishing
  exposes
- [Upload data](upload-data.md) — getting data in before you publish it
- [Access and security](../../access-security/index.md) — who can see what
  <!-- LINK-TODO: chapter index for now -->

---



- 
- **The page was retitled** from "Sharing data" to "Publish data", to match the
  how-to naming pattern. The heading "Sharing your dataset" became "Make a dataset
  public", which is what it describes.
- 