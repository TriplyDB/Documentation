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
MAJOR version when you make incompatible API changes
MINOR version when you add functionality in a backward compatible manner


  <dt>Patch update</dt>
  <dd>Only the <code>{patch}</code> number has increased. This means that one or more bugs have been fixed in a backward compatible manner. You should always be able to perform a patch update without having to make any changes to your configuration.</dd>
  <dt>Minor update</dt>
  <dd>The <code>{minor}</code> number has increased, but the <code>{major}</code> number is still the same. This means that new functionality was added in a backward compatible manner. You should always be able to perform a minor update without having to make any changes to your configuration. But you may want to check the <a href="/docs/triply-etl/changelog" target="_blank">changelog</a> to see which new functionalities were added.</dd>
  <dt>Major update</dt>
  <dd>The <code>{major}</code> number has increased. This means that there are incompatible changes. This means that features may have been removed, or existing features may have changed. In such cases, changes to your configuration are almost certainly necessary, and may take some time to implement. Any changes you need to make are described in the <a href="/docs/triply-etl/changelog" target="_blank">changelog</a>.</dd>
</dl>

## Perform the update

Based on the outcome of the previous step, a maintainer of the repository decides which dependencies should be updated to which versions. Since Patch and Minor version updates are always safe to make, we discuss them separately from the more impactful Major version updates.

### Patch and Minor version update

You can update to the latest patch or minor version with the following command:

```sh
npm up
```

This command may change the contents of the `package-lock.json` file. These changes must be committed and pushed as part of performing the update.

Notice that this command will only perform safe (i.e. patch and/or minor) updates.

### Major version update

You can update to the latest major version with the following command:

```sh
npm i <package-name>@version
```

This means that the following command is used to update to a specific TriplyETL major version:

```sh
npm i @triplyetyl/etl@3.0.0
```

This command will change the contents of the `package.json` file. These changes must be committed and pushed as part of performing the update.
