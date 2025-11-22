import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.name = source ?? "";
        this.recomputeNoComponents();
    }

    public clone(): Name {
        // neue Instanz mit gleichem Inhalt und gleichem Delimiter
        return new StringName(this.asString(this.delimiter), this.delimiter);
    }

    // Komponentenanzahl
    public getNoComponents(): number {
        return this.noComponents;
    }

    // Komponente lesen
    public getComponent(i: number): string {
        const parts = this.getParts();
        if (i < 0 || i >= parts.length) {
            throw new RangeError("Index out of bounds");
        }
        return parts[i];
    }

    // Komponente setzen
    public setComponent(i: number, c: string): void {
        const parts = this.getParts();
        if (i < 0 || i >= parts.length) {
            throw new RangeError("Index out of bounds");
        }
        parts[i] = c;
        this.rebuildFromParts(parts);
    }

    // Komponente einfügen
    public insert(i: number, c: string): void {
        const parts = this.getParts();
        if (i < 0 || i > parts.length) {
            throw new RangeError("Index out of bounds");
        }
        parts.splice(i, 0, c);
        this.rebuildFromParts(parts);
    }

    // Komponente am Ende anhängen
    public append(c: string): void {
        const parts = this.getParts();
        parts.push(c);
        this.rebuildFromParts(parts);
    }

    // Komponente entfernen
    public remove(i: number): void {
        const parts = this.getParts();
        if (i < 0 || i >= parts.length) {
            throw new RangeError("Index out of bounds");
        }
        parts.splice(i, 1);
        this.rebuildFromParts(parts);
    }

    // --- interne Hilfsfunktionen ---

    private getParts(): string[] {
        if (!this.name) {
            return [];
        }
        return this.name.split(this.delimiter);
    }

    private rebuildFromParts(parts: string[]): void {
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    private recomputeNoComponents(): void {
        if (!this.name) {
            this.noComponents = 0;
        } else {
            this.noComponents = this.name.split(this.delimiter).length;
        }
    }
}
