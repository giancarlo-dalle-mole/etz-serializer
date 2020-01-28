import { Exception } from "@enterprize/exceptions";
import { Class } from "../common";

export class NoTransformerDefinedException extends Exception<NoTransformerDefinedExceptionDetails> {

    constructor(clazz: Class) {
        super(`There was no transformed defined for type "${clazz.constructor.name}"`);
    }
}

export type NoTransformerDefinedExceptionDetails = {

    clazz: Class
}
