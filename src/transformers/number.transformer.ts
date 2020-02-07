import { IllegalArgumentException } from "@enterprize/exceptions";

import { ITransformer } from "../common";
import { Serializer } from "../services";

/**
 * Transformer for number primitives and {@link Number} Wrappers. Intended to be used as a
 * {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class NumberTransformer implements ITransformer<number|Number, number|string, NumberExtra> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: number|string, extra?: NumberExtra, serializer?: Serializer): number|Number {

        if (json == null) {
            return json === null ? null : undefined;
        }

        let value: number;

        if (typeof json === "string") {

            switch (json) {
                case "NaN":
                    value = NaN;
                    break;
                case "-Infinity":
                    value = -Infinity;
                    break;
                case "Infinity":
                    value = Infinity;
                    break;
                default:
                    throw new IllegalArgumentException(`Expected a number or a valid string that represents a number ("NaN", "-Infinity" or "Infinity") but "${json}" was given`, "json", {value: json});
            }
        }
        else {
            value = json;
        }

        if (extra != null && extra.isWrapper) {
            // noinspection JSPrimitiveTypeWrapperUsage
            return new Number(value);
        }
        else {
            return value;
        }
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: number|Number, extra?: NumberExtra, serializer?: Serializer): number|string {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        let value: number;

        if (instance instanceof Number) {
            value = instance.valueOf();
        }
        else {
            value = instance;
        }

        if (Number.isNaN(value)) {
            return "NaN";
        }
        else if (!Number.isFinite(value)) {

            if (value > -Infinity) {
                return "Infinity";
            }
            else {
                return "-Infinity";
            }
        }
        else {
            return value;
        }
    }
    //#endregion
}

/**
 * Configuration to use with {@link NumberTransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export type NumberExtra = {
    /**
     * Flag to indicate that the attribute holds a Number Wrapper instead of number primitive.
     */
    isWrapper: boolean;
};
