import { ITransformer } from "../common";
import { Serializer } from "../services";

export class SetTransformer implements ITransformer<Set<any>, Array<any>> {

    public readJson(json: Array<any>, extra?: void, serializer?: Serializer): Set<any> {
        return undefined;
    }

    public writeJson(instance: Set<any>, extra?: void, serializer?: Serializer): Array<any> {
        return undefined;
    }
}
