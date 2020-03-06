import { Exception } from "@enterprize/exceptions";
import { Json } from "../common";

/**
 * Exception indicating that during a deserialization a given JSON was serialized with a different
 * class version and could not be restored safely. This exception MAY be logged as a warning instead
 * of being thrown if {@link SerializerConfig.versionMismatchBehavior} is set to {@link BehaviorEnum.WARNING}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export class VersionMismatchException extends Exception<VersionMismatchExceptionDetails> {

    constructor(value: Json<any>, fqn: string, expectedVersion: number, currentVersion: number) {
        super(
            `Expected version of the type "${fqn}" is ${expectedVersion} but the current version was ${currentVersion}`,
            {
                value: value,
                fqn: fqn,
                expectedVersion: expectedVersion,
                currentVersion: currentVersion
            }
        );
    }

}

export type VersionMismatchExceptionDetails = {

    /**
     * The value that caused the exception during deserialization.
     */
    value: Json<any>;
    /**
     * The fully qualified name of the class that has a version mismatch.
     */
    fqn: string;
    /**
     * The expected class version to be used.
     */
    expectedVersion: number;
    /**
     * The class version of the value
     */
    currentVersion: number;
};
