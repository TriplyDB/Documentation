---
title: "Editor support"
path: "/docs/editor"
---

When editing TypeScript files in [TriplyDB.js applications](../triplydb-js) or [RATT pipelines](../ratt), it is useful to receive good feedback from your text editor.  This page explains how to configure text editors that provide such assistance.

1. Install a text editor like [Atom](https://atom.io) or [Visual Studio Code](https://code.visualstudio.com).

2. Open file `tsconfig.json` in your TriplyDB.js or RATT project, and make sure the following settings are included:

   ```json
   'target': 'es2017',
   'lib': ['es6'],
   ```

   This ensures that a recent enough version of TypeScript is used.

3. You can start the text editor within your TriplyDB.js or RATT project by running `atom .` or `code .`

#### Atom-specific configuration

The following additional configuration steps can be performed in the [Atom](https://atom.io) text editor:

1. Go to the Atom settings page (`Ctrl + ,`).

2. Go the the “Install” page.

3. Install the [`atom-typescript`](https://atom.io/packages/atom-typescript) package.  This provides additional support for programming in TypeScript.

4. Install the [Script](https://atom.io/packages/script) package.  This allows you to run your TriplyDB.js script from within the text editor.
