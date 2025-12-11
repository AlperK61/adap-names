import { Exception } from "./Exception";

/**
 * Signals that an external service failed to perform its work.
 */
export class ServiceFailureException extends Exception {

    public static assert(condition: boolean, message = "service failed", trigger?: Exception): void {
        if (!condition) {
            throw new ServiceFailureException(message, trigger);
        }
    }

    constructor(message: string, trigger?: Exception) {
        super(message, trigger);
    }
}
