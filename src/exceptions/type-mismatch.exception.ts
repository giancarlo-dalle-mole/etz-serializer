import { Exception } from "@enterprize/exceptions";
import { Class } from "../common";

/**
 * Exception indicating that a given value has an incompatible type during deserialization.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export class TypeMismatchException extends Exception<TypeMismatchExceptionDetails> {

    constructor(value: any, expectedType: Class<any>, valueType: Class<any>) {
        super(
            `The type "${valueType.name}" is not assignable to "${expectedType.name}"`,
            {
                value: value,
                expectedType: expectedType,
                valueType: valueType
            }
        );
    }
}

/**
 * Details of {@link TypeMismatchException}.
 *
 * @since 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export type TypeMismatchExceptionDetails = {

    /**
     * The value that caused the exception.
     */
    value: any;
    /**
     * The expected type.
     */
    expectedType: Class<any>;
    /**
     * The actual value type.
     */
    valueType: Class<any>
}
