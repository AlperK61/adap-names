import { Cloneable } from "../common/Cloneable";
import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";

export interface Name extends Cloneable, Equality, Printable {

    isEmpty(): boolean;

    getNoComponents(): number;

    getComponent(i: number): string;

    /** returns a NEW Name with updated component */
    setComponent(i: number, c: string): Name;

    /** returns a NEW Name with inserted component */
    insert(i: number, c: string): Name;

    /** returns a NEW Name with appended component */
    append(c: string): Name;

    /** returns a NEW Name with removed component */
    remove(i: number): Name;

    /** returns a NEW Name which concatenates both */
    concat(other: Name): Name;
}
