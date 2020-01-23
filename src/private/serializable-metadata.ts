import { Class } from "../public/common/class.type";
import { SerializableFieldMetadata } from "./serializable-field-metadata";

export class SerializableMetadata {

    public readonly clazz: Class;

    public readonly namespace: string;

    public readonly name: string;

    public readonly version: number;

    public readonly defaultStrategy: boolean;

    public readonly superClazz: Class;

    public readonly serializableFields: Array<SerializableFieldMetadata>;

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
}
