import { IBZDBSetting } from './IBZDBSetting';
import { ICallback } from './ICallback';
import { IEvent } from './IEvent';
import { IFlag } from './IFlag';
import { IMapObject } from './IMapObject';
import IPlugin from './IPlugin';
import { IPollType } from './IPollType';
import { ISlashCommand } from './ISlashCommand';
import { NullLicense } from './ILicense';

export default class PluginBuilder {
    public definition: IPlugin;

    constructor() {
        this.definition = {
            name: 'Sample Plugin',
            author: {
                copyright: '',
                callsign: '',
            },
            license: NullLicense,
            codeStyle: {
                useIfStatement: false,
                bracesOnNewLine: true,
                spacingType: 'fourSpace',
                showDocBlocks: true,
                showComments: true,
            },
            events: {},
            slashCommands: {},
            callbacks: {},
            mapObjects: {},
            flags: {},
            bzdbSettings: {},
            pollTypes: {},
        };

        Object.seal(this.definition);
    }

    addEvent(event: IEvent) {
        this.definition.events[event.name] = event;
    }

    removeEvent(event: IEvent | String | string) {
        this.safeRemove('events', event, 'name');
    }

    addSlashCommand(command: ISlashCommand) {
        PluginBuilder.normalizeSlashCommand(command);

        this.definition.slashCommands[command.name] = command;
    }

    removeSlashCommand(command: ISlashCommand | String | string) {
        this.safeRemove('slashCommands', command, 'name');
    }

    addCallback(callback: ICallback) {
        this.definition.callbacks[callback.name] = callback;
    }

    removeCallback(callback: ICallback | String | string) {
        this.safeRemove('callbacks', callback, 'name');
    }

    addMapObject(mapObject: IMapObject) {
        PluginBuilder.normalizeMapObject(mapObject);

        this.definition.mapObjects[mapObject.name] = mapObject;
    }

    removeMapObject(mapObject: IMapObject | String | string) {
        this.safeRemove('mapObjects', mapObject, 'name');
    }

    addFlag(flag: IFlag) {
        PluginBuilder.normalizeFlag(flag);

        this.definition.flags[flag.abbreviation] = flag;
    }

    removeFlag(flag: IFlag | String | string) {
        this.safeRemove('flags', flag, 'abbreviation');
    }

    addBZDBSetting(bzdbSetting: IBZDBSetting) {
        PluginBuilder.normalizeBZDBSetting(bzdbSetting);

        this.definition.bzdbSettings[bzdbSetting.name] = bzdbSetting;
    }

    removeBZDBSetting(bzdbSetting: IBZDBSetting | String | string) {
        this.safeRemove('bzdbSettings', bzdbSetting, 'name');
    }

    addPollType(pollType: IPollType) {
        PluginBuilder.normalizePollType(pollType);

        this.definition.pollTypes[pollType.name] = pollType;
    }

    removePollType(pollType: IPollType | String | string) {
        this.safeRemove('pollTypes', pollType, 'name');
    }

    private safeRemove(namespace: string, key: { [key: string]: any } | String | string, secondaryKey: string) {
        let targetToRemove!: string;

        if (typeof key === 'string') {
            targetToRemove = key;
        } else if (key instanceof String) {
            targetToRemove = key.valueOf();
        } else {
            targetToRemove = key[secondaryKey];
        }

        if (targetToRemove === null) {
            throw Error('Cannot safely remove a value if the target key is null');
        }

        delete this.definition[namespace][targetToRemove];
    }

    public static normalizeSlashCommand(value: ISlashCommand): void {
        value.name = value.name.toLowerCase().replace(/[^a-z0-9]/, '');
    }

    public static normalizeMapObject(value: IMapObject): void {
        value.name = value.name.toLowerCase().replace(/[^a-z0-9]/, '');
    }

    public static normalizeFlag(value: IFlag): void {
        value.name = value.name.substring(0, 32);
        value.abbreviation = value.abbreviation.toUpperCase().substring(0, 2);
        value.helpString = value.helpString.substring(0, 128);
    }

    public static normalizeBZDBSetting(value: IBZDBSetting): void {
        value.name = '_' + value.name.replace(/[^a-zA-Z0-9]/, '');
    }

    public static normalizePollType(value: IPollType): void {
        value.name = value.name.toLowerCase().replace(/[^a-z0-9]/, '');
    }
}
