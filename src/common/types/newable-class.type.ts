/**
 * Type alias for a class definition. Accepts only newable classes (i.e. constructable classes, non
 * abstract classes).
 *
 * ###
 * ### Generic Types
 * - ``T``: (optional) The type (class) being represented. Default: ``Object``
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export type NewableClass<T extends Object = Object> = new(...args: any[]) => T;
