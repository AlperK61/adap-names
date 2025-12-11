import { Exception } from "./Exception";

/**
 * Signals that a method received an illegal argument (precondition failed).
 */
export class IllegalArgumentException extends Exception {

    public static assert(condition: boolean, message = "illegal argument", trigger?: Exception): void {
        if (!condition) {
            throw new IllegalArgumentException(message, trigger);
        }
    }

    constructor(message: string, trigger?: Exception) {
        super(message, trigger);
    }
}
