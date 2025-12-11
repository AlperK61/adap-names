export interface Equality {
    /**
     * Returns true if this value object is equal to the other object.
     */
    isEqual(other: unknown): boolean;

    /**
     * Returns a hash code that respects the equality contract.
     */
    getHashCode(): number;
}
