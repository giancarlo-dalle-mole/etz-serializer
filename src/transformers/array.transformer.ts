import { IllegalArgumentException } from "@enterprize/exceptions";

import { Class, ExtraTypes, ITransformer } from "../common";
import { TypesEnum } from "../enums";
import { DeserializationOptions, SerializationOptions, Serializer } from "../services";

/**
 * Transformer for {@link Array} objects. Intended to be used as a
 * {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 09/02/2020
 */
export class ArrayTransformer implements ITransformer<Array<any>, Array<any>, ArrayExtra> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: Array<any>, extra?: ArrayExtra, serializer?: Serializer,
                    options?: DeserializationOptions): Array<any> {

        if (json == null) {
            return json === null ? null : undefined;
        }

        ArrayTransformer.validateExtra(extra);

        if (extra == null) {

            extra = {
                itemType: () => TypesEnum.ANY,
                dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL
            };
        }
        else {
            extra.itemType = () => TypesEnum.ANY;
            extra.dimensions = extra.dimensions != null ? extra.dimensions : ArrayDimensionsEnum.ONE_DIMENSIONAL;
        }

        if (extra.dimensions != null && extra.dimensions !== ArrayDimensionsEnum.ANY_DIMENSIONAL) {

            //TODO refactor to accept N number of dimensions

            switch (extra.dimensions) {
                case ArrayDimensionsEnum.ONE_DIMENSIONAL:
                    if (Array.isArray(json[0])) {
                        throw new Error("ArrayDimensionsOutOfRange"); // TODO use a custom exception
                    }
                    break;
                case ArrayDimensionsEnum.TWO_DIMENSIONAL:
                    if (!(Array.isArray(json[0]) && !Array.isArray(json[0][0]))) {
                        throw new Error("ArrayDimensionsOutOfRange");
                    }
                    break;
                case ArrayDimensionsEnum.THREE_DIMENSIONAL:
                    if (!(Array.isArray(json[0]) && Array.isArray(json[0][0]) &&
                        !Array.isArray(json[0][0][0]))) {
                        throw new Error("ArrayDimensionsOutOfRange");
                    }
                    break;
            }
        }

        const array: Array<any> = [];
        for (let item of json) {

            if (!Array.isArray(item)) {

                const itemType: Class|TypesEnum.ANY = extra?.itemType();
                if (itemType === TypesEnum.ANY || itemType == null) {
                    array.push(serializer.fromJson(item, null, options, extra?.itemExtra));
                }
                else {
                    array.push(serializer.fromJson(item, itemType, options, extra?.itemExtra));
                }
            }
            else {
                array.push(serializer.fromJson(item, Array, options, {...extra, dimensions: extra.dimensions - 1}));
            }
        }

        return array;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Array<any>, extra?: ArrayExtra, serializer?: Serializer,
                     options?: SerializationOptions): Array<any> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }
        else if (instance.length === 0) {
            return [];
        }

        const jsonArray: Array<any> = [];
        for (let item of instance) {
            jsonArray.push(serializer.toJson(item, options));
        }

        return jsonArray;
    }
    //#endregion

    /**
     * Validates the "extra" options on {@link SerializeOptions}.
     * @param extra The extra options to validade/
     * @returns true if valid, throws exception otherwise.
     * @throws {@link IllegalArgumentException} - If any of the options are invalid.
     */
    public static validateExtra(extra: ArrayExtra): boolean {

        // No extra, defaults will be used.
        if (extra == null) {
            return true;
        }

        // Validates the number of dimensions.
        if (extra.dimensions != null && !Number.isSafeInteger(extra.dimensions) && extra.dimensions < 0) {
            throw new IllegalArgumentException("\"dimensions\" must be a safe integer greater or equal than 0 (zero)", "dimensions", {value: extra.dimensions});
        }

        return true;
    }
}

/**
 * Configuration to use with {@link ArrayTransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 09/02/2020
 */
export type ArrayExtra<E = void> = {

    /**
     * (optional) The type of the elements of the array.
     * @default {@link TypesEnum.ANY}
     */
     itemType?: () => Class|TypesEnum;
    /**
     * Extra options to pass to item transformer (if required).
     */
    itemExtra?: E|ExtraTypes;
    /**
     * (optional) Defines the number of dimensions of the array. Set this property to an {@link ArrayDimensionsEnum}
     * value or any natural number (N, integer greater or equal than 0) to customize the number of dimensions.
     * @default {@link ArrayDimensionsEnum.ONE_DIMENSIONAL}
     */
    dimensions?: ArrayDimensionsEnum|number;
}

export enum ArrayDimensionsEnum {

    ANY_DIMENSIONAL = Infinity,
    ONE_DIMENSIONAL = 1,
    TWO_DIMENSIONAL = 2,
    THREE_DIMENSIONAL = 3
}
