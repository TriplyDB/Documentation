[TOC]

# Inline JSON

Because TriplyETL configurations are implemented in TypeScript, it is possible to specify JSON data inline with TypeScript Objects. JSON is the only data format that be specified in such a native inline way in TriplyETL.

The following code snippet specifies two records using inline TypeScript objects:

```ts
fromJson([
  { id: '123', name: 'John' },
  { id: '456', name: 'Jane' },
]),
```

This results in the following two records:

```json
{
  "id": "123",
  "name": "John"
}
{
  "id": "456",
  "name": "Jane"
}
```

In documentation, we often use such inline JSON sources since that makes code snippets self-contained, without having to rely on external sources such as files. In production systems this native inline source type is almost never used.
