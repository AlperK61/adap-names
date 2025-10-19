import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    if (this.delimiter.length !== 1) {
      throw new Error("Delimiter must be a single character.");
    }
    // defensive copy
    this.components = Array.isArray(source) ? source.slice() : [];
  }


  public asString(delimiter: string = this.delimiter): string {
    return this.components.join(delimiter);
    //throw new Error("needs implementation or deletion");
  }

  public asDataString(): string {
    const masked = this.components.map((c) =>
      StringArrayName.maskComponent(c, DEFAULT_DELIMITER)
    );
    return masked.join(DEFAULT_DELIMITER);
    //throw new Error("needs implementation or deletion");
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
    //throw new Error("needs implementation or deletion");
  }

  public isEmpty(): boolean {
    return this.components.length === 0 ||
        (this.components.length === 1 && this.components[0] === "");
    //throw new Error("needs implementation or deletion");
  }

  public getNoComponents(): number {
    return this.components.length;
    //throw new Error("needs implementation or deletion");
  }

  public getComponent(i: number): string {
    this.assertIndexInRange(i, false);
    return this.components[i];
    //throw new Error("needs implementation or deletion");
  }

  public setComponent(i: number, c: string): void {
    this.assertIndexInRange(i, false);
    this.components[i] = c;
    //throw new Error("needs implementation or deletion");
  }

  public insert(i: number, c: string): void {
    this.assertIndexInRange(i, true);
    this.components.splice(i, 0, c);
    //throw new Error("needs implementation or deletion");
  }

  public append(c: string): void {
    this.components.push(c);
    //throw new Error("needs implementation or deletion");
  }

  public remove(i: number): void {
    this.assertIndexInRange(i, false);
    this.components.splice(i, 1);
    //throw new Error("needs implementation or deletion");
  }

  public concat(other: Name): void {
    const otherData = other.asDataString();
    const otherComps = StringArrayName.splitMasked(otherData, DEFAULT_DELIMITER);
    this.components.push(...otherComps);
    //throw new Error("needs implementation or deletion");
  }


    // -------------------- Private Helfer --------------------

  /** Zerlegt an un-escapten Delimitern, beachtet ESCAPE_CHARACTER. */
  private static splitMasked(source: string, delimiter: string): string[] {
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

  /** Maskiert Backslash und das gegebene Delimiter-Zeichen in einer Komponente. */
  private static maskComponent(raw: string, delimiter: string): string {
    let s = "";
    for (const ch of raw) {
      if (ch === ESCAPE_CHARACTER || ch === delimiter) s += ESCAPE_CHARACTER;
      s += ch;
    }
    return s;
  }

  private assertIndexInRange(i: number, allowEnd: boolean): void {
    const max = allowEnd ? this.components.length : this.components.length - 1;
    const min = 0;
    const ok = allowEnd ? (i >= min && i <= max) : (i >= min && i <= max);
    if (!ok) {
      throw new Error(`Index out of range: ${i}`);
    }
  }
}
