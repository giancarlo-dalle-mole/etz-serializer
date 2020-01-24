import { ITransformer, Json } from "../common";
import { Serializer } from "../services";

export class BooleanTransformer implements ITransformer<boolean|Boolean, boolean, BooleanExtra> {

    constructor() {
    }

    public readJson(json: Json<boolean | Boolean>, serializer: Serializer,
                    extra?: BooleanExtra): boolean | Boolean {
        return undefined;
    }

    public writeJson(instance: boolean | Boolean, serializer: Serializer,
                     extra?: BooleanExtra): Json<boolean | Boolean> {
        return undefined;
    }
}


export type BooleanExtra = {
    isWrapper: boolean;
};
