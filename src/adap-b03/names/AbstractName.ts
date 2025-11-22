import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        if (this.delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
    }

    // Jede konkrete Unterklasse muss selbst klonen
    public abstract clone(): Name;

    /**
     * Mensch-lesbare Darstellung (ohne Maskierung), frei wählbarer Delimiter.
     */
    public asString(delimiter: string = this.delimiter): string {
        const components = this.collectComponents();
        return components.join(delimiter);
    }

    /**
     * Maschinen-lesbare Darstellung mit DEFAULT_DELIMITER und Maskierung.
     */
    public asDataString(): string {
        const components = this.collectComponents();
        const masked = components.map((c) =>
            AbstractName.maskComponent(c, DEFAULT_DELIMITER)
        );
        return masked.join(DEFAULT_DELIMITER);
    }

    public toString(): string {
        return this.asDataString();
    }

    public isEqual(other: any): boolean {
        if (!other || typeof (other as any).asDataString !== "function") {
            return false;
        }
        return this.asDataString() === (other as Name).asDataString();
    }

    public getHashCode(): number {
        let hashCode = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0; // auf 32-Bit begrenzen
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        const n = this.getNoComponents();
        if (n === 0) {
            return true;
        }
        if (n === 1 && this.getComponent(0) === "") {
            return true;
        }
        return false;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // Abstrakte Komponentenzugriffe – von Unterklassen zu implementieren
    public abstract getNoComponents(): number;

    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    /**
     * Hängt alle Komponenten von `other` hinten an dieses Name-Objekt an.
     * `other` wird über seinen Datenstring (DEFAULT_DELIMITER + Maskierung) interpretiert.
     */
    public concat(other: Name): void {
        const data = other.asDataString();
        const otherComponents = AbstractName.splitMasked(
            data,
            DEFAULT_DELIMITER
        );
        for (const c of otherComponents) {
            this.append(c);
        }
    }

    /**
     * Hilfsfunktion: Alle Komponenten als Array von Strings einsammeln.
     */
    protected collectComponents(): string[] {
        const result: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            result.push(this.getComponent(i));
        }
        return result;
    }

    /**
     * Zerlegt einen maskierten String in Komponenten (ESCAPE_CHARACTER und Delimiter werden beachtet).
     */
    protected static splitMasked(source: string, delimiter: string): string[] {
        const out: string[] = [];
        let buf = "";
        let escaped = false;

        for (const ch of source) {
            if (escaped) {
                buf += ch;
                escaped = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                continue;
            }
            if (ch === delimiter) {
                out.push(buf);
                buf = "";
                continue;
            }
            buf += ch;
        }
        out.push(buf);
        return out;
    }

    /**
     * Maskiert ESCAPE_CHARACTER und das übergebene Delimiter-Zeichen in einer Komponente.
     */
    protected static maskComponent(raw: string, delimiter: string): string {
        let s = "";
        for (const ch of raw) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                s += ESCAPE_CHARACTER;
            }
            s += ch;
        }
        return s;
    }
}
