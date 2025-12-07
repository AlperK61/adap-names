import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
        this.assertClassInvariant();
    }

    /**
     * Prüft, ob der Knoten cn Kind dieses Verzeichnisses ist.
     */
    public hasChildNode(cn: Node): boolean {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Precondition
        IllegalArgumentException.assert(
            cn != null,
            "child node must not be null or undefined"
        );

        const result = this.childNodes.has(cn);

        // Postcondition: Ergebnis ist konsistent mit Set
        MethodFailedException.assert(
            result === this.childNodes.has(cn),
            "hasChildNode() must be consistent"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();

        return result;
    }

    /**
     * Fügt cn als Kind hinzu.
     *
     * Preconditions:
     *  - cn darf nicht null sein
     *  - cn darf noch kein Kind dieses Verzeichnisses sein
     *
     * Postconditions:
     *  - hasChildNode(cn) === true
     *  - Anzahl der Kinder erhöht sich um 1
     */
    public addChildNode(cn: Node): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(
            cn != null,
            "child node must not be null or undefined"
        );
        IllegalArgumentException.assert(
            !this.childNodes.has(cn),
            "child node already added to this directory"
        );

        const oldSize = this.childNodes.size;

        this.childNodes.add(cn);

        // Postconditions
        MethodFailedException.assert(
            this.childNodes.has(cn),
            "addChildNode() must add the child to the directory"
        );
        MethodFailedException.assert(
            this.childNodes.size === oldSize + 1,
            "addChildNode() must increase number of children by one"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    /**
     * Entfernt cn als Kind.
     *
     * Preconditions:
     *  - cn darf nicht null sein
     *  - cn muss aktuell Kind dieses Verzeichnisses sein
     *
     * Postconditions:
     *  - hasChildNode(cn) === false
     *  - Anzahl der Kinder vermindert sich um 1
     */
    public removeChildNode(cn: Node): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(
            cn != null,
            "child node must not be null or undefined"
        );
        IllegalArgumentException.assert(
            this.childNodes.has(cn),
            "cannot remove child that is not part of this directory"
        );

        const oldSize = this.childNodes.size;

        this.childNodes.delete(cn);

        // Postconditions
        MethodFailedException.assert(
            !this.childNodes.has(cn),
            "removeChildNode() must remove the child from the directory"
        );
        MethodFailedException.assert(
            this.childNodes.size === oldSize - 1,
            "removeChildNode() must decrease number of children by one"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    /**
     * Klasseninvariante:
     *  - childNodes ist nicht null
     *  - childNodes enthält keine null-Werte
     *  - jeder Child-Node hat dieses Directory als Parent
     */
    protected assertClassInvariant(): void {
        // Zuerst die Invariante von Node prüfen
        super["assertClassInvariant"]?.();

        InvalidStateException.assert(
            this.childNodes != null,
            "childNodes set must not be null"
        );

        for (const child of this.childNodes) {
            InvalidStateException.assert(
                child != null,
                "childNodes must not contain null or undefined"
            );
            InvalidStateException.assert(
                child.getParentNode() === this,
                "each child node must reference this directory as its parent"
            );
        }
    }

}
