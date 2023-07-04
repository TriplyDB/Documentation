# FAQ

### Why does my pipeline schedule only run an `install` job?

This probably means that none of the `only:` rules in your `.gitlab-ci.yml` file match. You should check whether the variables you've set in the pipelines schedules page match with the `only:` rules in your .gitlab-ci.yml file.

### I made a change to the `.gitlab-ci.yml` file and after I push I see a pipeline failed with status `yaml invalid`. How can I fix this?

Copy-past your `.gitlab-ci.yml` file [here](https://git.triply.cc/triply/ratt/-/ci/lint) and press `validate`. This should show in more details what is wrong with the yml file.

### Why is my pipeline not running and marked as 'pending'?

This probably means that you have not configured an ETL runner for this customer organization yet. See the section about getting started [here](#how-to-create-a-ratt-ci-pipeline)

### What do all these `$CI_...` environment variables mean?

These are environment variables added by gitlab. To see what they mean, go to [this](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) gitlab documentation page, also mentioned above.

### What should I do when the pipeline fail when I commit in a personal project?

In a personal repository, you have available runners, but shared ones. Thus, your pipelines will fail. This is expected and it is not an issue. You can either ignore the failed pipeline or remove `gitlab-ci.yml` from the repository.
