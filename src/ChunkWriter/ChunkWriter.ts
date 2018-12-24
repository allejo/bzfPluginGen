import { CPPClass, CPPFunction } from 'aclovis';

export abstract class ChunkWriter {
    protected additionalClasses: CPPClass[];
    protected fxn!: CPPFunction;

    protected constructor() {
        this.additionalClasses = [];
    }

    getIdentifier(): string {
        return this.fxn.getSignature(true).replace(/;$/, '');
    }

    getAdditionalClasses(): CPPClass[] {
        return this.additionalClasses;
    }

    process(): void {}
}
