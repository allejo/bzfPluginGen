import { CPPClass } from 'aclovis';
import MapObjectChunk from '../MapObjectChunk';
import PluginBuilder from '../../PluginBuilder';
import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'register default attribute registration',
        setup: (def: PluginBuilder) => {
            def.addMapObject({
                name: 'ahod',
                uuid: 'ahod',
                properties: [],
            })
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
                    }
                ],
            })
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
    }
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
