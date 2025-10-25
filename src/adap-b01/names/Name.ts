export const DEFAULT_DELIMITER: string = ".";
export const ESCAPE_CHARACTER = "\\";


export class Name {
  private delimiter: string = DEFAULT_DELIMITER;
  private components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    if (!Array.isArray(other)) {
      throw new Error("components must be an array");
    }

    this.delimiter = delimiter ?? DEFAULT_DELIMITER;

    this.components = [...other];

  }

  public asString(delimiter: string = this.delimiter): string {
    return this.components.join(delimiter);
  }

  public asDataString(): string {
    const esc = ESCAPE_CHARACTER; // "\\"
    const d = DEFAULT_DELIMITER; 
    const escapeForData = (s: string) =>
      s
        .replaceAll(esc, esc + esc) // "\"  -> "\\"
        .replaceAll(d, esc + d); // "."  -> "\."
    return this.components.map(escapeForData).join(d);
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.components.length) {
      throw new Error("index out of bounds");
    }
    return this.components[i];
  }

  /** Expects that new Name component c is properly masked */
  public setComponent(i: number, c: string): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error("index out of bounds");
    }
    this.components[i] = c;
  }

  /** Returns number of components in Name instance */
  public getNoComponents(): number {
    return this.components.length;
  }

  /** Expects that new Name component c is properly masked */
  public insert(i: number, c: string): void {
    if (i < 0 || i > this.components.length) {
      throw new Error("index out of bounds");
    }
    this.components.splice(i, 0, c);
  }

  /** Expects that new Name component c is properly masked */
  public append(c: string): void {
    this.components.push(c);
  }

  public remove(i: number): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error("index out of bounds");
    }
    this.components.splice(i, 1);
  }
}
