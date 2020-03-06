import { Exception } from "@enterprize/exceptions";
import { Class } from "../common";

/**
 * Exception indicating that a given type does not have an {@link ITransformer} defined.
 *
 * @sinceVersion 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 06/03/2020
 */
export class NoTransformerDefinedException extends Exception<NoTransformerDefinedExceptionDetails> {

    constructor(clazz: Class) {
        super(`There was no transformer defined for type "${clazz.constructor.name}"`);
    }
}

/**
 * Details of {@link NoTransformerDefinedException}.
 *
 * @sinceVersion 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 06/03/2020
 */
export type NoTransformerDefinedExceptionDetails = {

    /**
     * The class that does not have a transformer defined.
     */
    clazz: Class
}
