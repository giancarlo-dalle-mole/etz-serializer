import { JsonMetadata } from "./json-metadata.type";

/**
 * Type alias for a json version of a given class. Only the class attributes are keep, methods are
 * excluded. {@link Object} and {@link Array} methods are kept.
 * ###
 * ### Generic Types:
 * - ``T``: The type (class) of the object this JSON structure represents.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export type Json<T> = Object & Metadata & {
    [K in PropertiesList<T>]?: T[K] extends Function ? never :
        T[K] extends string|number|boolean|symbol ? T[K] :
        T[K] extends Date ? string :
        T[K] extends Array<infer R> ?
            R extends Function ? never :
            R extends string|number|boolean|symbol ? Array<R> :
            R extends Date ? string :
            Array<Json<R>> :
        Json<T[K]>
};

type PropertiesList<T> = {[K in keyof T]?: T[K] extends Function ? never : K}[keyof T];

type Metadata = {"__enterprize:serializer:metadata"?: JsonMetadata};
