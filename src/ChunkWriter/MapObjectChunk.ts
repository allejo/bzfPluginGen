import { ChunkWriter } from './ChunkWriter';
import {
    CPPClass,
    CPPCodeBlock,
    CPPComment,
    CPPFunction,
    CPPHelper,
    CPPIfBlock,
    CPPWritable,
    CPPWritableObject
} from 'aclovis';
import IPlugin from '../IPlugin';
import CPPVisibility from 'aclovis/dist/cpp/CPPVisibility';
import CPPVariable from 'aclovis/dist/cpp/CPPVariable';
import { IMapObject } from '../IMapObject';

export default class MapObjectChunk extends ChunkWriter {
    static propertyBlacklist = [
        'position|pos',
        'position',
        'pos',
        'size',
        'rotation|rot',
        'rotation',
        'rot',
        'height',
        'radius',
    ];

    private readonly mapObjectClasses: CPPClass[];
    private readonly notNeeded: boolean;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        const mapObjects = Object.keys(pluginDefinition.mapObjects);

        if (mapObjects.length === 0) {
            this.notNeeded = true;
            return;
        }

        this.mapObjectClasses = [];
        this.fxn = new CPPFunction('bool', 'MapObject', [
            new CPPVariable('bz_ApiString', 'object'),
            new CPPVariable('bz_CustomMapObjectInfo*', 'data'),
        ]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);
    }

    process(): void {
        if (this.notNeeded) {
            return;
        }

        const fxnBody: CPPWritable[] = [];

        this.buildShortCircuit(fxnBody);
        this.buildParsers(fxnBody);

        this.fxn.implementFunction(fxnBody);
    }

    private buildShortCircuit(body: CPPWritable[]): void {
        body.push(new CPPComment('Note, this value will be in uppercase', false));

        const conditions: string[] = ['!data'];

        for (const name in this.pluginDefinition.mapObjects) {
            const mapObject = this.pluginDefinition.mapObjects[name];

            conditions.push(`object != "${mapObject.name.toUpperCase()}"`);
        }

        const shortCircuit = new CPPIfBlock();
        shortCircuit.defineCondition(conditions.join(' || '), [
            new CPPWritableObject('return false;'),
        ]);

        body.push(shortCircuit);
    }

    private buildParsers(body: CPPWritable[]): void {
        const mapObjects = Object.keys(this.pluginDefinition.mapObjects);

        if (mapObjects.length === 1) {

        } else {

        }
    }

    private buildObjectParser(mapObject: IMapObject): CPPWritable[] {
        const className = MapObjectChunk.upperFirst(mapObject.name) + 'Zone';
        const instanceName = MapObjectChunk.lowerFirst(className);
        const objClass = new CPPClass(className);

        const parserBlock: CPPWritable[] = [
            new CPPVariable(objClass.getClassName(), instanceName),
            new CPPWritableObject(`${instanceName}.handleDefaultOptions(data);`),
        ];

        if (mapObject.properties.length > 3) {
            this.buildPropertyParser(mapObject, parserBlock);
        }

        return parserBlock;
    }

    private buildPropertyParser(mapObject: IMapObject, body: CPPWritable[]): void {
        body.push(CPPHelper.createEmptyLine());

        const propertyLoop = new CPPCodeBlock('for (unsigned int i = 0; i < data->data.size(); i++)', [
            new CPPVariable('std::string', 'line', 'data->data.get(i)'),
            CPPHelper.createEmptyLine(),
        ]);

        for (let i = 0; i < mapObject.properties.length; i++) {
            const mapProperty = mapObject.properties[i];

            if (MapObjectChunk.propertyBlacklist.indexOf(mapProperty.name) >= 0) {
                continue;
            }

            if (mapProperty.arguments.length > 0) {
                continue;
            }


        }


        let t = [
            new CPPVariable('bz_APIStringList', 'nubs'),
            new CPPWritableObject('nubs.tokenize(line.c_str(), " ", 0, true);'),
            CPPHelper.createEmptyLine(),
        ];
        const propertyHandlers = new CPPIfBlock();

    }

    private static lowerFirst(str: string, length: number = 1) {
        return `${str.substring(0, length).toLowerCase()}${str.substring(length)}`;
    }

    private static upperFirst(str: string, length: number = 1) {
        return `${str.substring(0, length).toUpperCase()}${str.substring(length)}`;
    }
}
