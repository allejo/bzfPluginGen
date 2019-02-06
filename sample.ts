import { CPPClass } from 'aclovis';
import { MapArgumentType } from './src/IMapObject';
import { codeStyle } from './src/__tests__/utilities';
import MapObjectChunk from './src/ChunkWriter/MapObjectChunk';
import PluginBuilder from './src/PluginBuilder';
import PollTypeChunk from './src/ChunkWriter/PollTypeChunk';

const cls = new CPPClass('TestClass');
const def = new PluginBuilder();

def.addPollType({
    name: 'mapchange',
});

def.addMapObject({
    uuid: '',
    name: 'ahod',
    properties: [
        {
            uuid: '',
            name: 'position|pos',
            readonly: true,
            arguments: [
                {
                    uuid: '',
                    name: 'x_pos',
                    type: MapArgumentType.Float,
                },
                {
                    uuid: '',
                    name: 'y_pos',
                    type: MapArgumentType.Float,
                },
                {
                    uuid: '',
                    name: 'z_pos',
                    type: MapArgumentType.Float,
                },
            ],
        },
        {
            uuid: '',
            name: 'size',
            readonly: true,
            arguments: [
                {
                    uuid: '',
                    name: 'x_size',
                    type: MapArgumentType.Float,
                },
                {
                    uuid: '',
                    name: 'y_size',
                    type: MapArgumentType.Float,
                },
                {
                    uuid: '',
                    name: 'z_size',
                    type: MapArgumentType.Float,
                },
            ],
        },
        {
            uuid: '',
            name: 'rotation|rot',
            readonly: true,
            arguments: [
                {
                    uuid: '',
                    name: 'rotation',
                    type: MapArgumentType.Float,
                },
            ],
        },
        {
            uuid: '',
            name: 'teamonly',
            readonly: false,
            arguments: [],
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
    ],
});

def.addMapObject({
    uuid: '',
    name: 'deck',
    properties: [],
});

const chunk = new MapObjectChunk(cls, def.definition);
chunk.process();

const chunk2 = new PollTypeChunk(cls, def.definition);
chunk2.process();

// chunk.getAdditionalClasses().forEach(value => {
//     console.log(value.write(codeStyle, 0));
// });

console.log(cls.write(codeStyle, 0));
