import { Exception } from "@enterprize/exceptions";

/**
 * Exception indicating that a given JSON pointer was not found in a given json document.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 18/02/2020
 */
export class UnknownJsonPointerException extends Exception<UnknownJsonPointerExceptionDetails> {

    constructor(pointer: string) {
        super(
            `The JSON pointer "${pointer}" does not exists in the document`,
            {
                pointer: pointer
            }
        );
    }
}

/**
 * Details of {@link UnknownJsonPointerException}.
 *
 * @since 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 18/02/2020
 */
export type UnknownJsonPointerExceptionDetails = {

    pointer: string;
}
