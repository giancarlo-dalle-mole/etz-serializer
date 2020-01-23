import { Class } from "./class.type";
import { TransformerOptions } from "./transformer-options.type";
import { ITransformer } from "./transformer.interface";

export class RegisteredTransformerInfo {

    readonly transformer: Class<ITransformer<any, any, any>>;
    readonly options: TransformerOptions;

    constructor(transformer: Class<ITransformer<any, any, any>>, options: TransformerOptions) {
        this.transformer = transformer;
        this.options = options;
    }
}
