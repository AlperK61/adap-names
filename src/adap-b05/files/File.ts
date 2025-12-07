import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        IllegalArgumentException.assert(
            baseName != null,
            "File: base name must not be null"
        );
        IllegalArgumentException.assert(
            parent != null,
            "File: parent directory must not be null"
        );

        super(baseName, parent);

        this.assertClassInvariants();
    }

    // -----------------------------------------------------------
    // open(): wechselt von CLOSED nach OPEN
    // -----------------------------------------------------------
    public open(): void {
        this.assertClassInvariants();

        // PRECONDITION: nur aus CLOSED heraus öffnen
        InvalidStateException.assert(
            this.state === FileState.CLOSED,
            "open: file must be CLOSED to be opened"
        );

        try {
            // hier könnten echte Ressourcen geöffnet werden
            this.state = FileState.OPEN;
        } catch (e: any) {
            throw new MethodFailedException("open failed", e);
        }

        this.assertClassInvariants();
        InvalidStateException.assert(
            this.state === FileState.OPEN,
            "open postcondition failed: state must be OPEN"
        );
    }

    // -----------------------------------------------------------
    // read(): zeigt Error Handling mit Wiederholversuchen
    // -----------------------------------------------------------
    public read(noBytes: number): Int8Array {
        // PRECONDITION
        IllegalArgumentException.assert(
            Number.isInteger(noBytes) && noBytes >= 0,
            "read: number of bytes must be non-negative integer"
        );

        // File muss offen sein
        InvalidStateException.assert(
            this.state === FileState.OPEN,
            "read: file must be OPEN"
        );

        this.assertClassInvariants();

        let result: Int8Array = new Int8Array(noBytes);

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex: any) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Eskalation bei zu vielen Fehlversuchen
                    if (tries >= 3) {
                        throw new MethodFailedException("read failed after 3 attempts", ex);
                    }
                } else {
                    // Unerwarteter Fehler → ebenfalls eskalieren
                    throw new MethodFailedException("read failed due to unexpected error", ex);
                }
            }
        }

        // Optional: zusätzliche Postcondition-Absicherung
        MethodFailedException.assert(
            tries < 3,
            "read: too many failures during read"
        );

        this.assertClassInvariants();
        return result;
    }

    // -----------------------------------------------------------
    // readNextByte(): hier könnten Fehler simuliert werden
    // -----------------------------------------------------------
    protected readNextByte(): number {
        // PRECONDITION: nur aus OPEN lesen
        InvalidStateException.assert(
            this.state === FileState.OPEN,
            "readNextByte: file must be OPEN"
        );

        // In einer echten Implementierung würde hier von einem Stream gelesen.
        // Für die Übung liefern wir einfach 0 zurück.
        return 0;
    }

    // -----------------------------------------------------------
    // close(): wechselt von OPEN nach CLOSED
    // -----------------------------------------------------------
    public close(): void {
        this.assertClassInvariants();

        // PRECONDITION
        InvalidStateException.assert(
            this.state === FileState.OPEN,
            "close: file must be OPEN to be closed"
        );

        try {
            // hier könnten echte Ressourcen freigegeben werden
            this.state = FileState.CLOSED;
        } catch (e: any) {
            throw new MethodFailedException("close failed", e);
        }

        this.assertClassInvariants();
        InvalidStateException.assert(
            this.state === FileState.CLOSED,
            "close postcondition failed: state must be CLOSED"
        );
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    // -----------------------------------------------------------
    // Invarianten
    // -----------------------------------------------------------
    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.state === FileState.OPEN ||
            this.state === FileState.CLOSED ||
            this.state === FileState.DELETED,
            "File invariant: invalid state"
        );
    }
}
