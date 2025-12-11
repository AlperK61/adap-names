export const DEFAULT_DELIMITER = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * Represents an object that can be printed as human-readable
 * and machine-readable string formats.
 */
export interface Printable {

    asString(delimiter?: string): string;

    asDataString(): string;

    getDelimiterCharacter(): string;
}
