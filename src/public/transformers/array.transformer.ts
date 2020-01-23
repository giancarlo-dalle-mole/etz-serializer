import { IllegalArgumentException } from "@enterprize/exceptions";
import { ITransformer, Json } from "../common";

export class ArrayTransformer implements ITransformer<Array<any>, Array<any>, ArrayExtra> {

    constructor() {
    }

    /**
     * @inheritDoc
     */
    public readJson<T>(defaultInstance: T, json: Json<T>, extra?: ArrayExtra): T {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    public writeJson<T>(defaultJson: Json<T>, instance: Json<T>, extra?: ArrayExtra): Json<T> {
        return undefined;
    }

    /**
     * Validates the "extra" options on {@link SerializeOptions}.
     * @param extra The extra options to validade/
     * @returns true if valid, throws exception otherwise.
     * @throws {@link IllegalArgumentException} - If any of the options are invalid.
     */
    public static validateExtra(extra: ArrayExtra): boolean {

        // No extra, defaults will be used.
        if (extra == null) {
            return  true;
        }

        if (extra.dimensions != null && extra.rangeDimensions != null) {
            throw new IllegalArgumentException("You SHOULD not set both \"dimensions\" and \" rangeDimensions\" at the same time", "extra", {value: extra});
        }

        // Validates the number of dimensions.
        if (extra.dimensions != null && !Number.isSafeInteger(extra.dimensions) && extra.dimensions < 0) {
            throw new IllegalArgumentException("\"dimensions\" MUST be a safe integer greater or equal than 0 (zero)", "dimensions", {value: extra.dimensions});
        }

        // if defined a range of dimensions
        if (extra.rangeDimensions != null) {

            if (extra.rangeDimensions.min > extra.rangeDimensions.max) {
                throw new IllegalArgumentException("\"rangeDimensions.min\" must be less than \"rangeDimensions.max\"", "extra.rangeDimensions", {value: extra.rangeDimensions})
            }

            if (!Number.isSafeInteger(extra.rangeDimensions.min) && extra.rangeDimensions.min <= 0) {
                throw new IllegalArgumentException("\"rangeDimensions.min\" MUST be a safe integer greater than 0 (zero)", "extra.rangeDimensions.min", {value: extra.rangeDimensions.min})
            }

            if (!Number.isSafeInteger(extra.rangeDimensions.max) && extra.rangeDimensions.max <= 0) {
                throw new IllegalArgumentException("\"rangeDimensions.max\" MUST be a safe integer greater than 0 (zero)", "extra.rangeDimensions.max", {value: extra.rangeDimensions.max})
            }
        }

        return true;
    }
}

export type ArrayExtra = {

    /**
     * (optional) Defines the number of dimensions of the array. Set this property to an {@link ArrayDimensionsEnum}
     * value or any natural number (N, integer greater or equal than 0) to customize the number of dimensions.
     * @default {@link ArrayDimensionsEnum.ONE_DIMENSIONAL}
     */
    dimensions?: ArrayDimensionsEnum|number;
    /**
     * (optional) Defines a range of number of dimensions of the array. Invalidates any {@link dimensions}
     * set previously.
     */
    rangeDimensions?: {
        /**
         * Minimum number of dimensions. MUST be less than max and a non zero natural number (N*).
         */
        min: ArrayDimensionsEnum|number;
        /**
         * Maximum number of dimensions. Must be greater than {@link min} and a non zero natural number
         * (N*).
         */
        max: ArrayDimensionsEnum|number;
    }
}

export enum ArrayDimensionsEnum {

    ANY_DIMENSIONAL = Infinity,
    ONE_DIMENSIONAL = 1,
    TWO_DIMENSIONAL = 2,
    THREE_DIMENSIONAL = 3
}
