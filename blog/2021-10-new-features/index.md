---
title: "New TriplyDB Features (Sept 2021)"
path: "/blog/2021-10-new-features"
date: "2021-10-01T11:15:00"
author: triply
---

Hi all! The summer was a busy time for us, working on refining existing features and developing new elevated ones for better and better user experience. So, let’s dive into it!

## Form makeover time
When creating a dataset, story or query on TriplyDB you want those to have a name, url and optionally a description. You can set these items in a form. It was time to give our forms a makeover, so we improved the user experience and user interface of the forms.

We moved the headers of each of the settings over to the left hand side, making the form a bit more compact and way more elegant. Also, this format leads to less vertical space, making the form easily readable.

We improved the user experience for creating datasets, stories and queries. Each dataset, story and query requires 1) a human  readable name and 2) a name that is included in the API path for (also called a 'slug'). A slug comes with some limitations, as some characters are forbidden in a URL path. Because we don't want to bother users with writing such a slug themselves, we are now automatically creating one for you whenever you give a dataset, story or query a name. Of course, if you do not agree with our simplification, you are still free to change the slug yourself!

![Form gif](Feature_list_sept2021_form.gif)

## SPARQL IDE additions

Our customers and ourselves are spending most of our time in the YASGUI editor. Thus improving the editor has a large positive impact. In the last three months we did just that: we polished up the YASGUI editor in a number of ways.

One of the issues that we noticed is that, with large SPARQL queries, it was really hard to get the editor to a size so that the whole query is visible. To improve this, we added the double-clicking feature on the divider between the editor (YASQE) and the results (YASR). By double clicking on the divider, the query editor window will resize to the length of the query. Now whenever you want to see a large SPARQL query, the only thing you have to do is double click! You can also adjust the editor to your preferred size by dragging the divider.

The second improvement to the YASGUI editor is about prefixes. Prefixes are a really good way to shorten your queries for better readability. For this reason, we implemented two additions into YASGUI that make use of prefixes.
- When you start to type a new SPARQL query and you want to add a prefix that you’ve already added to the list of known prefixes, you can just type the prefix and your prefix is automatically added to your query. For more details on prefix declaration in our SPARQL editor, you can see our [documentation](https://triply.cc/docs/yasgui#features).
- Support that automatically prefixes your result set was added in the editor, making use of the set of prefixes. That way you do not even have to add the prefixes to your SPARQL query yourself.

![SPARQL IDE additions](SPARQL_IDE_additions.gif)

## Accessibility

We are working to increase the accessibility in our instances (e.g. triplydb.com) for users with an impairment. Most users will not notice these changes, but for some it will be a huge improvement. So what  changed?

Pages that you visit on the web roughly consist of a hierarchical structure (HTML) and a description of how that structure should be displayed (CSS). Of course, for many parts of the HTML it is already quite clear how they should look: there are separate elements for buttons, headers, paragraphs, input fields and more, and even a way to indicate what those input fields are used for, like email and password fields.

Luckily, there is a standard for accessibility and we at Triply love standards! It is called the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) and is published by the World Wide Web Consortium (W3C), which also publishes the standards governing HTML, CSS and even RDF. The guidelines describe what structural (HTML) elements should be used in which situations, and what assumptions accessibility tools can use regarding the structure of a webpage and even how to add additional information to a page that can aid the user of such accessibility tools.

We improved TriplyDB based on these guidelines in several ways:
1. We made sure that we use the correct structural element in all cases, so that accessibility tools work effectively.
2. We added matching labels for all our buttons, in order to be reachable only by using the keyboard.
3. we added ‘alt’ tags to images and avatars, in order to provide a textual representation to describe the visual content.
4. We are continuously working on making TriplyDB more and more accessible and more features are on the way!

## Closing Notes
These features are just some of the changes we made during the summer months. There are many more, big and small, that have been added. Join us on our free-to-use Triple Store over at [TriplyDB](https://triplydb.com/) or contact us for any inquiries at [info@triply.cc](mailto:info@triply.cc).
