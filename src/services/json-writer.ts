import { Json, SerializableMetadata, SerializationContext } from "../common";
import { AbstractJsonProcessor } from "./abstract-json-processor";

/**
 * Service object responsible to perform serialization of a instance. Each time a
 * {@link ISerializer.toJson} is called and the value is an object, a new {@link JsonWriter} is
 * created to perform the operation per context.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 17/02/2020
 */
export class JsonWriter<T extends Object> extends AbstractJsonProcessor<T> {

    //#region Protected Attributes
    /**
     * The serialization context.
     */
    protected readonly context: SerializationContext;
    //#endregion

    //#region Constructor
    constructor(instance: T, metadata: SerializableMetadata, json: Json<T>,
                context: SerializationContext) {
        super(instance, metadata, json);

        this.context = context;
    }
    //#endregion

    //#region Public Methods
    /**
     * Creates the {@link Json} object of the given instance using the default strategy. You may
     * call this method when working with customization of the serialization process
     * ({@link ISerializable.writeJson})
     * to get the default object and modify as you need.
     */
    public defaultWriteJson(): void {

        for (let fieldMetadata of this.metadata.serializableFields) {

            const isInGroup: boolean = this.isInGroup(fieldMetadata.groups, this.context.serializationOptions.groups,
                this.context.serializationOptions.excludeUngrouped);
            if (!isInGroup) {
                continue;
            }

            const childContext: SerializationContext = this.context.child(fieldMetadata.name);

            const field: any = Reflect.get(this.instance, fieldMetadata.name);
            const serializedField: any = childContext.serializer.toJson(field, null, fieldMetadata.extra, childContext);
            Reflect.set(this._json, fieldMetadata.name, serializedField);
        }
    }
    //#endregion
}
