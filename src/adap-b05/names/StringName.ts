import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        // Precondition
        IllegalArgumentException.assert(
            source != null,
            "StringName constructor: source must not be null"
        );

        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );

        super(delimiter);

        try {
            if (source === "") {
                this.name = "";
                this.noComponents = 0;
            } else {
                this.name = source;
                const components = this.name.split(this.delimiter);
                this.noComponents = components.length;
            }
        } catch (e: any) {
            throw new MethodFailedException("StringName constructor failed", e);
        }

        this.assertClassInvariants();
    }

    // ----------------------------------------------------------------
    // clone()
    // ----------------------------------------------------------------
    public clone(): Name {
        this.assertClassInvariants();

        try {
            const cloned = new StringName(this.name, this.delimiter);

            // Postcondition
            MethodFailedException.assert(
                cloned.isEqual(this),
                "clone: cloned object is not equal to original"
            );

            return cloned;
        } catch (e: any) {
            throw new MethodFailedException("clone failed", e);
        }
    }

    // ----------------------------------------------------------------
    // Delegation to AbstractName (correct B05 logic already implemented)
    // ----------------------------------------------------------------

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
        return this.delimiter;
    }

    // ----------------------------------------------------------------
    // Component API
    // ----------------------------------------------------------------

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "getComponent: index out of bounds"
        );

        this.assertClassInvariants();

        if (this.noComponents === 0) {
            return "";
        }

        const comps = this.name.split(this.delimiter);
        const result = comps[i];

        this.assertClassInvariants();
        return result;
    }

    public setComponent(i: number, c: string): void {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "setComponent: index out of bounds"
        );

        IllegalArgumentException.assert(
            c != null,
            "setComponent: component must not be null"
        );

        this.assertClassInvariants();

        const oldCount = this.noComponents;

        try {
            const comps = this.name.split(this.delimiter);
            comps[i] = c;
            this.updateFromComponents(comps);
        } catch (e: any) {
            throw new MethodFailedException("setComponent failed", e);
        }

        this.assertClassInvariants();

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === oldCount,
            "setComponent must not change component count"
        );

        MethodFailedException.assert(
            this.getComponent(i) === c,
            "setComponent did not correctly update component"
        );
    }

    public insert(i: number, c: string): void {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.noComponents,
            "insert: index out of bounds"
        );

        IllegalArgumentException.assert(
            c != null,
            "insert: component must not be null"
        );

        this.assertClassInvariants();

        const oldCount = this.noComponents;

        try {
            const comps = this.name === "" ? [] : this.name.split(this.delimiter);
            comps.splice(i, 0, c);
            this.updateFromComponents(comps);
        } catch (e: any) {
            throw new MethodFailedException("insert failed", e);
        }

        this.assertClassInvariants();

        // Postcondition
        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "insert must increment component count by 1"
        );
    }

    public append(c: string): void {
        // Precondition
        IllegalArgumentException.assert(
            c != null,
            "append: component must not be null"
        );

        this.assertClassInvariants();

        const oldCount = this.noComponents;

        try {
            const comps = this.name === "" ? [] : this.name.split(this.delimiter);
            comps.push(c);
            this.updateFromComponents(comps);
        } catch (e: any) {
            throw new MethodFailedException("append failed", e);
        }

        this.assertClassInvariants();

        // Postcondition
        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "append must increment component count by 1"
        );
    }

    public remove(i: number): void {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "remove: index out of bounds"
        );

        this.assertClassInvariants();

        const oldCount = this.noComponents;

        try {
            const comps = this.name.split(this.delimiter);
            comps.splice(i, 1);
            this.updateFromComponents(comps);
        } catch (e: any) {
            throw new MethodFailedException("remove failed", e);
        }

        this.assertClassInvariants();

        // Postcondition
        MethodFailedException.assert(
            this.noComponents === oldCount - 1,
            "remove must decrement component count by 1"
        );
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(other != null, "concat: other must not be null");
        super.concat(other);
    }

    // ----------------------------------------------------------------
    // Helper + invariants
    // ----------------------------------------------------------------

    protected updateFromComponents(components: string[]): void {
        if (components.length === 0) {
            this.name = "";
            this.noComponents = 0;
        } else {
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        }
    }

    protected assertClassInvariants(): void {
        // delimiter invariant (checked by AbstractName)
        // @ts-ignore
        super.assertClassInvariants?.();

        if (this.noComponents === 0) {
            InvalidStateException.assert(
                this.name === "",
                "Invariant violation: empty name must have empty internal string"
            );
        } else {
            InvalidStateException.assert(
                this.name.length > 0,
                "Invariant violation: non-empty name must not have empty string"
            );

            const components = this.name.split(this.delimiter);

            InvalidStateException.assert(
                components.length === this.noComponents,
                "Invariant violation: number of components mismatch"
            );
        }
    }
}
