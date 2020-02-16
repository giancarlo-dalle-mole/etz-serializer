import {
    Class, DeserializationContext, ExtraTypes, ITransformer, SerializationContext
} from "../common";
import { TypesEnum } from "../enums";

export class MapTransformer implements ITransformer<Map<any, any>, Array<[any, any]>, MapExtra> {

    public readJson(json: Array<[any, any]>, extra?: MapExtra, context?: DeserializationContext): Map<any, any> {
        return undefined;
    }

    public writeJson(instance: Map<any, any>, extra?: MapExtra, context?: SerializationContext): Array<[any, any]> {
        return undefined;
    }
}

export type MapExtra<KE = void, VE = void> = {

    /**
     * The type of the key
     */
    keyType: () => Class|TypesEnum;
    keyExtra?: KE|ExtraTypes;
    /**
     * The type of the value
     */
    valueType: () => Class|TypesEnum;
    valueExtra?: VE|ExtraTypes;
}
