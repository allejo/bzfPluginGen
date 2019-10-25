import { CPPClass } from 'aclovis';
import MapObjectChunk from '../MapObjectChunk';
import PluginBuilder from '../../PluginBuilder';
import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';
import { MapArgumentType } from '../../IMapObject';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'register default attribute registration',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                name: 'ahod',
                uuid: 'ahod',
                properties: [],
            });
        },
        expected: `
bool TestClass::MapObject(bz_ApiString object, bz_CustomMapObjectInfo* data)
{
    // Note, this value will be in uppercase
    if (!data || object != "AHOD")
    {
        return false;
    }

    AhodZone ahodZone;
    ahodZone.handleDefaultOptions(data);

    return true;
}
        `,
    },
    {
        desc: 'Add boolean map properties as boolean class attributes',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                uuid: '',
                name: 'ahod',
                properties: [
                    {
                        uuid: '',
                        name: 'rogueonly',
                        readonly: false,
                        arguments: [],
                    },
                ],
            });
        },
        expected: `
bool TestClass::MapObject(bz_ApiString object, bz_CustomMapObjectInfo* data)
{
    // Note, this value will be in uppercase
    if (!data || object != "AHOD")
    {
        return false;
    }

    AhodZone ahodZone;
    ahodZone.handleDefaultOptions(data);

    for (unsigned int i = 0; i < data->data.size(); i++)
    {
        std::string line = data->data.get(i);
        std::string normalizedLine = bz_toupper(line);

        if (normalizedLine == "ROGUEONLY")
        {
            ahodZone.rogueonly = true;
            continue;
        }
    }

    return true;
}
        `,
    },
    {
        desc: 'Add casting options to all types of map object arguments',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                uuid: '',
                name: 'ahod',
                properties: [
                    {
                        uuid: '',
                        name: 'message',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'value',
                                type: MapArgumentType.String,
                            },
                        ],
                    },
                    {
                        uuid: '',
                        name: 'delay',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'x',
                                type: MapArgumentType.Int,
                            },
                            {
                                uuid: '',
                                name: 'y',
                                type: MapArgumentType.Int,
                            },
                        ],
                    },
                    {
                        uuid: '',
                        name: 'angle',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'value',
                                type: MapArgumentType.Double,
                            },
                        ],
                    },
                    {
                        uuid: '',
                        name: 'team',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'value',
                                type: MapArgumentType.Team,
                            },
                        ],
                    },
                    {
                        uuid: '',
                        name: 'percent',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'one',
                                type: MapArgumentType.Float,
                            },
                            {
                                uuid: '',
                                name: 'two',
                                type: MapArgumentType.Int,
                            },
                        ],
                    },
                ],
            });
        },
        expected: `
bool TestClass::MapObject(bz_ApiString object, bz_CustomMapObjectInfo* data)
{
    // Note, this value will be in uppercase
    if (!data || object != "AHOD")
    {
        return false;
    }

    AhodZone ahodZone;
    ahodZone.handleDefaultOptions(data);

    for (unsigned int i = 0; i < data->data.size(); i++)
    {
        std::string line = data->data.get(i);

        bz_APIStringList nubs;
        nubs.tokenize(line.c_str(), " ", 0, true);

        if (nubs.size() > 0)
        {
            std::string key = bz_toupper(nubs.get(0).c_str());

            if (key == "MESSAGE")
            {
                ahodZone.message_value = nubs.get(1).c_str();
            }
            else if (key == "DELAY")
            {
                ahodZone.delay_x = atoi(nubs.get(1).c_str());
                ahodZone.delay_y = atoi(nubs.get(2).c_str());
            }
            else if (key == "ANGLE")
            {
                ahodZone.angle_value = (double)atof(nubs.get(1).c_str());
            }
            else if (key == "TEAM")
            {
                ahodZone.team_value = (bz_eTeamType)atoi(nubs.get(1).c_str());
            }
            else if (key == "PERCENT")
            {
                ahodZone.percent_one = atof(nubs.get(1).c_str());
                ahodZone.percent_two = atoi(nubs.get(2).c_str());
            }
        }
    }

    return true;
}
        `,
    },
    {
        desc: 'Add casting options and flag attributes combined',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                uuid: '',
                name: 'ahod',
                properties: [
                    {
                        uuid: '',
                        name: 'message',
                        readonly: false,
                        arguments: [
                            {
                                uuid: '',
                                name: 'value',
                                type: MapArgumentType.String,
                            },
                        ],
                    },
                    {
                        uuid: '',
                        name: 'rogueonly',
                        readonly: false,
                        arguments: [],
                    },
                ],
            });
        },
        expected: `
bool TestClass::MapObject(bz_ApiString object, bz_CustomMapObjectInfo* data)
{
    // Note, this value will be in uppercase
    if (!data || object != "AHOD")
    {
        return false;
    }

    AhodZone ahodZone;
    ahodZone.handleDefaultOptions(data);

    for (unsigned int i = 0; i < data->data.size(); i++)
    {
        std::string line = data->data.get(i);
        std::string normalizedLine = bz_toupper(line);

        if (normalizedLine == "ROGUEONLY")
        {
            ahodZone.rogueonly = true;
            continue;
        }

        bz_APIStringList nubs;
        nubs.tokenize(line.c_str(), " ", 0, true);

        if (nubs.size() > 0)
        {
            std::string key = bz_toupper(nubs.get(0).c_str());

            if (key == "MESSAGE")
            {
                ahodZone.message_value = nubs.get(1).c_str();
            }
        }
    }

    return true;
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new MapObjectChunk(c, d), tests);

let pluginDef: PluginBuilder;
let pluginClass: CPPClass;
let chunkWriter: MapObjectChunk;

beforeEach(() => {
    pluginDef = new PluginBuilder();
    pluginClass = new CPPClass('TestClass');
});

test('Additional classes should have classes for map object', () => {
    pluginDef.addMapObject({
        uuid: '',
        name: 'ahod',
        properties: [],
    });

    chunkWriter = new MapObjectChunk(pluginClass, pluginDef.definition);
    chunkWriter.process();

    expect(chunkWriter.getAdditionalClasses().length).toEqual(1);
});
