---
title: "Triply ETL: Production Systems"
path: "/docs/triply-etl/production-systems"
---

## Configuring the Context {#context}

The TriplyETL Context is specified when the `Etl` object is instantiated.  This often appears towards the start of a pipeline script.  The TriplyETL Context allows the following things to be specified:

- The data sources that can be used in the ETL.
- The data destinations where linked data is published to.
- The named graph in which `triple` calls with no graph argument add their data.
- The prefix IRI for blank node-replacing well-known IRIs.


### Configuring the standard graph

When we call `triple` with 3 arguments, a triple is created and placed in a named graph that is chosen by TriplyETL.  You can change the name of this default graph by specifying it in the TriplyETL context.  Notice that graph names must be IRIs:

```ts
const etl = new Etl()
```

### Configuring the well-known IRI prefix

TriplyDB performs Skolemization, an approach in which blank nodes are systematically replaced by well-known IRIs.  TriplyDB chooses a well-known IRI prefix for you,

```ts
const etl = new Etl({
  wellKnownIriPrefix: 'https://triplydb.com/Triply/example/.well-known/genid/',
})
```

## Upgrading TriplyETL

New versions of TriplyETL are released regularly.  Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs.  At the same time, updating to a new version may require changes to your pipeline.  The following sections describe how an upgrade can be performed reliably.

### Check the current version

You can check the current version of TriplyETL using the following command:

```sh
npx etl --version
```

### Check for a new version

You can check for updated by running the following command in your project directory:

```sh
npm outdated
```

This will display the list of packages for which updates are available.  If TriplyETL appears in this list, notice the old and new version numbers.  These numbers are used in the next section to assess the impact of upgrading.

### Assess the impact of upgrading

TriplyETL uses the [Semantic Versioning](https://semver.org) approach for structuring version numbers: `{major}.{minor}.{patch}`  The impact of upgrading to a new TriplyETL version can be assessed as follows:

  - If only the `{patch}` number has increased, then an upgrade is not expected to affect existing functionality.  The new release only contains bug fixes and/or small changes to functionality that does not break existing pipelines.

  - If the `{minor}` number has increased, but the `{major}` number is the same, then an upgrade may require small changes to an existing pipeline.  A minor upgrade will never remove existing functionality, but it may change details of how existing functionality works (e.g. the settings for an existing function may have undergone minor changes).

    Minor releases are likely to include significant *new* functionality that may benefit an existing pipeline.

  - If the `{major}` number has increased, an upgrade is likely to require changes to existing pipelines.  Major releases often remove outdated functionalities or bring significant changes to the behavior of existing functionalities.


### Perform the upgrade

After having assessed the impact of upgrading, an upgrade can be effectuated by running the following command again:

```sh
npm upgrade-interactive
```

Select the TriplyETL option, if it appears in the list of available updates, by using the up and down arrows.  Select the TriplyETL update by pressing `SPC` (spacebar) and press `RET` (return/enter) to perform the upgrade.

After the upgrade is applied, the `package-lock.json` file is automatically changed.  These automatic changes must be part of the next Git commit that is made.

Run the following command to build your pipeline with the new TriplyETL version:

```sh
npm run build
```

Make any fixes/changes to the pipeline that are necessary and make a commit that indicates that the TriplyETL version was upgraded.
