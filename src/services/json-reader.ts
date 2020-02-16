import {
    DeserializationContext, Json, SerializableMetadata, SerializationContext
} from "../common";
import { TypesEnum } from "../enums";

export class JsonReader<T extends Object> {

    /**
     * The serialization context.
     */
    private readonly context: DeserializationContext;
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

    constructor(context: DeserializationContext, instance: T,
                metadata: SerializableMetadata, json: Json<T>) {

        this.context = context;
        this.instance = instance;
        this.metadata = metadata;
        this._json = json;
    }

    public defaultReadJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            const childContext: DeserializationContext = this.context.child(fieldMetadata.name);

            const field: any = Reflect.get(this._json, fieldMetadata.name);
            let deserializedField: any;

            if (fieldMetadata.type === TypesEnum.ANY) {
                deserializedField = childContext.serializer.fromJson(field, null, null, fieldMetadata.extra, childContext);
            }
            else {
                deserializedField = childContext.serializer.fromJson(field, fieldMetadata.type, null, fieldMetadata.extra, childContext);
            }

            Reflect.set(this.instance, fieldMetadata.name, deserializedField);
        }
    }

    public get json(): Json<T> {
        return this._json;
    }
}
