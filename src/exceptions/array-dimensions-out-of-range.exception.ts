import { Exception } from "@enterprize/exceptions";

/**
 * Exception indicating that an Array has a different number of dimensions than expected.
 *
 * @sinceVersion 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 06/03/2020
 */
export class ArrayDimensionsOutOfRangeException extends Exception<ArrayDimensionsOutOfRangeExceptionDetails> {

    constructor(expectedDimensions: number, value: Array<any>) {
        super(
            `The expected number of dimensions for the Array is "${expectedDimensions}"`,
            {
                expectedDimensions: expectedDimensions,
                value: value
            }
        );
    }
}

/**
 * Details of {@link ArrayDimensionsOutOfRangeException}.
 *
 * @sinceVersion 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 06/03/2020
 */
export type ArrayDimensionsOutOfRangeExceptionDetails = {

    /**
     * Number of expected dimensions.
     */
    expectedDimensions: number;
    /**
     * The Array with different expected dimensions.
     */
    value: Array<any>
}
