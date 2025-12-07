import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn !== undefined) {
            this.setTargetNode(tn);
        }

        this.assertClassInvariants();
    }

    public getTargetNode(): Node | null {
        this.assertClassInvariants();
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(target != null, "setTargetNode: target must not be null");
        this.targetNode = target;
        this.assertClassInvariants();
    }

    public getBaseName(): string {
        this.assertClassInvariants();
        try {
            const t = this.ensureTargetNode();
            return t.getBaseName();
        } catch (e: any) {
            throw new MethodFailedException("getBaseName failed via Link", e);
        }
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null, "rename: bn must not be null");

        this.assertClassInvariants();
        try {
            const t = this.ensureTargetNode();
            t.rename(bn);
        } catch (e: any) {
            throw new MethodFailedException("rename through Link failed", e);
        }

        this.assertClassInvariants();
    }

    protected ensureTargetNode(): Node {
        InvalidStateException.assert(
            this.targetNode != null,
            "Link invariant: targetNode must not be null"
        );

        return this.targetNode as Node;
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.baseName != null,
            "Link invariant: baseName must not be null"
        );
        // targetNode may be null until explicitly set
    }
}
