import { CPPClass } from 'aclovis';
import MapObjectChunk from '../MapObjectChunk';
import PluginBuilder from '../../PluginBuilder';

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
