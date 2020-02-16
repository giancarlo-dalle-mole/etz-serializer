import { DeserializationOptions, Serializer } from "../services";
import { JsonPointerEncoder } from "../services/json-pointer-encoder";

/**
 * A deserialization context for a given {@link ISerializer.toJson} method. Every call to
 * {@link ISerializer.fromJson} will create a new serialization context using the
 * {@link DeserializationContext.child} method.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 14/02/2020
 */
export class DeserializationContext {

    //#region Public Attributes
    /**
     * A {@link Map} that contains all $ref pointers to object references. Used to retrieve object
     * instance of already deserialized objects, allowing to deserialize circular references and
     * deduplication.
     */
    public readonly referenceObjectMap: Map<string, Object>;
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
     * Deserialization options being used for the operation.
     */
    public readonly deserializationOptions: DeserializationOptions;
    //#endregion

    //#region Constructor
    constructor(referenceObjectMap: Map<string, Object>, pointer: string, serializer: Serializer,
                deserializationOptions?: DeserializationOptions) {

        this.referenceObjectMap = referenceObjectMap;
        this.pointer = pointer;
        this.serializer = serializer;
        this.deserializationOptions = deserializationOptions;
    }
    //#endregion

    //#region Public Methods
    /**
     * Creates a child deserialization context based on the current one. You must set the child pointer
     * fragment (i.e. the fragment to append into the current path).
     * @param pointerFragment Child fragment to append.
     * @param deserializationOptions (optional) Custom serialization options to pass to the operation.
     */
    public child(pointerFragment: string, deserializationOptions?: DeserializationOptions): DeserializationContext {

        const pointer: string = `${this.pointer}/${JsonPointerEncoder.encode(pointerFragment)}`;

        return new DeserializationContext(this.referenceObjectMap, pointer, this.serializer, deserializationOptions != null ? deserializationOptions : this.deserializationOptions);
    }
    //#endregion
}
