import { Coordinate } from "./Coordinate";
import { AbstractCoordinate } from "./AbstractCoordinate";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class PolarCoordinate extends AbstractCoordinate {

    private readonly r: number;
    private readonly phi: number;

    constructor(r: number = 0, phi: number = 0) {
        super();

        IllegalArgumentException.assert(this.isValidR(r));
        IllegalArgumentException.assert(this.isValidPhi(phi));

        this.r = r;
        this.phi = phi;
    }

    protected doCreate(r: number, phi: number): Coordinate {
        return new PolarCoordinate(r, phi);
    }

    public asDataString(): string {
        return this.r + ";" + this.phi;
    }

    public getOrigin(): Coordinate {
        return new PolarCoordinate(0, 0);
    }

    // --- Cartesian view ---
    protected doGetX(): number {
        return this.r * Math.cos(this.phi);
    }

    protected doSetX(x: number): Coordinate {
        const y = this.doGetY();
        const newR = Math.hypot(x, y);

        let phi = Math.atan2(y, x);
        if (phi < 0) phi += 2 * Math.PI;

        return new PolarCoordinate(newR, phi);
    }

    protected doGetY(): number {
        return this.r * Math.sin(this.phi);
    }

    protected doSetY(y: number): Coordinate {
        const x = this.doGetX();
        const newR = Math.hypot(x, y);

        let phi = Math.atan2(y, x);
        if (phi < 0) phi += 2 * Math.PI;

        return new PolarCoordinate(newR, phi);
    }

    // --- polar access ---
    protected doGetR(): number {
        return this.r;
    }

    protected doSetR(r: number): Coordinate {
        IllegalArgumentException.assert(this.isValidR(r));
        return new PolarCoordinate(r, this.phi);
    }

    protected doGetPhi(): number {
        return this.phi;
    }

    protected doSetPhi(phi: number): Coordinate {
        IllegalArgumentException.assert(this.isValidPhi(phi));
        return new PolarCoordinate(this.r, phi);
    }
}
