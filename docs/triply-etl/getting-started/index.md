# Getting Started

This page helps you to get started with TriplyETL. You can get started with TriplyETL in any of the following ways:

1. [TriplyETL Generator](#triplyetl-generator) creates a new ETL project based on your answers to a set of question.
2. [TriplyETL Runner](#triplyetl-runner) runs an existing ETL project.
3. [TriplyETL Library](#triplyetl-library) can be included as a dependency in your TypeScript project.



# Prerequisites 

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
    <p>Go to <href="https://nodejs.org" target="_blank">nodejs.org</a> and click on option “18.x.y LTS (Recommended For Most Users)”. This will download the installer for your operating system. Run the installer on your computer.</p>
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
    <p>You must use a terminal application in order to run commands from the <a href="/triply-etl/cli/">TriplyETL CLI</a>. Here are some examples of terminal applications on different operating systems:</p>
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



# TriplyETL Generator <!-- {#generator} -->

The TriplyETL Generator allows you to create new ETL projects in your terminal application.

If a TriplyETL project already exists, use the [TriplyETL Runner](/triply-etl/cli/#triplyetl-runner) instead.

In order to use TriplyETL Generator, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A TriplyETL License Key. Contact [info@triply.cc](mailto:info@triply.cc) to obtain a License Key for your organization.

3. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Perform the following steps to use the TriplyETL Generator:

1. Run the following command:

   ```sh
   npx triply-etl-generator
   ```

   If you use TriplyETL Generator for the first time, this command automatically downloads and installs the latest version on your computer. If you have used TriplyETL Generator in the past, this command automatically updates your installation to the latest version.

2. When asked, enter the following information:

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

3. Go to the target folder that you have specified:

   ```sh
   cd my-etl
   ```

4. You can now use the [TriplyETL Runner](/triply-etl/cli#triplyetl-runner) to run the ETL:

   ```sh
   npx etl
   ```



# TriplyETL Runner <!-- {#runner} -->

The TriplyETL Runner allows you to run a local TriplyETL project in your terminal application.

In order to use TriplyETL Runner, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Perform the following steps to use the TriplyETL Runner:

1. Create a local copy of an existing ETL project.

   If you do not have access to an existing TriplyETL project yet, use the [TriplyETL Generator](#triplyetl-generator) to create a new one.

   If you have access to an existing TriplyETL project, use the following command to make a local copy with Git:

   ```sh
   git clone ssh://git@git.triply.cc:10072/customers/my-org/my-project.git
   ```

2. Once you have created a local copy of an existing ETL project, go into the corresponding directory:

   ```sh
   cd my-project
   ```

3. Install the dependencies:

   ```sh
   npm i
   ```

4. Transpile the TypeScript files into JavaScript:

   ```sh
   npm run build
   ```

5. You can now use the TriplyETL Runner:

   ```sh
   npx etl
   ```

At this point, you should see a first TriplyETL process in your terminal application. If this is not the case, please contact [support@triply.cc](mailto:support@triply.cc) to help you out.

Visit the [TriplyETL CLI documentation](/triply-etl/cli#triplyetl-runner) to learn more about how you can use the TriplyETL Runner. Visit the [TriplyETL CI/CD documentation](/triply-etl/maintenance#configure-cicd) to learn more about how you can automate TriplyETL runs.



# TriplyETL Library <!-- {#library} -->

If you are a software developer that is building a software application in TypeScript, you can include the TriplyETL Library in your project.

In order to use the TriplyETL Library, you must have:

1. Satisfied the [prerequisites](#prerequisites).

2. A TriplyETL License Key. Contact [info@triply.cc](mailto:info@triply.cc) to obtain a License Key for your organization.

3. A user account on a TriplyDB server. Contact [info@triply.cc](mailto:info@triply.cc) to set up a TriplyDB server for your organization, or create a free account on <https://triplydb.com>.

Perform the following steps to use the TriplyETL Library:

1. Open the file `.npmrc` in your text editor, or create the file if it does not yet exist. Add the following content:

   ```
   @triplydb:registry=https://git.triply.cc/api/v4/packages/npm/
   @triplyetl:registry=https://git.triply.cc/api/v4/packages/npm/
   //git.triply.cc/api/v4/packages/npm/:_authToken={LICENSE_KEY}
   ```

   Replace `{LICENSE_KEY}` with your TriplyETL License Key. Contact [support@triply.cc](mailto:support@triply.cc) if you do not have such a license key yet.

  2. Run the following command to add the TriplyETL dependency to your `package.json` file:

     ```sh
     npm i @triplyetl/etl
     ```

  3. Open one of the TypeScript files in your software project. When you add the following line to the top of your file, it should be recognized by your TypeScript editor:

     ```ts
     import { sdo } from '@triplyetl/etl/vocab'
     ```
