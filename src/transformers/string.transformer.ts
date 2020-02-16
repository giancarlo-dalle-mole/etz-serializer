import { DeserializationContext, ITransformer, SerializationContext } from "../common";
import { Serializer } from "../services";

/**
 * Transformer for string primitives and {@link String} Wrappers. Intended to be used as a
 * {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class StringTransformer implements ITransformer<string|String, string, StringExtra> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: string, extra?: StringExtra, context?: DeserializationContext): string|String {

        if (json == null) {
            return json === null ? null : undefined;
        }

        if (extra != null && extra.isWrapper) {
            // noinspection JSPrimitiveTypeWrapperUsage
            return new String(json);
        }
        else {
            return json;
        }
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: string|String): string {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        if (instance instanceof String) {
            return instance.valueOf();
        }
        else {
            return instance;
        }
    }
    //#endregion
}

/**
 * Configuration to use with {@link StringTransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export type StringExtra = {
    /**
     * Flag to indicate that the attribute holds a String Wrapper instead of string primitive.
     */
    isWrapper: boolean;
};
