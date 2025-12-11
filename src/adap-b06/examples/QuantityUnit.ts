import { IllegalArgumentException } from "../common/IllegalArgumentException";

/**
 * Represents a physical quantity consisting of a numeric value plus an SI unit.
 * Immutable value object.
 */
export class QuantityUnit {

    private readonly value: number;
    private readonly unit: SIUnit;

    constructor(value: number, unit: SIUnit) {
        this.value = value;
        this.unit = unit;
    }

    public getValue(): number {
        return this.value;
    }

    public getUnit(): SIUnit {
        return this.unit;
    }

    // --- arithmetic operations ---

    public add(other: QuantityUnit): QuantityUnit {
        IllegalArgumentException.assert(this.unit.isEqual(other.unit));
        return new QuantityUnit(this.value + other.value, this.unit);
    }

    public subtract(other: QuantityUnit): QuantityUnit {
        IllegalArgumentException.assert(this.unit.isEqual(other.unit));
        return new QuantityUnit(this.value - other.value, this.unit);
    }

    public multiply(other: QuantityUnit): QuantityUnit {
        return new QuantityUnit(
            this.value * other.value,
            this.unit.multiply(other.unit)
        );
    }

    public divide(other: QuantityUnit): QuantityUnit {
        IllegalArgumentException.assert(other.value !== 0);
        return new QuantityUnit(
            this.value / other.value,
            this.unit.divide(other.unit)
        );
    }

    public toString(): string {
        return this.value + " [" + this.unit.toString() + "]";
    }
}

// --------------------------------------------------------------------------
// SI Base Units
// --------------------------------------------------------------------------

export enum BaseUnit {
    m = 0,
    kg = 1,
    s = 2,
    A = 3,
    K = 4,
    cd = 5,
    mol = 6
}

/**
 * Represents an SI unit by storing the exponents of the 7 base units.
 * Immutable value object.
 */
export class SIUnit {

    private readonly exponents: number[];

    constructor(exponents: number[]) {
        IllegalArgumentException.assert(exponents.length === 7);
        this.exponents = [...exponents];
    }

    public isEqual(other: SIUnit): boolean {
        return this.exponents.every((v, i) => v === other.exponents[i]);
    }

    /** Multiply units (adds exponents) */
    public multiply(other: SIUnit): SIUnit {
        let result: number[] = [];
        for (let i = 0; i < this.exponents.length; i++) {
            result[i] = this.exponents[i] + other.exponents[i];
        }
        return new SIUnit(result);
    }

    /** Divide units (subtracts exponents) */
    public divide(other: SIUnit): SIUnit {
        let result: number[] = [];
        for (let i = 0; i < this.exponents.length; i++) {
            result[i] = this.exponents[i] - other.exponents[i];
        }
        return new SIUnit(result);
    }

    public toString(): string {
        return `SIUnit(${this.exponents.join(",")})`;
    }

    /** Helper: base units */
    public static meter(): SIUnit {
        return new SIUnit([1,0,0,0,0,0,0]);
    }

    public static second(): SIUnit {
        return new SIUnit([0,0,1,0,0,0,0]);
    }

    public static kg(): SIUnit {
        return new SIUnit([0,1,0,0,0,0,0]);
    }
}

// --------------------------------------------------------------------------
// Better version of calculateDuration()
// distance: QuantityUnit, speed: QuantityUnit
// duration = distance / speed  -->  SIUnit s
// --------------------------------------------------------------------------

export function calculateDuration2(distance: QuantityUnit, speed: QuantityUnit): QuantityUnit {
    IllegalArgumentException.assert(speed.getValue() !== 0);
    const result = distance.divide(speed);
    return new QuantityUnit(result.getValue(), SIUnit.second());
}
