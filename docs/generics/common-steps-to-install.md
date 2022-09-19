---
title: "Common Steps to Install Node.js"
path: "/docs/common-steps-to-install"
---

The Triply libraries [RATT](ratt) and [TriplyDB.js](triplydb-js) require the installation of [Node.js](https://nodejs.org). 

Node.js is an interpretor that can run JavaScript (and thus TypeScript) code outside of a web browser. It can be installed on all major operating systems:

<dl>
  <dt>Windows</dt>
  <dd>Go to <a href="https://nodejs.org">Node.js</a> and download and install version 16. In the installation wizard you can use the default settings. (Specifically, it is not required that you select "Automatically install the necessary tools. Note that this will also install Chocolatey.")</dd>
  <dt>macOS</dt>
  <dd>
    <p>Install <a href="https://brew.sh">Homebrew</a> and run the following command in a terminal window:</p>
    <pre><code>brew install node yarn</code></pre>
  </dd>
  <dt>Linux</dt>
  <dd>
    <p>Run the following command to install the latest versions of Node.js and Yarn on Ubuntu:</p>
    <pre><code>sudo apt install nodejs yarn</code></pre>
  </dd>
</dl>

## Check the installation

You can check whether installation succeeded by running the following commands:

```
node --version
yarn --version
```

These should show the version numbers that are installed.

## Frequently Asked Questions (FAQ)

This section includes commonly asked questions that have a known solution. Please contact <mailto:support@triply.cc> if your question is not yet included.

### Enable running scripts

On some Windows systems, running `yarn` emits the following error message:

```
yarn : File ... cannot be loaded because running scripts is disabled on this system.
```

This means that the policy on your systems is too strict and does not allow Yarn to be run. You can make the policy less strict by running the following command:

```
Set-ExecutionPolicy RemoteSigned
```

### Node.js 14 compatibility issue

**Question**: When I run `yarn` to install dependencies, I get the following error message about Node.js version compatibility:

```
error async-saxophone@1.0.1: The engine "node" is incompatible with this module. Expected version "10 || 12 || 13 || 14". Got "16.13.0"
```

**Answer**: One of the external RATT dependencies incorrectly assumes that Node.js 14 is used. If you use a higher Node.js version, then add the flag `--ignore-engines` when running the Yarn command. For example:

```
yarn --ignore-engines
```
