---
title: "TriplyETL: Maintenance"
path: "/docs/triply-etl/maintenance"
---

Once a TriplyETL repository is configured, it goes into maintenance mode. Maintenance includes the following tasks:

- [Update the TriplyETL dependency {#update}](#update-the-triplyetl-dependency-update)
  - [Check the current version](#check-the-current-version)
  - [Check for new versions](#check-for-new-versions)
  - [Assess the impact of updating](#assess-the-impact-of-updating)
  - [Perform the update](#perform-the-update)
    - [Patch and Minor version update](#patch-and-minor-version-update)
    - [Major version update](#major-version-update)
- [Configure the TriplyETL CI/CD {#cicd}](#configure-the-triplyetl-cicd-cicd)
  - [CI/CD configuration file](#cicd-configuration-file)
  - [CI/CD environment variables](#cicd-environment-variables)
  - [Understanding Runtime Differences](#understanding-runtime-differences)



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



# Configure the TriplyETL CI/CD {#cicd}

TriplyETL pipelines can be configured to run automatically in any CI/CD environment. This section explains how you can configure an automated TriplyETL pipeline in GitLab. Notice that the configuration in any other CI/CD environment will be more or less similar to what is explained in this section.

## CI/CD configuration file

The [TriplyETL Generator](/docs/triply-etl/getting-started#generator) creates a basic configuration file for running TriplyETL in GitLab CI/CD. The configuration file is called `.gitlab-ci.yml`.

The configuration contains a list of stages:

```yml
stages:
 - first_stage
 - second_stage
 - third_stage
```

These stages will run sequentially. For the above example: the pipeline starts by running the first stage, then runs the second stage, and finally runs the third stage.

Within each stage, you can configure one or more TriplyETL scripts. When more then one script is specified for the same stage, these scripts will run in parallel. This allows you to specify any combination of sequential and parallel processes.

The following example assumes that the following scripts are present in the TriplyETL repository:

```
- src/
    - create_vocabulary.ts
    - create_dataset_a.ts
    - create_dataset_b.ts
    - create_knowledge_graph.ts
- .gitlab-ci.yml
```

We want to configure our CI/CD in the following way:

1. Start by creating the vocabulary (script `create_vocabulary.ts`). This vocabulary will be used in the validation step of the two scripts that create the two datasets.
2. Once the vocabulary is created, create the two datasets (scripts `create_dataset_a.ts` and `create_dataset_b.ts`). The datasets can be created in parallel, but they both require that vocabulary creation is finalized.
3. Once the two datasets are created, create the knowledge graph (script `create_knowledge_graph.ts`), which combines the two datasets and the vocabulary in one dataset.

This specific configuration looks as follows:

```yml
create_vocabulary:
  stage: first_stage
  interruptible: true
  allow_failure: false
  artifacts: !reference [.etl-template, artifacts]
  script:
    - !reference [.etl-template, install]
    - !reference [.etl-template, run-etl]
  rules:
    - !reference [.etl-template, rules]

create_dataset_a:
  stage: second_stage
  interruptible: true
  allow_failure: false
  artifacts: !reference [.etl-template, artifacts]
  script:
    - !reference [.etl-template, install]
    - !reference [.etl-template, run-etl]
  rules:
    - !reference [.etl-template, rules]

create_dataset_b:
  stage: second_stage
  interruptible: true
  allow_failure: false
  artifacts: !reference [.etl-template, artifacts]
  script:
    - !reference [.etl-template, install]
    - !reference [.etl-template, run-etl]
  rules:
    - !reference [.etl-template, rules]

create_knowledge_graph:
  stage: third_stage
  interruptible: true
  allow_failure: false
  artifacts: !reference [.etl-template, artifacts]
  script:
    - !reference [.etl-template, install]
    - !reference [.etl-template, run-etl]
  rules:
    - !reference [.etl-template, rules]
```

## CI/CD environment variables

In a normal ETL the only variables that should be present AFAIK are: **ENV** (value: acceptance or production), **TRIPLYDB_TOKEN** (value: customer's TriplyDB token), **PIPELINE_NAME** (value: explained below), and optionally **TIMEOUT** (value: time description e.g. "1H")


TriplyETL pipelines interpret the following environment variables, that may be specified in the CI/CD environment:

<dl>
  <dt><code>ENV</code></dt>
  <dd>When DTAP is used, this environment variable specifies whether the pipeline runs in "Development", "Test", "Acceptance", or in "Production".</dd>
  <dt><code>TRIPLYDB_TOKEN</code></dt>
  <dd>The TriplyDB API Token that is used by the automated pipeline, and that allows the pipeline to read from and write to a TriplyDB server.</dd>
  <dt><code>PIPELINE_NAME</code></dt>
  <dd>A descriptive name that is used by GitLab in pipeline overviews. This is specifically useful if you are running multiple pipelines, in which case this descriptive name helps you to distinguish runs. One example of running multiple pipelines is running in DTAP; in which case the descriptive names for the pipelines may be "Schedule: Acceptance" and "Schedule: Production".</dd>
  <dt><code>TIMEOUT</code></dt>
  <dd>This environment variable can be set to a duration that is shorted than the duration of the pipeline. If a timeout is set and reached, TriplyETL will finish the ETL in an orderly fashion: saving the processed data, saving the performance log files, and saving the generated validation report (if any). This is useful for pipelines that would otherwise be terminated by the CI/CD environment, in which case TriplyETL is terminated immediately, without having the ability to nicely save before exiting.
  <dt><code>HEAD</code></dt>
  <dd>The maximum number of records that is being processed by the TriplyETL pipeline. This environment variable can be set in test runs that only want to test whether the ETL works for some records, without requiring it to run for all records. For example, in a DTAP Test run this number may be set to 10 to test whether the source can be accessed and the generated data can be uploaded to a TriplyDB server.</dd>
</dl>

## Understanding Runtime Differences

It's important to be aware that runtime differences can occur when comparing TriplyETL pipeline runtimes in different environments, particularly when comparing them to GitLab CI/CD runtimes. There are two main factors that can influence runtime differences:

1. Overhead in CI Jobs: GitLab CI jobs may introduce overhead beyond the actual ETL computation, such as setting up a containerized environment and additional CI-specific steps. A difference of 1 to 5 minutes between GitLab CI and TriplyETL runtimes is normal due to this overhead.

2. Use of [`copySource`](/triply-etl/publish/#direct-copying-of-source-data-to-destination) Function: Significant runtime differences exceeding 5 minutes can be attributed to the use of the [`copySource` ](/triply-etl/publish/#direct-copying-of-source-data-to-destination) function, which operates outside of the ETL application and contributes to the total runtime but not the middleware runtime.

If you encounter a runtime difference greater than 5 minutes, and the [`copySource`](/triply-etl/publish/#direct-copying-of-source-data-to-destination) function hasn't been used, it is recommended to report the issue to Triply. The issue will be further investigated to identify and address any potential causes.

Understanding these factors and taking appropriate action will help you manage your TriplyETL pipelines effectively in a CI/CD environment.

