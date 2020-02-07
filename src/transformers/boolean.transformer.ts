import { ITransformer } from "../common";
import { Serializer } from "../services";

/**
 * Transformer for boolean primitives and {@link Boolean} Wrappers. Intended to be used as a
 * {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class BooleanTransformer implements ITransformer<boolean|Boolean, boolean, BooleanExtra> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: boolean, extra?: BooleanExtra, serializer?: Serializer): boolean|Boolean {

        if (json == null) {
            return json === null ? null : undefined;
        }

        if (extra != null && extra.isWrapper) {
            // noinspection JSPrimitiveTypeWrapperUsage
            return new Boolean(json);
        }
        else {
            return json;
        }
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: boolean|Boolean, extra?: BooleanExtra, serializer?: Serializer): boolean {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        if (instance instanceof Boolean) {
            return instance.valueOf();
        }
        else {
            return instance;
        }
    }
    //#endregion
}

/**
 * Configuration to use with {@link BooleanTransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export type BooleanExtra = {
    /**
     * Flag to indicate that the attribute holds a Boolean Wrapper instead of boolean primitive.
     */
    isWrapper: boolean;
};
