import { ITransformer, Json } from "../common";
import { Serializer } from "../services";

export class ObjectTransformer implements ITransformer<Object, Json<Object>> {

    public readJson(json: Json<Object>, extra?: void, serializer?: Serializer): Object {
        return undefined;
    }

    public writeJson(instance: Object, extra?: void, serializer?: Serializer): Json<Object> {
        return undefined;
    }
}
