import { Exception } from "@enterprize/exceptions";

import { Class } from "../common";

/**
 * Exception indicating that a given class or value is not able to be serialized. This occurs if a
 * given value has an unknown type (not registered as serializable nor having a transformer) or if
 * the serializable class has the {@link SerializableOptions.defaultStrategy} set to ``false`` and
 * do not implement the {@link ISerializable} interface.
 *
 * @version 1.0.0
 * @author Giacarlo Dalle Mole
 * @since 24/01/2020
 */
export class NotSerializableException extends Exception<NotSerializableExceptionDetails> {

    //#region Public Attributes
    /**
     * The reason for the exception to be thrown.
     */
    public readonly reason: NotSerializableReasonEnum;
    //#endregion

    //#region Constructor
    constructor(value: Class, reason: NotSerializableReasonEnum.ISERIALIZABLE_REQUIRED);
    constructor(value: Object|number|string|boolean, reason: NotSerializableReasonEnum.UNKNOWN_TYPE);
    constructor(...args: [Class, NotSerializableReasonEnum.ISERIALIZABLE_REQUIRED]|[Object|number|string|boolean, NotSerializableReasonEnum.UNKNOWN_TYPE]) {

        let clazz: Class;
        let value: Object|number|string|boolean;
        let reason: NotSerializableReasonEnum = args[1];

        if (typeof args[0] === "function") {
            clazz = args[0] as Class;
            value = null;
        }
        else {
            clazz = (args[0] as Object|number|string|boolean).constructor as Class;
            value = args[0];
        }

        if (reason === NotSerializableReasonEnum.ISERIALIZABLE_REQUIRED) {

            super(`The class "${clazz.name}" has the "defaultStrategy" disabled but did not implement the "ISerializable" interface.`, {clazz: clazz});
        }
        else {
            super(`Unknown type "${clazz.name}". Did you forget to register a transformer or add the type as serializable?`, {clazz: clazz, value: value});
        }

        this.reason = reason;
    }
    //#endregion
}

/**
 * Enum with possible reasons for the exception to be thrown.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export enum NotSerializableReasonEnum {

    /**
     * Indicates that the class did not implement the {@link ISerializable} interface and its required.
     */
    ISERIALIZABLE_REQUIRED,
    /**
     * Indicates that the type is unknown to the serializer (no transformer or not registered as serializable).
     */
    UNKNOWN_TYPE
}

/**
 * Details of the {@link NotSerializableException}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export type NotSerializableExceptionDetails = {

    /**
     * The class/type not serializable.
     */
    clazz: Class;
    /**
     * The value that was tried to be serialized/deserialized.
     */
    value?: any;
};
