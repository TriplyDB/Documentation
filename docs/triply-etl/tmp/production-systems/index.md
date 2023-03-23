---
title: "Triply ETL: Production Systems"
path: "/docs/triply-etl/production-systems"
---

## Upgrading RATT

New versions of RATT are released regularly.  Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs.  At the same time, updating to a new version may require changes to your pipeline.  The following sections describe how an upgrade can be performed reliably.

### Check the current version
You can check the current version of RATT using the following command:
```sh
yarn list --pattern ratt
```

### Check for a new version

You can check for updated by running the following command in your project directory:

```sh
yarn upgrade-interactive
```

This will display the list of packages for which updates are available.  If RATT appears in this list, notice the old and new version numbers.  These numbers are used in the next section to assess the impact of upgrading.

### Assess the impact of upgrading

RATT uses the [Semantic Versioning](https://semver.org) approach for structuring version numbers: `{major}.{minor}.{patch}`  The impact of upgrading to a new RATT version can be assessed as follows:

  - If only the `{patch}` number has increased, then an upgrade is not expected to affect existing functionality.  The new release only contains bug fixes and/or small changes to functionality that does not break existing pipelines.

  - If the `{minor}` number has increased, but the `{major}` number is the same, then an upgrade may require small changes to an existing pipeline.  A minor upgrade will never remove existing functionality, but it may change details of how existing functionality works (e.g. the settings for an existing function may have undergone minor changes).

    Minor releases are likely to include significant *new* functionality that may benefit an existing pipeline.
<!-- <https://issues.triply.cc/issues/5881>
    Check the [release changelog](#todo) to see which new features are available.
-->

  - If the `{major}` number has increased, an upgrade is likely to require changes to existing pipelines.  Major releases often remove outdated functionalities or bring significant changes to the behavior of existing functionalities.

<!-- <https://issues.triply.cc/issues/5881>
    Make sure to always check the [release changelog](#todo) when upgrading to a new major version.  And make sure to test your pipeline after performing a major upgrade.
-->

### Perform the upgrade

After having assessed the impact of upgrading, an upgrade can be effectuated by running the following command again:

```sh
yarn upgrade-interactive
```

Select the RATT option, if it appears in the list of available updates, by using the up and down arrows.  Select the RATT update by pressing `SPC` (spacebar) and press `RET` (return/enter) to perform the upgrade.

After the upgrade is applied, the `yarn.lock` file is automatically changed.  These automatic changes must be part of the next Git commit that is made.

Run the following command to build your pipeline with the new RATT version:

```sh
yarn build
```

Make any fixes/changes to the pipeline that are necessary and make a commit that indicates that the RATT version was upgraded.
