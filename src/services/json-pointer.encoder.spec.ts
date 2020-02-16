import "mocha";
import { expect } from "chai";

import { JsonPointerEncoder } from "./json-pointer-encoder";

describe("JsonPointerEncoder", () => {

    describe("Encode", () => {

        it("Encode /", () => {

            const value: string = "a/b";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("a~1b");
        });

        it("Encode //", () => {

            const value: string = "a//b";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("a~1~1b");
        });

        it("Encode ~", () => {

            const value: string = "m~n";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("m~0n");
        });

        it("Encode ~~", () => {

            const value: string = "m~~n";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("m~0~0n");
        });

        it("Encode / and ~", () => {

            const value: string = "a/b_m~n";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("a~1b_m~0n");

        });

        it("Encode ~ and /", () => {

            const value: string = "m~n_a/b";
            const valueEncoded: string = JsonPointerEncoder.encode(value);

            expect(valueEncoded).to.equal("m~0n_a~1b");
        });
    });

    describe("Decode", () => {

        it("Decode /", () => {

            const value: string = "a~1b";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("a/b");
        });

        it("Decode //", () => {

            const value: string = "a~1~1b";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("a//b");
        });

        it("Decode ~", () => {

            const value: string = "m~0n";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("m~n");
        });

        it("Decode ~~", () => {

            const value: string = "m~0~0n";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("m~~n");
        });

        it("Decode / and ~", () => {

            const value: string = "a~1b_m~0n";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("a/b_m~n");

        });

        it("Decode ~ and /", () => {

            const value: string = "m~0n_a~1b";
            const valueEncoded: string = JsonPointerEncoder.decode(value);

            expect(valueEncoded).to.equal("m~n_a/b");
        });
    });
});
