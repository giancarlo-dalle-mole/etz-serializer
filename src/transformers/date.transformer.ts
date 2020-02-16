import { DeserializationContext, ITransformer, SerializationContext } from "../common";

/**
 * Transformer for {@link Date} objects. Intended to be used as a {@link #InstantiationPolicyEnum.SINGLETON SINGLETON}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 30/01/2020
 */
export class DateTransformer implements ITransformer<Date, string> {

    //#region Constructor
    constructor() {
    }
    //#endregion

    //#region ITransformer Methods
    /**
     * @inheritDoc
     */
    public readJson(json: string, extra?: void, context?: DeserializationContext): Date {

        if (json == null) {
            return json === null ? null : undefined;
        }

        return new Date(json);
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: Date, extra?: void, context?: SerializationContext): string {

        if (instance == null) {
            return instance === null ? null : undefined;
        }

        return instance.toISOString();
    }
    //#endregion
}
