/**
 * Represents serialization metadata to include in the JSON allowing transparent deserialization or
 * correct inheritance deserialization.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 28/01/2020
 */
export type JsonMetadata = {

    /**
     * Array of tuples with fully qualified name (i.e. namespace plus names separated by "." - dots)
     * with the class versions used to serialize the object. The order is from bottom to up in the
     * inheritance hierarchy (e.g. [C, B, A] in a C extends B, B extends A inheritance chain).
     */
    versions?: Array<[string, number]>;
    /**
     * Array of tuples of object metadata to restore.
     */
    objectMetadata?: Array<[string, any]>;
}
