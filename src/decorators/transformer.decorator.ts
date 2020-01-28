import { Class, ITransformer, NewableClass, TransformerOptions } from "../common";
import { SerializerRegistry } from "../services";

/**
 * @decorator
 * Marks a class a type transformer to be used during serialization/deserialization. The type is
 * registered on the {@link SerializerRegistry}. This decorator provides a declarative way to define
 * a transformer instead of the direct use of {@link SerializerRegistry.addTransformer} method. The
 * class MUST implement the {@link ITransformer} interface.
 *
 * ###
 * ### Generic Types:
 *
 * - T: The type to be transformed before serialization (input);
 * - S: The transformed type after serialization (output);
 * - E: optional Some extra data to be passed to the transformer in a per serializable field configuration.
 *      May be set in {@link #Serialize @Serialize} or directly in {@link SerializerRegistry.addType}
 *
 * @param type The type to be transformed in a JSON compatible format.
 * @param options (optional) Defines transformer options, such as instantiation policy.
 */
export function Transformer<T = any, S = any, E = void>(type: NewableClass, options?: TransformerOptions) {

    return (constructor: NewableClass<ITransformer<T, S, E>>) => {

        SerializerRegistry.addTransformer<T, S, E>(constructor, type, options);
    };
}
