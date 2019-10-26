import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';

import EventChunk from '../EventChunk';
import PluginBuilder from '../../PluginBuilder';

const tests: ITestCodeDefinition[] = [
    {
        desc: 'should output an event with data parameters in a switch statement',
        setup: (def: PluginBuilder) => {
            def.addEvent({
                dataType: 'bz_RandomEventData',
                description: 'This event is called randomly',
                name: 'bz_eRandomEvent',
                since: '2.4.0',
                parameters: [
                    {
                        dataType: 'bz_ApiString',
                        name: 'message',
                        description: 'A message sent in this event',
                    },
                    {
                        dataType: 'int',
                        name: 'someSuperLongVariableName',
                        description: 'Some random value that is not actually useful',
                    },
                ],
            });
            def.addEvent({
                dataType: '',
                description: 'This is a notification only event',
                name: 'bz_NotificationOnly',
                since: '2.4.0',
                parameters: [],
            });
        },
        expected: `
void TestClass::Event(bz_EventData* eventData)
{
    switch (eventData->eventType)
    {
        case bz_NotificationOnly:
        {
            // This is a notification only event
        }
        break;

        case bz_eRandomEvent:
        {
            // This event is called randomly
            bz_RandomEventData* data = (bz_RandomEventData*)eventData;

            // Data
            // ----
            // (bz_ApiString) message                   - A message sent in this event
            // (int)          someSuperLongVariableName - Some random value that is not actually useful
        }
        break;

        default:
            break;
    }
}
        `,
    },
    {
        desc: 'should output an event with data parameters in a if statement',
        setup: (def: PluginBuilder) => {
            def.definition.codeStyle.useIfStatement = true;

            def.addEvent({
                dataType: 'bz_RandomEventData',
                description: 'This event is called randomly',
                name: 'bz_eRandomEvent',
                since: '2.4.0',
                parameters: [
                    {
                        dataType: 'bz_ApiString',
                        name: 'message',
                        description: 'A message sent in this event',
                    },
                    {
                        dataType: 'int',
                        name: 'someSuperLongVariableName',
                        description: 'Some random value that is not actually useful',
                    },
                ],
            });
            def.addEvent({
                dataType: '',
                description: 'This is a notification only event',
                name: 'bz_NotificationOnly',
                since: '2.4.0',
                parameters: [],
            });
        },
        expected: `
void TestClass::Event(bz_EventData* eventData)
{
    if (eventData->eventType == bz_NotificationOnly)
    {
        // This is a notification only event
    }
    else if (eventData->eventType == bz_eRandomEvent)
    {
        // This event is called randomly
        bz_RandomEventData* data = (bz_RandomEventData*)eventData;

        // Data
        // ----
        // (bz_ApiString) message                   - A message sent in this event
        // (int)          someSuperLongVariableName - Some random value that is not actually useful
    }
}
        `,
    },
    {
        desc: 'should not show doc blocks when disabled',
        setup: (def: PluginBuilder) => {
            def.definition.codeStyle.useIfStatement = true;
            def.definition.codeStyle.showDocBlocks = false;

            def.addEvent({
                dataType: 'bz_RandomEventData',
                description: 'This event is called randomly',
                name: 'bz_eRandomEvent',
                since: '2.4.0',
                parameters: [
                    {
                        dataType: 'bz_ApiString',
                        name: 'message',
                        description: 'A message sent in this event',
                    },
                    {
                        dataType: 'int',
                        name: 'someSuperLongVariableName',
                        description: 'Some random value that is not actually useful',
                    },
                ],
            });
            def.addEvent({
                dataType: '',
                description: 'This is a notification only event',
                name: 'bz_NotificationOnly',
                since: '2.4.0',
                parameters: [],
            });
        },
        expected: `
void TestClass::Event(bz_EventData* eventData)
{
    if (eventData->eventType == bz_NotificationOnly)
    {
        // This is a notification only event
    }
    else if (eventData->eventType == bz_eRandomEvent)
    {
        // This event is called randomly
        bz_RandomEventData* data = (bz_RandomEventData*)eventData;
    }
}
        `,
    },
    {
        desc: 'should not show comments when comments are disabled',
        setup: (def: PluginBuilder) => {
            def.definition.codeStyle.useIfStatement = true;
            def.definition.codeStyle.showComments = false;

            def.addEvent({
                dataType: 'bz_RandomEventData',
                description: 'This event is called randomly',
                name: 'bz_eRandomEvent',
                since: '2.4.0',
                parameters: [
                    {
                        dataType: 'bz_ApiString',
                        name: 'message',
                        description: 'A message sent in this event',
                    },
                    {
                        dataType: 'int',
                        name: 'someSuperLongVariableName',
                        description: 'Some random value that is not actually useful',
                    },
                ],
            });
            def.addEvent({
                dataType: '',
                description: 'This is a notification only event',
                name: 'bz_NotificationOnly',
                since: '2.4.0',
                parameters: [],
            });
        },
        expected: `
void TestClass::Event(bz_EventData* eventData)
{
    if (eventData->eventType == bz_NotificationOnly)
    {
    }
    else if (eventData->eventType == bz_eRandomEvent)
    {
        bz_RandomEventData* data = (bz_RandomEventData*)eventData;

        // Data
        // ----
        // (bz_ApiString) message                   - A message sent in this event
        // (int)          someSuperLongVariableName - Some random value that is not actually useful
    }
}
        `,
    },
];

ITestCodeDefinitionRepeater((c, d) => new EventChunk(c, d), tests);
