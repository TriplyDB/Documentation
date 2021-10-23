---
title: "Environment Variable"
path: "/docs/environment-variable"
---

This page explains how an environment variable can be specified on different operating systems.

Environment variables are necessary for configuring private [API Tokens](#api-token) that ― for security reasons ― must not be included in source files.

## Configure an environment variable on Windows

On Windows you can configure an environment variable by following these steps:

1. Go to the “View advanced system settings” dialog.

   One way to get to this dialog is by pressing the Windows-key; this opens up the Start menu.  Then type part of the string “View advanced system settings” in order to issue a Windows search.  This will bring up the dialog as one of the top search options.

2. Click on the “Environment Variables” button.  This opens the “Environment Variables” dialog.

3. Click on the “New…” button in the “User variables” section.  This opens the “New User Variable” dialog.

4. Enter the name of the environment variable.

   For example, enter `TRIPLYDB_TOKEN` when creating an environment variable for a TriplyDB token.

5. Enter the value of the environment variable.

   For example, copy/paste your API token in the variable value field when creating an environment variable for a TriplyDB token.

6. Click “OK” three times to to save the environment variable and close the various dialogs.

<h2 id='macos-or-linux-preferred-approach'>Configure an environment variable on macOS or Linux (preferred approach)</h2>

On macOS and Linux it is possible to limit the scope of environment variables to a specific directory (and its subdirectories).  This means that these environment variables are only specified when you are within a specific project directory.

This is the preferred approach for setting environment variables.  It requires the follows steps:

1. Install the [direnv](https://direnv.net) extension.

2. Enter the directory of your project.

   For example `cd my_project` for entering a project directory called `my_project`.

3. Run the following command, replacing `{name}` and `{value}` with the name and value of your environment variable:

   ```sh
   echo export {name}={value} > .envrc
   ```

   This creates a file called `.direnv`.

   Make sure that no whitespace appears around the `=` character.

   For example, when creating an environment variable for an API Token, the above line looks as follows (where `{api-token}` is your copied API Token):

   ```sh
   echo export TRIPLYDB_TOKEN={api-token} > .envrc
   ```

4. Run `direnv allow`.

   This creates a scope for the specified environment variable that is tied to your project directory (and its subdirectories).

5. If you use version management, make sure the exclude file `.envrc` from this.

   For example, if you use Git for version management you can add a line containing `.envrc` to a file called `.gitignore` in your project directory.

## Configure an environment variable on macOS or Linux (alternative approach)

The preferred approach for setting environment variables on macOS and Linux is documented in the [previous subsection](#macos-or-linux-preferred-approach).  However, if you are using macOS or Linux and are unable to install the [direnv](https://direnv.net) extension, then you can still configure environment variables without using direnv.

This requirements the following steps:

1. Look for a text file called `~/.profile` in your user directory and open it in a text editor.

   If this file does not yet exist, you must create it.

2. Add the following line, replacing `{name}` and `{value}` with the name and value of your environment variable:

   ```sh
   export {name}={value}
   ```

   Make sure that no whitespace appears around the `=` character.

3. Restart your terminal session.  This is typically achieved by executing the `exit` command in your current terminal window, and opening a new terminal window afterwards.
