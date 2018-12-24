import { IBZDBSetting } from './IBZDBSetting';
import { ICallback } from './ICallback';
import { IFlag } from './IFlag';
import { IEvent } from './IEvent';
import { ILicense } from './ILicense';
import { IMapObject } from './IMapObject';
import { ISlashCommand } from './ISlashCommand';
import { IPollType } from './IPollType';

export interface IAuthor {
    [key: string]: any;

    /**
     * The author's legal name for the copyright notice.
     */
    copyright: string;

    /**
     * The author's callsign for use in namespaces.
     */
    callsign: string;
}

export interface ICodeStyle {
    [key: string]: any;

    /**
     * Whether to use an if statement or a switch block for event handling in the Event() method.
     */
    useIfStatement: boolean;

    /**
     * Should braces belong on a new line.
     */
    bracesOnNewLine: boolean;

    /**
     * Type of white space should this plug-in use.
     */
    spacingType: 'twoSpace' | 'fourSpace' | 'tabs';

    /**
     * Whether or not to build doc blocks of available attributes for events.
     */
    showDocBlocks: boolean;

    /**
     * Whether or not to build helpful comments throughout the plug-in code.
     */
    showComments: boolean;
}

export default interface IPlugin {
    [key: string]: any;

    /**
     * The human-friendly name of the plug-in. This value will be converted into a C++ friendly version for the class
     * name.
     */
    name: string;

    /**
     * The author of this plug-in.
     */
    author: IAuthor;

    /**
     * The license this plugin will be released under.
     */
    license: ILicense;

    /**
     * The code style this plug-in will use when being generated.
     */
    codeStyle: ICodeStyle;

    /**
     * The events that this plug-in will be listening to.
     */
    events: {
        [key: string]: IEvent;
    };

    /**
     * The slash commands this plug-in will register.
     */
    slashCommands: {
        [key: string]: ISlashCommand;
    };

    /**
     * Callbacks available for inter-plugin communication.
     */
    callbacks: {
        [key: string]: ICallback;
    };

    /**
     * Custom map objects this plug-in will know how to parse.
     */
    mapObjects: {
        [key: string]: IMapObject;
    };

    /**
     * Custom flags this plug-in will register.
     */
    flags: {
        [key: string]: IFlag;
    };

    /**
     * Custom BZDB settings this plug-in will register.
     */
    bzdbSettings: {
        [key: string]: IBZDBSetting;
    };

    /**
     * Custom poll types this plug-in will register.
     */
    pollTypes: {
        [key: string]: IPollType;
    };
}
