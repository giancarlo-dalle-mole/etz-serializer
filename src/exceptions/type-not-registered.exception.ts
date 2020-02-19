import { Exception } from "@enterprize/exceptions";

export class TypeNotRegisteredException extends Exception<TypeNotRegisteredExceptionDetails> {

    constructor(fqn: string) {
        super(`Type "${fqn}" was not found in the registry`, {fullyQualifiedName: fqn});
    }
}

export type TypeNotRegisteredExceptionDetails = {

    fullyQualifiedName: string;
}
