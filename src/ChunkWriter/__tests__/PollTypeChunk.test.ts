import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import PluginBuilder from '../../PluginBuilder';
import PollTypeChunk from '../PollTypeChunk';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'create a poll type',
        setup: (def: PluginBuilder) => {
            def.addPollType({
                name: 'mapchange',
            });
        },
        expected: `
bool TestClass::PollOpen(bz_BasePlayerRecord* player, const char* _action, const char* _parameters)
{
    std::string action = _action;
    std::string parameters = _parameters;

    if (action == "mapchange")
    {

        return true;
    }

    return false;
}

void TestClass::PollClose(const char* _action, const char* _parameters, bool success)
{
    std::string action = _action;
    std::string parameters = _parameters;

    if (action == "mapchange")
    {
        if (success)
        {

        }
        else
        {

        }
    }
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new PollTypeChunk(c, d), tests);
