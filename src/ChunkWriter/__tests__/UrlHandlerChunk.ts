import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import PluginBuilder from '../../PluginBuilder';
import UrlHandlerChunk from '../UrlHandlerChunk';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'makes URL calls',
        setup: (def: PluginBuilder) => {
            def.definition.makesUrlCalls = true;
        },
        expected: `
void TestClass::URLDone(const char* URL, const void* data, unsigned int size, bool complete)
{
    std::string webData = (const char*)data;

    if (!complete)
    {
        return;
    }

    // The URL call completed successfully
}

void TestClass::URLTimeout(const char* URL, int errorCode)
{
    // This method is called when a URL call times out; handle fallback behavior here
}

void TestClass::URLError(const char* URL, int errorCode, const char* errorString)
{
    // Something went wrong during the URL call; handle fallback behavior here
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new UrlHandlerChunk(c, d), tests);
