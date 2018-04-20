# silent-verror [![Build Status](https://travis-ci.org/nmccreadu/silent-verror.svg)](https://travis-ci.org/nmcccready/silent-verror)

An error subclass for humanized ([even more humanized](https://github.com/joyent/node-verror)) errors. This module allows for inter-module detection of errors which are fatal, but where a stacktrace by default provides negative value.

Inspired by (slight mod) [silent-error](https://github.com/ember-cli/silent-error) but to use VError under the hood.

Some use-cases:

* command in your CLI tool is missing
* plugin to your build system is given invalid user-input.

Obviously stack traces can still be valuable. To view the stacks, the following environment variable can be set to `true`

```sh
SILENT_ERROR=verbose <run program>
```

## Example

```js
// in one node module
async function runCommand(name) {
   // some logic
   throw new SilentVError(`command: '${name}' is not installed`);
}
```

```js
// in another node_module
async function caller() {

  try {
    await runCommand('foo');
  } catch(e) {
    SilentVError.debugOrThrow(e);
  }

  SilentVError.debugOrThrow
}
```

## Installation

```sh
yarn add silent-verror
```

or

```sh
npm install --save silent-verror
```
