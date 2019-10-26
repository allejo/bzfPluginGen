import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import PluginBuilder from '../../PluginBuilder';
import SlashCommandChunk from '../SlashCommandChunk';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'should output an event with data parameters in a switch statement',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'killall',
            });

            def.addSlashCommand({
                name: 'ban',
            });
        },
        expected: `
bool TestClass::SlashCommand(int playerID, bz_ApiString command, bz_ApiString /*message*/, bz_APIStringList *params)
{
    if (command == "killall")
    {

        return true;
    }
    else if (command == "ban")
    {

        return true;
    }

    return false;
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new SlashCommandChunk(c, d), tests);
