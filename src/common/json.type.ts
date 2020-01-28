/**
 * Type alias for a json version of a given class. Only attributes are keep, functions are excluded.
 * ###
 * ### Generic Types:
 * - ``T``: The type (class) of the object this JSON structure represents.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export type Json<T extends Object> = Partial<Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>>;
