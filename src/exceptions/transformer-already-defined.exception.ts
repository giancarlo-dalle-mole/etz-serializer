import { Exception } from "@enterprize/exceptions";

import { ITransformer, NewableClass } from "../common";

/**
 * Exception indicating that a given type/class already have an {@link ITransformer} defined and the
 * flag {@link TransformerOptions.override} was ``false``, disallowing Transformer override.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 23/01/2020
 */
export class TransformerAlreadyDefinedException extends Exception<TransformerAlreadyDefinedExceptionDetails> {

    constructor(type: NewableClass, definedTransformer: NewableClass<ITransformer<any, any, any>>,
                overrideTransformer: NewableClass<ITransformer<any, any, any>>) {
        super(
            `There is an transformer already defined for type "${type.name}"`,
            {
                type: type,
                definedTransformer: definedTransformer,
                overrideTransformer: overrideTransformer
            }
        );
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
    type: NewableClass;
    /**
     * The {@link ITransformer} already defined.
     */
    definedTransformer: NewableClass<ITransformer<any, any, any>>;
    /**
     * The {@link ITransformer} that was tried to register.
     */
    overrideTransformer: NewableClass<ITransformer<any, any, any>>;
};
