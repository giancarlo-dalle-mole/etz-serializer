import { TypesEnum } from "../enums";
import { Class } from "./class.type";

export type SerializableField<C = any, E = void> = {
    name: keyof C;
    type: () => Class|TypesEnum;
    groups?: Array<string>;
    extra?: E
}
