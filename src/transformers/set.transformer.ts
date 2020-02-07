import { Class, ExtraTypes, ITransformer } from "../common";
import { TypesEnum } from "../enums";
import { DeserializationOptions, SerializationOptions, Serializer } from "../services";

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
    public readJson(json: Array<any>, extra?: SetExtra, serializer?: Serializer,
                    options?: DeserializationOptions): Set<any> {

        if (json == null) {
            return json === null ? null : undefined;
        }

        const set: Set<any> = new Set<any>();
        for (let item of json) {

            const itemType: Class|TypesEnum.ANY = extra.itemType();
            if (itemType === TypesEnum.ANY) {
                set.add(serializer.fromJson(item, null, options, extra.itemExtra));
            }
            else {
                set.add(serializer.fromJson(item, itemType, options, extra.itemExtra));
            }
        }

        return set;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Set<any>, extra?: SetExtra, serializer?: Serializer,
                     options?: SerializationOptions): Array<any> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        const setArray: Array<any> = [];
        for (let item of instance) {
            setArray.push(serializer.toJson(item, options, extra.itemExtra));
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
