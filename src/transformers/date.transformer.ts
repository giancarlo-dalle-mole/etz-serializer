import { ITransformer } from "../common";
import { Serializer } from "../services";

export class DateTransformer implements ITransformer<Date, string> {

    public readJson(json: string, extra?: void, serializer?: Serializer): Date {
        return undefined;
    }

    public writeJson(instance: Date, extra?: void, serializer?: Serializer): string {
        return undefined;
    }
}
