export class RangeBound<T> {

    private readonly value: T;
    private readonly inclusive: boolean;

    constructor(value: T, inclusive: boolean) {
        this.value = value;
        this.inclusive = inclusive;
    }

    public getValue(): T {
        return this.value;
    }

    public isInclusive(): boolean {
        return this.inclusive;
    }
}

/**
 * Generic range value object with comparator.
 * Supports [a,b], [a,b), (a,b], (a,b).
 */
export class Range<T> {

    private readonly lowerBound: RangeBound<T>;
    private readonly upperBound: RangeBound<T>;
    private readonly comparator: (a: T, b: T) => number;

    constructor(
        lowerBound: RangeBound<T>,
        upperBound: RangeBound<T>,
        comparator: (a: T, b: T) => number
    ) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.comparator = comparator;

        // enforce valid range: lower ≤ upper
        const cmp = comparator(lowerBound.getValue(), upperBound.getValue());
        if (cmp > 0) {
            throw new Error("Invalid range: lowerBound > upperBound");
        }
    }

    /** Check if a value is inside the range. */
    public includes(value: T): boolean {
        const cmpLower = this.comparator(value, this.lowerBound.getValue());
        const cmpUpper = this.comparator(value, this.upperBound.getValue());

        const lowerOk = this.lowerBound.isInclusive()
            ? cmpLower >= 0
            : cmpLower > 0;

        const upperOk = this.upperBound.isInclusive()
            ? cmpUpper <= 0
            : cmpUpper < 0;

        return lowerOk && upperOk;
    }

    public getLowerBound(): RangeBound<T> {
        return this.lowerBound;
    }

    public getUpperBound(): RangeBound<T> {
        return this.upperBound;
    }
}
