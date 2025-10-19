import { DefaultDeserializer } from "v8";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    this.delimiter = delimiter ? delimiter : DEFAULT_DELIMITER;
    if (this.delimiter.length !== 1) {
      throw new Error("Delimiter must be a single character.");
    }

    this.name = source ?? "";
    this.noComponents = StringName.splitMasked(
      this.name,
      this.delimiter
    ).length;

    //throw new Error("needs implementation or deletion");
  }

  public asString(delimiter: string = this.delimiter): string {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    return comps.join(delimiter);
    //throw new Error("needs implementation or deletion");
  }

  public asDataString(): string {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    const masked = comps.map((c) =>
      StringName.maskComponent(c, DEFAULT_DELIMITER)
    );
    return masked.join(DEFAULT_DELIMITER);
    //throw new Error("needs implementation or deletion");
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;

    //throw new Error("needs implementation or deletion");
  }

  public isEmpty(): boolean {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    return comps.length === 0 && comps[0] === "";
    //throw new Error("needs implementation or deletion");
  }

  public getNoComponents(): number {
    return this.noComponents;
    //throw new Error("needs implementation or deletion");
  }

  public getComponent(x: number): string {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    if (x < 0 || x >= comps.length) {
      throw new Error(`Index out of range: ${x}`);
    }
    return comps[x];
    //throw new Error("needs implementation or deletion");
  }

  public setComponent(n: number, c: string): void {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    if (n < 0 || n >= comps.length) {
      throw new Error(`Index out of range: ${n}`);
    }
    comps[n] = c;
    this.rebuildFromComponents(comps);

    //throw new Error("needs implementation or deletion");
  }

  public insert(n: number, c: string): void {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    if (n < 0 || n > comps.length) {
      throw new Error(`Index out of range: ${n}`);
    }
    comps.splice(n, 0, c);
    this.rebuildFromComponents(comps);

    //throw new Error("needs implementation or deletion");
  }

  public append(c: string): void {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    comps.push(c);
    this.rebuildFromComponents(comps);
    //throw new Error("needs implementation or deletion");
  }

  public remove(n: number): void {
    const comps = StringName.splitMasked(this.name, this.delimiter);
    if (n < 0 || n >= comps.length) {
      throw new Error(`Index out of range: ${n}`);
    }
    comps.splice(n, 1);
    this.rebuildFromComponents(comps);
    //throw new Error("needs implementation or deletion");
  }

  public concat(other: Name): void {
    const mine = StringName.splitMasked(this.name, this.delimiter);
    const otherData = other.asString(this.delimiter);
    const otherComps = StringName.splitMasked(otherData, DEFAULT_DELIMITER);
    this.rebuildFromComponents(mine.concat(otherComps));
    //throw new Error("needs implementation or deletion");
  }

  private static splitMasked(source: string, delimiter: string): string[] {
    const out: string[] = [];
    let buf = "";
    let escaped = false;

    for (const ch of source) {
      if (escaped) {
        buf += ch; // nächstes Zeichen wörtlich übernehmen
        escaped = false;
        continue;
      }
      if (ch === ESCAPE_CHARACTER) {
        escaped = true; // nächstes Zeichen wird wörtlich
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

  // Maskiert Backslash und das gegebene Delimiter-Zeichen in einer Komponente
  private static maskComponent(raw: string, delimiter: string): string {
    let s = "";
    for (const ch of raw) {
      if (ch === ESCAPE_CHARACTER || ch === delimiter) s += ESCAPE_CHARACTER;
      s += ch;
    }
    return s;
  }
  // Baut den internen String aus unmaskierten Komponenten für den aktuellen Delimiter
  private rebuildFromComponents(components: string[]): void {
    this.name = components
      .map((c) => StringName.maskComponent(c, this.delimiter))
      .join(this.delimiter);
    this.noComponents = components.length;
  }
}
