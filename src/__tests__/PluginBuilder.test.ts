import { BZDBType, IBZDBSetting } from '../IBZDBSetting';
import { FlagType, IFlag } from '../IFlag';

import { IMapObject } from '../IMapObject';
import { IPollType } from '../IPollType';
import { ISlashCommand } from '../ISlashCommand';
import PluginBuilder from '../PluginBuilder';

describe('PluginBuilder static functions', () => {
    describe('normalizeSlashCommand', () => {
        const slashCommands: [string, string][] = [
            ['hello world', 'helloworld'],
            ['ALL CAPS', 'allcaps'],
            ['/slash', 'slash'],
        ];

        slashCommands.forEach((value: [string, string]) => {
            test(`Normalize slash command from "${value[0]}" to "${value[1]}"`, () => {
                const sc: ISlashCommand = {
                    name: value[0],
                };

                PluginBuilder.normalizeSlashCommand(sc);

                expect(sc.name).toEqual(value[1]);
            });
        });
    });

    describe('normalizeMapObject', () => {
        const mapObjectNames: [string, string][] = [
            ['hello world', 'helloworld'],
            ['ALL CAPS', 'allcaps'],
            ['/slash', 'slash'],
        ];

        mapObjectNames.forEach((value: [string, string]) => {
            test(`Normalize slash command from "${value[0]}" to "${value[1]}"`, () => {
                const mo: IMapObject = {
                    uuid: '',
                    name: value[0],
                    properties: [],
                };

                PluginBuilder.normalizeMapObject(mo);

                expect(mo.name).toEqual(value[1]);
            });
        });
    });

    describe('normalizeFlag', () => {
        test('Meet flag definition requirements', () => {
            const fg: IFlag = {
                name: 'A'.repeat(60),
                abbreviation: 'A'.repeat(5),
                helpString: 'A'.repeat(150),
                type: FlagType.Good,
            };

            PluginBuilder.normalizeFlag(fg);

            expect(fg.name).toHaveLength(32);
            expect(fg.abbreviation).toHaveLength(2);
            expect(fg.helpString).toHaveLength(128);
        });
    });

    describe('normalizeBZDBSetting', () => {
        const bzdbSettings: [string, string][] = [
            ['hello world', '_helloworld'],
            ['ALL CAPS', '_ALLCAPS'],
            ['/slash', '_slash'],
            ['_someSetting', '_someSetting'],
        ];

        bzdbSettings.forEach((value: [string, string]) => {
            test(`Normalize BZDB setting from "${value[0]}" to "${value[1]}"`, () => {
                const bzdb: IBZDBSetting = {
                    name: value[0],
                    type: BZDBType.String,
                    value: '',
                };

                PluginBuilder.normalizeBZDBSetting(bzdb);

                expect(bzdb.name).toEqual(value[1]);
            });
        });
    });

    describe('normalizePollType', () => {
        const pollTypes: [string, string][] = [
            ['hello world', 'helloworld'],
            ['ALL CAPS', 'allcaps'],
            ['/slash', 'slash'],
            ['_someSetting', 'somesetting'],
        ];

        pollTypes.forEach((value: [string, string]) => {
            test(`Normalize poll type from "${value[0]}" to "${value[1]}"`, () => {
                const poll: IPollType = {
                    name: value[0],
                };

                PluginBuilder.normalizePollType(poll);

                expect(poll.name).toEqual(value[1]);
            });
        });
    });
});
