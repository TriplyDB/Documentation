---
title: "Clean code"
path: "/docs/generics/clean-code"
---

This section describes best practices for keeping [TriplyDB.js](../triplydb-js) and [RATT](../ratt) code simple and clean.


## Thousand separator

Human being are not good at reliably reading large numbers. For example, it takes some time to figure out where the following line contains the number one million (six zeros) or ten million (seven zeros).

```ts
1000000
```

It is best practice to use the underscore character (`_`) as a thousand separator in TypeScript code. This results in the following formatting of the above number:

```ts
1_000_000
```

Notice that it is now easy to see that this number is one million (six zeros) and not ten million (seven zeros).



## Trailing semi-colons

The TypeScript language has a feature called [Automatic Semicolon Insertion]() (ASI). This feature allows TypeScript to almost always insert trailing semicolons automatically. This means that it is almost always safe to not type the trailing semi-colon for a TrypeScript operator. In the very few cases where ASI leads to incorrect code, modern TypeScript tooling/editors will emit a warning. The code examples in these documentation pages use ASI. This makes TypeScript code a little bit shorter and a little bit easier to read.


## Simple lambda functions

It is common practice to use unnamed/lambda functions in TypeScript. For example, the [transformation functions in RATT](../ratt#transforming-values) take a lambda function for one of their arguments.

TypeScript allows the following cleanups to be applied when writing simple lambda functions:
- Lambda functions with exactly one parameter can be written without round brackets.
- Lambda functions that only consist of a return statement can leave out the `return` keyword and the `{}`-bracket that surround the function body.

### Example

The following RATT example transforms the number of inhabitants which is specified in millions in the source data:

```ts
app.use(
  mw.change({
    key: 'Inhabitants',
    type: 'number',
    change: (value) => { return value * 1000000 }}),
);
```

Because this is a simple lambda function that meet both simplifying criteria, we can write the same transformation as follows:

```ts
app.use(
  mw.change({
    key: 'Inhabitants',
    type: 'number',
    change: value => value * 1_000_000 }),
)
```

Notice that we also apply the [thousand separator cleanup](#thousand-separator) and the [trailing semi-colons](#trailing-semi-colons) cleanups here. It is often the combination of several small cleanups that results in code that is significantly easier to read.


## Use `if-then-else` or `switch`?

Some value transformations can be implemented with either an `if-then-else` or a `switch` statement.

If it best practice to use a `switch` statement if the following conditions apply:
- The same object is compared to other objects in each conditional case.
- The object is compared to a constant object in each case.

In all other cases an `if-then-else` statement is better.

### Example

The following RATT example maps a dynamic `value` to the Boolean values `true` and `false`:

```ts
app.use(
  mw.change({
    key: 'KEY',
    type: 'string',
    change: (value, key) => {
      if (value == 'Y') {
        return true
      } else if (value == 'N') {
        return false
      } else {
        throw Error(`Could not parse ${key}.`)}}}),
)
```

Notice that the conditions for using a `switch`-statement apply here:
- Each conditional case compares the same `value` object to other objects.
- The object `value` is always compared to a constant object (either `Y` or `N`).

We can write the same transformation as follows:

```ts
app.use(
  mw.change({
    key: 'KEY',
    type: 'string',
    change: (value, key) => {
      switch (value) {
      case 'Y': return true
      case 'N': return false
      default:  throw Error(`Could not parse ${key}.`)}}}),
)
```
