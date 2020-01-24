/**
 * Type alias for a class definition. Accepts only abstract classes (non constructable classes,
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
export type AbstractClass<T extends Object = Object> = Function & { prototype: T };
