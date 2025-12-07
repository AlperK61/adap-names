import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public getChildNodes(): Set<Node> {     // FIX 2
        return this.childNodes;
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(cn != null, "hasChildNode: parameter must not be null");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "addChildNode: child must not be null");
        try {
            this.childNodes.add(cn);
        } catch (e: any) {
            throw new MethodFailedException("addChildNode failed", e);
        }
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "removeChildNode: child must not be null");
        try {
            this.childNodes.delete(cn);
        } catch (e: any) {
            throw new MethodFailedException("removeChildNode failed", e);
        }
    }
}
