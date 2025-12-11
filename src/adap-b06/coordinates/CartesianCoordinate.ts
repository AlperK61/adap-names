import { Coordinate } from "./Coordinate";
import { AbstractCoordinate } from "./AbstractCoordinate";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class CartesianCoordinate extends AbstractCoordinate {

    private readonly x: number;
    private readonly y: number;

    constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    protected doCreate(x: number, y: number): Coordinate {
        return new CartesianCoordinate(x, y);
    }

    public asDataString(): string {
        return this.x + ";" + this.y;
    }

    public getOrigin(): Coordinate {
        return new CartesianCoordinate(0, 0);
    }

    // --- Cartesian getters/setters ---
    protected doGetX(): number {
        return this.x;
    }

    protected doSetX(x: number): Coordinate {
        return new CartesianCoordinate(x, this.y);
    }

    protected doGetY(): number {
        return this.y;
    }

    protected doSetY(y: number): Coordinate {
        return new CartesianCoordinate(this.x, y);
    }

    // --- Polar getters/setters ---
    protected doGetR(): number {
        return Math.hypot(this.x, this.y);
    }

    protected doSetR(r: number): Coordinate {
        IllegalArgumentException.assert(this.isValidR(r));
        const phi = this.doGetPhi();
        return new CartesianCoordinate(
            r * Math.cos(phi),
            r * Math.sin(phi)
        );
    }

    protected doGetPhi(): number {
        let phi = Math.atan2(this.y, this.x);
        if (phi < 0) phi += 2 * Math.PI;   // Wichtig!
        return phi;
    }

    protected doSetPhi(phi: number): Coordinate {
        IllegalArgumentException.assert(this.isValidPhi(phi));
        const r = this.doGetR();
        return new CartesianCoordinate(
            r * Math.cos(phi),
            r * Math.sin(phi)
        );
    }
}
