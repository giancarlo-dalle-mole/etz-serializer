/**
 * Used to customize behavior on some operations that MAY have different behaviors under certain
 * circumstances or by programmer design choice.
 *
 * @version 1.0.0
 * @author Giacarlo Dalle Mole
 * @since 27/01/2020
 */
export enum BehaviorEnum {
    /**
     * Writes a warning on the console when a given situation happens.
     */
    WARNING,
    /**
     * Throws an error when a given situation happens. You MAY want to try-catch theses exceptions.
     */
    ERROR,
    /**
     * Do nothing when a given situation happens.
     */
    IGNORE
}
