import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode!: Directory;  // FIX 1: definite assignment

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(
            bn != null,
            "Node constructor: baseName must not be null"
        );
        IllegalArgumentException.assert(
            pn != null,
            "Node constructor: parent directory must not be null"
        );

        try {
            this.doSetBaseName(bn);
            this.initialize(pn);
        } catch (e: any) {
            throw new MethodFailedException("Node constructor failed", e);
        }

        this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        IllegalArgumentException.assert(
            pn != null,
            "initialize: parent directory must not be null"
        );

        this.parentNode = pn;

        try {
            pn.addChildNode(this);
        } catch (e: any) {
            throw new MethodFailedException("Node.initialize failed", e);
        }
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(
            to != null,
            "move: destination directory must not be null"
        );

        this.assertClassInvariants();

        try {
            this.parentNode.removeChildNode(this);
            to.addChildNode(this);
            this.parentNode = to;
        } catch (e: any) {
            throw new MethodFailedException("move failed", e);
        }

        this.assertClassInvariants();
    }

    public getFullName(): Name {
        this.assertClassInvariants();
        try {
            const parent = this.parentNode.getFullName();
            parent.append(this.getBaseName());
            return parent;
        } catch (e: any) {
            throw new MethodFailedException("getFullName failed", e);
        }
    }

    public getBaseName(): string {
        this.assertClassInvariants();
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null, "rename: new baseName must not be null");

        this.assertClassInvariants();
        try {
            this.doSetBaseName(bn);
        } catch (e: any) {
            throw new MethodFailedException("rename failed", e);
        }
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        IllegalArgumentException.assert(bn != null, "doSetBaseName: bn must not be null");
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.assertClassInvariants();
        return this.parentNode;
    }

    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            bn != null,
            "findNodes: search base name must not be null"
        );

        this.assertClassInvariants();

        const result = new Set<Node>();

        try {
            this.recursiveFindNodes(this, bn, result);
        } catch (e: any) {
            throw new MethodFailedException("findNodes failed", e);
        }

        return result;
    }

    protected recursiveFindNodes(node: Node, bn: string, acc: Set<Node>): void {
        if (node.getBaseName() === bn) acc.add(node);

        if (node instanceof Directory) {
            for (const child of node.getChildNodes()) {
                this.recursiveFindNodes(child, bn, acc);
            }
        }
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.parentNode != null,
            "Invariant: parentNode must not be null"
        );
        InvalidStateException.assert(
            this.baseName != null,
            "Invariant: baseName must not be null"
        );
    }
}
