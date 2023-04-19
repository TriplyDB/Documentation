# Documentation for TriplyDB

This repository contains the TriplyDB documentation files.  These file are used by the Triply documentation website over at <https://triply.cc/docs>.

## Covered products

This repository includes documentation for the following Triply products:

<dl>
  <dt>TriplyDB</dt>
  <dd>An integrated linked data environment for publishing and using linked data knowledge graphs.</dd>
  <dt>TriplyETL</dt>
  <dd>A library that is optimized for building production-grade linked data pipelines.</dd>
  <dt>TriplyDB.js</dt>
  <dd>A library for automating tasks in TriplyDB instances and for building applications that tap into a linked data knowledge graph.</dd>
</dl>

## Contributing

- Feel free to open issues with questions about the documentation.
- Feel free to create pull requests with adjustments or additions that you believe to be valuable.

## Available markdown

You are able to use [GitHub Flavored Markdown](https://github.github.com/gfm/). As well as the following extensions

- **Custom Id headers**:
Using the following syntax you are able to assign id's to headers (without having to resort to `html`)

```md
# Header {#id}
```

## Adding a blog post

1. Create a new directory under the `/blog` directory, for example `/blog/2023-04-my-blog-post`.
2. Create a new file `index.md` in that new directory.  Optionally add images that are included in the blog post.
3. Add the following metadata at the top of that file:

```
---
title: "My Blog Post"
path: "/blog/2023-04-my-blog-post"
date: "2023-04-07T11:15:00"
author: firstnameLastname
---
```

4. Make sure that the author name entered under 'author' also appears in file `/authors.yml`.
5. Test your changes locally, using the langdingSite repo.
6. If all looks good commit your changes and create a Merge Request.
