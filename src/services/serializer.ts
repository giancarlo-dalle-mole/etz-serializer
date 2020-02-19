import {
    Class, DeserializationContext, ITransformer, Json, JsonMetadata, metadataKeys, NewableClass,
    SerializableMetadata, SerializationContext
} from "../common";
import { BehaviorEnum } from "../enums";
import {
    NotAssignableException,
    NotSerializableException, TypeMismatchException, UnknownJsonPointerException,
    VersionMismatchException
} from "../exceptions";
import { DeserializationOptions } from "./deserialization-options.type";
import { JsonPointerEncoder } from "./json-pointer-encoder";
import { JsonReader } from "./json-reader";
import { JsonWriter } from "./json-writer";
import { SerializationOptions } from "./serialization-options.type";
import { SerializerConfig } from "./serializer-config.type";
import { SerializerRegistry } from "./serializer-registry";
import { ISerializer } from "./serializer.interface";

/**
 * The service that performs serialization and deserialization process. Can be configured globally or
 * per operation to change the serialization and deserialization behaviors, such as including or not
 * ``typeMetadata`` and performing other operations.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export class Serializer implements ISerializer {

    //#region Private Attributes
    /**
     * Global serializer configuration.
     */
    private _config: SerializerConfig;

    private readonly jsonMetadataKey: string = "__enterprize:serializer:metadata";
    //#endregion

    //#region Constructor
    constructor(config?: SerializerConfig) {

        this.setConfig(config);
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
     * @inheritDoc
     */
    public clone<T extends Object, E = void>(instance: T, extra?: E): T;
    /**
     * @inheritDoc
     */
    public clone<T extends Object, E = void>(instances: Array<T>, extra?: E): Array<T>;
    public clone<T extends Object>(...args: any[]): T|Array<T> {
        return this.fromJson(this.toJson(args[0], null, args[1]), null, null, args[1]);
    }

    /**
     * @inheritDoc
     */
    public serialize<T extends Object, E = void>(instance: T, options?: SerializationOptions, extra?: E): string;
    /**
     * @inheritDoc
     */
    public serialize<T extends Object, E = void>(instances: Array<T>, options?: SerializationOptions,
                                                 extra?: E): string;
    public serialize<T extends Object>(...args: any[]): string {
        return JSON.stringify(this.toJson(args[0], args[1], args[2]));
    }

    /**
     * @inheritDoc
     */
    public deserialize<T extends Object, E = void>(json: string, clazz?: Class, options?: DeserializationOptions,
                                                   extra?: E): T;
    /**
     * @inheritDoc
     */
    public deserialize<T extends Object, E = void>(json: string, clazz?: Class,
                                                   options?: DeserializationOptions, extra?: E): Array<T>;
    public deserialize<T extends Object>(...args: any[]): T {
        return this.fromJson(JSON.parse(args[0]), args[1], args[2], args[3]);
    }

    /**
     * @inheritDoc
     */
    public toJson<T, S = Json<T>, E = void>(instance: T, options?: SerializationOptions, extra?: E,
                                            context?: SerializationContext): S;
    /**
     * @inheritDoc
     */
    public toJson<T, S = Json<T>, E = void>(instances: Array<T>, options?: SerializationOptions,
                                            extra?: E, context?: SerializationContext): Array<S>;
    public toJson<T, S = Json<T>, E = void>(...args: any[]): S|Array<S> {

        const instance: T|Array<T> = args[0];

        // The instance is null/undefined, no need to work
        if (instance == null) {
            return instance === null ? null : undefined;
        }

        let extra: E = args[2];
        let context: SerializationContext = args[3];

        // If no serialization context is passed, we assume this is a root operation and a new context
        // will be created
        if (context == null) {

            const options: SerializationOptions = this.getSerializationOptions(args[1]);
            const objectReferenceMap: Map<Object, string> = new Map<Object, string>();

            context = new SerializationContext(objectReferenceMap, "#", this, options);
        }
        // We have a context
        else {

            // If the context already worked o that object, return its cached pointer
            if (context.objectReferenceMap.has(instance)) {
                return {
                    $ref: context.objectReferenceMap.get(instance)
                } as unknown as S;
            }
        }

        // Type of the instance
        const objectType: Class = (args[0]).constructor;

        // If the value being serialized is an Object, add it to the references
        if (instance instanceof Object) {
            context.objectReferenceMap.set(instance, context.pointer);
        }

        // Verify if the type has a transformer
        if (SerializerRegistry.hasTransformer(objectType as NewableClass)) {

            const transformer: ITransformer<T|Array<T>, S|Array<S>, E> = SerializerRegistry.getTransformer(objectType as NewableClass);
            return transformer.writeJson(instance, extra, context);
        }
        // Verify if its a serializable type
        else if (Reflect.hasOwnMetadata(metadataKeys.serializable, objectType)) {

            let currentMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, objectType);
            const metadata: Array<SerializableMetadata> = [currentMetadata];
            while (currentMetadata.superClazz != Object) {
                currentMetadata = Reflect.getMetadata(metadataKeys.serializable, currentMetadata.superClazz);
                metadata.unshift(currentMetadata); //We use unshift to facilitate TOP - BOTTOM approach
            }

            const writeJsonResult: [Json<T>, Array<[string, number]>] = this.writeJson<T>(instance as T, metadata, context);
            let objectMetadata: Array<[string, any]>;

            // If set to add instance metadata (if any)
            if (context.serializationOptions.objectMetadata) {

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
            if ((writeJsonResult[1] != null && writeJsonResult[1].length > 0) || (objectMetadata != null && objectMetadata.length > 0)) {

                const jsonMetadata: JsonMetadata = {
                    versions: writeJsonResult[1],
                    objectMetadata: objectMetadata
                };
                Reflect.set(writeJsonResult[0], this.jsonMetadataKey, jsonMetadata);
            }

            return writeJsonResult[0] as S;
        }
        else {
            throw new NotSerializableException(instance);
        }
    }

    /**
     * @inheritDoc
     */
    public fromJson<T, S = Json<T>, E = void>(json: S, clazz?: Class, options?: DeserializationOptions,
                                              extra?: E, context?: DeserializationContext): T;
    /**
     * @inheritDoc
     */
    public fromJson<T, S = Json<T>, E = void>(jsons: Array<S>, clazz?: Class,
                                              options?: DeserializationOptions, extra?: E,
                                              context?: DeserializationContext): Array<T>;
    public fromJson<T, S = Json<T>, E = void>(...args: any[]): T|Array<T> {

        const json: S|Array<S> = args[0];

        // The json is null/undefined, no need to work
        if (json == null) {
            return json === null ? null : undefined;
        }

        let clazz: Class = args[1];
        let extra: E = args[3];
        let context: DeserializationContext = args[4];

        // If no serialization context is passed, we assume this is a root operation and a new context
        // will be created
        if (context == null) {

            let options: DeserializationOptions = this.getDeserializationOptions(args[2]);

            const referenceObjectMap: Map<string, Object> = new Map<string, Object>();
            context = new DeserializationContext(referenceObjectMap, "#", this, options);
        }
        // We have a context
        else {

            // If the context already worked o that object, return its cached object
            if (json instanceof Object) {

                if (Reflect.has(json, "$ref")) {

                    const pointer: string = JsonPointerEncoder.decode(Reflect.get(json, "$ref"));

                    if (context.referenceObjectMap.has(pointer)) {
                        return context.referenceObjectMap.get(pointer) as T|T[];
                    }
                    else {
                        throw new UnknownJsonPointerException(pointer);
                    }
                }
            }
        }

        // Constructor of the json
        const jsonConstructor: Class = json.constructor;
        // Flag that identifies if the json has metadata
        const hasMetadata: boolean = jsonConstructor === Object && Reflect.has(json as Object, this.jsonMetadataKey);

        // If the object does not have metadata and, the specified root class or the infered json
        // constructor has a transformer, use the Transformer
        if (clazz != null && SerializerRegistry.hasTransformer(clazz as NewableClass) || (!hasMetadata && SerializerRegistry.hasTransformer(jsonConstructor as NewableClass))) {

            let transformer: ITransformer<T|Array<T>, S|Array<S>, E>;

            if (clazz != null) {
                transformer = SerializerRegistry.getTransformer(clazz as NewableClass);
            }
                // This allows number|Number, string|String, boolean|Boolean, symbol and Array to be
            // deserialized without the need of passing the clazz as transformer.
            else {
                transformer = SerializerRegistry.getTransformer(jsonConstructor as NewableClass);
            }

            return transformer.readJson(json, extra, context);
        }
        // The object uses Serializable strategy
        else if (hasMetadata || SerializerRegistry.hasType(clazz)) {

            const jsonMetadata: JsonMetadata = Reflect.get(json as Object, this.jsonMetadataKey);
            // No versions in the metadata and no specified root class, we don't know the type
            if ((jsonMetadata?.versions?.length === 0) && clazz == null) {
                throw new NotSerializableException(json);
            }

            // Type check is enabled, root type was defined and has versions to check
            if (context.deserializationOptions.typeCheck && clazz != null && jsonMetadata?.versions?.length > 0) {
                this.checkType(jsonMetadata.versions, clazz);
            }

            // Obtain the list of serializable metadata according to the prototype chain
            const metadata: Array<SerializableMetadata> = this.getPrototypeChainSerializableMetadata(json, jsonMetadata, clazz, context.deserializationOptions.versionMismatchBehavior);

            // Restore the instance
            const instance: T = this.readJson<T>(json as unknown as Json<T>, metadata, context);

            // If set to apply object metadata
            if (context.deserializationOptions.objectMetadata && jsonMetadata?.objectMetadata?.length > 0) {
                for (let objectMetadata of jsonMetadata.objectMetadata) {
                    Reflect.defineMetadata(objectMetadata[0], objectMetadata[1], instance);
                }
            }

            return instance;
        }
        // Not serializable
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

    /**
     * Checks if a given list of versions is assignable to a given class. Do not checks class version.
     * @param versions The tuple list of fully qualified names of classes and its versions.
     * @param clazz The class to check attribution.
     *
     * @throws {@link NotAssignableException} If the versions is not assignable to the class
     */
    private checkType(versions: Array<[string, number]>, clazz: Class): void {

        const clazzSerializableMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, clazz);

        const clazzFqn: string = `${clazzSerializableMetadata.namespace}.${clazzSerializableMetadata.name}`;

        let match: boolean = false;
        for (let version of versions) {

            if (version[0] === clazzFqn) {
                match = true;
                break;
            }
        }

        if (!match) {
            throw new NotAssignableException(versions[versions.length - 1][0], clazzFqn);
        }
    }

    /**
     *
     * @param json
     * @param jsonMetadata
     * @param clazz
     * @param versionMismatchBehavior
     *
     * @throws {@link VersionMismatchException} - If the
     */
    private getPrototypeChainSerializableMetadata(json: Json<any>, jsonMetadata: JsonMetadata,
                                                  clazz: Class,
                                                  versionMismatchBehavior: BehaviorEnum): Array<SerializableMetadata> {

        const metadata: Array<SerializableMetadata> = [];

        // Has versions, use it
        if (jsonMetadata?.versions?.length > 0) {

            // Obtain the class list of the prototype chain
            for (let version of jsonMetadata.versions) {

                const clazz: Class = SerializerRegistry.getType(version[0]);
                const serializableMetadata: SerializableMetadata = Reflect.getOwnMetadata(metadataKeys.serializable, clazz);

                // Checks class version used
                if (versionMismatchBehavior !== BehaviorEnum.IGNORE &&
                    serializableMetadata.version != version[1]) {

                    if (versionMismatchBehavior === BehaviorEnum.WARNING) {
                        console.warn(new VersionMismatchException(json as any, version[0], serializableMetadata.version, version[1]));
                    }
                    else {
                        throw new VersionMismatchException(json as any, version[0], serializableMetadata.version, version[1]);
                    }
                }

                metadata.push(serializableMetadata);
            }

        }
        // Use the specified root class
        else {

            let serializableMetadata: SerializableMetadata;
            // It always should have at least one SerializableMetadata, otherwise it is not a Serializable
            // type
            do {
                 serializableMetadata = Reflect.getMetadata(metadataKeys.serializable, clazz);
                 metadata.push(serializableMetadata);
            }
            while (serializableMetadata.superClazz !== Object);
        }

        return metadata;
    }

    private writeJson<T>(instance: T, metadata: Array<SerializableMetadata>, context: SerializationContext): [Json<T>, Array<[string, number]>] {

        const json: Json<T> = {};

        let versions: Array<[string, number]>;

        if (context.serializationOptions.typeMetadata) {
            versions = [];
        }

        for (let serializableMetadata of metadata) {

            const jsonWriter: JsonWriter<T> = new JsonWriter<T>(
                instance as T, serializableMetadata, json, context
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
            if (context.serializationOptions.typeMetadata) {
                versions.push([
                    `${serializableMetadata.namespace}.${serializableMetadata.name}`,
                    serializableMetadata.version
                ]);
            }
        }

        return [json, versions];
    }

    private readJson<T>(json: Json<T>, metadata: Array<SerializableMetadata>,
                        context: DeserializationContext): T {

        const instance: T = Reflect.construct(metadata[metadata.length - 1].clazz, []);

        context.referenceObjectMap.set(context.pointer, instance);

        for (let serializableMetadata of metadata) {

            const jsonReader: JsonReader<T> = new JsonReader<T>(
                instance as T, serializableMetadata, json, context
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

        return instance;
    }

    private getSerializationOptions(options?: SerializationOptions): SerializationOptions {

        // No options, set defaults
        if (options == null) {
            options = {
                typeMetadata: this._config.typeMetadata,
                objectMetadata: this._config.objectMetadata,
                groups: null,
                excludeUngrouped: false
            };
        }
        // With options, set defaults if not set
        else {
            options = {
                typeMetadata: options.typeMetadata != null ? options.typeMetadata : this._config.typeMetadata,
                objectMetadata: options.objectMetadata != null ? options.objectMetadata : this._config.objectMetadata,
                groups: options.groups != null ? [...options.groups] : null,
                excludeUngrouped: options.excludeUngrouped != null ? options.excludeUngrouped : false
            };
        }

        return options;
    }

    private getDeserializationOptions(options?: DeserializationOptions): DeserializationOptions {

        // No options, set defaults
        if (options == null) {
            options = {
                objectMetadata: this._config.objectMetadata,
                typeCheck: this._config.typeCheck,
                versionMismatchBehavior: this._config.versionMismatchBehavior,
                groups: null,
                excludeUngrouped: false
            };
        }
        // With options, set defaults if not set
        else {
            options = {
                objectMetadata: options.objectMetadata != null ? options.objectMetadata : this._config.objectMetadata,
                typeCheck: options.typeCheck != null ? options.typeCheck : this._config.typeCheck,
                groups: options.groups != null ? [...options.groups] : null,
                excludeUngrouped: options.excludeUngrouped != null ? options.excludeUngrouped : false
            };
        }

        return options;
    }
    //#endregion
}
