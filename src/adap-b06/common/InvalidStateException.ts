import { Exception } from "./Exception";

/**
 * Signals an invalid object state (class invariant violated).
 */
export class InvalidStateException extends Exception {

    public static assert(condition: boolean, message = "invalid state", trigger?: Exception): void {
        if (!condition) {
            throw new InvalidStateException(message, trigger);
        }
    }

    constructor(message: string, trigger?: Exception) {
        super(message, trigger);
    }
}
