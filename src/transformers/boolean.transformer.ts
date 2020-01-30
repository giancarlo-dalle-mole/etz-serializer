import { ITransformer } from "../common";
import { Serializer } from "../services";

export class BooleanTransformer implements ITransformer<boolean|Boolean, boolean, BooleanExtra> {

    constructor() {
    }

    public readJson(json: boolean, extra?: BooleanExtra, serializer?: Serializer): boolean | Boolean {
        return undefined;
    }

    public writeJson(instance: boolean | Boolean, extra?: BooleanExtra, serializer?: Serializer): boolean {
        return undefined;
    }
}


export type BooleanExtra = {
    isWrapper: boolean;
};
