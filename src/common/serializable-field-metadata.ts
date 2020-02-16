import { TypesEnum } from "../enums";
import { Class } from "./class.type";

/**
 * Metadata of a serializable field. Holds information relative to field serialization such as field
 * name and field type. Used in the serialization/deserialization process.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export class SerializableFieldMetadata<E = void> {

    //#region Private Attributes
    /**
     * The typed wrapped of the field in a function to prevent TDZ errors. When requested the first time, will be
     * unwrapped to {@link unwrappedType} and set to null.
     */
    private wrappedType: () => Class|TypesEnum;
    /**
     * The unwrapped type of the field.
     */
    private unwrappedType: Class|TypesEnum;
    //#endregion

    //#region Public Attributes
    /**
     * Field name.
     */
    public readonly name: string;
    /**
     * List of groups that the field belongs.
     */
    public readonly groups: Array<string>;
    /**
     * Extra data to be passed to transformer.
     */
    public readonly extra: E;
    //#endregion

    //#region Constructor
    constructor(name: string, type: () => Class|TypesEnum, groups?: Array<string>, extra?: E) {

        this.name = name;
        this.wrappedType = type;
        this.groups = groups;
        this.extra = extra;
    }
    //#endregion

    //#rgion Getters
    /**
     * The type of the field.
     */
    public get type(): Class|TypesEnum {

        if (this.unwrappedType == null) {
            this.unwrappedType = this.wrappedType();
            this.wrappedType = null;
        }

        return this.unwrappedType;
    }
    //#endregion
}
