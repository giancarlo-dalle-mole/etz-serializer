import { ITransformer, Json } from "../common";
import { Serializer } from "../services";

export class StringTransformer implements ITransformer<string|String, string, StringExtra> {

    constructor() {
    }

    /**
     * @inheritDoc
     * @param json
     * @param serializer
     * @param extra
     */
    public readJson(json: string, extra?: StringExtra, serializer?: Serializer): string | String {

        if (json == null) {
            return json === null ? null : undefined;
        }

        if (extra != null && extra.isWrapper) {
            // noinspection JSPrimitiveTypeWrapperUsage
            return new String(json);
        }
        else {
            return String(json);
        }
    }

    /**
     * @inheritDoc
     */
    public writeJson(instance: string | String, extra?: StringExtra, serializer?: Serializer): string {

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
}

export type StringExtra = {
    isWrapper: boolean;
};
