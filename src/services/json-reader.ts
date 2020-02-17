import {
    DeserializationContext, Json, SerializableMetadata
} from "../common";
import { TypesEnum } from "../enums";
import { AbstractJsonProcessor } from "./abstract-json-processor";

/**
 * Service object responsible to perform deserialization of a instance. Each time a
 * {@link ISerializer.fromJson} is called and the value is an object, a new {@link JsonWriter} is
 * created to perform the operation per context.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 17/02/2020
 */
export class JsonReader<T extends Object> extends AbstractJsonProcessor<T> {

    //#region Protected Attributes
    /**
     * The deserialization context.
     */
    protected readonly context: DeserializationContext;
    //#endregion

    //#region Constructor
    constructor(instance: T, metadata: SerializableMetadata, json: Json<T>,
                context: DeserializationContext) {
        super(instance, metadata, json);

        this.context = context;
    }
    //#endregion

    //#region Public Methods
    /**
     * Restores the instance of a given {@link Json} object using the default strategy. You may call
     * this method when working with customization of the deserialization process
     * ({@link ISerializable.writeJson}) to get the default object and modify as you need.
     */
    public defaultReadJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            const isInGroup: boolean = this.isInGroup(fieldMetadata.groups, this.context.deserializationOptions.groups,
                this.context.deserializationOptions.excludeUngrouped);
            if (!isInGroup) {
                continue;
            }

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
    //#endregion
}
