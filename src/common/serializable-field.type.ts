import { TypesEnum } from "../enums";
import { Class } from "./class.type";
import { ExtraTypes } from "./extra-types.type";

/**
 * Represents the configuration of a serializable field.
 *
 * ###
 * ### Generic Types
 *
 * - ``C``: (optional) The class the field belongs to. Default: ``any``
 * - ``E``: (optional Extra data to be passed to transformers. Default ``void``
 *
 * @version 1.0.0
 */
export type SerializableField<C = any, E = void> = {
    /**
     * The name of the field.
     */
    name: keyof C;
    /**
     * The type of the field. Must be set as an arrow function to prevent TDZ errors.
     * @example
     * () => Number
     *
     * @example
     * () => Array
     *
     * @example
     * () => MyClass
     *
     * @example
     * () => MyCustomWithTransformer
     */
    type: () => Class|TypesEnum;
    /**
     * List of context groups that this field must be included.
     */
    groups?: Array<string>;
    /**
     * Extra data to be passed to the transformers.
     */
    extra?: E|ExtraTypes
}
