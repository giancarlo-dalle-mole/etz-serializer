import { NotImplementedYetException } from "@enterprize/exceptions";

import {
    Class, ITransformer, Json, metadataKeys, NewableClass, SerializableMetadata
} from "../common";
import { BehaviorEnum } from "../enums";
import {
    NotSerializableException, TypeMismatchException, VersionMismatchException
} from "../exceptions";
import { DeserializationOptions } from "./deserialization-options.type";
import { JsonMetadata } from "./json-metadata.type";
import { JsonReader } from "./json-reader";
import { JsonWriter } from "./json-writer";
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

    private readonly jsonMetadataKey: string = "__enterprize:serializer:metadata" ;
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
    public clone<T extends Object, E = void>(instance: T, extra?: E): T;
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
    public clone<T extends Object, E = void>(instances: Array<T>, extra?: E): Array<T>;
    public clone<T extends Object>(...args: any[]): T|Array<T> {
        return this.fromJson(this.toJson(args[0], null, args[1]), null, null, args[1]);
    }

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
    public serialize<T extends Object, E = void>(instance: T, options?: SerializationOptions, extra?: E): string;
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
    public serialize<T extends Object, E = void>(instances: Array<T>, options?: SerializationOptions,
                                                 extra?: E): string;
    public serialize<T extends Object>(...args: any[]): string {
        return JSON.stringify(this.toJson(args[0], args[1], args[2]));
    }

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
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data must be passed but none was given (see {@link #Serialize @Serialize} or {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid for a given transformer.
     * @throws {@link NotSerializableException} - When a not serializable type is received.
     * @throws {@link TypeMismatchException} - When a type is not assignable to a type.
     * @throws {@link VersionNumberException} - When a version number of a serializable type is incompatible.
     */
    public deserialize<T extends Object, E = void>(json: string, clazz?: Class, options?: DeserializationOptions,
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
    public deserialize<T extends Object, E = void>(json: string, clazz?: Class, options?: DeserializationOptions,
                                                   extra?: E): Array<T>;
    public deserialize<T extends Object>(...args: any[]): T {
        return this.fromJson(JSON.parse(args[0]), args[1], args[2], args[3]);
    }

    /**
     * Converts a given instance of a class to its "JSON object" version, including, if configured,
     * the necessary metadata to convert it back to a instance of the class.
     * @param instance The instance to be converted to {@link Json}.
     * @param options (optional) Operation options. Override global {@link config}.
     * @param extra (optional) Extra data to pass to transformer if the root object requires it.
     * @returns A {@link Json} of the object with the required metadata set.
     *
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
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
     * @throws {@link ExtraTransformDataRequired} - When some type uses a transformer and extra data
     *         must be passed but none was given (see {@link #Serialize @Serialize} or
     *         {@link SerializerRegistry.addType}).
     * @throws {@link InvalidExtraTransformDataException} - When extra data was defined but is invalid
     *         for a given transformer.
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
        let optionsClone: SerializationOptions;

        // No options, set defaults
        if (options == null) {
            optionsClone = {
                typeMetadata: this._config.typeMetadata,
                objectMetadata: this._config.objectMetadata,
                groups: null,
                excludeUngrouped: false
            };
        }
        // With options, set defaults if not set
        else {
            optionsClone = {
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

            const transformer: ITransformer<T|Array<T>, S|Array<S>, E> = SerializerRegistry.getTransformer(objectType as NewableClass);
            return transformer.writeJson(instance, extra, this, optionsClone);
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

            if (optionsClone.typeMetadata) {
                versions = [];
            }

            for (let serializableMetadata of metadata) {

                const jsonWriter: JsonWriter<T> = new JsonWriter<T>(
                    this, optionsClone, instance as T, serializableMetadata, json
                );

                // Checks and calls custom writeJson from ISerializable interface
                if (serializableMetadata.clazz.prototype.hasOwnProperty("writeJson")) {
                    Reflect.apply(
                        Reflect.get(serializableMetadata.clazz.prototype, "writeJson"),
                        instance,
                        [jsonWriter]
                    );
                }
                else {
                    jsonWriter.defaultWriteJson();
                }

                // Add the class version used
                if (optionsClone.typeMetadata) {
                    versions.push([
                        `${serializableMetadata.namespace}.${serializableMetadata.name}`,
                        serializableMetadata.version
                    ]);
                }
            }

            // If set to add instance metadata (if any)
            if (optionsClone.objectMetadata) {

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
                Reflect.set(json, this.jsonMetadataKey, jsonMetadata);
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
    public fromJson<T, S = Json<T>, E = void>(json: S, clazz?: Class,
                                              options?: DeserializationOptions, extra?: E): T;
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
    public fromJson<T, S = Json<T>, E = void>(jsons: Array<S>, clazz?: Class,
                                              options?: DeserializationOptions, extra?: E): Array<T>;
    public fromJson<T, S = Json<T>, E = void>(...args: any[]): T|Array<T> {

        const json: S|Array<S> = args[0];
        const clazz: Class = args[1];
        const options: DeserializationOptions = args[2];
        const extra: E = args[3];

        // The json is null/undefined, no need to work
        if (json == null) {
            return json === null ? null : undefined;
        }

        // Options for the operation with defaults
        let optionsClone: DeserializationOptions;

        // No options, set defaults
        if (options == null) {
            optionsClone = {
                typeCheck: this._config.typeCheck,
                versionMismatchBehavior: this._config.versionMismatchBehavior,
                objectMetadata: this._config.objectMetadata,
                groups: null,
                excludeUngrouped: false,
            };
        }
        // With options, set defaults if not set
        else {
            optionsClone = {
                typeCheck: options.typeCheck != null ? options.typeCheck : this._config.typeCheck,
                versionMismatchBehavior: options.versionMismatchBehavior != null ? options.versionMismatchBehavior : this._config.versionMismatchBehavior,
                objectMetadata: options.objectMetadata != null ? options.objectMetadata : this._config.objectMetadata,
                groups: options.groups != null ? options.groups : null,
                excludeUngrouped: options.excludeUngrouped != null ? options.excludeUngrouped : false
            };
        }

        // Type of the instance
        const objectType: Class = (args[0]).constructor;

        // Special treatment to plain Object, need to see if has jsonMetadata set
        if (objectType === Object && Reflect.has(json as Object, this.jsonMetadataKey)) {

            const jsonMetadata: JsonMetadata = Reflect.get(json as Object, this.jsonMetadataKey);

            // No versions metadata defined and no root class set
            if (jsonMetadata.versions == null && clazz == null) {
                // throw new NotEnoughMetadataException(json); // TODO throw a better exception saying that we could not infer the type
                throw new NotSerializableException(json);
            }

            const metadata: Array<SerializableMetadata> = [];
            // Obtain the class list of the prototype chain
            for (let version of jsonMetadata.versions) {

                const clazz: Class = SerializerRegistry.getType(version[0]);
                const serializableMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, clazz);

                // Checks class version used
                if (optionsClone.versionMismatchBehavior !== BehaviorEnum.IGNORE &&
                    serializableMetadata.version != version[1]) {

                    if (optionsClone.versionMismatchBehavior === BehaviorEnum.WARNING) {
                        console.warn(new VersionMismatchException(json, version[0], serializableMetadata.version, version[1]));
                    }
                    else {
                        throw new VersionMismatchException(json, version[0], serializableMetadata.version, version[1]);
                    }
                }

                metadata.push(serializableMetadata);
            }

            const instance: T = Reflect.construct(metadata[metadata.length - 1].clazz, []);

            for (let serializableMetadata of metadata) {

                const jsonReader: JsonReader<T> = new JsonReader<T>(
                    this, optionsClone, instance as T, serializableMetadata, json as Json<T>
                );

                // Checks and calls custom writeJson from ISerializable interface
                if (serializableMetadata.clazz.prototype.hasOwnProperty("readJson")) {
                    Reflect.apply(
                        Reflect.get(serializableMetadata.clazz.prototype, "readJson"),
                        instance,
                        [jsonReader]
                    );
                }
                else {
                    jsonReader.defaultReadJson();
                }
            }

            // If set to apply object metadata
            if (optionsClone.objectMetadata && jsonMetadata.objectMetadata != null &&
                jsonMetadata.objectMetadata.length > 0) {
                for (let objectMetadata of jsonMetadata.objectMetadata) {
                    Reflect.defineMetadata(objectMetadata[0], objectMetadata[1], instance);
                }
            }

            return instance;
        }
        // Verify if the type has a transformer
        else if ((clazz != null && SerializerRegistry.hasTransformer(clazz as NewableClass)) ||
                 SerializerRegistry.hasTransformer(objectType as NewableClass)) {

            let transformer: ITransformer<T|Array<T>, S|Array<S>, E>;

            if (clazz != null) {
                transformer = SerializerRegistry.getTransformer(clazz as NewableClass);
            }
            else {
                transformer = SerializerRegistry.getTransformer(objectType as NewableClass);
            }

            return transformer.readJson(json, extra, this, optionsClone);
        }
        // Unknown Type
        else {
            throw new NotSerializableException(json);
        }
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

    private checkType(value: any, expected: Class, actual: Class, metadata: SerializableMetadata): boolean {

        if (actual != expected) {
            throw new TypeMismatchException(value, expected, actual);
        }

        return true;
    }
    //#endregion
}
