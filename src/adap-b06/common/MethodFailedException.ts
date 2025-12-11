import { Exception } from "./Exception";

/**
 * Signals a postcondition failure.
 */
export class MethodFailedException extends Exception {

    public static assert(condition: boolean, message = "method failed", trigger?: Exception): void {
        if (!condition) {
            throw new MethodFailedException(message, trigger);
        }
    }

    constructor(message: string, trigger?: Exception) {
        super(message, trigger);
    }
}
