This document explains how to maintain an ETL that runs in the gitlab CI.

# How to create a TriplyETL CI pipeline?

- Use the TriplyETL boilerplate from [this repository](https://git.triply.cc/triply/boilerplates), specifically the etl folder.
- Each customer organization in gitlab needs their own 'CI runner'. If you're adding a TriplyETL repo to an existing customer, then you're probably fine. But if this is a newly created organization, you will need to register a runner for this organization.
  - To check whether the customer organization has a runner configured, go to the customer organization `Settings` in gitlab, then go to `CI/CD`. The URL should look something like this: `https://git.triply.cc/groups/customers/<customer-name>/-/settings/ci_cd`. Click `Runners` and verify that `Available runners:` is not zero.
  - If you need to register a runner, contact a sysadmin (see [here](https://git.triply.cc/triply/documentation/-/wikis/pages/server-calamities/index#for-triply-members) for the list of sysadmins) and ask them to create a runner for your organization.

# Modifying a pipeline

To change what happens in a CI pipeline, all you need to do is modify the `.gitlab-ci.yml` file of your repository.

Below we detail some relevant `.gitlab-ci.yml` fields that are used in most of our ETL pipelines (see [here](https://docs.gitlab.com/ee/ci/yaml/) for the complete gitlab documentation on what all these fields mean)

### `artifacts:`
Artifacts are files or directories that gitlab will save for you. These files are available on the gitlab pipelines page after a job ran. This is particularly useful for TriplyETL error/log files, as you download these from the gitlab UI.

### `variables:`
You can define environment variables in several places. In the `.gitlab.yml` file, you can configure them at a job level or for all jobs. You can also configure them in the gitlab UI in the pipeline schedule form. Variables defined in a pipeline schedule will overwrite variables defined in the `.gitlab-ci.yml` file (see [here](https://docs.gitlab.com/ee/ci/variables/index.html#cicd-variable-precedence) for the gitlab documentation on variable precedence).

### `script:`
This is the code that will run in the job. If you need a job to run two TriplyETL commands after each other, you can easily add another `npx etl ....` line here.

### `only:`
This defines *when* a job should run. If a job does not have an `only:` configure, it will always run. See [here](https://docs.gitlab.com/ee/ci/yaml/#only--except) for documentation about the syntax of `only`). The boilerplate comes with some example `only:` rules that look like this:
```yml
  only:
    variables:
      - $JOB == "$CI_JOB_NAME"
```
This means that we only run this job if there a `JOB` environment variable that is the same as `CI_JOB_NAME`. Notice that the `CI_JOB_NAME` is a default environment variable that gitlab gives us and that equals the name of the job, e.g. `production` (see other predefined variables [here](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)).  If you want to run this specific job, `JOB` is the environment variable that you should set in the pipeline schedule page. In other words, if you set `JOB=production` in the pipeline schedule page, then using the above `only:` rule, only the intended job will run.
