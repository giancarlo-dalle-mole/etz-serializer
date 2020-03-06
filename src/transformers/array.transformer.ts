import {
    Class, DeserializationContext, ExtraTypes, ITransformer, SerializationContext
} from "../common";
import { TypesEnum } from "../enums";
import { ArrayDimensionsOutOfRangeException } from "../exceptions";

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
    public readJson(json: Array<any>, extra?: ArrayExtra, context?: DeserializationContext): Array<any> {

        if (json == null) {
            return json === null ? null : undefined;
        }

        if (extra == null) {
            extra = {
                itemType: () => TypesEnum.ANY,
                dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL
            };
        }
        else {
            extra.itemType = extra.itemType != null ? extra.itemType : () => TypesEnum.ANY;
            extra.dimensions = extra.dimensions != null ? extra.dimensions : ArrayDimensionsEnum.ONE_DIMENSIONAL;
        }

        const array: Array<any> = [];
        let i: number = 0;
        for (let item of json) {

            if (context.deserializationOptions.typeCheck &&
                extra?.dimensions !== ArrayDimensionsEnum.ANY_DIMENSIONAL) {
                this.checkDimensions(extra.dimensions, item);
            }

            const childContext: DeserializationContext = context.child(i.toString());

            if (!Array.isArray(item)) {

                const itemType: Class|TypesEnum.ANY = extra?.itemType();
                if (itemType === TypesEnum.ANY || itemType == null) {
                    array.push(childContext.serializer.fromJson(item, null, null, extra?.itemExtra, childContext));
                }
                else {
                    array.push(childContext.serializer.fromJson(item, itemType, null, extra?.itemExtra, childContext));
                }
            }
            else {
                array.push(childContext.serializer.fromJson(item, Array, null, {...extra, dimensions: extra.dimensions - 1}, childContext));
            }

            i++;
        }

        return array;
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Array<any>, extra?: ArrayExtra, context?: SerializationContext): Array<any> {

        if (instance == null) {
            return instance === null ? null : undefined;
        }
        else if (instance.length === 0) {
            return [];
        }

        const jsonArray: Array<any> = [];
        let i: number = 0;
        for (let item of instance) {

            const childContext: SerializationContext = context.child(i.toString());
            jsonArray.push(childContext.serializer.toJson(item, null, null, childContext));

            i++;
        }

        return jsonArray;
    }
    //#endregion

    //#region Private Methods
    /**
     * Checks the number of dimensions of a given item.
     * @param dimensions The number of dimensions.
     * @param item The item to verify.
     *
     * @throws ArrayDimensionsOutOfRangeException - If wrong number of dimensions is detected.
     */
    private checkDimensions(dimensions: number, item: any): void {

        let pointer: any = item;
        for (let dimension: number = 1; dimension <= dimensions; dimension++) {

            // not last dimension, value should be an array and we update pointer
            if (dimension < dimensions) {

                if (!Array.isArray(pointer)) {
                    throw new ArrayDimensionsOutOfRangeException(dimensions, item);
                }

                pointer = pointer[0];
            }
            // last dimension, value should not be an array
            else if (Array.isArray(pointer)) {
                throw new ArrayDimensionsOutOfRangeException(dimension, item);
            }
        }
    }
    //#endregion
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
    dimensions?: ArrayDimensionsEnum | number;
}

export enum ArrayDimensionsEnum {

    ANY_DIMENSIONAL = Infinity,
    ONE_DIMENSIONAL = 1,
    TWO_DIMENSIONAL = 2,
    THREE_DIMENSIONAL = 3
}
