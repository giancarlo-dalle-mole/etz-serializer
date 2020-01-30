import { ITransformer } from "../common";
import { Serializer } from "../services";

export class NumberTransformer implements ITransformer<number|Number, number|string, NumberExtra> {

    public readJson(json: number | string, extra?: NumberExtra, serializer?: Serializer): number | Number {
        return undefined;
    }

    public writeJson(instance: number | Number, extra?: NumberExtra, serializer?: Serializer): number | string {
        return undefined;
    }
}

export type NumberExtra = {
    isWrapper: boolean;
};
