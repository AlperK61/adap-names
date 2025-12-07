import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER } from "../common/Printable";


/**
 * RootNode ist das Wurzelverzeichnis des gesamten Dateisystems.
 * Es hat immer:
 *  - einen leeren Basisnamen
 *  - sich selbst als Elternknoten
 *  - keine Parent-Änderungen
 *  - keine Verschiebung
 *  - keine Umbenennung
 */
export class RootNode extends Directory {

    protected static readonly ROOT_NODE: RootNode = new RootNode(true);

    /**
     * Öffentlicher Zugriff auf die einzige Instanz.
     */
    public static getRootNode(): RootNode {
        return this.ROOT_NODE;
    }

    /**
     * Geschützter Konstruktor, um Singleton zu realisieren.
     * Das Flag verhindert, dass versehentlich eine weitere RootNode erzeugt wird.
     */
    protected constructor(internalFlag: boolean = false) {
        IllegalArgumentException.assert(
            internalFlag === true,
            "use RootNode.getRootNode() instead of constructing directly"
        );

        // Dummy-parent vermeiden: root ist sein eigener Parent
        super("", {} as Directory);

        // Parent korrekt setzen
        this.parentNode = this;

        // Invariante nach Konstruktion prüfen
        this.assertClassInvariant();
    }

    /**
     * Root hat immer sich selbst als Parent – override verhindert Manipulation.
     */
    protected initialize(pn: Directory): void {
        // RootNode ignoriert das angegebene parentDirectory
        this.parentNode = this;
    }

    /**
     * Der volle Name des RootNodes ist immer der leere Name.
     */
    public getFullName(): Name {
        this.assertClassInvariant();

        // Root-Name ist immer leer, unabhängig vom Delimiter
        const result = new StringName("", DEFAULT_DELIMITER);

        MethodFailedException.assert(
            result.isEmpty(),
            "Root full name must always be empty"
        );

        this.assertClassInvariant();
        return result;
    }


    /**
     * RootNode kann nicht verschoben werden – Nulloperation.
     */
    public move(to: Directory): void {
        // Präzise: Root darf nirgendwohin bewegt werden
        // Aber laut gegebenem Code ist es eine Null-Operation.
        // Wir schützen das Verhalten aber mit Contracts:

        IllegalArgumentException.assert(
            to != null,
            "move target directory must not be null"
        );

        // Postcondition: Root bleibt Root, parent bleibt self
        MethodFailedException.assert(
            this.parentNode === this,
            "RootNode.move() must not change parent node"
        );
    }

    /**
     * BaseName von RootNode ist immer leer und unveränderbar.
     */
    protected doSetBaseName(bn: string): void {
        // BaseName des RootNodes kann nicht verändert werden
        MethodFailedException.assert(
            bn === "",
            "RootNode base name must remain empty"
        );
    }

    /**
     * Klasseninvariante des RootNodes:
     *  - parentNode === this
     *  - baseName === ""
     */
    protected assertClassInvariant(): void {
        super["assertClassInvariant"]?.();

        InvalidStateException.assert(
            this.baseName === "",
            "RootNode baseName must be empty"
        );

        InvalidStateException.assert(
            this.parentNode === this,
            "RootNode must have itself as parentNode"
        );
    }

}
