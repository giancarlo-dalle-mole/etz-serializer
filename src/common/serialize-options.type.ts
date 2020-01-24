import { ExtraTypes } from "./extra-types.type";

/**
 * Serialization options for a field marked with {@link #Serialize @Serialize}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export type SerializeOptions<E = void> = {

    /**
     * (optional) A list of serialization groups to include the attribute during
     * serialization/deserialization.
     */
    groups?: Array<string>;
    /**
     * (optional) Some extra data to be passed to the Transformer during serialization/deserialization.
     * An example of usage is for {@link Array} on the {@link ArrayTransformer} ({@link ArrayExtra}).
     */
    extra?: E|ExtraTypes;
}
