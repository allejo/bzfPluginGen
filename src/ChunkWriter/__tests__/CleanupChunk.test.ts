import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import { BZDBType } from '../../IBZDBSetting';
import { CPPClass } from 'aclovis';
import CleanupChunk from '../CleanupChunk';
import PluginBuilder from '../../PluginBuilder';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'render method with just Flush() call',
        setup: () => {},
        expected: `
void TestClass::Cleanup()
{
    Flush();
}
        `,
    },
    {
        desc: 'render method with Flush() call and slash commands',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'ican',
            });
            def.addSlashCommand({
                name: 'seethefuture',
            });
        },
        expected: `
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomSlashCommand("ican");
    bz_removeCustomSlashCommand("seethefuture");
}
        `,
    },
    {
        desc: 'render method with Flush() and map objects',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                uuid: '',
                name: 'customzone',
                properties: [],
            });
        },
        expected: `
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomMapObject("CUSTOMZONE");
}
        `,
    },
    {
        desc: 'render method with Flush(), slash commands, and map objects',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'command',
            });
            def.addMapObject({
                uuid: '',
                name: 'customzone',
                properties: [],
            });
        },
        expected: `
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomSlashCommand("command");

    bz_removeCustomMapObject("CUSTOMZONE");
}
        `,
    },
    {
        desc: 'render method with Flush() and all removal types',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'command',
            });
            def.addMapObject({
                uuid: '',
                name: 'customzone',
                properties: [],
            });
            def.addBZDBSetting({
                name: '_setting',
                type: BZDBType.Int,
                value: 0,
            });
            def.addPollType({
                name: 'mapchange',
            });
        },
        expected: `
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomSlashCommand("command");

    bz_removeCustomMapObject("CUSTOMZONE");

    bz_removeCustomBZDBVariable("_setting");

    bz_removeCustomPollType("mapchange");
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new CleanupChunk(c, d), tests);

let pluginDef: PluginBuilder;
let pluginClass: CPPClass;

beforeEach(() => {
    pluginDef = new PluginBuilder();
    pluginClass = new CPPClass('TestClass');
});

test('add Cleanup() method to plugin class', () => {
    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const methods = Object.keys(pluginClass.getMethods());

    expect(methods).toContain(chunk.getIdentifier());
});
