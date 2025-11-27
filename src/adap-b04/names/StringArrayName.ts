import { DEFAULT_DELIMITER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // Preconditions
        IllegalArgumentException.assert(source != null, "source must not be null or undefined");

        const usedDelimiter = delimiter ?? DEFAULT_DELIMITER;
        super(usedDelimiter);

        // Kopie der Komponenten übernehmen
        this.components = [...source];

        // Klasseninvariante nach Konstruktion
        this.assertClassInvariant();
    }

    public clone(): Name {
        // Flache Kopie der Komponenten, gleicher Delimiter
        return new StringArrayName([...this.components], this.delimiter);
    }

    // Delegation an AbstractName für generische Logik

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    // --- Komponenten-API ---

    public getNoComponents(): number {
        this.assertClassInvariant();
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds in getComponent"
        );

        const result = this.components[i];

        this.assertClassInvariant();
        return result;
    }

    public setComponent(i: number, c: string) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds in setComponent"
        );
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.components.length;

        this.components[i] = c;

        // Postconditions
        MethodFailedException.assert(
            this.components.length === oldCount,
            "setComponent must not change the number of components"
        );
        MethodFailedException.assert(
            this.components[i] === c,
            "setComponent must correctly update the component"
        );

        this.assertClassInvariant();
    }

    public insert(i: number, c: string) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.components.length,
            "index out of bounds in insert"
        );
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.components.length;

        this.components.splice(i, 0, c);

        // Postcondition
        MethodFailedException.assert(
            this.components.length === oldCount + 1,
            "insert must increase number of components by one"
        );

        this.assertClassInvariant();
    }

    public append(c: string) {
        // Precondition
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.components.length;

        this.components.push(c);

        // Postcondition
        MethodFailedException.assert(
            this.components.length === oldCount + 1,
            "append must increase number of components by one"
        );

        this.assertClassInvariant();
    }

    public remove(i: number) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds in remove"
        );

        const oldCount = this.components.length;

        this.components.splice(i, 1);

        // Postcondition
        MethodFailedException.assert(
            this.components.length === oldCount - 1,
            "remove must decrease number of components by one"
        );

        this.assertClassInvariant();
    }

    public concat(other: Name): void {
        // generische Implementierung aus AbstractName nutzt append(),
        // das wir oben voll mit Contracts implementiert haben
        super.concat(other);
    }

    // ----------------------------------------------------------------
    // Klasseninvariante
    // ----------------------------------------------------------------

    protected assertClassInvariant(): void {
        super.assertClassInvariant();

        // components-Array darf nicht null sein
        InvalidStateException.assert(
            this.components != null,
            "components must not be null"
        );

        // keine null/undefined-Komponenten
        for (const c of this.components) {
            InvalidStateException.assert(
                c != null,
                "components must not contain null or undefined"
            );
        }
    }
}
