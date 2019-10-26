import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import CallbackChunk from '../CallbackChunk';
import PluginBuilder from '../../PluginBuilder';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'should output an event with data parameters in a switch statement',
        setup: (def: PluginBuilder) => {
            def.addCallback({
                name: 'calcBonusPoints',
            });
            def.addCallback({
                name: 'isFairCapture',
            });
        },
        expected: `
int TestClass::GeneralCallback(const char* name, void* data)
{
    if (!name)
    {
        return -1;
    }

    std::string callback = name;

    if (callback == "calcBonusPoints")
    {

        return 1;
    }
    else if (callback == "isFairCapture")
    {

        return 1;
    }

    return 0;
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new CallbackChunk(c, d), tests);
