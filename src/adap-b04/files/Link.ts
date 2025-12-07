import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        // Preconditions für Basisdaten
        IllegalArgumentException.assert(bn != null, "base name must not be null or undefined");
        IllegalArgumentException.assert(pn != null, "parent directory must not be null or undefined");

        super(bn, pn);

        if (tn !== undefined) {
            this.targetNode = tn;
        }

        this.assertClassInvariant();
    }

    /**
     * Liefert das Ziel dieses Links (kann null sein).
     */
    public getTargetNode(): Node | null {
        this.assertClassInvariant();
        return this.targetNode;
    }

    /**
     * Setzt das Ziel dieses Links.
     *
     * Preconditions:
     *  - target darf nicht null/undefined sein
     *
     * Postconditions:
     *  - getTargetNode() === target
     */
    public setTargetNode(target: Node): void {
        this.assertClassInvariant();

        // Precondition
        IllegalArgumentException.assert(target != null, "target node must not be null or undefined");

        this.targetNode = target;

        // Postcondition
        MethodFailedException.assert(
            this.getTargetNode() === target,
            "setTargetNode() must update targetNode"
        );

        this.assertClassInvariant();
    }

    /**
     * Liefert den Basisnamen des Zielknotens.
     *
     * Preconditions:
     *  - targetNode darf nicht null sein
     */
    public getBaseName(): string {
        this.assertClassInvariant();

        const target = this.ensureTargetNode(this.targetNode);
        const result = target.getBaseName();

        MethodFailedException.assert(
            result != null,
            "getBaseName() must not return null or undefined"
        );

        this.assertClassInvariant();
        return result;
    }

    /**
     * Delegiert die Umbenennung an den Zielknoten.
     *
     * Preconditions:
     *  - targetNode darf nicht null sein
     */
    public rename(bn: string): void {
        this.assertClassInvariant();

        // Precondition (eigener Name)
        IllegalArgumentException.assert(bn != null, "new base name must not be null or undefined");

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);

        // Postcondition: delegiert, hier keine zusätzliche State-Änderung im Link selbst
        this.assertClassInvariant();
    }

    /**
     * Stellt sicher, dass ein Zielknoten gesetzt ist.
     *
     * Preconditions:
     *  - target darf nicht null sein
     */
    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(
            target != null,
            "link target must not be null when used"
        );
        return target as Node;
    }

    /**
     * Klasseninvariante:
     *  - parentNode und baseName sind gültig (über super.assertClassInvariant)
     *  - wenn targetNode nicht null ist, dann ist es ein gültiges Node-Objekt
     */
    protected assertClassInvariant(): void {
        // Invariante von Node
        // (Node.assertClassInvariant ist protected, daher direkt aufrufbar)
        super.assertClassInvariant?.();

        InvalidStateException.assert(
            this.baseName != null,
            "baseName must not be null or undefined"
        );
        InvalidStateException.assert(
            this.parentNode != null,
            "parentNode must not be null or undefined"
        );

        if (this.targetNode !== null) {
            InvalidStateException.assert(
                this.targetNode != null,
                "targetNode must not be null when set"
            );
        }
    }
}
