import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );
        this.delimiter = delimiter;
    }

    // ---------------------------------------------------------------
    // clone()
    // ---------------------------------------------------------------
    public clone(): this {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return this._createNew(parts);
    }

    // ---------------------------------------------------------------
    // Abstract factory for creating new immutable instances
    // ---------------------------------------------------------------
    protected abstract _createNew(components: string[]): this;

    // ---------------------------------------------------------------
    // isEmpty
    // ---------------------------------------------------------------
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // ---------------------------------------------------------------
    // Printable
    // ---------------------------------------------------------------
    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be one character"
        );

        if (this.isEmpty()) return "";

        return this.getAll().join(delimiter);
    }

    public asDataString(): string {
        if (this.isEmpty()) return "";

        const escaped: string[] = [];

        for (const comp of this.getAll()) {
            let out = "";
            for (const ch of comp) {
                if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                    out += ESCAPE_CHARACTER;
                }
                out += ch;
            }
            escaped.push(out);
        }

        return escaped.join(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // ---------------------------------------------------------------
    // Equality
    // ---------------------------------------------------------------
    public isEqual(other: unknown): boolean {
        if (!(other instanceof AbstractName)) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 17;
        for (const comp of this.getAll()) {
            for (const ch of comp) {
                hash = (hash * 31 + ch.charCodeAt(0)) | 0;
            }
        }
        return hash;
    }

    // ---------------------------------------------------------------
    // Immutable modification methods
    // ---------------------------------------------------------------
    public setComponent(i: number, c: string): this {
        this.assertValidIndex(i);

        const parts = this.getAll();
        parts[i] = c;
        return this._createNew(parts);
    }

    public insert(i: number, c: string): this {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.getNoComponents(),
            "index out of bounds"
        );

        const parts = this.getAll();
        parts.splice(i, 0, c);
        return this._createNew(parts);
    }

    public append(c: string): this {
        const parts = this.getAll();
        parts.push(c);
        return this._createNew(parts);
    }

    public remove(i: number): this {
        this.assertValidIndex(i);

        const parts = this.getAll();
        parts.splice(i, 1);
        return this._createNew(parts);
    }

    public concat(other: Name): this {
        const parts = this.getAll();
        for (let i = 0; i < other.getNoComponents(); i++) {
            parts.push(other.getComponent(i));
        }
        return this._createNew(parts);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------
    protected getAll(): string[] {
        const out: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            out.push(this.getComponent(i));
        }
        return out;
    }

    protected assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.getNoComponents(),
            "index out of bounds"
        );
    }

    // ---------------------------------------------------------------
    // Abstracts
    // ---------------------------------------------------------------
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
}
