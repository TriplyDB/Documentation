# Publishing data

With TriplyDB you can easily make your data available to the outside world.

## Publishing your dataset

You can publish your dataset by setting the visibility to “Public” in
the dataset settings menu. Making a dataset public in TriplyDB has
the following consequences:

1. The dataset can be searched for and visited by anybody on the web.
2. The dataset will be indexed by web search engines such as Google
   Dataset Search.
3. Any services that are started for that dataset will be available
   to anybody on the web. This includes SPARQL, Text
   Search, and Linked Data Fragments.

## Entering metadata

Adding metadata to your datasets is important. This makes it easier
to find your dataset later and also allows search engines and social
media applications to understand your dataset.

Metadata is entered from the dataset settings page, which is accessed
by clicking on the “Dataset settings” (cog icon) option from the
left-hand sidebar (see screenshot).

![“Dataset settings” page](cog-wheel.png) The dataset homepage looks empty without metadata. Notice the cog wheel icon, which provides access to the “Dataset settings” page.

The dataset settings page allows the following metadata to be entered:

- The dataset description. This can consist of text with (optional) Markdown formatting.
- The avatar (image) of the dataset.
- The access level of the dataset.
- The topics of the dataset.
- The example resources for the dataset.
- The license of the dataset.

![The dataset settings page](dataset-settings-page.png) The dataset settings page allows various forms of dataset metadata to be added.

Within the TriplyDB instance your dataset is now more findable for users. Whenever
a user searches on one of the topics of your dataset, or types in a word that is
present in the description of your dataset, the dataset will be shown as a search
result. The metadata will allow TriplyDB to give a better impression of your dataset
when a user visits:

![The dataset home page](dataset-homepage-with-metadata.png) The dataset home page after metadata has been entered.

Search engines and social media applications can recognize the
metadata that is entered for datasets in TriplyDB. The following
screenshot shows the widget created by the Slack chat application upon
entering a link to the dataset. Notice that the chat application
understands metadata properties like title, description, and image.

![A Slack widget](slack-widget.png) Widget created by the Slack chat application upon sharing a link to a dataset in TriplyDB.

## Starting services

By default, datasets in TriplyDB can be queried through [TriplyDB-js](/triplydb-js) as well as through the Linked Data Fragments API.

In order to allow additional query paradigms, specific services can be
started from the “Create service” page. This page is accessed by
clicking on the “Services” icon in the left-hand sidebar.

TriplyDB instances can be configured with different types of services.
The below screenshot shows the “Create service” page for a TriplyDB
instance that allows SPARQL, Jena SPARQL, and Elasticsearch services
to be created.

![The “Create service” page](create-service.png) Notice that three different types of services can be created.

It is possible to create multiple services for one dataset.

### Existing services

Existing services are displayed on service widgets (see screenshot).
From these widgets, services can be created or deleted.

![An example of a service widget](service-widget.png)

Datasets can change whenever a graph is added, deleted or renamed. When this
happens, the data in a service is out of sync with the data in the dataset and
a synchronization button will appear in the service widget. By clicking the
button, the service will be synchronized with the current state of the dataset.

### Webhooks

If you want to be notified or trigger an event when anything changes in your dataset, you can set up a webhook.

The webhook page can be found under dataset's settings on the right, as shown in the image below.

![Webhooks settings page](webhook.png)

To create a webhook, you will need to provide the following information:
- `Payload target`: The URL to which the webhook message should be sent.
- `Payload format`: The format of the message.
- `Trigger events`: Select for which event you wish to trigger the webhook. The options are:
  - **Graph import**: Happens when data is imported from a different dataset and where the data is already stored on the instance. 
  - **Linked data upload**: Happens when a person uploads data to the instance. The data did not exist on the instance before.
  - **Asset upload**: Happens when an asset is uploaded.


You can activate or deactivate the webhook with the slider after the `Webhook is active` message.

After filling in everything, you can click on the `SUBMIT` button and the new webhook will be activated.

For example, if you wish to trigger a pipeline on gitlab every time you upload an asset to your dataset, you can use the below snippet as a payload target, as described on the [official gitlab documentation](https://docs.gitlab.com/ee/ci/triggers/) and select `Asset upload` as a trigger event.

```
https://gitlab.example.com/api/v4/projects/<project_id>/trigger/pipeline?token=<token>&ref=<ref_name>
```
When your webhook is created and active, you can see every occasion the webhook was called in the webhook trigger history.

![Active webhook trigger history](webhook_trigger_history.png)