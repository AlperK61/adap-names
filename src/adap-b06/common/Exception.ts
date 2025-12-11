/**
 * Root class for exceptions in ADAP examples.
 */
export abstract class Exception extends Error {

    protected trigger: Exception | null = null;

    constructor(message: string, trigger?: Exception) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype); // fix prototype chain

        this.name = this.constructor.name;

        if (trigger !== undefined) {
            this.trigger = trigger;
        }
    }

    public hasTrigger(): boolean {
        return this.trigger !== null;
    }

    public getTrigger(): Exception {
        if (this.trigger === null) {
            throw new Error("No trigger exception available.");
        }
        return this.trigger;
    }
}
