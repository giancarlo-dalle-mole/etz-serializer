import { TypesEnum } from "../public/enums";
import { Class } from "../public/common";

export class SerializableFieldMetadata<E = void> {

    private readonly wrappedType: () => Class|TypesEnum;
    private unwrappedType: Class|TypesEnum;

    public readonly name: PropertyKey;

    public readonly groups: Array<string>;

    public readonly extra: E;

    constructor(name: PropertyKey, type: () => Class|TypesEnum, groups?: Array<string>, extra?: E) {

        this.name = name;
        this.wrappedType = type;
        this.groups = groups;
        this.extra = extra;
    }

    public get type(): Class|TypesEnum {

        if (this.unwrappedType == null) {
            this.unwrappedType = this.wrappedType();
        }

        return this.unwrappedType;
    }
}
