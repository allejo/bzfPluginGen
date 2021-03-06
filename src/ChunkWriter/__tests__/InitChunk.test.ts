import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import { BZDBType } from '../../IBZDBSetting';
import { FlagType } from '../../IFlag';
import InitChunk from '../InitChunk';
import PluginBuilder from '../../PluginBuilder';
import { getIEventMock } from '../../__tests__/mocks/IEventMock';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'Init() should render a single slash command registration with nothing else',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'test',
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_registerCustomSlashCommand("test", this);
}
        `,
    },
    {
        desc: 'Init() should render plugin events',
        setup: (def: PluginBuilder) => {
            def.addEvent(getIEventMock({ name: 'bz_eSomeEvent' }));
            def.addEvent(getIEventMock({ name: 'bz_eOtherEvent' }));
        },
        expected: `
void TestClass::Init(const char* config)
{
    Register(bz_eSomeEvent);
    Register(bz_eOtherEvent);
}
        `,
    },
    {
        desc: 'Init() should render plugin events and slash commands',
        setup: (def: PluginBuilder) => {
            def.addEvent(getIEventMock({ name: 'bz_eSomeEvent' }));
            def.addEvent(getIEventMock({ name: 'bz_eOtherEvent' }));

            def.addSlashCommand({ name: 'command' });
        },
        expected: `
void TestClass::Init(const char* config)
{
    Register(bz_eSomeEvent);
    Register(bz_eOtherEvent);

    bz_registerCustomSlashCommand("command", this);
}
        `,
    },
    {
        desc: 'Init() should register a clip field with a given callsign',
        setup: (def: PluginBuilder) => {
            def.definition.author.callsign = 'allejo';
            def.addCallback({ name: 'generic' });
        },
        expected: `
void TestClass::Init(const char* config)
{
    // Namespace our clip fields to avoid plug-in conflicts
    bz_setclipFieldString("allejo/TestClass", Name());
}
        `,
    },
    {
        desc: 'Init() should register a clip field but without comments',
        setup: (def: PluginBuilder) => {
            def.definition.author.callsign = 'allejo';
            def.definition.codeStyle.showComments = false;

            def.addCallback({ name: 'generic' });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_setclipFieldString("allejo/TestClass", Name());
}
        `,
    },
    {
        desc: 'Init() should register BZDB settings with the appropriate function calls based on types and order',
        setup: (def: PluginBuilder) => {
            def.addBZDBSetting({
                name: 'myDefaultFalsyBool',
                type: BZDBType.Bool,
                value: false,
            });
            def.addBZDBSetting({
                name: 'myDefaultTruthyBool',
                type: BZDBType.Bool,
                value: true,
            });
            def.addBZDBSetting({
                name: 'myString',
                type: BZDBType.String,
                value: 'Sky Blue',
            });
            def.addBZDBSetting({
                name: 'myDouble',
                type: BZDBType.Double,
                value: 0.5,
            });
            def.addBZDBSetting({
                name: 'myInt',
                type: BZDBType.Int,
                value: 5,
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_registerCustomBZDBBool("_myDefaultFalsyBool", false, 0, false);
    bz_registerCustomBZDBBool("_myDefaultTruthyBool", true, 0, false);
    bz_registerCustomBZDBString("_myString", "Sky Blue", 0, false);
    bz_registerCustomBZDBDouble("_myDouble", 0.5, 0, false);
    bz_registerCustomBZDBInt("_myInt", 5, 0, false);
}
        `,
    },
    {
        desc: 'Init() should register custom flags',
        setup: (def: PluginBuilder) => {
            def.addFlag({
                name: 'Custom Flag',
                abbreviation: 'CF',
                helpString: 'A custom flag with a description',
                type: FlagType.Good,
            });
            def.addFlag({
                name: 'Bad Flag',
                abbreviation: 'BF',
                helpString: 'A flag that is bad, somehow...',
                type: FlagType.Bad,
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_RegisterCustomFlag("CF", "Custom Flag", "A custom flag with a description", 0, eGoodFlag);
    bz_RegisterCustomFlag("BF", "Bad Flag", "A flag that is bad, somehow...", 0, eBadFlag);
}
        `,
    },
    {
        desc: 'Init() should register custom map objects',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                name: 'jail',
                uuid: '',
                properties: [],
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_registerCustomMapObject("JAIL", this);
}
        `,
    },
    {
        desc: 'Init() should register custom poll types',
        setup: (def: PluginBuilder) => {
            def.addPollType({
                name: 'mapchange',
                parameters: ['mapname'],
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_registerCustomPollType("mapchange", "mapname", this);
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new InitChunk(c, d), tests);
