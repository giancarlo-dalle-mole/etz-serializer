/**
 * Type alias for a class definition.
 * @param T - (optional) The type (class) being represented.
 *            Default: ``Object``
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export type Class<T extends Object = Object> = new(...args: any[]) => T;
