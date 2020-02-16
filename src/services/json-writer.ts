import { Json, SerializableMetadata, SerializationContext } from "../common";
import { SerializationOptions } from "./serialization-options.type";
import { Serializer } from "./serializer";
import { ISerializer } from "./serializer.interface";

/**
 *
 */
export class JsonWriter<T extends Object> {

    /**
     * The serialization context.
     */
    private readonly context: SerializationContext;
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

    constructor(context: SerializationContext, instance: T,
                metadata: SerializableMetadata, json: Json<T>) {

        this.context = context;
        this.instance = instance;
        this.metadata = metadata;
        this._json = json;
    }

    public defaultWriteJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            const childContext: SerializationContext = this.context.child(fieldMetadata.name);

            const field: any = Reflect.get(this.instance, fieldMetadata.name);
            const serializedField: any = childContext.serializer.toJson(field, null, fieldMetadata.extra, childContext);
            Reflect.set(this._json, fieldMetadata.name, serializedField);
        }
    }

    public get json(): Json<T> {
        return this._json;
    }
}
