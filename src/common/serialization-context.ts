import { SerializationOptions, Serializer } from "../services";
import { JsonPointerEncoder } from "../services/json-pointer-encoder";

/**
 * A serialization context for a given {@link ISerializer.toJson} method. Every call to
 * {@link ISerializer.toJson} will create a new serialization context using the
 * {@link SerializationContext.child} method.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 14/02/2020
 */
export class SerializationContext {

    //#region Public Attributes
    /**
     * A {@link Map} that contains all object references and their $ref pointer to the first appearance
     * in the operation. Used to retrieve reference path of already serialized objects, allowing
     * to serialize circular references and deduplication.
     */
    public readonly objectReferenceMap: Map<Object, string>;
    /**
     * The current pointer path related to the objects root. (e.g. #, #/foo, #/foo/bar/baz).
     * The property name is always encoded conforming [RFC 6901](https://tools.ietf.org/html/rfc6901).
     */
    public readonly pointer: string;
    /**
     * Serializer reference being used.
     */
    public readonly serializer: Serializer;
    /**
     * Serialization options being used for the operation.
     */
    public readonly serializationOptions: SerializationOptions;
    //#endregion

    //#region Constructor
    constructor(objectReferenceMap: Map<Object, string>, pointer: string, serializer: Serializer,
                serializationOptions: SerializationOptions) {

        this.objectReferenceMap = objectReferenceMap;
        this.pointer = pointer;
        this.serializer = serializer;
        this.serializationOptions = serializationOptions;
    }
    //#endregion

    //#region Public Methods
    /**
     * Creates a child serialization context based on the current one. You must set the child pointer
     * fragment (i.e. the fragment to append into the current path).
     * @param pointerFragment Child fragment to append.
     * @param serializationOptions (optional) Custom serialization options to pass to the operation.
     */
    public child(pointerFragment: string, serializationOptions?: SerializationOptions): SerializationContext {

        const pointer: string = `${this.pointer}/${JsonPointerEncoder.encode(pointerFragment)}`;

        return new SerializationContext(this.objectReferenceMap, pointer, this.serializer, serializationOptions != null ? serializationOptions : this.serializationOptions);
    }
    //#endregion
}
