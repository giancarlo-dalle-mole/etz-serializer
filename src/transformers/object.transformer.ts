import { ITransformer, Json } from "../common";
import { DeserializationOptions, SerializationOptions, Serializer } from "../services";

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
    public readJson(json: Json<Object>, extra?: void, serializer?: Serializer,
                    options?: DeserializationOptions): Object {

        if (json == null) {
            return json === null ? null : undefined;
        }

        let object: Object = {};

        const keys: Array<string> = Object.keys(json);
        for (let key of keys) {
            const deserializedValue: any = serializer.fromJson(Reflect.get(json, key), null, options);
            Reflect.set(object, key, deserializedValue);
        }

        return object;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Object, extra?: void, serializer?: Serializer,
                     options?: SerializationOptions): Json<Object> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        let json: Json<Object> = {};

        const keys: Array<string> = Object.keys(instance);
        for (let key of keys) {
            const serializedValue: any = serializer.toJson(Reflect.get(instance, key), options);
            Reflect.set(json, key, serializedValue);
        }

        return json;
    }
    //#endregion
}
