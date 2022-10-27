---
title: "Common Steps to Install Node.js"
path: "/docs/common-steps-to-install"
---

The Triply libraries [RATT](ratt) and [TriplyDB.js](triplydb-js) require the installation of [Node.js](https://nodejs.org). 

Node.js is an interpretor that can run JavaScript (and thus TypeScript) code outside of a web browser. It can be installed on all major operating systems by going to <a href="https://nodejs.org">nodejs.org</a> and following the installation instructions there.

## Check the installation

You can check whether your installation succeeded by running the following commands:

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


