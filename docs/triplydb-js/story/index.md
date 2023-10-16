[TOC]

# Story

A TriplyDB data story is a way of communicating information about your linked data along with explanatory text while also being able to integrate query results. To create Data stories with `TriplyDB.js` You can use the
`User.ensureStory` or `User.addStory` functions to create. If you want to retrieve an already created data story you can use the functions `User.getStories` to iterate over all stories, or retrieve a particular one with `User.getStory`.

Story objects are obtained through the the following methods:

- [`User.addStory`](/triplydb-js/user#useraddstoryname-string-metadata-object)
- [`User.ensureStory`](/triplydb-js/user#userensurestoryname-string-metadata-object)
- [`User.getStories`](/triplydb-js/user#usergetstories)
- [`User.getStory`](/triplydb-js/user#usergetstoryname-string)


## Story.delete()

Deletes this story. This deletes all paragraphs that belong to this story.

This _does not_ delete the queries that are linked into this story. If you also want to delete the queries, then this must be done with distinct calls of [`Query.delete()`](/triplydb-js/query#querydelete).

### Examples

The following code example deletes a story called `'example-story'` under the current user's account:

```ts
const user = await triply.getUser()
const story = await user.getStory('example-story')
await story.delete()
```


## Story.getInfo()

Returns information about this data story.

Information is returned in a dictionary object. Individual keys can be accessed for specific information values.

### Examples

The following snippet prints the paragraphs that appear in a data story:

```ts
for (const element of (await story.getInfo()).content) {
  if ((element.type = 'paragraph')) {
    console.log(element.paragraph)
  }
}
```
