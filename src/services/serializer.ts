import { NotImplementedYetException } from "@enterprize/exceptions";

import {
    Class, ISerializable, ITransformer, Json, metadataKeys, NewableClass, SerializableField,
    SerializableFieldMetadata,
    SerializableMetadata, SerializeOptions
} from "../common";
import { BehaviorEnum } from "../enums";
import { NotSerializableException } from "../exceptions";
import { DeserializationOptions } from "./deserialization-options.type";
import { JsonMetadata } from "./json-metadata.type";
import { SerializationOptions } from "./serialization-options.type";
import { SerializerConfig } from "./serializer-config.type";
import { JsonWriter } from "./json-writer";
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
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T, S = Json<T>, E = void>(instance: T, options?: SerializationOptions, extra?: E): S;

    /**
     * Converts a given array of instances of a class to its "json object" version, including, if
     * configured, the necessary metadata to convert it back to a instance of the class.
     * @param instances The instances array to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public toJson<T, S = Json<T>, E = void>(instances: Array<T>, options?: SerializationOptions, extra?: E): Array<S>;
    public toJson<T, S = Json<T>, E = void>(...args: any[]): S|Array<S> {

        const instance: T|Array<T> = args[0];
        const options: SerializationOptions = args[1];
        const extra: E = args[2];

        // The instance is null/undefined, no need to work
        if (instance == null) {
            return instance === null ? null : undefined;
        }

        // Options for the operation with defaults
        let opOptions: SerializationOptions;

        // No options, set defaults
        if (args[1] == null) {
            opOptions = {
                typeMetadata: this._config.typeMetadata,
                objectMetadata: this._config.objectMetadata,
                groups: null,
                excludeUngrouped: false
            };
        }
        // With options, set defaults if not set
        else {
            opOptions = {
                typeMetadata: options.typeMetadata != null ? options.typeMetadata : this._config.typeMetadata,
                objectMetadata: options.objectMetadata != null ? options.objectMetadata : this._config.objectMetadata,
                groups: options.groups != null ? options.groups : null,
                excludeUngrouped: options.excludeUngrouped != null ? options.excludeUngrouped : false
            };
        }

        // Type of the instance
        const objectType: Class = (args[0]).constructor;

        // Verify if the type has a transformer
        if (SerializerRegistry.hasTransformer(objectType as NewableClass)) {

            const transformer: ITransformer<T|Array<T>, S, E> = SerializerRegistry.getTransformer(objectType as NewableClass);
            return transformer.writeJson(instance, extra, this);
        }
        // Verify if its a serializable type
        else if (Reflect.hasOwnMetadata(metadataKeys.serializable, objectType)) {

            let currentMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, objectType);
            const metadata: Array<SerializableMetadata> = [currentMetadata];
            while (currentMetadata.superClazz != Object) {
                currentMetadata = Reflect.getMetadata(metadataKeys.serializable, currentMetadata.superClazz);
                metadata.unshift(currentMetadata); //We use unshift to facilitate TOP - BOTTOM approach
            }

            const json: Json<T> = {};

            let versions: Array<[string, number]>;
            let objectMetadata: Array<[string, any]>;

            if (opOptions.typeMetadata) {
                versions = [];
            }

            for (let serializableMetadata of metadata) {

                const serializerOutput: JsonWriter<T> = new JsonWriter<T>(
                    this, opOptions, instance as T, serializableMetadata, json
                );

                // Checks and calls custom writeJson from ISerializable interface
                if (serializableMetadata.clazz.prototype.hasOwnProperty("writeJson")) {
                    Reflect.apply(
                        Reflect.get(serializableMetadata.clazz.prototype, "writeJson"),
                        instance,
                        [serializerOutput]
                    );
                }
                else {
                    serializerOutput.defaultWriteJson();
                }

                // Add the class version used
                if (opOptions.typeMetadata) {
                    versions.push([
                        `${serializableMetadata.namespace}.${serializableMetadata.name}`,
                        serializableMetadata.version
                    ]);
                }
            }

            // If set to add instance metadata (if any)
            if (opOptions.objectMetadata) {

                const instanceMetadataKeys: string[] = Reflect.getMetadataKeys(instance);
                if (instanceMetadataKeys.length > 0) {

                    objectMetadata = [];

                    for (let metadataKey of instanceMetadataKeys) {
                        objectMetadata.push([
                            metadataKey,
                            Reflect.getMetadata(metadataKey, instance)
                        ]);
                    }
                }
            }

            // if any metadata was set, add to json
            if ((versions != null && versions.length > 0) || (objectMetadata != null && objectMetadata.length > 0)) {
                const jsonMetadata: JsonMetadata = {
                    versions: versions,
                    objectMetadata: objectMetadata
                };
                Reflect.set(json, "__enterprize:serializer:metadata", jsonMetadata);
            }

            return json as any;
        }
        else {
            throw new NotSerializableException(instance);
        }
    }

    /**
     * Restores a given json object to its original instance of class, if possible. For the restoration
     * process to work 100% for some given cases (i.e. when inheritance is involved), some metadata
     * must be present in the {@link Json} object.
     * @param json The object in {@link Json} format to be restored in ``T`` instance.
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns The restored object as a ``T`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T, S = Json<T>, E = void>(json: Json<T>, clazz?: Class,
                                              options?: SerializationOptions, extra?: E): T;
    /**
     * Restores a given array of json object to its original instance of class, if possible. For the
     * restoration process to work 100% for some given cases (i.e. when inheritance is involved),
     * some metadata must be present in the {@link Json} object.
     * @param jsons The array of object in {@link Json} format to be restored in ``Array<T>`` instance.
     * @param clazz (optional) The class to be used as a root type or for type checking.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns The restored object as an ``Array<T>`` instance.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     */
    public fromJson<T, S = Json<T>, E = void>(jsons: Array<Json<T>>, clazz?: Class,
                                              options?: SerializationOptions, extra?: E): Array<T>;
    public fromJson<T, S = Json<T>, E = void>(...args: any[]): T|Array<T> {
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
