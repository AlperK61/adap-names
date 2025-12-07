import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode(): RootNode {
        return this.ROOT_NODE;
    }

    constructor() {
        // Parent irrelevant → Dummy, wird überschrieben
        super("", {} as Directory);
        this.parentNode = this;
    }

    protected initialize(pn: Directory): void {
        // Root hat keinen Parent
        this.parentNode = this;
    }

    public getFullName(): Name {
        try {
            return new StringName("");   // FIX 3
        } catch (e: any) {
            throw new MethodFailedException("RootNode.getFullName failed", e);
        }
    }

    public move(to: Directory): void {
        // RootNode kann nicht verschoben werden
    }

    protected doSetBaseName(bn: string): void {
        // RootNode kann nicht umbenannt werden
    }

}
