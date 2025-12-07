import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
        this.assertClassInvariant();
    }

    /**
     * Öffnet die Datei.
     * Preconditions:
     *  - Datei darf nicht bereits geöffnet sein
     *  - Datei darf nicht gelöscht sein
     * Postconditions:
     *  - state === OPEN
     */
    public open(): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(
            this.state !== FileState.OPEN,
            "file must not be already open"
        );
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "cannot open a deleted file"
        );

        // eigentliche Aktion
        this.state = FileState.OPEN;

        // Postconditions
        MethodFailedException.assert(
            this.state === FileState.OPEN,
            "file must be open after open()"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    /**
     * Liest noBytes Bytes aus der Datei.
     * Preconditions:
     *  - noBytes >= 0
     *  - Datei ist geöffnet
     *  - Datei ist nicht gelöscht
     * Postconditions:
     *  - Rückgabearray hat Länge noBytes
     *  - Zustand der Datei (state) bleibt unverändert
     */
    public read(noBytes: number): Int8Array {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(
            Number.isInteger(noBytes) && noBytes >= 0,
            "noBytes must be a non-negative integer"
        );
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open for read"
        );
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "cannot read from a deleted file"
        );

        const oldState = this.state;

        // "lesen" – hier nur Dummy-Daten
        const buffer = new Int8Array(noBytes);

        // Postconditions
        MethodFailedException.assert(
            buffer.length === noBytes,
            "read() must return array with requested length"
        );
        MethodFailedException.assert(
            this.state === oldState,
            "read() must not change file state"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();

        return buffer;
    }

    /**
     * Schließt die Datei.
     * Preconditions:
     *  - Datei muss geöffnet sein
     *  - Datei darf nicht gelöscht sein
     * Postconditions:
     *  - state === CLOSED
     */
    public close(): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open to be closed"
        );
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "cannot close a deleted file"
        );

        // eigentliche Aktion
        this.state = FileState.CLOSED;

        // Postcondition
        MethodFailedException.assert(
            this.state === FileState.CLOSED,
            "file must be closed after close()"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    /**
     * Liefert den aktuellen Zustand der Datei.
     * (protected – kann von Unterklassen/anderen Modellklassen genutzt werden)
     */
    protected doGetFileState(): FileState {
        this.assertClassInvariant();
        return this.state;
    }

    /**
     * Klasseninvariante:
     *  - state ist immer einer der drei gültigen Enum-Werte
     */
    protected assertClassInvariant(): void {
        const valid =
            this.state === FileState.OPEN ||
            this.state === FileState.CLOSED ||
            this.state === FileState.DELETED;

        InvalidStateException.assert(
            valid,
            "file must be in a valid state"
        );
    }

}
