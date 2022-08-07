import {
    CPPClass,
    CPPComment,
    CPPFunction,
    CPPHelper,
    CPPIfBlock,
    CPPVariable,
    CPPVisibility,
    CPPWritableObject,
} from 'aclovis';

import { ChunkWriter } from './ChunkWriter';
import IPlugin from '../IPlugin';

export default class UrlHandlerChunk extends ChunkWriter {
    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        if (!this.isNeeded) {
            return;
        }

        pluginClass.addExtends([CPPVisibility.Public, 'bz_BaseURLHandler']);

        const urlDoneFxn = new CPPFunction('void', 'URLDone', [
            new CPPVariable('const char*', 'URL'),
            new CPPVariable('const void*', 'data'),
            new CPPVariable('unsigned int', 'size'),
            new CPPVariable('bool', 'complete'),
        ]);
        urlDoneFxn.setParentClass(pluginClass, CPPVisibility.Public);

        const urlTimeoutFxn = new CPPFunction('void', 'URLTimeout', [
            new CPPVariable('const char*', 'URL'),
            new CPPVariable('int', 'errorCode'),
        ]);
        urlTimeoutFxn.setParentClass(pluginClass, CPPVisibility.Public);

        const urlErrorFxn = new CPPFunction('void', 'URLError', [
            new CPPVariable('const char*', 'URL'),
            new CPPVariable('int', 'errorCode'),
            new CPPVariable('const char*', 'errorString'),
        ]);
        urlErrorFxn.setParentClass(pluginClass, CPPVisibility.Public);

        this.functions.push(urlDoneFxn);
        this.functions.push(urlTimeoutFxn);
        this.functions.push(urlErrorFxn);
    }

    get isNeeded(): boolean {
        return this.pluginDefinition.makesUrlCalls;
    }

    get urlDoneFxn(): CPPFunction {
        return this.functions[0];
    }

    get urlTimeFxn(): CPPFunction {
        return this.functions[1];
    }

    get urlErrorFxn(): CPPFunction {
        return this.functions[2];
    }

    process() {
        if (!this.isNeeded) {
            return;
        }

        this.urlDoneFxn.implementFunction([
            CPPVariable.createString('webData', new CPPWritableObject('(const char*)data')),
            CPPHelper.createEmptyLine(),
            new CPPIfBlock().defineCondition('!complete', [new CPPWritableObject('return')]),
            CPPHelper.createEmptyLine(),
            new CPPComment('The URL call completed successfully', false),
        ]);
        this.urlTimeFxn.implementFunction([
            new CPPComment('This method is called when a URL call times out; handle fallback behavior here', false),
        ]);
        this.urlErrorFxn.implementFunction([
            new CPPComment('Something went wrong during the URL call; handle fallback behavior here', false),
        ]);
    }
}
