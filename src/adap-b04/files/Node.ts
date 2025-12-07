import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // Preconditions
        IllegalArgumentException.assert(bn != null, "base name must not be null or undefined");
        IllegalArgumentException.assert(pn != null, "parent directory must not be null or undefined");

        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);

        // Klasseninvariante nach Konstruktion
        this.assertClassInvariant();
    }

    protected initialize(pn: Directory): void {
        // einfache Schutzmaßnahme, auch wenn protected:
        IllegalArgumentException.assert(pn != null, "parent directory must not be null or undefined");

        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    /**
     * Verschiebt diesen Knoten in ein anderes Verzeichnis.
     *
     * Preconditions:
     *  - Zielverzeichnis darf nicht null sein
     *
     * Postconditions:
     *  - parentNode === to
     */
    public move(to: Directory): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(to != null, "target directory must not be null or undefined");

        const oldParent = this.parentNode;

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        // Postcondition: neuer Parent ist das Ziel
        MethodFailedException.assert(
            this.parentNode === to,
            "move() must update parentNode to target directory"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    /**
     * Liefert den vollen Namen dieses Knotens.
     * (Verzeichnisname + BaseName)
     */
    public getFullName(): Name {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();

        return result;
    }

    public getBaseName(): string {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        const result = this.doGetBaseName();

        // Postcondition: BaseName darf nicht null/undefined sein
        MethodFailedException.assert(
            result != null,
            "getBaseName() must not return null or undefined"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();

        return result;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    /**
     * Setzt den Basisnamen dieses Knotens.
     *
     * Preconditions:
     *  - bn darf nicht null/undefined sein
     *
     * Postconditions:
     *  - getBaseName() === bn
     */
    public rename(bn: string): void {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        // Preconditions
        IllegalArgumentException.assert(bn != null, "new base name must not be null or undefined");

        this.doSetBaseName(bn);

        // Postcondition
        MethodFailedException.assert(
            this.getBaseName() === bn,
            "rename() must change the base name"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        // Klasseninvariante vor Ausführung
        this.assertClassInvariant();

        const result = this.parentNode;

        // Postcondition
        MethodFailedException.assert(
            result != null,
            "getParentNode() must not return null or undefined"
        );

        // Klasseninvariante nach Ausführung
        this.assertClassInvariant();

        return result;
    }

    /**
     * Klasseninvariante:
     *  - baseName ist nicht null/undefined
     *  - parentNode ist nicht null/undefined
     */
    protected assertClassInvariant(): void {
        InvalidStateException.assert(
            this.baseName != null,
            "baseName must not be null or undefined"
        );
        InvalidStateException.assert(
            this.parentNode != null,
            "parentNode must not be null or undefined"
        );
    }

}
