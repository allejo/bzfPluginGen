import { ChunkWriter } from './ChunkWriter';
import {
    CPPClass,
    CPPCodeBlock,
    CPPComment,
    CPPFunction,
    CPPHelper,
    CPPIfBlock,
    CPPWritable,
    CPPWritableObject,
} from 'aclovis';
import IPlugin from '../IPlugin';
import CPPVisibility from 'aclovis/dist/cpp/CPPVisibility';
import CPPVariable from 'aclovis/dist/cpp/CPPVariable';
import { IMapObject, IMapPropertyArgument, MapArgumentType } from '../IMapObject';

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

    private readonly notNeeded: boolean = false;

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        const mapObjects = Object.keys(pluginDefinition.mapObjects);

        if (mapObjects.length === 0) {
            this.notNeeded = true;
            return;
        }

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

        fxnBody.push(CPPHelper.createEmptyLine());
        fxnBody.push(new CPPWritableObject('return true;'));

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
        shortCircuit.defineCondition(conditions.join(' || '), [new CPPWritableObject('return false;')]);

        body.push(shortCircuit);
        body.push(CPPHelper.createEmptyLine());
    }

    private buildParsers(body: CPPWritable[]): void {
        const mapObjects = Object.keys(this.pluginDefinition.mapObjects);

        if (mapObjects.length === 1) {
            const firstObject = this.pluginDefinition.mapObjects[mapObjects[0]];
            body.push(...this.buildObjectParser(firstObject));
        } else {
            const multiMapObjectParser = new CPPIfBlock();

            for (const name in this.pluginDefinition.mapObjects) {
                const mapObject = this.pluginDefinition.mapObjects[name];

                multiMapObjectParser.defineCondition(
                    `object == "${name.toUpperCase()}"`,
                    this.buildObjectParser(mapObject)
                );
            }

            body.push(multiMapObjectParser);
        }
    }

    private buildObjectParser(mapObject: IMapObject): CPPWritable[] {
        const className = MapObjectChunk.upperFirst(mapObject.name) + 'Zone';
        const instanceName = MapObjectChunk.lowerFirst(className);

        const objClass = this.registerMapObjectClass(className);

        const parserBlock: CPPWritable[] = [
            new CPPVariable(objClass.getClassName(), instanceName),
            new CPPWritableObject(`${instanceName}.handleDefaultOptions(data);`),
        ];

        this.buildPropertyParser(mapObject, objClass, instanceName, parserBlock);

        return parserBlock;
    }

    private buildPropertyParser(mapObject: IMapObject, classObj: CPPClass, insVar: string, body: CPPWritable[]): void {
        if (mapObject.properties.length === 0) {
            return;
        }

        const propertyLoop = new CPPCodeBlock('for (unsigned int i = 0; i < data->data.size(); i++)', [
            new CPPVariable('std::string', 'line', 'data->data.get(i)'),
            CPPHelper.createEmptyLine(),
        ]);

        const simpleProperties = new CPPIfBlock();
        const complexProperties = new CPPIfBlock();

        for (let i = 0; i < mapObject.properties.length; i++) {
            const mapProperty = mapObject.properties[i];

            if (MapObjectChunk.propertyBlacklist.indexOf(mapProperty.name) >= 0) {
                continue;
            }

            const isSimpleProp = mapProperty.arguments.length === 0;

            if (isSimpleProp) {
                const cppVar = MapObjectChunk.createCppVarFromArgument(mapProperty.name);

                classObj.addVariable(cppVar, CPPVisibility.Public);

                simpleProperties.defineCondition(`line == "${mapProperty.name}"`, [
                    new CPPWritableObject(`${insVar}.${cppVar.getVariableName()} = true;`),
                    new CPPWritableObject('continue;'),
                ]);

                continue;
            }

            const casters: CPPWritable[] = [];

            for (let j = 0; j < mapProperty.arguments.length; j++) {
                const argument = mapProperty.arguments[j];
                const cppVar = MapObjectChunk.createCppVarFromArgument(mapProperty.name, argument);

                classObj.addVariable(cppVar, CPPVisibility.Public);

                casters.push(MapObjectChunk.createCppCastForArgument(insVar, cppVar, j + 1, argument));
            }

            complexProperties.defineCondition(`key == "${mapProperty.name}"`, casters);
        }

        propertyLoop.body.push(simpleProperties);

        if (Object.keys(complexProperties.conditions).length > 0) {
            const complexProperty = new CPPIfBlock();
            complexProperty.defineCondition('nubs.size() > 0', [
                new CPPVariable('std::string', 'key', 'bz_toupper(nubs.get(0).c_str())'),
                CPPHelper.createEmptyLine(),
                complexProperties,
            ]);

            propertyLoop.body.push(
                ...[
                    CPPHelper.createEmptyLine(),
                    new CPPVariable('bz_APIStringList', 'nubs'),
                    new CPPWritableObject('nubs.tokenize(line.c_str(), " ", 0, true);'),
                    CPPHelper.createEmptyLine(),
                    complexProperty,
                ]
            );
        }

        body.push(CPPHelper.createEmptyLine());
        body.push(propertyLoop);
    }

    /**
     * Build a CPPClass for the class that'll be extending `bz_CustomZoneObject`
     * and store all of the information for the zone.
     *
     * @param className
     */
    private registerMapObjectClass(className: string): CPPClass {
        const objClass = new CPPClass(className);

        objClass.addExtends([CPPVisibility.Public, 'bz_CustomZoneObject']);
        objClass.setConstructor([], ['bz_CustomZoneObject()']);

        this.additionalClasses.push(objClass);

        return objClass;
    }

    /**
     * From an IMapPropertyArgument object, return a CPPVariable.
     *
     * @param namespace The name of the property for the map object
     * @param arg       The definition of the argument itself
     */
    private static createCppVarFromArgument(namespace: string, arg?: IMapPropertyArgument): CPPVariable {
        if (!arg) {
            return CPPVariable.createBoolean(namespace);
        }

        // Always get the first piped "namespace"
        const varName = `${namespace.split('|').shift()}_${arg.name}`;

        switch (arg.type) {
            case MapArgumentType.Int:
                return CPPVariable.createInt(varName);

            case MapArgumentType.Double:
                return CPPVariable.createDouble(varName);

            case MapArgumentType.Float:
                return CPPVariable.createFloat(varName);

            case MapArgumentType.String:
                return CPPVariable.createString(varName);

            case MapArgumentType.Team:
                return new CPPVariable('bz_eTeamType', varName);
        }
    }

    private static createCppCastForArgument(
        insVar: string,
        cppVar: CPPVariable,
        index: number,
        arg: IMapPropertyArgument
    ): CPPWritable {
        let line: string = `${insVar}.${cppVar.getVariableName()} = `;

        if (arg.type === MapArgumentType.Int) {
            line += `atoi(nubs.get(${index}).c_str());`;
        } else if (arg.type === MapArgumentType.Double) {
            line += `(double)atof(nubs.get(${index}).c_str());`;
        } else if (arg.type === MapArgumentType.Float) {
            line += `atof(nubs.get(${index}).c_str());`;
        } else if (arg.type === MapArgumentType.String) {
            line += `nubs.get(${index}).c_str();`;
        } else if (arg.type === MapArgumentType.Team) {
            line += `(bz_eTeamType)atoi(nubs.get(${index}).c_str());`;
        }

        return new CPPWritableObject(line);
    }

    private static lowerFirst(str: string, length: number = 1) {
        return `${str.substring(0, length).toLowerCase()}${str.substring(length)}`;
    }

    private static upperFirst(str: string, length: number = 1) {
        return `${str.substring(0, length).toUpperCase()}${str.substring(length)}`;
    }
}
