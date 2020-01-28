import { NotImplementedYetException } from "@enterprize/exceptions";

import {
    Class, ISerializable, ITransformer, Json, metadataKeys, NewableClass, SerializableField,
    SerializableFieldMetadata,
    SerializableMetadata
} from "../common";
import { BehaviorEnum } from "../enums";
import { NotSerializableException, NotSerializableReasonEnum } from "../exceptions";
import { DeserializationOptions } from "./deserialization-options.type";
import { JsonMetadata } from "./json-metadata.type";
import { SerializationOptions } from "./serialization-options.type";
import { SerializerConfig } from "./serializer-config.type";
import { SerializerRegistry } from "./serializer-registry";

/**
 * The service that performs serialization and deserialization process. Can be configured globally or
 * per operation to change the serialization and deserialization behaviors, such as including or not
 * ``typeMetadata`` and performing other operations.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export class Serializer {

    //#region Private Attributes
    /**
     * Global serializer configuration.
     */
    private _config: SerializerConfig;

    private transformersCache: Map<Class<any>, ITransformer<any, any>>;
    //#endregion

    //#region Constructor
    constructor(config?: SerializerConfig) {

        this.setConfig(config);
        this.transformersCache = new Map<Class<any>, ITransformer<any, any>>();
    }
    //#endregion

    //#region Getters and Setters
    /**
     * Gets or sets the global configuration of the serializer service
     */
    public get config(): SerializerConfig {
        return this._config;
    }

    public set config(config: SerializerConfig) {

        this.setConfig(config);
    }
    //#endregion

    //#region Public Methods
    /**
     * Performs a deep clone of the object.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instance The object to be clone.
     * @return A deep clone of the object.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public clone<T extends Object>(instance: T): T;
    /**
     * Performs a deep clone of the object.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instances An array of objects to be cloned.
     * @return A deep clone of the array of objects.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public clone<T extends Object>(instances: Array<T>): Array<T>;
    public clone<T extends Object>(...args: [T]|[Array<T>]): T|Array<T> {
        throw new NotImplementedYetException();
    }

    /**
     * Serializes an object into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instance The object to be serialized.
     * @returns A JSON string of the object.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public serialize<T extends Object>(instance: T): string;
    /**
     * Serializes an object into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instance The object to be serialized.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns A JSON string of the object.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public serialize<T extends Object>(instance: T, options: SerializationOptions): string;
    /**
     * Serializes an array of objects into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instances The objects to be serialized.
     * @returns A JSON string of the objects.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public serialize<T extends Object>(instances: Array<T>): string;
    /**
     * Serializes an array of objects into a JSON string.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param instances The objects to be serialized.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns A JSON string of the objects.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public serialize<T extends Object>(instances: Array<T>, options: SerializationOptions): string;
    public serialize<T extends Object>(...args: [T]|
                                                [T, SerializationOptions]|
                                                [Array<T>]|
                                                [Array<T>, SerializationOptions]): string {
        throw new NotImplementedYetException();
    }

    /**
     * Deserializes a JSON string into T.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param json The JSON string to be deserialized
     * @returns The recovered object instance with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public deserialize<T extends Object>(json: string): T;
    /**
     * Deserializes a JSON string into T.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param json The JSON string to be deserialized
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The recovered object instance with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public deserialize<T extends Object>(json: string, options: DeserializationOptions): T;
    /**
     * Deserializes a JSON string into T by using ``clazz`` as root type or type checking.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param json The JSON string to be deserialized
     * @param clazz The class to be used as root type or type checking.
     * @returns The recovered object instance with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public deserialize<T extends Object>(json: string, clazz: Class<T>): T;
    /**
     * Deserializes a JSON string into T by using ``clazz`` as root type or type checking.
     * ###
     * Generic Types:
     * - ``T``: (optional) The type of the object. Default: inferred.
     * @param json The JSON string to be deserialized
     * @param clazz The class to be used as root type or type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The recovered object instance with correct prototype.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public deserialize<T extends Object>(json: string, clazz: Class<T>, options: DeserializationOptions): T;
    public deserialize<T extends Object>(...args: [string]|
                                                  [string, DeserializationOptions]|
                                                  [string, Class<T>]|
                                                  [string, Class<T>, DeserializationOptions]): T {
        throw new NotImplementedYetException();
    }

    /**
     * Converts a given instance of a class to its "JSON object" version, including, if configured,
     * the necessary metadata to convert it back to a instance of the class.
     * @param instance The instance to be converted to {@link Json}.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T extends Object>(instance: T): Json<T>;
    /**
     * Converts a given instance of a class to its "JSON object" version, including, if configured,
     * the necessary metadata to convert it back to a instance of the class.
     * @param instance The instance to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T extends Object>(instance: T, options: SerializationOptions): Json<T>;
    /**
     * Converts an array of given instances of a class to its "JSON object" version, including, if
     * configured, the necessary metadata to convert it back to a instance of the class.
     * @param instances The instances array to be converted to {@link Json}.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T extends Object>(instances: Array<T>): Array<Json<T>>;
    /**
     * Converts a given array of instances of a class to its "json object" version, including, if
     * configured, the necessary metadata to convert it back to a instance of the class.
     * @param instances The instances array to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T extends Object>(instances: Array<T>, options: SerializationOptions): Array<Json<T>>;
    public toJson<T extends Object>(...args: [T]|
                                             [T, SerializationOptions]|
                                             [Array<T>]|
                                             [Array<T>, SerializationOptions]): Json<T>|Array<Json<T>> {

        // The instance is null/undefined, no need to work
        if (args[0] == null) {
            return args[0];
        }

        let options: SerializationOptions;

        // No options, set defaults
        if (args.length === 1) {
            options = {
                typeMetadata: this._config.typeMetadata,
                objectMetadata: this._config.objectMetadata,
                groups: null,
                excludeUngrouped: false,
            };
        }
        // With options, set defaults if not set
        else {
            options = args[1];
            options.typeMetadata = options.typeMetadata != null ? options.typeMetadata : this._config.typeMetadata;
            options.objectMetadata = options.objectMetadata != null ? options.objectMetadata : this._config.objectMetadata;
            options.groups = options.groups != null ? options.groups : null;
            options.excludeUngrouped = options.excludeUngrouped != null ? options.excludeUngrouped : false;
        }


        const objectType: Class<any> = (args[0]).constructor;

        // Verify if the type has a transformer
        if (SerializerRegistry.hasTransformer(objectType as NewableClass)) {

            const transformer: ITransformer<T|Array<T>, any> = SerializerRegistry.getTransformer(objectType as NewableClass);
            return transformer.writeJson(args[0] as T|Array<T>, this);
        }
        // Verify if its a serializable type
        else if (Reflect.hasOwnMetadata(metadataKeys.serializable, objectType)) {

            const instance: T = args[0] as T;

            let currentMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, objectType);
            const metadata: Array<SerializableMetadata> = [currentMetadata];
            while (currentMetadata.superClazz != Object) {

                currentMetadata = Reflect.getMetadata(metadataKeys.serializable, currentMetadata.superClazz);
                metadata.push(currentMetadata);
            }

            console.log(metadata);


            let json: Json<T> = null;

            return json;
        }
        else {
            throw new NotSerializableException(args[0], NotSerializableReasonEnum.UNKNOWN_TYPE);
        }
    }

    /**
     * Restores a given json object to its original instance of class, if possible. For the restoration
     * process to work 100% for some given cases (i.e. when inheritance is involved), some metadata
     * must be present in the {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(json: Json<T>): T;
    /**
     * Restores a given json object to its original instance of class, if possible. For the restoration
     * process to work 100% for some given cases (i.e. when inheritance is involved), some metadata
     * must be present in the {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(json: Json<T>, options: DeserializationOptions): T;
    /**
     * Restores a given array of json object to its original instance of class, if possible. For the
     * restoration process to work 100% for some given cases (i.e. when inheritance is involved),
     * some metadata must be present in the {@link Json} object.
     * @param jsons The array of object in {@link Json} format to be restored in ``Array<T>`` instance.
     * @returns The restored object as an ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(jsons: Array<Json<T>>): Array<T>;
    /**
     * Restores a given array of json object to its original instance of class, if possible. For the
     * restoration process to work 100% for some given cases (i.e. when inheritance is involved),
     * some metadata must be present in the {@link Json} object.
     * @param jsons The array of object in {@link Json} format to be restored in ``Array<T>`` instance.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The restored object as an ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(jsons: Array<Json<T>>, options: DeserializationOptions): Array<T>;
    /**
     * Restores a given json object to its original instance of class, if possible, using a specific
     * class to validate or as the type of the root object. For the restoration process to work 100%
     * for some given cases (i.e. when inheritance is involved), some metadata must be present in the
     * {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @param clazz The class to be used as a root type or for type checking.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(json: Json<T>, clazz: Class<T>): T;
    /**
     * Restores a given json object to its original instance of class, if possible, using a specific
     * class to validate or as the type of the root object. For the restoration process to work 100%
     * for some given cases (i.e. when inheritance is involved), some metadata must be present in the
     * {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @param clazz The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(json: Json<T>, clazz: Class<T>, options: DeserializationOptions): T;
    /**
     * Restores a given array of json objects to its original instance of class, if possible, using
     * a specific class to validate or as the type of the root object. For the restoration process to
     * work 100% for some given cases (i.e. when inheritance is involved), some metadata must be present
     * in the {@link Json} object.
     * @param jsons The object array in {@link Json} format to be restored in ``Array<T>`` instance.
     * @param clazz The class to be used as a root type or for type checking.
     * @returns The restored object array as a ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(jsons: Array<Json<T>>, clazz: Class<T>): Array<T>;
    /**
     * Restores a given array of json objects to its original instance of class, if possible, using
     * a specific class to validate or as the type of the root object. For the restoration process to
     * work 100% for some given cases (i.e. when inheritance is involved), some metadata must be present
     * in the {@link Json} object.
     * @param jsons The object array in {@link Json} format to be restored in ``Array<T>`` instance.
     * @param clazz The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @returns The restored object array as a ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T extends Object>(jsons: Array<Json<T>>, clazz: Class<T>, options: DeserializationOptions): Array<T>;

    public fromJson<T extends Object>(...args: [Json<T>]|
                                               [Json<T>, DeserializationOptions]|
                                               [Array<Json<T>>]|
                                               [Array<Json<T>>, DeserializationOptions]|
                                               [Json<T>, Class<T>]|
                                               [Json<T>, Class<T>, DeserializationOptions]|
                                               [Array<Json<T>>, Class<T>]|
                                               [Array<Json<T>>, Class<T>, DeserializationOptions]): T|Array<T> {
        throw new NotImplementedYetException();
    }
    //#endregion

    //#region Protected Methods
    /**
     * Default deserialization strategy for serializable classes. Classes that implements
     * {@link ISerializable} MAY receive the result of this method and can customize the operation
     * per class. Override this method to customize the default deserialization process.
     * @param json The object in {@link Json} format
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a not serializable type is received.
     * @throws {@link VersionMismatchException} - When a not serializable type is received.
     */
    protected readJson<T>(json: Json<T>): T {
        throw new NotImplementedYetException();
    }

    /**
     * Default serialization strategy for serializable classes. Classes that implements
     * {@link  ISerializable} will receive the result of this method and can customize the operation
     * per class. Override this method to customize the default serialization process.
     * @param instance The instance of ``T`` to be serialized.
     * @param metadata Serializable metadata of the prototype chain.
     * @returns The serialized object in {@link Json} format.
     *
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a not serializable type is received.
     * @throws {@link VersionMismatchException} - When a not serializable type is received.
     */
    protected writeJson<T>(instance: T, metadata: Array<SerializableMetadata>): Json<T> {
        throw new NotImplementedYetException();
    }
    //#endregion

    //#region Private Methods
    private setConfig(config?: SerializerConfig) {

        config = config != null ? config : {};
        config.typeMetadata = config.typeMetadata != null ? config.typeMetadata : true;
        config.objectMetadata = config.objectMetadata != null ? config.objectMetadata : true;
        config.typeCheck = config.typeCheck != null ? config.typeCheck : true;
        config.versionMismatchBehavior = config.versionMismatchBehavior != null ? config.versionMismatchBehavior : BehaviorEnum.ERROR;

        this._config = Object.freeze(config);
    }
    //#endregion
}
