import { Exception } from "@enterprize/exceptions";

/**
 * Exception indicating that a given object class cannot be assigned to the expected class.
 *
 * @version 1.0.0
 * @author Giacarlo Dalle Mole
 * @since 18/02/2020
 */
export class NotAssignableException extends Exception<NotAssignableExceptionDetails> {

    constructor(objectClassFqn: string, expectedClassFqn: string) {
        super(`NotAssignableException - ${objectClassFqn} is not assignable to ${expectedClassFqn}`, {
            objectClassFqn: objectClassFqn,
            expectedClassFqn: expectedClassFqn
        });
    }
}

/**
 * Details of {@link NotAssignableException}.
 *
 * @since 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 18/02/2020
 */
export type NotAssignableExceptionDetails = {

    /**
     * The object class fully qualified name.
     */
    objectClassFqn: string;
    /**
     * The expected class fully qualified name.
     */
    expectedClassFqn: string;
}
