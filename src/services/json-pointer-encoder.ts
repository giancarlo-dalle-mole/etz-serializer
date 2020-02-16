import { IllegalArgumentException } from "@enterprize/exceptions";

/**
 * Static class responsible for encoding and decoding path elements of JSON pointers according to
 * [RFC 6901](https://tools.ietf.org/html/rfc6901).
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 14/02/2020
 */
export class JsonPointerEncoder {

    /**
     *
     */
    public static tokenMap: Map<string, string> = new Map<string, string>([
        ["/", "~1"],
        ["~", "~0"]
    ]);

    public static encode(value: string): string {

        if (value == null) {
            throw new IllegalArgumentException("The value to encode must not be null/undefined", "value");
        }

        let valueEncoded: string = "";

        for (let char of value) {
            if (this.tokenMap.has(char)) {
                valueEncoded += this.tokenMap.get(char);
            }
            else {
                valueEncoded += char;
            }
        }

        return valueEncoded;
    }

    public static decode(value: string): string {

        if (value == null) {
            throw new IllegalArgumentException("The value to decode must not be null/undefined", "value");
        }

        let valueDecoded: string = value;

        for (let tokenTuple of this.tokenMap.entries()) {
            valueDecoded = valueDecoded.replace(new RegExp(tokenTuple[1], "g"), tokenTuple[0]);
        }

        return valueDecoded;
    }
}
