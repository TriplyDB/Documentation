---
title: "TriplyETL: Maintenance"
path: "/docs/triply-etl/maintenance"
---

Once a TriplyETL repository is configured, it goes into maintenance mode. Maintenance includes the following tasks:

- [Update the TriplyETL dependency](#update)
- Configure the TriplyETL CI/CD
- Monitor the TriplyETL CI/CD



# Update the TriplyETL dependency {#update}

New versions of TriplyETL are released regularly. Moving to a new version is generally a good idea, because it allows new features to be used and will include fixes for known/reported bugs. At the same time, updating to a new version may require you to make some changes to your pipeline.

It is important to determine an approach for updating your TriplyETL projects that fits your team and organization. The following sections describe how you can make such a determination.

## Check the current version

The following command prints the TriplyETL version that you are currently using:

```sh
npm list @triplyetl/etl
```

## Check for new versions

The following command prints the latest TriplyETL version that is available:

```sh
npm outdated
```

TriplyETL repositories typically include several developer dependencies as well. These developer dependencies make it easier to write and maintain your ETLs. These developer dependencies are not part of TriplyETL, and must therefore be updated independently of TriplyETL.

## Assess the impact of updating

TriplyETL uses the Semantic Versioning approach: `{major}.{minor}.{patch}` The impact of updating to a new TriplyETL version can therefore be determined as follows:

<dl>
  <dt>Patch update</dt>
  <dd>Only the <code>{patch}</code> number has increased. This means that bugs have been fixed and small enhancements to existing functionalities have been added. In such cases, you should be able to update without having to make any changes to your configuration.</dd>
  <dt>Minor update</dt>
  <dd>The <code>{minor}</code> number has increased, but the <code>{major}</code> number is still the same. This means that new features have been added and/or existing features have received small enhancements. A minor update will never remove existing functionality, but it may change details of how existing functionalities work (e.g. the settings for an existing function may have undergone minor changes). In such cases, you should be able to update with either no changes or only minor changes to your configuration. The changes you need to make are described in the <a href="/docs/triply-etl/changelog" target="_blank">changelog</a>.</dd>
  <dt>Major update</dt>
  <dd>The <code>{major}</code> number has increased. This means that features have been removed, or have changed significantly. In such cases, changes to your configuration are almost certainly necessary, and may take some time to implement. Any changes you need to make are described in the <a href="/docs/triply-etl/changelog" target="_blank">changelog</a>.</dd>
</dl>

## Perform the update

Based on the outcome of the previous step, a maintainer of the repository decides which dependencies should be updated to which versions. Updates are effectuated with the following command:

### Minor or patch version update

You can update to the latest minor or patch version with the following command:

```sh
npm up <package-name>
```

For example, the following command updates to the latest TriplyETL minor or patch version:

```sh
npm up @triplyetyl/etl
```

The following command updates all dependencies to the latest minor or patch version:

```sh
npm up
```

Notice that the latest minor or patch version is determined relative to the major version that is specified in the `package.json` file.

This command may change the contents of the `package-lock.json` file. These changes must be committed and pushed as part of performing the update.

### Major version update

You can update to the latest major version with the following command:

```sh
npm i <package-name>@latest
```

For example, the following command updates to a specific TriplyETL version:

```sh
npm i @triplyetyl/etl@2.0.11
```

This command will change the contents of the `package.json` file. These changes must be committed and pushed as part of performing the update.
