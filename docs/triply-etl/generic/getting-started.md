[TOC]

# TriplyETL Getting Started

This page helps you to get started with TriplyETL. You can get started with TriplyETL in any of the following ways:

1. [TriplyETL Generator](#triplyetl-generator) creates a new ETL project based on your answers to a set of question.
2. [TriplyETL Runner](#triplyetl-runner) runs an existing ETL project.
3. [TriplyETL Library](#triplyetl-library) can be included as a dependency in your TypeScript project.



## Prerequisites

In order to use TriplyETL, you must first install the following programs on your computer:

<dl>
  <dt>Install Git</dt>
  <dd>
    <ol>
      <li>
        <p>Go to <a href="https://github.com/git-guides/install-git" target="_blank">this link</a> and follow the instructions for your operating system (Windows, macOS, or Linux).</p>
      </li>
      <li>
        <p>Run the following commands to set your user name and email in Git:</p>
        <pre>git config --global user.email "ada@triply.cc"
git config --global user.name "Ada Lovelace"</pre>
        <p>This information will be used in the Git version history for the TriplyETL project. This allows your team to keep track of who made which change.</p>
      </li>
    </ol>
  </dd>
  <dt>Install Node.js (simple approach)</dt>
  <dd>
    <p>Go to <a href="https://nodejs.org" target="_blank">nodejs.org</a> and click on option “18.x.y LTS (Recommended For Most Users)”. This will download the installer for your operating system. Run the installer on your computer.</p>
    <p>On Windows, you must also select the number of bits on your computer: 32 or 64. The correct number of bits is 64 for almost all Windows computers.</p>
  </dd>
  <dt>Install Node.js (advanced approach)</dt>
  <dd>
    <p>For more advanced us, you can install the Node Version Manager (<code>nvm</code>). This allows you to install multiple versions of Node.js on the same computer. See the following links for more information:</p>
    <dl>
      <dt>On Windows</dt>
      <dd>You can following <a href="https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm" target="_blank">the official instructions from Microsoft</a> for installing NVM on Windows.</dd>
      <dt>On macOS or Linux</dt>
      <dd>You can follow the instructions for <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm" target="_blank">installing NVM on any operating system</a> (including macOS and Linux).</dd>
    </dl>
  </dd>
  <dt>Find a terminal application</dt>
  <dd>
    <p>You must use a terminal application in order to run commands from the <a href="./cli.md">TriplyETL CLI</a>. Here are some examples of terminal applications on different operating systems:</p>
    <dl>
      <dt>On Windows</dt>
      <dd>Most Windows versions come with some version of PowerShell preinstalled. You can also follow <a href="https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3#install-powershell-using-winget-recommended" target="_blank">these instructions by Microsoft</a> to update to the latest version of PowerShell.</dd>
      <dt>On macOS</dt>
      <dd>Most macOS version come with a <a href="https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac" target="_blank">Terminal application</a> preinstalled.</dd>
      <dt>On Linux</dt>
      <dd>Most Linux versions come with a preinstalled terminal application. For example, on Ubuntu the <a href="https://help.gnome.org/users/gnome-terminal/stable/" target="_blank">GNOME Terminal application</a> is preinstalled.</dd>
    </dl>
  </dd>
</dl>


### Minimum versions

TriplyETL requires the following minimum versions for the prerequisites:

- NPM v10.2.1
- Node.js v18


### Update the prerequisites

<dl>
  <dt>Update NPM</dt>
  <dd>
    <p>If you have NPM installed, you can run <code>npm -v</code> to see your current version. If you want to upgrade to a different version (for example 10.2.1), you can run the following command:</p>
    <pre>npm install -g npm@10.2.1</pre>
    <p>For more information see NPM's <a href="https://docs.npmjs.com/try-the-latest-stable-version-of-npm">"try latest stable version of npm"</a> documentation.</p>
  </dd>
  <dt>Update Node.js</dt>
  <dd>
    <p>If you have Node.js installed, you can run <code>node -v</code> to see your current version. If you want to upgrade to a different version you need to use a Node package manager (e.g. <code>nvm</code>, <code>n</code> etc.). For more information visit <a href="https://nodejs.org/en/download/package-manager">Installing Node.js via package manager</a>.</p>
  </dd>
  <dt>Update Git</dt>
  <dd>
    <p>If you have Git installed, you can run <code>git -v</code> to see your current version, if you want to upgrade to latest version you can:</p>
    <dl>
      <dt>Linux</dt>
      <dd>
        <p>Run command <code>sudo apt-get update && sudo apt-get install git</code></p>
      </dd>
      <dt>Windows</dt>
      <dd>
        <p>What you need to do depends on your current Git version:</p>
        <dl>
          <dt>Older than 2.14.1</dt>
          <dd>
            <p>Uninstall Git from your system and reinstall <a href="https://git-scm.com/downloads">Git for Windows</a>.</p>
          </dd>
          <dt>Between 2.14.2 and 2.16.1</dt>
          <dd>
            <p>Run command <code>git update</code></p>
          </dd>
          <dt>Greater than or equal to 2.16.1</dt>
          <dd>
            <p>Run command <code>git update-git-for-windows</code></p>
          </dd>
        </dl>
      </dd>
      <dt>MacOS (with Homebrew)</dt>
      <dd>
        <ol>
          <li>
            <p>Install <a href="https://brew.sh">Homebrew</a></p>
          </li>
          <li>
            <p>Run command <code>brew update && brew install git && brew upgrade git</code></p>
          </li>
        </ol>
      </dd>
    </dl>
  </dd>
</dl>



## TriplyETL Generator

### Package Requirements

The TriplyETL Generator allows you to create new ETL projects in your terminal application. If a TriplyETL project already exists, use the [TriplyETL Runner](./cli.md#triplyetl-runner) instead.

In order to use TriplyETL Generator, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A TriplyETL License Key. Contact [info@triply.cc](mailto:info@triply.cc) to obtain a License Key for your organization.

3. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Run the following command to install the TriplyETL Generator:

```
npm install -g @triply/etl-generator
```

Run the following command to use the TriplyETL Generator:

```sh
npx @triply/etl-generator
```

When asked, enter the following information:

      a. TriplyETL License Key

      b. Project name

      c. Target folder

      d. Dataset name

      e. TriplyDB API Token

      f. TriplyDB URL

      g. TriplyDB email

      h. TriplyDB password

Here is an example of a possible run:

```sh
? TriplyETL License Key: [hidden]
? Project name: my-etl
? Target folder: my-etl
? Dataset name: my-etl
? Create a new TriplyDB API Token? Yes
? Your TriplyDB URL: triplydb.com
? Your TriplyDB email: my-account@my-organization.com
? Your TriplyDB password: [hidden]
🏁 Your project my-etl is ready for use in my-etl.
```

Go to the target folder that you have specified:

```sh
cd my-etl
```

You can now use the [TriplyETL Runner](./cli.md#triplyetl-runner) to run the ETL:

```sh
npx etl
```



## TriplyETL Runner

The TriplyETL Runner allows you to run a local TriplyETL project in your terminal application.

In order to use TriplyETL Runner, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Perform the following steps to use the TriplyETL Runner:

Create a local copy of an existing ETL project.

   If you do not have access to an existing TriplyETL project yet, use the [TriplyETL Generator](#triplyetl-generator) to create a new one.

   If you have access to an existing TriplyETL project, use the following command to make a local copy with Git:

```sh
git clone ssh://git@git.triply.cc:10072/customers/my-org/my-project.git
```

Once you have created a local copy of an existing ETL project, go into the corresponding directory:

```sh
cd my-project
```

Install the dependencies:

```sh
npm i
```

Transpile the TypeScript files into JavaScript:

```sh
npm run build
```

You can now use the TriplyETL Runner:

```sh
npx etl
```

At this point, you should see a first TriplyETL process in your terminal application. If this is not the case, please contact [support@triply.cc](mailto:support@triply.cc) to help you out.

Visit the [TriplyETL CLI documentation](./cli.md#triplyetl-runner) to learn more about how you can use the TriplyETL Runner. Visit the [TriplyETL CI/CD documentation](./maintenance.md#configure-cicd) to learn more about how you can automate TriplyETL runs.



## TriplyETL Library

If you are a software developer that is building a software application in TypeScript, you can include the TriplyETL Library in your project.

In order to use the TriplyETL Library, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A TriplyETL License Key. Contact [info@triply.cc](mailto:info@triply.cc) to obtain a License Key for your organization.

3. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Perform the following steps to use the TriplyETL Library:

Open the file `.npmrc` in your text editor, or create the file if it does not yet exist. Add the following content:

```
@triplydb:registry=https://git.triply.cc/api/v4/packages/npm/
@triplyetl:registry=https://git.triply.cc/api/v4/packages/npm/
//git.triply.cc/api/v4/packages/npm/:_authToken={LICENSE_KEY}
```

Replace `{LICENSE_KEY}` with your TriplyETL License Key. Contact [support@triply.cc](mailto:support@triply.cc) if you do not have such a license key yet.

Run the following command to add the TriplyETL dependency to your `package.json` file:

```sh
npm i @triplyetl/etl
```

Open one of the TypeScript files in your software project. When you add the following line to the top of your file, it should be recognized by your TypeScript editor:

```ts
import { sdo } from '@triplyetl/vocabularies'
```
