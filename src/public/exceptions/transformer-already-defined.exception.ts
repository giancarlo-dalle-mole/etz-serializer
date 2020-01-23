import { Exception } from "@enterprize/exceptions";

import { Class, ITransformer } from "../common";

/**
 * Ecxeption indicating that a given type/class already have an {@link ITransformer} defined and the
 * flag {@link TransformerOptions.override} was ``false``, disallowing Transformer override.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 23/01/2020
 */
export class TransformerAlreadyDefinedException extends Exception<TransformerAlreadyDefinedExceptionDetails> {

    constructor(details: TransformerAlreadyDefinedExceptionDetails) {
        super(`There is an transformer already defined for type "${details.type.name}"`, details);
    }
}

/**
 * Details of the {@link TransformerAlreadyDefinedException}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 23/01/2020
 */
export type TransformerAlreadyDefinedExceptionDetails = {

    /**
     * The type the {@link ITransformer} is responsible for transforming.
     */
    type: Class;
    /**
     * The {@link ITransformer} already defined.
     */
    definedTransformer: Class<ITransformer<any, any, any>>;
    /**
     * The {@link ITransformer} that was tried to register.
     */
    overrideTransformer: Class<ITransformer<any, any, any>>;
};
