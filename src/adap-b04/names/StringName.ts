import { DEFAULT_DELIMITER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        // Precondition: source darf nicht null/undefined sein
        IllegalArgumentException.assert(source != null, "source must not be null or undefined");

        const usedDelimiter = delimiter ?? DEFAULT_DELIMITER;
        super(usedDelimiter);

        if (source === "") {
            // leerer Name
            this.name = "";
            this.noComponents = 0;
        } else {
            this.name = source;
            const components = this.name.split(this.delimiter);
            this.noComponents = components.length;
        }

        // Klasseninvariante nach Konstruktion
        this.assertClassInvariant();
    }

    public clone(): Name {
        // Neue Instanz mit identischer Darstellung und gleichem Delimiter
        return new StringName(this.asString(this.delimiter), this.delimiter);
    }

    // Delegation an AbstractName für die generische Logik

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
        // Invariante wahren
        this.assertClassInvariant();
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Precondition: gültiger Index
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds in getComponent"
        );

        if (this.noComponents === 0) {
            this.assertClassInvariant();
            // Dieser Fall sollte wegen Precondition eigentlich nicht auftreten
            return "";
        }

        const components = this.name.split(this.delimiter);
        const result = components[i];

        // Klasseninvariante
        this.assertClassInvariant();

        return result;
    }

    public setComponent(i: number, c: string) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds in setComponent"
        );
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.noComponents;

        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components[i] = c;

        this.updateFromComponents(components);

        // Postconditions
        MethodFailedException.assert(
            this.noComponents === oldCount,
            "setComponent must not change the number of components"
        );
        MethodFailedException.assert(
            this.getComponent(i) === c,
            "setComponent must correctly update the component"
        );

        this.assertClassInvariant();
    }

    public insert(i: number, c: string) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.noComponents,
            "index out of bounds in insert"
        );
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.noComponents;

        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(i, 0, c);

        this.updateFromComponents(components);

        // Postcondition: Anzahl der Komponenten +1
        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "insert must increase number of components by one"
        );

        this.assertClassInvariant();
    }

    public append(c: string) {
        // Precondition
        IllegalArgumentException.assert(c != null, "component must not be null or undefined");

        const oldCount = this.noComponents;

        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.push(c);

        this.updateFromComponents(components);

        // Postcondition
        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "append must increase number of components by one"
        );

        this.assertClassInvariant();
    }

    public remove(i: number) {
        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds in remove"
        );

        const oldCount = this.noComponents;

        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(i, 1);

        this.updateFromComponents(components);

        // Postcondition: Anzahl der Komponenten -1
        MethodFailedException.assert(
            this.noComponents === oldCount - 1,
            "remove must decrease number of components by one"
        );

        this.assertClassInvariant();
    }

    public concat(other: Name): void {
        // Wir nutzen die generische Implementierung aus AbstractName,
        // die wiederum append() verwendet, das wir oben implementiert haben.
        super.concat(other);
    }

    // ----------------------------------------------------------------
    // Hilfs- und Invarianten-Methoden
    // ----------------------------------------------------------------

    /**
     * Aktualisiert interne Darstellung aus Komponentenliste.
     */
    protected updateFromComponents(components: string[]): void {
        if (components.length === 0) {
            this.name = "";
            this.noComponents = 0;
        } else {
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        }
        // Kein assertClassInvariant hier, das wird von aufrufenden Methoden gemacht
    }

    /**
     * Stärkere Klasseninvariante für StringName:
     *  - delimiter ist gültig (über super.assertClassInvariant)
     *  - noComponents === 0 → name ist leerer String
     *  - noComponents > 0 → name ist nicht leer und
     *    die tatsächliche Anzahl der Komponenten passt.
     */
    protected assertClassInvariant(): void {
        super.assertClassInvariant();

        if (this.noComponents === 0) {
            InvalidStateException.assert(
                this.name === "",
                "empty name must have empty internal string"
            );
        } else {
            InvalidStateException.assert(
                this.name.length > 0,
                "non-empty name must have non-empty internal string"
            );
            const components = this.name.split(this.delimiter);
            InvalidStateException.assert(
                components.length === this.noComponents,
                "noComponents must match actual number of components"
            );
        }
    }

}
