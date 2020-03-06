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
     * (optional) Array of tuples with fully qualified name (i.e. namespace plus names separated by
     * "." - dots) with the class versions used to serialize the object. The order is from TOP to
     * BOTTOM in the inheritance hierarchy (e.g. [A, B, C] in a C extends B, B extends A inheritance
     * chain).
     */
    versions?: Array<[string, number]>;
    /**
     * (optional) Array of tuples of object metadata to restore.
     */
    objectMetadata?: Array<[string, any]>;
}
