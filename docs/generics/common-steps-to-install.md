---
title: "Common Steps to Install Node.js and Yarn"
path: "/docs/common-steps-to-install"
---

The Triply libraries [RATT](ratt) and [TriplyDB.js](triplydb-js) require the installation of [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com).

- **Node.js** is an interpretor that can run JavaScript (and thus TypeScript) code outside of a web browser.
- **Yarn** is a package manager for handling JavaScript/TypeScript dependencies.

Because there are many different programming environments, we are unable to describe detailed installation steps that work in every environment.  The following sections document steps that work in many, but not in all, environments.  You can contact <mailto:support@triply.cc> in case these steps do not work for you.  You can also visit the documentation of the [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) projects for more information.

## Installation

### Windows

1. Go to [Node.js](https://nodejs.org) and download version 14.  This is not the latest version, so you must go to [this page](https://nodejs.org/download/release/latest-v14.x/) to download the latest version of the v14 line.

2. Try to run `yarn --version` in a Powershell window.

   On some systems this emits the following error message:

   ```
   yarn : File ... cannot be loaded because running scripts is disabled on this system.
   ```

   This means that the policy on your systems is too strict and does not allow Yarn to be run.  You can make the policy less strict by running the following command:

   ```sh
   Set-ExecutionPolicy RemoteSigned
   ```

### macOS

1. Install [Homebrew](https://brew.sh).

2. Run the following command in a terminal window:

   ```sh
   brew install node yarn
   ```

### Linux

There are many different distributions of Linux.  We document installation steps for a limit number of them in this section.  Feel free to contact <mailto:support@triply.cc> in case your Linux distribution is not yet mentioned in this section.

#### Ubuntu/Debian

Run the following command to install the latest versions of Node.js en Yarn as provided by your distribution:

```sh
sudo apt install nodejs yarn
```

This command may also work on other Debian-based Linux distributions that use Apt for package management.

#### Fedora/Red Hat

Run the following command to install the latest versions of Node.js en Yarn as provided by your distribution:

```sh
sudo yum install nodejs yarn
```

This command may also work on other Red Hat-based Linux distributions that use Yum for package management.

## Check the installation

You can check whether installation succeeded by running the following commands.  These also show the version number that was installed.

### Check the Node.js installation

Run the following command to check whether Node.js was installated correctly.

```sh
node --version
```

This should display a version number.

### Check the Yarn installation

Run the following command to check whether Yarn was installated correctly.

```sh
yarn --version
```

This should display a version number.

## Frequently Asked Questions (FAQ)

This section includes commonly asked questions that have a known solution.  Please contact <mailto:support@triply.cc> if your question is not yet included.

### Node.js 15/16/17 compatibility issue

**Question**: When I run `yarn` to install dependencies, I get the following error message about Node.js version compatibility:

```sh
yarn install v1.22.15
[1/4] Resolving packages...
[2/4] Fetching packages...
info There appears to be trouble with your network connection. Retrying...
info There appears to be trouble with your network connection. Retrying...
info There appears to be trouble with your network connection. Retrying...
error async-saxophone@1.0.1: The engine "node" is incompatible with this module. Expected version "10 || 12 || 13 || 14". Got "16.13.0"
error Found incompatible module.
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
U:\visual_studio\repos\implementatie-team-main>yarn build
'tsc' is not recognized as an internal or external command,
operable program or batch file.
```

**Answer**: One of the RATT dependencies requires that Node.js 14 is installated.  If you have installed Node.js 15, 16, or 17, you must add the flag `--ignore-engines` when running the Yarn command.

For example, you must run the following command to install dependencies for the current repository:

```sh
yarn --ignore-engines
```
