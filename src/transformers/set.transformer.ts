import {
    Class, DeserializationContext, ExtraTypes, ITransformer, SerializationContext
} from "../common";
import { TypesEnum } from "../enums";

/**
 * Transformer for {@link Set} objects. Intended to be used as a
 * {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class SetTransformer implements ITransformer<Set<any>, Array<any>, SetExtra> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: Array<any>, extra?: SetExtra, context?: DeserializationContext): Set<any> {

        if (json == null) {
            return json === null ? null : undefined;
        }

        const set: Set<any> = new Set<any>();
        let i: number = 0;
        for (let item of json) {

            const childContext: DeserializationContext = context.child(i.toString());

            const itemType: Class|TypesEnum.ANY = extra?.itemType();
            if (itemType === TypesEnum.ANY || itemType == null) {
                set.add(childContext.serializer.fromJson(item, null, null, extra?.itemExtra, childContext));
            }
            else {
                set.add(childContext.serializer.fromJson(item, itemType, null, extra?.itemExtra, childContext));
            }

            i++;
        }

        return set;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Set<any>, extra?: SetExtra, context?: SerializationContext): Array<any> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        const setArray: Array<any> = [];
        let i: number = 0;
        for (let item of instance) {

            const childContext: SerializationContext = context.child(i.toString());
            setArray.push(childContext.serializer.toJson(item, null, extra?.itemExtra, childContext));

            i++;
        }

        return setArray;
    }
    //#endregion
}

/**
 * Configuration to use with {@link SetTransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export type SetExtra<E = void> = {

    /**
     * (optional) The type of the elements of the array.
     * @default {@link TypesEnum.ANY}
     */
    itemType?: () => Class|TypesEnum;
    /**
     * Extra options to pass to item transformer (if required).
     */
    itemExtra?: E|ExtraTypes;
}
