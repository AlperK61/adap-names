import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter: string = ".") {
        super(delimiter);
        this.name = source;
        this.noComponents =
            source.length === 0 ? 0 : source.split(this.delimiter).length;
    }

    protected _createNew(components: string[]): this {
        const newString = components.join(this.delimiter);
        return new StringName(newString, this.delimiter) as this;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        if (this.noComponents === 0) return "";
        return this.name.split(this.delimiter)[i];
    }
}
