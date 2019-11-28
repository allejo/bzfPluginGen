import PluginBuilder from '../PluginBuilder';
import PluginWriter from '../PluginWriter';

let pluginDef: PluginBuilder;
let pluginWriter: PluginWriter;

beforeEach(() => {
    pluginDef = new PluginBuilder();
    pluginWriter = new PluginWriter(pluginDef.definition);
});

describe('formatting settings', () => {
    test('formatter set to 2 space indentation', () => {
        pluginDef.definition.codeStyle.spacingType = 'twoSpace';

        const fmtr = pluginWriter.getFormatter();

        expect(fmtr.options.indentSpaceCount).toEqual(2);
        expect(fmtr.options.indentWithSpaces).toEqual(true);
        expect(fmtr.indentation).toEqual('  ');
    });

    test('formatter set to 4 space indentation', () => {
        pluginDef.definition.codeStyle.spacingType = 'fourSpace';

        const fmtr = pluginWriter.getFormatter();

        expect(fmtr.options.indentSpaceCount).toEqual(4);
        expect(fmtr.options.indentWithSpaces).toEqual(true);
        expect(fmtr.indentation).toEqual('    ');
    });

    test('formatter set to 4 space indentation', () => {
        pluginDef.definition.codeStyle.spacingType = 'tabs';

        const fmtr = pluginWriter.getFormatter();

        expect(fmtr.options.indentWithSpaces).toEqual(false);
        expect(fmtr.indentation).toEqual('\t');
    });
});

describe('ChunkWriters', () => {
    describe('Additional classes', () => {
        test('there should be no classes by default', () => {
            expect(pluginWriter.getAdditionalClasses()).toHaveLength(0);
        });

        test('there should be one additional class', () => {
            pluginDef.addMapObject({
                uuid: '',
                name: 'sample',
                properties: [],
            });

            const writer = new PluginWriter(pluginDef.definition);
            const additionalClasses = writer.getAdditionalClasses();

            expect(additionalClasses).toHaveLength(1);
            expect(additionalClasses[0].getClassName()).toEqual('SampleZone');
        });
    });
});
