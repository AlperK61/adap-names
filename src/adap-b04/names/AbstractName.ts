import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition: delimiter must not be null/undefined und muss genau 1 Zeichen sein
        IllegalArgumentException.assert(delimiter != null, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");

        this.delimiter = delimiter;

        // Klasseninvariante nach Konstruktion
        this.assertClassInvariant();
    }

    /**
     * Subklassen müssen eine flache Kopie dieses Namens liefern.
     */
    public abstract clone(): Name;

    /**
     * Liefert eine menschenlesbare Darstellung des Namens.
     * Es wird NICHT escaped; der Aufrufer kann das Delimiter-Zeichen wählen.
     */
    public asString(delimiter: string = this.delimiter): string {
        // Preconditions
        IllegalArgumentException.assert(delimiter != null, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");

        const noComponents = this.getNoComponents();

        if (noComponents === 0) {
            // Leerer Name → leerer String
            this.assertClassInvariant();
            return "";
        }

        let result = "";
        for (let i = 0; i < noComponents; i++) {
            if (i > 0) {
                result += delimiter;
            }
            result += this.getComponent(i);
        }

        // Postcondition: Anzahl Komponenten darf sich nicht ändern
        MethodFailedException.assert(
            noComponents === this.getNoComponents(),
            "asString must not change the number of components"
        );

        // Klasseninvariante
        this.assertClassInvariant();

        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    /**
     * Liefert eine maschinenlesbare Darstellung des Namens.
     * Verwendet DEFAULT_DELIMITER und ESCAPE_CHARACTER als Steuerzeichen.
     */
    public asDataString(): string {
        const noComponents = this.getNoComponents();

        const escapedComponents: string[] = [];
        for (let i = 0; i < noComponents; i++) {
            escapedComponents.push(this.escapeComponentForDataString(this.getComponent(i)));
        }

        const result = escapedComponents.join(DEFAULT_DELIMITER);

        // Postcondition: Struktur darf sich nicht ändern
        MethodFailedException.assert(
            noComponents === this.getNoComponents(),
            "asDataString must not change the number of components"
        );

        // Klasseninvariante
        this.assertClassInvariant();

        return result;
    }

    public isEqual(other: Name): boolean {
        // Precondition
        IllegalArgumentException.assert(other != null, "other must not be null");

        const thisCount = this.getNoComponents();
        const otherCount = other.getNoComponents();

        if (thisCount !== otherCount) {
            return false;
        }

        for (let i = 0; i < thisCount; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        // Klasseninvariante
        this.assertClassInvariant();

        return true;
    }

    /**
     * Hashcode auf Basis der maschinenlesbaren Darstellung.
     */
    public getHashCode(): number {
        const data = this.asDataString();

        // Einfacher String-Hash (ähnlich Java String.hashCode)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = (31 * hash + data.charCodeAt(i)) | 0; // in 32-Bit int halten
        }

        // Klasseninvariante
        this.assertClassInvariant();

        return hash;
    }

    public isEmpty(): boolean {
        const empty = this.getNoComponents() === 0;

        // Klasseninvariante
        this.assertClassInvariant();

        return empty;
    }

    public getDelimiterCharacter(): string {
        // Klasseninvariante muss für den gespeicherten Delimiter gelten
        this.assertClassInvariant();
        return this.delimiter;
    }

    // --- abstrakte Komponenten-API, von Subklassen zu implementieren ---

    public abstract getNoComponents(): number;

    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    /**
     * Hängt alle Komponenten von other an diesen Namen an.
     */
    public concat(other: Name): void {
        // Precondition
        IllegalArgumentException.assert(other != null, "other must not be null");

        const oldCount = this.getNoComponents();
        const otherCount = other.getNoComponents();

        for (let i = 0; i < otherCount; i++) {
            this.append(other.getComponent(i));
        }

        // Postcondition: Anzahl der Komponenten muss sich korrekt erhöhen
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + otherCount,
            "concat must increase number of components correctly"
        );

        // Klasseninvariante
        this.assertClassInvariant();
    }

    // ----------------------------------------------------------------
    // Hilfsfunktionen für Escaping und Invariante
    // ----------------------------------------------------------------

    /**
     * Escaped eine Komponente für asDataString():
     * DEFAULT_DELIMITER und ESCAPE_CHARACTER werden mit ESCAPE_CHARACTER versehen.
     */
    protected escapeComponentForDataString(component: string): string {
        let result = "";
        for (let i = 0; i < component.length; i++) {
            const ch = component.charAt(i);
            if (ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }

    /**
     * Prüft die Klasseninvariante und wirft InvalidStateException bei Verstoß.
     * Invariante von AbstractName:
     *  - delimiter ist ein String der Länge 1 und nicht null
     */
    protected assertClassInvariant(): void {
        InvalidStateException.assert(
            this.delimiter != null && this.delimiter.length === 1,
            "invalid delimiter state"
        );
    }

}
