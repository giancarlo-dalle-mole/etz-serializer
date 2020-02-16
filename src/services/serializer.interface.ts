import { Class, DeserializationContext, Json, SerializationContext } from "../common";
import { DeserializationOptions } from "./deserialization-options.type";
import { SerializationOptions } from "./serialization-options.type";
import { SerializerConfig } from "./serializer-config.type";

/**
 * The service that performs serialization and deserialization process. Can be configured globally or
 * per operation to change the serialization and deserialization behaviors, such as including or not
 * ``typeMetadata`` and performing other operations.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export interface ISerializer {

    config: SerializerConfig;

    /**
     * Performs a deep clone of the object.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param instance The object to be clone.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @return A deep clone of the object.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    clone<T extends Object, E = void>(instance: T, extra?: E): T;
    /**
     * Performs a deep clone of the object. Also clones any metadata defined with {@link Reflect} library.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param instances An array of objects to be cloned.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @return A deep clone of the array of objects.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    clone<T extends Object, E = void>(instances: Array<T>, extra?: E): Array<T>;

    /**
     * Serializes an object into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param instance The instance to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns A JSON string of the object.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    serialize<T extends Object, E = void>(instance: T, options?: SerializationOptions, extra?: E): string;
    /**
     * Serializes an array of objects into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param instances The objects to be serialized.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns A JSON string of the objects.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    serialize<T extends Object, E = void>(instances: Array<T>, options?: SerializationOptions,
                                          extra?: E): string;

    /**
     * Deserializes a JSON string into T.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param json The JSON string to be deserialized
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns The recovered object instance with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is
     *         incompatible.
     */
    deserialize<T extends Object, E = void>(json: string, clazz?: Class, options?: DeserializationOptions,
                                            extra?: E): T;
    /**
     * Deserializes a JSON string into T by using ``clazz`` as root type or type checking.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * - ``E``: (optional) The type of the extra. Default: void.
     *
     * @param json The JSON string to be deserialized
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns The recovered object array instances with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    deserialize<T extends Object, E = void>(json: string, clazz?: Class, options?: DeserializationOptions,
                                            extra?: E): Array<T>;

    /**
     * Converts a given instance of a class to its "JSON object" version, including, if configured,
     * the necessary metadata to convert it back to a instance of the class.
     * @param instance The instance to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @param context (optional) The operation context. Used to identify the context of a root
     *        operation against its root call.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    toJson<T, S = Json<T>, E = void>(instance: T, options?: SerializationOptions, extra?: E,
                                     context?: SerializationContext): S;
    /**
     * Converts a given array of instances of a class to its "json object" version, including, if
     * configured, the necessary metadata to convert it back to a instance of the class.
     * @param instances The instances array to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @param context (optional) The operation context. Used to identify the context of a root
     *        operation against its root call.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    toJson<T, S = Json<T>, E = void>(instances: Array<T>, options?: SerializationOptions,
                                     extra?: E, context?: SerializationContext): Array<S>;

    /**
     * Restores a given json object to its original instance of class, if possible. For the restoration
     * process to work 100% for some given cases (i.e. when inheritance is involved), some metadata
     * must be present in the {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @param context (optional) The operation context. Used to identify the context of a root
     *        operation against its root call.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    fromJson<T, S = Json<T>, E = void>(json: S, clazz?: Class, options?: DeserializationOptions,
                                       extra?: E, context?: DeserializationContext): T;
    /**
     * Restores a given array of json object to its original instance of class, if possible. For the
     * restoration process to work 100% for some given cases (i.e. when inheritance is involved),
     * some metadata must be present in the {@link Json} object.
     * @param jsons The array of object in {@link Json} format to be restored in ``Array<T>`` instance.
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @param context (optional) The operation context. Used to identify the context of a root
     *        operation against its root call.
     * @returns The restored object as an ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    fromJson<T, S = Json<T>, E = void>(jsons: Array<S>, clazz?: Class, options?: DeserializationOptions,
                                       extra?: E, context?: DeserializationContext): Array<T>;
}
