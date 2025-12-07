import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // PRECONDITION
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "AbstractName: delimiter must be a single character"
        );

        this.delimiter = delimiter;

        // Kein assertClassInvariants(): konkrete Subklassen sind noch nicht initialisiert
    }

    // ---------------------------------------------------------------
    // clone()
    // ---------------------------------------------------------------
    public clone(): Name {
        this.assertClassInvariants();

        try {
            const ctor = this.constructor as any;
            const cloned: Name = new ctor(this.delimiter);

            for (let i = 0; i < this.getNoComponents(); i++) {
                cloned.append(this.getComponent(i));
            }

            // POSTCONDITION
            MethodFailedException.assert(
                cloned.isEqual(this),
                "clone: cloned object must be equal to original"
            );

            return cloned;
        } catch (e: any) {
            throw new MethodFailedException("clone failed", e);
        }
    }

    // ---------------------------------------------------------------
    // asString() — Human-readable
    // ---------------------------------------------------------------
    public asString(delimiter: string = this.delimiter): string {
        // PRECONDITION
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "asString: delimiter must be a single character"
        );

        this.assertClassInvariants();

        if (this.getNoComponents() === 0) return "";

        try {
            const parts: string[] = [];
            for (let i = 0; i < this.getNoComponents(); i++) {
                parts.push(this.getComponent(i));
            }

            const result = parts.join(delimiter);

            MethodFailedException.assert(
                result != null,
                "asString postcondition failed"
            );

            return result;
        } catch (e: any) {
            throw new MethodFailedException("asString failed", e);
        }
    }

    // ---------------------------------------------------------------
    // asDataString() — Machine-readable
    // ---------------------------------------------------------------
    public asDataString(): string {
        this.assertClassInvariants();

        try {
            if (this.getNoComponents() === 0) return "";

            const parts: string[] = [];

            for (let i = 0; i < this.getNoComponents(); i++) {
                const comp = this.getComponent(i);
                let escaped = "";

                for (const ch of comp) {
                    if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                        escaped += ESCAPE_CHARACTER;
                    }
                    escaped += ch;
                }

                parts.push(escaped);
            }

            const result = parts.join(this.delimiter);

            MethodFailedException.assert(
                result != null,
                "asDataString postcondition failed"
            );

            return result;
        } catch (e: any) {
            throw new MethodFailedException("asDataString failed", e);
        }
    }

    // ---------------------------------------------------------------
    // isEqual()
    // ---------------------------------------------------------------
    public isEqual(other: Name): boolean {
        // PRECONDITION
        IllegalArgumentException.assert(other != null, "isEqual: other must not be null");

        this.assertClassInvariants();

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    // ---------------------------------------------------------------
    // getHashCode()
    // ---------------------------------------------------------------
    public getHashCode(): number {
        this.assertClassInvariants();

        let hash = 17;

        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.getComponent(i);
            for (const ch of comp) {
                hash = (hash * 31 + ch.charCodeAt(0)) | 0; // 32-bit
            }
        }

        return hash;
    }

    // ---------------------------------------------------------------
    // isEmpty()
    // ---------------------------------------------------------------
    public isEmpty(): boolean {
        this.assertClassInvariants();
        return this.getNoComponents() === 0;
    }

    // ---------------------------------------------------------------
    // getDelimiterCharacter()
    // ---------------------------------------------------------------
    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    // ---------------------------------------------------------------
    // concat()
    // ---------------------------------------------------------------
    public concat(other: Name): void {
        // PRECONDITION
        IllegalArgumentException.assert(other != null, "concat: other must not be null");

        this.assertClassInvariants();

        const oldCount = this.getNoComponents();

        try {
            for (let i = 0; i < other.getNoComponents(); i++) {
                this.append(other.getComponent(i));
            }
        } catch (e: any) {
            throw new MethodFailedException("concat failed", e);
        }

        this.assertClassInvariants();

        // POSTCONDITION
        MethodFailedException.assert(
            this.getNoComponents() === oldCount + other.getNoComponents(),
            "concat: postcondition failed—wrong number of components after concat"
        );
    }

    // ---------------------------------------------------------------
    // INVARIANT CHECKING (must be called by subclasses)
    // ---------------------------------------------------------------
    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.delimiter != null && this.delimiter.length === 1,
            "delimiter invariant violated"
        );

        const n = this.getNoComponents();
        InvalidStateException.assert(n >= 0, "component count must be non-negative");

        for (let i = 0; i < n; i++) {
            const comp = this.getComponent(i);
            InvalidStateException.assert(
                comp != null,
                "component invariant violated: must not be null"
            );
        }
    }

    // ---------------------------------------------------------------
    // ABSTRACT METHODS
    // ---------------------------------------------------------------
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
