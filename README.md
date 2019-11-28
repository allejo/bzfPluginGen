# bzfPluginGen

[![Build Status](https://travis-ci.com/allejo/bzfPluginGen.svg?branch=master)](https://travis-ci.com/allejo/bzfPluginGen)
[![Coverage Status](https://coveralls.io/repos/github/allejo/bzfPluginGen/badge.svg?branch=master)](https://coveralls.io/github/allejo/bzfPluginGen?branch=master)
[![Latest release](https://img.shields.io/github/v/release/allejo/bzfPluginGen?include_prereleases)](https://github.com/allejo/bzfPluginGen/releases/latest)

Generating the skeleton of a BZFlag plug-in can be repetitive, mundane, tedious and synonyms. This library will be dedicated to generating a C++ plug-in skeleton given a JSON object following the [IPlugin TypeScript interface](./src/IPlugin.ts).

There is no UI or CLI tool in this repo for you to run and test. If you are looking for a web-based UI, take a look at [BZFlag Plug-in Starter v3](https://github.com/allejo/bzflagPluginStarter3).

## Usage

The library has the [`PluginBuilder`](./src/PluginBuilder.ts) and [`PluginWriter`](./src/PluginWriter.ts) classes for you to make use of.

- The `PluginBuilder` is a helper class that will help you build the `IPlugin` interface programmatically and correctly.
- The `PluginWriter` class takes an `IPlugin` object and provides a `write()` method to output the generated C++ code.

## License

[MIT](./LICENSE.md)
