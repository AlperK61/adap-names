import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        // Preconditions
        IllegalArgumentException.assert(
            source != null,
            "StringArrayName constructor: source must not be null"
        );

        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );

        super(delimiter);

        try {
            // Deep copy
            this.components = [...source];

            // Ensure no null components
            for (const c of this.components) {
                InvalidStateException.assert(
                    c != null,
                    "components must not contain null entries"
                );
            }
        } catch (e: any) {
            throw new MethodFailedException("StringArrayName constructor failed", e);
        }

        this.assertClassInvariants();
    }

    // ----------------------------------------------------------------
    // clone()
    // ----------------------------------------------------------------
    public clone(): Name {
        this.assertClassInvariants();

        try {
            const cloned = new StringArrayName([...this.components], this.delimiter);

            // POSTCONDITION
            MethodFailedException.assert(
                cloned.isEqual(this),
                "clone: cloned object is not equal to original"
            );

            return cloned;
        } catch (e: any) {
            throw new MethodFailedException("clone failed", e);
        }
    }

    // Delegated methods (super handles correct logic)
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
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // ----------------------------------------------------------------
    // Component API
    // ----------------------------------------------------------------

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.components.length;
    }

    public getComponent(i: number): string {
        // PRECONDITION
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "getComponent: index out of bounds"
        );

        this.assertClassInvariants();

        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "setComponent: index out of bounds"
        );
        IllegalArgumentException.assert(
            c != null,
            "setComponent: component must not be null"
        );

        this.assertClassInvariants();

        const oldCount = this.components.length;

        try {
            this.components[i] = c;
        } catch (e: any) {
            throw new MethodFailedException("setComponent failed", e);
        }

        this.assertClassInvariants();

        // POSTCONDITIONS
        MethodFailedException.assert(
            this.components.length === oldCount,
            "setComponent must not change number of components"
        );

        MethodFailedException.assert(
            this.components[i] === c,
            "setComponent did not properly set component"
        );
    }

    public insert(i: number, c: string): void {
        // PRECONDITIONS
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.components.length,
            "insert: index out of bounds"
        );
        IllegalArgumentException.assert(
            c != null,
            "insert: component must not be null"
        );

        this.assertClassInvariants();

        const oldCount = this.components.length;

        try {
            this.components.splice(i, 0, c);
        } catch (e: any) {
            throw new MethodFailedException("insert failed", e);
        }

        this.assertClassInvariants();

        // POSTCONDITION
        MethodFailedException.assert(
            this.components.length === oldCount + 1,
            "insert must increase number of components by 1"
        );
    }

    public append(c: string): void {
        // PRECONDITION
        IllegalArgumentException.assert(c != null, "append: null component");

        this.assertClassInvariants();

        const oldCount = this.components.length;

        try {
            this.components.push(c);
        } catch (e: any) {
            throw new MethodFailedException("append failed", e);
        }

        this.assertClassInvariants();

        // POSTCONDITION
        MethodFailedException.assert(
            this.components.length === oldCount + 1,
            "append must increase number of components by 1"
        );
    }

    public remove(i: number): void {
        // PRECONDITION
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "remove: index out of bounds"
        );

        this.assertClassInvariants();

        const oldCount = this.components.length;

        try {
            this.components.splice(i, 1);
        } catch (e: any) {
            throw new MethodFailedException("remove failed", e);
        }

        this.assertClassInvariants();

        // POSTCONDITION
        MethodFailedException.assert(
            this.components.length === oldCount - 1,
            "remove must decrease number of components by 1"
        );
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(other != null, "concat: other is null");

        // super.concat() ruft append() auf → contracts werden eingehalten
        super.concat(other);
    }

    // ----------------------------------------------------------------
    // Invariants
    // ----------------------------------------------------------------

    protected assertClassInvariants(): void {
        // Prüft delimiter etc. in AbstractName
        // @ts-ignore – falls Methode protected im Parent
        super.assertClassInvariants?.();

        InvalidStateException.assert(
            this.components != null,
            "Invariant: components must not be null"
        );

        for (const c of this.components) {
            InvalidStateException.assert(
                c != null,
                "Invariant: components must not contain null entry"
            );
        }
    }
}
