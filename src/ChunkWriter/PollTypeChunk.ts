import { CPPClass, CPPFunction, CPPHelper, CPPIfBlock, CPPVariable, CPPWritable, CPPWritableObject } from 'aclovis';

import CPPVisibility from 'aclovis/dist/cpp/CPPVisibility';
import { ChunkWriter } from './ChunkWriter';
import IPlugin from '../IPlugin';

export default class PollTypeChunk extends ChunkWriter {
    private readonly notNeeded: boolean = false;

    private get fxn2() {
        return this.functions[1];
    }

    private set fxn2(fxn: CPPFunction) {
        this.functions[1] = fxn;
    }

    constructor(pluginClass: CPPClass, private readonly pluginDefinition: IPlugin) {
        super();

        const pollTypes = Object.keys(pluginDefinition.pollTypes);

        if (pollTypes.length === 0) {
            this.notNeeded = true;
            return;
        }

        pluginClass.addExtends([CPPVisibility.Public, 'bz_CustomPollTypeHandler']);

        this.fxn = new CPPFunction('bool', 'PollOpen', [
            new CPPVariable('bz_BasePlayerRecord*', 'player'),
            new CPPVariable('const char*', '_action'),
            new CPPVariable('const char*', '_parameters'),
        ]);
        this.fxn.setVirtual(true);
        this.fxn.setParentClass(pluginClass, CPPVisibility.Public);

        this.fxn2 = new CPPFunction('void', 'PollClose', [
            new CPPVariable('const char*', '_action'),
            new CPPVariable('const char*', '_parameters'),
            new CPPVariable('bool', 'success'),
        ]);
        this.fxn2.setVirtual(true);
        this.fxn2.setParentClass(pluginClass, CPPVisibility.Public);
    }

    public process(): void {
        if (this.notNeeded) {
            return;
        }

        const pollOpenBody: CPPWritable[] = [];
        const pollCloseBody: CPPWritable[] = [];

        this.buildPollOpen(pollOpenBody);
        this.buildPollClose(pollCloseBody);

        this.fxn.implementFunction(pollOpenBody);
        this.fxn2.implementFunction(pollCloseBody);
    }

    private buildPollOpen(body: CPPWritable[]): void {
        body.push(new CPPVariable('std::string', 'action', '_action'));
        body.push(CPPHelper.createEmptyLine());

        const ifBlock = new CPPIfBlock();

        for (const pollType in this.pluginDefinition.pollTypes) {
            ifBlock.defineCondition(`action == "${pollType}"`, [
                CPPHelper.createEmptyLine(),
                new CPPWritableObject('return true;'),
            ]);
        }

        body.push(ifBlock);
        body.push(CPPHelper.createEmptyLine());
        body.push(new CPPWritableObject('return false;'));
    }

    private buildPollClose(body: CPPWritable[]): void {
        body.push(new CPPVariable('std::string', 'action', '_action'));
        body.push(new CPPVariable('std::string', 'parameters', '_parameters'));
        body.push(CPPHelper.createEmptyLine());

        const ifBlock = new CPPIfBlock();

        for (const pollType in this.pluginDefinition.pollTypes) {
            const successBlock = new CPPIfBlock();
            successBlock.defineCondition('success', [CPPHelper.createEmptyLine()]);
            successBlock.defineElseCondition([CPPHelper.createEmptyLine()]);

            ifBlock.defineCondition(`action == "${pollType}"`, [successBlock]);
        }

        body.push(ifBlock);
    }
}
