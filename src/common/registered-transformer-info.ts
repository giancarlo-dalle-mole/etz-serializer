import { NewableClass } from "./newable-class.type";
import { TransformerOptions } from "./transformer-options.type";
import { ITransformer } from "./transformer.interface";

/**
 * Information of a registered transformer. Contains the reference to the transformer and the options
 * to be used with it.
 *
 * @since 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export class RegisteredTransformerInfo {

    //#region Public Attributes
    /**
     * The registered transformer class.
     */
    public readonly transformer: NewableClass<ITransformer<any, any, any>>;
    /**
     * The options to be used with the transformer.
     */
    public readonly options: TransformerOptions;
    //#endregion

    //#region Constructor
    constructor(transformer: NewableClass<ITransformer<any, any, any>>, options: TransformerOptions) {

        this.transformer = transformer;
        this.options = options;
    }
    //#endregion
}
