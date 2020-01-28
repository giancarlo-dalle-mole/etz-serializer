import { Class, ITransformer, Json } from "../common";
import { TypesEnum } from "../enums";
import { Serializer } from "../services";

export class MapTransformer implements ITransformer<Map<any, any>, Array<[any, any]>> {

    public readJson(json: Json<Map<any, any>>, serializer: Serializer,
                    extra?: void): Map<any, any> {
        return undefined;
    }

    public writeJson(instance: Map<any, any>, serializer: Serializer,
                     extra?: void):  Array<[any, any]> {
        return undefined;
    }
}

export type MapExtra = {

    /**
     * dasda
     */
    keyType: () => Class|TypesEnum;
    /**
     * sdasdasdas
     */
    valueType: () => Class|TypesEnum;
}
