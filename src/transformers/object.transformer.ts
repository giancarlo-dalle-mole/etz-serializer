import { DeserializationContext, ITransformer, Json, SerializationContext } from "../common";

/**
 * Transformer for plain Objects. All attributes are serialized/deserialized using the {@link Serializer}
 * service. Intended to be used as a {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class ObjectTransformer implements ITransformer<Object, Json<Object>> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: Json<Object>, extra?: void, context?: DeserializationContext): Object {

        if (json == null) {
            return json === null ? null : undefined;
        }

        let object: Object = {};

        const keys: Array<string> = Object.keys(json);
        for (let key of keys) {

            const childContext: DeserializationContext = context.child(key);

            const deserializedValue: any = childContext.serializer.fromJson(Reflect.get(json, key), null, null, childContext);
            Reflect.set(object, key, deserializedValue);
        }

        return object;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Object, extra?: void, context?: SerializationContext): Json<Object> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        let json: Json<Object> = {} as any;

        const keys: Array<string> = Object.keys(instance);
        for (let key of keys) {

            const childContext: SerializationContext = context.child(key);

            const serializedValue: any = childContext.serializer.toJson(Reflect.get(instance, key), null, null, childContext);
            Reflect.set(json, key, serializedValue);
        }

        return json;
    }
    //#endregion
}
