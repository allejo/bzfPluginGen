import { CPPClass, CPPFunction } from 'aclovis';

export abstract class ChunkWriter {
    protected additionalClasses: CPPClass[];
    protected functions: CPPFunction[];

    protected constructor() {
        this.additionalClasses = [];
        this.functions = [];
    }

    protected get fxn() {
        return this.functions[0];
    }

    protected set fxn(value: CPPFunction) {
        this.functions[0] = value;
    }

    /**
     * @todo Remove in 2.0.0
     * @deprecated Since 1.0.2, ChunkWriters can implement multiple functions, use `getIdentifiers()` instead.
     */
    public getIdentifier(): string {
        return this.fxn.getSignature(true).replace(/;$/, '');
    }

    public getIdentifiers(): string[] {
        return this.functions.map((value: CPPFunction) => value.getSignature(true).replace(/;$/, ''));
    }

    public getAdditionalClasses(): CPPClass[] {
        return this.additionalClasses;
    }

    public process(): void {}
}
