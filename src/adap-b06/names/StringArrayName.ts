import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];

    constructor(components: string[], delimiter: string = ".") {
        super(delimiter);
        this.components = [...components];
    }

    protected _createNew(components: string[]): this {
        return new StringArrayName(components, this.delimiter) as this;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }
}
