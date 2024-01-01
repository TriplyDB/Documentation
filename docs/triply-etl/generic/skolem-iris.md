[TOC]

# Skolem IRIs

TriplyETL uses Skolem IRIs instead of blank nodes. This approach is consistent with the RDF 1.1 standard. This page details why TriplyETL uses Skolem IRIs, and shows how they are used to stand in for blank nodes in a generic and standards-compliant way.



## What are Skolem IRIs?

Skolem IRIs are IRIs that are used to systematically stand in for blank nodes. Whenever a blank node occurs in linked data, it is allowed to be replaced by a Skolem IRI. Skolem IRIs are guaranteed to universally unique, while blank nodes are only guaranteed to be unique within the context in which they occur.



## Why does TriplyETL use Skolem IRIs?

Before linked data that contains blank nodes can be used, all blank nodes in that linked data must be renamed in order to avoid name collisions. Since Skolem IRIs are universally unique, there is no such requirements when using linked data that contains Skolem IRIs instead of blank nodes.

TriplyETL uses Skolem IRIs instead of blank nodes, because this makes the linked data that TriplyETL creates easier to use. This easy-of-use applies to processing inside TriplyETL, but also applies to the use of linked data produced by TriplyETL after publication.



## Skolem IRIs are a lossless approach

Since Skolem IRIs are required to use a specific path prefix (i.e. `/.well-known/genid/`), users of linked data containing Skolem IRIs are able to distinguish them from other IRIs.

As such, it is possible to systematically replace Skolem IRIs with blank nodes again, since the translation from and to Skolem IRIs does not lose any information.

Notice that while there are no benefits to replacing Skolem IRIs with blank nodes, only downsides, some users may still wish to perform such replacements.



## An illustrative example

We show the downsides of linked data that contains blank nodes, and the benefits of linked data that contains Skolem IRIs that replace blank nodes, with an example. The following two linked data snippets use the same blank node label ('eFsgehcX9k25dv'):

```turtle
prefix ns: <https://example.com/>

ns:product ns:height _:eFsgehcX9k25dv.
_:eFsgehcX9k25dv
  ns:unitOfMeasure ns:meter;
  ns:value 1.1e0.
```

and:

```turtle
prefix ns: <https://example.com/>

ns:product ns:width _:eFsgehcX9k25dv.
_:eFsgehcX9k25dv
  ns:unitOfMeasure ns:centimeter;
  ns:value 1.5e0.
```

Since the blank node label occurs in two different contexts, we are not allowed to naively combine these two snippets. In fact, if we would naive combine them, we would end up with the following incorrect information:

```turtle
prefix ns: <https://example.com/>

ns:product
  ns:height _:eFsgehcX9k25dv.
  ns:width _:eFsgehcX9k25dv.
_:eFsgehcX9k25dv
  ns:unitOfMeasure ns:centimeter, ns:meter;
  ns:value 1.1e0, 1.5e0.
```

Notice that in the combined snippet, it is no longer possible to determine what is the height and what is the width of the product. Neither is it possible to determine which unit of measure belongs to which numeric value.

In order to avoid this issue with blank nodes, users are required to systematically rename them whenever they make use of the data. For example, in order to combine the two original linked data snippets, their blank node labels must first be renamed:

```turtle
prefix ns: <https://example.com/>

ns:product
  ns:height _:eFsgehcX9k25dv_renamed1;
  ns:width _:eFsgehcX9k25dv_renamed2.
_:eFsgehcX9k25dv_renamed1
  ns:unitOfMeasure ns:meter;
  ns:value 1.1e0.
_:eFsgehcX9k25dv_renamed2
  ns:unitOfMeasure ns:centimeter;
  ns:value 1.5e0.
```

This renaming of blank nodes must be performed *every time the data is used*. This is very cumbersome, and many users of linked data are unable to perform such renaming operations reliably.

Now we show the same example, but by first replacing all blank nodes with Skolem IRIs. We start with the following two linked data snippets:

```turtle
prefix ns: <https://example.com/>
prefix skolem: <https://example.com/.well-known/genid/>

ns:product ns:height skolem:eFsgehcX9k25dv.
skolem:eFsgehcX9k25dv
  ns:unitOfMeasure ns:meter;
  ns:value 1.1e0.
```

and:

```turtle
prefix ns: <https://example.com/>
prefix skolem: <https://example.com/.well-known/genid/>

ns:product ns:width skolem:JmsR9ev5QgHZyx.
skolem:JmsR9ev5QgHZyx
  ns:unitOfMeasure ns:centimeter;
  ns:value 1.5e0.
```

Notice that we are able to use these linked data snippets directly, without having to perform a renaming operation. For example, we can naively combine the two snippets into one:

```turtle
prefix ns: <https://example.com/>
prefix skolem: <https://example.com/.well-known/genid/>

ns:product
  ns:height skolem:eFsgehcX9k25dv;
  ns:width skolem:JmsR9ev5QgHZyx.
skolem:eFsgehcX9k25dv
  ns:unitOfMeasure ns:meter;
  ns:value 1.1e0.
skolem:JmsR9ev5QgHZyx
  ns:unitOfMeasure ns:centimeter;
  ns:value 1.5e0.
```
