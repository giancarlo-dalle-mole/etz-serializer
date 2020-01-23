import { metadataKeys, SerializableFieldMetadata, SerializableMetadata } from "../../private";
import {
    Class, InstantiationPolicyEnum, ITransformer, RegisteredTypesMap, RegisteredTransformerInfo,
    SerializableOptions, TransformerOptions
} from "../common";
import { SerializableField } from "../common";
import { TransformerAlreadyDefinedException } from "../exceptions";

/**
 * (static class) Holds information for all registered types marked with {@link #Serializable @Serializable}
 * decorator and all transformers marked with @Transformer. Also provides methods to programmatically
 * retrieve and add types and transformers.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export class SerializerRegistry {

    //#region Private Attributes
    /**
     * All the registered types organized by namespaces (starting with "" - global namespace) with
     * some type information regarding the strategy to be used in serialization/deserialization.
     */
    private static registeredTypes: Map<string, RegisteredTypesMap> = SerializerRegistry.initializeTypesRegistry();
    /**
     * All registered transformers.
     */
    private static registeredTransformers: Map<Class, RegisteredTransformerInfo> = SerializerRegistry.initializeTransformersRegistry();
    //#endregion

    //#region Constructor
    /**
     * Private constructor to prevent instantiation of static class.
     */
    private constructor() {
    }
    //#endregion

    //#region Public Static Methods
    /**
     * Gets the list of registered serializable types.
     * @return A {@link Map} of the registered types organized by namespaces.
     */
    public static getTypes(): RegisteredTypesMap {
        return SerializerRegistry.registeredTypes;
    }

    /**
     * Registers a type in the registry as a serializable type. Imperative way instead of {@link #Serializable @Serializable}.
     * @param clazz The class to be registered as a serializable type.
     * @param serializableFields List of serializable fields for the class. Only own class fields SHOULD
     *        be informed, inherited fields are automatically inferred.
     * @param options (optional) Options of the serializable type, such as namespace and
     *        custom name.
     */
    public static addType<C>(clazz: Class<C>, serializableFields: Array<SerializableField<C>>,
                          options?: SerializableOptions): void {

        options = options != null ? options : {};

        if (options.defaultStrategy === false &&
            (!Reflect.has(clazz.prototype, "readJson") || !Reflect.has(clazz.prototype, "writeJson"))) {
            throw new Error("Must implement ISerializable when disabling defaultStrategy")
        }

        let superClass: Class = Reflect.getPrototypeOf(clazz) as Class;
        if (superClass === Reflect.getPrototypeOf(Object)) {
            superClass = Object;
        }

        const fieldInfos: Array<SerializableFieldMetadata> = [];
        for (let serializableField of serializableFields) {

            const fieldInfo: SerializableFieldMetadata = new SerializableFieldMetadata<any>(
                serializableField.name,
                serializableField.type,
                serializableField.groups,
                serializableField.extra
            );

            fieldInfos.push(fieldInfo);
        }

        const serializableInfo: SerializableMetadata = new SerializableMetadata(
            clazz,
            options.namespace != null ? options.namespace : "",
            options.name !=  null ? options.name : clazz.name,
            options.version = options.version != null ? options.version : 1,
            options.defaultStrategy = options.defaultStrategy != null ? options.defaultStrategy : true,
            superClass,
            fieldInfos
        );

        const namespaceSplit: Array<string> = serializableInfo.namespace.split(".");
        let namespace: RegisteredTypesMap = this.registeredTypes;

        let pointer: number = 0;
        while (pointer < namespaceSplit.length) {

            if (!namespace.has(namespaceSplit[pointer])) {

                const newNamespace = new Map<string, Class|RegisteredTypesMap>();
                namespace.set(namespaceSplit[pointer], newNamespace);
                namespace = newNamespace;
            }
            else {
                namespace = namespace.get(namespaceSplit[pointer]) as RegisteredTypesMap;
            }

            pointer++;
        }

        Reflect.defineMetadata(metadataKeys.serializable, serializableInfo, clazz);
        namespace.set(serializableInfo.name, clazz);
    }

    /**
     * Gets the list of registered type transformers.
     * @return A {@link Map} of the registered transformers organized by class.
     */
    public static getTransformers(): Map<Class, RegisteredTransformerInfo> {
        return this.registeredTransformers;
    }

    /**
     * Registers a type transformer in the registry. Imperative way of {@link #Transformer @Transformer}.
     * @param transformer The class to be registered as a {@link ITransformer} for the given type.
     * @param clazz The class that the transformer is responsible for performing transformation.
     * @param options (optional)
     */
    public static addTransformer<T = any, S = any, E = void>(transformer: Class<ITransformer<T, S, E>>, clazz: Class,
                                                             options?: TransformerOptions): void {
        options = options != null ? options : {};
        options.instantiationPolicy = options.instantiationPolicy != null ? options.instantiationPolicy : InstantiationPolicyEnum.SINGLETON;
        options.override = options.override != null ? options.override : false;

        if (this.registeredTransformers.has(clazz) && !options.override) {
            throw new TransformerAlreadyDefinedException({
                type: clazz,
                definedTransformer: this.registeredTransformers.get(clazz).transformer,
                overrideTransformer: transformer
            });
        }
        else {
            this.registeredTransformers.set(
                clazz,
                new RegisteredTransformerInfo(transformer, options)
            )
        }
    }
    //#endregion

    //#region Private Static Methods
    /**
     * Initializes the serializable types registry.
     */
    private static initializeTypesRegistry(): Map<string, RegisteredTypesMap> {

        if (!Reflect.hasMetadata(metadataKeys.registeredTypes, Reflect)) {
            Reflect.defineMetadata(metadataKeys.registeredTypes, new Map<string, RegisteredTypesMap>([["", new Map<string, Class|RegisteredTypesMap>()]]), Reflect)
        }

        // We define the registry as a metadata on the Reflect object itself due to some issues, such
        // as types that requires transformers not being correctly registered, when using a static
        // attribute of a class on Angular apps.
        return Reflect.getMetadata(metadataKeys.registeredTypes, Reflect);
    }

    /**
     * Initializes the type transformers registry.
     */
    private static initializeTransformersRegistry(): Map<Class, RegisteredTransformerInfo> {

        if (!Reflect.hasMetadata(metadataKeys.registeredTransformers, Reflect)) {
            Reflect.defineMetadata(metadataKeys.registeredTransformers, new Map<Class, RegisteredTransformerInfo>(), Reflect);
        }

        // We define the registry as a metadata on the Reflect object itself due to some issues, such
        // as types that requires transformers not being correctly registered, when using a static
        // attribute of a class on Angular apps.
        return Reflect.getMetadata(metadataKeys.registeredTransformers, Reflect);
    }
    //#endregion
}
