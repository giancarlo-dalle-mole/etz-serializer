import { AbstractClass } from "./abstract-class.type";
import { NewableClass } from "./newable-class.type";

/**
 * Type alias for a class definition. Accepts normal and abstract classes.
 *
 * ###
 * ### Generic Types
 * - ``T``: (optional) The type (class) being represented. Default: ``Object``
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export type Class<T extends Object = Object> = NewableClass<T>|AbstractClass<T>;
