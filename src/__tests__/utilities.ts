import { CPPClass, CPPFormatter } from 'aclovis';

import { ChunkWriter } from '../ChunkWriter/ChunkWriter';
import IPlugin from '../IPlugin';
import PluginBuilder from '../PluginBuilder';

export interface ITestCodeDefinition {
    desc: string;
    setup: (def: PluginBuilder) => void;
    expected: string;
}

export const codeStyle: CPPFormatter = new CPPFormatter({
    bracesOnNewLine: true,
    indentWithSpaces: true,
    indentSpaceCount: 4,
});

export function multiLineString(line: string): string {
    return line.replace(/^\n|[\s\n]+$/g, '');
}

export const ITestCodeDefinitionRepeater = (
    chunkType: (c: CPPClass, d: IPlugin) => ChunkWriter,
    tests: ITestCodeDefinition[]
): void => {
    let pluginDef: PluginBuilder;
    let pluginClass: CPPClass;

    beforeEach(() => {
        pluginDef = new PluginBuilder();
        pluginClass = new CPPClass('TestClass');
    });

    for (let i = 0; i < tests.length; i++) {
        const testDef = tests[i];

        test(testDef.desc, () => {
            testDef.setup(pluginDef);

            const chunk = chunkType(pluginClass, pluginDef.definition);
            chunk.process();

            const methods = pluginClass.getMethods();
            const output: string[] = [];

            chunk.getIdentifiers().forEach((value: string) => {
                const method = methods[value];
                output.push(method.functionDef.write(codeStyle, 0));
            });

            expect(output.join('\n\n')).toEqual(multiLineString(testDef.expected));
        });
    }
};
