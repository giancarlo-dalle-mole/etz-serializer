import { Class } from "./class.type";
import { SerializableFieldMetadata } from "./serializable-field-metadata";

/**
 * Metadata of a serializable class. Holds information relative to class serialization such as namespace
 * and version. Used in the serialization/deserialization process.
 *
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export class SerializableMetadata {

    //#region Public Attributes
    /**
     * The class this metadata belong to.
     */
    public readonly clazz: Class;
    /**
     * The namespace of the class separated by dots (e.g. "Financial.BankAccounts").
     */
    public readonly namespace: string;
    /**
     * The name of the class.
     */
    public readonly name: string;
    /**
     * The version of the class to prevent version mismatch erros.
     */
    public readonly version: number;
    /**
     * Flag to enable/disable the default serialization/deserialization strategy. When set to ``false``
     * (disabled), the serializable class MUST implement the {@link ISerializable} interface.
     */
    public readonly defaultStrategy: boolean;
    /**
     * The parent class.
     */
    public readonly superClazz: Class;
    /**
     * The list of class fields that can be serialized/deserialized.
     */
    public readonly serializableFields: Array<SerializableFieldMetadata>;
    //#endregion

    //#region Constructor
    constructor(clazz: Class, namespace: string, name: string, version: number, defaultStrategy: boolean,
                superClazz: Class,
                serializableFields: Array<SerializableFieldMetadata>) {

        this.clazz = clazz;
        this.namespace = namespace;
        this.name = name;
        this.version = version;
        this.defaultStrategy = defaultStrategy;
        this.superClazz = superClazz;
        this.serializableFields = serializableFields;
    }
    //#endregion
}
