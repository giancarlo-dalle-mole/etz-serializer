import { Exception } from "@enterprize/exceptions";

import { Class } from "../common";

/**
 * Exception indicating that a given class or value is not able to be serialized. This occurs if a
 * given value has an unknown type (not registered as serializable nor having a transformer).
 *
 * @version 1.0.0
 * @author Giacarlo Dalle Mole
 * @since 24/01/2020
 */
export class NotSerializableException extends Exception<NotSerializableExceptionDetails> {

    //#region Constructor
    constructor(value: Object|number|string|boolean) {

        super(`Unknown type "${(value).constructor.name}". Did you forget to register a transformer or add the type as serializable?`, {clazz: (value).constructor, value: value});
    }
    //#endregion
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
