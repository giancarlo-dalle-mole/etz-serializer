import { DeserializationOptions, SerializationOptions, Serializer } from "../services";

/**
 * Describes method signatures for a type transformer.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export interface ITransformer<T, S, E = void> {

    /**
     *
     * @param json The original JSON being deserialized.
     * @param serializer The serializer service that called the transformer.
     * @param extra (optional) Extra data to helps transformation. You MAY want to throw an
     *        {@link ExtraTransformDataRequiredException} if the transform requires it. You MAY want
     *        to throw {@link InvalidExtraTransformDataException} if the extra data is in an invalid
     *        format.
     * @param options (optional)
     * The deserialized object as an instance of T.
     */
    readJson(json: S, extra?: E, serializer?: Serializer, options?: DeserializationOptions): T;

    writeJson(instance: T, extra?: E, serializer?: Serializer, options?: SerializationOptions): S;
}
