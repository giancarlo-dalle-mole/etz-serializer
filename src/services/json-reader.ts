import { Json, SerializableMetadata } from "../common";
import { DeserializationOptions } from "./deserialization-options.type";
import { Serializer } from "./serializer";

export class JsonReader<T extends Object> {

    /**
     * The serializer service used.
     */
    private readonly serializer: Serializer;
    /**
     * Options of the deserialization process.
     */
    private readonly options: DeserializationOptions;
    /**
     * The instance being deserialized.
     */
    private readonly instance: T;
    /**
     * The class serializable metadata.
     */
    private readonly metadata: SerializableMetadata;
    /**
     * The raw json object being deserialized.
     */
    private readonly _json: Json<T>;

    constructor(serializer: Serializer, options: DeserializationOptions, instance: T,
                metadata: SerializableMetadata, json: Json<T>) {

        this.serializer = serializer;
        this.options = options;
        this.instance = instance;
        this.metadata = metadata;
        this._json = json;
    }

    public defaultReadJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            // const field: any = Reflect.get(this.instance, fieldMetadata.name);
            // const serializedField: any = this.serializer.fromJson(field, this.options, fieldMetadata.extra)<any>;
            // Reflect.set(this._json, fieldMetadata.name, serializedField);
        }
    }

    public get json(): Json<T> {
        return this._json;
    }
}
