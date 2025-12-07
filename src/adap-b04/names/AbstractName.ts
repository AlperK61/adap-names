import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition: delimiter must be a single character
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );
        this.delimiter = delimiter;
        // KEINE Invariantenprüfung hier, da Subklassen im Konstruktor
        // ihre eigenen Felder erst noch initialisieren müssen.
    }

    /**
     * Klasseninvarianten prüfen.
     * Wird von allen öffentlichen Methoden (außer ctor) verwendet.
     */
    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.delimiter != null && this.delimiter.length === 1,
            "delimiter invariant violated"
        );

        const n = this.getNoComponents();
        InvalidStateException.assert(
            n >= 0,
            "number of components must not be negative"
        );

        for (let i = 0; i < n; i++) {
            const c = this.getComponent(i);
            InvalidStateException.assert(
                c != null,
                "name component must not be null"
            );
        }
    }

    public clone(): Name {
        this.assertClassInvariants();

        const Ctor = this.constructor as { new (delimiter?: string): Name };
        const result = new Ctor(this.delimiter);

        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            result.append(this.getComponent(i));
        }

        // Postcondition: geklonter Name ist gleich dem Original
        MethodFailedException.assert(
            result.isEqual(this),
            "clone postcondition failed: cloned name differs from original"
        );

        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        // Precondition: delimiter muss einzelnes Zeichen sein
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );

        this.assertClassInvariants();

        const n = this.getNoComponents();
        if (n === 0) {
            return "";
        }

        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            // Human-readable: keine Escapes
            parts.push(this.getComponent(i));
        }

        const result = parts.join(delimiter);
        // Triviale Postcondition: Ergebnis existiert
        MethodFailedException.assert(
            result != null,
            "asString postcondition failed"
        );
        return result;
    }

    public toString(): string {
        // Machine-readable Darstellung als Default
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertClassInvariants();

        const n = this.getNoComponents();
        if (n === 0) {
            return "";
        }

        const parts: string[] = [];

        for (let i = 0; i < n; i++) {
            const component = this.getComponent(i);
            let escaped = "";

            for (const ch of component) {
                // Machine-readable: Delimiter und Escape-Zeichen maskieren
                if (ch === DEFAULT_DELIMITER || ch === ESCAPE_CHARACTER) {
                    escaped += ESCAPE_CHARACTER;
                }
                escaped += ch;
            }

            parts.push(escaped);
        }

        const result = parts.join(DEFAULT_DELIMITER);
        MethodFailedException.assert(
            result != null,
            "asDataString postcondition failed"
        );
        return result;
    }

    public isEqual(other: Name): boolean {
        // Precondition: other darf nicht null sein
        IllegalArgumentException.assert(
            other != null,
            "other must not be null"
        );

        this.assertClassInvariants();

        const n = this.getNoComponents();
        if (n !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < n; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        this.assertClassInvariants();

        let hash = 17;
        const n = this.getNoComponents();

        for (let i = 0; i < n; i++) {
            const comp = this.getComponent(i);
            for (let j = 0; j < comp.length; j++) {
                hash = (hash * 31 + comp.charCodeAt(j)) | 0; // 32-bit int
            }
        }

        return hash;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();

        const n = this.getNoComponents();
        if (n === 0) {
            return true;
        }

        for (let i = 0; i < n; i++) {
            if (this.getComponent(i).length > 0) {
                return false;
            }
        }

        return true;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    // Abstrakte Komponenten-API, von konkreten Namen-Klassen zu implementieren
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Precondition
        IllegalArgumentException.assert(
            other != null,
            "other must not be null"
        );

        this.assertClassInvariants();

        const oldNoComponents = this.getNoComponents();
        const toAdd = other.getNoComponents();

        for (let i = 0; i < toAdd; i++) {
            this.append(other.getComponent(i));
        }

        this.assertClassInvariants();

        // Postcondition: Komponentenanzahl um toAdd erhöht
        MethodFailedException.assert(
            this.getNoComponents() === oldNoComponents + toAdd,
            "concat postcondition failed: wrong number of components"
        );
    }
}
