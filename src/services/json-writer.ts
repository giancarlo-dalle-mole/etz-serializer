import { Json, SerializableMetadata } from "../common";
import { SerializationOptions } from "./serialization-options.type";
import { Serializer } from "./serializer";

/**
 *
 */
export class JsonWriter<T extends Object> {

    /**
     * The serializer service used.
     */
    private readonly serializer: Serializer;
    /**
     * Options of the serialization process.
     */
    private readonly options: SerializationOptions;
    /**
     * The instance being deserialized.
     */
    private readonly instance: T;
    /**
     * The class serializable metadata.
     */
    private readonly metadata: SerializableMetadata;
    /**
     * The json object.
     */
    private readonly _json: Json<T>;

    constructor(serializer: Serializer, options: SerializationOptions, instance: T,
                metadata: SerializableMetadata, json: Json<T>) {

        this.serializer = serializer;
        this.options = options;
        this.instance = instance;
        this.metadata = metadata;
        this._json = json;
    }

    public defaultWriteJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            const field: any = Reflect.get(this.instance, fieldMetadata.name);
            const serializedField: any = this.serializer.toJson(field, this.options, fieldMetadata.extra);
            Reflect.set(this._json, fieldMetadata.name, serializedField);
        }
    }

    public get json(): Json<T> {
        return this._json;
    }
}
