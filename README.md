# bzfPluginGen

[![Build Status](https://travis-ci.com/allejo/bzfPluginGen.svg?branch=master)](https://travis-ci.com/allejo/bzfPluginGen)

Generating the skeleton of a BZFlag plug-in can be repetitive, mundance, tedious and synonyms. For this reason, I created a [plug-in starter](https://bzflag-plugin-starter.allejo.org) which started as a monolithic project encompassing everything from UI to C++ generation. I originally moved the C++ generation into its own library, [aclovis](https://github.com/allejo/aclovis), because it was too much to maintain in a single project. Then I tied the [plug-in generation very tightly to Vue](https://github.com/allejo/bzflagPluginStarter2), however that became too much to maintain so I extracted that out to its own library, this.

This library will be dedicated to generating a C++ plug-in skeleton given a JSON object following the [IPlugin TypeScript interface](./src/IPlugin.ts). For now, this project is dedicated to being just a library that you may include. If you'd like to make use of it, you'll have to write your own UI or CLI to make use of it.

## Usage

The library has the `PluginBuilder` and `PluginWriter` classes for you to make use of.

- The `PluginBuilder` is a helper class that will help you build the `IPlugin` interface programmatically and correctly.
- The `PluginWriter` class takes an `IPlugin` object and provides a `write()` method to output the generated C++ code.

## License

[MIT](./LICENSE.md)
