[TOC]

# Copy an existing entry over to a new entry <!-- {#copy} -->

Copying is the act of creating a new thing that is based on a specific existing thing.

### Function signature

The `copy` function has the following signature:

```ts
app.use(
  copy({
    fromKey: 'FROM_KEY',
    toKey: 'TO_KEY',
    type: 'VALUE_TYPE',
    change: value => FUNCTION_BODY}),
)
```

This function copies the value from ‘foo’ to ‘bar’. The `type` key ensures that the value in ‘foo’ is cast to the specified type prior to being copied.

The optional `change` key allows the cast value to be transformed prior to storing it in ‘bar’. Leaving the `change` key out results in a direct copy in which the value is not modified.

This function emits an error if `fromKey` and `toKey` are the same. If you want to change a value in-place you should use [`change`](#change) instead.

This function emits an error if `toKey` already exists. If you want to replace the value in an existing entry then you should use [`replace`](#replace) instead.

The `change` function only takes the `value` argument and does not take the `context` argument. If you need the `context` argument then they must use [`add`](#add) instead.
